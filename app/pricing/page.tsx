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
    <main className="min-h-screen overflow-hidden bg-[#0F172A] text-white">
      <section className="relative min-h-screen px-6 py-5 md:px-10 lg:px-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_18%,rgba(255,138,101,0.32),transparent_38%),radial-gradient(circle_at_82%_70%,rgba(124,157,255,0.34),transparent_48%),radial-gradient(circle_at_32%_48%,rgba(124,157,255,0.12),transparent_45%)]" />
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <NavBar showSearch />

          <div className="py-16 text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#7C9DFF]">
              Pricing
            </p>

            <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Start free. Upgrade when you need unlimited research.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
              Free users can test stokr with weekly AI reports and a watchlist.
              Premium unlocks unlimited reports, deeper research, and the full
              dashboard.
            </p>
          </div>

          <div className="grid gap-8 pb-20 lg:grid-cols-2">
            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_0_18px_rgba(255,255,255,0.06)] backdrop-blur-xl">
              <h2 className="text-2xl font-bold">Free</h2>

              <p className="mt-2 text-slate-400">
                For casual stock checks before upgrading.
              </p>

              <div className="mt-8">
                <span className="text-5xl font-extrabold">$0</span>
                <span className="text-slate-400"> / month</span>
              </div>

              <ul className="mt-8 space-y-4 text-slate-300">
                <li>✓ 3 AI stock reports per week</li>
                <li>✓ Basic company summary</li>
                <li>✓ Basic stock price and daily change data</li>
                <li>✓ 1 watchlist</li>
                <li>✓ Unlimited stocks inside your watchlist</li>
                <li>✓ Cached stock data</li>
                <li>✓ Basic filing overview</li>
                <li className="text-slate-500">✕ No unlimited report access</li>
                <li className="text-slate-500">✕ No premium dashboard</li>
                <li className="text-slate-500">
                  ✕ No advanced saved research history
                </li>
                <li className="text-slate-500">✕ No priority processing</li>
              </ul>

              <Link
                href="/login"
                className="mt-8 block rounded-xl border border-white/20 px-5 py-3 text-center font-semibold text-white hover:bg-white/10"
              >
                Get Started
              </Link>
            </div>

            <div className="relative rounded-[32px] border border-[#7C9DFF]/70 bg-white/[0.06] p-8 shadow-[0_0_24px_rgba(124,157,255,0.18)] backdrop-blur-xl">
              <div className="absolute right-6 top-6 rounded-full bg-[#7C9DFF] px-4 py-1 text-sm font-semibold text-white">
                Best Value
              </div>

              <h2 className="text-2xl font-bold text-blue-100">Premium</h2>

              <p className="mt-2 text-slate-300">
                For users who want deeper, faster stock research.
              </p>

              <div className="mt-8">
                <span className="text-5xl font-extrabold">$9.99</span>
                <span className="text-slate-400"> / month</span>
              </div>

              <ul className="mt-8 space-y-4 text-slate-200">
                <li>✓ Unlimited AI stock reports</li>
                <li>✓ Full 10-K and 10-Q breakdowns</li>
                <li>✓ Complete risk factor analysis</li>
                <li>✓ “What changed” filing comparison</li>
                <li>✓ Financial health insights</li>
                <li>✓ Bull vs bear case summaries</li>
                <li>✓ Premium dashboard access</li>
                <li>✓ Unlimited watchlists</li>
                <li>✓ Unlimited stocks inside watchlists</li>
                <li>✓ Saved stock research history</li>
                <li>✓ Faster / priority processing</li>
              </ul>

              <button
                onClick={handleUpgrade}
                className="mt-8 block w-full rounded-xl bg-[#7C9DFF] px-5 py-3 text-center font-semibold text-white hover:bg-[#93B4FF]"
              >
                Upgrade to Premium
              </button>

              {!isLoggedIn && (
                <p className="mt-3 text-center text-sm text-slate-400">
                  You’ll need an account before upgrading.
                </p>
              )}
            </div>
          </div>

          <div className="mx-auto mb-20 max-w-3xl rounded-2xl border border-white/10 bg-black/20 p-5 text-center">
            <p className="text-sm leading-relaxed text-slate-300">
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