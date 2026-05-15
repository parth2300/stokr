import { DashboardMetric } from "@/app/lib/dashboardTypes"

export default function DashboardMetricCard({ metric }: { metric: DashboardMetric }) {
  return (
    <div className="min-w-0 border border-[#222120] bg-[#111111] p-4">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#3E3D3A]">
        {metric.label}
      </p>

      <p className="mt-2 font-serif text-3xl font-black italic leading-none tracking-[-0.03em] text-[#F0EDE6]">
        {metric.value}
      </p>

      <p className="mt-2 text-xs leading-5 text-[#9A9690]">
        {metric.detail}
      </p>
    </div>
  )
}


