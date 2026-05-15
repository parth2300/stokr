"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { useEffect, useState } from "react"
import NavBar from "@/app/components/navBar"
import LiveDashboardMetrics from "./liveDashboardMetrics"
import { trackPurchase } from "@/app/lib/analytics"
import { supabase } from "@/app/lib/supabase"
import type { SavedReport } from "@/app/lib/dashboardTypes"

type DashboardSummaryResponse = {
  planStatus: string
  isPremium: boolean
  reportsUsed: number
  monthlyReportLimit: number | null
  watchlistCount: number
  savedStockCount: number
  activeAlerts: number
  activeAlertDetail: string
}

const LiveDashboardWatchlist = dynamic(
  () => import("./liveDashboardWatchlist"),
  {
    ssr: false,
    loading: () => <DashboardPanelSkeleton title="Research Tracker" height="h-[360px]" />,
  }
)

const LiveSavedReports = dynamic(
  () => import("./liveSavedReports"),
  {
    ssr: false,
    loading: () => <DashboardPanelSkeleton title="Continue Research" height="h-[360px]" />,
  }
)

const LiveSavedCompanyMovement = dynamic(
  () => import("./liveSavedCompanyMovement"),
  {
    ssr: false,
    loading: () => <DashboardPanelSkeleton title="Saved Company Movement" height="h-[220px]" />,
  }
)

function DashboardPanelSkeleton({
  title,
  height,
}: {
  title: string
  height: string
}) {
  return (
    <section
      className={`${height} stokr-card p-5`}
    >
      <p className="stokr-kicker">
        {title}
      </p>

        <div className="mt-5 space-y-3">
        <div className="h-5 w-1/2 animate-pulse bg-[#222120]" />
        <div className="h-4 w-3/4 animate-pulse bg-[#222120]" />
        <div className="h-4 w-2/3 animate-pulse bg-[#222120]" />
      </div>
    </section>
  )
}

async function getAuthHeader() {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.access_token) return null

  return {
    Authorization: `Bearer ${session.access_token}`,
  }
}

function getReportsRemaining(summary: DashboardSummaryResponse | null) {
  if (!summary) return null
  if (summary.isPremium) return "Unlimited"
  return String(Math.max((summary.monthlyReportLimit || 3) - summary.reportsUsed, 0))
}

