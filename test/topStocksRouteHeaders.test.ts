import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import { GET } from "../app/api/top-stocks/route"

describe("top-stocks API cache headers", () => {
  beforeEach(() => {
    process.env.ALPHA_VANTAGE_API_KEY = "test-key"

    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({
        most_actively_traded: [
          {
            ticker: "AAPL",
            price: "190.25",
            change_amount: "2.15",
            change_percentage: "1.14%",
            volume: "12345678",
          },
        ],
      }),
    }) as unknown as typeof fetch
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("returns cache-control headers", async () => {
    const response = await GET()
    const cacheControl = response.headers.get("Cache-Control")

    expect(cacheControl).toBe(
      "public, s-maxage=900, stale-while-revalidate=1800"
    )
  })

  it("calls Alpha Vantage with Next revalidate option", async () => {
    await GET()

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("TOP_GAINERS_LOSERS"),
      {
        next: { revalidate: 900 },
      }
    )
  })
})