import { supabase } from "./supabase"
import { supabaseAdmin } from "./supabaseAdmin"

const DEFAULT_RANGE = "default"

function getCacheTtlMs(type: string, range?: string | null) {
  if (type === "overview") {
    return 60 * 1000
  }

  if (type === "chart") {
    switch (range) {
      case "1D":
        return 2 * 60 * 1000
      case "7D":
        return 10 * 60 * 1000
      case "1M":
        return 30 * 60 * 1000
      case "3M":
        return 6 * 60 * 60 * 1000
      case "1Y":
        return 12 * 60 * 60 * 1000
      default:
        return 10 * 60 * 1000
    }
  }

  return 5 * 60 * 1000
}

export async function getMarketCache({
  ticker,
  type,
  range = DEFAULT_RANGE,
}: {
  ticker: string
  type: string
  range?: string | null
}) {
  const normalizedRange = range ?? DEFAULT_RANGE

  const { data, error } = await supabase
    .from("market_data_cache")
    .select("*")
    .eq("ticker", ticker.toUpperCase())
    .eq("type", type)
    .eq("range", normalizedRange)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  if (!data) return null

  const updatedAt = new Date(data.updated_at).getTime()
  const ttl = getCacheTtlMs(type, normalizedRange)

  if (Date.now() - updatedAt > ttl) {
    return null
  }
  

  return data.data
}

export async function saveMarketCache({
  ticker,
  type,
  range = DEFAULT_RANGE,
  data,
}: {
  ticker: string
  type: string
  range?: string | null
  data: unknown
}) {
  const normalizedRange = range ?? DEFAULT_RANGE

  const { error } = await supabaseAdmin.from("market_data_cache").upsert(
    {
      ticker: ticker.toUpperCase(),
      type,
      range: normalizedRange,
      data,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "ticker,type,range",
    }
  )

  if (error) {
    throw new Error(error.message)
  }
}