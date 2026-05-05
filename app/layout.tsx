import type { Metadata, Viewport } from "next"
import PWARegister from "./components/PWARegister"
import "./globals.css"
import Footer from "./components/Footer"
import { GoogleAnalytics } from "@next/third-parties/google"

export const metadata = {
  title: "stokr | AI Stock Research",
  description:
    "AI-powered stock research with SEC filing analysis, watchlists, financial health insights, and premium dashboards.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: "#0F172A",
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
        <PWARegister />
        {children}
        <Footer />
      </body>
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
    </html>
  )
}