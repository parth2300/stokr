import { LeaderboardItem } from "@/app/lib/dashboardTypes"

export default function ScoreLeaderboard({
    items,
}: {
    items: LeaderboardItem[]
}) {
    return (
        <section className="min-w-0 border border-[#222120] bg-[#111111] p-5">
            <div className="flex items-center justify-between gap-2">
                <div>
                    <p className="stokr-kicker">
                        Company Context
                    </p>

                    <h2 className="mt-1 text-lg font-bold text-white">
                        Available research scores
                    </h2>
                </div>

                <p className="text-xs text-[#7B8494]">Context only</p>
            </div>

            <div className="mt-5 space-y-3">
                {items.length === 0 ? (
                    <p className="border border-dashed border-[#2E2D2A] bg-[#0C0C0C] p-5 text-sm leading-6 text-[#9A9690]">
                        Research scores will appear here after briefs are generated.
                    </p>
                ) : items.map((item) => (
                    <div key={item.ticker} className="grid grid-cols-[18px_44px_1fr_28px] items-center gap-2">
                        <p className="font-mono text-[10px] font-bold text-[#3E3D3A]">{item.rank}</p>

                        <p className="text-[11px] font-bold text-white">{item.ticker}</p>

                        <div className="h-1.5 bg-[#222120]">
                            <div
                                className="h-1.5 bg-[#3A7D44]"
                                style={{ width: `${item.score}%` }}
                            />
                        </div>

                        <p className="text-right font-mono text-[10px] font-bold text-[#F0EDE6]">
                            {item.score}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}

