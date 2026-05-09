import { RiskAlert } from "@/app/lib/dashboardTypes"

function severityClass(severity: RiskAlert["severity"]) {
    switch (severity) {
        case "High":
            return "border-red-400/30 bg-red-500/15 text-red-300"
        case "Medium":
            return "border-yellow-400/30 bg-yellow-500/15 text-yellow-300"
        default:
            return "border-slate-400/30 bg-slate-500/15 text-slate-300"
    }
}

export default function RiskAlertsCard({
    alerts,
}: {
    alerts: RiskAlert[]
}) {
    return (
        <section className="min-w-0 rounded-xl border border-white/[0.09] bg-[#11141C] p-5">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#7C8CFF]">
                        Alerts
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-white">
                        Risk Alerts
                    </h2>
                </div>

                <button className="text-xs font-semibold text-[#9AA6FF] hover:text-white">
                    View All Alerts
                </button>
            </div>

            <div className="mt-5 space-y-3">
                {alerts.map((alert) => (
                    <div
                        key={`${alert.ticker}-${alert.title}`}
                        className="rounded-xl border border-white/10 bg-black/20 p-3"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="rounded-md border border-[#7C8CFF]/25 bg-[#7C8CFF]/10 px-2 py-0.5 text-[10px] font-bold text-[#DDE2FF]">
                                        {alert.ticker}
                                    </span>

                                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${severityClass(alert.severity)}`}>
                                        {alert.severity}
                                    </span>
                                </div>

                                <p className="mt-2 text-sm font-bold text-white">
                                    {alert.title}
                                </p>

                                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                                    {alert.description}
                                </p>
                            </div>

                            <p className="shrink-0 text-[10px] text-slate-500">
                                {alert.timeAgo}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

