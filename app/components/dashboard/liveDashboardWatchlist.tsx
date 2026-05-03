"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/app/lib/supabase"
import WatchlistOverview from "./watchlistOverview"
import { WatchlistStock } from "@/app/lib/dashboardTypes"

type Watchlist = {
  id: string
  user_id: string
  name: string
  description: string | null
  is_default: boolean | null
  created_at: string
  updated_at: string | null
}

type WatchlistItem = {
  id: string
  watchlist_id: string
  user_id: string
  ticker: string
  company_name: string | null
  notes: string | null
  created_at: string
}

type StockOverviewResponse = {
  ticker?: string
  price?: number
  change?: number
  changePercent?: string
  marketCap?: string
  companyName?: string
}

type SecMetricsResponse = {
  companyName?: string
  financialScore?: number
  valuationScore?: number
  finalFundamentalScore?: number
}

async function getAuthHeader() {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.access_token) {
    throw new Error("Missing auth session. Please log in again.")
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
  }
}

async function readApiError(res: Response) {
  const data = await res.json().catch(() => null)

  return data?.error || "Request failed"
}

function formatPrice(price?: number) {
  if (typeof price !== "number" || !Number.isFinite(price)) {
    return "Pending"
  }

  return `$${price.toFixed(2)}`
}

function formatDailyChange(change?: number, changePercent?: string) {
  if (typeof change !== "number" || !Number.isFinite(change) || !changePercent) {
    return "Pending"
  }

  return `${change >= 0 ? "+" : ""}${change.toFixed(2)} (${changePercent})`
}

function getDailyDirection(change?: number): "up" | "down" {
  if (typeof change !== "number" || !Number.isFinite(change)) {
    return "down"
  }

  return change >= 0 ? "up" : "down"
}

function getUpdatedLabel() {
  return "Live"
}

export default function LiveDashboardWatchlist() {
  const [stocks, setStocks] = useState<WatchlistStock[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [emptyMessage, setEmptyMessage] = useState("")

  useEffect(() => {
    loadDashboardWatchlist()
  }, [])

  async function loadDashboardWatchlist() {
    setIsLoading(true)
    setError("")
    setEmptyMessage("")

    try {
      const authHeader = await getAuthHeader()

      let watchlists: Watchlist[] = []
      let items: WatchlistItem[] = []

      const watchlistsRes = await fetch("/api/watchlists", {
        method: "GET",
        headers: authHeader,
      })

      if (!watchlistsRes.ok) {
        throw new Error(await readApiError(watchlistsRes))
      }

      const watchlistsData = await watchlistsRes.json()

      watchlists = (watchlistsData.watchlists || []) as Watchlist[]
      items = (watchlistsData.items || []) as WatchlistItem[]

      if (watchlists.length === 0) {
        const createRes = await fetch("/api/watchlists", {
          method: "POST",
          headers: {
            ...authHeader,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "My Watchlist",
            description: "Default watchlist",
            isDefault: true,
          }),
        })

        if (!createRes.ok) {
          throw new Error(await readApiError(createRes))
        }

        setStocks([])
        setEmptyMessage("Your default watchlist is ready. Add stocks from the Watchlist page.")
        return
      }

      const defaultWatchlist =
        watchlists.find((watchlist) => watchlist.is_default) || watchlists[0]

      const dashboardItems = items
        .filter((item) => item.watchlist_id === defaultWatchlist.id)
        .slice(0, 5)

      if (dashboardItems.length === 0) {
        setStocks([])
        setEmptyMessage("No stocks in your default watchlist yet.")
        return
      }

      const mappedStocks = await Promise.all(
        dashboardItems.map(async (item) => {
          const [overviewRes, metricsRes] = await Promise.all([
            fetch(`/api/stock-overview?ticker=${item.ticker}`, {
              cache: "no-store",
            }),
            fetch(`/api/sec/metrics?ticker=${item.ticker}`, {
              cache: "no-store",
            }),
          ])

          const overview = overviewRes.ok
            ? ((await overviewRes.json()) as StockOverviewResponse)
            : null

          const metrics = metricsRes.ok
            ? ((await metricsRes.json()) as SecMetricsResponse)
            : null

          const aiHealthScore =
            metrics?.finalFundamentalScore ||
            metrics?.financialScore ||
            0

          return {
            ticker: item.ticker,
            companyName:
              overview?.companyName ||
              metrics?.companyName ||
              item.company_name ||
              "Company name pending",
            price: formatPrice(overview?.price),
            dailyChange: formatDailyChange(overview?.change, overview?.changePercent),
            dailyChangeDirection: getDailyDirection(overview?.change),
            aiHealthScore,
            financialScore: metrics?.financialScore || 0,
            valuationScore: metrics?.valuationScore || 0,
            lastUpdated: getUpdatedLabel(),
          } satisfies WatchlistStock
        })
      )

      setStocks(mappedStocks)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load dashboard watchlist."
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <section className="rounded-[26px] border border-[#7C9DFF]/40 bg-white/[0.045] p-5 shadow-[0_0_20px_rgba(124,157,255,0.10)] backdrop-blur-xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
          Watchlist
        </p>

        <h2 className="mt-2 text-xl font-bold text-white">
          Loading Watchlist Overview
        </h2>

        <div className="mt-6 grid gap-3">
          <div className="h-12 animate-pulse rounded-xl bg-white/10" />
          <div className="h-12 animate-pulse rounded-xl bg-white/10" />
          <div className="h-12 animate-pulse rounded-xl bg-white/10" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="rounded-[26px] border border-red-400/30 bg-red-500/10 p-5 shadow-[0_0_20px_rgba(248,113,113,0.10)] backdrop-blur-xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-red-300">
          Watchlist Error
        </p>

        <h2 className="mt-2 text-xl font-bold text-white">
          Could not load watchlist
        </h2>

        <p className="mt-3 text-sm text-red-100">{error}</p>

        <button
          onClick={loadDashboardWatchlist}
          className="mt-5 rounded-xl border border-red-300/30 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-100 hover:bg-red-500/25"
        >
          Retry
        </button>
      </section>
    )
  }

  if (stocks.length === 0) {
    return (
      <section className="rounded-[26px] border border-[#7C9DFF]/40 bg-white/[0.045] p-5 shadow-[0_0_20px_rgba(124,157,255,0.10)] backdrop-blur-xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
          Watchlist
        </p>

        <h2 className="mt-2 text-xl font-bold text-white">
          Watchlist Overview
        </h2>

        <div className="mt-6 rounded-2xl border border-dashed border-[#7C9DFF]/35 bg-black/20 p-8 text-center">
          <p className="text-lg font-bold text-white">
            No watchlist stocks yet
          </p>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-400">
            {emptyMessage || "Add stocks to your watchlist to see them here."}
          </p>

          <a
            href="/watchlist"
            className="mt-5 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-bold text-[#0F172A] hover:bg-blue-100"
          >
            Open Watchlist
          </a>
        </div>
      </section>
    )
  }

  return <WatchlistOverview stocks={stocks} />
}