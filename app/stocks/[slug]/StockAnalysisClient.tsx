"use client"

import dynamic from "next/dynamic"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { ReactNode } from "react"
import Link from "next/link"
import NavBar from "@/app/components/navBar"
import StockOverviewCards from "@/app/components/analytics/stockOverviewCards"
import AnalysisReportLoading from "@/app/components/analytics/analysisReportLoading"
import AddToWatchlistButton from "@/app/components/watchlist/AddToWatchlistButton"
import ShareAnalysisButton from "@/app/components/share/ShareAnalysisButton"
import LazyFilingComparisonSection from "@/app/components/analytics/LazyFilingComparisonSection"
import InfoTooltip from "@/app/components/ui/InfoTooltip"
import PremiumPreview from "@/app/components/PremiumPreview"
import RelatedStocks from "@/app/components/RelatedStocks"
import ReportLimitUpgradePrompt from "@/app/components/ReportLimitUpgradePrompt"
import {
    trackReportLimitReached,
    trackViewStockReport,
} from "@/app/lib/analytics"
import { supabase } from "@/app/lib/supabase"

const StockPriceChart = dynamic(
    () => import("@/app/components/analytics/stockPriceChart"),
    {
        ssr: false,
        loading: () => (
            <div className="h-[420px] animate-pulse rounded-xl border border-white/[0.08] bg-[#11141C]" />
        ),
    }
)

const FinancialMetricCards = dynamic(
    () => import("@/app/components/analytics/financialMetricCards"),
    {
        ssr: false,
        loading: () => (
            <div className="mt-8 h-40 animate-pulse rounded-xl border border-white/[0.08] bg-[#11141C]" />
        ),
    }
)

type CachedAnalysis = {
    ticker: string
    company_name: string | null
    form_type: string | null
    filing_accession_number: string | null
    filing_date: string | null
    created_at?: string | null
    updated_at?: string | null
    analysis_json: AnalysisJson | string | null
}

type AnalysisRisk = {
    title: string
    severity: "Low" | "Medium" | "Medium-High" | "High"
    description: string
}

type AnalysisJson = {
    summary?: string
    healthScore?: number
    topSignals?: string[]
    risks?: (AnalysisRisk | string)[]
    bullCase?: string[]
    bearCase?: string[]
    redFlags?: string[]
    mdna?: {
        drivers?: string[]
        concerns?: string[]
    }
    revenueSegments?: {
        label: string
        note: string
    }[]
    filingNotes?: {
        type: string
        text: string
    }[]
}

type FinancialMetricsApiResponse = {
    financialScore?: number
    valuationScore?: number
    finalFundamentalScore?: number
}

type StockOverviewApiResponse = {
    price?: number
    change?: number
    changePercent?: string
    marketCap?: string
}

const premiumTeaserSections = [
    {
        title: "Filing Delta is a Premium section",
        body: "See what changed between the latest filing and prior company filings.",
        unlocks: [
            "new or intensified risk language",
            "management commentary changes",
            "liquidity and debt changes",
            "operating or segment changes",
            "source-backed evidence",
        ],
    },
    {
        title: "Complete Disclosed Risk Analysis is a Premium section",
        body: "Inspect the full set of risk themes organized from company disclosures.",
        unlocks: [
            "complete risk factor breakdowns",
            "plain-English risk themes",
            "severity context when available",
            "filing-backed risk evidence",
        ],
    },
    {
        title: "Financial Health Deep Dive is a Premium section",
        body: "Go beyond the snapshot with deeper financial signal context.",
        unlocks: [
            "revenue, margin, liquidity, debt, and cash flow context",
            "company strength signal breakdowns",
            "SEC companyfacts metrics where available",
            "source-backed financial evidence",
        ],
    },
    {
        title: "Valuation Context is a Premium section",
        body: "Review valuation signals as research context, not a buy or sell call.",
        unlocks: [
            "market valuation signal context",
            "available market cap and financial metric comparisons",
            "research framing without price predictions",
        ],
    },
    {
        title: "Full Source Trail is a Premium section",
        body: "Trace major takeaways back to filing context, metrics, or company disclosures.",
        unlocks: [
            "research receipts for key insights",
            "filing and metric source context",
            "clear separation between source-backed context and AI interpretation",
        ],
    },
    {
        title: "Saved Research History is a Premium section",
        body: "Keep a deeper record of reports you have generated and companies you revisit.",
        unlocks: [
            "saved research history",
            "faster return path to prior briefs",
            "Research Desk continuity",
        ],
    },
]

