"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import NavBar from "@/app/components/navBar"
import LiveDashboardMetrics from "./liveDashboardMetrics"

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
      className={`${height} rounded-[26px] border border-[#7C9DFF]/25 bg-white/[0.04] p-5 shadow-lg`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
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
    <main className="min-h-screen overflow-x-hidden bg-[#0F172A] text-white">
      <section className="relative min-h-screen px-4 py-4 md:px-6 lg:px-8 xl:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_18%,rgba(255,138,101,0.18),transparent_38%),radial-gradient(circle_at_82%_20%,rgba(124,157,255,0.22),transparent_42%),radial-gradient(circle_at_50%_70%,rgba(124,157,255,0.08),transparent_48%)]" />
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col">
          <NavBar showSearch />

          <section className="mt-6 space-y-6 pb-10">
            <div className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-end">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7C9DFF]">
                  Premium
                </p>

                <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white xl:text-5xl">
                  Dashboard
                </h1>

                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 xl:text-base">
                  Monitor your watchlist, saved AI reports, valuation shifts, filing changes,
                  and risk alerts in one place.
                </p>
              </div>

              <div className="shrink-0 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-5 py-3 shadow-lg">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
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