"use client"

import Link from "next/link"
import { FormEvent, useEffect, useMemo, useState } from "react"
import {
  trackCompareLimitReached,
  trackComparePageView,
  trackCompareStocksSubmit,
  trackCompareUpgradeClick,
} from "../lib/analytics"
import { getUserAccessTier, type PremiumProfile } from "../lib/premium"
import { supabase } from "../lib/supabase"

type ComparisonStock = {
  ticker: string
  hasData: boolean
  companyName?: string | null
  summary?: string | null
  overallScore?: number | null
  financialHealth?: string | null
  bullCase?: string[]
  bearCase?: string[]
  topRisks?: string[]
  filingHighlights?: string[]
  whatChanged?: string[]
  reportUrl?: string
}

type ComparisonResponse = {
  stocks?: ComparisonStock[]
  error?: string
}

type Profile = PremiumProfile & {
  id: string
}

const FREE_WEEKLY_COMPARISON_LIMIT = 3
const LIMIT_STORAGE_KEY = "stokr_compare_usage_v1"

function normalizeTicker(value: string) {
  return value.trim().toUpperCase().replace(/[^A-Z0-9.-]/g, "")
}

function getWeekKey() {
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), 0, 1)
  const dayOffset = Math.floor((now.getTime() - firstDay.getTime()) / 86400000)
  const week = Math.floor((dayOffset + firstDay.getDay()) / 7)

  return `${now.getFullYear()}-${week}`
}

function readComparisonUsage() {
  if (typeof window === "undefined") return { weekKey: getWeekKey(), count: 0 }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(LIMIT_STORAGE_KEY) || "{}")
    const weekKey = getWeekKey()

    if (parsed.weekKey !== weekKey) return { weekKey, count: 0 }

    return {
      weekKey,
      count: Number(parsed.count) || 0,
    }
  } catch {
    return { weekKey: getWeekKey(), count: 0 }
  }
}

function writeComparisonUsage(count: number) {
  window.localStorage.setItem(
    LIMIT_STORAGE_KEY,
    JSON.stringify({ weekKey: getWeekKey(), count })
  )
}

function TextList({
  items,
  emptyText,
}: {
  items?: string[]
  emptyText: string
}) {
  const visibleItems = items?.filter(Boolean).slice(0, 4) || []

  if (visibleItems.length === 0) {
    return <p className="text-sm leading-6 text-slate-400">{emptyText}</p>
  }

  return (
    <ul className="space-y-3 text-sm leading-6 text-slate-300">
      {visibleItems.map((item) => (
        <li key={item} className="rounded-lg border border-white/[0.08] bg-black/15 p-3">
          {item}
        </li>
      ))}
    </ul>
  )
}

