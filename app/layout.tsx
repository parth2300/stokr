import type { Metadata, Viewport } from "next"
import { DM_Mono, Playfair_Display, Syne } from "next/font/google"
import PWARegister from "./components/PWARegister"
import "./globals.css"
import Footer from "./components/Footer"
import { GoogleAnalytics } from "@next/third-parties/google"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
})

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-mono-editorial",
  display: "swap",
  weight: ["300", "400", "500"],
})

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-sans-editorial",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
})

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
  themeColor: "#0C0C0C",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  return (
    <html lang="en" className={`${playfair.variable} ${dmMono.variable} ${syne.variable}`}>
      <body>
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}

        <PWARegister />
        {children}
        <Footer />
      </body>
    </html>
  )
}
