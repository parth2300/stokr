import { NextResponse } from "next/server"

type CachedOverview = {
  data: {
    ticker: string
    price: number
    change: number
    changePercent: string
    marketCap: string
    companyName: string
    updatedAt: string
  }
  timestamp: number
}

const overviewCache = new Map<string, CachedOverview>()

const CACHE_DURATION_MS = 15 * 60 * 1000 // 15 minutes

function isValidTicker(ticker: string) {
  return /^[A-Z]{1,10}$/.test(ticker)
}

function formatMarketCap(value: string | number | undefined) {
  if (value === undefined || value === null) return "Pending"

  const numberValue = Number(value)

  if (Number.isNaN(numberValue)) return "Pending"

  if (numberValue >= 1_000_000_000_000) {
    return `$${(numberValue / 1_000_000_000_000).toFixed(2)}T`
  }

  if (numberValue >= 1_000_000_000) {
    return `$${(numberValue / 1_000_000_000).toFixed(2)}B`
  }

  if (numberValue >= 1_000_000) {
    return `$${(numberValue / 1_000_000).toFixed(2)}M`
  }

  return `$${numberValue.toLocaleString()}`
}

const FINNHUB_BASE = "https://finnhub.io/api/v1"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const ticker = searchParams.get("ticker")?.toUpperCase()

  if (!ticker || !isValidTicker(ticker)) {
    return new Response(JSON.stringify({ error: "Missing or invalid ticker" }), { status: 400 })
  }

  const now = Date.now()
  const cachedOverview = overviewCache.get(ticker)

  if (cachedOverview && now - cachedOverview.timestamp < CACHE_DURATION_MS) {
    return NextResponse.json(cachedOverview.data, {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
      },
    })
  }

  const apiKey = process.env.FINNHUB_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing Finnhub API key" },
      { status: 500 }
    )
  }

  try {
    const [quoteRes, profileRes] = await Promise.all([
      fetch(`${FINNHUB_BASE}/quote?symbol=${ticker}&token=${apiKey}`),
      fetch(`${FINNHUB_BASE}/stock/profile2?symbol=${ticker}&token=${apiKey}`),
    ])

    const [quote, profile] = await Promise.all([quoteRes.json(), profileRes.json()])

    if (!quoteRes.ok || !profileRes.ok || quote?.c === undefined || quote?.pc === undefined) {
      throw new Error("No price data")
    }

    const price = Number(quote.c)
    const prevClose = Number(quote.pc)
    const change = Number(price - prevClose)
    const changePercent = prevClose
      ? `${((change / prevClose) * 100).toFixed(2)}%`
      : "0.00%"

    const responseData = {
      ticker,
      price,
      change,
      changePercent,
      marketCap: formatMarketCap(profile?.marketCapitalization),
      companyName: profile?.name || ticker,
      updatedAt: new Date().toISOString(),
    }

    overviewCache.set(ticker, {
      data: responseData,
      timestamp: now,
    })

    return NextResponse.json(responseData, {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
      },
    })
  } catch {
    if (cachedOverview) {
      return NextResponse.json(
        {
          ...cachedOverview.data,
          warning:
            "Showing cached data while live market data could not be retrieved.",
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900",
          },
        }
      )
    }

    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    )
  }
}
