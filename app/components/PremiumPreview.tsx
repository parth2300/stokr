"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import {
  trackClickUpgrade,
  trackPremiumPreviewClick,
  trackPremiumPreviewSeen,
} from "../lib/analytics"

type PremiumPreviewProps = {
  ticker?: string
  source?: string
  showCoupon?: boolean
}

const premiumFeatures = [
  "Full 10-K and 10-Q breakdowns",
  "Complete risk factor analysis",
  "What changed from prior filings",
  "Bull vs bear case summaries",
  "Financial health insights",
  "Saved research history",
  "Unlimited AI reports",
]

export default function PremiumPreview({
  ticker,
  source = "stock_report",
  showCoupon = false,
}: PremiumPreviewProps) {
  const hasTrackedSeen = useRef(false)

  useEffect(() => {
    if (hasTrackedSeen.current) return

    hasTrackedSeen.current = true
    trackPremiumPreviewSeen(ticker, source)
  }, [source, ticker])

  function handleClick() {
    trackPremiumPreviewClick(ticker, source)
    trackClickUpgrade("premium_preview")
  }

  return (
    <section className="stokr-card mt-8 border-[#7C9DFF]/30 bg-[#111827]/90 p-5 shadow-[0_18px_80px_rgba(124,157,255,0.12)] sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
            Premium
          </p>

          <h2 className="mt-3 text-2xl font-bold text-white">
            Want the deeper version?
          </h2>

          <p className="mt-4 text-sm leading-6 text-[#A3AAB8]">
            Premium unlocks full filing breakdowns, risk factor analysis, what
            changed from prior filings, financial health insights, saved
            research history, and unlimited reports.
          </p>

          {showCoupon && (
            <p className="mt-4 rounded-xl border border-[#7C9DFF]/25 bg-[#7C9DFF]/10 px-4 py-3 text-sm font-medium text-[#DDE2FF]">
              Early users can try Premium with code 1MFREE.
            </p>
          )}

          <Link
            href="/pricing"
            onClick={handleClick}
            className="stokr-button-primary mt-6 inline-flex"
          >
            Unlock Premium
          </Link>
        </div>

        <ul className="grid gap-3 text-sm leading-6 text-slate-300 sm:grid-cols-2">
          {premiumFeatures.map((feature) => (
            <li
              key={feature}
              className="rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3"
            >
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
