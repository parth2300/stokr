import { DashboardChange } from "@/app/lib/dashboardTypes"

function directionIcon(direction?: DashboardChange["direction"]) {
  if (direction === "up") return "+"
  if (direction === "down") return "-"
  return "."
}

function directionClass(direction?: DashboardChange["direction"]) {
  if (direction === "up") return "text-emerald-300"
  if (direction === "down") return "text-red-300"
  return "text-[#A7ADBA]"
}

export default function WhatChangedToday({
  changes,
}: {
  changes: DashboardChange[]
}) {
  return (
    <section className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-white/[0.09] bg-[#0D1118] p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="stokr-kicker">
            Research Activity
          </p>

          <h2 className="mt-1 text-xl font-bold text-white">
            Recent Context
          </h2>
        </div>

        <button className="text-xs font-semibold text-[#19C37D] hover:text-white">
          Activity
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
                  <span className="rounded-md border border-white/[0.10] bg-white/[0.04] px-2 py-0.5 text-[10px] font-bold text-[#DDE2FF]">
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
