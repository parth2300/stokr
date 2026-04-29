function getTickerFromSlug(slug: string) {
  return slug.replace("-stock-analysis", "").toUpperCase()
}


import NavBar from "@/app/components/navBar"
import StockPriceChart from "@/app/components/analytics/stockPriceChart"
import { appleAnalytics } from "@/app/lib/mock/appleAnalytics"

function severityStyles(severity: string) {
  switch (severity) {
    case "High":
      return "bg-red-500/15 text-red-300 border border-red-400/30"
    case "Medium-High":
      return "bg-orange-500/15 text-orange-300 border border-orange-400/30"
    case "Medium":
      return "bg-yellow-500/15 text-yellow-300 border border-yellow-400/30"
    default:
      return "bg-slate-500/15 text-slate-300 border border-slate-400/30"
  }
}

function changeStyles(direction: string) {
  return direction === "up"
    ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300"
    : "border-orange-400/30 bg-orange-500/10 text-orange-300"
}

export default function AppleAnalyticsPage() {
  const data = appleAnalytics

  return (
    <main className="min-h-screen overflow-hidden bg-[#0F172A] text-white">
      <section className="relative min-h-screen px-6 py-5 md:px-10 lg:px-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_18%,rgba(255,138,101,0.28),transparent_38%),radial-gradient(circle_at_82%_20%,rgba(124,157,255,0.26),transparent_42%),radial-gradient(circle_at_50%_70%,rgba(124,157,255,0.10),transparent_48%)]" />
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <NavBar />

          <section className="grid gap-8 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-[#7C9DFF]/40 bg-[#7C9DFF]/12 px-4 py-1.5 text-sm font-semibold text-blue-100">
                  {data.company.ticker}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300">
                  {data.company.badge}
                </span>
              </div>

              <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                {data.company.name}
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">
                {data.company.summary}
              </p>

              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-400">
                {data.company.note}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Price</p>
                  <p className="mt-2 text-2xl font-bold text-white">{data.company.price}</p>
                  <p className="mt-1 text-sm font-semibold text-emerald-400">{data.company.change}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Market Cap</p>
                  <p className="mt-2 text-2xl font-bold text-white">{data.company.marketCap}</p>
                  <p className="mt-1 text-sm text-slate-400">Large-cap quality profile</p>
                </div>

                <div className="rounded-2xl border border-[#7C9DFF]/40 bg-[#7C9DFF]/10 px-5 py-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.2em] text-blue-100/80">Health Score</p>
                  <p className="mt-2 text-2xl font-bold text-white">
                    {data.company.healthScore}/100
                  </p>
                  <p className="mt-1 text-sm text-blue-100">{data.company.rating}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-[#7C9DFF]/60 bg-white/[0.05] p-6 shadow-[0_0_22px_rgba(124,157,255,0.14)] backdrop-blur-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
                Executive Snapshot
              </p>
              <h2 className="mt-3 text-2xl font-bold text-white">Top Signals</h2>

              <div className="mt-6 space-y-4">
                {data.topSignals.map((signal, index) => (
                  <div
                    key={signal}
                    className="rounded-2xl border border-white/10 bg-black/15 p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Signal {index + 1}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-200">{signal}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm leading-relaxed text-slate-300">
                  Investors usually care most about whether the business is getting stronger or weaker,
                  where the risk is concentrated, and what changed since the prior filing.
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
            <StockPriceChart />

            <div className="rounded-[30px] border border-[#7C9DFF]/60 bg-white/[0.05] p-5 shadow-[0_0_22px_rgba(124,157,255,0.14)] backdrop-blur-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
                Financial Health
              </p>

              <div className="mt-5 flex items-center gap-5">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-8 border-[#7C9DFF]/30 bg-[#7C9DFF]/10 text-3xl font-bold text-white">
                  {data.company.healthScore}
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white">{data.company.rating}</h2>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
                    Composite view of profitability, balance sheet quality, cash generation,
                    growth stability, and risk pressure.
                  </p>
                </div>
              </div>

              <div className="mt-7 space-y-5">
                {data.healthBreakdown.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">{item.label}</p>
                      <p className="text-sm font-semibold text-blue-100">{item.score}/100</p>
                    </div>

                    <div className="mt-2 h-2.5 rounded-full bg-white/8">
                      <div
                        className="h-2.5 rounded-full bg-[#7C9DFF]"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>

                    <p className="mt-2 text-xs leading-relaxed text-slate-400">{item.blurb}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {data.keyMetrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur"
              >
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{metric.label}</p>
                <p className="mt-3 text-2xl font-bold text-white">{metric.value}</p>
                <p className="mt-2 text-sm text-emerald-400">{metric.delta}</p>
              </div>
            ))}
          </section>

          <section className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[30px] border border-[#7C9DFF]/60 bg-white/[0.05] p-6 shadow-[0_0_22px_rgba(124,157,255,0.14)] backdrop-blur-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
                Revenue Mix
              </p>
              <h2 className="mt-3 text-2xl font-bold text-white">Segment Contribution</h2>
              <p className="mt-2 text-sm text-slate-400">
                Useful for spotting concentration risk and business quality shifts.
              </p>

              <div className="mt-8 space-y-5">
                {data.revenueBreakdown.map((segment) => (
                  <div key={segment.label}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">{segment.label}</p>
                      <p className="text-sm text-blue-100">{segment.percentage}%</p>
                    </div>

                    <div className="mt-2 h-3 rounded-full bg-white/8">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-[#7C9DFF] to-[#FF8A65]"
                        style={{ width: `${segment.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-[#7C9DFF]/60 bg-white/[0.05] p-6 shadow-[0_0_22px_rgba(124,157,255,0.14)] backdrop-blur-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
                Top Risks
              </p>
              <h2 className="mt-3 text-2xl font-bold text-white">Ranked Risk Factors</h2>

              <div className="mt-7 space-y-4">
                {data.risks.map((risk) => (
                  <div
                    key={risk.title}
                    className="rounded-2xl border border-white/10 bg-black/15 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-base font-semibold text-white">{risk.title}</h3>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${severityStyles(risk.severity)}`}>
                        {risk.severity}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-slate-300">
                      {risk.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-[30px] border border-[#7C9DFF]/60 bg-white/[0.05] p-6 shadow-[0_0_22px_rgba(124,157,255,0.14)] backdrop-blur-xl">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
                  Filing Comparison
                </p>
                <h2 className="mt-3 text-2xl font-bold text-white">What Changed</h2>
              </div>

              <p className="max-w-xl text-sm text-slate-400">
                This is the premium-style section that tells users what shifted between the current
                filing and the previous reporting period.
              </p>
            </div>

            <div className="mt-7 grid gap-4 lg:grid-cols-2">
              {data.whatChanged.map((item) => (
                <div
                  key={item.text}
                  className="rounded-2xl border border-white/10 bg-black/15 p-5"
                >
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${changeStyles(item.direction)}`}>
                    {item.type}
                  </span>
                  <p className="mt-4 text-sm leading-relaxed text-slate-300">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 grid gap-8 lg:grid-cols-2">
            <div className="rounded-[30px] border border-[#7C9DFF]/60 bg-white/[0.05] p-6 shadow-[0_0_22px_rgba(124,157,255,0.14)] backdrop-blur-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
                MD&A Summary
              </p>
              <h2 className="mt-3 text-2xl font-bold text-white">Management Discussion</h2>

              <div className="mt-7 grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-base font-semibold text-white">Performance Drivers</h3>
                  <ul className="mt-4 space-y-3">
                    {data.mdna.drivers.map((item) => (
                      <li key={item} className="rounded-2xl border border-white/10 bg-black/15 p-4 text-sm leading-relaxed text-slate-300">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white">Management Concerns</h3>
                  <ul className="mt-4 space-y-3">
                    {data.mdna.concerns.map((item) => (
                      <li key={item} className="rounded-2xl border border-white/10 bg-black/15 p-4 text-sm leading-relaxed text-slate-300">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-[#7C9DFF]/60 bg-white/[0.05] p-6 shadow-[0_0_22px_rgba(124,157,255,0.14)] backdrop-blur-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
                Decision Framing
              </p>
              <h2 className="mt-3 text-2xl font-bold text-white">Bull vs Bear Case</h2>

              <div className="mt-7 grid gap-5 md:grid-cols-2">
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-5">
                  <h3 className="text-lg font-bold text-emerald-300">Bull Case</h3>
                  <ul className="mt-4 space-y-3">
                    {data.bullCase.map((item) => (
                      <li key={item} className="text-sm leading-relaxed text-slate-200">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-5">
                  <h3 className="text-lg font-bold text-red-300">Bear Case</h3>
                  <ul className="mt-4 space-y-3">
                    {data.bearCase.map((item) => (
                      <li key={item} className="text-sm leading-relaxed text-slate-200">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[30px] border border-[#7C9DFF]/60 bg-white/[0.05] p-6 shadow-[0_0_22px_rgba(124,157,255,0.14)] backdrop-blur-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
                Alert Layer
              </p>
              <h2 className="mt-3 text-2xl font-bold text-white">Red Flags</h2>

              <div className="mt-6 space-y-3">
                {data.redFlags.map((flag) => (
                  <div
                    key={flag}
                    className="rounded-2xl border border-white/10 bg-black/15 p-4 text-sm leading-relaxed text-slate-300"
                  >
                    {flag}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-[#7C9DFF]/60 bg-white/[0.05] p-6 shadow-[0_0_22px_rgba(124,157,255,0.14)] backdrop-blur-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
                Source Transparency
              </p>
              <h2 className="mt-3 text-2xl font-bold text-white">Filing Coverage</h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {data.filings.map((filing) => (
                  <div
                    key={filing.title}
                    className="rounded-2xl border border-white/10 bg-black/15 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      {filing.title}
                    </p>
                    <p className="mt-3 text-base font-semibold text-white">{filing.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
                <h3 className="text-base font-semibold text-white">Source Stack</h3>
                <ul className="mt-4 space-y-2">
                  {data.sources.map((source) => (
                    <li key={source} className="text-sm text-slate-300">
                      • {source}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="mt-8 mb-16 rounded-[28px] border border-white/10 bg-black/20 p-6">
            <p className="text-sm leading-relaxed text-slate-300">
              <span className="font-semibold text-white">Disclaimer:</span> This analytics page is a
              product UI demonstration using sample values. The production version should source live
              market data, structured financial data, and parsed filing content. The page is for
              informational analysis only and should not be treated as financial, investment, or trading advice.
            </p>
          </section>
        </div>
      </section>
    </main>
  )
}