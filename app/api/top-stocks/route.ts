import { NextResponse } from "next/server"
import { formatTopStocks } from "@/app/lib/formatTopStocks"
import { getFinnhubFunction, getSeriesKey } from "@/app/lib/formatStockChart" // Ensure this import is correct

const FINNHUB_BASE = "https://finnhub.io/api/v1"  // Define the base URL for Finnhub API

let cachedData: CachedTopStocks | null = null

type CachedTopStocks = {
  stocks: ReturnType<typeof formatTopStocks>
  timestamp: number
}

const CACHE_DURATION_MS = 15 * 60 * 1000 // 15 minutes

export async function GET() {
  const now = Date.now()

  if (cachedData && now - cachedData.timestamp < CACHE_DURATION_MS) {
    return NextResponse.json(
      { stocks: cachedData.stocks },
      {
        headers: {
          "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
        },
      }
    )
  }

  const apiKey = process.env.FINNHUB_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing Finnhub API key" },
      { status: 500 }
    )
  }

  try {
    const res = await fetch(
      `${FINNHUB_BASE}/stock/market/gainers?token=${apiKey}`
    )

    const data = await res.json()

    console.log("Finnhub response:", data)  // Log the response from Finnhub for debugging

    if (!res.ok || !data || !data.data || !Array.isArray(data.data)) {
      if (cachedData) {
        return NextResponse.json(
          {
            stocks: cachedData.stocks,
            warning:
              "Showing cached data because live market data could not be retrieved.",
          },
          {
            headers: {
              "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900",
            },
          }
        )
      }

      return NextResponse.json(
        { error: "Failed to fetch top stocks from Finnhub", details: data.error },
        { status: res.status === 429 ? 429 : 500 }
      )
    }

    const stocks = formatTopStocks(data.data)

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
  } catch (error) {
    console.error("Error fetching top stocks:", error)  // Log the error
    if (cachedData) {
      return NextResponse.json(
        {
          stocks: cachedData.stocks,
          warning:
            "Showing cached data because fresh data failed to load.",
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900",
          },
        }
      )
    }

    return NextResponse.json(
      // { error: "Failed to fetch top stocks from Finnhub", details: error.message },
      { status: 500 }
    )
  }
}