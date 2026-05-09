import type { Metadata } from "next"
import StockAnalysisClient from "./StockAnalysisClient"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://stokr.live"

function getTickerFromSlug(slug: string) {
    return slug.replace("-stock-analysis", "").toUpperCase()
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params
    const ticker = getTickerFromSlug(slug)

    const title = `${ticker} Stock Analysis | AI Filing Research, Risks & Financials`
    const description = `Research ${ticker} stock with AI-powered SEC filing analysis, financial metrics, risk factors, charts, bull vs bear summaries, and transparent research context.`

    const canonical = `${siteUrl}/stocks/${slug}`

    return {
        title,
        description,
        alternates: {
            canonical,
        },
        openGraph: {
            title,
            description,
            url: canonical,
            siteName: "stokr",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    }
}

export default function StockAnalysisPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    return <StockAnalysisClient params={params} />
}
