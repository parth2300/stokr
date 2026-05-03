import { DashboardMetric } from "@/app/lib/dashboardTypes"

function accentClasses(accent: DashboardMetric["accent"]) {
  switch (accent) {
    case "green":
      return "border-emerald-400/30 bg-emerald-500/10 text-emerald-300"
    case "red":
      return "border-red-400/30 bg-red-500/10 text-red-300"
    case "yellow":
      return "border-yellow-400/30 bg-yellow-500/10 text-yellow-300"
    default:
      return "border-[#7C9DFF]/40 bg-[#7C9DFF]/12 text-[#9DB6FF]"
  }
}

export default function DashboardMetricCard({ metric }: { metric: DashboardMetric }) {
  return (
    <div className="min-w-0 rounded-[22px] border border-[#7C9DFF]/35 bg-white/[0.045] p-3.5 shadow-[0_0_18px_rgba(124,157,255,0.08)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            {metric.label}
          </p>

          <p className="mt-2 text-2xl font-extrabold text-white">
            {metric.value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {metric.detail}
          </p>
        </div>

        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${accentClasses(metric.accent)}`}>
          <span className="text-sm font-black">S</span>
        </div>
      </div>
    </div>
  )
}