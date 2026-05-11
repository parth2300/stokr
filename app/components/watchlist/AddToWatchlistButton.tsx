"use client"

import Link from "next/link"
import { useState } from "react"
import { supabase } from "@/app/lib/supabase"
import { trackAddToWatchlist } from "@/app/lib/analytics"

type Watchlist = {
  id: string
  name: string
  is_default: boolean | null
}

type WatchlistItem = {
  id: string
  watchlist_id: string
  ticker: string
}

type AddToWatchlistButtonProps = {
  ticker: string
  companyName?: string | null
}

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

async function readApiError(res: Response) {
  const data = await res.json().catch(() => null)
  return data?.error || "Request failed"
}

export default function AddToWatchlistButton({
  ticker,
  companyName,
}: AddToWatchlistButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [requiresLogin, setRequiresLogin] = useState(false)

  async function handleAddToWatchlist() {
    setIsSaving(true)
    setMessage("")
    setError("")
    setRequiresLogin(false)

    try {
      const authHeader = await getAuthHeader()

      if (!authHeader) {
        setRequiresLogin(true)
        setIsOpen(true)
        return
      }

      const watchlistsRes = await fetch("/api/watchlists", {
        method: "GET",
        headers: authHeader,
      })

      if (!watchlistsRes.ok) {
        throw new Error(await readApiError(watchlistsRes))
      }

      const watchlistsData = await watchlistsRes.json()

      let watchlists = (watchlistsData.watchlists || []) as Watchlist[]
      const items = (watchlistsData.items || []) as WatchlistItem[]

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

        const createData = await createRes.json()
        watchlists = [createData.watchlist as Watchlist]
      }

      const targetWatchlist =
        watchlists.find((watchlist) => watchlist.is_default) || watchlists[0]

      if (!targetWatchlist) {
        throw new Error("No watchlist found.")
      }

      const normalizedTicker = ticker.trim().toUpperCase()

      const alreadyExists = items.some(
        (item) =>
          item.watchlist_id === targetWatchlist.id &&
          item.ticker.toUpperCase() === normalizedTicker
      )

      if (alreadyExists) {
        setMessage(`${normalizedTicker} is already in your Research Tracker.`)
        setIsOpen(true)
        return
      }

      let resolvedCompanyName = companyName || null

      if (!resolvedCompanyName) {
        const overviewRes = await fetch(
          `/api/stock-overview?ticker=${encodeURIComponent(normalizedTicker)}`
        )

        if (overviewRes.ok) {
          const overview = await overviewRes.json().catch(() => null)
          resolvedCompanyName = overview?.companyName || null
        }
      }

      const addRes = await fetch(`/api/watchlists/${targetWatchlist.id}/items`, {
        method: "POST",
        headers: {
          ...authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticker: normalizedTicker,
          companyName: resolvedCompanyName,
        }),
      })

      if (!addRes.ok) {
        throw new Error(await readApiError(addRes))
      }

      trackAddToWatchlist(normalizedTicker)
      setMessage(`${normalizedTicker} saved to Research Tracker.`)
      setIsOpen(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add stock.")
      setIsOpen(true)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="relative min-w-0">
      <button
        onClick={handleAddToWatchlist}
        disabled={isSaving}
        className="inline-flex min-h-11 max-w-full items-center justify-center gap-2 rounded-xl border border-white/[0.10] bg-[#0B0F16] px-4 py-2 text-sm font-bold text-[#DDE2FF] transition hover:bg-[#111722] disabled:cursor-not-allowed disabled:opacity-50 sm:px-5"
        title="Save to Research Tracker"
      >
        <span className="text-xl leading-none">+</span>
        <span className="truncate">{isSaving ? "Adding..." : "Research Tracker"}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-3 w-[min(18rem,calc(100vw-2rem))] rounded-xl border border-white/[0.10] bg-[#0B0F16] p-4 text-sm shadow-2xl max-sm:fixed max-sm:left-4 max-sm:right-4 max-sm:w-auto">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold text-white">
                {requiresLogin ? "Login Required" : error ? "Research Tracker Error" : "Research Tracker"}
              </p>

              <p
                className={`mt-2 leading-relaxed ${
                  error || requiresLogin ? "text-red-200" : "text-emerald-200"
                }`}
              >
                {requiresLogin
                  ? "Create or log in to an account to save stocks to your Research Tracker."
                  : error || message}
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg px-2 py-1 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              ×
            </button>
          </div>

          {requiresLogin && (
            <Link
              href="/login"
              className="stokr-button-primary mt-4"
            >
              Login
            </Link>
          )}

          {!requiresLogin && !error && (
            <Link
              href="/watchlist"
              className="stokr-button-primary mt-4"
            >
              Open Research Tracker
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

