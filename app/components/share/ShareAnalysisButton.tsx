"use client"

import { useState } from "react"
import { trackShareAnalysisOpen } from "@/app/lib/analytics"
import ShareAnalysisModal from "./ShareAnalysisModal"
import { canBuildShareCard, type ShareAnalysisReport } from "./shareUtils"

type ShareAnalysisButtonProps = {
  report: ShareAnalysisReport
  ticker?: string
  className?: string
}

export default function ShareAnalysisButton({
  report,
  ticker,
  className,
}: ShareAnalysisButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const normalizedTicker = ticker || report.ticker

  if (!canBuildShareCard({ ...report, ticker: normalizedTicker })) return null

  function openModal() {
    trackShareAnalysisOpen(normalizedTicker, "stock_report")
    setIsOpen(true)
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={
          className ||
          "inline-flex min-h-11 max-w-full items-center justify-center rounded-xl border border-white/[0.10] bg-[#151923] px-4 py-2 text-sm font-bold text-[#DDE2FF] transition hover:bg-[#191E29] sm:px-5"
        }
      >
        Share Analysis
      </button>

      <ShareAnalysisModal
        report={{ ...report, ticker: normalizedTicker }}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}
