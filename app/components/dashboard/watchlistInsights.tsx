import { DashboardInsight } from "@/app/lib/dashboardTypes"

function detailClass(direction: DashboardInsight["direction"]) {
    if (direction === "up") return "text-emerald-300"
    if (direction === "down") return "text-red-300"
    return "text-[#9AA6FF]"
}

export default function WatchlistInsights({
    insights,
}: {
    insights: DashboardInsight[]
}) {
    return (
        <section className="min-w-0 rounded-xl border border-white/[0.09] bg-[#11141C] p-5">
            <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#7C8CFF]">
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

