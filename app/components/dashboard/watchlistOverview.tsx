import Link from "next/link"
import { WatchlistStock } from "@/app/lib/dashboardTypes"

function changeClass(direction: WatchlistStock["dailyChangeDirection"]) {
  return direction === "up" ? "text-emerald-300" : "text-red-300"
}

function scoreColor(score: number) {
  if (score >= 80) return "bg-emerald-500/20 text-emerald-300"
  if (score >= 60) return "bg-yellow-500/20 text-yellow-300"
  return "bg-red-500/20 text-red-300"
}

function ScorePill({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`min-w-7 rounded-md px-2 py-0.5 text-center text-[10px] font-bold ${scoreColor(score)}`}>
        {score}
      </span>

      <div className="h-1.5 w-10 rounded-full bg-white/10">
        <div
          className="h-1.5 rounded-full bg-[#7C9DFF]"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}

export default function WatchlistOverview({
  stocks,
}: {
  stocks: WatchlistStock[]
}) {
  return (
   <section className="flex h-[520px] min-w-0 flex-col overflow-hidden rounded-[26px] border border-[#7C9DFF]/40 bg-white/[0.045] p-5 shadow-[0_0_20px_rgba(124,157,255,0.10)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
            Watchlist
          </p>

          <h2 className="mt-1 text-xl font-bold text-white">
            Watchlist Overview
          </h2>
        </div>

        <Link
          href="/watchlist"
          className="rounded-lg border border-[#7C9DFF]/35 bg-[#7C9DFF]/10 px-3 py-1.5 text-xs font-semibold text-blue-100 hover:bg-[#7C9DFF]/20"
        >
          View Watchlist
        </Link>
      </div>

      <div className="stokr-scrollbar mt-5 min-h-0 flex-1 overflow-auto pr-2">
        <table className="w-full min-w-[760px] text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.18em] text-slate-400">
              <th className="pb-3">Ticker</th>
              <th className="pb-3">Price</th>
              <th className="pb-3">Daily Change</th>
              <th className="pb-3">AI Health</th>
              <th className="pb-3">Financial</th>
              <th className="pb-3">Valuation</th>
              <th className="pb-3 text-right">Updated</th>
            </tr>
          </thead>

          <tbody>
            {stocks.map((stock) => (
              <tr key={stock.ticker} className="border-b border-white/6 last:border-b-0">
                <td className="py-3">
                  <Link
                    href={`/stocks/${stock.ticker.toLowerCase()}-stock-analysis`}
                    className="font-bold text-white hover:text-[#9DB6FF]"
                  >
                    {stock.ticker}
                  </Link>
                  <p className="mt-1 text-[10px] text-slate-400">{stock.companyName}</p>
                </td>

                <td className="py-3 font-semibold text-slate-200">
                  {stock.price}
                </td>

                <td className={`py-3 font-bold ${changeClass(stock.dailyChangeDirection)}`}>
                  {stock.dailyChange}
                </td>

                <td className="py-3">
                  <ScorePill score={stock.aiHealthScore} />
                </td>

                <td className="py-3">
                  <ScorePill score={stock.financialScore} />
                </td>

                <td className="py-3">
                  <ScorePill score={stock.valuationScore} />
                </td>

                <td className="py-3 text-right text-slate-400">
                  {stock.lastUpdated}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 shrink-0 text-center text-[10px] text-slate-500">
        Showing {stocks.length} tracked stocks
      </p>
    </section>
  )
}