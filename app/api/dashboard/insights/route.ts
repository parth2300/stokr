import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/app/lib/supabaseAdmin"
import { getApiUser } from "@/app/lib/apiAuth"
import { getCachedFinancialMetrics } from "@/app/lib/financialMetricsCache"

type FinancialMetricsResponse = {
  financialScore?: number
  valuationScore?: number
  finalFundamentalScore?: number
}

function average(values: number[]) {
  const validValues = values.filter((value) => Number.isFinite(value) && value > 0)

  if (validValues.length === 0) return 0

  const total = validValues.reduce((sum, value) => sum + value, 0)

  return Math.round(total / validValues.length)
}

function getHighRiskCount(scores: number[]) {
  return scores.filter((score) => score > 0 && score < 50).length
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

    const { data: watchlistItems, error: watchlistError } = await supabaseAdmin
      .from("watchlist_items")
      .select("ticker")
      .eq("user_id", user.id)

    if (watchlistError) {
      throw new Error(watchlistError.message)
    }

    const tickers = Array.from(
      new Set((watchlistItems || []).map((item) => String(item.ticker).toUpperCase()))
    )

    if (tickers.length === 0) {
      return NextResponse.json({
        leaderboard: [],
        insights: [
          {
            label: "Avg Health Score",
            value: "0",
            detail: "Add stocks to calculate",
            direction: "neutral",
          },
          {
            label: "Avg Valuation Score",
            value: "0",
            detail: "Add stocks to calculate",
            direction: "neutral",
          },
          {
            label: "High Risk Stocks",
            value: "0",
            detail: "No watchlist stocks yet",
            direction: "neutral",
          },
          {
            label: "Reports Need Refresh",
            value: "0",
            detail: "No saved reports yet",
            direction: "neutral",
          },
        ],
      })
    }

    const metricsByTicker = await Promise.all(
      tickers.map(async (ticker) => {
        const cachedMetrics = await getCachedFinancialMetrics(ticker)

        const metrics = cachedMetrics?.metrics_json as FinancialMetricsResponse | null

        const financialScore = Number(metrics?.financialScore ?? 0)
        const valuationScore = Number(metrics?.valuationScore ?? 0)
        const finalFundamentalScore = Number(metrics?.finalFundamentalScore ?? 0)

        const healthScore = finalFundamentalScore || financialScore || 0

        return {
          ticker,
          healthScore,
          financialScore,
          valuationScore,
        }
      })
    )

    const leaderboard = metricsByTicker
      .filter((item) => item.financialScore > 0)
      .sort((a, b) => b.financialScore - a.financialScore)
      .slice(0, 5)
      .map((item, index) => ({
        rank: index + 1,
        ticker: item.ticker,
        score: item.financialScore,
      }))

    const healthScores = metricsByTicker.map((item) => item.healthScore)
    const valuationScores = metricsByTicker.map((item) => item.valuationScore)

    const averageHealthScore = average(healthScores)
    const averageValuationScore = average(valuationScores)
    const highRiskStocks = getHighRiskCount(healthScores)

    const { data: reports, error: reportsError } = await supabaseAdmin
      .from("analysis_cache")
      .select("ticker, filing_date, updated_at, created_at")
      .in("ticker", tickers)

    if (reportsError) {
      throw new Error(reportsError.message)
    }

    const now = Date.now()
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000

    const reportsNeedingRefresh = (reports || []).filter((report) => {
      const dateValue = report.updated_at || report.created_at || report.filing_date

      if (!dateValue) return true

      const reportDate = new Date(dateValue).getTime()

      if (!Number.isFinite(reportDate)) return true

      return now - reportDate > thirtyDaysMs
    }).length

    return NextResponse.json({
      leaderboard,
      insights: [
        {
          label: "Avg Health Score",
          value: String(averageHealthScore),
          detail:
            averageHealthScore >= 70
              ? "Watchlist quality looks stable"
              : "Watchlist quality needs review",
          direction: averageHealthScore >= 70 ? "up" : "down",
        },
        {
          label: "Avg Valuation Score",
          value: String(averageValuationScore),
          detail:
            averageValuationScore >= 60
              ? "Valuation profile looks reasonable"
              : "Watchlist may be expensive",
          direction: averageValuationScore >= 60 ? "up" : "down",
        },
        {
          label: "High Risk Stocks",
          value: String(highRiskStocks),
          detail:
            highRiskStocks === 0
              ? "No low-score stocks detected"
              : `${highRiskStocks} stocks below 50 health score`,
          direction: highRiskStocks === 0 ? "up" : "down",
        },
        {
          label: "Reports Need Refresh",
          value: String(reportsNeedingRefresh),
          detail:
            reportsNeedingRefresh === 0
              ? "Saved reports are current"
              : "Older than 30 days",
          direction: reportsNeedingRefresh === 0 ? "up" : "neutral",
        },
      ],
    })
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Failed to load dashboard insights",
      },
      { status: 500 }
    )
  }
}