"use client"

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
    <div className="rounded-[28px] border border-[#7C9DFF]/70 bg-white/[0.03] p-3 shadow-[0_0_18px_rgba(124,157,255,0.16)] backdrop-blur-xl">
      <div className="mb-3 px-3">
        <h2 className="text-xl font-bold text-blue-100">Top 10 Active Today</h2>
        <p className="text-xs text-slate-400">Most actively traded stocks</p>
      </div>

      <div className="grid grid-cols-[1fr_80px_90px] border-b border-[#7C9DFF]/55 px-3 pb-2 text-sm font-bold text-blue-100">
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
            <div
              key={stock.ticker}
              className="grid min-h-[46px] grid-cols-[1fr_80px_90px] items-center border-b border-[#7C9DFF]/30 px-3 text-sm last:border-b-0"
            >
              <div>
                <p className="font-semibold text-white">{stock.ticker}</p>
                <p className="text-xs text-slate-500">
                  Vol {stock.volume.toLocaleString()}
                </p>
              </div>

              <div className="text-right text-slate-200">
                ${stock.price.toFixed(2)}
              </div>

              <div
                className={`text-right font-medium ${
                  isPositive ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {stock.changePercentage}
              </div>
            </div>
          )
        })}
    </div>

    <p className="mt-3 px-2 text-center text-xs leading-relaxed text-slate-500">
      Market data is cached and refreshed approximately every 15 minutes. Prices may be delayed and should not be treated as real-time trading data.
    </p>
  </div>
)
}