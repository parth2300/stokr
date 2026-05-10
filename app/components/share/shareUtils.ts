import type { ShareTemplateId } from "./shareTemplates"

export const SHARE_DISCLAIMER =
  "stokr provides informational research tools only and does not provide financial advice."

export type ShareRisk =
  | string
  | {
      title?: string
      severity?: string
      description?: string
    }

export type ShareAnalysisReport = {
  ticker: string
  companyName?: string | null
  overallScore?: number | string | null
  healthScore?: number | string | null
  score?: number | string | null
  summary?: string | null
  bullCase?: string[] | string | null
  bearCase?: string[] | string | null
  topRisks?: ShareRisk[] | string | null
  financialHealth?: string | null
  generatedAt?: string | null
  reportUrl?: string | null
}

export type ShareCardData = {
  ticker: string
  companyName: string
  scoreText: string
  summary: string
  bullCase: string[]
  bearCase: string[]
  topRisks: string[]
  financialHealth: string
  generatedAt: string
  reportUrl: string
}

function normalizeTicker(ticker: string) {
  return ticker.trim().toUpperCase()
}

function normalizeText(value: string | null | undefined) {
  return value?.trim() || ""
}

function normalizeScoreValue(value: ShareAnalysisReport["overallScore"]) {
  if (value === null || value === undefined || value === "") return null

  const score = typeof value === "number" ? value : Number(value)

  if (!Number.isFinite(score) || score < 0) return null
  if (score <= 1) return Math.round(score * 100)
  if (score <= 100) return Math.round(score)

  return null
}

function normalizeStringList(value: string[] | string | null | undefined) {
  if (!value) return []

  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean)
  }

  return value
    .split(/\n+/)
    .map((item) => item.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean)
}

function normalizeRisks(value: ShareAnalysisReport["topRisks"]) {
  if (!value) return []

  if (typeof value === "string") {
    return normalizeStringList(value)
  }

  return value
    .map((risk) => {
      if (typeof risk === "string") return risk.trim()

      const title = normalizeText(risk.title)
      const description = normalizeText(risk.description)

      if (title && description) return `${title}: ${description}`
      return title || description
    })
    .filter(Boolean)
}

export function canBuildShareCard(report: ShareAnalysisReport) {
  if (!normalizeTicker(report.ticker)) return false

  return Boolean(
    normalizeText(report.summary) ||
      normalizeStringList(report.bullCase).length ||
      normalizeStringList(report.bearCase).length ||
      normalizeRisks(report.topRisks).length ||
      normalizeScoreValue(report.overallScore ?? report.healthScore ?? report.score) !== null
  )
}

export function createShareCardData(report: ShareAnalysisReport): ShareCardData {
  const ticker = normalizeTicker(report.ticker)
  const score = normalizeScoreValue(report.overallScore ?? report.healthScore ?? report.score)
  const bullCase = normalizeStringList(report.bullCase)
  const bearCase = normalizeStringList(report.bearCase)
  const topRisks = normalizeRisks(report.topRisks)

  return {
    ticker,
    companyName: normalizeText(report.companyName) || ticker,
    scoreText: score === null ? "N/A" : `${score}/100`,
    summary: normalizeText(report.summary) || "Summary unavailable in this report.",
    bullCase: bullCase.length ? bullCase : ["Bull case unavailable in this report."],
    bearCase: bearCase.length ? bearCase : ["Bear case unavailable in this report."],
    topRisks: topRisks.length ? topRisks : ["Risk summary unavailable in this report."],
    financialHealth:
      normalizeText(report.financialHealth) || "Financial health context unavailable in this report.",
    generatedAt: normalizeText(report.generatedAt),
    reportUrl: normalizeText(report.reportUrl),
  }
}

export function getShareImageFilename(ticker: string, templateId: ShareTemplateId) {
  const safeTicker = normalizeTicker(ticker).replace(/[^A-Z0-9-]/g, "") || "stock"
  return `stokr-${safeTicker.toLowerCase()}-analysis-${templateId}.png`
}

export function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) return value
  return `${value.slice(0, Math.max(0, maxLength - 3)).trim()}...`
}
