import { NextResponse } from "next/server"
import { getCompanyByTicker, getCompanyFacts } from "../../../lib/secEdgar"
import { extractFinancialMetrics } from "../../../lib/secMetrics"

import {
  getCachedFinancialMetrics,
  saveCachedFinancialMetrics,
} from "../../../lib/financialMetricsCache"


const metricsCache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000

function isValidTicker(ticker: string) {
  return /^[A-Z]{1,10}$/.test(ticker)
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

    const cached = metricsCache.get(ticker)
    const now = Date.now()

    if (cached && now - cached.timestamp < CACHE_DURATION_MS) {
      return NextResponse.json(cached.data, {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400",
        },
      })
    }

    const company = await getCompanyByTicker(ticker)

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 })
    }

    const facts = await getCompanyFacts(company.cik)

    const cachedMetrics = await getCachedFinancialMetrics(ticker)

    if (cachedMetrics) {
      return NextResponse.json(cachedMetrics.metrics_json, {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400",
        },
      })
    }

    const metrics = extractFinancialMetrics({
      ticker,
      cik: company.cik,
      facts,
    })

    await saveCachedFinancialMetrics({
      ticker,
      companyName: metrics.companyName,
      cik: company.cik,
      metricsJson: metrics,
    })

    metricsCache.set(ticker, {
      data: metrics,
      timestamp: now,
    })

    return NextResponse.json(metrics, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400",
      },
    })
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to fetch SEC metrics",
      },
      { status: 500 }
    )
  }
}