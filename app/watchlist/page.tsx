"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import NavBar from "../components/navBar"
import { supabase } from "../lib/supabase"
import { PremiumProfile, isUserPremium } from "../lib/premium"
import { canCreateWatchlist, getWatchlistLimitLabel } from "../lib/watchlistLimits"

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

type Profile = PremiumProfile & {
  id: string
  email?: string | null
  username?: string | null
}

function normalizeTicker(value: string) {
  return value.trim().toUpperCase()
}

function isValidTicker(value: string) {
  return /^[A-Z]{1,10}$/.test(value)
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

export default function WatchlistPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [watchlists, setWatchlists] = useState<Watchlist[]>([])
  const [items, setItems] = useState<WatchlistItem[]>([])
  const [selectedWatchlistId, setSelectedWatchlistId] = useState<string | null>(null)

  const [tickerInput, setTickerInput] = useState("")
  const [newWatchlistName, setNewWatchlistName] = useState("")

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
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

  const createLimit = canCreateWatchlist({
    profile,
    currentWatchlistCount: watchlists.length,
  })

  useEffect(() => {
    loadPage()
  }, [])

  async function loadPage() {
    setIsLoading(true)
    setError("")
    setMessage("")

    try {
      const { data: authData, error: authError } = await supabase.auth.getUser()

      if (authError) {
        throw new Error(authError.message)
      }

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

      if (profileError) {
        throw new Error(profileError.message)
      }

      setProfile(profileData as Profile | null)

      const authHeader = await getAuthHeader()

      const res = await fetch("/api/watchlists", {
        method: "GET",
        headers: authHeader,
      })

      if (!res.ok) {
        throw new Error(await readApiError(res))
      }

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

        if (!createRes.ok) {
          throw new Error(await readApiError(createRes))
        }

        const createData = await createRes.json()
        loadedWatchlists = [createData.watchlist as Watchlist]
      }

      setWatchlists(loadedWatchlists)
      setItems(loadedItems)

      const defaultList =
        loadedWatchlists.find((watchlist) => watchlist.is_default) || loadedWatchlists[0]

      setSelectedWatchlistId(defaultList?.id || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load watchlist.")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCreateWatchlist(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const cleanName = newWatchlistName.trim()

    if (!cleanName) {
      setError("Watchlist name is required.")
      return
    }

    const latestLimit = canCreateWatchlist({
      profile,
      currentWatchlistCount: watchlists.length,
    })

    if (!latestLimit.allowed) {
      setError(latestLimit.reason || "You cannot create another watchlist.")
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

      if (!res.ok) {
        throw new Error(await readApiError(res))
      }

      const data = await res.json()
      const newList = data.watchlist as Watchlist

      setWatchlists((current) => [...current, newList])
      setSelectedWatchlistId(newList.id)
      setNewWatchlistName("")
      setMessage("Watchlist created.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create watchlist.")
    } finally {
      setIsSaving(false)
    }
  }

  async function handleAddTicker(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!selectedWatchlistId) return

    const ticker = normalizeTicker(tickerInput)

    if (!isValidTicker(ticker)) {
      setError("Enter a valid ticker using 1–10 letters.")
      return
    }

    const alreadyExists = items.some(
      (item) => item.watchlist_id === selectedWatchlistId && item.ticker === ticker
    )

    if (alreadyExists) {
      setError(`${ticker} is already in this watchlist.`)
      return
    }

    setIsSaving(true)
    setError("")
    setMessage("")

    try {
      const authHeader = await getAuthHeader()

      const res = await fetch(`/api/watchlists/${selectedWatchlistId}/items`, {
        method: "POST",
        headers: {
          ...authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticker,
        }),
      })

      if (!res.ok) {
        throw new Error(await readApiError(res))
      }

      const data = await res.json()
      const newItem = data.item as WatchlistItem

      setItems((current) => [newItem, ...current])
      setTickerInput("")
      setMessage(`${ticker} added to ${selectedWatchlist?.name || "watchlist"}.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add ticker.")
    } finally {
      setIsSaving(false)
    }
  }

  async function handleRemoveTicker(itemId: string, ticker: string) {
    const item = items.find((currentItem) => currentItem.id === itemId)

    if (!item) return

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

      if (!res.ok) {
        throw new Error(await readApiError(res))
      }

      setItems((current) => current.filter((currentItem) => currentItem.id !== itemId))
      setMessage(`${ticker} removed.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove ticker.")
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDeleteWatchlist(watchlistId: string) {
    const watchlist = watchlists.find((list) => list.id === watchlistId)

    if (!watchlist || watchlist.is_default) {
      setError("Default watchlist cannot be deleted.")
      return
    }

    setIsSaving(true)
    setError("")
    setMessage("")

    try {
      const authHeader = await getAuthHeader()

      const res = await fetch(`/api/watchlists/${watchlistId}`, {
        method: "DELETE",
        headers: authHeader,
      })

      if (!res.ok) {
        throw new Error(await readApiError(res))
      }

      const remaining = watchlists.filter((list) => list.id !== watchlistId)

      setWatchlists(remaining)
      setItems((current) => current.filter((item) => item.watchlist_id !== watchlistId))
      setSelectedWatchlistId(remaining[0]?.id || null)
      setMessage("Watchlist deleted.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete watchlist.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#0F172A] text-white">
        <section className="relative min-h-screen px-6 py-5 md:px-10 lg:px-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_18%,rgba(255,138,101,0.22),transparent_38%),radial-gradient(circle_at_82%_20%,rgba(124,157,255,0.28),transparent_42%),radial-gradient(circle_at_50%_70%,rgba(124,157,255,0.12),transparent_48%)]" />
          <div className="absolute inset-0 bg-black/20" />

          <div className="relative z-10 mx-auto max-w-7xl">
            <NavBar showSearch />

            <div className="mt-20 rounded-[30px] border border-[#7C9DFF]/40 bg-white/[0.045] p-8 text-center shadow-[0_0_24px_rgba(124,157,255,0.12)] backdrop-blur-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
                Loading
              </p>
              <h1 className="mt-3 text-3xl font-bold text-white">
                Preparing your watchlist
              </h1>
            </div>
          </div>
        </section>
      </main>
    )
  }

  if (!userId) {
    return (
      <main className="min-h-screen bg-[#0F172A] text-white">
        <section className="relative min-h-screen px-6 py-5 md:px-10 lg:px-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_18%,rgba(255,138,101,0.22),transparent_38%),radial-gradient(circle_at_82%_20%,rgba(124,157,255,0.28),transparent_42%),radial-gradient(circle_at_50%_70%,rgba(124,157,255,0.12),transparent_48%)]" />
          <div className="absolute inset-0 bg-black/20" />

          <div className="relative z-10 mx-auto max-w-7xl">
            <NavBar />

            <div className="mt-20 rounded-[30px] border border-[#7C9DFF]/40 bg-white/[0.045] p-8 text-center shadow-[0_0_24px_rgba(124,157,255,0.12)] backdrop-blur-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
                Watchlist
              </p>

              <h1 className="mt-3 text-4xl font-extrabold text-white">
                Sign in to create a watchlist
              </h1>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-300">
                Create a personal watchlist, save tickers, and open AI stock analysis pages faster.
              </p>

              <Link
                href="/login"
                className="mt-6 inline-flex rounded-2xl bg-white px-6 py-3 text-sm font-bold text-[#0F172A] hover:bg-blue-100"
              >
                Login
              </Link>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0F172A] text-white">
      <section className="relative min-h-screen px-6 py-5 md:px-10 lg:px-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_18%,rgba(255,138,101,0.22),transparent_38%),radial-gradient(circle_at_82%_20%,rgba(124,157,255,0.28),transparent_42%),radial-gradient(circle_at_50%_70%,rgba(124,157,255,0.12),transparent_48%)]" />
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <NavBar showSearch />

          <section className="py-12">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#7C9DFF]">
                  Watchlist
                </p>

                <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                  Your Watchlists
                </h1>

                <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
                  Save tickers, organize companies, and jump back into AI stock analysis faster.
                </p>
              </div>

              <div className="rounded-2xl border border-[#7C9DFF]/30 bg-[#7C9DFF]/10 px-5 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9DB6FF]">
                  Access
                </p>
                <p className="mt-1 text-sm font-bold text-white">
                  {premium ? "Premium · Unlimited watchlists" : "Free · 1 watchlist"}
                </p>
              </div>
            </div>

            {(message || error) && (
              <div
                className={`mt-6 rounded-2xl border px-5 py-4 text-sm ${
                  error
                    ? "border-red-400/30 bg-red-500/10 text-red-200"
                    : "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                }`}
              >
                {error || message}
              </div>
            )}

            <div className="mt-8 grid gap-8 lg:grid-cols-[320px_1fr]">
              <aside className="rounded-[30px] border border-[#7C9DFF]/40 bg-white/[0.045] p-5 shadow-[0_0_24px_rgba(124,157,255,0.12)] backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Lists
                    </p>

                    <h2 className="mt-2 text-xl font-bold text-white">
                      Watchlists
                    </h2>
                  </div>

                  <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-300">
                    {watchlists.length}
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  {watchlists.map((watchlist) => (
                    <button
                      key={watchlist.id}
                      onClick={() => setSelectedWatchlistId(watchlist.id)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        selectedWatchlistId === watchlist.id
                          ? "border-[#7C9DFF]/60 bg-[#7C9DFF]/15"
                          : "border-white/10 bg-black/20 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-bold text-white">{watchlist.name}</p>

                        {watchlist.is_default && (
                          <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300">
                            Default
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-xs text-slate-400">
                        {items.filter((item) => item.watchlist_id === watchlist.id).length} stocks
                      </p>
                    </button>
                  ))}
                </div>

                <form onSubmit={handleCreateWatchlist} className="mt-6">
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Create Watchlist
                  </label>

                  <input
                    value={newWatchlistName}
                    onChange={(event) => setNewWatchlistName(event.target.value)}
                    disabled={!createLimit.allowed || isSaving}
                    placeholder={
                      createLimit.allowed
                        ? "Growth stocks"
                        : "Upgrade for more watchlists"
                    }
                    className="mt-3 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-[#7C9DFF]/60 disabled:cursor-not-allowed disabled:opacity-50"
                  />

                  <button
                    disabled={!createLimit.allowed || isSaving}
                    className="mt-3 w-full rounded-2xl bg-white px-4 py-3 text-sm font-bold text-[#0F172A] transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Create
                  </button>

                  {!createLimit.allowed && (
                    <p className="mt-3 text-xs leading-relaxed text-slate-400">
                      {createLimit.reason}
                    </p>
                  )}

                  <p className="mt-3 text-xs text-slate-500">
                    Limit: {getWatchlistLimitLabel(profile)}
                  </p>
                </form>
              </aside>

              <section className="rounded-[30px] border border-[#7C9DFF]/40 bg-white/[0.045] p-6 shadow-[0_0_24px_rgba(124,157,255,0.12)] backdrop-blur-xl">
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
                      Selected List
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-white">
                      {selectedWatchlist?.name || "Watchlist"}
                    </h2>

                    <p className="mt-2 text-sm text-slate-400">
                      {selectedItems.length} saved stocks
                    </p>
                  </div>

                  {selectedWatchlist && !selectedWatchlist.is_default && (
                    <button
                      onClick={() => handleDeleteWatchlist(selectedWatchlist.id)}
                      disabled={isSaving}
                      className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 hover:bg-red-500/20 disabled:opacity-50"
                    >
                      Delete Watchlist
                    </button>
                  )}
                </div>

                <form onSubmit={handleAddTicker} className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <input
                    value={tickerInput}
                    onChange={(event) => setTickerInput(event.target.value.toUpperCase())}
                    placeholder="Add ticker, example: MSFT"
                    className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/25 px-5 py-3 text-sm uppercase text-white outline-none placeholder:normal-case placeholder:text-slate-500 focus:border-[#7C9DFF]/60"
                  />

                  <button
                    disabled={isSaving || !selectedWatchlistId}
                    className="rounded-2xl bg-white px-6 py-3 text-sm font-bold text-[#0F172A] transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Add Stock
                  </button>
                </form>

                <div className="mt-8 overflow-x-auto">
                  {selectedItems.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[#7C9DFF]/35 bg-black/20 p-10 text-center">
                      <p className="text-lg font-bold text-white">
                        No stocks saved yet
                      </p>

                      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-400">
                        Add your first ticker above. Stocks inside a watchlist are unlimited for both free and premium users.
                      </p>
                    </div>
                  ) : (
                    <table className="w-full min-w-[720px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-white/10 text-xs uppercase tracking-[0.18em] text-slate-400">
                          <th className="pb-4">Ticker</th>
                          <th className="pb-4">Company</th>
                          <th className="pb-4">Added</th>
                          <th className="pb-4 text-right">Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        {selectedItems.map((item) => (
                          <tr key={item.id} className="border-b border-white/6 last:border-b-0">
                            <td className="py-4">
                              <Link
                                href={`/stocks/${item.ticker.toLowerCase()}-stock-analysis`}
                                className="text-lg font-bold text-white hover:text-[#9DB6FF]"
                              >
                                {item.ticker}
                              </Link>
                            </td>

                            <td className="py-4 text-slate-300">
                              {item.company_name || "Company name pending"}
                            </td>

                            <td className="py-4 text-slate-400">
                              {new Date(item.created_at).toLocaleDateString()}
                            </td>

                            <td className="py-4 text-right">
                              <div className="flex justify-end gap-3">
                                <Link
                                  href={`/stocks/${item.ticker.toLowerCase()}-stock-analysis`}
                                  className="rounded-xl border border-[#7C9DFF]/35 bg-[#7C9DFF]/10 px-3 py-2 text-xs font-semibold text-blue-100 hover:bg-[#7C9DFF]/20"
                                >
                                  Analyze
                                </Link>

                                <button
                                  onClick={() => handleRemoveTicker(item.id, item.ticker)}
                                  disabled={isSaving}
                                  className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200 hover:bg-red-500/20 disabled:opacity-50"
                                >
                                  Remove
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </section>
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}