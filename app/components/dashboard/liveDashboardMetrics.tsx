"use client"

import { useCallback, useEffect, useState } from "react"
import { supabase } from "@/app/lib/supabase"
import DashboardMetricCard from "./dashboardMetricCard"
import { DashboardMetric } from "@/app/lib/dashboardTypes"

type DashboardSummaryResponse = {
    planStatus: string
    isPremium: boolean
    reportsUsed: number
    monthlyReportLimit: number
    watchlistCount: number
    savedStockCount: number
    activeAlerts: number
    activeAlertDetail: string
}

async function getAuthHeader() {
    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session?.access_token) {
        throw new Error("Missing auth session. Please log in again.")
    }

    return {
        Authorization: `Bearer ${session.access_token}`,
    }
}

async function readApiError(res: Response) {
    const data = await res.json().catch(() => null)

    return data?.error || "Request failed"
}

function buildMetrics(summary: DashboardSummaryResponse): DashboardMetric[] {
    return [
        {
            label: "Plan Status",
            value: summary.planStatus,
            detail: summary.isPremium
                ? "Premium dashboard access enabled"
                : "Free account",
            accent: summary.isPremium ? "green" : "blue",
        },
        {
            label: "AI Reports Used",
            value: `${summary.reportsUsed} / ${summary.monthlyReportLimit}`,
            detail: "Cached reports from watchlist stocks",
            accent: "blue",
        },
        {
            label: "Watchlists",
            value: String(summary.watchlistCount),
            detail: `${summary.savedStockCount} saved stocks`,
            accent: "blue",
        },
        {
            label: "Active Alerts",
            value: String(summary.activeAlerts),
            detail: summary.activeAlertDetail,
            accent: summary.activeAlerts > 0 ? "red" : "green",
        },
    ]
}

export default function LiveDashboardMetrics() {
    const [metrics, setMetrics] = useState<DashboardMetric[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    const loadSummary = useCallback(async () => {
        setIsLoading(true)
        setError("")

        try {
            const authHeader = await getAuthHeader()

            const res = await fetch("/api/dashboard/summary", {
                method: "GET",
                headers: authHeader,
            })

            if (!res.ok) {
                throw new Error(await readApiError(res))
            }

            const data = (await res.json()) as DashboardSummaryResponse

            setMetrics(buildMetrics(data))
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to load dashboard summary."
            )
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            loadSummary()
        }, 0)

        return () => {
            window.clearTimeout(timeoutId)
        }
    }, [loadSummary])

    if (isLoading) {
        return (
            <>
                {[1, 2, 3, 4].map((item) => (
                    <div
                        key={item}
                        className="min-h-[105px] animate-pulse rounded-[22px] border border-[#7C9DFF]/25 bg-white/[0.045]"
                    />
                ))}
            </>
        )
    }

    if (error) {
        return (
            <div className="rounded-[22px] border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100 xl:col-span-4">
                {error}
            </div>
        )
    }

    return (
        <>
            {metrics.map((metric) => (
                <DashboardMetricCard key={metric.label} metric={metric} />
            ))}
        </>
    )
}