import { NextResponse } from "next/server"

type SecCompanyTicker = {
  cik_str: number
  ticker: string
  title: string
}

type SecCompanyTickerResponse = Record<string, SecCompanyTicker>

type StockSearchResult = {
  ticker: string
  name: string
  cik: string
}

let cachedCompanies: StockSearchResult[] | null = null
let cachedAt = 0

const CACHE_DURATION_MS = 24 * 60 * 60 * 1000 // 24 hours
const SEC_TICKERS_URL = "https://www.sec.gov/files/company_tickers.json"

function padCik(cik: number | string) {
  return String(cik).padStart(10, "0")
}

async function getCompanies() {
  const now = Date.now()

  if (cachedCompanies && now - cachedAt < CACHE_DURATION_MS) {
    return cachedCompanies
  }

  const userAgent = process.env.SEC_USER_AGENT

  if (!userAgent) {
    throw new Error("Missing SEC_USER_AGENT")
  }

  const res = await fetch(SEC_TICKERS_URL, {
    headers: {
      "User-Agent": userAgent,
      Accept: "application/json",
    },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch SEC ticker list")
  }

  const data = (await res.json()) as SecCompanyTickerResponse

  cachedCompanies = Object.values(data).map((company) => ({
    ticker: company.ticker,
    name: company.title,
    cik: padCik(company.cik_str),
  }))

  cachedAt = now

  return cachedCompanies
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q")?.trim().toLowerCase() || ""

    if (query.length < 2) {
      return NextResponse.json({ results: [] })
    }

    const companies = await getCompanies()

    const results = companies
      .filter((company) => {
        const ticker = company.ticker.toLowerCase()
        const name = company.name.toLowerCase()

        return ticker.startsWith(query) || name.includes(query)
      })
      .slice(0, 8)

    return NextResponse.json(
      { results },
      {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400",
        },
      }
    )
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to search stocks",
      },
      { status: 500 }
    )
  }
}