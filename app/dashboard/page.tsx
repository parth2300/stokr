import NavBar from "../components/navBar"
import DashboardMetricCard from "../components/dashboard/dashboardMetricCard"
import WhatChangedToday from "../components/dashboard/whatChangedToday"
import PremiumRouteGuard from "../components/auth/premiumRouteGuard"
import SavedReportsTable from "../components/dashboard/savedReportsTable"
import RiskAlertsCard from "../components/dashboard/riskAlertsCard"
import ScoreLeaderboard from "../components/dashboard/scoreLeaderboard"
import LiveDashboardWatchlist from "../components/dashboard/liveDashboardWatchlist"
import WatchlistInsights from "../components/dashboard/watchlistInsights"
import {
  DashboardChange,
  DashboardInsight,
  DashboardMetric,
  LeaderboardItem,
  RiskAlert,
  SavedReport,
} from "../lib/dashboardTypes"

export const revalidate = 300

const metrics: DashboardMetric[] = [
  {
    label: "Plan Status",
    value: "Premium",
    detail: "Manual premium access enabled",
    accent: "blue",
  },
  {
    label: "Reports Used",
    value: "18 / 50",
    detail: "36% of monthly report limit",
    accent: "green",
  },
  {
    label: "Watchlist Count",
    value: "5",
    detail: "Tracked across sectors",
    accent: "blue",
  },
  {
    label: "Active Alerts",
    value: "4",
    detail: "2 high • 2 medium",
    accent: "red",
  },
]

const changes: DashboardChange[] = [
  {
    ticker: "MSFT",
    title: "Valuation score moved from 31 to 28",
    description:
      "Valuation score decreased because market cap increased faster than earnings and free cash flow.",
    timeAgo: "2h ago",
    direction: "down",
  },
  {
    ticker: "AMZN",
    title: "New 10-Q detected",
    description: "A new quarterly filing was found and is ready for AI analysis.",
    timeAgo: "3h ago",
    direction: "neutral",
  },
  {
    ticker: "NVDA",
    title: "Stock moved higher",
    description: "Price action moved sharply while financial quality remains strong.",
    timeAgo: "4h ago",
    direction: "up",
  },
  {
    ticker: "AAPL",
    title: "AI report regenerated",
    description: "The saved report was refreshed with new filing and metrics context.",
    timeAgo: "5h ago",
    direction: "neutral",
  },
]

const reports: SavedReport[] = [
  {
    ticker: "NVDA",
    companyName: "NVIDIA Corp.",
    healthScore: 90,
    filingDate: "May 22, 2025",
    generatedAt: "May 23, 2025",
    href: "/stocks/nvda-stock-analysis",
  },
  {
    ticker: "MSFT",
    companyName: "Microsoft Corp.",
    healthScore: 88,
    filingDate: "Jul 30, 2025",
    generatedAt: "Today",
    href: "/stocks/msft-stock-analysis",
  },
  {
    ticker: "AMZN",
    companyName: "Amazon.com Inc.",
    healthScore: 72,
    filingDate: "May 8, 2025",
    generatedAt: "May 9, 2025",
    href: "/stocks/amzn-stock-analysis",
  },
]

const alerts: RiskAlert[] = [
  {
    ticker: "AMZN",
    title: "Margin pressure detected",
    description: "Operating margin declined compared with prior period.",
    severity: "High",
    timeAgo: "1h ago",
  },
  {
    ticker: "AAPL",
    title: "Debt risk increased",
    description: "Total debt increased while cash flow growth slowed.",
    severity: "High",
    timeAgo: "3h ago",
  },
  {
    ticker: "GOOGL",
    title: "Valuation stretched",
    description:
      "Market valuation is above the preferred range compared with fundamentals.",
    severity: "Medium",
    timeAgo: "5h ago",
  },
  {
    ticker: "MSFT",
    title: "New red flag found",
    description: "AI analysis detected a new cautionary note in the filing.",
    severity: "Medium",
    timeAgo: "6h ago",
  },
]

const leaderboard: LeaderboardItem[] = [
  { rank: 1, ticker: "NVDA", score: 90 },
  { rank: 2, ticker: "MSFT", score: 85 },
  { rank: 3, ticker: "AAPL", score: 85 },
  { rank: 4, ticker: "GOOGL", score: 78 },
  { rank: 5, ticker: "AMZN", score: 76 },
]

const insights: DashboardInsight[] = [
  {
    label: "Avg Health Score",
    value: "79",
    detail: "+2 pts vs last month",
    direction: "up",
  },
  {
    label: "Avg Valuation Score",
    value: "50",
    detail: "-1 pt vs last month",
    direction: "down",
  },
  {
    label: "High Risk Stocks",
    value: "2",
    detail: "40% of watchlist",
    direction: "down",
  },
  {
    label: "Reports Need Refresh",
    value: "2",
    detail: "Due within 7 days",
    direction: "neutral",
  },
]

export default function DashboardPage() {
  return (
  <PremiumRouteGuard>
    <main className="min-h-screen overflow-x-hidden bg-[#0F172A] text-white">
      <section className="relative min-h-screen px-4 py-4 md:px-6 lg:px-8 xl:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_18%,rgba(255,138,101,0.22),transparent_38%),radial-gradient(circle_at_82%_20%,rgba(124,157,255,0.28),transparent_42%),radial-gradient(circle_at_50%_70%,rgba(124,157,255,0.12),transparent_48%)]" />
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 flex w-full flex-col">
          <NavBar showSearch />

          <section className="mt-6 space-y-6 pb-10">
            <div className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-end">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7C9DFF]">
                  Premium
                </p>

                <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white xl:text-5xl">
                  Premium Dashboard
                </h1>

                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 xl:text-base">
                  Monitor your watchlist, saved AI reports, valuation shifts, filing changes,
                  and risk alerts in one place.
                </p>
              </div>

              <div className="shrink-0 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-5 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
                  Access
                </p>
                <p className="mt-1 text-sm font-bold text-white">Premium Active</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => (
                <DashboardMetricCard key={metric.label} metric={metric} />
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
              <LiveDashboardWatchlist />
              <WhatChangedToday changes={changes} />
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
              <SavedReportsTable reports={reports} />
              <RiskAlertsCard alerts={alerts} />
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <ScoreLeaderboard items={leaderboard} />
              <WatchlistInsights insights={insights} />
            </div>
          </section>
        </div>
      </section>
    </main>
    </PremiumRouteGuard>
  )
}