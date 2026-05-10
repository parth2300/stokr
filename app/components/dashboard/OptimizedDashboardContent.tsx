"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import NavBar from "@/app/components/navBar"
import LiveDashboardMetrics from "./liveDashboardMetrics"
import { trackPurchase } from "@/app/lib/analytics"

const LiveDashboardWatchlist = dynamic(
  () => import("./liveDashboardWatchlist"),
  {
    ssr: false,
    loading: () => <DashboardPanelSkeleton title="Watchlist" height="h-[360px]" />,
  }
)

const LiveWhatChangedToday = dynamic(
  () => import("./liveWhatChangedToday"),
  {
    ssr: false,
    loading: () => <DashboardPanelSkeleton title="What Changed" height="h-[360px]" />,
  }
)

const LiveSavedReports = dynamic(
  () => import("./liveSavedReports"),
  {
    ssr: false,
    loading: () => <DashboardPanelSkeleton title="Saved Reports" height="h-[340px]" />,
  }
)

const LiveRiskAlerts = dynamic(
  () => import("./liveRiskAlerts"),
  {
    ssr: false,
    loading: () => <DashboardPanelSkeleton title="Risk Alerts" height="h-[340px]" />,
  }
)

const LiveDashboardInsights = dynamic(
  () => import("./liveDashboardInsights"),
  {
    ssr: false,
    loading: () => <DashboardPanelSkeleton title="Insights" height="h-[320px]" />,
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
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#7C8CFF]">
        {title}
      </p>

      <div className="mt-5 space-y-3">
        <div className="h-5 w-1/2 animate-pulse rounded-full bg-white/10" />
        <div className="h-4 w-3/4 animate-pulse rounded-full bg-white/10" />
        <div className="h-4 w-2/3 animate-pulse rounded-full bg-white/10" />
      </div>
    </section>
  )
}

export default function OptimizedDashboardContent() {
  const [stage, setStage] = useState(0)

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
      window.setTimeout(() => setStage(2), 250),
      window.setTimeout(() => setStage(3), 450),
    ]

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  return (
    <main className="stokr-page">
      <section className="stokr-shell">
        <div className="stokr-bg" />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col">
          <NavBar showSearch />

          <section className="mt-6 space-y-6 pb-10">
            <div className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-end">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7C8CFF]">
                  Premium
                </p>

                <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white xl:text-5xl">
                  Dashboard
                </h1>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-[#A3AAB8] xl:text-base">
                  Monitor your watchlist, saved AI reports, valuation shifts, filing changes,
                  and risk alerts in one place.
                </p>
              </div>

              <div className="w-full shrink-0 rounded-xl border border-white/[0.10] bg-[#11141C] px-5 py-3 sm:w-auto">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#7BAE8C]">
                  Access
                </p>
                <p className="mt-1 text-sm font-bold text-white">
                  Premium Active
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <LiveDashboardMetrics />
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
              {stage >= 1 ? (
                <LiveDashboardWatchlist />
              ) : (
                <DashboardPanelSkeleton title="Watchlist" height="h-[360px]" />
              )}

              {stage >= 1 ? (
                <LiveWhatChangedToday />
              ) : (
                <DashboardPanelSkeleton title="What Changed" height="h-[360px]" />
              )}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
              {stage >= 2 ? (
                <LiveSavedReports />
              ) : (
                <DashboardPanelSkeleton title="Saved Reports" height="h-[340px]" />
              )}

              {stage >= 2 ? (
                <LiveRiskAlerts />
              ) : (
                <DashboardPanelSkeleton title="Risk Alerts" height="h-[340px]" />
              )}
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              {stage >= 3 ? (
                <LiveDashboardInsights />
              ) : (
                <DashboardPanelSkeleton title="Insights" height="h-[320px]" />
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}


