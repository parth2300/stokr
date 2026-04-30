import { supabase } from "./supabase"
import { supabaseAdmin } from "./supabaseAdmin"

export async function getCachedFilingComparison({
  ticker,
  latestAccessionNumber,
  previousAccessionNumber,
}: {
  ticker: string
  latestAccessionNumber: string
  previousAccessionNumber: string
}) {
  const { data, error } = await supabase
    .from("filing_comparison_cache")
    .select("*")
    .eq("ticker", ticker.toUpperCase())
    .eq("latest_accession_number", latestAccessionNumber)
    .eq("previous_accession_number", previousAccessionNumber)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function saveCachedFilingComparison({
  ticker,
  companyName,
  latestAccessionNumber,
  previousAccessionNumber,
  latestFilingDate,
  previousFilingDate,
  comparisonJson,
}: {
  ticker: string
  companyName: string
  latestAccessionNumber: string
  previousAccessionNumber: string
  latestFilingDate: string
  previousFilingDate: string
  comparisonJson: unknown
}) {
  const { data, error } = await supabaseAdmin
    .from("filing_comparison_cache")
    .upsert(
      {
        ticker: ticker.toUpperCase(),
        company_name: companyName,
        latest_accession_number: latestAccessionNumber,
        previous_accession_number: previousAccessionNumber,
        latest_filing_date: latestFilingDate,
        previous_filing_date: previousFilingDate,
        comparison_json: comparisonJson,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict:
          "ticker,latest_accession_number,previous_accession_number",
      }
    )
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}