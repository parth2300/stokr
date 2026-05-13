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
  "Filing Delta / what changed",
  "Complete disclosed risk analysis",
  "Financial health deep dive",
  "Valuation context",
  "Full Source Trail / research receipts",
  "Saved research history",
  "Unlimited reports",
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
    <section className="stokr-card mt-8 border-white/[0.12] bg-[#151B23] p-5 sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="stokr-kicker">
            Full Research Desk
          </p>

          <h2 className="mt-3 text-2xl font-semibold text-white">
            Unlock the full filing-backed breakdown
          </h2>

          <p className="mt-4 text-sm leading-6 text-[#A3AAB8]">
            Starter Research helps you understand a company at a glance. Full
            Research Desk helps you inspect the evidence behind the company:
            filing context, Filing Delta, risk analysis, source trails,
            financial depth, and saved research history.
          </p>

          {showCoupon && (
            <p className="mt-4 rounded-lg border border-[#14B8A6]/25 bg-[#14B8A6]/10 px-4 py-3 text-sm font-medium text-[#DDE2FF]">
              Early users can try Full Research Desk with code 1MFREE.
            </p>
          )}

          <Link
            href="/pricing"
            onClick={handleClick}
            className="stokr-button-primary mt-6 inline-flex"
          >
            Unlock Full Research Desk
          </Link>
        </div>

        <ul className="grid gap-3 text-sm leading-6 text-slate-300 sm:grid-cols-2">
          {premiumFeatures.map((feature) => (
            <li
              key={feature}
              className="rounded-lg border border-white/[0.08] bg-black/20 px-4 py-3"
            >
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
