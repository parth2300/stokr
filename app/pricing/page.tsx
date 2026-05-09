"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import NavBar from "../components/navBar"
import { supabase } from "../lib/supabase"

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
              Start free. Upgrade when you need unlimited research.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#A3AAB8]">
              Free users can test stokr with weekly AI reports and a watchlist.
              Premium unlocks unlimited reports, deeper research, and the full
              dashboard.
            </p>
          </div>

          <div className="grid gap-6 pb-14 lg:grid-cols-2">
            <div className="stokr-card p-6 sm:p-8">
              <h2 className="text-2xl font-bold">Free</h2>

              <p className="mt-2 text-[#A3AAB8]">
                For casual stock checks before upgrading.
              </p>

              <div className="mt-8">
                <span className="text-5xl font-extrabold">$0</span>
                <span className="text-[#6F7685]"> / month</span>
              </div>

              <ul className="mt-8 space-y-3 text-sm leading-6 text-[#A3AAB8]">
                <li>Included: 3 AI stock reports per week</li>
                <li>Included: Basic company summary</li>
                <li>Included: Basic stock price and daily change data</li>
                <li>Included: 1 watchlist</li>
                <li>Included: Unlimited stocks inside your watchlist</li>
                <li>Included: Cached stock data</li>
                <li>Included: Basic filing overview</li>
                <li className="text-[#6F7685]">Not included: unlimited report access</li>
                <li className="text-[#6F7685]">Not included: premium dashboard</li>
                <li className="text-[#6F7685]">
                  Not included: advanced saved research history
                </li>
                <li className="text-[#6F7685]">Not included: priority processing</li>
              </ul>

              <Link href="/login" className="stokr-button-secondary mt-8 w-full">
                Get Started
              </Link>
            </div>

            <div className="stokr-card relative border-white/[0.14] bg-[#151923] p-6 sm:p-8">
              <div className="mb-6 inline-flex rounded-full border border-white/[0.10] bg-[#191E29] px-3 py-1 text-xs font-medium text-[#A3AAB8] sm:absolute sm:right-6 sm:top-6 sm:mb-0">
                Best Value
              </div>

              <h2 className="text-2xl font-bold text-[#F4F6FA]">Premium</h2>

              <p className="mt-2 text-[#A3AAB8]">
                For users who want deeper, faster stock research.
              </p>

              <div className="mt-8">
                <span className="text-5xl font-extrabold">$9.99</span>
                <span className="text-[#6F7685]"> / month</span>
              </div>

              <ul className="mt-8 space-y-3 text-sm leading-6 text-[#A3AAB8]">
                <li>Included: Unlimited AI stock reports</li>
                <li>Included: Full 10-K and 10-Q breakdowns</li>
                <li>Included: Complete risk factor analysis</li>
                <li>Included: What changed filing comparison</li>
                <li>Included: Financial health insights</li>
                <li>Included: Bull vs bear case summaries</li>
                <li>Included: Premium dashboard access</li>
                <li>Included: Unlimited watchlists</li>
                <li>Included: Unlimited stocks inside watchlists</li>
                <li>Included: Saved stock research history</li>
                <li>Included: Priority processing</li>
              </ul>

              <button onClick={handleUpgrade} className="stokr-button-primary mt-8 w-full">
                Upgrade to Premium
              </button>

              {!isLoggedIn && (
                <p className="mt-3 text-center text-sm text-[#6F7685]">
                  You will need an account before upgrading.
                </p>
              )}
            </div>
          </div>

          <div className="stokr-card-muted mx-auto mb-16 max-w-3xl p-5 text-center">
            <p className="text-sm leading-relaxed text-[#A3AAB8]">
              <span className="font-semibold text-white">Disclaimer:</span>{" "}
              stokr provides informational analysis only. It does not provide
              financial, investment, or trading advice.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
