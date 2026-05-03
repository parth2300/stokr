import { LeaderboardItem } from "@/app/lib/dashboardTypes"

export default function ScoreLeaderboard({
    items,
}: {
    items: LeaderboardItem[]
}) {
    return (
        <section className="min-w-0 rounded-[26px] border border-[#7C9DFF]/40 bg-white/[0.045] p-5 shadow-[0_0_20px_rgba(124,157,255,0.10)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-2">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
                        Leaderboard
                    </p>

                    <h2 className="mt-1 text-lg font-bold text-white">
                        Score Leaders
                    </h2>
                </div>

                <span className="rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-[10px] text-slate-300">
                    Financial
                </span>
            </div>

            <div className="mt-5 space-y-3">
                {items.map((item) => (
                    <div key={item.ticker} className="grid grid-cols-[18px_44px_1fr_28px] items-center gap-2">
                        <p className="text-[10px] font-bold text-slate-400">{item.rank}</p>

                        <p className="text-[11px] font-bold text-white">{item.ticker}</p>

                        <div className="h-1.5 rounded-full bg-white/10">
                            <div
                                className="h-1.5 rounded-full bg-emerald-400"
                                style={{ width: `${item.score}%` }}
                            />
                        </div>

                        <p className="text-right text-[10px] font-bold text-slate-200">
                            {item.score}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}