function ComparisonColumn({ stock }: { stock: ComparisonStock }) {
  const reportHref = stock.reportUrl || `/stocks/${stock.ticker.toLowerCase()}`

  if (!stock.hasData) {
    return (
      <div className="stokr-card flex min-h-[420px] flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="stokr-kicker">{stock.ticker}</p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              {stock.companyName || stock.ticker}
            </h2>
          </div>
          <span className="rounded-full border border-white/[0.10] bg-white/[0.04] px-3 py-1 text-xs font-semibold text-slate-300">
            No cached data
          </span>
        </div>

        <div className="mt-8 rounded-xl border border-white/[0.08] bg-black/20 p-5">
          <p className="text-sm leading-6 text-slate-300">
            We do not have enough cached report data for this comparison yet. Generate a report for this stock first.
          </p>
        </div>

        <Link href={reportHref} className="stokr-button-secondary mt-auto">
          Generate or view report
        </Link>
      </div>
    )
  }

  return (
    <div className="stokr-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="stokr-kicker">{stock.ticker}</p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            {stock.companyName || stock.ticker}
          </h2>
        </div>

        <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full border border-[#7C9DFF]/40 bg-[#7C9DFF]/10 text-center">
          <p className="text-2xl font-black text-white">
            {stock.overallScore === null || stock.overallScore === undefined
              ? "N/A"
              : `${stock.overallScore}`}
          </p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#DDE2FF]">
            Overall Score
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <section>
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-[#7C9DFF]">
            Company overview
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {stock.summary || "Company overview unavailable in the cached report."}
          </p>
        </section>

        <section>
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-[#7C9DFF]">
            Financial health summary
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {stock.financialHealth || "Financial health summary unavailable in the cached report."}
          </p>
        </section>

        <section>
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-300">
            Bull case
          </h3>
          <div className="mt-3">
            <TextList
              items={stock.bullCase}
              emptyText="Bull case unavailable in the cached report."
            />
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-red-300">
            Bear case
          </h3>
          <div className="mt-3">
            <TextList
              items={stock.bearCase}
              emptyText="Bear case unavailable in the cached report."
            />
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">
            Top risks
          </h3>
          <div className="mt-3">
            <TextList
              items={stock.topRisks}
              emptyText="Risk summary unavailable in the cached report."
            />
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-[#7C9DFF]">
            Filing highlights
          </h3>
          <div className="mt-3">
            <TextList
              items={stock.filingHighlights}
              emptyText="Filing highlights unavailable in the cached report."
            />
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-[#7C9DFF]">
            What changed
          </h3>
          <div className="mt-3">
            <TextList
              items={stock.whatChanged}
              emptyText="Prior filing change summary unavailable in the cached report."
            />
          </div>
        </section>

        <Link href={reportHref} className="stokr-button-secondary w-full">
          View full report
        </Link>
      </div>
    </div>
  )
}

export default function CompareStocksClient() {
  const [tickerA, setTickerA] = useState("NVDA")
  const [tickerB, setTickerB] = useState("AMD")
  const [stocks, setStocks] = useState<ComparisonStock[]>([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [accessTier, setAccessTier] = useState("free")
  const [comparisonCount, setComparisonCount] = useState(() => readComparisonUsage().count)
  const [limitReached, setLimitReached] = useState(false)

  const isPremiumAccess = accessTier === "premium" || accessTier === "pro" || accessTier === "admin"
  const remainingComparisons = useMemo(
    () => Math.max(FREE_WEEKLY_COMPARISON_LIMIT - comparisonCount, 0),
    [comparisonCount]
  )

  useEffect(() => {
    trackComparePageView()

    async function loadAccessTier() {
      const { data } = await supabase.auth.getUser()
      const user = data.user

      if (!user) {
        setAccessTier("free")
        return
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select(
          "id, plan, access_tier, is_premium_override, premium_override_until, subscription_status, subscription_current_period_end"
        )
        .eq("id", user.id)
        .maybeSingle()

      const profile = profileData as Profile | null
      setAccessTier(getUserAccessTier(profile))
    }

    void loadAccessTier()
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedA = normalizeTicker(tickerA)
    const normalizedB = normalizeTicker(tickerB)

    if (!normalizedA || !normalizedB) {
      setError("Enter two tickers to compare.")
      return
    }

    if (normalizedA === normalizedB) {
      setError("Choose two different tickers.")
      return
    }

    // TODO: Move comparison limit enforcement to a server-side Supabase-backed usage table.
    const usage = readComparisonUsage()
    const latestProfileTier = accessTier
    const hasPremiumAccess = latestProfileTier !== "free"

    if (!hasPremiumAccess && usage.count >= FREE_WEEKLY_COMPARISON_LIMIT) {
      setComparisonCount(usage.count)
      setLimitReached(true)
      trackCompareLimitReached(normalizedA, normalizedB)
      return
    }

    setIsLoading(true)
    setLimitReached(false)
    setError("")

    try {
      const res = await fetch(
        `/api/compare?tickerA=${encodeURIComponent(normalizedA)}&tickerB=${encodeURIComponent(normalizedB)}`,
        { cache: "no-store" }
      )
      const data = (await res.json().catch(() => null)) as ComparisonResponse | null

      if (!res.ok) {
        throw new Error(data?.error || "Failed to load comparison data.")
      }

      setStocks(data?.stocks || [])
      trackCompareStocksSubmit(normalizedA, normalizedB, latestProfileTier)

      if (!hasPremiumAccess) {
        const nextCount = usage.count + 1
        writeComparisonUsage(nextCount)
        setComparisonCount(nextCount)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load comparison data.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="py-12 sm:py-16">
      <section className="grid gap-8 lg:grid-cols-[1fr_0.82fr] lg:items-start">
        <div>
          <p className="stokr-kicker">Interactive Research</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Compare Stocks
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[#A3AAB8] sm:text-lg">
            Compare two companies side by side using stokr&apos;s filing-first research summaries.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="stokr-card p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-white">Ticker A</span>
              <input
                value={tickerA}
                onChange={(event) => setTickerA(event.target.value.toUpperCase())}
                placeholder="NVDA"
                className="mt-2 h-12 w-full rounded-lg border border-white/[0.10] bg-[#08090D] px-4 text-sm font-semibold text-white outline-none placeholder:text-slate-500 focus:border-[#7C9DFF]/60"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-white">Ticker B</span>
              <input
                value={tickerB}
                onChange={(event) => setTickerB(event.target.value.toUpperCase())}
                placeholder="AMD"
                className="mt-2 h-12 w-full rounded-lg border border-white/[0.10] bg-[#08090D] px-4 text-sm font-semibold text-white outline-none placeholder:text-slate-500 focus:border-[#7C9DFF]/60"
              />
            </label>
          </div>

          <button type="submit" disabled={isLoading} className="stokr-button-primary mt-5 w-full">
            {isLoading ? "Comparing..." : "Compare stocks"}
          </button>

          <p className="mt-3 text-xs leading-5 text-slate-500">
            {isPremiumAccess
              ? "Premium access includes unlimited comparisons."
              : `${remainingComparisons} free weekly comparisons remaining on this device.`}
          </p>

          {error && (
            <p className="mt-4 rounded-lg border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-100">
              {error}
            </p>
          )}
        </form>
      </section>

      {limitReached && (
        <section className="stokr-card mt-8 border-[#7C9DFF]/30 p-6">
          <p className="stokr-kicker">Premium</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            You&apos;ve used your free weekly comparisons
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            Premium unlocks unlimited stock comparisons, full filing breakdowns, risk analysis, saved research history, and priority processing.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Early users can try Premium with code 1MFREE, while available.
          </p>
          <Link
            href="/pricing"
            onClick={() => trackCompareUpgradeClick()}
            className="stokr-button-primary mt-5"
          >
            Upgrade to Premium
          </Link>
        </section>
      )}

      {stocks.length > 0 && (
        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          {stocks.map((stock) => (
            <ComparisonColumn key={stock.ticker} stock={stock} />
          ))}
        </section>
      )}

      <section className="mt-10 grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="stokr-card-muted p-5">
          <h2 className="text-xl font-bold text-white">Learn how to compare stocks</h2>
          <div className="mt-4 grid gap-3">
            {[
              ["/blog/how-to-compare-two-stocks", "How to Compare Two Stocks"],
              ["/blog/how-to-research-a-stock-before-buying", "How to Research a Stock Before Buying"],
              ["/blog/bull-case-vs-bear-case", "Bull Case vs Bear Case"],
              ["/blog/how-to-use-risk-factors", "How to Use Risk Factors"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="text-sm font-semibold text-[#9AA6FF] hover:text-white">
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="stokr-card-muted p-5">
          <h2 className="text-xl font-bold text-white">Popular stock reports</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {["NVDA", "AAPL", "MSFT", "TSLA", "AMZN"].map((ticker) => (
              <Link
                key={ticker}
                href={`/stocks/${ticker.toLowerCase()}`}
                className="rounded-full border border-white/[0.10] bg-[#151923] px-4 py-2 text-sm font-semibold text-[#DDE2FF] hover:bg-[#191E29]"
              >
                {ticker}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="stokr-card-muted mt-8 p-5">
        <p className="text-sm leading-6 text-slate-300">
          stokr provides informational research tools only and does not provide financial advice.
        </p>
      </section>
    </div>
  )
}
