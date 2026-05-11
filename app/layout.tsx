import type { Metadata, Viewport } from "next"
import PWARegister from "./components/PWARegister"
import "./globals.css"
import Footer from "./components/Footer"
import { GoogleAnalytics } from "@next/third-parties/google"
import Script from "next/script"

export const metadata: Metadata = {
  metadataBase: new URL("https://stokr.live"),
  title: {
    default: "stokr | AI Stock Research",
    template: "%s",
  },
  description:
    "Research stocks faster with AI-powered SEC filing analysis, financial metrics, risk factors, charts, watchlists, and transparent summaries.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
  openGraph: {
    title: "stokr | AI Stock Research",
    description:
      "Research stocks faster with AI-powered SEC filing analysis, financial metrics, risk factors, charts, watchlists, and transparent summaries.",
    url: "https://stokr.live",
    siteName: "stokr",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "stokr | AI Stock Research",
    description:
      "Research stocks faster with AI-powered SEC filing analysis, financial metrics, risk factors, charts, watchlists, and transparent summaries.",
  },
}

export const viewport: Viewport = {
  themeColor: "#05070A",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  return (
    <html lang="en">
      <body>
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}

        <PWARegister />
        {children}
        <Footer />
      </body>
    </html>
  )
}
