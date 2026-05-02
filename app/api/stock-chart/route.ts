import { NextResponse } from "next/server"
import {
  calculatePriceSummary,
  formatChartData,
  getFinnhubResolution,
  getUnixRange,
  type ChartPoint,
  type ChartRange,
  type RawChartPoint,
} from "../../lib/formatStockChart"
import {
  getFinnhubCandles,
  getFinnhubQuote,
  isValidTicker,
} from "../../lib/finnhub"
import { getMarketCache, saveMarketCache } from "../../lib/marketCache"

type StockChartResponse = {
  ticker: string
  range: ChartRange
  price: number
  changeAmount: number
  changePercent: number
  isPositive: boolean
  chartData: { label: string; price: number }[]
  updatedAt: string
  source?: "finnhub" | "alpha-vantage" | "cache" | "quote-fallback"
  warning?: string
}

type CachedChartData = {
  data: StockChartResponse
  timestamp: number
}

const chartCache = new Map<string, CachedChartData>()

const CACHE_DURATION_BY_RANGE: Record<ChartRange, number> = {
  "1D": 5 * 60 * 1000,
  "7D": 15 * 60 * 1000,
  "1M": 60 * 60 * 1000,
  "3M": 6 * 60 * 60 * 1000,
  "1Y": 12 * 60 * 60 * 1000,
}

function isValidRange(range: string): range is ChartRange {
  return ["1D", "7D", "1M", "3M", "1Y"].includes(range)
}

function buildResponseFromRawChartData({
  ticker,
  range,
  rawChartData,
  source,
  warning,
}: {
  ticker: string
  range: ChartRange
  rawChartData: RawChartPoint[]
  source: "finnhub" | "alpha-vantage"
  warning?: string
}): StockChartResponse {
  const cleanRawChartData = rawChartData.filter(
    (point) => Number.isFinite(point.price) && point.price > 0
  )

  if (cleanRawChartData.length === 0) {
    throw new Error("No valid chart prices found for this ticker")
  }

  const chartData = formatChartData(cleanRawChartData, range)
  const summary = calculatePriceSummary(chartData)

  return {
    ticker,
    range,
    price: summary.price,
    changeAmount: summary.changeAmount,
    changePercent: summary.changePercent,
    isPositive: summary.isPositive,
    chartData,
    updatedAt: new Date().toISOString(),
    source,
    warning,
  }
}

async function fetchFinnhubChart({
  ticker,
  range,
}: {
  ticker: string
  range: ChartRange
}) {
  const { from, to } = getUnixRange(range)
  const resolution = getFinnhubResolution(range)

  const rawData = await getFinnhubCandles({
    ticker,
    resolution,
    from,
    to,
  })

  if (
    rawData.s !== "ok" ||
    !Array.isArray(rawData.t) ||
    !Array.isArray(rawData.c) ||
    rawData.t.length === 0 ||
    rawData.c.length === 0
  ) {
    throw new Error("No Finnhub chart data found for this ticker")
  }

  const rawChartData: RawChartPoint[] = rawData.t.map((timestamp, index) => ({
    timestamp,
    price: Number(rawData.c?.[index]),
  }))

  return buildResponseFromRawChartData({
    ticker,
    range,
    rawChartData,
    source: "finnhub",
  })
}

async function fetchAlphaVantageChart({
  ticker,
  range,
}: {
  ticker: string
  range: ChartRange
}) {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY

  if (!apiKey) {
    throw new Error("Missing ALPHA_VANTAGE_API_KEY")
  }

  const functionName = range === "1D" ? "TIME_SERIES_INTRADAY" : "TIME_SERIES_DAILY"
  const interval = "5min"

  const url = new URL("https://www.alphavantage.co/query")
  url.searchParams.set("function", functionName)
  url.searchParams.set("symbol", ticker)
  url.searchParams.set("apikey", apiKey)
  url.searchParams.set("outputsize", range === "1Y" ? "full" : "compact")

  if (functionName === "TIME_SERIES_INTRADAY") {
    url.searchParams.set("interval", interval)
  }

  const res = await fetch(url.toString(), {
    cache: "no-store",
  })

  const data = await res.json()

  if (data["Error Message"]) {
    throw new Error(data["Error Message"])
  }

  if (data["Note"]) {
    throw new Error(data["Note"])
  }

  const seriesKey =
    functionName === "TIME_SERIES_INTRADAY"
      ? `Time Series (${interval})`
      : "Time Series (Daily)"

  const series = data[seriesKey]

  if (!series || typeof series !== "object") {
    throw new Error("No Alpha Vantage chart data found for this ticker")
  }

  const limitByRange: Record<ChartRange, number> = {
    "1D": 78,
    "7D": 7,
    "1M": 30,
    "3M": 90,
    "1Y": 252,
  }

  const rawChartData: RawChartPoint[] = Object.entries(series)
    .slice(0, limitByRange[range])
    .map(([dateTime, value]) => {
      const close = Number((value as Record<string, string>)["4. close"])
      const timestamp = Math.floor(new Date(dateTime).getTime() / 1000)

      return {
        timestamp,
        price: close,
      }
    })
    .filter((point) => Number.isFinite(point.timestamp))
    .reverse()

  return buildResponseFromRawChartData({
    ticker,
    range,
    rawChartData,
    source: "alpha-vantage",
    warning:
      "Finnhub candle data is unavailable for this API key, so this chart is using Alpha Vantage historical data.",
  })
}

