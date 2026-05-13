"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import InfoTooltip from "@/app/components/ui/InfoTooltip"

type ChartRange = "1D" | "7D" | "1M" | "3M" | "1Y"

type ChartPoint = {
  label: string
  price: number
}

type StockChartResponse = {
  ticker: string
  range: ChartRange
  price: number
  changeAmount: number
  changePercent: number
  isPositive: boolean
  chartData: ChartPoint[]
  updatedAt: string
  isFallback?: boolean
}

const ranges: ChartRange[] = ["1D", "7D", "1M", "3M", "1Y"]

export default function StockPriceChart({ ticker }: { ticker: string }) {
  const [selectedRange, setSelectedRange] = useState<ChartRange>("1M")
  const [chartResponse, setChartResponse] = useState<StockChartResponse | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadChartData() {
      try {
        setLoading(true)
        setError("")

        const res = await fetch(
          `/api/stock-chart?ticker=${encodeURIComponent(ticker)}&range=${selectedRange}`
        )
        const data = await res.json()

        if (!res.ok) {
          setError(data.error || "Could not load chart data")
          return
        }

        setChartResponse(data)
      } catch {
        setError("Could not load chart data")
      } finally {
        setLoading(false)
      }
    }

    loadChartData()
  }, [ticker, selectedRange])

  const chartData = useMemo(() => {
    return chartResponse?.chartData || []
  }, [chartResponse])

  return (
    <div className="stokr-card min-w-0 p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#19C37D]">
              Price Action
            </p>
            <InfoTooltip
              label="Explain price chart"
              title="Price Chart"
              body="Shows cached price movement by range. Intraday prices may be delayed and are informational research context only."
            />
          </div>
          <h2 className="mt-2 break-words text-2xl font-semibold text-white">
            {ticker} Stock Performance
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Price trend view with fast-switch intervals.
          </p>
        </div>

            <div className="flex w-full flex-wrap gap-1.5 md:w-auto md:justify-end">
          {ranges.map((range) => {
            const isActive = selectedRange === range

            return (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={`min-w-0 rounded-md px-3 py-2 text-sm font-semibold transition sm:px-4 ${isActive
                  ? "bg-[#19C37D] text-[#05070A]"
                  : "border border-white/[0.08] bg-[#151923] text-[#A3AAB8] hover:bg-[#191E29] hover:text-white"
                  }`}
              >
                {range}
              </button>
            )
          })}
        </div>
      </div>

      {loading && (
        <div className="flex h-[320px] items-center justify-center rounded-lg border border-white/10 bg-black/20">
          <div className="text-center">
            <p className="font-semibold text-white">Loading chart</p>
            <p className="mt-2 text-sm text-slate-400">Fetching cached range data for {ticker}.</p>
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="flex h-[320px] items-center justify-center rounded-lg border border-white/10 bg-black/20 p-5">
          <div className="text-center">
            <p className="font-semibold text-white">Chart unavailable</p>
            <p className="mt-2 text-sm text-slate-400">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && chartResponse && (
        <>
          <div className="mb-5 flex items-end gap-4">
            <div>
              <p className="text-3xl font-semibold text-white">
                {chartResponse.isFallback
                  ? "Unavailable"
                  : typeof chartResponse.price === "number" &&
                    Number.isFinite(chartResponse.price)
                  ? `$${chartResponse.price.toFixed(2)}`
                  : "Pending"}
              </p>
              <p
                className={`mt-1 text-sm font-semibold ${chartResponse.isPositive ? "text-emerald-400" : "text-red-400"
                  }`}
              >
                {chartResponse.isFallback
                  ? `Live chart unavailable - ${selectedRange}`
                  : `${chartResponse.isPositive ? "+" : ""}${
                      Number.isFinite(chartResponse.changeAmount)
                        ? chartResponse.changeAmount.toFixed(2)
                        : "0.00"
                    } (${chartResponse.isPositive ? "+" : ""}${
                      Number.isFinite(chartResponse.changePercent)
                        ? chartResponse.changePercent.toFixed(2)
                        : "0.00"
                    }%) - ${selectedRange}`}
              </p>
            </div>
          </div>

          {chartResponse.isFallback ? (
            <div className="flex h-[320px] items-center justify-center rounded-lg border border-white/10 bg-black/20 p-6 text-center">
              <p className="max-w-md text-sm leading-relaxed text-slate-400">
                Live chart data is not available for this range right now.
                Price trend visuals will appear when verified market data returns.
              </p>
            </div>
          ) : (
          <div className="h-[320px] w-full min-w-0 overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#19C37D" stopOpacity={0.38} />
                    <stop offset="95%" stopColor="#19C37D" stopOpacity={0.03} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="rgba(148, 163, 184, 0.12)"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#94A3B8", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={["dataMin - 2", "dataMax + 2"]}
                  tick={{ fill: "#94A3B8", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={52}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15, 23, 42, 0.96)",
                    border: "1px solid rgba(124, 157, 255, 0.4)",
                    borderRadius: "14px",
                    color: "#fff",
                  }}
                  formatter={(value) => {
                    const price =
                      typeof value === "number" ? value : Number(value)

                    return [
                      Number.isFinite(price) ? `$${price.toFixed(2)}` : "Pending",
                      "Price",
                    ]
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#19C37D"
                  strokeWidth={3}
                  fill="url(#priceFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          )}

          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            {chartResponse.isFallback
              ? "Live market data is temporarily unavailable or rate-limited, so stokr is not implying a trend."
              : "Chart data is cached based on range. Intraday prices may be delayed and should not be treated as real-time trading data."}
          </p>
        </>
      )}
    </div>
  )
}

