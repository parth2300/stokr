export const FINNHUB_BASE_URL = "https://finnhub.io/api/v1"

export function getFinnhubApiKey() {
  const apiKey = process.env.FINNHUB_API_KEY

  if (!apiKey) {
    throw new Error("Missing FINNHUB_API_KEY")
  }

  return apiKey
}

export function isValidTicker(ticker: string) {
  return /^[A-Z]{1,10}$/.test(ticker)
}

export async function fetchFinnhubJson<T>(endpoint: string): Promise<T> {
  const apiKey = getFinnhubApiKey()
  const separator = endpoint.includes("?") ? "&" : "?"
  const url = `${FINNHUB_BASE_URL}${endpoint}${separator}token=${apiKey}`

  const res = await fetch(url, {
    cache: "no-store",
  })

  const data = (await res.json()) as T & {
    error?: string
    msg?: string
  }

  if (!res.ok) {
    throw new Error(data.error || data.msg || "Finnhub request failed")
  }

  if (data.error) {
    throw new Error(data.error)
  }

  return data
}

export type FinnhubQuote = {
  c?: number
  d?: number
  dp?: number
  h?: number
  l?: number
  o?: number
  pc?: number
  t?: number
}

export type FinnhubProfile = {
  country?: string
  currency?: string
  exchange?: string
  finnhubIndustry?: string
  ipo?: string
  logo?: string
  marketCapitalization?: number
  name?: string
  phone?: string
  shareOutstanding?: number
  ticker?: string
  weburl?: string
}

export type FinnhubCandle = {
  c?: number[]
  h?: number[]
  l?: number[]
  o?: number[]
  s?: "ok" | "no_data"
  t?: number[]
  v?: number[]
}

export async function getFinnhubQuote(ticker: string) {
  return fetchFinnhubJson<FinnhubQuote>(`/quote?symbol=${ticker}`)
}

export async function getFinnhubProfile(ticker: string) {
  return fetchFinnhubJson<FinnhubProfile>(`/stock/profile2?symbol=${ticker}`)
}

export async function getFinnhubCandles({
  ticker,
  resolution,
  from,
  to,
}: {
  ticker: string
  resolution: string
  from: number
  to: number
}) {
  return fetchFinnhubJson<FinnhubCandle>(
    `/stock/candle?symbol=${ticker}&resolution=${resolution}&from=${from}&to=${to}`
  )
}
