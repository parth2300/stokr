export type ChartRange = "1D" | "7D" | "1M" | "3M" | "1Y"

export type ChartPoint = {
  label: string
  price: number
}

type FinnhubTimeSeries = Record<
  string,
  {
    o: string // open
    h: string // high
    l: string // low
    c: string // close
    v: string // volume
  }
>

// Updated function to fetch Finnhub data
export function getFinnhubFunction(range: ChartRange) {
  if (range === "1D") {
    return {
      functionName: "intraday",
      interval: "5",
    }
  }

  return {
    functionName: "daily",
    interval: null,
  }
}

// Updated Series Key function for Finnhub
export function getSeriesKey(range: ChartRange) {
  if (range === "1D") {
    return "intraday" // Finnhub's intraday response key
  }

  return "daily" // Finnhub's daily response key
}

// Adjusted Point Limit for Finnhub's Data
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

// Adjusted function to format Finnhub chart data
export function formatFinnhubChart(points: any[], range: string) {
  return points.map(p => ({
    price: parseFloat(p.c), // Finnhub's close price is in `c`
    label: formatLabel(p.t, range) // `t` is the timestamp in Finnhub's response
  }))
}

function formatLabel(ts: number, range: string) {
  const date = new Date(ts * 1000)

  if (range === "1D") {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric"
  })
}

// Adjusted Chart Label formatting for Finnhub data
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

// Price summary calculation stays the same as the price data handling changes
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

export function formatChartData(data: { price: number; timestamp: number }[], range: string) {
  return data.map(item => ({
    price: item.price,
    label: formatLabel(item.timestamp, range),
  }))
}