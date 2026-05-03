import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/app/lib/supabaseAdmin"
import { getApiUser } from "@/app/lib/apiAuth"

type AnalysisJson = {
  healthScore?: number
}

function parseAnalysisJson(value: unknown): AnalysisJson {
  if (!value) return {}

  if (typeof value === "string") {
    try {
      return JSON.parse(value) as AnalysisJson
    } catch {
      return {}
    }
  }

  if (typeof value === "object") {
    return value as AnalysisJson
  }

  return {}
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Pending"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
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

    const { data: watchlistItems, error: watchlistError } = await supabaseAdmin
      .from("watchlist_items")
      .select("ticker")
      .eq("user_id", user.id)

    if (watchlistError) {
      throw new Error(watchlistError.message)
    }

    const tickers = Array.from(
      new Set((watchlistItems || []).map((item) => item.ticker))
    )

    if (tickers.length === 0) {
      return NextResponse.json({
        reports: [],
      })
    }

    const { data: reports, error: reportsError } = await supabaseAdmin
      .from("analysis_cache")
      .select(
        "ticker, company_name, form_type, filing_date, filing_accession_number, analysis_json, created_at"
      )
      .in("ticker", tickers)
      .order("created_at", { ascending: false })

    if (reportsError) {
      throw new Error(reportsError.message)
    }

    const mappedReports = (reports || []).map((report) => {
      const analysisJson = parseAnalysisJson(report.analysis_json)
      const ticker = String(report.ticker || "").toUpperCase()

      return {
        ticker,
        companyName: report.company_name || `${ticker} Stock Analysis`,
        healthScore: analysisJson.healthScore || 0,
        filingDate: formatDate(report.filing_date),
        generatedAt: formatDate(report.created_at),
        href: `/stocks/${ticker.toLowerCase()}-stock-analysis`,
        formType: report.form_type || "Pending",
        accessionNumber: report.filing_accession_number || "Pending",
      }
    })

    return NextResponse.json({
      reports: mappedReports,
    })
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Failed to load saved reports",
      },
      { status: 500 }
    )
  }
}