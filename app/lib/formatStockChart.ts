export type ChartRange = "1D" | "7D" | "1M" | "3M" | "1Y"

export type ChartPoint = {
  label: string
  price: number
}

type AlphaVantageTimeSeries = Record<
  string,
  {
    "1. open": string
    "2. high": string
    "3. low": string
    "4. close": string
    "5. volume": string
  }
>

export function getAlphaVantageFunction(range: ChartRange) {
  if (range === "1D") {
    return {
      functionName: "TIME_SERIES_INTRADAY",
      interval: "5min",
    }
  }

  return {
    functionName: "TIME_SERIES_DAILY",
    interval: null,
  }
}

export function getSeriesKey(range: ChartRange) {
  if (range === "1D") {
    return "Time Series (5min)"
  }

  return "Time Series (Daily)"
}

export function getPointLimit(range: ChartRange) {
  switch (range) {
    case "1D":
      return 78 // roughly one trading day of 5-min candles
    case "7D":
      return 7
    case "1M":
      return 22
    case "3M":
      return 66
    case "1Y":
      return 252
    default:
      return 22
  }
}

export function formatChartData(
  timeSeries: AlphaVantageTimeSeries,
  range: ChartRange
): ChartPoint[] {
  const pointLimit = getPointLimit(range)

  return Object.entries(timeSeries)
    .slice(0, pointLimit)
    .reverse()
    .map(([timestamp, values]) => {
      const closePrice = Number(values["4. close"])

      return {
        label: formatChartLabel(timestamp, range),
        price: closePrice,
      }
    })
}

function formatChartLabel(timestamp: string, range: ChartRange) {
  const date = new Date(timestamp.replace(" ", "T"))

  if (range === "1D") {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
  }

  if (range === "7D" || range === "1M") {
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

export function calculatePriceSummary(chartData: ChartPoint[]) {
  const first = chartData[0]?.price ?? 0
  const last = chartData[chartData.length - 1]?.price ?? 0
  const changeAmount = last - first
  const changePercent = first ? (changeAmount / first) * 100 : 0

  return {
    price: last,
    changeAmount,
    changePercent,
    isPositive: changeAmount >= 0,
  }
}