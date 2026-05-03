import { DashboardChange } from "@/app/lib/dashboardTypes"

function directionIcon(direction?: DashboardChange["direction"]) {
  if (direction === "up") return "↑"
  if (direction === "down") return "↓"
  return "•"
}

function directionClass(direction?: DashboardChange["direction"]) {
  if (direction === "up") return "text-emerald-300"
  if (direction === "down") return "text-red-300"
  return "text-[#7C9DFF]"
}

export default function WhatChangedToday({
  changes,
}: {
  changes: DashboardChange[]
}) {
  return (
    <section className="flex h-[520px] min-w-0 flex-col overflow-hidden rounded-[26px] border border-[#7C9DFF]/40 bg-white/[0.045] p-5 shadow-[0_0_20px_rgba(124,157,255,0.10)] backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
            Updates
          </p>

          <h2 className="mt-1 text-xl font-bold text-white">
            What Changed Today
          </h2>
        </div>

        <button className="text-xs font-semibold text-[#9DB6FF] hover:text-white">
          View All
        </button>
      </div>

      <div className="stokr-scrollbar mt-5 min-h-0 flex-1 space-y-3 overflow-y-auto pr-2">
        {changes.map((change) => (
          <div
            key={`${change.ticker}-${change.title}`}
            className="rounded-xl border border-white/10 bg-black/20 p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="rounded-md border border-[#7C9DFF]/25 bg-[#7C9DFF]/10 px-2 py-0.5 text-[10px] font-bold text-blue-100">
                    {change.ticker}
                  </span>

                  <span className={`text-xs font-bold ${directionClass(change.direction)}`}>
                    {directionIcon(change.direction)}
                  </span>
                </div>

                <p className="mt-2 text-sm font-bold text-white">
                  {change.title}
                </p>

                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  {change.description}
                </p>
              </div>

              <p className="shrink-0 text-[10px] text-slate-500">
                {change.timeAgo}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}