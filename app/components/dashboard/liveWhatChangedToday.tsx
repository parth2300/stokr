"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/app/lib/supabase"
import WhatChangedToday from "./whatChangedToday"
import { DashboardChange } from "@/app/lib/dashboardTypes"

type ChangesResponse = {
  changes: DashboardChange[]
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

export default function LiveWhatChangedToday() {
  const [changes, setChanges] = useState<DashboardChange[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadChanges()
  }, [])

  async function loadChanges() {
    setIsLoading(true)
    setError("")

    try {
      const authHeader = await getAuthHeader()

      const res = await fetch("/api/dashboard/changes", {
        method: "GET",
        headers: authHeader,
      })

      if (!res.ok) {
        throw new Error(await readApiError(res))
      }

      const data = (await res.json()) as ChangesResponse

      setChanges(data.changes || [])
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load dashboard changes."
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <section className="min-w-0 rounded-xl border border-white/[0.09] bg-[#11141C] p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#7C8CFF]">
          Updates
        </p>

        <h2 className="mt-2 text-xl font-bold text-white">
          Loading What Changed Today
        </h2>

        <div className="mt-6 grid gap-3">
          <div className="h-16 animate-pulse rounded-xl bg-white/10" />
          <div className="h-16 animate-pulse rounded-xl bg-white/10" />
          <div className="h-16 animate-pulse rounded-xl bg-white/10" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="min-w-0 rounded-xl border border-red-400/20 bg-red-500/10 p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-red-300">
          Updates Error
        </p>

        <h2 className="mt-2 text-xl font-bold text-white">
          Could not load changes
        </h2>

        <p className="mt-3 text-sm text-red-100">{error}</p>

        <button
          onClick={loadChanges}
          className="mt-5 rounded-xl border border-red-300/30 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-100 hover:bg-red-500/25"
        >
          Retry
        </button>
      </section>
    )
  }

  if (changes.length === 0) {
    return (
      <section className="min-w-0 rounded-xl border border-white/[0.09] bg-[#11141C] p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#7C8CFF]">
          Updates
        </p>

        <h2 className="mt-2 text-xl font-bold text-white">
          What Changed Today
        </h2>

        <div className="mt-6 rounded-2xl border border-dashed border-[#7C8CFF]/35 bg-black/20 p-8 text-center">
          <p className="text-lg font-bold text-white">
            No changes yet
          </p>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-400">
            Add stocks, generate reports, or create alerts to see updates here.
          </p>
        </div>
      </section>
    )
  }

  return <WhatChangedToday changes={changes} />
}

