import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/app/lib/supabaseAdmin"
import { getApiUser } from "@/app/lib/apiAuth"
import { getFinnhubProfile, getFinnhubQuote } from "@/app/lib/finnhub"
import { getMarketCache, saveMarketCache } from "@/app/lib/marketCache"
import { getCachedFinancialMetrics } from "@/app/lib/financialMetricsCache"

type StockOverviewResponse = {
  ticker: string
  price: number
  change: number
  changePercent: string
  marketCap: string
  companyName: string
  updatedAt: string
  source?: "finnhub" | "cache"
}

type FinancialMetricsResponse = {
  companyName?: string
  financialScore?: number
  valuationScore?: number
  finalFundamentalScore?: number
}

function formatMarketCap(value: string | number | undefined) {
  if (value === undefined || value === null) return "Pending"

  const numberValue = Number(value)

  if (Number.isNaN(numberValue)) return "Pending"

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

function formatPrice(price?: number) {
  if (typeof price !== "number" || !Number.isFinite(price)) {
    return "Pending"
  }

  return `$${price.toFixed(2)}`
}

function formatDailyChange(change?: number, changePercent?: string) {
  if (typeof change !== "number" || !Number.isFinite(change) || !changePercent) {
    return "Pending"
  }

  return `${change >= 0 ? "+" : ""}${change.toFixed(2)} (${changePercent})`
}

function getDailyDirection(change?: number): "up" | "down" {
  if (typeof change !== "number" || !Number.isFinite(change)) {
    return "down"
  }

  return change >= 0 ? "up" : "down"
}

async function getOverviewData(ticker: string): Promise<StockOverviewResponse | null> {
  const cached = await getMarketCache({
    ticker,
    type: "overview",
  })

  if (cached) {
    return cached as StockOverviewResponse
  }

  const [quote, profile] = await Promise.all([
    getFinnhubQuote(ticker),
    getFinnhubProfile(ticker),
  ])

  const price = Number(quote.c)
  const previousClose = Number(quote.pc)

  if (!Number.isFinite(price) || price <= 0) {
    return null
  }

  const change = Number.isFinite(Number(quote.d))
    ? Number(quote.d)
    : previousClose
      ? price - previousClose
      : 0

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
    marketCap: formatMarketCap(profile.marketCapitalization),
    companyName: profile.name || ticker,
    updatedAt: new Date().toISOString(),
    source: "finnhub",
  }

  await saveMarketCache({
    ticker,
    type: "overview",
    data: responseData,
  })

  return responseData
}

async function getMetricsData(ticker: string): Promise<FinancialMetricsResponse | null> {
  const cachedMetrics = await getCachedFinancialMetrics(ticker)

  if (!cachedMetrics?.metrics_json) return null

  return cachedMetrics.metrics_json as FinancialMetricsResponse
}

export async function GET(req: Request) {
  try {
    const { user, error: authError } = await getApiUser(req)

    if (authError || !user) {
      return NextResponse.json(
        { error: authError || "Not authenticated" },
        { status: 401 }
      )
    }

    const { data: watchlists, error: watchlistsError } = await supabaseAdmin
      .from("watchlists")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })

    if (watchlistsError) {
      throw new Error(watchlistsError.message)
    }

    if (!watchlists || watchlists.length === 0) {
      return NextResponse.json({
        stocks: [],
        message: "No watchlists found.",
      })
    }

    const defaultWatchlist =
      watchlists.find((watchlist) => watchlist.is_default) || watchlists[0]

    const { data: items, error: itemsError } = await supabaseAdmin
      .from("watchlist_items")
      .select("*")
      .eq("user_id", user.id)
      .eq("watchlist_id", defaultWatchlist.id)
      .order("created_at", { ascending: false })
      .limit(8)

    if (itemsError) {
      throw new Error(itemsError.message)
    }

    if (!items || items.length === 0) {
      return NextResponse.json({
        stocks: [],
        message: "No stocks in your default watchlist yet.",
      })
    }

    const stocks = await Promise.all(
      items.map(async (item) => {
        const ticker = String(item.ticker || "").toUpperCase()

        const [overview, metrics] = await Promise.all([
          getOverviewData(ticker),
          getMetricsData(ticker),
        ])

        const aiHealthScore =
          metrics?.finalFundamentalScore ||
          metrics?.financialScore ||
          0

        return {
          ticker,
          companyName:
            overview?.companyName ||
            metrics?.companyName ||
            item.company_name ||
            "Company name pending",
          price: formatPrice(overview?.price),
          dailyChange: formatDailyChange(
            overview?.change,
            overview?.changePercent
          ),
          dailyChangeDirection: getDailyDirection(overview?.change),
          aiHealthScore,
          financialScore: metrics?.financialScore || 0,
          valuationScore: metrics?.valuationScore || 0,
          lastUpdated: overview?.updatedAt ? "Live" : "Cached",
        }
      })
    )

    return NextResponse.json({
      stocks,
      watchlist: {
        id: defaultWatchlist.id,
        name: defaultWatchlist.name,
      },
    })
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Failed to load dashboard watchlist overview",
      },
      { status: 500 }
    )
  }
}