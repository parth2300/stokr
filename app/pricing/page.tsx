"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import NavBar from "../components/navBar"
import { supabase } from "../lib/supabase"
import { trackBeginCheckout, trackClickUpgrade } from "../lib/analytics"

async function getAuthHeader() {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.access_token) {
    return null
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
  }
}

async function handleUpgrade() {
  trackClickUpgrade("pricing")

  const authHeader = await getAuthHeader()

  if (!authHeader) {
    window.location.href = "/login"
    return
  }

  const res = await fetch("/api/stripe/create-checkout-session", {
    method: "POST",
    headers: authHeader,
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    alert(data?.error || "Failed to start checkout.")
    return
  }

  if (data?.url) {
    trackBeginCheckout("premium")
    window.location.href = data.url
  }
}

export default function PricingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser()
      setIsLoggedIn(!!data.user)
    }

    checkUser()
  }, [])

  return (
    <main className="stokr-page">
      <section className="stokr-shell">
        <div className="stokr-bg" />

        <div className="stokr-container">
          <NavBar showSearch />

          <div className="py-12 text-center sm:py-16">
            <p className="stokr-kicker">Pricing</p>

            <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Start free. Upgrade when you need the full filing-backed breakdown.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#A3AAB8]">
              Free helps you understand a company at a glance. Premium helps
              you inspect the evidence behind the company: filings, risk
              context, Filing Delta, Source Trail, financial depth, and saved
              research history.
            </p>
          </div>

          <div className="grid items-stretch gap-6 pb-14 lg:grid-cols-2">
            <div className="stokr-card flex flex-col p-6 sm:p-8">
              <h2 className="text-2xl font-semibold">Starter Research</h2>

              <p className="mt-2 text-[#A3AAB8]">
                For understanding a company at a glance before deciding whether
                it deserves deeper research.
              </p>

              <div className="mt-8">
                <span className="text-5xl font-semibold">$0</span>
                <span className="text-[#6F7685]"> / month</span>
              </div>

              <ul className="mt-8 space-y-3 text-sm leading-6 text-[#CBD5E1]">
                <li>Company snapshot</li>
                <li>Basic summary</li>
                <li>Top risk preview</li>
                <li>Basic upside/downside thesis</li>
                <li>Limited source-backed insight</li>
                <li>3 source-backed reports per week</li>
                <li>1 Research Tracker</li>
                <li>Unlimited stocks inside your Research Tracker</li>
              </ul>

              <Link href="/login" className="stokr-button-secondary mt-auto w-full">
                Start Researching
              </Link>
            </div>

            <div className="stokr-card relative flex flex-col border-white/[0.12] bg-[#151B23] p-6 sm:p-8">
              <div className="mb-6 w-fit rounded-md border border-[#14B8A6]/25 bg-[#14B8A6]/10 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.16em] text-[#2DD4BF] sm:absolute sm:right-6 sm:top-6 sm:mb-0">
                Full desk
              </div>

              <h2 className="text-2xl font-semibold text-[#F4F6FA]">Full Research Desk</h2>

              <p className="mt-2 text-[#A3AAB8]">
                For users who want full filing breakdowns, risk context, Filing
                Delta, source trails, and saved research history.
              </p>

              <div className="mt-8">
                <span className="text-5xl font-semibold">$9.99</span>
                <span className="text-[#6F7685]"> / month</span>
              </div>

              <ul className="mt-8 space-y-3 text-sm leading-6 text-[#CBD5E1]">
                <li>Unlimited reports</li>
                <li>Full 10-K and 10-Q breakdowns</li>
                <li>Filing Delta / what changed</li>
                <li>Complete disclosed risk analysis</li>
                <li>Financial health deep dive</li>
                <li>Valuation context</li>
                <li>Full Source Trail / research receipts</li>
                <li>Saved research history</li>
                <li>Unlimited Research Trackers</li>
                <li>Unlimited stocks inside Research Trackers</li>
                <li>Priority processing</li>
              </ul>

              <button onClick={handleUpgrade} className="stokr-button-primary mt-auto w-full">
                Open Full Research Desk
              </button>

              {!isLoggedIn && (
                <p className="mt-3 text-center text-sm text-[#6F7685]">
                  You will need an account before upgrading.
                </p>
              )}
            </div>
          </div>

          <div className="stokr-card mb-14 p-5 sm:p-6">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="stokr-kicker">Report depth</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">
                  What changes when you upgrade
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#A3AAB8]">
                  Starter Research keeps the brief lightweight. Full Research
                  Desk opens the filing-backed layers behind the summary.
                </p>
                <Link href="/stocks/nvda-stock-analysis" className="stokr-button-secondary mt-5">
                  View full sample Premium report
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <ComparisonList
                  title="Starter Research"
                  items={[
                    "Company snapshot",
                    "Basic summary",
                    "Top risk preview",
                    "Basic upside/downside thesis",
                    "Limited source-backed insight",
                    "Limited weekly reports",
                  ]}
                />
                <ComparisonList
                  title="Full Research Desk"
                  highlight
                  items={[
                    "Full 10-K and 10-Q breakdowns",
                    "Filing Delta / what changed",
                    "Complete disclosed risk analysis",
                    "Financial health deep dive",
                    "Valuation context",
                    "Full Source Trail / research receipts",
                    "Saved research history",
                    "Unlimited reports",
                  ]}
                />
              </div>
            </div>
          </div>

          <div className="stokr-card-muted mx-auto mb-16 max-w-3xl p-5 text-center">
            <div className="mb-5 border-b border-white/[0.08] pb-5">
              <p className="text-sm font-semibold text-white">
                New to stock research?
              </p>

              <div className="mt-3 flex flex-wrap justify-center gap-3 text-sm">
                <Link
                  href="/blog/how-to-read-a-stock-analysis"
                  className="font-medium text-[#9AA6FF] hover:text-white"
                >
                  How to read a stock analysis
                </Link>

                <Link
                  href="/blog/what-is-a-10-k"
                  className="font-medium text-[#9AA6FF] hover:text-white"
                >
                  What is a 10-K?
                </Link>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-[#A3AAB8]">
              <span className="font-semibold text-white">Disclaimer:</span>{" "}
              stokr provides informational research tools only and does not
              provide financial advice.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

function ComparisonList({
  title,
  items,
  highlight = false,
}: {
  title: string
  items: string[]
  highlight?: boolean
}) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? "border-[#19C37D]/25 bg-[#19C37D]/10" : "border-white/[0.08] bg-black/20"}`}>
      <h3 className="font-semibold text-white">{title}</h3>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-[#CBD5E1]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
