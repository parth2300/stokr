"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/app/lib/supabase"
import type { WatchlistStock } from "@/app/lib/dashboardTypes"

type WatchlistOverviewResponse = {
  stocks: WatchlistStock[]
}

type MovementStock = WatchlistStock & {
  percentChange: number
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

function parsePercentChange(value: string | undefined) {
  if (!value || value === "Pending") return null

  const match = value.match(/([-+]?\d+(?:\.\d+)?)%/)
  if (!match) return null

  const parsed = Number(match[1])
  return Number.isFinite(parsed) ? parsed : null
}

function formatPercent(value: number) {
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`
}

function percentClass(value: number) {
  if (value > 0) return "text-emerald-300"
  if (value < 0) return "text-red-300"
  return "text-[#CBD5E1]"
}

export default function LiveSavedCompanyMovement() {
  const [stocks, setStocks] = useState<WatchlistStock[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let ignore = false

    async function loadMovement() {
      setIsLoading(true)
      setError("")

      try {
        const authHeader = await getAuthHeader()
        const res = await fetch("/api/dashboard/watchlist-overview", {
          method: "GET",
          headers: authHeader,
        })

        if (!res.ok) {
          throw new Error(await readApiError(res))
        }

        const data = (await res.json()) as WatchlistOverviewResponse
        if (!ignore) setStocks(data.stocks || [])
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Movement data is not available yet.")
        }
      } finally {
        if (!ignore) setIsLoading(false)
      }
    }

    loadMovement()

    return () => {
      ignore = true
    }
  }, [])

  const movement = useMemo(() => {
    const available: MovementStock[] = []

    stocks.forEach((stock) => {
      const percentChange = parsePercentChange(stock.dailyChange)
      if (percentChange === null) return
      available.push({ ...stock, percentChange })
    })

    const unavailableCount = stocks.length - available.length
    const average =
      available.length > 0
        ? available.reduce((sum, stock) => sum + stock.percentChange, 0) / available.length
        : null
    const upCount = available.filter((stock) => stock.percentChange > 0).length
    const downCount = available.filter((stock) => stock.percentChange < 0).length
    const strongest = available.reduce<MovementStock | null>(
      (current, stock) => (!current || stock.percentChange > current.percentChange ? stock : current),
      null
    )
    const weakest = available.reduce<MovementStock | null>(
      (current, stock) => (!current || stock.percentChange < current.percentChange ? stock : current),
      null
    )

    return {
      available,
      unavailableCount,
      average,
      upCount,
      downCount,
      strongest,
      weakest,
    }
  }, [stocks])

  if (isLoading) {
    return (
      <section className="stokr-card p-5">
        <p className="stokr-kicker">Saved Company Movement</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="h-16 animate-pulse rounded-lg bg-white/[0.06]" />
          ))}
        </div>
      </section>
    )
  }

  if (error || movement.available.length === 0) {
    return (
      <section className="stokr-card p-5">
        <p className="stokr-kicker">Saved Company Movement</p>
        <h2 className="mt-2 text-xl font-semibold text-white">
          Movement data is not available yet.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#A7ADBA]">
          Open a company brief or revisit your Research Tracker when market data is available.
        </p>
      </section>
    )
  }

  return (
    <section className="stokr-card p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="stokr-kicker">Saved Company Movement</p>
          <h2 className="mt-2 text-xl font-semibold text-white">
            A quick read on how companies in your Research Tracker are moving today.
          </h2>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <MovementMetric
          label="Average saved company move today"
          value={movement.average === null ? "Not available" : formatPercent(movement.average)}
          tone={movement.average ?? 0}
        />
        <MovementMetric label="Companies up" value={String(movement.upCount)} />
        <MovementMetric label="Companies down" value={String(movement.downCount)} />
        <MovementMetric
          label="Strongest mover"
          value={
            movement.strongest
              ? `${movement.strongest.ticker} ${formatPercent(movement.strongest.percentChange)}`
              : "Not available"
          }
          tone={movement.strongest?.percentChange}
        />
        <MovementMetric
          label="Weakest mover"
          value={
            movement.weakest
              ? `${movement.weakest.ticker} ${formatPercent(movement.weakest.percentChange)}`
              : "Not available"
          }
          tone={movement.weakest?.percentChange}
        />
      </div>

      <div className="mt-5 divide-y divide-white/[0.07] border-y border-white/[0.07]">
        {movement.available.map((stock) => {
          const width = `${Math.min(Math.abs(stock.percentChange) * 8, 100)}%`
          const hasCompanyName = stock.companyName && stock.companyName !== "Company name pending"

          return (
            <div
              key={stock.ticker}
              className="grid gap-3 py-3 sm:grid-cols-[minmax(0,1fr)_minmax(120px,220px)_auto] sm:items-center"
            >
              <div className="min-w-0">
                <p className="font-mono text-sm font-semibold text-white">{stock.ticker}</p>
                {hasCompanyName && (
                  <p className="mt-1 break-words text-xs text-[#7B8494]">{stock.companyName}</p>
                )}
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/[0.08]">
                <div
                  className={`h-full rounded-full ${stock.percentChange >= 0 ? "bg-emerald-400/70" : "bg-red-400/70"}`}
                  style={{ width }}
                />
              </div>

              <p className={`text-sm font-semibold sm:text-right ${percentClass(stock.percentChange)}`}>
                {formatPercent(stock.percentChange)}
              </p>
            </div>
          )
        })}
      </div>

      {movement.unavailableCount > 0 && (
        <p className="mt-4 text-xs text-[#7B8494]">
          Movement data unavailable for some saved companies.
        </p>
      )}
    </section>
  )
}

function MovementMetric({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone?: number
}) {
  return (
    <div className="rounded-lg border border-white/[0.08] bg-black/20 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7B8494]">
        {label}
      </p>
      <p className={`mt-2 text-lg font-semibold ${tone === undefined ? "text-white" : percentClass(tone)}`}>
        {value}
      </p>
    </div>
  )
}
