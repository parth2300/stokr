import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import TopStocksTable from "@/app/components/topStocksTable"

const mockStocks = [
  {
    ticker: "AAPL",
    price: 190.25,
    changeAmount: 2.15,
    changePercentage: "1.14%",
    volume: 12345678,
  },
  {
    ticker: "TSLA",
    price: 250.5,
    changeAmount: -4.2,
    changePercentage: "-1.65%",
    volume: 87654321,
  },
]

describe("TopStocksTable", () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ stocks: mockStocks }),
    }) as unknown as typeof fetch
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("shows loading state first", () => {
    render(<TopStocksTable />)
    expect(screen.getByText("Loading stocks...")).toBeInTheDocument()
  })

  it("renders top stocks after fetch", async () => {
    render(<TopStocksTable />)

    await waitFor(() => {
      expect(screen.getByText("AAPL")).toBeInTheDocument()
      expect(screen.getByText("TSLA")).toBeInTheDocument()
    })

    expect(screen.getByText("$190.25")).toBeInTheDocument()
    expect(screen.getByText("1.14%")).toBeInTheDocument()
    expect(screen.getByText("-1.65%")).toBeInTheDocument()
  })

  it("shows disclaimer under the table", async () => {
    render(<TopStocksTable />)

    await waitFor(() => {
      expect(
        screen.getByText(/Market data is cached and refreshed approximately every 15 minutes/i)
      ).toBeInTheDocument()
    })
  })

  it("shows error message if fetch fails", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Could not load top stocks" }),
    }) as unknown as typeof fetch

    render(<TopStocksTable />)

    await waitFor(() => {
      expect(screen.getByText("Could not load top stocks")).toBeInTheDocument()
    })
  })
})