function buildFallbackChart({
  ticker,
  range,
  price,
  previousClose,
}: {
  ticker: string
  range: ChartRange
  price: number
  previousClose: number
}): StockChartResponse {
  const pointCountByRange: Record<ChartRange, number> = {
    "1D": 24,
    "7D": 7,
    "1M": 30,
    "3M": 30,
    "1Y": 52,
  }

  const now = Math.floor(Date.now() / 1000)
  const pointCount = pointCountByRange[range]
  const startPrice =
    Number.isFinite(previousClose) && previousClose > 0 ? previousClose : price

  const rawChartData: RawChartPoint[] = Array.from({ length: pointCount }).map(
    (_, index) => {
      const progress = pointCount === 1 ? 1 : index / (pointCount - 1)
      const interpolatedPrice = startPrice + (price - startPrice) * progress

      return {
        timestamp:
          range === "1D"
            ? now - (pointCount - 1 - index) * 60 * 60
            : now - (pointCount - 1 - index) * 24 * 60 * 60,
        price: Number(interpolatedPrice.toFixed(2)),
      }
    }
  )

  const chartData = formatChartData(rawChartData, range)
  const summary = calculatePriceSummary(chartData)

  return {
    ticker,
    range,
    price: summary.price,
    changeAmount: summary.changeAmount,
    changePercent: summary.changePercent,
    isPositive: summary.isPositive,
    chartData,
    updatedAt: new Date().toISOString(),
    source: "quote-fallback",
    warning:
      "Finnhub candle data and Alpha Vantage chart data are unavailable, so this chart is using quote-based fallback data.",
  }
}
function formatLiveChartLabel(range: ChartRange) {
  const date = new Date()

  if (range === "1D") {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
  }

  if (range === "7D") {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  if (range === "1M" || range === "3M") {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  })
}

async function syncChartWithLiveQuote({
  ticker,
  range,
  responseData,
}: {
  ticker: string
  range: ChartRange
  responseData: StockChartResponse
}): Promise<StockChartResponse> {
  const quote = await getFinnhubQuote(ticker)
  const livePrice = Number(quote.c)

  if (!Number.isFinite(livePrice) || livePrice <= 0) {
    return responseData
  }

  const chartData: ChartPoint[] = [...responseData.chartData]
  const liveLabel = formatLiveChartLabel(range)
  const livePoint = {
    label: liveLabel,
    price: Number(livePrice.toFixed(2)),
  }

  if (chartData.length === 0) {
    chartData.push(livePoint)
  } else if (chartData[chartData.length - 1]?.label === liveLabel) {
    chartData[chartData.length - 1] = livePoint
  } else {
    chartData.push(livePoint)
  }

  const summary = calculatePriceSummary(chartData)

  return {
    ...responseData,
    price: summary.price,
    changeAmount: summary.changeAmount,
    changePercent: summary.changePercent,
    isPositive: summary.isPositive,
    chartData,
    updatedAt: new Date().toISOString(),
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const ticker = searchParams.get("ticker")?.trim().toUpperCase()
  const rangeParam = searchParams.get("range")?.trim().toUpperCase() || "1M"

  try {
    if (!ticker) {
      return NextResponse.json({ error: "Missing ticker" }, { status: 400 })
    }

    if (!isValidTicker(ticker)) {
      return NextResponse.json({ error: "Invalid ticker" }, { status: 400 })
    }

    if (!isValidRange(rangeParam)) {
      return NextResponse.json({ error: "Invalid range" }, { status: 400 })
    }

    const supabaseCached = (await getMarketCache({
      ticker,
      type: "chart",
      range: rangeParam,
    })) as StockChartResponse | null

    if (supabaseCached && supabaseCached.source !== "quote-fallback") {
      return NextResponse.json({
        ...supabaseCached,
        source: "cache",
      })
    }

    const cacheKey = `${ticker}:${rangeParam}`
    const now = Date.now()
    const memoryCached = chartCache.get(cacheKey)

    if (
      memoryCached &&
      memoryCached.data.source !== "quote-fallback" &&
      now - memoryCached.timestamp < CACHE_DURATION_BY_RANGE[rangeParam]
    ) {
      return NextResponse.json({
        ...memoryCached.data,
        source: "cache",
      })
    }

    let responseData: StockChartResponse

    try {
      responseData = await fetchFinnhubChart({
        ticker,
        range: rangeParam,
      })
    } catch {
      try {
        responseData = await fetchAlphaVantageChart({
          ticker,
          range: rangeParam,
        })
      } catch {
        const quote = await getFinnhubQuote(ticker)
        const price = Number(quote.c)
        const previousClose = Number(quote.pc)

        if (!Number.isFinite(price) || price <= 0) {
          throw new Error("No quote data found for this ticker")
        }

        responseData = buildFallbackChart({
          ticker,
          range: rangeParam,
          price,
          previousClose,
        })
      }
    }

    await saveMarketCache({
      ticker,
      type: "chart",
      range: rangeParam,
      data: responseData,
    })

    chartCache.set(cacheKey, {
      data: responseData,
      timestamp: now,
    })

    return NextResponse.json(responseData, {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
      },
    })
  } catch (err) {
    if (ticker && isValidTicker(ticker) && isValidRange(rangeParam)) {
      const cacheKey = `${ticker}:${rangeParam}`
      const memoryCached = chartCache.get(cacheKey)

      if (memoryCached) {
        return NextResponse.json({
          ...memoryCached.data,
          source: "cache",
          warning:
            "Showing cached chart data while live chart data is temporarily unavailable.",
        })
      }

      const supabaseCached = await getMarketCache({
        ticker,
        type: "chart",
        range: rangeParam,
      })

      if (supabaseCached) {
        return NextResponse.json({
          ...(supabaseCached as StockChartResponse),
          source: "cache",
          warning:
            "Showing cached chart data while live chart data is temporarily unavailable.",
        })
      }
    }

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Failed to fetch chart data",
      },
      { status: 503 }
    )
  }
}