import { DashboardInsight } from "@/app/lib/dashboardTypes"

function detailClass(direction: DashboardInsight["direction"]) {
    if (direction === "up") return "text-emerald-300"
    if (direction === "down") return "text-red-300"
    return "text-[#A7ADBA]"
}

export default function WatchlistInsights({
    insights,
}: {
    insights: DashboardInsight[]
}) {
    return (
        <section className="min-w-0 border border-[#222120] bg-[#111111] p-5">
            <div>
                <p className="stokr-kicker">
                    Insights
                </p>

                <h2 className="mt-1 text-lg font-bold text-white">
                    Research Tracker Insights
                </h2>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {insights.length === 0 ? (
                    <p className="border border-dashed border-[#2E2D2A] bg-[#0C0C0C] p-5 text-sm leading-6 text-[#9A9690] sm:col-span-2">
                        Research Tracker insights will appear here as you generate briefs and save companies.
                    </p>
                ) : insights.map((insight) => (
                    <div
                        key={insight.label}
                        className="border border-[#222120] bg-[#0C0C0C] p-3"
                    >
                        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#3E3D3A]">
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

