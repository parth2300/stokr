"use client"

import dynamic from "next/dynamic"
import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import NavBar from "@/app/components/navBar"
import StockOverviewCards from "@/app/components/analytics/stockOverviewCards"
import AnalysisReportLoading from "@/app/components/analytics/analysisReportLoading"
import AddToWatchlistButton from "@/app/components/watchlist/AddToWatchlistButton"
import LazyFilingComparisonSection from "@/app/components/analytics/LazyFilingComparisonSection"
import { supabase } from "@/app/lib/supabase"

const StockPriceChart = dynamic(
    () => import("@/app/components/analytics/stockPriceChart"),
    {
        ssr: false,
        loading: () => (
            <div className="h-[420px] animate-pulse rounded-[30px] border border-[#7C9DFF]/30 bg-white/[0.04]" />
        ),
    }
)

const FinancialMetricCards = dynamic(
    () => import("@/app/components/analytics/financialMetricCards"),
    {
        ssr: false,
        loading: () => (
            <div className="mt-8 h-40 animate-pulse rounded-[30px] border border-[#7C9DFF]/30 bg-white/[0.04]" />
        ),
    }
)

type CachedAnalysis = {
    ticker: string
    company_name: string | null
    form_type: string | null
    filing_accession_number: string | null
    filing_date: string | null
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
                throw new Error(
                    data?.error ||
                    "Free report limit reached. Free users get 3 AI stock reports per week."
                )
            }

            if (!res.ok) {
                throw new Error(data?.error || "Failed to load report.")
            }

            setCachedAnalysis(data.data as CachedAnalysis)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load report.")
        } finally {
            setIsLoadingCache(false)
        }
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
            <main className="min-h-screen bg-[#0F172A] text-white">
                <section className="relative min-h-screen px-6 py-5 md:px-10 lg:px-20">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_18%,rgba(255,138,101,0.28),transparent_38%),radial-gradient(circle_at_82%_20%,rgba(124,157,255,0.26),transparent_42%),radial-gradient(circle_at_50%_70%,rgba(124,157,255,0.10),transparent_48%)]" />
                    <div className="absolute inset-0 bg-black/20" />

                    <div className="relative z-10 mx-auto max-w-7xl">
                        <NavBar showSearch />

                        <div className="mt-20 rounded-[30px] border border-[#7C9DFF]/40 bg-white/[0.045] p-8 text-center shadow-[0_0_24px_rgba(124,157,255,0.12)] backdrop-blur-md">
                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
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
            <main className="min-h-screen bg-[#0F172A] text-white">
                <section className="relative min-h-screen px-6 py-5 md:px-10 lg:px-20">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_18%,rgba(255,138,101,0.28),transparent_38%),radial-gradient(circle_at_82%_20%,rgba(124,157,255,0.26),transparent_42%),radial-gradient(circle_at_50%_70%,rgba(124,157,255,0.10),transparent_48%)]" />
                    <div className="absolute inset-0 bg-black/20" />

                    <div className="relative z-10 mx-auto max-w-7xl">
                        <NavBar showSearch />

                        <div className="mt-20 rounded-[30px] border border-[#7C9DFF]/40 bg-white/[0.045] p-8 text-center shadow-[0_0_24px_rgba(124,157,255,0.12)] backdrop-blur-md">
                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
                                {limitReached ? "Limit Reached" : "Report Unavailable"}
                            </p>

                            <h1 className="mt-3 text-4xl font-extrabold text-white">
                                {ticker} Report Access
                            </h1>

                            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-300">
                                {error || "This report could not be loaded."}
                            </p>

                            <div className="mt-6 flex justify-center gap-3">
                                <Link
                                    href="/"
                                    className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/15"
                                >
                                    Back Home
                                </Link>

                                {limitReached && (
                                    <Link
                                        href="/pricing"
                                        className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-[#0F172A] hover:bg-blue-100"
                                    >
                                        View Premium
                                    </Link>
                                )}
                            </div>
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
        badge: "AI Analysis",
        cacheStatus: "Cached analysis loaded",

        summary:
            aiAnalysis.summary ||
            `${ticker} analysis is ready. Summary data was not returned by the AI analysis.`,

        healthScore,
        rating,

        note: "This report is protected by your report access limit. Free users get 3 AI stock reports per week.",

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

    return (
        <main className="min-h-screen overflow-x-hidden bg-[#0F172A] text-white">
            <section className="relative min-h-screen px-6 py-5 md:px-10 lg:px-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_18%,rgba(255,138,101,0.28),transparent_38%),radial-gradient(circle_at_82%_20%,rgba(124,157,255,0.26),transparent_42%),radial-gradient(circle_at_50%_70%,rgba(124,157,255,0.10),transparent_48%)]" />
                <div className="absolute inset-0 bg-black/20" />

                <div className="relative z-10 w-full">
                    <NavBar showSearch />

                    <div className="mx-auto max-w-7xl">
                        <section className="grid gap-8 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                            <div>
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="rounded-full border border-[#7C9DFF]/40 bg-[#7C9DFF]/12 px-4 py-1.5 text-sm font-semibold text-blue-100">
                                            {pageData.ticker}
                                        </span>

                                        <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300">
                                            {pageData.badge}
                                        </span>

                                        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-semibold text-emerald-300">
                                            {pageData.cacheStatus}
                                        </span>
                                    </div>

                                    <AddToWatchlistButton
                                        ticker={pageData.ticker}
                                        companyName={pageData.companyName}
                                    />
                                </div>

                                <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                                    {pageData.companyName}
                                </h1>

                                <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">
                                    {pageData.summary}
                                </p>

                                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-400">
                                    {pageData.note}
                                </p>

                                <StockOverviewCards
                                    ticker={pageData.ticker}
                                    fallbackHealthScore={pageData.healthScore}
                                    fallbackRating={pageData.rating}
                                />
                            </div>

                            <div className="rounded-[30px] border border-[#7C9DFF]/60 bg-white/[0.05] p-6 shadow-lg backdrop-blur-md">
                                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
                                    Executive Snapshot
                                </p>
                                <h2 className="mt-3 text-2xl font-bold text-white">
                                    Top Signals
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
                                        Investors usually care most about whether the business is getting stronger or weaker,
                                        where the risk is concentrated, and what changed since the prior filing.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
                            <StockPriceChart ticker={pageData.ticker} />

                            <div className="rounded-[30px] border border-[#7C9DFF]/60 bg-white/[0.05] p-5 shadow-lg backdrop-blur-md">
                                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
                                    Financial Health
                                </p>

                                <div className="mt-5 flex items-center gap-5">
                                    <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-8 border-[#7C9DFF]/30 bg-[#7C9DFF]/10 text-3xl font-bold text-white">
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
                                                <p className="text-sm font-semibold text-blue-100">
                                                    {item.score > 0 ? `${item.score}/100` : "Pending"}
                                                </p>
                                            </div>

                                            <div className="mt-2 h-2.5 rounded-full bg-white/8">
                                                <div
                                                    className="h-2.5 rounded-full bg-[#7C9DFF]"
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

                        <section className="mt-8 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
                            <div className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6 shadow-lg">
                                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
                                    Top Risks
                                </p>

                                <h2 className="mt-3 text-2xl font-bold text-white">
                                    Ranked Risk Factors
                                </h2>

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
                                <div className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6 shadow-lg">
                                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
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
                                <div className="h-96 rounded-[30px] border border-white/10 bg-white/[0.04]" />
                            )}
                        </section>

                        {showLowerReportSections && (
                            <>
                                <section className="mt-8 rounded-[30px] border border-white/10 bg-white/[0.05] p-6 shadow-lg">
                                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
                                        Decision Framing
                                    </p>

                                    <h2 className="mt-3 text-2xl font-bold text-white">
                                        Bull vs Bear Case
                                    </h2>

                                    <div className="mt-6 grid gap-5 md:grid-cols-2">
                                        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-5">
                                            <h3 className="text-lg font-bold text-emerald-300">
                                                Bull Case
                                            </h3>

                                            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-300">
                                                {pageData.bullCase.map((item) => (
                                                    <li key={item}>• {item}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-5">
                                            <h3 className="text-lg font-bold text-red-300">
                                                Bear Case
                                            </h3>

                                            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-300">
                                                {pageData.bearCase.map((item) => (
                                                    <li key={item}>• {item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.85fr]">
                                    <div className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6 shadow-lg">
                                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
                                            Revenue Mix
                                        </p>

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

                                    <div className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6 shadow-lg">
                                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
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

                                <section className="mt-8 rounded-[30px] border border-white/10 bg-white/[0.05] p-6 shadow-lg">
                                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
                                        Source Transparency
                                    </p>

                                    <h2 className="mt-3 text-2xl font-bold text-white">
                                        Filing Coverage
                                    </h2>

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

                                <section className="mt-8 mb-16 rounded-[28px] border border-white/10 bg-black/20 p-6">
                                    <p className="text-sm leading-relaxed text-slate-300">
                                        <span className="font-semibold text-white">Disclaimer:</span>{" "}
                                        This analytics page is for informational analysis only and should not be treated as financial,
                                        investment, or trading advice. Some sections may display pending placeholders until
                                        live market data, SEC metrics, and filing comparison tools are fully connected.
                                    </p>
                                </section>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </main>
    )
}