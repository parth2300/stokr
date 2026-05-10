import Link from "next/link"

const relatedStocks: Record<string, string[]> = {
  NVDA: ["AMD", "AVGO", "MSFT", "GOOGL", "TSM", "INTC"],
  AAPL: ["MSFT", "GOOGL", "META", "AMZN"],
  TSLA: ["RIVN", "GM", "F", "NIO"],
  MSFT: ["GOOGL", "AMZN", "NVDA", "AAPL"],
  AMZN: ["WMT", "MSFT", "GOOGL", "SHOP"],
  GOOGL: ["META", "MSFT", "AMZN"],
  META: ["GOOGL", "SNAP", "PINS"],
  AMD: ["NVDA", "INTC", "AVGO", "QCOM"],
}

const defaultRelatedStocks = ["AAPL", "MSFT", "NVDA", "AMZN", "GOOGL"]

export default function RelatedStocks({ ticker }: { ticker: string }) {
  const normalizedTicker = ticker.trim().toUpperCase()
  const stocks =
    relatedStocks[normalizedTicker]?.filter((symbol) => symbol !== normalizedTicker) ||
    defaultRelatedStocks.filter((symbol) => symbol !== normalizedTicker)

  return (
    <section className="mt-8 mb-16">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
            Explore More
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            Related stock research
          </h2>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stocks.map((symbol) => (
          <Link
            key={symbol}
            href={`/stocks/${symbol.toLowerCase()}`}
            className="rounded-xl border border-white/[0.08] bg-[#11141C] px-5 py-4 text-sm font-semibold text-[#DDE2FF] transition hover:border-[#7C9DFF]/40 hover:bg-[#151923]"
          >
            {symbol} Stock Analysis
          </Link>
        ))}
      </div>
    </section>
  )
}
