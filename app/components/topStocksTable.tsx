"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

type TopStock = {
    ticker: string
    price: number
    changeAmount: number
    changePercentage: string
    volume: number
}

export default function TopStocksTable() {
    const [stocks, setStocks] = useState<TopStock[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    function formatPrice(price: number) {
        return typeof price === "number" && Number.isFinite(price)
            ? `$${price.toFixed(2)}`
            : "Pending"
    }

    function getStockAnalysisHref(symbol: string) {
        const cleanSymbol = symbol
            .trim()
            .toLowerCase()
            .replace(/\./g, "-")
            .replace(/[^a-z0-9-]/g, "")

        return `/stocks/${cleanSymbol}-stock-analysis`
    }

    useEffect(() => {
        async function loadTopStocks() {
            try {
                const res = await fetch("/api/top-stocks")
                const data = await res.json()

                if (!res.ok) {
                    setError(data.error || "Could not load top stocks")
                    return
                }

                setStocks(data.stocks || [])
            } catch {
                setError("Could not load top stocks")
            } finally {
                setLoading(false)
            }
        }

        loadTopStocks()
    }, [])

    return (
  <div className="w-full max-w-[460px]">
    <div className="stokr-card p-3">
      <div className="mb-3 px-3 pt-1">
        <h2 className="text-lg font-semibold text-[#F4F6FA]">Popular Stocks</h2>
        <p className="text-xs text-[#6F7685]">Commonly searched stocks</p>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_76px_82px] border-b border-white/[0.08] px-3 pb-2 text-xs font-medium uppercase tracking-[0.12em] text-[#6F7685] sm:text-sm sm:normal-case sm:tracking-normal">
        <div>Company</div>
        <div className="text-right">Price</div>
        <div className="text-right">Change</div>
      </div>

      {loading && (
        <div className="px-3 py-8 text-center text-sm text-slate-400">
          Loading stocks...
        </div>
      )}

      {error && (
        <div className="px-3 py-8 text-center text-sm text-red-300">
          {error}
        </div>
      )}

      {!loading && !error && stocks.length === 0 && (
        <div className="px-3 py-8 text-center text-sm text-slate-400">
          No stock data available.
        </div>
      )}

      {!loading &&
        !error &&
        stocks.map((stock) => {
          const isPositive = stock.changeAmount >= 0

          return (
            <Link
              key={stock.ticker}
              href={getStockAnalysisHref(stock.ticker)}
              className="grid min-h-[52px] grid-cols-[minmax(0,1fr)_76px_82px] items-center border-b border-white/10 px-3 text-sm transition hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C8CFF]/60 last:border-b-0"
              aria-label={`Open ${stock.ticker} stock analysis`}
            >
              <div className="min-w-0">
                <p className="font-medium text-[#F4F6FA]">{stock.ticker}</p>
                <p className="truncate text-xs text-[#6F7685]">
                  Vol {stock.volume ? stock.volume.toLocaleString() : "N/A"}
                </p>
              </div>

              <div className="text-right text-[#A3AAB8]">
                {formatPrice(stock.price)}
              </div>

              <div
                className={`text-right font-medium ${
                  isPositive ? "text-[#7BAE8C]" : "text-[#D26A6A]"
                }`}
              >
                {stock.changePercentage}
              </div>
            </Link>
          )
        })}
    </div>

    <p className="mt-3 px-2 text-center text-xs leading-relaxed text-[#6F7685]">
      Market data is cached and refreshed approximately every 15 minutes. This list is curated and not ranked by trading volume.
    </p>
  </div>
)
}

