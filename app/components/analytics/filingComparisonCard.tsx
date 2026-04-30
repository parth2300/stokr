"use client"

import { useEffect, useState } from "react"

type FilingChange = {
    type: string
    severity: "Low" | "Medium" | "Medium-High" | "High"
    text: string
}

type FilingComparisonResponse = {
    ticker: string
    companyName: string
    latestFiling: {
        form: string
        filingDate: string
        accessionNumber: string
        primaryDocument: string
    }
    previousFiling: {
        form: string
        filingDate: string
        accessionNumber: string
        primaryDocument: string
    }
    comparison: {
        summary: string
        changes: FilingChange[]
        riskChanges: string[]
        businessChanges: string[]
        mdnaChanges: string[]
    }
    generatedAt: string
}

function severityStyles(severity: string) {
    switch (severity) {
        case "High":
            return "border-red-400/30 bg-red-500/15 text-red-300"
        case "Medium-High":
            return "border-orange-400/30 bg-orange-500/15 text-orange-300"
        case "Medium":
            return "border-yellow-400/30 bg-yellow-500/15 text-yellow-300"
        default:
            return "border-slate-400/30 bg-slate-500/15 text-slate-300"
    }
}

export default function FilingComparisonCard({ ticker }: { ticker: string }) {
    const [comparison, setComparison] = useState<FilingComparisonResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [hasRequested, setHasRequested] = useState(false)

    async function loadComparison() {
        try {
            setLoading(true)
            setError("")
            setHasRequested(true)

            const res = await fetch(
                `/api/filing-comparison?ticker=${encodeURIComponent(ticker)}`
            )

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Could not generate filing comparison")
                return
            }

            setComparison(data)
        } catch {
            setError("Could not generate filing comparison")
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="mt-8 rounded-[30px] border border-[#7C9DFF]/60 bg-white/[0.05] p-6 shadow-[0_0_22px_rgba(124,157,255,0.14)] backdrop-blur-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
                        Filing Comparison
                    </p>
                    <h2 className="mt-3 text-2xl font-bold text-white">What Changed</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
                        Compares the latest 10-K against the previous 10-K to identify changes in risk,
                        business discussion, and management commentary.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={loadComparison}
                    disabled={loading}
                    className="rounded-xl bg-[#7C9DFF] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#93B4FF] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Loading..." : comparison ? "Reload Cached Comparison" : "Load Filing Comparison"}
                </button>
            </div>

            {!hasRequested && !comparison && (
                <div className="mt-7 rounded-2xl border border-white/10 bg-black/15 p-5">
                    <p className="text-sm leading-relaxed text-slate-300">
                        Load the latest cached filing comparison when available.
                        If no cached comparison exists for these filings,
                        the server will generate it once and save it for future users.
                    </p>
                </div>
            )}

            {error && (
                <div className="mt-7 rounded-2xl border border-red-400/20 bg-red-500/10 p-5">
                    <p className="font-semibold text-red-300">Comparison unavailable</p>
                    <p className="mt-2 text-sm text-slate-300">{error}</p>
                </div>
            )}

            {comparison && (
                <div className="mt-7 space-y-6">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                            Compared Filings
                        </p>
                        <p className="mt-3 text-sm text-slate-300">
                            Latest: {comparison.latestFiling.form} filed {comparison.latestFiling.filingDate}
                        </p>
                        <p className="mt-1 text-sm text-slate-300">
                            Previous: {comparison.previousFiling.form} filed {comparison.previousFiling.filingDate}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/15 p-5">
                        <h3 className="text-lg font-bold text-white">Comparison Summary</h3>
                        <p className="mt-3 text-sm leading-relaxed text-slate-300">
                            {comparison.comparison.summary}
                        </p>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                        {comparison.comparison.changes.map((change, index) => (
                            <div
                                key={`${change.type}-${index}`}
                                className="rounded-2xl border border-white/10 bg-black/15 p-5"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <span className="rounded-full border border-[#7C9DFF]/30 bg-[#7C9DFF]/10 px-3 py-1 text-xs font-semibold text-blue-100">
                                        {change.type}
                                    </span>

                                    <span
                                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${severityStyles(
                                            change.severity
                                        )}`}
                                    >
                                        {change.severity}
                                    </span>
                                </div>

                                <p className="mt-4 text-sm leading-relaxed text-slate-300">
                                    {change.text}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="grid gap-5 lg:grid-cols-3">
                        <ChangeList title="Risk Changes" items={comparison.comparison.riskChanges} />
                        <ChangeList title="Business Changes" items={comparison.comparison.businessChanges} />
                        <ChangeList title="MD&A Changes" items={comparison.comparison.mdnaChanges} />
                    </div>
                </div>
            )}
        </section>
    )
}

function ChangeList({ title, items }: { title: string; items: string[] }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-black/15 p-5">
            <h3 className="font-semibold text-white">{title}</h3>

            <ul className="mt-4 space-y-3">
                {items.map((item, index) => (
                    <li key={`${title}-${index}`} className="text-sm leading-relaxed text-slate-300">
                        • {item}
                    </li>
                ))}
            </ul>
        </div>
    )
}