function getTickerFromSlug(slug: string) {
    return slug.replace("-stock-analysis", "").toUpperCase()
}

function getRatingFromScore(score: number) {
    if (score >= 85) return "Strong"
    if (score >= 70) return "Stable"
    if (score >= 50) return "Watch"
    return "Weak"
}

function severityStyles(severity: string) {
    switch (severity) {
        case "High":
            return "bg-red-500/15 text-red-300 border border-red-400/30"
        case "Medium-High":
            return "bg-orange-500/15 text-orange-300 border border-orange-400/30"
        case "Medium":
            return "bg-yellow-500/15 text-yellow-300 border border-yellow-400/30"
        default:
            return "bg-slate-500/15 text-slate-300 border border-slate-400/30"
    }
}

function normalizeRisks(risks: (AnalysisRisk | string)[] | undefined) {
    if (!risks || risks.length === 0) {
        return [
            {
                title: "Risk analysis pending",
                severity: "Medium" as const,
                description:
                    "Detailed risk factors will appear after this company’s SEC filing text is analyzed.",
            },
        ]
    }

    return risks.map((risk) => {
        if (typeof risk === "string") {
            return {
                title: risk,
                severity: "Medium" as const,
                description:
                    "This risk was identified in the cached analysis. A fuller description will be generated when filing section extraction is connected.",
            }
        }

        return risk
    })
}

function normalizeFilingNotes(notes: AnalysisJson["filingNotes"]) {
    if (!notes || notes.length === 0) {
        return [
            {
                type: "Pending",
                direction: "down",
                text: "Filing comparison will be generated after prior and current SEC filing text are connected.",
            },
        ]
    }

    return notes.map((note) => ({
        type: note.type,
        direction: "up",
        text: note.text,
    }))
}

function getVisitorId() {
    const key = "stokr_visitor_id"

    let visitorId = window.localStorage.getItem(key)

    if (!visitorId) {
        visitorId =
            typeof crypto !== "undefined" && "randomUUID" in crypto
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random().toString(16).slice(2)}`

        window.localStorage.setItem(key, visitorId)
    }

    return visitorId
}

async function getReportHeaders() {
    const headers: Record<string, string> = {
        "x-stokr-visitor-id": getVisitorId(),
    }

    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`
    }

    return headers
}


