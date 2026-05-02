// src/pages/api/stock-overview.ts
import { NextResponse } from "next/server"
import { getFinnhubProfile, getFinnhubQuote, isValidTicker } from "../../lib/finnhub"
import { getMarketCache, saveMarketCache } from "../../lib/marketCache"

type StockOverviewResponse = {
  ticker: string
  price: number
  change: number
  changePercent: string
  marketCap: string
  companyName: string
  updatedAt: string
  source?: "finnhub" | "cache"
  warning?: string
}

type CachedOverview = {
  data: StockOverviewResponse
  timestamp: number
}

const overviewCache = new Map<string, CachedOverview>()
const CACHE_DURATION_MS = 60 * 1000 // 1 min

function formatMarketCap(value: string | number | undefined) {
  if (value === undefined || value === null) return "Pending"

  const numberValue = Number(value)

  if (Number.isNaN(numberValue)) return "Pending"

  // Finnhub profile2 returns marketCapitalization in millions.
  const marketCapUsd = numberValue * 1_000_000

  if (marketCapUsd >= 1_000_000_000_000) {
    return `$${(marketCapUsd / 1_000_000_000_000).toFixed(2)}T`
  }

  if (marketCapUsd >= 1_000_000_000) {
    return `$${(marketCapUsd / 1_000_000_000).toFixed(2)}B`
  }

  if (marketCapUsd >= 1_000_000) {
    return `$${(marketCapUsd / 1_000_000).toFixed(2)}M`
  }

  return `$${marketCapUsd.toLocaleString()}`
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const ticker = searchParams.get("ticker")?.trim().toUpperCase()

    if (!ticker) {
      return NextResponse.json({ error: "Missing ticker" }, { status: 400 })
    }

    if (!isValidTicker(ticker)) {
      return NextResponse.json({ error: "Invalid ticker" }, { status: 400 })
    }

    const now = Date.now()

    // Check for cached data in Supabase
    const supabaseCached = await getMarketCache({
      ticker,
      type: "overview",
    })

    if (supabaseCached) {
      console.log("Cache hit:", supabaseCached)  // Added log for cache hit
      return NextResponse.json({
        ...supabaseCached,
        source: "cache",
      })
    } else {
      console.log("Cache miss: Fetching new data...")  // Added log for cache miss
    }

    // Check for memory cache
    const memoryCached = overviewCache.get(ticker)

    if (memoryCached && now - memoryCached.timestamp < CACHE_DURATION_MS) {
      console.log("Memory cache hit:", memoryCached)  // Log for memory cache hit
      return NextResponse.json({
        ...memoryCached.data,
        source: "cache",
      })
    }

    // Fetch live data from Finnhub
    const [quote, profile] = await Promise.all([getFinnhubQuote(ticker), getFinnhubProfile(ticker)])

    const price = Number(quote.c)
    const previousClose = Number(quote.pc)

    if (!Number.isFinite(price) || price <= 0) {
      throw new Error("No quote data found for this ticker")
    }

    const change = Number.isFinite(Number(quote.d)) ? Number(quote.d) : previousClose ? price - previousClose : 0
    const changePercent = Number.isFinite(Number(quote.dp))
      ? `${Number(quote.dp).toFixed(2)}%`
      : previousClose
        ? `${((change / previousClose) * 100).toFixed(2)}%`
        : "0.00%"

    const responseData: StockOverviewResponse = {
      ticker,
      price,
      change,
      changePercent,
      marketCap: formatMarketCap(profile.marketCapitalization),  // Ensure this is being set correctly
      companyName: profile.name || ticker,
      updatedAt: new Date().toISOString(),
      source: "finnhub",
    }

    // Cache the data in Supabase
    await saveMarketCache({
      ticker,
      type: "overview",
      data: responseData,
    })

    // Cache the data in memory
    overviewCache.set(ticker, {
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

    if (ticker && isValidTicker(ticker)) {
      const cached = await getMarketCache({
        ticker,
        type: "overview",
      })

      if (cached) {
        return NextResponse.json({
          ...cached,
          source: "cache",
        })
      }
    }

    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to fetch Finnhub overview data",
      },
      { status: 503 }
    )
  }
}