function NextUpPanel({
  summary,
  isLoading,
  recentReports,
}: {
  summary: DashboardSummaryResponse | null
  isLoading: boolean
  recentReports: SavedReport[]
}) {
  const reportsRemaining = getReportsRemaining(summary)
  const latestReport = recentReports[0] || null
  const briefCount = recentReports.length || summary?.reportsUsed || 0

  let title = "Start your first research flow"
  let body = "Search a ticker to generate your first source-backed research brief."
  let actions = (
    <Link href="/" className="stokr-button-primary">
      Search ticker
    </Link>
  )

  if (isLoading) {
    title = "Checking workspace"
    body = "Loading your latest Research Desk context."
    actions = <span className="text-xs text-[#7B8494]">Loading next action...</span>
  } else if (briefCount > 0) {
    title = `${briefCount} cached ${briefCount === 1 ? "brief" : "briefs"} available`
    body = "Open a recent brief or review saved companies that already have research context."
    actions = (
      <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
        {latestReport?.href && (
          <Link href={latestReport.href} className="stokr-button-primary">
            Open latest brief
          </Link>
        )}
        <Link href="/watchlist" className="stokr-button-secondary">
          View Research Tracker
        </Link>
      </div>
    )
  } else if ((summary?.savedStockCount || 0) > 0) {
    title = "Saved companies are ready to revisit"
    body = "You have saved companies in your Research Tracker. Open the tracker or search a ticker to continue researching."
    actions = (
      <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
        <Link href="/" className="stokr-button-primary">
          Search ticker
        </Link>
        <Link href="/watchlist" className="stokr-button-secondary">
          View Research Tracker
        </Link>
      </div>
    )
  }

  return (
    <section className="stokr-card p-5">
      <p className="stokr-kicker">Next Up</p>
      <h2 className="mt-2 text-2xl font-semibold italic text-[#F0EDE6]">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-[#A7ADBA]">{body}</p>
      <div className="mt-5">{actions}</div>
      <div className="mt-4 grid gap-2 border-t border-white/[0.07] pt-4 text-xs text-[#7B8494]">
        <div className="flex items-center justify-between gap-3">
          <span>Reports remaining</span>
          <span className="font-medium text-[#CBD5E1]">{reportsRemaining ?? "Not available"}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span>Saved companies</span>
          <span className="font-medium text-[#CBD5E1]">
            {summary ? summary.savedStockCount : "Not available"}
          </span>
        </div>
      </div>
    </section>
  )
}

function PlanPanel({ summary }: { summary: DashboardSummaryResponse | null }) {
  const isPremium = summary?.isPremium !== false

  return (
    <section className="stokr-card p-5">
      <p className="stokr-kicker">Plan</p>
      <h2 className="mt-2 text-xl font-semibold text-white">
        {isPremium ? "Full Research Desk active" : "Starter Research"}
      </h2>
      <p className="mt-3 text-sm leading-6 text-[#A7ADBA]">
        {isPremium
          ? "Unlimited reports and full research tools are enabled."
          : "Upgrade to Full Research Desk for full filing breakdowns, Filing Delta, complete risk analysis, saved history, and unlimited reports."}
      </p>
      {isPremium && (
        <ul className="mt-4 space-y-2 text-sm text-[#CBD5E1]">
          <li>Unlimited reports</li>
          <li>Full 10-K and 10-Q breakdowns</li>
          <li>Filing Delta</li>
          <li>Saved research history</li>
          <li>Research Tracker</li>
        </ul>
      )}
      <Link href="/pricing" className="stokr-button-secondary mt-5">
        Manage plan
      </Link>
    </section>
  )
}

export default function OptimizedDashboardContent() {
  const [stage, setStage] = useState(0)
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null)
  const [isSummaryLoading, setIsSummaryLoading] = useState(true)
  const [recentReports, setRecentReports] = useState<SavedReport[]>([])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    if (params.get("checkout") !== "success") return

    const purchaseKey = "stokr_purchase_premium_success"

    if (window.sessionStorage.getItem(purchaseKey)) return

    window.sessionStorage.setItem(purchaseKey, "1")
    trackPurchase("premium", 9.99, "USD")
  }, [])

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setStage(1), 100),
    ]

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  useEffect(() => {
    let ignore = false

    async function loadDeskContext() {
      setIsSummaryLoading(true)

      try {
        const authHeader = await getAuthHeader()
        if (!authHeader) return

        const [summaryRes, reportsRes] = await Promise.all([
          fetch("/api/dashboard/summary", {
            method: "GET",
            headers: authHeader,
          }),
          fetch("/api/dashboard/saved-reports", {
            method: "GET",
            headers: authHeader,
          }),
        ])

        if (!ignore && summaryRes.ok) {
          const data = (await summaryRes.json()) as DashboardSummaryResponse
          setSummary(data)
        }

        if (!ignore && reportsRes.ok) {
          const data = await reportsRes.json()
          setRecentReports((data.reports || []) as SavedReport[])
        }
      } finally {
        if (!ignore) setIsSummaryLoading(false)
      }
    }

    loadDeskContext()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <main className="stokr-page">
      <section className="stokr-shell">
        <div className="stokr-bg stokr-grid-bg" />

        <div className="relative z-10 flex w-full flex-col">
          <NavBar showSearch />

          <section className="page-inner space-y-8 pb-12 pt-14">
            <div className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-end">
              <div className="min-w-0">
                <p className="stokr-kicker">
                  Full Research Desk
                </p>

                <h1 className="mt-2 text-5xl font-semibold italic leading-[0.98] tracking-normal text-[#F0EDE6] xl:text-6xl">
                  Research Desk
                </h1>

                <p className="mt-5 max-w-3xl text-sm leading-6 text-[#9A9690] xl:text-base">
                  Pick up where you left off. Open recent briefs, check your usage, and continue researching from one place.
                </p>

                <p className="mt-4 max-w-3xl border-l border-[#2E2D2A] pl-4 font-mono text-xs uppercase leading-5 tracking-[0.14em] text-[#9A9690] sm:text-sm">
                  stokr provides informational research tools only. Not financial advice.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row xl:justify-end">
                <Link href="/" className="stokr-button-primary">
                  Search ticker
                </Link>
                <Link href="/watchlist" className="stokr-button-secondary">
                  Open Research Tracker
                </Link>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <LiveDashboardMetrics />
            </div>

            <div className="grid items-start gap-6 2xl:grid-cols-[minmax(0,1.75fr)_minmax(360px,0.85fr)]">
              <div className="min-w-0 space-y-6">
                {stage >= 1 ? (
                  <LiveSavedReports />
                ) : (
                  <DashboardPanelSkeleton title="Continue Research" height="h-[360px]" />
                )}

                <LiveSavedCompanyMovement />
              </div>

              <aside className="min-w-0 space-y-6">
                <NextUpPanel
                  summary={summary}
                  isLoading={isSummaryLoading}
                  recentReports={recentReports}
                />

                {stage >= 1 ? (
                  <LiveDashboardWatchlist />
                ) : (
                  <DashboardPanelSkeleton title="Research Tracker" height="h-[280px]" />
                )}

                <PlanPanel summary={summary} />
              </aside>
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}