export default function StockAnalysisClient({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const [ticker, setTicker] = useState("")
    const [cachedAnalysis, setCachedAnalysis] = useState<CachedAnalysis | null>(null)
    const [financialMetrics, setFinancialMetrics] =
        useState<FinancialMetricsApiResponse | null>(null)
    const [marketOverview, setMarketOverview] =
        useState<StockOverviewApiResponse | null>(null)

    const [isLoadingCache, setIsLoadingCache] = useState(true)
    const [shouldGenerate, setShouldGenerate] = useState(false)
    const [error, setError] = useState("")
    const [limitReached, setLimitReached] = useState(false)
    const [showLowerReportSections, setShowLowerReportSections] = useState(false)
    const [accessPremium, setAccessPremium] = useState<boolean | null>(null)

    const viewedTickersRef = useRef<Set<string>>(new Set())
    const limitTrackedTickersRef = useRef<Set<string>>(new Set())

    useEffect(() => {
        let cancelled = false

        async function loadParams() {
            const resolvedParams = await params

            if (cancelled) return

            setTicker(getTickerFromSlug(resolvedParams.slug))
        }

        loadParams()

        return () => {
            cancelled = true
        }
    }, [params])

    const loadCachedReport = useCallback(async () => {
        if (!ticker) return

        setIsLoadingCache(true)
        setShouldGenerate(false)
        setError("")
        setLimitReached(false)
        setAccessPremium(null)

        try {
            const headers = await getReportHeaders()

            const res = await fetch(
                `/api/analysis-cache?ticker=${encodeURIComponent(ticker)}`,
                {
                    method: "GET",
                    cache: "no-store",
                    headers,
                }
            )

            const data = await res.json().catch(() => null)

            if (res.status === 404) {
                setShouldGenerate(true)
                return
            }

            if (res.status === 402) {
                setLimitReached(true)
                setAccessPremium(false)

                if (!limitTrackedTickersRef.current.has(ticker)) {
                    limitTrackedTickersRef.current.add(ticker)
                    trackReportLimitReached(ticker)
                }

                throw new Error(
                    data?.error ||
                    "Starter Research report limit reached. Starter users get 3 AI stock reports per week."
                )
            }

            if (!res.ok) {
                throw new Error(data?.error || "Failed to load report.")
            }

            setCachedAnalysis(data.data as CachedAnalysis)
            setAccessPremium(Boolean(data?.access?.premium))
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load report.")
        } finally {
            setIsLoadingCache(false)
        }
    }, [ticker])

    useEffect(() => {
        if (!ticker || viewedTickersRef.current.has(ticker)) return

        viewedTickersRef.current.add(ticker)
        trackViewStockReport(ticker)
    }, [ticker])

    useEffect(() => {
        let isMounted = true

        async function runLoadCachedReport() {
            await Promise.resolve()

            if (!isMounted) return

            await loadCachedReport()
        }

        void runLoadCachedReport()

        return () => {
            isMounted = false
        }
    }, [loadCachedReport])

    useEffect(() => {
        if (!ticker) return

        let cancelled = false

        async function loadExtraData() {
            try {
                const [metricsRes, overviewRes] = await Promise.all([
                    fetch(`/api/sec/metrics?ticker=${encodeURIComponent(ticker)}`, {
                        cache: "no-store",
                    }),
                    fetch(`/api/stock-overview?ticker=${encodeURIComponent(ticker)}`, {
                        cache: "no-store",
                    }),
                ])

                if (!cancelled && metricsRes.ok) {
                    const metricsData = await metricsRes.json().catch(() => null)
                    setFinancialMetrics(metricsData)
                }

                if (!cancelled && overviewRes.ok) {
                    const overviewData = await overviewRes.json().catch(() => null)
                    setMarketOverview(overviewData)
                }
            } catch {
                if (!cancelled) {
                    setFinancialMetrics(null)
                    setMarketOverview(null)
                }
            }
        }

        loadExtraData()

        return () => {
            cancelled = true
        }
    }, [ticker])

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            setShowLowerReportSections(true)
        }, 250)

        return () => {
            window.clearTimeout(timeout)
        }
    }, [])

    const aiAnalysis = useMemo(() => {
        const raw = cachedAnalysis?.analysis_json

        if (!raw) return null

        if (typeof raw === "string") {
            try {
                return JSON.parse(raw) as AnalysisJson
            } catch {
                return null
            }
        }

        return raw
    }, [cachedAnalysis])

    if (!ticker || isLoadingCache) {
        return (
            <main className="stokr-page">
                <section className="stokr-shell">
                    <div className="stokr-bg" />

                    <div className="relative z-10 mx-auto max-w-7xl">
                        <NavBar showSearch />

                        <div className="stokr-card mt-20 p-8 text-center">
                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#19C37D]">
                                Loading Report
                            </p>
                            <h1 className="mt-3 text-3xl font-bold text-white">
                                Checking report access...
                            </h1>
                        </div>
                    </div>
                </section>
            </main>
        )
    }

    if (shouldGenerate) {
        return (
            <AnalysisReportLoading
                ticker={ticker}
                onComplete={loadCachedReport}
            />
        )
    }

    if (error || limitReached || !cachedAnalysis || !aiAnalysis) {
        return (
            <main className="stokr-page">
                <section className="stokr-shell">
                    <div className="stokr-bg" />

                    <div className="relative z-10 mx-auto max-w-7xl">
                        <NavBar showSearch />

                        <div className="stokr-card mt-20 p-8 text-center">
                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#19C37D]">
                                {limitReached ? "Limit Reached" : "Report Unavailable"}
                            </p>

                            <h1 className="mt-3 text-4xl font-extrabold text-white">
                                {ticker} Report Access
                            </h1>

                            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-300">
                                {error || "This report could not be loaded."}
                            </p>

                            {limitReached ? (
                                <ReportLimitUpgradePrompt />
                            ) : (
                                <div className="mt-6 flex justify-center gap-3">
                                    <Link
                                        href="/"
                                        className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/15"
                                    >
                                        Back Home
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        )
    }

    const aiHealthScore = aiAnalysis.healthScore || 0
    const financialScore = financialMetrics?.financialScore ?? 0
    const valuationScore = financialMetrics?.valuationScore ?? 0
    const marketConnectionScore =
        marketOverview?.price && marketOverview?.marketCap ? 100 : 0

    const healthScore =
        financialScore > 0
            ? Math.round(aiHealthScore * 0.45 + financialScore * 0.55)
            : aiHealthScore

    const rating = getRatingFromScore(healthScore)

    const pageData = {
        ticker,
        companyName: cachedAnalysis.company_name || `${ticker} Stock Analysis`,
        badge: "Source-backed AI brief",
        cacheStatus: "Cached analysis loaded",

        summary:
            aiAnalysis.summary ||
            `${ticker} analysis is ready. Summary data was not returned by the AI analysis.`,

        healthScore,
        rating,

        note: "stokr provides informational research tools only and does not provide financial advice. This report is protected by your report access limit. Starter users get 3 AI stock reports per week.",

        topSignals:
            aiAnalysis.topSignals || [
                "AI filing analysis has not returned top signals yet.",
                "SEC financial metrics are loaded where available.",
                "Live market and filing comparison data are connected where available.",
            ],

        risks: normalizeRisks(aiAnalysis.risks),

        bullCase:
            aiAnalysis.bullCase || [
                "Bull case analysis was not returned by the cached report.",
            ],

        bearCase:
            aiAnalysis.bearCase || [
                "Bear case analysis was not returned by the cached report.",
            ],

        redFlags:
            aiAnalysis.redFlags || [
                "Red flag detection did not return specific findings.",
            ],

        healthBreakdown: [
            {
                label: "AI Filing Analysis",
                score: aiHealthScore,
                blurb: "Generated from cached company filing analysis.",
            },
            {
                label: "Live Financial Metrics",
                score: financialScore,
                blurb:
                    financialScore > 0
                        ? "Generated from SEC companyfacts financial metrics."
                        : "SEC companyfacts score is pending or unavailable.",
            },
            {
                label: "Market Valuation",
                score: valuationScore,
                blurb:
                    valuationScore > 0
                        ? "Generated from market cap compared against revenue, earnings, and free cash flow."
                        : "Market valuation score is pending or unavailable.",
            },
            {
                label: "Market Data Connection",
                score: marketConnectionScore,
                blurb:
                    marketConnectionScore > 0
                        ? "Live price and market cap data are connected."
                        : "Live price or market cap data is pending.",
            },
        ],

        revenueBreakdown:
            aiAnalysis.revenueSegments && aiAnalysis.revenueSegments.length > 0
                ? aiAnalysis.revenueSegments.map((segment) => ({
                    label: segment.label,
                    percentage: 0,
                    note: segment.note,
                }))
                : [
                    {
                        label: "Segment data pending",
                        percentage: 0,
                        note: "Revenue segment extraction has not been generated yet.",
                    },
                ],

        whatChanged: normalizeFilingNotes(aiAnalysis.filingNotes),

        mdna: {
            drivers:
                aiAnalysis.mdna?.drivers ||
                aiAnalysis.topSignals || [
                    "Management discussion analysis is pending real filing extraction.",
                ],
            concerns:
                aiAnalysis.mdna?.concerns ||
                aiAnalysis.redFlags || [
                    "Management concerns will be generated from the company’s MD&A section.",
                ],
        },

        filings: [
            { title: "Cached Form", value: cachedAnalysis.form_type || "Pending" },
            { title: "Filing Date", value: cachedAnalysis.filing_date || "Pending" },
            {
                title: "Accession Number",
                value: cachedAnalysis.filing_accession_number || "Pending",
            },
            { title: "Source", value: "analysis_cache" },
        ],

        sources: [
            "Cached AI analysis",
            "Supabase analysis_cache",
            "SEC companyfacts metrics where available",
            "Market data API where available",
        ],
    }

    const shareReport = {
        ticker: pageData.ticker,
        companyName: cachedAnalysis.company_name || pageData.ticker,
        overallScore: pageData.healthScore,
        summary: aiAnalysis.summary || null,
        bullCase: aiAnalysis.bullCase || null,
        bearCase: aiAnalysis.bearCase || null,
        topRisks: aiAnalysis.risks || null,
        financialHealth:
            pageData.healthScore > 0
                ? `Overall financial health context is ${pageData.healthScore}/100 based on available filing analysis and metrics.`
                : null,
        generatedAt:
            cachedAnalysis.updated_at ||
            cachedAnalysis.created_at ||
            cachedAnalysis.filing_date ||
            null,
        reportUrl: typeof window !== "undefined" ? window.location.href : null,
    }

    return (
        <main className="stokr-page">
            <section className="stokr-shell">
                <div className="stokr-bg" />

                <div className="relative z-10 w-full">
                    <NavBar showSearch />

                    <div className="mx-auto w-full max-w-7xl min-w-0">
                        <section className="grid gap-6 py-10 sm:py-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
                            <div className="min-w-0">
                                <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
                                    <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
                                        <span className="max-w-full break-words rounded-full border border-white/[0.10] bg-[#151923] px-3 py-1.5 font-mono text-xs font-semibold text-[#DDE2FF] sm:px-4 sm:text-sm">
                                            {pageData.ticker}
                                        </span>

                                        <span className="max-w-full break-words rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 sm:px-4 sm:text-sm">
                                            {pageData.badge}
                                        </span>

                                        <span className="max-w-full break-words rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 sm:px-4 sm:text-sm">
                                            {pageData.cacheStatus}
                                        </span>
                                    </div>

                                    <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
                                        <ShareAnalysisButton
                                            report={shareReport}
                                            ticker={pageData.ticker}
                                        />
                                        <AddToWatchlistButton
                                            ticker={pageData.ticker}
                                            companyName={pageData.companyName}
                                        />
                                        <InfoTooltip
                                            label="Explain Research Tracker"
                                            title="Research Tracker"
                                            body="The Research Tracker helps users save companies they want to revisit. Future versions can highlight new filings, updated reports, or changed risk context."
                                        />
                                    </div>
                                </div>

                                <h1 className="mt-5 max-w-3xl break-words text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
                                    {pageData.companyName}
                                </h1>

                                <p className="mt-5 max-w-3xl text-base leading-7 text-[#A3AAB8]">
                                    {pageData.summary}
                                </p>

                                <p className="mt-4 max-w-2xl text-sm leading-6 text-[#6F7685]">
                                    {pageData.note}
                                </p>

                                <StockOverviewCards
                                    ticker={pageData.ticker}
                                    fallbackHealthScore={pageData.healthScore}
                                    fallbackRating={pageData.rating}
                                />
                            </div>

                            <div className="stokr-card p-5 sm:p-6">
                                <HelpedKicker
                                    label="Research Brief"
                                    tooltipLabel="Explain AI summary"
                                    tooltipTitle="Source Trail"
                                    tooltipBody="Source Trail shows where an insight came from, such as a filing type, section, financial metric, or company disclosure. It helps separate source-backed context from AI interpretation."
                                >
                                    Summarizes the main research points from available
                                    data, filings, and metrics. Use it as a starting
                                    point, not as financial advice.
                                </HelpedKicker>
                                <h2 className="mt-3 text-2xl font-bold text-white">
                                    Source-Backed Brief
                                </h2>

                                <div className="mt-6 space-y-4">
                                    {pageData.topSignals.map((signal, index) => (
                                        <div
                                            key={`${signal}-${index}`}
                                            className="rounded-2xl border border-white/10 bg-black/15 p-4"
                                        >
                                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                                                Signal {index + 1}
                                            </p>
                                            <p className="mt-2 text-sm leading-relaxed text-slate-200">
                                                {signal}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                                    <p className="text-sm leading-relaxed text-slate-300">
                                        Research context is most useful when it shows whether the business is getting stronger or weaker,
                                        where disclosed risk is concentrated, and what changed since the prior filing.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
                            <StockPriceChart ticker={pageData.ticker} />

                            <div className="stokr-card p-5">
                                <HelpedKicker
                                    label="Company Strength Snapshot"
                                    tooltipLabel="Explain financial health"
                                    tooltipTitle="Company strength snapshot"
                                    tooltipBody="This section groups key financial signals such as revenue, margins, liquidity, debt, and cash flow into a readable company overview."
                                >
                                    Combines available analysis and metrics into a
                                    simple view of financial condition. It is
                                    informational and should be checked against the
                                    underlying data.
                                </HelpedKicker>

                                <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
                                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-white/[0.12] bg-[#151923] text-3xl font-semibold text-white">
                                        {pageData.healthScore}
                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-bold text-white">
                                            {pageData.rating}
                                        </h2>
                                        <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
                                            Composite view of profitability, balance sheet quality, cash generation,
                                            growth stability, and risk pressure.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-7 space-y-5">
                                    {pageData.healthBreakdown.map((item) => (
                                        <div key={item.label}>
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-semibold text-white">
                                                    {item.label}
                                                </p>
                                                <p className="text-sm font-semibold text-[#DDE2FF]">
                                                    {item.score > 0 ? `${item.score}/100` : "Pending"}
                                                </p>
                                            </div>

                                            <div className="mt-2 h-2.5 rounded-full bg-white/10">
                                                <div
                                                    className="h-2.5 rounded-full bg-[#19C37D]"
                                                    style={{ width: `${Math.max(item.score, 0)}%` }}
                                                />
                                            </div>

                                            <p className="mt-2 text-xs leading-relaxed text-slate-400">
                                                {item.blurb}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <FinancialMetricCards ticker={pageData.ticker} />

                        <LazyFilingComparisonSection ticker={pageData.ticker} />

                        <section className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
                            <div className="stokr-card p-5 sm:p-6">
                                <HelpedKicker
                                    label="Disclosed Risk Signals"
                                    tooltipLabel="Explain risk factors"
                                    tooltipTitle="Disclosed risk signals"
                                    tooltipBody="This section summarizes risks the company disclosed in filings and organizes them into plain-English themes. It helps users inspect risk context faster, not predict outcomes."
                                >
                                    Highlights risks mentioned in company filings or
                                    analysis. These are things that could negatively
                                    affect the business or stock.
                                </HelpedKicker>

                                <h2 className="mt-3 text-2xl font-bold text-white">
                                    Disclosed Risk Signals
                                </h2>

                                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                                    New to company risk disclosures? Read stokr&apos;s{" "}
                                    <Link
                                        href="/blog/how-to-use-risk-factors"
                                        className="font-semibold text-[#9AA6FF] hover:text-white"
                                    >
                                        guide to using risk factors
                                    </Link>
                                    .
                                </p>

                                <div className="mt-6 space-y-4">
                                    {pageData.risks.map((risk) => (
                                        <div
                                            key={risk.title}
                                            className="rounded-2xl border border-white/10 bg-black/20 p-4"
                                        >
                                            <div className="flex flex-wrap items-center justify-between gap-3">
                                                <h3 className="text-base font-bold text-white">
                                                    {risk.title}
                                                </h3>

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${severityStyles(
                                                        risk.severity
                                                    )}`}
                                                >
                                                    {risk.severity}
                                                </span>
                                            </div>

                                            <p className="mt-3 text-sm leading-relaxed text-slate-400">
                                                {risk.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {showLowerReportSections ? (
                                <div className="stokr-card p-5 sm:p-6">
                                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#19C37D]">
                                        MD&amp;A Summary
                                    </p>

                                    <h2 className="mt-3 text-2xl font-bold text-white">
                                        Management Discussion
                                    </h2>

                                    <div className="mt-6 grid gap-5 md:grid-cols-2">
                                        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                                            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">
                                                Performance Drivers
                                            </h3>

                                            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-300">
                                                {pageData.mdna.drivers.map((driver) => (
                                                    <li key={driver}>• {driver}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="rounded-2xl border border-orange-400/20 bg-orange-500/10 p-4">
                                            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-orange-300">
                                                Management Concerns
                                            </h3>

                                            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-300">
                                                {pageData.mdna.concerns.map((concern) => (
                                                    <li key={concern}>• {concern}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-96 rounded-xl border border-white/[0.08] bg-[#11141C]" />
                            )}
                        </section>

                        {showLowerReportSections && (
                            <>
                                <section className="stokr-card mt-8 p-5 sm:p-6">
                                    <HelpedKicker
                                        label="Decision Framing"
                                        tooltipLabel="Explain bull and bear case"
                                        tooltipTitle="Decision framing"
                                        tooltipBody="The Upside Thesis summarizes factors that may support a constructive view of the company. The Downside Thesis summarizes risks, pressures, or uncertainties that may challenge that view. These are research perspectives, not predictions or financial advice."
                                    >
                                        The Upside Thesis summarizes factors that may
                                        support a constructive view of the company. The
                                        Downside Thesis summarizes risks, pressures, or
                                        uncertainties that may challenge that view.
                                    </HelpedKicker>

                                    <h2 className="mt-3 text-2xl font-bold text-white">
                                        Upside Thesis / Downside Thesis
                                    </h2>

                                    <p className="mt-3 text-sm leading-relaxed text-slate-400">
                                        Learn how to compare both sides in{" "}
                                        <Link
                                            href="/blog/bull-case-vs-bear-case"
                                            className="font-semibold text-[#9AA6FF] hover:text-white"
                                        >
                                            stokr&apos;s bull case vs bear case explainer
                                        </Link>
                                        .
                                    </p>

                                    <div className="mt-6 grid gap-5 md:grid-cols-2">
                                        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-5">
                                            <h3 className="text-lg font-bold text-emerald-300">
                                                Upside Thesis
                                            </h3>

                                            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-300">
                                                {pageData.bullCase.map((item) => (
                                                    <li key={item}>• {item}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-5">
                                            <h3 className="text-lg font-bold text-red-300">
                                                Downside Thesis
                                            </h3>

                                            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-300">
                                                {pageData.bearCase.map((item) => (
                                                    <li key={item}>• {item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
                                    <div className="stokr-card p-5 sm:p-6">
                                        <HelpedKicker
                                            label="Revenue Mix"
                                            tooltipLabel="Explain segment contribution"
                                            tooltipTitle="Company strength snapshot"
                                            tooltipBody="This section groups key financial signals such as revenue, margins, liquidity, debt, and cash flow into a readable company overview."
                                        >
                                            Breaks down how different business segments,
                                            products, or divisions contribute to the
                                            company when that information is available.
                                        </HelpedKicker>

                                        <h2 className="mt-3 text-2xl font-bold text-white">
                                            Segment Contribution
                                        </h2>

                                        <p className="mt-3 text-sm leading-relaxed text-slate-400">
                                            Useful for spotting concentration risk, business quality shifts, and which parts of the company are driving growth.
                                        </p>

                                        <div className="mt-6 space-y-4">
                                            {pageData.revenueBreakdown.map((segment) => (
                                                <div
                                                    key={`${segment.label}-${segment.note}`}
                                                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                                                >
                                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-300">
                                                            {segment.label}
                                                        </p>

                                                        {segment.percentage > 0 && (
                                                            <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                                                                {segment.percentage}%
                                                            </span>
                                                        )}
                                                    </div>

                                                    {segment.percentage > 0 && (
                                                        <div className="mt-3 h-2 rounded-full bg-white/10">
                                                            <div
                                                                className="h-2 rounded-full bg-emerald-400"
                                                                style={{ width: `${segment.percentage}%` }}
                                                            />
                                                        </div>
                                                    )}

                                                    <p className="mt-3 text-sm leading-relaxed text-slate-300">
                                                        {segment.note}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="stokr-card p-5 sm:p-6">
                                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#19C37D]">
                                            Alert Layer
                                        </p>

                                        <h2 className="mt-3 text-2xl font-bold text-white">
                                            Red Flags
                                        </h2>

                                        <ul className="mt-6 space-y-3 text-sm leading-relaxed text-slate-300">
                                            {pageData.redFlags.map((flag) => (
                                                <li
                                                    key={flag}
                                                    className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-red-100"
                                                >
                                                    • {flag}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </section>

                                <section className="stokr-card mt-8 p-5 sm:p-6">
                                    <HelpedKicker
                                        label="Source Transparency"
                                        tooltipLabel="Explain source transparency"
                                        tooltipTitle="Source Trail"
                                        tooltipBody="Source Trail shows where an insight came from, such as a filing type, section, financial metric, or company disclosure. It helps separate source-backed context from AI interpretation."
                                    >
                                        Shows where the analysis came from, such as
                                        filings, market data, or generated summaries, so
                                        users can understand the basis of the research.
                                    </HelpedKicker>

                                    <h2 className="mt-3 text-2xl font-bold text-white">
                                        Filing Coverage
                                    </h2>

                                    <p className="mt-3 text-sm leading-relaxed text-slate-400">
                                        If the filing terminology is new, start with{" "}
                                        <Link
                                            href="/blog/what-is-a-10-k"
                                            className="font-semibold text-[#9AA6FF] hover:text-white"
                                        >
                                            what a 10-K is and why it matters
                                        </Link>
                                        .
                                    </p>

                                    <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                        {pageData.filings.map((filing) => (
                                            <div
                                                key={filing.title}
                                                className="rounded-2xl border border-white/10 bg-black/20 p-4"
                                            >
                                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                                    {filing.title}
                                                </p>

                                                <p className="mt-3 break-words text-sm font-semibold text-white">
                                                    {filing.value}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                                        <p className="text-sm font-semibold text-white">
                                            Source Stack
                                        </p>

                                        <ul className="mt-3 space-y-2 text-sm text-slate-400">
                                            {pageData.sources.map((source) => (
                                                <li key={source}>• {source}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </section>

                                <section className="stokr-card-muted mt-8 p-6">
                                    <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/[0.08] bg-[#11141C] p-4">
                                        <div>
                                            <p className="text-sm font-bold text-white">
                                                Share this analysis
                                            </p>
                                            <p className="mt-1 text-sm text-slate-400">
                                                Create a branded image for social platforms without changing the report.
                                            </p>
                                        </div>

                                        <ShareAnalysisButton
                                            report={shareReport}
                                            ticker={pageData.ticker}
                                            className="stokr-button-secondary"
                                        />
                                    </div>

                                    <p className="text-sm leading-relaxed text-slate-300">
                                        <span className="font-semibold text-white">Disclaimer:</span>{" "}
                                        stokr provides informational research tools only and does not provide financial advice.
                                        Some sections may display pending placeholders until live market data, SEC metrics,
                                        and filing comparison tools are fully connected.
                                    </p>
                                </section>

                                {accessPremium === false && (
                                    <>
                                        <PremiumTeaserSections ticker={pageData.ticker} />
                                        <PremiumPreview
                                            ticker={pageData.ticker}
                                            source="stock_report"
                                            showCoupon
                                        />
                                    </>
                                )}

                                <RelatedStocks ticker={pageData.ticker} />
                            </>
                        )}
                    </div>
                </div>
            </section>
        </main>
    )
}

function PremiumTeaserSections({ ticker }: { ticker: string }) {
    return (
        <section className="stokr-card mt-8 p-5 sm:p-6">
            <p className="stokr-kicker">Premium research layers</p>
            <h2 className="mt-3 text-2xl font-bold text-white">
                Unlock the evidence behind the {ticker} brief
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#A3AAB8]">
                These sections show the structure of Full Research Desk without
                inventing company-specific findings. Upgrade to inspect the
                filing-backed breakdown when data is available.
            </p>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {premiumTeaserSections.map((section) => (
                    <article
                        key={section.title}
                        className="rounded-xl border border-white/[0.08] bg-black/20 p-4"
                    >
                        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#19C37D]">
                            Locked
                        </p>
                        <h3 className="mt-2 text-lg font-semibold text-white">
                            {section.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-[#A7ADBA]">
                            {section.body}
                        </p>
                        <ul className="mt-4 space-y-2 text-sm leading-6 text-[#CBD5E1]">
                            {section.unlocks.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </article>
                ))}
            </div>

            <Link href="/pricing" className="stokr-button-primary mt-6">
                Unlock Full Research Desk
            </Link>
        </section>
    )
}

function HelpedKicker({
    label,
    tooltipLabel,
    tooltipTitle,
    tooltipBody,
    children,
}: {
    label: string
    tooltipLabel: string
    tooltipTitle?: string
    tooltipBody?: string
    children: ReactNode
}) {
    return (
        <div className="flex min-w-0 items-center gap-2">
            <p className="min-w-0 break-words font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#19C37D] sm:text-sm sm:tracking-[0.25em]">
                {label}
            </p>
            <InfoTooltip
                label={tooltipLabel}
                title={tooltipTitle}
                body={tooltipBody}
            >
                {children}
            </InfoTooltip>
        </div>
    )
}

