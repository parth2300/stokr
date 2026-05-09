import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing | stokr AI Stock Research",
  description:
    "Start researching stocks with stokr. Compare free and premium access for AI-powered stock analysis, SEC filing breakdowns, risk summaries, watchlists, and dashboards.",
  alternates: {
    canonical: "https://stokr.live/pricing",
  },
  openGraph: {
    title: "Pricing | stokr AI Stock Research",
    description:
      "Start researching stocks with stokr. Compare free and premium access for AI-powered stock analysis, SEC filing breakdowns, risk summaries, watchlists, and dashboards.",
    url: "https://stokr.live/pricing",
    siteName: "stokr",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing | stokr AI Stock Research",
    description:
      "Start researching stocks with stokr. Compare free and premium access for AI-powered stock analysis, SEC filing breakdowns, risk summaries, watchlists, and dashboards.",
  },
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}