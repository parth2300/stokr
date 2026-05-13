"use client"

import { useState } from "react"
import InfoTooltip from "@/app/components/ui/InfoTooltip"

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
        <section className="stokr-card mt-8 p-5 sm:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#19C37D]">
                            Filing Delta
                        </p>
                        <InfoTooltip
                            label="Explain Filing Delta"
                            title="Filing Comparison"
                            body="Highlights meaningful wording, risk, financial, or operating changes between company filings when enough filing data is available."
                        />
                    </div>
                    <h2 className="mt-3 text-2xl font-semibold text-white">What Changed Between Filings</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
                        Compares the latest 10-K against the previous 10-K to identify changes in risk,
                        business discussion, and management commentary.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={loadComparison}
                    disabled={loading}
                    className="stokr-button-primary"
                >
                    {loading ? "Loading..." : comparison ? "Reload Cached Filing Delta" : "Load Filing Delta"}
                </button>
            </div>

            {!hasRequested && !comparison && (
                <div className="mt-7 rounded-lg border border-white/10 bg-black/15 p-5">
                    <p className="text-sm leading-relaxed text-slate-300">
                        Load the latest cached Filing Delta when available.
                        If no cached Filing Delta exists for these filings,
                        the server will generate it once and save it for future users.
                    </p>
                </div>
            )}

            {error && (
                <div className="mt-7 rounded-lg border border-red-400/20 bg-red-500/10 p-5">
                    <p className="font-semibold text-red-300">Filing Delta unavailable</p>
                    <p className="mt-2 text-sm text-slate-300">{error}</p>
                </div>
            )}

            {comparison && (
                <div className="mt-7 space-y-6">
                    <div className="rounded-lg border border-white/10 bg-black/20 p-5">
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

                    <div className="rounded-lg border border-white/10 bg-black/15 p-5">
                        <h3 className="text-lg font-semibold text-white">Filing Delta Summary</h3>
                        <p className="mt-3 text-sm leading-relaxed text-slate-300">
                            {comparison.comparison.summary}
                        </p>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                        {comparison.comparison.changes.map((change, index) => (
                            <div
                                key={`${change.type}-${index}`}
                                className="rounded-lg border border-white/10 bg-black/15 p-5"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <span className="rounded-md border border-white/[0.10] bg-white/[0.04] px-3 py-1 text-xs font-semibold text-[#DDE2FF]">
                                        {change.type}
                                    </span>

                                    <span
                                        className={`rounded-md border px-3 py-1 text-xs font-semibold ${severityStyles(
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
        <div className="rounded-lg border border-white/10 bg-black/15 p-5">
            <h3 className="font-semibold text-white">{title}</h3>

            <ul className="mt-4 list-disc space-y-3 pl-5">
                {items.map((item, index) => (
                    <li key={`${title}-${index}`} className="text-sm leading-relaxed text-slate-300">
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    )
}

