type AlphaVantageStock = {
  ticker: string
  price: string
  change_amount: string
  change_percentage: string
  volume: string
}

export function formatTopStocks(stocks: AlphaVantageStock[]) {
  return stocks.slice(0, 10).map((stock) => ({
    ticker: stock.ticker,
    price: Number(stock.price),
    changePercentage: stock.change_percentage,
    changeAmount: Number(stock.change_amount),
    volume: Number(stock.volume),
  }))
}