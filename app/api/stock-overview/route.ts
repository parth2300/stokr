import { NextResponse } from "next/server"

type CachedOverview = {
  data: unknown
  timestamp: number
}

const overviewCache = new Map<string, CachedOverview>()

const CACHE_DURATION_MS = 15 * 60 * 1000 // 15 minutes

function isValidTicker(ticker: string) {
  return /^[A-Z]{1,10}$/.test(ticker)
}

function formatMarketCap(value: string | number | undefined) {
  if (!value) return "Pending"

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

    const cached = overviewCache.get(ticker)
    const now = Date.now()

    if (cached && now - cached.timestamp < CACHE_DURATION_MS) {
      return NextResponse.json(cached.data, {
        headers: {
          "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
        },
      })
    }

    const apiKey = process.env.ALPHA_VANTAGE_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing Alpha Vantage API key" },
        { status: 500 }
      )
    }

    const [quoteRes, overviewRes] = await Promise.all([
      fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${apiKey}`
      ),
      fetch(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${apiKey}`
      ),
    ])

    const quoteData = await quoteRes.json()
    const overviewData = await overviewRes.json()

    if (
      quoteData.Note ||
      quoteData.Information ||
      overviewData.Note ||
      overviewData.Information
    ) {
      if (cached) {
        return NextResponse.json(cached.data, {
          headers: {
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900",
          },
        })
      }

      return NextResponse.json(
        { error: "Rate limit reached. Try again later." },
        { status: 429 }
      )
    }

    const quote = quoteData["Global Quote"]

    if (!quote) {
      return NextResponse.json(
        { error: "No quote data found" },
        { status: 404 }
      )
    }

    const responseData = {
      ticker,
      price: Number(quote["05. price"]),
      change: Number(quote["09. change"]),
      changePercent: quote["10. change percent"] || "Pending",
      marketCap: formatMarketCap(overviewData.MarketCapitalization),
      companyName: overviewData.Name || ticker,
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
    return NextResponse.json(
      { error: "Failed to fetch stock overview" },
      { status: 500 }
    )
  }
}