"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"
import type { ReactNode } from "react"

type TooltipPosition = {
  left: number
  top: number
  width: number
}

type InfoTooltipProps = {
  label: string
  title?: string
  body?: string
  children?: ReactNode
}

const VIEWPORT_GAP = 16
const DESKTOP_WIDTH = 320

export default function InfoTooltip({
  label,
  title,
  body,
  children,
}: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<TooltipPosition | null>(null)
  const wrapperRef = useRef<HTMLSpanElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const tooltipId = useId()

  const updatePosition = useCallback(() => {
    if (!buttonRef.current || typeof window === "undefined") return

    const buttonRect = buttonRef.current.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const isMobile = viewportWidth < 640
    const width = isMobile
      ? Math.max(0, viewportWidth - VIEWPORT_GAP * 2)
      : Math.min(DESKTOP_WIDTH, viewportWidth - VIEWPORT_GAP * 2)

    const desiredLeft = isMobile
      ? VIEWPORT_GAP
      : buttonRect.left + buttonRect.width / 2 - width / 2

    const belowTop = buttonRect.bottom + 8

    setPosition({
      left: Math.min(
        Math.max(VIEWPORT_GAP, desiredLeft),
        Math.max(VIEWPORT_GAP, viewportWidth - width - VIEWPORT_GAP)
      ),
      top: belowTop,
      width,
    })
  }, [])

  const openTooltip = useCallback(() => {
    updatePosition()
    setIsOpen(true)
  }, [updatePosition])

  useEffect(() => {
    if (!isOpen) return

    updatePosition()

    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("touchstart", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition, true)

    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("touchstart", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition, true)
    }
  }, [isOpen, updatePosition])

  const hasStructuredContent = title || body

  return (
    <span
      ref={wrapperRef}
      className="inline-flex shrink-0 align-middle"
      onMouseEnter={openTooltip}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-describedby={isOpen ? tooltipId : undefined}
        aria-expanded={isOpen}
        onClick={() => {
          if (isOpen) {
            setIsOpen(false)
            return
          }

          openTooltip()
        }}
        onFocus={openTooltip}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-white/[0.18] bg-[#0B0F16] text-[10px] font-semibold leading-none text-[#A3AAB8] outline-none transition hover:border-[#19C37D]/60 hover:bg-[#111722] hover:text-white focus-visible:ring-2 focus-visible:ring-[#19C37D]/45"
      >
        ?
      </button>

      {isOpen && position && (
        <span
          id={tooltipId}
          role="tooltip"
          className="fixed z-[100] max-h-[min(18rem,calc(100vh-2rem))] overflow-y-auto rounded-lg border border-white/[0.12] bg-[#05070A] p-3 text-left text-xs font-normal leading-5 text-[#D8DCE6] shadow-[0_18px_60px_rgba(0,0,0,0.34)]"
          style={{
            left: position.left,
            top: position.top,
            width: position.width,
          }}
        >
          {hasStructuredContent ? (
            <>
              {title && (
                <span className="block font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#19C37D]">
                  {title}
                </span>
              )}
              {body && (
                <span className="mt-2 block leading-5 text-[#CBD5E1]">
                  {body}
                </span>
              )}
            </>
          ) : (
            children
          )}
        </span>
      )}
    </span>
  )
}
