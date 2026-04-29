export type ChartRange = "1D" | "7D" | "1M" | "3M" | "1Y"

export type PricePoint = {
  label: string
  price: number
}

export const applePriceHistory: Record<ChartRange, PricePoint[]> = {
  "1D": [
    { label: "9:30", price: 190.6 },
    { label: "10:30", price: 191.1 },
    { label: "11:30", price: 190.8 },
    { label: "12:30", price: 191.7 },
    { label: "1:30", price: 192.1 },
    { label: "2:30", price: 191.9 },
    { label: "3:30", price: 192.4 },
    { label: "4:00", price: 192.2 },
  ],
  "7D": [
    { label: "Mon", price: 187.3 },
    { label: "Tue", price: 188.1 },
    { label: "Wed", price: 189.4 },
    { label: "Thu", price: 188.7 },
    { label: "Fri", price: 190.2 },
    { label: "Mon", price: 191.3 },
    { label: "Tue", price: 192.2 },
  ],
  "1M": [
    { label: "W1", price: 184.5 },
    { label: "W2", price: 186.1 },
    { label: "W3", price: 188.7 },
    { label: "W4", price: 187.9 },
    { label: "W5", price: 190.4 },
    { label: "Now", price: 192.2 },
  ],
  "3M": [
    { label: "Jan", price: 178.2 },
    { label: "Feb", price: 181.6 },
    { label: "Mar", price: 184.3 },
    { label: "Apr", price: 186.8 },
    { label: "May", price: 188.4 },
    { label: "Jun", price: 190.7 },
    { label: "Now", price: 192.2 },
  ],
  "1Y": [
    { label: "May", price: 171.4 },
    { label: "Jun", price: 173.2 },
    { label: "Jul", price: 176.8 },
    { label: "Aug", price: 179.7 },
    { label: "Sep", price: 177.5 },
    { label: "Oct", price: 180.6 },
    { label: "Nov", price: 183.4 },
    { label: "Dec", price: 185.2 },
    { label: "Jan", price: 186.7 },
    { label: "Feb", price: 188.6 },
    { label: "Mar", price: 190.8 },
    { label: "Now", price: 192.2 },
  ],
}

export const appleAnalytics = {
  company: {
    name: "Apple Inc.",
    ticker: "AAPL",
    badge: "Demo Preview",
    note: "Sample UI data for layout design. Replace with live filing and market data later.",
    price: "$192.20",
    change: "+1.84%",
    marketCap: "$2.97T",
    healthScore: 88,
    rating: "Strong",
    summary:
      "Apple shows strong cash generation, high margins, and a resilient ecosystem, while investors should closely monitor product concentration, China exposure, and regulatory pressure on its services business.",
  },

  topSignals: [
    "Cash flow remains strong and supports flexibility, buybacks, and resilience.",
    "Services expansion improves margin quality and revenue durability.",
    "The business still has material dependence on iPhone demand cycles.",
  ],

  keyMetrics: [
    { label: "Revenue", value: "$391.4B", delta: "+2.8% YoY" },
    { label: "Net Income", value: "$99.8B", delta: "+4.3% YoY" },
    { label: "Gross Margin", value: "45.8%", delta: "+1.2 pts" },
    { label: "Operating Margin", value: "30.2%", delta: "+0.8 pts" },
    { label: "Free Cash Flow", value: "$108.4B", delta: "+6.1% YoY" },
    { label: "Cash & Equivalents", value: "$65.3B", delta: "Stable" },
    { label: "Total Debt", value: "$112.7B", delta: "-2.4% YoY" },
    { label: "EPS", value: "$6.43", delta: "+5.1% YoY" },
  ],

  healthBreakdown: [
    { label: "Profitability", score: 92, blurb: "High margin profile and durable earnings power." },
    { label: "Cash Flow Strength", score: 94, blurb: "Consistent free cash flow supports flexibility." },
    { label: "Balance Sheet", score: 81, blurb: "Large debt load is manageable relative to cash flow." },
    { label: "Growth Stability", score: 78, blurb: "Moderate growth, but less explosive than earlier cycles." },
    { label: "Risk Pressure", score: 72, blurb: "Regulatory and geographic risks remain meaningful." },
  ],

  revenueBreakdown: [
    { label: "iPhone", percentage: 52 },
    { label: "Services", percentage: 21 },
    { label: "Mac", percentage: 9 },
    { label: "iPad", percentage: 7 },
    { label: "Wearables / Home / Accessories", percentage: 11 },
  ],

  risks: [
    {
      title: "Regulatory pressure on services",
      severity: "High",
      description:
        "Antitrust scrutiny and platform regulation could pressure App Store economics and services profitability.",
    },
    {
      title: "China exposure",
      severity: "Medium-High",
      description:
        "China remains important to both manufacturing and revenue, creating geopolitical and concentration risk.",
    },
    {
      title: "Product concentration",
      severity: "Medium",
      description:
        "A large share of revenue still depends on iPhone demand and product refresh cycles.",
    },
    {
      title: "Competitive hardware and AI pressure",
      severity: "Medium",
      description:
        "Innovation expectations are rising, and the market increasingly values differentiated AI experiences.",
    },
  ],

  whatChanged: [
    {
      type: "Added Focus",
      direction: "up",
      text: "Management language places more emphasis on services durability and ecosystem monetization.",
    },
    {
      type: "Risk Increase",
      direction: "up",
      text: "Regulatory and policy pressure appears more prominent than in prior filing commentary.",
    },
    {
      type: "Operational Improvement",
      direction: "up",
      text: "Margin quality and cash generation appear stronger relative to the previous period.",
    },
    {
      type: "Watch Item",
      direction: "down",
      text: "Growth remains solid, but revenue acceleration is not broad-based across all segments.",
    },
  ],

  mdna: {
    drivers: [
      "Services growth and ecosystem engagement continue supporting overall business quality.",
      "Operational efficiency and pricing discipline support margin strength.",
      "Capital returns remain an important part of shareholder value creation.",
    ],
    concerns: [
      "Hardware growth remains sensitive to upgrade cycles and macro demand.",
      "Geographic concentration and policy risk remain meaningful discussion points.",
      "Competitive pressure is rising around innovation expectations and AI positioning.",
    ],
  },

  bullCase: [
    "Services and ecosystem monetization improve revenue quality.",
    "Brand power and installed base support retention and pricing power.",
    "Cash flow supports buybacks, strategic flexibility, and resilience.",
    "Margin profile remains stronger than many large-cap peers.",
  ],

  bearCase: [
    "Dependence on iPhone cycles can constrain growth durability.",
    "Regulatory changes could weaken services economics.",
    "China exposure can create both operational and demand risk.",
    "Valuation expectations may already price in operational strength.",
  ],

  redFlags: [
    "No severe distress signals detected in this demo view.",
    "Regulatory language should be monitored for further intensification.",
    "Product concentration remains a persistent structural risk.",
  ],

  filings: [
    { title: "Latest 10-K reviewed", value: "Sample filing" },
    { title: "Latest 10-Q reviewed", value: "Sample filing" },
    { title: "Management Discussion analyzed", value: "Yes" },
    { title: "Risk Factors diffed", value: "Yes" },
  ],

  sources: [
    "10-K — Business Overview",
    "10-K — Item 1A Risk Factors",
    "10-Q — Management Discussion & Analysis",
    "Income Statement / Balance Sheet / Cash Flow Statement",
  ],
}