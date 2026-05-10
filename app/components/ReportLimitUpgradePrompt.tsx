"use client"

import Link from "next/link"
import { trackClickUpgrade } from "../lib/analytics"

export default function ReportLimitUpgradePrompt() {
  return (
    <section className="stokr-card mt-6 border-[#7C9DFF]/30 bg-[#111827]/90 p-6 text-left">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
        Weekly Limit
      </p>

      <h2 className="mt-3 text-2xl font-bold text-white">
        You&apos;ve used your free weekly reports
      </h2>

      <p className="mt-4 text-sm leading-6 text-[#A3AAB8]">
        Premium unlocks unlimited stock reports, full filing breakdowns, risk
        analysis, saved research history, and priority processing.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link
          href="/pricing"
          onClick={() => trackClickUpgrade("report_limit")}
          className="stokr-button-primary"
        >
          Upgrade to Premium
        </Link>

        <p className="text-sm text-[#A3AAB8]">
          Use code 1MFREE for your first month free.
        </p>
      </div>
    </section>
  )
}
