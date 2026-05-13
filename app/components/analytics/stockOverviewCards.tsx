"use client"

import { useEffect, useState } from "react"
import InfoTooltip from "@/app/components/ui/InfoTooltip"

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
  const hasPrice =
    typeof overview?.price === "number" && Number.isFinite(overview.price)
  const hasChange =
    typeof overview?.change === "number" && Number.isFinite(overview.change)

  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center gap-2">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#19C37D]">
          Stock overview
        </p>
        <InfoTooltip
          label="Explain stock overview"
          title="Market Snapshot"
          body="Shows available price, daily change, market cap, and the current stokr health score context."
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="stokr-card p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
          Price
        </p>

        <p className="mt-2 break-words text-2xl font-semibold text-white">
          {loading
            ? "Loading..."
            : error || !overview || !hasPrice
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
            : error || !overview || !hasChange
            ? "Pending"
            : `${isPositive ? "+" : ""}${overview.change.toFixed(2)} (${overview.changePercent || "pending"})`}
        </p>
        </div>

        <div className="stokr-card p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
          Market Cap
        </p>

        <p className="mt-2 break-words text-2xl font-semibold text-white">
          {loading
            ? "Loading..."
            : error || !overview
            ? "Pending live data"
            : overview.marketCap || "Pending live data"}
        </p>

        <p className="mt-1 text-sm text-slate-400">
          {error ? "Live market data pending" : "Cached market data"}
        </p>
        </div>

        <div className="stokr-card bg-[#151923] p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-[#DDE2FF]/80">
          Health Score
        </p>

        <p className="mt-2 break-words text-2xl font-semibold text-white">
          {fallbackHealthScore}/100
        </p>

        <p className="mt-1 text-sm text-[#DDE2FF]">{fallbackRating}</p>
        </div>
      </div>
    </section>
  )
}

