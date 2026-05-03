import NavBar from "../components/navBar"
import LiveDashboardMetrics from "../components/dashboard/liveDashboardMetrics"
import LiveWhatChangedToday from "../components/dashboard/liveWhatChangedToday"
import PremiumRouteGuard from "../components/auth/premiumRouteGuard"
import LiveSavedReports from "../components/dashboard/liveSavedReports"
import LiveRiskAlerts from "../components/dashboard/liveRiskAlerts"
import LiveDashboardInsights from "../components/dashboard/liveDashboardInsights"
import LiveDashboardWatchlist from "../components/dashboard/liveDashboardWatchlist"

export const revalidate = 300

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
                    Dashboard
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
                <LiveDashboardMetrics />
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
                <LiveDashboardWatchlist />
                <LiveWhatChangedToday />
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
                <LiveSavedReports />
                <LiveRiskAlerts />
              </div>

              <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <LiveDashboardInsights />
              </div>
            </section>
          </div>
        </section>
      </main>
    </PremiumRouteGuard>
  )
}