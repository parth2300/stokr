import type { Metadata } from "next"
import NavBar from "../components/navBar"
import CompareStocksClient from "./CompareStocksClient"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://stokr.live"

export const metadata: Metadata = {
  title: "Compare Stocks | stokr AI Stock Research",
  description:
    "Compare stocks side by side using stokr's AI-powered filing summaries, risk analysis, bull vs bear cases, and financial health insights.",
  alternates: {
    canonical: `${siteUrl}/compare`,
  },
  openGraph: {
    title: "Compare Stocks | stokr AI Stock Research",
    description:
      "Compare stocks side by side using stokr's AI-powered filing summaries, risk analysis, bull vs bear cases, and financial health insights.",
    url: `${siteUrl}/compare`,
    siteName: "stokr",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare Stocks | stokr AI Stock Research",
    description:
      "Compare stocks side by side using stokr's AI-powered filing summaries, risk analysis, bull vs bear cases, and financial health insights.",
  },
}

export default function ComparePage() {
  return (
    <main className="stokr-page">
      <section className="stokr-shell">
        <div className="stokr-bg" />

        <div className="stokr-container">
          <NavBar showSearch />
          <CompareStocksClient />
        </div>
      </section>
    </main>
  )
}
