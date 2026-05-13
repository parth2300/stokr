"use client"

import { useEffect, useRef, useState } from "react"
import { toPng } from "html-to-image"
import {
  trackShareAnalysisCopyLink,
  trackShareAnalysisDownload,
  trackShareAnalysisNativeShare,
  trackShareAnalysisTemplateSelected,
} from "@/app/lib/analytics"
import ShareCardPreview from "./ShareCardPreview"
import { SHARE_TEMPLATES, type ShareTemplate } from "./shareTemplates"
import {
  createShareCardData,
  getShareImageFilename,
  type ShareAnalysisReport,
} from "./shareUtils"

type ShareAnalysisModalProps = {
  report: ShareAnalysisReport
  isOpen: boolean
  onClose: () => void
}

async function dataUrlToFile(dataUrl: string, filename: string) {
  const blob = await fetch(dataUrl).then((res) => res.blob())
  return new File([blob], filename, { type: "image/png" })
}

export default function ShareAnalysisModal({
  report,
  isOpen,
  onClose,
}: ShareAnalysisModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<ShareTemplate>(SHARE_TEMPLATES[0])
  const [previewScale, setPreviewScale] = useState(0.3)
  const [status, setStatus] = useState("")
  const [isExporting, setIsExporting] = useState(false)
  const [canNativeShare] = useState(
    () => typeof navigator !== "undefined" && typeof navigator.share === "function"
  )
  const previewShellRef = useRef<HTMLDivElement | null>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const data = createShareCardData(report)

  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) return

    function updateScale() {
      const width = previewShellRef.current?.clientWidth || 360
      const widthScale = Math.max(0.14, (width - 28) / selectedTemplate.width)
      const heightScale = 640 / selectedTemplate.height
      setPreviewScale(Math.min(1, widthScale, heightScale))
    }

    updateScale()

    const resizeObserver =
      typeof ResizeObserver !== "undefined" && previewShellRef.current
        ? new ResizeObserver(updateScale)
        : null

    if (resizeObserver && previewShellRef.current) {
      resizeObserver.observe(previewShellRef.current)
    }

    window.addEventListener("resize", updateScale)

    return () => {
      resizeObserver?.disconnect()
      window.removeEventListener("resize", updateScale)
    }
  }, [isOpen, selectedTemplate])

  if (!isOpen) return null

  async function exportPng() {
    if (!cardRef.current) return

    setIsExporting(true)
    setStatus("")

    try {
      const filename = getShareImageFilename(data.ticker, selectedTemplate.id)
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 1,
        backgroundColor: "#0F172A",
        width: selectedTemplate.width,
        height: selectedTemplate.height,
      })

      const link = document.createElement("a")
      link.download = filename
      link.href = dataUrl
      link.click()

      trackShareAnalysisDownload(data.ticker, selectedTemplate.id)
      setStatus("Image download started.")
    } catch {
      setStatus("The browser blocked the image download. Try again or use Copy report link.")
    } finally {
      setIsExporting(false)
    }
  }

  async function copyReportLink() {
    const url = data.reportUrl || window.location.href

    try {
      await navigator.clipboard.writeText(url)
      trackShareAnalysisCopyLink(data.ticker)
      setStatus("Report link copied.")
    } catch {
      setStatus("Could not copy the report link from this browser.")
    }
  }

  async function nativeShare() {
    if (!navigator.share) return

    setIsExporting(true)
    setStatus("")

    try {
      const filename = getShareImageFilename(data.ticker, selectedTemplate.id)
      const dataUrl = cardRef.current
        ? await toPng(cardRef.current, {
            cacheBust: true,
            pixelRatio: 1,
            backgroundColor: "#0F172A",
            width: selectedTemplate.width,
            height: selectedTemplate.height,
          })
        : null
      const files = dataUrl ? [await dataUrlToFile(dataUrl, filename)] : []
      const shareData: ShareData = {
        title: `${data.ticker} stock analysis`,
        text: `${data.ticker} analysis snapshot from stokr.`,
        url: data.reportUrl || window.location.href,
      }

      if (files.length && navigator.canShare?.({ files })) {
        shareData.files = files
      }

      await navigator.share(shareData)
      trackShareAnalysisNativeShare(data.ticker, selectedTemplate.id)
      setStatus("Share sheet opened.")
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return
      setStatus("Native sharing is not available for this image in this browser.")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/75 px-4 py-5 backdrop-blur-sm sm:px-6">
      <div className="mx-auto flex min-h-full max-w-6xl items-center justify-center">
        <div className="w-full rounded-xl border border-white/[0.10] bg-[#0D1017] shadow-2xl">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/[0.08] p-5 sm:p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7C9DFF]">
                Share analysis
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">Share analysis</h2>
              <p className="mt-2 text-sm text-slate-400">
                Create a branded snapshot of this stock report.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
            >
              Close
            </button>
          </div>

          <div className="grid gap-6 p-5 lg:grid-cols-[330px_1fr] sm:p-6">
            <div>
              <p className="text-sm font-semibold text-white">Platform</p>
              <div className="mt-3 grid gap-2">
                {SHARE_TEMPLATES.map((template) => {
                  const isSelected = template.id === selectedTemplate.id

                  return (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => {
                        setSelectedTemplate(template)
                        setStatus("")
                        trackShareAnalysisTemplateSelected(data.ticker, template.id)
                      }}
                      className={`rounded-lg border p-3 text-left transition ${
                        isSelected
                          ? "border-[#7C9DFF]/70 bg-[#7C9DFF]/15 text-white"
                          : "border-white/[0.08] bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]"
                      }`}
                    >
                      <span className="block text-sm font-bold">{template.label}</span>
                      <span className="mt-1 block text-xs leading-relaxed text-slate-400">
                        {template.width}x{template.height}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="mt-5 grid gap-2">
                <button
                  type="button"
                  onClick={exportPng}
                  disabled={isExporting}
                  className="stokr-button-primary w-full"
                >
                  {isExporting ? "Preparing image..." : "Download image"}
                </button>

                {canNativeShare && (
                  <button
                    type="button"
                    onClick={nativeShare}
                    disabled={isExporting}
                    className="stokr-button-secondary w-full"
                  >
                    Share
                  </button>
                )}

                <button
                  type="button"
                  onClick={copyReportLink}
                  className="stokr-button-secondary w-full"
                >
                  Copy report link
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="stokr-button-secondary w-full"
                >
                  Close
                </button>
              </div>

              {status && (
                <p className="mt-4 rounded-lg border border-white/[0.08] bg-white/[0.04] p-3 text-sm leading-relaxed text-slate-300">
                  {status}
                </p>
              )}
            </div>

            <div ref={previewShellRef} className="min-w-0 rounded-xl border border-white/[0.08] bg-[#08090D] p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-white">Preview</p>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {selectedTemplate.label}
                </p>
              </div>

              <div className="stokr-scrollbar max-h-[680px] overflow-auto rounded-lg bg-black/25 p-3">
                <div
                  style={{
                    width: selectedTemplate.width * previewScale,
                    height: selectedTemplate.height * previewScale,
                    margin: "0 auto",
                  }}
                >
                  <div
                    style={{
                      transform: `scale(${previewScale})`,
                      transformOrigin: "top left",
                      width: selectedTemplate.width,
                      height: selectedTemplate.height,
                    }}
                  >
                    <ShareCardPreview
                      report={report}
                      template={selectedTemplate}
                      cardRef={cardRef}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
