import { NextResponse } from "next/server"
import { getCompanyByTicker, getCompanyFacts } from "../../../lib/secEdgar"
import {
  calculateSecFinancialScore,
  calculateMarketValuationScore,
  extractFinancialMetrics,
} from "../../../lib/secMetrics"

import {
  getCachedFinancialMetrics,
  saveCachedFinancialMetrics,
} from "../../../lib/financialMetricsCache"
import { getFinnhubProfile } from "../../../lib/finnhub"

const metricsCache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000

function isValidTicker(ticker: string) {
  return /^[A-Z]{1,10}$/.test(ticker)
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const ticker = searchParams.get("ticker")?.trim().toUpperCase()

  try {
    if (!ticker) {
      return NextResponse.json({ error: "Missing ticker" }, { status: 400 })
    }

    if (!isValidTicker(ticker)) {
      return NextResponse.json({ error: "Invalid ticker" }, { status: 400 })
    }

    const cached = metricsCache.get(ticker)
    const now = Date.now()

    if (cached && now - cached.timestamp < CACHE_DURATION_MS) {
      return NextResponse.json(
        {
          ...(cached.data as object),
          source: "memory-cache",
        },
        {
          headers: {
            "Cache-Control":
              "public, s-maxage=86400, stale-while-revalidate=86400",
          },
        }
      )
    }

    const cachedMetrics = await getCachedFinancialMetrics(ticker)

    if (cachedMetrics?.metrics_json) {
      metricsCache.set(ticker, {
        data: cachedMetrics.metrics_json,
        timestamp: now,
      })

      return NextResponse.json(
        {
          ...(cachedMetrics.metrics_json as object),
          source: "supabase-cache",
        },
        {
          headers: {
            "Cache-Control":
              "public, s-maxage=86400, stale-while-revalidate=86400",
          },
        }
      )
    }

    const company = await getCompanyByTicker(ticker)

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 })
    }

    const facts = await getCompanyFacts(company.cik)

    const metrics = extractFinancialMetrics({
      ticker,
      cik: company.cik,
      facts,
    })

    const revenue = Number(metrics.revenue?.rawValue ?? 0)
    const netIncome = Number(metrics.netIncome?.rawValue ?? 0)
    const freeCashFlow = Number(metrics.freeCashFlow?.rawValue ?? 0)
    const totalDebt = Number(metrics.totalDebt?.rawValue ?? 0)
    const profile = await getFinnhubProfile(ticker)

    const marketCapitalizationInMillions = Number(profile.marketCapitalization)

    const marketCap =
      Number.isFinite(marketCapitalizationInMillions) &&
        marketCapitalizationInMillions > 0
        ? marketCapitalizationInMillions * 1_000_000
        : 0

    const valuationScore = calculateMarketValuationScore({
      marketCap,
      revenue,
      netIncome,
      freeCashFlow,
    })
    const previousRevenue = 0

    const revenueGrowthPercent =
      previousRevenue > 0 ? ((revenue - previousRevenue) / previousRevenue) * 100 : 0

    const financialScore = calculateSecFinancialScore({
      revenueGrowthPercent,
      netIncome,
      freeCashFlow,
      totalDebt,
      revenue,
    })

    const metricsWithScore = {
      ...metrics,
      marketCapRawValue: marketCap,
      financialScore: financialScore.score,
      financialScoreBreakdown: financialScore.breakdown,
      valuationScore: valuationScore.score,
      valuationScoreBreakdown: valuationScore.breakdown,
      finalFundamentalScore:
        financialScore.score > 0 && valuationScore.score > 0
          ? Math.round(financialScore.score * 0.65 + valuationScore.score * 0.35)
          : financialScore.score || valuationScore.score || 0,
    }

    await saveCachedFinancialMetrics({
      ticker,
      companyName: metrics.companyName,
      cik: company.cik,
      metricsJson: metricsWithScore,
    })

    metricsCache.set(ticker, {
      data: metricsWithScore,
      timestamp: now,
    })

    return NextResponse.json(
      {
        ...metricsWithScore,
        source: "sec-companyfacts",
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=86400, stale-while-revalidate=86400",
        },
      }
    )
  } catch (err) {
    if (ticker && isValidTicker(ticker)) {
      const cachedMetrics = await getCachedFinancialMetrics(ticker)

      if (cachedMetrics?.metrics_json) {
        return NextResponse.json(
          {
            ...(cachedMetrics.metrics_json as object),
            source: "supabase-cache",
            warning:
              "Showing cached financial metrics because SEC data is temporarily unavailable.",
          },
          {
            headers: {
              "Cache-Control":
                "public, s-maxage=86400, stale-while-revalidate=86400",
            },
          }
        )
      }
    }

    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to fetch SEC metrics",
      },
      { status: 500 }
    )
  }
}
