import type { Metadata } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://stokr.live"

export const metadata: Metadata = {
  title: "Investing Glossary | stokr AI Stock Research",
  description:
    "A beginner-friendly glossary of stock research terms, SEC filing concepts, and financial metrics.",
  alternates: {
    canonical: `${siteUrl}/glossary`,
  },
  openGraph: {
    title: "Investing Glossary | stokr AI Stock Research",
    description:
      "A beginner-friendly glossary of stock research terms, SEC filing concepts, and financial metrics.",
    url: `${siteUrl}/glossary`,
    siteName: "stokr",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Investing Glossary | stokr AI Stock Research",
    description:
      "A beginner-friendly glossary of stock research terms, SEC filing concepts, and financial metrics.",
  },
}

export default function GlossaryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
