"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/app/lib/supabase"
import ReportLimitUpgradePrompt from "@/app/components/ReportLimitUpgradePrompt"
import {
    trackGenerateReport,
    trackReportLimitReached,
} from "@/app/lib/analytics"

type AnalysisReportLoadingProps = {
    ticker: string
    onComplete?: () => void
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

export default function AnalysisReportLoading({
    ticker,
    onComplete,
}: AnalysisReportLoadingProps) {
    const router = useRouter()
    const [status, setStatus] = useState("Preparing company filing analysis...")
    const [error, setError] = useState("")
    const [limitReached, setLimitReached] = useState(false)

    const isMissingTenKError =
        error.toLowerCase().includes("10-k") ||
        error.toLowerCase().includes("10k") ||
        error.toLowerCase().includes("filing")

    const points = useMemo(
        () => [
            "10,92",
            "70,70",
            "130,82",
            "190,44",
            "250,58",
            "310,26",
            "370,36",
            "430,14",
        ],
        []
    )

    useEffect(() => {
        let cancelled = false

        async function generateAnalysis() {
            try {
                setError("")
                setLimitReached(false)
                setStatus("Fetching latest SEC filing...")

                await new Promise((resolve) => setTimeout(resolve, 700))

                if (cancelled) return
                setStatus("Reading business, risk, and management sections...")

                const headers = await getReportHeaders()

                const res = await fetch(
                    `/api/generate-analysis?ticker=${encodeURIComponent(ticker)}`,
                    {
                        method: "GET",
                        cache: "no-store",
                        headers,
                    }
                )

                const data = await res.json().catch(() => null)

                if (!res.ok) {
                    if (res.status === 402) {
                        setLimitReached(true)
                        trackReportLimitReached(ticker)
                    }

                    throw new Error(
                        data?.error || data?.message || "Failed to generate AI analysis."
                    )
                }

                if (cancelled) return
                trackGenerateReport(ticker)
                setStatus("Saving report to analysis cache...")

                await new Promise((resolve) => setTimeout(resolve, 700))

                if (cancelled) return
                setStatus("Report ready. Loading analysis page...")

                if (onComplete) {
                    onComplete()
                } else {
                    router.refresh()
                }
            } catch (err) {
                if (cancelled) return

                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to generate AI analysis."
                )
            }
        }

        generateAnalysis()

        return () => {
            cancelled = true
        }
    }, [router, ticker, onComplete])

    return (
        <main className="stokr-page">
            <section className="relative flex min-h-screen items-center justify-center px-6 py-10">
                <div className="stokr-bg" />

                <div className="stokr-card relative z-10 w-full max-w-3xl p-8 md:p-10">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="stokr-kicker">
                                {limitReached ? "Report Limit Reached" : "Generating AI Report"}
                            </p>

                            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                                {ticker} Analysis
                            </h1>

                            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#A3AAB8] md:text-base">
                                {limitReached
                                    ? "Free users can access 3 reports. Upgrade to Premium for unlimited report access."
                                    : "The report is being generated from filing data, financial signals, risk factors, management commentary, and investor-facing decision points."}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-right">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                                Status
                            </p>
                            <p className="mt-1 text-sm font-semibold text-emerald-300">
                                {error ? "Stopped" : "Running"}
                            </p>
                        </div>
                    </div>

                    {!limitReached && (
                        <div className="stokr-card-muted mt-10 p-5">
                            <svg
                                viewBox="0 0 440 120"
                                className="h-48 w-full overflow-visible"
                                role="img"
                                aria-label="Animated stock chart loading graphic"
                            >
                                <defs>
                                    <linearGradient id="loadingLine" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#7C8CFF" stopOpacity="0.35" />
                                        <stop offset="50%" stopColor="#8FB3FF" stopOpacity="1" />
                                        <stop offset="100%" stopColor="#34D399" stopOpacity="1" />
                                    </linearGradient>

                                    <linearGradient id="loadingFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#7C8CFF" stopOpacity="0.32" />
                                        <stop offset="100%" stopColor="#7C8CFF" stopOpacity="0.02" />
                                    </linearGradient>
                                </defs>

                                <path
                                    d={`M ${points.join(" L ")} L 430 118 L 10 118 Z`}
                                    fill="url(#loadingFill)"
                                    className="animate-pulse"
                                />

                                <polyline
                                    points={points.join(" ")}
                                    fill="none"
                                    stroke="url(#loadingLine)"
                                    strokeWidth="5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeDasharray="900"
                                    strokeDashoffset="900"
                                >
                                    <animate
                                        attributeName="stroke-dashoffset"
                                        from="900"
                                        to="0"
                                        dur="1.8s"
                                        repeatCount="indefinite"
                                    />
                                </polyline>

                                {points.map((point, index) => {
                                    const [cx, cy] = point.split(",")
                                    return (
                                        <circle
                                            key={point}
                                            cx={cx}
                                            cy={cy}
                                            r="4"
                                            fill={index === points.length - 1 ? "#34D399" : "#8FB3FF"}
                                            opacity="0.95"
                                        >
                                            <animate
                                                attributeName="r"
                                                values="3;6;3"
                                                dur="1.6s"
                                                begin={`${index * 0.12}s`}
                                                repeatCount="indefinite"
                                            />
                                        </circle>
                                    )
                                })}
                            </svg>
                        </div>
                    )}

                    <div className="mt-8">
                        <div className="flex items-center justify-between gap-4">
                            <p className="text-sm font-semibold text-white">
                                {error || status}
                            </p>

                            {!error && (
                                <div className="flex gap-1">
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#7C8CFF]" />
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#7C8CFF] [animation-delay:120ms]" />
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#7C8CFF] [animation-delay:240ms]" />
                                </div>
                            )}
                        </div>

                        {!limitReached && (
                            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                                <div className="h-full w-1/2 animate-[loadingBar_1.6s_ease-in-out_infinite] rounded-full bg-[#7C8CFF]" />
                            </div>
                        )}

                        {error && (
                            <>
                                {limitReached && <ReportLimitUpgradePrompt />}

                                <div className="mt-6 flex flex-wrap items-center gap-3">
                                    {isMissingTenKError && (
                                        <button
                                            onClick={() => router.push("/")}
                                            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
                                        >
                                            <span aria-hidden="true">←</span>
                                            Back to main page
                                        </button>
                                    )}

                                    {!limitReached && (
                                        <button
                                            onClick={() => window.location.reload()}
                                            className="rounded-full border border-white/[0.10] bg-[#151923] px-5 py-2 text-sm font-semibold text-[#DDE2FF] transition hover:bg-[#191E29]"
                                        >
                                            Retry generation
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    <style jsx>{`
                        @keyframes loadingBar {
                            0% {
                                transform: translateX(-100%);
                            }
                            50% {
                                transform: translateX(75%);
                            }
                            100% {
                                transform: translateX(220%);
                            }
                        }
                    `}</style>
                </div>
            </section>
        </main>
    )
}

