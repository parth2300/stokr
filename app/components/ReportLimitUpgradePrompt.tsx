"use client"

import Link from "next/link"
import { trackClickUpgrade } from "../lib/analytics"

export default function ReportLimitUpgradePrompt() {
  return (
    <section className="stokr-card mt-6 border-white/[0.12] bg-[#111722] p-6 text-left">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#19C37D]">
        Weekly Limit
      </p>

      <h2 className="mt-3 text-2xl font-bold text-white">
        You&apos;ve used your Starter Research weekly reports
      </h2>

      <p className="mt-4 text-sm leading-6 text-[#A3AAB8]">
        Upgrade when you need the full filing-backed breakdown: unlimited
        reports, Filing Delta, complete disclosed risk analysis, valuation
        context, Source Trail, and saved research history.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link
          href="/pricing"
          onClick={() => trackClickUpgrade("report_limit")}
          className="stokr-button-primary"
        >
          Unlock Full Research Desk
        </Link>

        <p className="text-sm text-[#A3AAB8]">
          Use code 1MFREE for your first month free.
        </p>
      </div>
    </section>
  )
}
