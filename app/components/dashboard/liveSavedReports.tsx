"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "@/app/lib/supabase"
import SavedReportsTable from "./savedReportsTable"
import { SavedReport } from "@/app/lib/dashboardTypes"

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

export default function LiveSavedReports() {
  const [reports, setReports] = useState<SavedReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadSavedReports()
  }, [])

  async function loadSavedReports() {
    setIsLoading(true)
    setError("")

    try {
      const authHeader = await getAuthHeader()

      const res = await fetch("/api/dashboard/saved-reports", {
        method: "GET",
        headers: authHeader,
      })

      if (!res.ok) {
        throw new Error(await readApiError(res))
      }

      const data = await res.json()

      setReports((data.reports || []) as SavedReport[])
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load research briefs."
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <section className="stokr-card min-w-0 p-5">
        <p className="stokr-kicker">
          Continue Research
        </p>

        <h2 className="mt-2 text-xl font-semibold text-white">
          Loading research briefs
        </h2>

        <div className="mt-6 grid gap-3">
          <div className="h-10 animate-pulse bg-[#222120]" />
          <div className="h-10 animate-pulse bg-[#161616]" />
          <div className="h-10 animate-pulse bg-[#222120]" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="min-w-0 border border-[#D63C2F]/35 bg-[#D63C2F]/10 p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-red-300">
          Research Briefs Error
        </p>

        <h2 className="mt-2 text-xl font-semibold text-white">
          Could not load research briefs
        </h2>

        <p className="mt-3 text-sm text-red-100">{error}</p>

        <button
          onClick={loadSavedReports}
          className="stokr-button-danger mt-5"
        >
          Retry
        </button>
      </section>
    )
  }

  if (reports.length === 0) {
    return (
      <section className="stokr-card min-w-0 p-5">
        <p className="stokr-kicker">
          Continue Research
        </p>

        <h2 className="mt-2 text-xl font-semibold text-white">
          Recent Research Briefs
        </h2>

        <div className="mt-6 border border-dashed border-[#2E2D2A] bg-[#0C0C0C] p-8 text-center">
          <p className="text-lg font-semibold text-white">
            No research briefs yet.
          </p>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#9A9690]">
            Search a ticker to generate your first source-backed brief.
          </p>

          <Link
            href="/"
            className="stokr-button-primary mt-5"
          >
            Search ticker
          </Link>
        </div>
      </section>
    )
  }

  return <SavedReportsTable reports={reports} />
}

