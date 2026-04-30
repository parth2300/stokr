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
          `/api/stock-chart?ticker=${encodeURIComponent(
            ticker
          )}&range=${selectedRange}`
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
    <div className="rounded-[30px] border border-[#7C9DFF]/60 bg-white/[0.05] p-5 shadow-[0_0_22px_rgba(124,157,255,0.14)] backdrop-blur-xl">
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
            Price Action
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            {ticker} Stock Performance
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Price trend view with fast-switch intervals.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {ranges.map((range) => {
            const isActive = selectedRange === range

            return (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${isActive
                  ? "bg-[#7C9DFF] text-white shadow-[0_0_18px_rgba(124,157,255,0.28)]"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
              >
                {range}
              </button>
            )
          })}
        </div>
      </div>

      {loading && (
        <div className="flex h-[320px] items-center justify-center rounded-2xl border border-white/10 bg-black/20">
          <p className="text-sm text-slate-400">Loading chart...</p>
        </div>
      )}

      {!loading && error && (
        <div className="flex h-[320px] items-center justify-center rounded-2xl border border-white/10 bg-black/20">
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
              <p className="text-3xl font-bold text-white">
                {chartResponse.isFallback
                  ? "Demo chart"
                  : `$${chartResponse.price.toFixed(2)}`}
              </p>
              <p
                className={`mt-1 text-sm font-semibold ${chartResponse.isPositive ? "text-emerald-400" : "text-red-400"
                  }`}
              >
                {chartResponse.isFallback
                  ? `Fallback data shown • ${selectedRange}`
                  : `${chartResponse.isPositive ? "+" : ""}${chartResponse.changeAmount.toFixed(2)} (${chartResponse.isPositive ? "+" : ""}${chartResponse.changePercent.toFixed(2)}%) • ${selectedRange}`}
              </p>
            </div>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C9DFF" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#7C9DFF" stopOpacity={0.03} />
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

                    return [`$${price.toFixed(2)}`, "Price"]
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#7C9DFF"
                  strokeWidth={3}
                  fill="url(#priceFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            {chartResponse.isFallback
              ? "Demo chart shown because live market data is temporarily unavailable or rate-limited."
              : "Chart data is cached based on range. Intraday prices may be delayed and should not be treated as real-time trading data."}
          </p>
        </>
      )}
    </div>
  )
}