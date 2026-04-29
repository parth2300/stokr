import { NextResponse } from "next/server"
import { formatTopStocks } from "@/app/lib/formatTopStocks"

type CachedTopStocks = {
  stocks: ReturnType<typeof formatTopStocks>
  timestamp: number
}

let cachedData: CachedTopStocks | null = null

const CACHE_DURATION_MS = 15 * 60 * 1000 // 15 minutes

export async function GET() {
  try {
    const now = Date.now()

    if (cachedData && now - cachedData.timestamp < CACHE_DURATION_MS) {
      console.log("Serving cached top stocks:", new Date().toISOString())

      return NextResponse.json(
        { stocks: cachedData.stocks },
        {
          headers: {
            "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
          },
        }
      )
    }

    console.log("Fetching fresh Alpha Vantage data:", new Date().toISOString())

    const apiKey = process.env.ALPHA_VANTAGE_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing Alpha Vantage API key" },
        { status: 500 }
      )
    }

    const res = await fetch(
      `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${apiKey}`
    )

    const data = await res.json()

    if (data.Note || data.Information) {
      if (cachedData) {
        return NextResponse.json(
          {
            stocks: cachedData.stocks,
            warning: "Showing cached data because the API rate limit was reached.",
          },
          {
            headers: {
              "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900",
            },
          }
        )
      }

      return NextResponse.json(
        { error: "Rate limit reached. Try again later." },
        { status: 429 }
      )
    }

    const stocks = formatTopStocks(data.most_actively_traded || [])

    cachedData = {
      stocks,
      timestamp: now,
    }

    return NextResponse.json(
      { stocks },
      {
        headers: {
          "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
        },
      }
    )
  } catch {
    if (cachedData) {
      return NextResponse.json({
        stocks: cachedData.stocks,
        warning: "Showing cached data because fresh data failed to load.",
      })
    }

    return NextResponse.json(
      { error: "Failed to fetch top stocks" },
      { status: 500 }
    )
  }
}