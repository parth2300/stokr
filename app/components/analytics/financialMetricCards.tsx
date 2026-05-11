"use client"

import { useEffect, useState } from "react"
import InfoTooltip from "@/app/components/ui/InfoTooltip"

type CompanyMetric = {
  label: string
  value: string
  rawValue: number | null
  filed: string | null
  form: string | null
}

type FinancialMetricsResponse = {
  companyName: string
  cik: string
  ticker: string
  revenue: CompanyMetric
  netIncome: CompanyMetric
  freeCashFlow: CompanyMetric
  totalDebt: CompanyMetric
}

export default function FinancialMetricCards({ ticker }: { ticker: string }) {
  const [metrics, setMetrics] = useState<FinancialMetricsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadMetrics() {
      try {
        setLoading(true)
        setError("")

        const res = await fetch(`/api/sec/metrics?ticker=${encodeURIComponent(ticker)}`)
        const data = await res.json()

        if (!res.ok) {
          setError(data.error || "Could not load SEC metrics")
          return
        }

        setMetrics(data)
      } catch {
        setError("Could not load SEC metrics")
      } finally {
        setLoading(false)
      }
    }

    loadMetrics()
  }, [ticker])

  if (loading) {
    return (
      <section className="mt-8">
        <FinancialMetricsHeader />
        <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {["Revenue", "Net Income", "Free Cash Flow", "Debt"].map((label) => (
            <div key={label} className="stokr-card p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                {label}
              </p>
              <p className="mt-3 break-words text-2xl font-bold text-white">Loading...</p>
              <p className="mt-2 text-sm text-slate-400">SEC data</p>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (error || !metrics) {
    return (
      <section className="mt-8">
        <FinancialMetricsHeader />
        <div className="mt-3 rounded-xl border border-red-400/20 bg-red-500/10 p-5">
          <p className="font-semibold text-red-300">SEC metrics unavailable</p>
          <p className="mt-2 text-sm text-slate-300">{error}</p>
        </div>
      </section>
    )
  }

  const cards = [
    metrics.revenue,
    metrics.netIncome,
    metrics.freeCashFlow,
    metrics.totalDebt,
  ]

  return (
    <section className="mt-8">
      <FinancialMetricsHeader />
      <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((metric) => (
          <div key={metric.label} className="stokr-card p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
              {metric.label}
            </p>
            <p className="mt-3 break-words text-2xl font-bold text-white">{metric.value}</p>
            <p className="mt-2 break-words text-sm text-emerald-400">
              {metric.form || "SEC"} {metric.filed ? `- ${metric.filed}` : ""}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

function FinancialMetricsHeader() {
  return (
    <div className="flex items-center gap-2">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#19C37D]">
        Financial Metrics
      </p>
      <InfoTooltip
        label="Explain financial metrics"
        title="Company strength snapshot"
        body="This section groups key financial signals such as revenue, margins, liquidity, debt, and cash flow into a readable company overview."
      />
    </div>
  )
}
