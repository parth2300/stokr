"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "@/app/lib/supabase"
import WatchlistOverview from "./watchlistOverview"
import { WatchlistStock } from "@/app/lib/dashboardTypes"

type WatchlistOverviewResponse = {
  stocks: WatchlistStock[]
  message?: string
  watchlist?: {
    id: string
    name: string
  }
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
  const contentType = res.headers.get("content-type")

  if (contentType?.includes("application/json")) {
    const data = await res.json().catch(() => null)
    return data?.error || `Request failed with status ${res.status}`
  }

  const text = await res.text().catch(() => "")

  return text
    ? `Request failed with status ${res.status}: ${text.slice(0, 160)}`
    : `Request failed with status ${res.status}`
}

export default function LiveDashboardWatchlist() {
  const [stocks, setStocks] = useState<WatchlistStock[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadDashboardWatchlist()
  }, [])

  async function loadDashboardWatchlist() {
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

      setStocks(data.stocks || [])
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load Research Tracker."
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <section className="stokr-card p-5">
        <p className="stokr-kicker">
          Research Tracker
        </p>

        <h2 className="mt-2 text-xl font-bold text-white">
          Loading saved companies
        </h2>

        <div className="mt-6 grid gap-3">
          <div className="h-12 animate-pulse bg-[#222120]" />
          <div className="h-12 animate-pulse bg-[#161616]" />
          <div className="h-12 animate-pulse bg-[#222120]" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="border border-[#D63C2F]/35 bg-[#D63C2F]/10 p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-red-300">
          Research Tracker Error
        </p>

        <h2 className="mt-2 text-xl font-bold text-white">
          Could not load Research Tracker
        </h2>

        <p className="mt-3 text-sm text-red-100">{error}</p>

        <button
          onClick={loadDashboardWatchlist}
          className="stokr-button-danger mt-5"
        >
          Retry
        </button>
      </section>
    )
  }

  if (stocks.length === 0) {
    return (
      <section className="stokr-card p-5">
        <p className="stokr-kicker">
          Research Tracker
        </p>

        <h2 className="mt-2 text-xl font-bold text-white">
          Saved Companies
        </h2>

        <div className="mt-6 border border-dashed border-[#2E2D2A] bg-[#0C0C0C] p-8 text-center">
          <p className="text-lg font-bold text-white">
            No saved companies yet.
          </p>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#9A9690]">
            Save companies from any research brief to revisit them later.
          </p>

          <Link
            href="/watchlist"
            className="stokr-button-secondary mt-5"
          >
            View all saved companies
          </Link>
        </div>
      </section>
    )
  }

  return <WatchlistOverview stocks={stocks} />
}

