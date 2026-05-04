import type { Metadata, Viewport } from "next"
import PWARegister from "./components/PWARegister"
import "./globals.css"

export const metadata: Metadata = {
  title: "stokr | AI Stock Research",
  description:
    "AI-powered stock research with SEC filing analysis, watchlists, financial health insights, and premium dashboards.",
  manifest: "/manifest.webmanifest",
  applicationName: "stokr",
  appleWebApp: {
    capable: true,
    title: "stokr",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
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
  return (
    <html lang="en">
      <body>
        <PWARegister />
        {children}
      </body>
    </html>
  )
}