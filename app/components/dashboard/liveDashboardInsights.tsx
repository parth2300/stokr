"use client"

import { useCallback, useEffect, useState } from "react"
import { supabase } from "@/app/lib/supabase"
import ScoreLeaderboard from "./scoreLeaderboard"
import WatchlistInsights from "./watchlistInsights"
import {
    DashboardInsight,
    LeaderboardItem,
} from "@/app/lib/dashboardTypes"

type DashboardInsightsResponse = {
    leaderboard: LeaderboardItem[]
    insights: DashboardInsight[]
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
    const contentType = res.headers.get("content-type")

    if (contentType?.includes("application/json")) {
        const data = await res.json().catch(() => null)
        return data?.error || `Request failed with status ${res.status}`
    }

    const text = await res.text().catch(() => "")

    return text
        ? `Request failed with status ${res.status}: ${text.slice(0, 160)}`
        : `Request failed with status ${res.status}`
}

export default function LiveDashboardInsights() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([])
    const [insights, setInsights] = useState<DashboardInsight[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    const loadInsights = useCallback(async () => {
        setIsLoading(true)
        setError("")

        try {
            const authHeader = await getAuthHeader()

            const res = await fetch("/api/dashboard/insights", {
                method: "GET",
                headers: authHeader,
            })

            if (!res.ok) {
                throw new Error(await readApiError(res))
            }

            const data = (await res.json()) as DashboardInsightsResponse

            setLeaderboard(data.leaderboard || [])
            setInsights(data.insights || [])
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to load dashboard insights."
            )
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            loadInsights()
        }, 0)

        return () => {
            window.clearTimeout(timeoutId)
        }
    }, [loadInsights])

    if (isLoading) {
        return (
            <>
                <section className="min-w-0 rounded-xl border border-white/[0.09] bg-[#11141C] p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#7C8CFF]">
                        Leaderboard
                    </p>
                    <div className="mt-5 space-y-3">
                        <div className="h-8 animate-pulse rounded-xl bg-white/10" />
                        <div className="h-8 animate-pulse rounded-xl bg-white/10" />
                        <div className="h-8 animate-pulse rounded-xl bg-white/10" />
                    </div>
                </section>

                <section className="min-w-0 rounded-xl border border-white/[0.09] bg-[#11141C] p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#7C8CFF]">
                        Insights
                    </p>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <div className="h-24 animate-pulse rounded-xl bg-white/10" />
                        <div className="h-24 animate-pulse rounded-xl bg-white/10" />
                        <div className="h-24 animate-pulse rounded-xl bg-white/10" />
                        <div className="h-24 animate-pulse rounded-xl bg-white/10" />
                    </div>
                </section>
            </>
        )
    }

    if (error) {
        return (
            <section className="rounded-xl border border-red-400/20 bg-red-500/10 p-5 text-sm text-red-100 xl:col-span-2">
                {error}
            </section>
        )
    }

    return (
        <>
            <ScoreLeaderboard items={leaderboard} />
            <WatchlistInsights insights={insights} />
        </>
    )
}

