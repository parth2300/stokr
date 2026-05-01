import { NextResponse } from "next/server"
import {
    ChartRange,
    formatChartData,
    getFinnhubFunction,
} from "../../lib/formatStockChart"

const FINNHUB_BASE = "https://finnhub.io/api/v1"

type CachedChartData = {
  data: {
    ticker: string
    range: ChartRange
    price: number
    changeAmount: number
    changePercent: number
    isPositive: boolean
    chartData: { label: string; price: number }[]
    updatedAt: string
    isFallback?: boolean
    warning?: string
  }
  timestamp: number
}

const chartCache = new Map<string, CachedChartData>()
const CACHE_DURATION_MS = 15 * 60 * 1000 // 15 minutes

function getUnixRange(range: string): { from: number; to: number } {
  const now = Math.floor(Date.now() / 1000)

  const ranges: Record<string, number> = {
    "1D": 60 * 60 * 24,
    "7D": 60 * 60 * 24 * 7,
    "1M": 60 * 60 * 24 * 30,
    "3M": 60 * 60 * 24 * 90,
    "1Y": 60 * 60 * 24 * 365,
  }

  return {
    from: now - ranges[range],
    to: now,
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const ticker = searchParams.get("ticker")
  const range = (searchParams.get("range") as ChartRange) || "1M"

  if (!ticker) {
    return new Response(JSON.stringify({ error: "Missing ticker" }), { status: 400 })
  }

  if (!["1D", "7D", "1M", "3M", "1Y"].includes(range)) {
    return new Response(JSON.stringify({ error: "Invalid range parameter" }), { status: 400 })
  }

  const cacheKey = `${ticker}:${range}`
  const now = Date.now()
  const cached = chartCache.get(cacheKey)

  if (cached && now - cached.timestamp < CACHE_DURATION_MS) {
    return NextResponse.json(cached.data, {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
      },
    })
  }

  const { interval } = getFinnhubFunction(range)
  const { from, to } = getUnixRange(range)
  const apiKey = process.env.FINNHUB_API_KEY

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Missing Finnhub API key" }), { status: 500 })
  }

  try {
    const res = await fetch(
      `${FINNHUB_BASE}/stock/candle?symbol=${ticker}&resolution=${interval || "D"}&from=${from}&to=${to}&token=${apiKey}`
    )

    const data = await res.json()

    if (!res.ok || data?.s !== "ok" || !Array.isArray(data?.t) || !Array.isArray(data?.c)) {
      throw new Error("No chart data")
    }

    const chartData = data.t.map((timestamp: number, i: number) => ({
      price: Number(data.c[i]),
      timestamp,
    }))

    if (chartData.length === 0) {
      throw new Error("No chart data")
    }

    const formattedChartData = formatChartData(chartData, range)

    const first = formattedChartData[0]
    const last = formattedChartData[formattedChartData.length - 1]
    const changeAmount = last.price - first.price
    const changePercent = first.price
      ? (changeAmount / first.price) * 100
      : 0

    const responseData = {
      ticker,
      range,
      price: last.price,
      changeAmount,
      changePercent,
      isPositive: changeAmount >= 0,
      chartData: formattedChartData,
      updatedAt: new Date().toISOString(),
    }

    chartCache.set(cacheKey, {
      data: responseData,
      timestamp: now,
    })

    return NextResponse.json(responseData, {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
      },
    })
  } catch {
    if (cached) {
      return NextResponse.json(
        {
          ...cached.data,
          isFallback: true,
          warning:
            "Showing cached chart data while live market data is temporarily unavailable.",
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900",
          },
        }
      )
    }

    return new Response(
      JSON.stringify({
        error: "Chart failed",
        isFallback: true,
      }),
      { status: 500 }
    )
  }
}
