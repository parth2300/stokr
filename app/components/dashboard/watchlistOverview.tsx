import Link from "next/link"
import { WatchlistStock } from "@/app/lib/dashboardTypes"

function changeClass(direction: WatchlistStock["dailyChangeDirection"]) {
  return direction === "up" ? "text-emerald-300" : "text-red-300"
}

export default function WatchlistOverview({
  stocks,
}: {
  stocks: WatchlistStock[]
}) {
  const previewStocks = stocks.slice(0, 5)

  return (
   <section className="min-w-0 rounded-xl border border-white/[0.09] bg-[#0D1118] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="stokr-kicker">
            Research Tracker
          </p>

          <h2 className="mt-1 text-xl font-bold text-white">
            Saved Companies
          </h2>
        </div>
      </div>

      <div className="mt-5 divide-y divide-white/[0.07] border-y border-white/[0.07]">
        {previewStocks.map((stock) => {
          const hasCompanyName = stock.companyName && stock.companyName !== "Company name pending"
          const hasPrice = stock.price && stock.price !== "Pending"
          const hasChange = stock.dailyChange && stock.dailyChange !== "Pending"

          return (
          <article
            key={stock.ticker}
            className="py-3"
          >
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center">
              <div className="min-w-0">
                <Link
                  href={`/stocks/${stock.ticker.toLowerCase()}-stock-analysis`}
                  className="font-mono text-lg font-semibold text-white hover:text-[#19C37D]"
                >
                  {stock.ticker}
                </Link>
                {hasCompanyName && (
                  <p className="mt-1 break-words text-sm leading-5 text-[#A7ADBA]">
                    {stock.companyName}
                  </p>
                )}
              </div>

              <div className="min-h-5 text-left text-xs sm:text-right">
                {hasPrice && <p className="font-semibold text-white">{stock.price}</p>}
                {hasChange && (
                  <p className={`mt-1 font-semibold ${changeClass(stock.dailyChangeDirection)}`}>
                    {stock.dailyChange}
                  </p>
                )}
              </div>

              <Link
                href={`/stocks/${stock.ticker.toLowerCase()}-stock-analysis`}
                className="inline-flex min-h-9 items-center justify-center rounded-md border border-white/[0.10] bg-[#0B0F16] px-3 py-2 text-xs font-medium text-[#CBD5E1] transition hover:border-white/[0.16] hover:bg-[#111722]"
              >
                Open
              </Link>
            </div>
          </article>
          )
        })}
      </div>

      <Link href="/watchlist" className="stokr-button-secondary mt-5 w-full">
        View all saved companies
      </Link>
    </section>
  )
}

