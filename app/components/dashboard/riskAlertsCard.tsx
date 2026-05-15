import { RiskAlert } from "@/app/lib/dashboardTypes"

function severityClass(severity: RiskAlert["severity"]) {
    switch (severity) {
        case "High":
            return "border-red-400/30 bg-red-500/15 text-red-300"
        case "Medium":
            return "border-yellow-400/30 bg-yellow-500/15 text-yellow-300"
        default:
            return "border-[#2E2D2A] bg-[#161616] text-[#9A9690]"
    }
}

export default function RiskAlertsCard({
    alerts,
}: {
    alerts: RiskAlert[]
}) {
    return (
        <section className="min-w-0 border border-[#222120] bg-[#111111] p-5">
            <div className="flex items-center justify-between">
                <div>
                    <p className="stokr-kicker">
                        Risk Context
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-white">
                        Risk Signals
                    </h2>
                </div>

                <button className="font-mono text-xs uppercase tracking-[0.12em] text-[#D63C2F] hover:text-[#F0EDE6]">
                    Tracked signals
                </button>
            </div>

            <div className="mt-5 space-y-3">
                {alerts.map((alert) => (
                    <div
                        key={`${alert.ticker}-${alert.title}`}
                        className="border border-[#222120] bg-[#0C0C0C] p-3"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="border border-[#2E2D2A] bg-[#161616] px-2 py-0.5 font-mono text-[10px] font-bold text-[#F0EDE6]">
                                        {alert.ticker}
                                    </span>

                                    <span className={`border px-2 py-0.5 font-mono text-[10px] font-bold ${severityClass(alert.severity)}`}>
                                        {alert.severity}
                                    </span>
                                </div>

                                <p className="mt-2 text-sm font-bold text-white">
                                    {alert.title}
                                </p>

                                <p className="mt-1 text-xs leading-relaxed text-[#9A9690]">
                                    {alert.description}
                                </p>
                            </div>

                            <p className="shrink-0 font-mono text-[10px] text-[#3E3D3A]">
                                {alert.timeAgo}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

