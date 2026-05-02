"use client"

import { useEffect, useState } from "react"

type StockOverview = {
  ticker: string
  price: number
  change: number
  changePercent: string
  marketCap: string
  companyName: string
  updatedAt: string
}

export default function StockOverviewCards({
  ticker,
  fallbackHealthScore,
  fallbackRating,
}: {
  ticker: string
  fallbackHealthScore: number
  fallbackRating: string
}) {
  const [overview, setOverview] = useState<StockOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadOverview() {
      try {
        setLoading(true)
        setError("")

        const res = await fetch(
          `/api/stock-overview?ticker=${ticker}`
        )

        const data = await res.json()

        if (!res.ok) {
          setError(data.error || "Could not load stock overview")
          return
        }

        setOverview(data)
      } catch {
        setError("Could not load stock overview")
      } finally {
        setLoading(false)
      }
    }

    loadOverview()
  }, [ticker])

  const isPositive = overview ? overview.change >= 0 : false

  return (
    <div className="mt-8 flex flex-wrap gap-4">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
          Price
        </p>

        <p className="mt-2 text-2xl font-bold text-white">
          {loading
            ? "Loading..."
            : error || !overview || overview.price === undefined
            ? "Pending live data"
            : `$${overview.price.toFixed(2)}`}
        </p>

        <p
          className={`mt-1 text-sm font-semibold ${
            isPositive ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {loading
            ? "Loading"
            : error || !overview || overview.change === undefined
            ? "Pending"
            : `${isPositive ? "+" : ""}${(overview.change || 0).toFixed(2)} (${overview.changePercent})`}
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
          Market Cap
        </p>

        <p className="mt-2 text-2xl font-bold text-white">
          {loading
            ? "Loading..."
            : error || !overview
            ? "Pending live data"
            : overview.marketCap}
        </p>

        <p className="mt-1 text-sm text-slate-400">
          {error ? "Live market data pending" : "Cached market data"}
        </p>
      </div>

      <div className="rounded-2xl border border-[#7C9DFF]/40 bg-[#7C9DFF]/10 px-5 py-4 backdrop-blur">
        <p className="text-xs uppercase tracking-[0.2em] text-blue-100/80">
          Health Score
        </p>

        <p className="mt-2 text-2xl font-bold text-white">
          {fallbackHealthScore}/100
        </p>

        <p className="mt-1 text-sm text-blue-100">{fallbackRating}</p>
      </div>
    </div>
  )
}