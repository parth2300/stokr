import { DashboardInsight } from "@/app/lib/dashboardTypes"

function detailClass(direction: DashboardInsight["direction"]) {
    if (direction === "up") return "text-emerald-300"
    if (direction === "down") return "text-red-300"
    return "text-[#9DB6FF]"
}

export default function WatchlistInsights({
    insights,
}: {
    insights: DashboardInsight[]
}) {
    return (
        <section className="min-w-0 rounded-[26px] border border-[#7C9DFF]/40 bg-white/[0.045] p-5 shadow-[0_0_20px_rgba(124,157,255,0.10)] backdrop-blur-xl">
            <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
                    Insights
                </p>

                <h2 className="mt-1 text-lg font-bold text-white">
                    Watchlist Insights
                </h2>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {insights.map((insight) => (
                    <div
                        key={insight.label}
                        className="rounded-xl border border-white/10 bg-black/20 p-3"
                    >
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                            {insight.label}
                        </p>

                        <p className="mt-2 text-2xl font-extrabold text-white">
                            {insight.value}
                        </p>

                        <p className={`mt-1 text-[10px] font-semibold ${detailClass(insight.direction)}`}>
                            {insight.detail}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}