import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/app/lib/supabaseAdmin"
import { getApiUser } from "@/app/lib/apiAuth"
import { getCachedFinancialMetrics } from "@/app/lib/financialMetricsCache"

type FinancialMetricsResponse = {
  financialScore?: number
  valuationScore?: number
  finalFundamentalScore?: number
}

type DashboardChange = {
  ticker: string
  title: string
  description: string
  timeAgo: string
  direction?: "up" | "down" | "neutral"
}

function formatTimeAgo(value: string | null | undefined) {
  if (!value) return "Recently"

  const date = new Date(value).getTime()

  if (!Number.isFinite(date)) return "Recently"

  const diffMs = Date.now() - date
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMinutes < 1) return "Just now"
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`

  return `${diffDays}d ago`
}

function uniqueChanges(changes: DashboardChange[]) {
  const seen = new Set<string>()

  return changes.filter((change) => {
    const key = `${change.ticker}-${change.title}`

    if (seen.has(key)) return false

    seen.add(key)
    return true
  })
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

    const changes: DashboardChange[] = []

    const { data: watchlistItems, error: watchlistError } = await supabaseAdmin
      .from("watchlist_items")
      .select("ticker, company_name, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(8)

    if (watchlistError) {
      throw new Error(watchlistError.message)
    }

    const tickers = Array.from(
      new Set((watchlistItems || []).map((item) => String(item.ticker).toUpperCase()))
    )

    for (const item of watchlistItems || []) {
      const ticker = String(item.ticker || "").toUpperCase()

      changes.push({
        ticker,
        title: `${ticker} added to watchlist`,
        description: `${item.company_name || ticker} was recently added to your saved stocks.`,
        timeAgo: formatTimeAgo(item.created_at),
        direction: "neutral",
      })
    }

    if (tickers.length > 0) {
      const { data: reports, error: reportsError } = await supabaseAdmin
        .from("analysis_cache")
        .select("ticker, company_name, filing_date, updated_at, created_at")
        .in("ticker", tickers)
        .order("created_at", { ascending: false })
        .limit(8)

      if (reportsError) {
        throw new Error(reportsError.message)
      }

      for (const report of reports || []) {
        const ticker = String(report.ticker || "").toUpperCase()
        const dateValue = report.updated_at || report.created_at || report.filing_date

        changes.push({
          ticker,
          title: `${ticker} AI report available`,
          description: `${report.company_name || ticker} has a cached AI analysis report ready to view.`,
          timeAgo: formatTimeAgo(dateValue),
          direction: "up",
        })
      }

      const { data: alerts, error: alertsError } = await supabaseAdmin
        .from("user_alerts")
        .select("ticker, title, message, severity, created_at")
        .eq("user_id", user.id)
        .eq("is_read", false)
        .order("created_at", { ascending: false })
        .limit(5)

      if (alertsError) {
        throw new Error(alertsError.message)
      }

      for (const alert of alerts || []) {
        const severity = String(alert.severity || "Medium")
        const ticker = String(alert.ticker || "").toUpperCase()

        changes.push({
          ticker,
          title: alert.title || `${ticker} alert detected`,
          description: alert.message || `${severity} alert detected for ${ticker}.`,
          timeAgo: formatTimeAgo(alert.created_at),
          direction: severity === "High" ? "down" : "neutral",
        })
      }

      const metricsChanges = await Promise.all(
        tickers.map(async (ticker) => {
          const cachedMetrics = await getCachedFinancialMetrics(ticker)
          const metrics = cachedMetrics?.metrics_json as FinancialMetricsResponse | null

          const financialScore = Number(metrics?.financialScore ?? 0)
          const valuationScore = Number(metrics?.valuationScore ?? 0)
          const finalFundamentalScore = Number(metrics?.finalFundamentalScore ?? 0)
          const healthScore = finalFundamentalScore || financialScore || 0

          const tickerChanges: DashboardChange[] = []

          if (valuationScore > 0 && valuationScore < 40) {
            tickerChanges.push({
              ticker,
              title: `${ticker} valuation looks stretched`,
              description: `Valuation score is ${valuationScore}/100 based on market cap compared with fundamentals.`,
              timeAgo: "Recently",
              direction: "down",
            })
          }

          if (financialScore >= 80) {
            tickerChanges.push({
              ticker,
              title: `${ticker} financial quality is strong`,
              description: `Financial score is ${financialScore}/100 based on margins, cash flow, and debt pressure.`,
              timeAgo: "Recently",
              direction: "up",
            })
          }

          if (healthScore > 0 && healthScore < 50) {
            tickerChanges.push({
              ticker,
              title: `${ticker} health score needs review`,
              description: `Composite health score is ${healthScore}/100.`,
              timeAgo: "Recently",
              direction: "down",
            })
          }

          return tickerChanges
        })
      )

      changes.push(...metricsChanges.flat())
    }

    const finalChanges = uniqueChanges(changes).slice(0, 8)

    return NextResponse.json({
      changes: finalChanges,
    })
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Failed to load dashboard changes",
      },
      { status: 500 }
    )
  }
}