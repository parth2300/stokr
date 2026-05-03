export type DashboardMetric = {
  label: string
  value: string
  detail: string
  accent: "blue" | "green" | "red" | "yellow"
}

export type WatchlistStock = {
  ticker: string
  companyName: string
  price: string
  dailyChange: string
  dailyChangeDirection: "up" | "down"
  aiHealthScore: number
  financialScore: number
  valuationScore: number
  lastUpdated: string
}

export type DashboardChange = {
  ticker: string
  title: string
  description: string
  timeAgo: string
  direction?: "up" | "down" | "neutral"
}

export type SavedReport = {
  ticker: string
  companyName: string
  healthScore: number
  filingDate: string
  generatedAt: string
  href: string
}

export type RiskAlert = {
  ticker: string
  title: string
  description: string
  severity: "High" | "Medium" | "Low"
  timeAgo: string
}

export type LeaderboardItem = {
  rank: number
  ticker: string
  score: number
}

export type DashboardInsight = {
  label: string
  value: string
  detail: string
  direction: "up" | "down" | "neutral"
}