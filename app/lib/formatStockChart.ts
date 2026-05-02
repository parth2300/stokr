export type ChartRange = "1D" | "7D" | "1M" | "3M" | "1Y"

export type ChartPoint = {
  label: string
  price: number
}

export type RawChartPoint = {
  timestamp: number
  price: number
}

export function getFinnhubResolution(range: ChartRange) {
  switch (range) {
    case "1D":
      return "5"
    case "7D":
      return "30"
    case "1M":
      return "D"
    case "3M":
      return "D"
    case "1Y":
      return "W"
    default:
      return "D"
  }
}

export function getUnixRange(range: ChartRange) {
  const now = Math.floor(Date.now() / 1000)

  const secondsByRange: Record<ChartRange, number> = {
    "1D": 60 * 60 * 24,
    "7D": 60 * 60 * 24 * 7,
    "1M": 60 * 60 * 24 * 30,
    "3M": 60 * 60 * 24 * 90,
    "1Y": 60 * 60 * 24 * 365,
  }

  return {
    from: now - secondsByRange[range],
    to: now,
  }
}

export function formatChartData(data: RawChartPoint[], range: ChartRange) {
  return data.map((item) => ({
    price: item.price,
    label: formatChartLabel(item.timestamp, range),
  }))
}

function formatChartLabel(timestamp: number, range: ChartRange) {
  const date = new Date(timestamp * 1000)

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
