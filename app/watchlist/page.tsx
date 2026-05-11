"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import NavBar from "../components/navBar"
import { supabase } from "../lib/supabase"
import { PremiumProfile, isUserPremium } from "../lib/premium"
import { canCreateWatchlist, getWatchlistLimitLabel } from "../lib/watchlistLimits"
import { isValidTicker, normalizeTicker } from "../lib/validation"

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

type StockOverview = {
  ticker: string
  price: number
  change: number
  changePercent: string
  marketCap: string
  companyName: string
  updatedAt: string
  source?: "finnhub" | "cache"
}

type Profile = PremiumProfile & {
  id: string
  email?: string | null
  username?: string | null
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
  if (typeof price !== "number" || !Number.isFinite(price)) return "Not available"
  return `$${price.toFixed(2)}`
}

function formatChange(change?: number, changePercent?: string) {
  if (typeof change !== "number" || !Number.isFinite(change) || !changePercent) {
    return "Not available"
  }

  return `${change >= 0 ? "+" : ""}${change.toFixed(2)} (${changePercent})`
}

function getChangeClass(change?: number) {
  if (typeof change !== "number" || !Number.isFinite(change)) return "text-[#A7ADBA]"
  return change >= 0 ? "text-emerald-300" : "text-red-300"
}

function formatDateTime(value?: string | null) {
  if (!value) return "Not available"

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Not available"

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function getStockAnalysisHref(ticker: string) {
  return `/stocks/${ticker.trim().toLowerCase()}-stock-analysis`
}

function getTrackerName(watchlist?: Watchlist | null) {
  if (!watchlist) return "Research Tracker"
  if (watchlist.is_default || watchlist.name.toLowerCase() === "my watchlist") {
    return "Research Tracker"
  }
  return watchlist.name
}

export default function WatchlistPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [watchlists, setWatchlists] = useState<Watchlist[]>([])
  const [items, setItems] = useState<WatchlistItem[]>([])
  const [selectedWatchlistId, setSelectedWatchlistId] = useState<string | null>(null)
  const [stockOverviewByTicker, setStockOverviewByTicker] = useState<Record<string, StockOverview>>({})

  const [tickerInput, setTickerInput] = useState("")
  const [newWatchlistName, setNewWatchlistName] = useState("")
  const [savedCompanyFilter, setSavedCompanyFilter] = useState("")

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isMarketDataLoading, setIsMarketDataLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const premium = isUserPremium(profile)

  const selectedWatchlist = useMemo(() => {
    return watchlists.find((watchlist) => watchlist.id === selectedWatchlistId) || null
  }, [watchlists, selectedWatchlistId])

  const selectedItems = useMemo(() => {
    if (!selectedWatchlistId) return []

    return items
      .filter((item) => item.watchlist_id === selectedWatchlistId)
      .sort((a, b) => a.ticker.localeCompare(b.ticker))
  }, [items, selectedWatchlistId])

  const filteredSelectedItems = useMemo(() => {
    const query = savedCompanyFilter.trim().toLowerCase()
    if (!query) return selectedItems

    return selectedItems.filter((item) => {
      const overview = stockOverviewByTicker[item.ticker]
      const companyName = overview?.companyName || item.company_name || ""

      return (
        item.ticker.toLowerCase().includes(query) ||
        companyName.toLowerCase().includes(query)
      )
    })
  }, [savedCompanyFilter, selectedItems, stockOverviewByTicker])

  const selectedTickers = useMemo(() => {
    return Array.from(new Set(selectedItems.map((item) => item.ticker)))
  }, [selectedItems])

  const createLimit = canCreateWatchlist({
    profile,
    currentWatchlistCount: watchlists.length,
  })

  const totalSavedCompanies = items.length

  const lastUpdated = useMemo(() => {
    const values = [
      ...items.map((item) => item.created_at),
      ...watchlists.map((watchlist) => watchlist.updated_at || watchlist.created_at),
    ].filter(Boolean)

    if (values.length === 0) return null

    return values
      .map((value) => new Date(value as string))
      .filter((date) => !Number.isNaN(date.getTime()))
      .sort((a, b) => b.getTime() - a.getTime())[0]
      ?.toISOString()
  }, [items, watchlists])

  const loadPage = useCallback(async () => {
    setIsLoading(true)
    setError("")
    setMessage("")

    try {
      const { data: authData, error: authError } = await supabase.auth.getUser()

      if (authError) throw new Error(authError.message)

      const user = authData.user

      if (!user) {
        setUserId(null)
        setIsLoading(false)
        return
      }

      setUserId(user.id)

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select(
          "id, email, username, plan, access_tier, is_premium_override, premium_override_until, subscription_status, subscription_current_period_end"
        )
        .eq("id", user.id)
        .maybeSingle()

      if (profileError) throw new Error(profileError.message)

      setProfile(profileData as Profile | null)

      const authHeader = await getAuthHeader()

      const res = await fetch("/api/watchlists", {
        method: "GET",
        headers: authHeader,
      })

      if (!res.ok) throw new Error(await readApiError(res))

      const data = await res.json()

      let loadedWatchlists = (data.watchlists || []) as Watchlist[]
      const loadedItems = (data.items || []) as WatchlistItem[]

      if (loadedWatchlists.length === 0) {
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

        if (!createRes.ok) throw new Error(await readApiError(createRes))

        const createData = await createRes.json()
        loadedWatchlists = [createData.watchlist as Watchlist]
      }

      setWatchlists(loadedWatchlists)
      setItems(loadedItems)

      const defaultList =
        loadedWatchlists.find((watchlist) => watchlist.is_default) ||
        loadedWatchlists[0]

      setSelectedWatchlistId(defaultList?.id || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load Research Tracker.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadPage()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [loadPage])

  useEffect(() => {
    if (selectedTickers.length === 0) return

    let ignore = false

    async function loadMarketData() {
      setIsMarketDataLoading(true)

      try {
        const responses = await Promise.all(
          selectedTickers.map(async (ticker) => {
            const res = await fetch(`/api/stock-overview?ticker=${ticker}`)
            if (!res.ok) return null
            const data = (await res.json()) as StockOverview
            return [ticker, data] as const
          })
        )

        if (ignore) return

        setStockOverviewByTicker((current) => {
          const next = { ...current }

          responses.forEach((response) => {
            if (!response) return
            const [ticker, data] = response
            next[ticker] = data
          })

          return next
        })
      } finally {
        if (!ignore) setIsMarketDataLoading(false)
      }
    }

    loadMarketData()

    return () => {
      ignore = true
    }
  }, [selectedTickers])

  async function handleCreateWatchlist(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const cleanName = newWatchlistName.trim()

    if (!cleanName) {
      setError("Research Tracker name is required.")
      return
    }

    const latestLimit = canCreateWatchlist({
      profile,
      currentWatchlistCount: watchlists.length,
    })

    if (!latestLimit.allowed) {
      setError(latestLimit.reason || "You cannot create another Research Tracker.")
      return
    }

    setIsSaving(true)
    setError("")
    setMessage("")

    try {
      const authHeader = await getAuthHeader()

      const res = await fetch("/api/watchlists", {
        method: "POST",
        headers: {
          ...authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: cleanName,
        }),
      })

      if (!res.ok) throw new Error(await readApiError(res))

      const data = await res.json()
      const newList = data.watchlist as Watchlist

      setWatchlists((current) => [...current, newList])
      setSelectedWatchlistId(newList.id)
      setNewWatchlistName("")
      setMessage("Research Tracker created.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create Research Tracker.")
    } finally {
      setIsSaving(false)
    }
  }

  async function handleAddTicker(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!selectedWatchlistId) return

    const ticker = normalizeTicker(tickerInput)

    if (!isValidTicker(ticker)) {
      setError("Enter a valid ticker using 1-10 letters.")
      return
    }

    const alreadyExists = items.some(
      (item) => item.watchlist_id === selectedWatchlistId && item.ticker === ticker
    )

    if (alreadyExists) {
      setError(`${ticker} is already in this Research Tracker.`)
      return
    }

    setIsSaving(true)
    setError("")
    setMessage("")

    try {
      const overviewRes = await fetch(`/api/stock-overview?ticker=${ticker}`)
      const overview = overviewRes.ok
        ? ((await overviewRes.json()) as StockOverview)
        : null

      const authHeader = await getAuthHeader()

      const res = await fetch(`/api/watchlists/${selectedWatchlistId}/items`, {
        method: "POST",
        headers: {
          ...authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticker,
          companyName: overview?.companyName,
        }),
      })

      if (!res.ok) throw new Error(await readApiError(res))

      const data = await res.json()
      const newItem = data.item as WatchlistItem

      if (overview) {
        setStockOverviewByTicker((current) => ({
          ...current,
          [ticker]: overview,
        }))
      }

      setItems((current) => [newItem, ...current])
      setTickerInput("")
      setMessage(`${ticker} saved to ${getTrackerName(selectedWatchlist)}.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save company.")
    } finally {
      setIsSaving(false)
    }
  }

  async function handleRemoveTicker(itemId: string, ticker: string) {
    const item = items.find((currentItem) => currentItem.id === itemId)
    if (!item) return

    const confirmed = window.confirm(`Remove ${ticker} from your Research Tracker?`)
    if (!confirmed) return

    setIsSaving(true)
    setError("")
    setMessage("")

    try {
      const authHeader = await getAuthHeader()

      const res = await fetch(
        `/api/watchlists/${item.watchlist_id}/items/${itemId}`,
        {
          method: "DELETE",
          headers: authHeader,
        }
      )

      if (!res.ok) throw new Error(await readApiError(res))

      setItems((current) => current.filter((currentItem) => currentItem.id !== itemId))
      setMessage(`${ticker} removed from Research Tracker.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove company.")
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDeleteWatchlist(watchlistId: string) {
    const watchlist = watchlists.find((list) => list.id === watchlistId)

    if (!watchlist || watchlist.is_default) {
      setError("Default Research Tracker cannot be deleted.")
      return
    }

    const confirmed = window.confirm(`Delete ${getTrackerName(watchlist)}? Saved companies inside it will be removed.`)
    if (!confirmed) return

    setIsSaving(true)
    setError("")
    setMessage("")

    try {
      const authHeader = await getAuthHeader()

      const res = await fetch(`/api/watchlists/${watchlistId}`, {
        method: "DELETE",
        headers: authHeader,
      })

      if (!res.ok) throw new Error(await readApiError(res))

      const remaining = watchlists.filter((list) => list.id !== watchlistId)

      setWatchlists(remaining)
      setItems((current) => current.filter((item) => item.watchlist_id !== watchlistId))
      setSelectedWatchlistId(remaining[0]?.id || null)
      setMessage("Research Tracker deleted.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete Research Tracker.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <main className="stokr-page">
        <section className="stokr-shell">
          <div className="stokr-bg stokr-grid-bg" />

          <div className="relative z-10 w-full">
            <NavBar showSearch />

            <div className="stokr-card mt-16 p-6 text-center sm:p-8">
              <p className="stokr-kicker">Loading</p>
              <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                Preparing your Research Tracker
              </h1>
            </div>
          </div>
        </section>
      </main>
    )
  }

  if (!userId) {
    return (
      <main className="stokr-page">
        <section className="stokr-shell">
          <div className="stokr-bg stokr-grid-bg" />

          <div className="relative z-10 mx-auto max-w-7xl">
            <NavBar />

            <div className="stokr-card mt-16 p-6 text-center sm:p-8">
              <p className="stokr-kicker">Research Tracker</p>

              <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                Sign in to save companies
              </h1>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#A7ADBA]">
                Create a Research Tracker, save companies, and reopen source-backed
                research briefs faster.
              </p>

              <Link href="/login" className="stokr-button-primary mt-6">
                Login
              </Link>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="stokr-page">
      <section className="stokr-shell">
        <div className="stokr-bg stokr-grid-bg" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <NavBar showSearch />

          <section className="py-8 sm:py-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-end">
              <div className="min-w-0">
                <p className="stokr-kicker">Saved company research</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Research Tracker
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-[#A7ADBA] sm:text-base">
                  Save companies you want to revisit, compare, and monitor
                  through source-backed research briefs.
                </p>
                <p className="mt-4 max-w-2xl border-l border-white/[0.10] pl-4 text-xs leading-5 text-[#7B8494] sm:text-sm">
                  stokr provides informational research tools only and does not
                  provide financial advice.
                </p>
              </div>

              <form onSubmit={handleAddTicker} className="stokr-card p-4">
                <label className="font-mono text-xs uppercase tracking-[0.16em] text-[#A7ADBA]">
                  Search ticker / Add company
                </label>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <input
                    value={tickerInput}
                    onChange={(event) => setTickerInput(event.target.value.toUpperCase())}
                    placeholder="AAPL, NVDA, TSLA..."
                    className="min-h-11 min-w-0 flex-1 rounded-md border border-white/[0.08] bg-[#05070A] px-4 text-sm uppercase text-white outline-none placeholder:normal-case placeholder:text-[#6F7685] focus:border-[#19C37D]/55"
                  />
                  <button
                    disabled={isSaving || !selectedWatchlistId}
                    className="stokr-button-primary"
                  >
                    Save Company
                  </button>
                </div>
              </form>
            </div>

            {(message || error) && (
              <div
                className={`mt-6 rounded-lg border px-5 py-4 text-sm ${
                  error
                    ? "border-red-400/30 bg-red-500/10 text-red-200"
                    : "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                }`}
              >
                {error || message}
              </div>
            )}

            <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard label="Saved Companies" value={String(totalSavedCompanies)} detail="Across all Research Trackers" />
              <SummaryCard label="Research Trackers Used" value={`${watchlists.length}`} detail={getWatchlistLimitLabel(profile)} />
              <SummaryCard label="Current Tracker" value={String(selectedItems.length)} detail={getTrackerName(selectedWatchlist)} />
              <SummaryCard label="Last Updated" value={formatDateTime(lastUpdated)} detail="Based on saved tracker data" />
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
              <aside className="space-y-5">
                <section className="stokr-card p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="stokr-kicker">Trackers</p>
                      <h2 className="mt-2 text-xl font-semibold text-white">
                        Saved Companies
                      </h2>
                    </div>
                    <span className="font-mono text-sm text-[#A7ADBA]">{watchlists.length}</span>
                  </div>

                  <div className="mt-5 space-y-2">
                    {watchlists.map((watchlist) => {
                      const savedCount = items.filter((item) => item.watchlist_id === watchlist.id).length
                      const active = selectedWatchlistId === watchlist.id

                      return (
                        <button
                          key={watchlist.id}
                          onClick={() => setSelectedWatchlistId(watchlist.id)}
                          className={`w-full rounded-lg border p-4 text-left transition ${
                            active
                              ? "border-[#19C37D]/40 bg-[#19C37D]/10"
                              : "border-white/[0.08] bg-[#05070A]/55 hover:border-white/[0.14] hover:bg-[#111722]"
                          }`}
                        >
                          <p className="min-w-0 truncate font-semibold text-white">
                            {getTrackerName(watchlist)}
                          </p>
                          <p className="mt-2 text-xs text-[#A7ADBA]">
                            {savedCount} saved {savedCount === 1 ? "company" : "companies"}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                </section>

                <section className="stokr-card p-4 sm:p-5">
                  <p className="stokr-kicker">Tracker capacity</p>
                  <p className="mt-3 text-sm leading-6 text-[#A7ADBA]">
                    {premium
                      ? "Full Research Desk includes unlimited Research Trackers."
                      : "Starter Research includes 1 Research Tracker."}
                  </p>

                  {!createLimit.allowed ? (
                    <div className="mt-5 rounded-lg border border-[#C8A96A]/25 bg-[#C8A96A]/10 p-4">
                      <h3 className="font-semibold text-white">Research Tracker limit reached</h3>
                      <p className="mt-2 text-sm leading-6 text-[#CBD5E1]">
                        Starter Research includes 1 Research Tracker. Upgrade to
                        Full Research Desk to save more companies and keep a
                        deeper research history.
                      </p>
                      <Link href="/pricing" className="stokr-button-secondary mt-4">
                        View pricing
                      </Link>
                    </div>
                  ) : (
                    <form onSubmit={handleCreateWatchlist} className="mt-5">
                      <label className="font-mono text-xs uppercase tracking-[0.16em] text-[#A7ADBA]">
                        New Research Tracker
                      </label>
                      <input
                        value={newWatchlistName}
                        onChange={(event) => setNewWatchlistName(event.target.value)}
                        disabled={isSaving}
                        placeholder="Long-term research"
                        className="mt-3 min-h-11 w-full rounded-md border border-white/[0.08] bg-[#05070A] px-4 text-sm text-white outline-none placeholder:text-[#6F7685] focus:border-[#19C37D]/55 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      <button disabled={isSaving} className="stokr-button-secondary mt-3 w-full">
                        Create Tracker
                      </button>
                    </form>
                  )}

                  {selectedWatchlist && !selectedWatchlist.is_default && (
                    <button
                      onClick={() => handleDeleteWatchlist(selectedWatchlist.id)}
                      disabled={isSaving}
                      className="mt-4 w-full rounded-md border border-red-400/30 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-200 hover:bg-red-500/20 disabled:opacity-50"
                    >
                      Delete Tracker
                    </button>
                  )}
                </section>
              </aside>

              <section className="min-w-0">
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="stokr-kicker">Saved Companies</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">
                      {getTrackerName(selectedWatchlist)}
                    </h2>
                    <p className="mt-2 text-sm text-[#A7ADBA]">
                      Research status uses only currently available saved company
                      and market data.
                    </p>
                  </div>

                  <input
                    value={savedCompanyFilter}
                    onChange={(event) => setSavedCompanyFilter(event.target.value)}
                    placeholder="Filter saved companies"
                    className="min-h-10 w-full rounded-md border border-white/[0.08] bg-[#0B0F16] px-4 text-sm text-white outline-none placeholder:text-[#6F7685] focus:border-[#19C37D]/55 sm:max-w-xs"
                  />
                </div>

                {selectedItems.length === 0 ? (
                  <EmptyTrackerState />
                ) : filteredSelectedItems.length === 0 ? (
                  <div className="stokr-card p-6 text-sm text-[#A7ADBA]">
                    No saved companies match this filter.
                  </div>
                ) : (
                  <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                    {filteredSelectedItems.map((item) => (
                      <SavedCompanyCard
                        key={item.id}
                        item={item}
                        overview={stockOverviewByTicker[item.ticker]}
                        isSaving={isSaving}
                        isMarketDataLoading={isMarketDataLoading}
                        onRemove={handleRemoveTicker}
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}

function SummaryCard({
  label,
  value,
  detail,
}: {
  label: string
  value: string
  detail: string
}) {
  return (
    <div className="stokr-card p-4">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#7B8494]">
        {label}
      </p>
      <p className="mt-3 break-words text-2xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-xs leading-5 text-[#A7ADBA]">{detail}</p>
    </div>
  )
}

function SavedCompanyCard({
  item,
  overview,
  isSaving,
  isMarketDataLoading,
  onRemove,
}: {
  item: WatchlistItem
  overview?: StockOverview
  isSaving: boolean
  isMarketDataLoading: boolean
  onRemove: (itemId: string, ticker: string) => void
}) {
  const companyName = overview?.companyName || item.company_name || "Company name not available"
  const lastResearchDate = overview?.updatedAt ? formatDateTime(overview.updatedAt) : "Not available"
  const marketStatus = isMarketDataLoading && !overview
    ? "Refreshing"
    : overview
      ? "Market data available"
      : "Research not loaded yet"

  return (
    <article className="stokr-card min-w-0 p-4 transition hover:border-white/[0.14] hover:bg-[#111722]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="break-words font-mono text-2xl font-semibold text-white">
            {item.ticker}
          </h3>
          <p className="mt-1 break-words text-sm leading-5 text-[#A7ADBA]">
            {companyName}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-base font-semibold text-white">{formatPrice(overview?.price)}</p>
          <p className={`mt-1 text-xs font-semibold ${getChangeClass(overview?.change)}`}>
            {formatChange(overview?.change, overview?.changePercent)}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 border-y border-white/[0.07] py-3 text-xs sm:grid-cols-2">
        <div>
          <p className="font-mono uppercase tracking-[0.14em] text-[#7B8494]">
            Last research
          </p>
          <p className="mt-1 text-[#CBD5E1]">{lastResearchDate}</p>
        </div>
        <div>
          <p className="font-mono uppercase tracking-[0.14em] text-[#7B8494]">
            Status
          </p>
          <p className="mt-1 text-[#CBD5E1]">{marketStatus}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <Link href={getStockAnalysisHref(item.ticker)} className="stokr-button-primary sm:flex-1">
          Open Brief
        </Link>

        <div className="flex flex-wrap gap-2 sm:justify-end">
          <Link href={getStockAnalysisHref(item.ticker)} className="inline-flex min-h-10 flex-1 items-center justify-center rounded-md border border-white/[0.10] bg-[#0B0F16] px-3 py-2 text-xs font-medium text-[#CBD5E1] transition hover:border-white/[0.16] hover:bg-[#111722] sm:flex-none">
            Refresh Research
          </Link>
          <button
            type="button"
            onClick={() => onRemove(item.id, item.ticker)}
            disabled={isSaving}
            className="inline-flex min-h-10 flex-1 items-center justify-center rounded-md border border-red-400/25 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-200 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  )
}

function EmptyTrackerState() {
  return (
    <div className="stokr-card overflow-hidden p-5 sm:p-7">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="stokr-kicker">Empty Research Tracker</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            Start tracking companies you want to revisit.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[#A7ADBA]">
            Add a stock to your Research Tracker to keep its research brief,
            filing context, and saved company view in one place.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/" className="stokr-button-primary">
              Search a ticker
            </Link>
            <Link href="/stocks/nvda-stock-analysis" className="stokr-button-secondary">
              View sample report
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-[#D8D1C3] bg-[#F4F1EA] p-4 text-[#172033]">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#64748B]">
            Research receipt
          </p>
          <div className="mt-4 divide-y divide-[#D8D1C3] border-y border-[#D8D1C3]">
            <ReceiptRow label="Company" value="Add ticker" />
            <ReceiptRow label="Brief" value="Research not loaded yet" />
            <ReceiptRow label="Filing" value="Not available" />
            <ReceiptRow label="Status" value="Ready to track" />
          </div>
        </div>
      </div>
    </div>
  )
}

function ReceiptRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2 py-3 sm:grid-cols-[6rem_1fr] sm:gap-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#64748B]">
        {label}
      </p>
      <p className="break-words text-sm leading-6">{value}</p>
    </div>
  )
}
