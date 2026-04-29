"use client"

import { useMemo, useState } from "react"
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"
import { applePriceHistory, ChartRange } from "../../lib/mock/appleAnalytics"

const ranges: ChartRange[] = ["1D", "7D", "1M", "3M", "1Y"]

export default function StockPriceChart() {
    const [selectedRange, setSelectedRange] = useState<ChartRange>("1M")

    const chartData = applePriceHistory[selectedRange]

    const summary = useMemo(() => {
        const first = chartData[0]?.price ?? 0
        const last = chartData[chartData.length - 1]?.price ?? 0
        const difference = last - first
        const percent = first ? (difference / first) * 100 : 0

        return {
            difference,
            percent,
            first,
            last,
            isPositive: difference >= 0,
        }
    }, [chartData])

    return (
        <div className="rounded-[30px] border border-[#7C9DFF]/60 bg-white/[0.05] p-5 shadow-[0_0_22px_rgba(124,157,255,0.14)] backdrop-blur-xl">
            <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
                        Price Action
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-white">Stock Performance</h2>
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

            <div className="mb-5 flex items-end gap-4">
                <div>
                    <p className="text-3xl font-bold text-white">${summary.last.toFixed(2)}</p>
                    <p
                        className={`mt-1 text-sm font-semibold ${summary.isPositive ? "text-emerald-400" : "text-red-400"
                            }`}
                    >
                        {summary.isPositive ? "+" : ""}
                        {summary.difference.toFixed(2)} ({summary.isPositive ? "+" : ""}
                        {summary.percent.toFixed(2)}%) • {selectedRange}
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

                        <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
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
                                const price = typeof value === "number" ? value : Number(value)
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
        </div>
    )
}