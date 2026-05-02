import { NextResponse } from "next/server"
import { getFinnhubQuote } from "../../lib/finnhub"

const POPULAR_TICKERS = [
  "AAPL",
  "MSFT",
  "NVDA",
  "TSLA",
  "AMZN",
  "GOOGL",
  "META",
  "AMD",
  "NFLX",
  "PLTR",
]

type PopularStock = {
  ticker: string
  price: number
  changeAmount: number
  changePercentage: string
}

type CachedData = {
  stocks: PopularStock[]
  timestamp: number
}

let cachedData: CachedData | null = null

const CACHE_DURATION_MS = 15 * 60 * 1000

export async function GET() {
  try {
    const now = Date.now()

    if (cachedData && now - cachedData.timestamp < CACHE_DURATION_MS) {
      return NextResponse.json(
        {
          stocks: cachedData.stocks,
          source: "cache",
          label: "Popular Stocks",
          description: "Commonly searched stocks",
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
          },
        }
      )
    }

    const stocks = await Promise.all(
      POPULAR_TICKERS.map(async (ticker) => {
        const quote = await getFinnhubQuote(ticker)

        const price = Number(quote.c)
        const changeAmount = Number(quote.d)
        const changePercent = Number(quote.dp)

        return {
          ticker,
          price,
          changeAmount,
          changePercentage: Number.isFinite(changePercent)
            ? `${changePercent.toFixed(2)}%`
            : "0.00%",
        }
      })
    )

    cachedData = {
      stocks,
      timestamp: now,
    }

    return NextResponse.json(
      {
        stocks,
        source: "finnhub",
        label: "Popular Stocks",
        description: "Commonly searched stocks",
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
        },
      }
    )
  } catch (err) {
    if (cachedData) {
      return NextResponse.json({
        stocks: cachedData.stocks,
        source: "cache",
        label: "Popular Stocks",
        description: "Commonly searched stocks",
        warning: "Showing cached market data because live data is unavailable.",
      })
    }

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Failed to fetch popular stocks",
      },
      { status: 500 }
    )
  }
}