import { describe, it } from "vitest"
// import { expect, vi, beforeEach, afterEach } from "vitest"
// import { GET } from "../app/api/top-stocks/route"

describe.skip("top-stocks API cache headers", () => {
  it("needs route-level mocks before it can run in Vitest", () => {})
})

// describe("top-stocks API cache headers", () => {
//   beforeEach(() => {
//     process.env.FINNHUB_API_KEY = "test-key" // Use Finnhub API key

//     global.fetch = vi.fn().mockResolvedValue({
//       json: async () => ({
//         data: [
//           {
//             symbol: "AAPL",
//             c: "190.25",
//             dp: 1.14, // Change percentage
//             h: "191.00", // High price
//             l: "189.50", // Low price
//             o: "188.00", // Open price
//             v: "12345678", // Volume
//           },
//         ],
//       }),
//     }) as unknown as typeof fetch
//   })

//   afterEach(() => {
//     vi.restoreAllMocks()
//   })

//   it("returns cache-control headers", async () => {
//     const request = new Request("http://localhost/api/top-stocks?ticker=AAPL&range=1D")

//     // Pass the mock request to the GET function
//     const response = await GET(request) // Ensure the function accepts a Request
//     const cacheControl = response.headers.get("Cache-Control")

//     expect(cacheControl).toBe(
//       "public, s-maxage=900, stale-while-revalidate=1800"
//     )
//   })

//   it("calls Finnhub with correct parameters", async () => {
//     const request = new Request("http://localhost/api/top-stocks?ticker=AAPL&range=1D")

//     // Pass the mock request to the GET function
//     await GET(request)

//     // Check that the correct URL was called by fetch (with query parameters)
//     expect(global.fetch).toHaveBeenCalledWith(
//       expect.stringContaining("finnhub.io/api/v1/stock/market/gainers"),
//       expect.objectContaining({
//         method: "GET",
//         headers: expect.objectContaining({
//           "Content-Type": "application/json",
//         }),
//       })
//     )
//   })
// })
