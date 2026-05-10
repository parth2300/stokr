import { NextResponse } from "next/server"
import { getCachedAnalysis } from "@/app/lib/analysisCache"

type AnalysisRisk = {
  title?: string
  severity?: string
  description?: string
}

type AnalysisJson = {
  summary?: string
  healthScore?: number
  overallScore?: number
  analysisScore?: number
  score?: number
  topSignals?: string[]
  risks?: (AnalysisRisk | string)[]
  bullCase?: string[] | string
  bearCase?: string[] | string
  mdna?: {
    drivers?: string[]
    concerns?: string[]
  }
  filingNotes?: {
    type?: string
    text?: string
  }[]
}

function normalizeTicker(value: string | null) {
  return (value || "").trim().toUpperCase().replace(/[^A-Z0-9.-]/g, "")
}

function parseAnalysisJson(value: unknown): AnalysisJson | null {
  if (!value) return null

  if (typeof value === "string") {
    try {
      return JSON.parse(value) as AnalysisJson
    } catch {
      return null
    }
  }

  return value as AnalysisJson
}

function normalizeScore(value: unknown) {
  if (value === null || value === undefined || value === "") return null

  const score = typeof value === "number" ? value : Number(value)

  if (!Number.isFinite(score) || score < 0) return null
  if (score <= 1) return Math.round(score * 100)
  if (score <= 100) return Math.round(score)

  return null
}

function normalizeTextList(value: string[] | string | undefined) {
  if (!value) return []

  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean)
  }

  return value
    .split(/\n+/)
    .map((item) => item.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean)
}

function normalizeRisks(risks: AnalysisJson["risks"]) {
  if (!risks) return []

  return risks
    .map((risk) => {
      if (typeof risk === "string") return risk.trim()

      const title = risk.title?.trim()
      const description = risk.description?.trim()

      if (title && description) return `${title}: ${description}`
      return title || description || ""
    })
    .filter(Boolean)
}

async function getComparisonReport(ticker: string) {
  const cached = await getCachedAnalysis(ticker)

  if (!cached) {
    return {
      ticker,
      hasData: false,
    }
  }

  const analysis = parseAnalysisJson(cached.analysis_json)

  if (!analysis) {
    return {
      ticker,
      companyName: cached.company_name || ticker,
      hasData: false,
    }
  }

  const score = normalizeScore(
    analysis.overallScore ??
      analysis.healthScore ??
      analysis.analysisScore ??
      analysis.score
  )

  return {
    ticker,
    hasData: true,
    companyName: cached.company_name || ticker,
    summary: analysis.summary || null,
    overallScore: score,
    financialHealth: analysis.healthScore
      ? `Health score from cached filing analysis: ${normalizeScore(analysis.healthScore) ?? "N/A"}/100.`
      : null,
    bullCase: normalizeTextList(analysis.bullCase),
    bearCase: normalizeTextList(analysis.bearCase),
    topRisks: normalizeRisks(analysis.risks),
    filingHighlights: [
      cached.form_type ? `Latest cached form: ${cached.form_type}` : "",
      cached.filing_date ? `Filing date: ${cached.filing_date}` : "",
      cached.filing_accession_number
        ? `Accession number: ${cached.filing_accession_number}`
        : "",
      ...(analysis.topSignals || []).slice(0, 2),
    ].filter(Boolean),
    whatChanged: (analysis.filingNotes || [])
      .map((note) => note.text?.trim())
      .filter(Boolean),
    reportUrl: `/stocks/${ticker.toLowerCase()}`,
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const tickerA = normalizeTicker(searchParams.get("tickerA"))
    const tickerB = normalizeTicker(searchParams.get("tickerB"))

    if (!tickerA || !tickerB) {
      return NextResponse.json(
        { error: "Both tickerA and tickerB are required." },
        { status: 400 }
      )
    }

    const [stockA, stockB] = await Promise.all([
      getComparisonReport(tickerA),
      getComparisonReport(tickerB),
    ])

    return NextResponse.json({
      stocks: [stockA, stockB],
    })
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Failed to load comparison data.",
      },
      { status: 500 }
    )
  }
}
