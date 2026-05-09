"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ReactNode } from "react"

type InfoTooltipProps = {
  label: string
  children: ReactNode
}

export default function InfoTooltip({ label, children }: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLSpanElement | null>(null)
  const tooltipId = useId()

  useEffect(() => {
    if (!isOpen) return

    function handlePointerDown(event: MouseEvent) {
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
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  return (
    <span
      ref={wrapperRef}
      className="relative inline-flex align-middle"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        aria-label={label}
        aria-describedby={isOpen ? tooltipId : undefined}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        onFocus={() => setIsOpen(true)}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/[0.16] bg-[#151923] text-[11px] font-semibold leading-none text-[#A3AAB8] outline-none transition hover:border-[#7C8CFF]/60 hover:text-white focus-visible:ring-2 focus-visible:ring-[#7C8CFF]/60"
      >
        ?
      </button>

      {isOpen && (
        <span
          id={tooltipId}
          role="tooltip"
          className="absolute left-1/2 top-7 z-50 w-72 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-lg border border-white/[0.10] bg-[#11141C] p-3 text-left text-xs font-normal leading-5 text-[#D8DCE6] shadow-2xl sm:left-auto sm:right-0 sm:translate-x-0"
        >
          {children}
        </span>
      )}
    </span>
  )
}
