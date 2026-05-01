type Stock = {
  ticker: string
  price: number
  changeAmount: number
  changePercentage: string
  volume: number
}

type FinnhubGainersStock = {
  symbol?: string
  ticker?: string
  lastPrice?: number | string
  currentPrice?: number | string
  c?: number | string
  change?: number | string
  dp?: number
  changePercent?: number | string
  percentChange?: number | string
  volume?: number | string
  v?: number | string
}

function parseNumber(value: number | string | undefined) {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : 0
}

function formatPercent(value: number | string | undefined) {
  if (value === undefined || value === null) {
    return "0.00%"
  }

  const parsed = Number(String(value).replace("%", ""))

  if (Number.isNaN(parsed)) {
    return String(value).endsWith("%") ? String(value) : "0.00%"
  }

  return `${parsed.toFixed(2)}%`
}

export function formatTopStocks(stocks: FinnhubGainersStock[]) {
  return stocks.slice(0, 10).map((stock) => {
    const ticker = stock.symbol || stock.ticker || "UNKNOWN"
    const price = parseNumber(stock.lastPrice ?? stock.currentPrice ?? stock.c)
    const rawChange = stock.change ?? stock.dp ?? stock.percentChange ?? stock.changePercent
    const changeAmount = parseNumber(stock.change ?? stock.changePercent ?? stock.percentChange ?? stock.dp)
    const changePercentage = formatPercent(rawChange)
    const volume = parseNumber(stock.volume ?? stock.v)

    return {
      ticker,
      price,
      changeAmount,
      changePercentage,
      volume,
    }
  })
}
