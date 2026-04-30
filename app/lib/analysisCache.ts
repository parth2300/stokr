import { supabase } from "./supabase"
import { supabaseAdmin } from "./supabaseAdmin"

export async function getCachedAnalysis(ticker: string) {
  const normalizedTicker = ticker.toUpperCase()

  const { data, error } = await supabase
    .from("analysis_cache")
    .select("*")
    .eq("ticker", normalizedTicker)
    .order("filing_date", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function saveCachedAnalysis({
  ticker,
  companyName,
  cik,
  formType,
  filingAccessionNumber,
  filingDate,
  analysisJson,
}: {
  ticker: string
  companyName: string
  cik: string
  formType: string
  filingAccessionNumber: string
  filingDate: string
  analysisJson: unknown
}) {
  const { data, error } = await supabaseAdmin
    .from("analysis_cache")
    .upsert(
      {
        ticker: ticker.toUpperCase(),
        company_name: companyName,
        cik,
        form_type: formType,
        filing_accession_number: filingAccessionNumber,
        filing_date: filingDate,
        analysis_json: analysisJson,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "ticker,form_type,filing_accession_number",
      }
    )
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function getCachedAnalysisForFiling({
  ticker,
  formType,
  filingAccessionNumber,
}: {
  ticker: string
  formType: string
  filingAccessionNumber: string
}) {
  const { data, error } = await supabase
    .from("analysis_cache")
    .select("*")
    .eq("ticker", ticker.toUpperCase())
    .eq("form_type", formType)
    .eq("filing_accession_number", filingAccessionNumber)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data
}