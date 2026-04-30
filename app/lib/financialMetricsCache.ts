import { supabase } from "./supabase"
import { supabaseAdmin } from "./supabaseAdmin"

const CACHE_DURATION_MS = 24 * 60 * 60 * 1000

export async function getCachedFinancialMetrics(ticker: string) {
  const { data, error } = await supabase
    .from("financial_metrics_cache")
    .select("*")
    .eq("ticker", ticker.toUpperCase())
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  if (!data) return null

  const updatedAt = new Date(data.updated_at).getTime()
  const isFresh = Date.now() - updatedAt < CACHE_DURATION_MS

  if (!isFresh) return null

  return data
}

export async function saveCachedFinancialMetrics({
  ticker,
  companyName,
  cik,
  metricsJson,
}: {
  ticker: string
  companyName: string
  cik: string
  metricsJson: unknown
}) {
  const { data, error } = await supabaseAdmin
    .from("financial_metrics_cache")
    .upsert(
      {
        ticker: ticker.toUpperCase(),
        company_name: companyName,
        cik,
        metrics_json: metricsJson,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "ticker",
      }
    )
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}