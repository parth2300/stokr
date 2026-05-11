"use client"

import { useCallback, useEffect, useState } from "react"
import { supabase } from "@/app/lib/supabase"
import DashboardMetricCard from "./dashboardMetricCard"
import { DashboardMetric } from "@/app/lib/dashboardTypes"

type DashboardSummaryResponse = {
  planStatus: string
  isPremium: boolean
  reportsUsed: number
  monthlyReportLimit: number | null
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
  const reportsRemaining = summary.isPremium
    ? "Unlimited"
    : String(Math.max((summary.monthlyReportLimit || 3) - summary.reportsUsed, 0))

  return [
    {
      label: "Plan Status",
      value: summary.planStatus,
      detail: summary.isPremium
        ? "Full Research Desk access enabled"
        : "Free account",
      accent: "green",
    },
    {
      label: "Reports Generated",
      value: String(summary.reportsUsed),
      detail: summary.isPremium
        ? "Unlimited report access"
        : `${summary.monthlyReportLimit || 3} weekly free reports available`,
      accent: "green",
    },
    {
      label: "Saved Companies",
      value: String(summary.savedStockCount),
      detail: `${summary.watchlistCount} Research Tracker${summary.watchlistCount === 1 ? "" : "s"}`,
      accent: "green",
    },
    {
      label: "Reports Remaining",
      value: reportsRemaining,
      detail: summary.isPremium ? "Full Research Desk access" : "Starter Research limit",
      accent: "green",
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
        err instanceof Error ? err.message : "Failed to load Research Desk summary."
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
            className="min-h-[82px] animate-pulse rounded-lg border border-white/[0.08] bg-white/[0.045]"
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

