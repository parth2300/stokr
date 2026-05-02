import { NextResponse } from "next/server"
import {
  ChartRange,
  calculatePriceSummary,
  formatChartData,
  getFinnhubResolution,
  getUnixRange,
  RawChartPoint,
} from "../../lib/formatStockChart"
import { getFinnhubCandles, isValidTicker } from "../../lib/finnhub"
import { getMarketCache, saveMarketCache } from "../../lib/marketCache"

type StockChartResponse = {
  ticker: string
  range: ChartRange
  price: number
  changeAmount: number
  changePercent: number
  isPositive: boolean
  chartData: { label: string; price: number }[]
  updatedAt: string
  warning?: string
}

type CachedChartData = {
  data: StockChartResponse
  timestamp: number
}

const chartCache = new Map<string, CachedChartData>()

const CACHE_DURATION_BY_RANGE: Record<ChartRange, number> = {
  "1D": 5 * 60 * 1000,
  "7D": 15 * 60 * 1000,
  "1M": 60 * 60 * 1000,
  "3M": 6 * 60 * 60 * 1000,
  "1Y": 12 * 60 * 60 * 1000,
}

function isValidRange(range: string): range is ChartRange {
  return ["1D", "7D", "1M", "3M", "1Y"].includes(range)
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const ticker = searchParams.get("ticker")?.trim().toUpperCase()
    const rangeParam = searchParams.get("range")?.trim().toUpperCase() || "1M"

    if (!ticker) {
      return NextResponse.json({ error: "Missing ticker" }, { status: 400 })
    }

    if (!isValidTicker(ticker)) {
      return NextResponse.json({ error: "Invalid ticker" }, { status: 400 })
    }

    if (!isValidRange(rangeParam)) {
      return NextResponse.json({ error: "Invalid range" }, { status: 400 })
    }

    const supabaseCached = await getMarketCache({
      ticker,
      type: "chart",
      range: rangeParam,
    })

    if (supabaseCached) {
      return NextResponse.json({
        ...supabaseCached,
        source: "cache",
      })
    }

    const cacheKey = `${ticker}:${rangeParam}`
    const now = Date.now()
    const memoryCached = chartCache.get(cacheKey)

    if (memoryCached && now - memoryCached.timestamp < CACHE_DURATION_BY_RANGE[rangeParam]) {
      return NextResponse.json({
        ...memoryCached.data,
        source: "cache",
      })
    }

    const { from, to } = getUnixRange(rangeParam)
    const resolution = getFinnhubResolution(rangeParam)

    const rawData = await getFinnhubCandles({
      ticker,
      resolution,
      from,
      to,
    })

    if (
      rawData.s !== "ok" ||
      !Array.isArray(rawData.t) ||
      !Array.isArray(rawData.c) ||
      rawData.t.length === 0 ||
      rawData.c.length === 0
    ) {
      throw new Error("No chart data found for this ticker")
    }

    const rawChartData: RawChartPoint[] = rawData.t.map((timestamp, index) => ({
      timestamp,
      price: Number(rawData.c?.[index] ?? 0),
    }))

    const chartData = formatChartData(rawChartData, rangeParam)
    const summary = calculatePriceSummary(chartData)

    const responseData: StockChartResponse = {
      ticker,
      range: rangeParam,
      price: summary.price,
      changeAmount: summary.changeAmount,
      changePercent: summary.changePercent,
      isPositive: summary.isPositive,
      chartData,
      updatedAt: new Date().toISOString(),
    }

    await saveMarketCache({
      ticker,
      type: "chart",
      range: rangeParam,
      data: responseData,
    })

    chartCache.set(cacheKey, {
      data: responseData,
      timestamp: now,
    })

    return NextResponse.json(responseData, {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
      },
    })
  } catch (err) {
    const { searchParams } = new URL(req.url)
    const ticker = searchParams.get("ticker")?.trim().toUpperCase()
    const rangeParam = searchParams.get("range")?.trim().toUpperCase() || "1M"
    const cacheKey = ticker ? `${ticker}:${rangeParam}` : ""
    const cached = chartCache.get(cacheKey)

    if (cached) {
      return NextResponse.json(
        {
          ...cached.data,
          warning:
            "Showing cached chart data while Finnhub market data is temporarily unavailable.",
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900",
          },
        }
      )
    }

    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to fetch Finnhub chart data",
      },
      { status: 503 }
    )
  }
}
