import { DashboardMetric } from "@/app/lib/dashboardTypes"

export default function DashboardMetricCard({ metric }: { metric: DashboardMetric }) {
  return (
    <div className="min-w-0 rounded-lg border border-white/[0.08] bg-[#0D1118] p-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        {metric.label}
      </p>

      <p className="mt-1.5 text-xl font-semibold text-white">
        {metric.value}
      </p>

      <p className="mt-0.5 text-xs leading-5 text-slate-400">
        {metric.detail}
      </p>
    </div>
  )
}


