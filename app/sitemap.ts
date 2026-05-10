import type { MetadataRoute } from "next"
import { blogPosts } from "./lib/blogPosts"
import { sp500Tickers } from "./lib/sp500Tickers"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://stokr.live"

const corePages = [
  {
    path: "",
    changeFrequency: "daily" as const,
    priority: 1,
  },
  {
    path: "/about",
    changeFrequency: "monthly" as const,
    priority: 0.7,
  },
  {
    path: "/pricing",
    changeFrequency: "monthly" as const,
    priority: 0.8,
  },
  {
    path: "/terms",
    changeFrequency: "yearly" as const,
    priority: 0.3,
  },
  {
    path: "/privacy",
    changeFrequency: "yearly" as const,
    priority: 0.3,
  },
]

const brokerPages = [
  "/brokers",
  "/brokers/robinhood",
  "/brokers/webull",
  "/brokers/interactive-brokers",
  "/brokers/moomoo",
  "/brokers/m1",
  "/brokers/tastytrade",
]

const comparePages = [
  "/compare/robinhood-vs-webull",
  "/compare/webull-vs-interactive-brokers",
  "/compare/robinhood-vs-m1",
  "/compare/moomoo-vs-webull",
  "/compare/tastytrade-vs-interactive-brokers",
]

const learnPages = [
  "/learn/how-to-read-stock-analysis",
  "/learn/what-is-pe-ratio",
  "/learn/what-is-market-cap",
  "/learn/what-is-free-cash-flow",
  "/learn/what-is-revenue-growth",
  "/learn/what-is-debt-to-equity",
  "/learn/how-to-compare-stocks",
  "/learn/how-to-read-an-annual-report",
  "/learn/what-is-a-10-k",
  "/learn/what-is-a-10-q",
  "/learn/what-is-valuation",
  "/learn/what-is-earnings-per-share",
  "/learn/what-is-operating-margin",
  "/learn/what-is-return-on-equity",
]

const linkedStockTickers = [
  "AAPL",
  "AMD",
  "AMZN",
  "AVGO",
  "F",
  "GM",
  "GOOGL",
  "INTC",
  "META",
  "MSFT",
  "NIO",
  "NVDA",
  "PINS",
  "QCOM",
  "RIVN",
  "SHOP",
  "SNAP",
  "TSLA",
  "TSM",
  "WMT",
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const coreUrls = corePages.map((page) => ({
    url: `${siteUrl}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))

  const stockTickers = Array.from(
    new Set([...sp500Tickers, ...linkedStockTickers])
  )

  const stockUrls = stockTickers.map((ticker) => ({
    url: `${siteUrl}/stocks/${encodeURIComponent(ticker.toLowerCase())}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }))

  const brokerUrls = brokerPages.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "/brokers" ? 0.8 : 0.7,
  }))

  const compareUrls = comparePages.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }))

  const learnUrls = learnPages.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  const blogUrls = [
    {
      url: `${siteUrl}/blog`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    ...blogPosts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ]

  return [
    ...coreUrls,
    ...stockUrls,
    ...brokerUrls,
    ...compareUrls,
    ...learnUrls,
    ...blogUrls,
  ]
}
