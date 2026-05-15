import Link from "next/link"
import type { ReactNode } from "react"
import NavBar from "./components/navBar"
import StockSearchBar from "./components/stockSearchBar"

const tickerItems = [
  ["NVDA", "Sample", "+ filing brief"],
  ["AAPL", "Sample", "+ source trail"],
  ["MSFT", "Sample", "+ risk signals"],
  ["META", "Sample", "- pending review"],
  ["TSLA", "Sample", "- volatility context"],
  ["AMZN", "Sample", "+ filing delta"],
  ["GOOGL", "Sample", "+ SEC metrics"],
  ["AMD", "Sample", "- margin watch"],
  ["JPM", "Sample", "+ source stack"],
]

const capabilities = [
  ["Research Brief", "Filing-backed company overview, separated from market noise. Structured for inspection, not hype."],
  ["Filing Delta", "New risk language, removed disclosures, liquidity shifts, debt updates, and commentary changes."],
  ["Risk Signals", "Risks the company actually disclosed, grouped into readable context. Filed, not guessed."],
  ["Source Trail", "Major insights mapped to filings, sections, evidence, and confidence context."],
  ["Bull Case", "Potential strengths framed as research context, not a recommendation."],
  ["Bear Case", "Concerns, pressures, and disclosed risks kept visible before forming an opinion."],
  ["Strength Snapshot", "Revenue, margins, liquidity, debt, and operating signals in one compact view."],
  ["Research Tracker", "Save companies and revisit reports, watchlists, and filing context over time."],
]

const method = [
  ["Detect", "Ticker Search", "Enter a public company ticker. stokr looks for the relevant company research context and filing data."],
  ["Discover", "Filing Scan", "Risk language, financial signals, management commentary, and disclosure themes are organized."],
  ["Direct", "Brief Assembly", "Research objects are assembled into a brief, thesis, risk, snapshot, and source trail."],
  ["Deliver", "Inspect & Save", "Read the brief, inspect the evidence, save to your Research Tracker, or compare companies."],
]

const before = [
  "Open SEC EDGAR manually",
  "Search risk disclosures by hand",
  "Compare current and prior filings yourself",
  "Cross-reference financial statements",
  "Read scattered, unattributed opinions",
  "Still wonder what actually matters",
]

const after = [
  "Search a ticker",
  "Review a source-backed brief",
  "See what changed in recent filings",
  "Review disclosed risks, clearly grouped",
  "Compare bull and bear research context",
  "Trace major insights back to source context",
  "Save to your Research Tracker",
]

export default function Home() {
  return (
    <main className="stokr-page">
      <NavBar />
      <TickerStrip />

      <section className="editorial-hero">
        <div className="editorial-hero-left">
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#3E3D3A]">
              Research Intelligence / No. 01
            </span>
            <span className="hidden font-serif text-[11px] italic text-[#3E3D3A] sm:inline">
              FIG. 01 / SK-26
            </span>
          </div>

          <h1 className="editorial-hero-title">
            Research
            <br />
            that shows
            <br />
            <em>its work.</em>
          </h1>

          <div>
            <p className="mb-8 max-w-[420px] text-xs leading-[1.8] text-[#9A9690]">
              stokr turns SEC filings, financial metrics, risk disclosures, and
              company data into source-backed research briefs. Every major
              takeaway is framed with evidence and context, not market noise.
            </p>
            <StockSearchBar />
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.08em] text-[#3E3D3A]">
              Try{" "}
              <Link href="/stocks/nvda-stock-analysis" className="text-[#9A9690] hover:text-[#F0EDE6]">
                NVDA
              </Link>{" "}
              /{" "}
              <Link href="/stocks/aapl-stock-analysis" className="text-[#9A9690] hover:text-[#F0EDE6]">
                AAPL
              </Link>{" "}
              /{" "}
              <Link href="/stocks/msft-stock-analysis" className="text-[#9A9690] hover:text-[#F0EDE6]">
                MSFT
              </Link>{" "}
              /{" "}
              <Link href="/stocks/tsla-stock-analysis" className="text-[#9A9690] hover:text-[#F0EDE6]">
                TSLA
              </Link>
            </p>
          </div>
        </div>

        <div className="editorial-hero-right">
          <div className="flex flex-1 flex-col gap-5 border-b border-[#222120] p-6 sm:p-10">
            <div className="editorial-panel-label">
              <span>Research Brief Preview / NVDA</span>
              <span>Plate No. 08</span>
            </div>
            <BriefPreview />
            <SourceTrailPreview />
          </div>
          <div className="grid border-t border-[#222120] sm:grid-cols-3">
            {[
              ["10-K", "& 10-Q sourced"],
              ["7+", "signal types"],
              ["Source", "trail visible"],
            ].map(([num, label]) => (
              <div key={label} className="border-b border-r border-[#222120] p-5 last:border-r-0 sm:border-b-0 sm:p-7">
                <span className="block font-serif text-3xl font-black italic leading-none tracking-[-0.02em] text-[#F0EDE6]">
                  {num}
                </span>
                <span className="mt-2 block font-mono text-[9px] uppercase tracking-[0.10em] text-[#3E3D3A]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-b border-t border-[#222120] px-6 py-16 text-center sm:px-12">
        <p className="mx-auto mb-4 max-w-4xl font-serif text-3xl font-black italic leading-[1.1] tracking-[-0.03em] text-[#F0EDE6] sm:text-5xl">
          The strongest research tools do not hide their reasoning. They{" "}
          <em className="text-[#D63C2F]">show their work.</em>
        </p>
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#3E3D3A]">
          stokr / Research Intelligence / Vol. I
        </span>
      </div>

      <EditorialSection number="I." tag="Capabilities / Research Objects" page="002 / 006" title={<>Built for a<br /><em>specific job.</em></>}>
        <p className="editorial-section-intro">
          Not generic AI widgets. Purposeful research objects, each with one clear
          job: understand the company, inspect the risks, compare the thesis, and
          trace the evidence.
        </p>
        <div className="grid border border-[#222120] md:grid-cols-2 lg:grid-cols-4">
          {capabilities.map(([title, desc], index) => (
            <article key={title} className="border-b border-r border-[#222120] p-6 transition hover:bg-[#111111] lg:[&:nth-child(4n)]:border-r-0 lg:[&:nth-last-child(-n+4)]:border-b-0">
              <div className="mb-4 font-serif text-4xl font-black italic leading-none tracking-[-0.03em] text-[#222120]">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="mb-3 font-sans text-[13px] font-bold uppercase tracking-[0.04em] text-[#F0EDE6]">
                {title}
              </h3>
              <p className="text-[11px] leading-[1.7] text-[#9A9690]">{desc}</p>
            </article>
          ))}
        </div>
      </EditorialSection>

      <hr className="border-[#222120]" />

      <EditorialSection number="II." tag="Method / Four stages" page="003 / 006" title={<>From ticker<br />to <em>source-backed brief.</em></>}>
        <p className="editorial-section-intro">
          Four stages. Each composable and inspectable. No opaque research theatre.
        </p>
        <div className="grid border border-[#222120] lg:grid-cols-4">
          {method.map(([verb, title, desc], index) => (
            <article key={title} className="border-b border-r border-[#222120] p-6 last:border-r-0 lg:border-b-0">
              <div className="mb-3 font-serif text-5xl font-black italic leading-none tracking-[-0.04em] text-[#222120]">
                {String(index + 1).padStart(2, "0")}
              </div>
              <span className="mb-4 block font-mono text-[9px] uppercase tracking-[0.12em] text-[#D63C2F]">
                {verb} →
              </span>
              <h3 className="mb-3 font-sans text-xs font-bold uppercase tracking-[0.04em] text-[#F0EDE6]">
                {title}
              </h3>
              <p className="text-[11px] leading-[1.7] text-[#9A9690]">{desc}</p>
            </article>
          ))}
        </div>
      </EditorialSection>

      <hr className="border-[#222120]" />

      <EditorialSection number="III." tag="The Difference / Before & After" page="004 / 006" title={<>From buried<br />to <em>clear.</em></>}>
        <p className="editorial-section-intro">
          stokr replaces a workflow that was never supposed to take this long.
        </p>
        <div className="grid border border-[#222120] lg:grid-cols-2">
          <ResearchList title="Without stokr" meta="The old way" items={before} />
          <ResearchList title="With stokr" meta="The new way" items={after} positive />
        </div>
      </EditorialSection>

      <CityStrip />

      <EditorialSection number="IV." tag="Plans / Research Desk" page="005 / 006" title={<>Start free.<br /><em>Go deeper.</em></>}>
        <p className="editorial-section-intro">
          Start with limited weekly research, then upgrade when you need the full
          filing-backed desk.
        </p>
        <div className="grid border border-[#222120] lg:grid-cols-2">
          <PricingColumn
            plan="Free / Starter Research"
            price="$0"
            cta="Start researching"
            href="/login"
            features={[
              "3 source-backed reports per week",
              "Company snapshot and basic summary",
              "Top risk preview",
              "1 Research Tracker",
              "Unlimited stocks inside your Research Tracker",
            ]}
          />
          <PricingColumn
            plan="Premium / Full Research Desk"
            price="$9.99"
            period="/ mo"
            cta="Open full desk"
            href="/pricing"
            featured
            features={[
              "Unlimited AI stock reports",
              "Full 10-K and 10-Q breakdowns",
              "Filing Delta and complete risk analysis",
              "Full Source Trail and saved research history",
              "Unlimited Research Trackers",
              "Priority processing",
            ]}
          />
        </div>
      </EditorialSection>

      <section className="grid border-y border-[#222120] lg:grid-cols-2">
        <div className="border-b border-[#222120] p-6 sm:p-12 lg:border-b-0 lg:border-r">
          <div className="mb-5 font-mono text-[9px] uppercase tracking-[0.16em] text-[#3E3D3A]">
            No. 06 / Start a brief
          </div>
          <h2 className="mb-5 font-serif text-5xl font-black italic leading-[0.9] tracking-[-0.04em] text-[#F0EDE6] sm:text-6xl">
            Try a brief.
            <br />
            Follow the
            <br />
            evidence.
          </h2>
          <p className="max-w-[380px] text-xs leading-[1.8] text-[#9A9690]">
            Enter a ticker and review what stokr can surface from filing context,
            financial metrics, and source trails. Starter usage is limited.
          </p>
        </div>
        <div className="flex flex-col justify-center gap-4 bg-[#111111] p-6 sm:p-12">
          <StockSearchBar />
          <p className="font-mono text-[9px] uppercase leading-[1.8] tracking-[0.08em] text-[#3E3D3A]">
            Common starting points: NVDA / AAPL / MSFT / TSLA / AMZN / META
            <br />
            <br />
            stokr provides informational research tools only.
            <br />
            Not financial advice.
          </p>
        </div>
      </section>
    </main>
  )
}

function TickerStrip() {
  const doubled = [...tickerItems, ...tickerItems]

  return (
    <div className="editorial-ticker-bar">
      <div className="editorial-ticker-track">
        {doubled.map(([sym, px, move], index) => (
          <div key={`${sym}-${index}`} className="editorial-ticker-item">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-[#F0EDE6]">{sym}</span>
            <span className="font-mono text-[10px] text-[#9A9690]">{px}</span>
            <span className={`font-mono text-[10px] ${move.startsWith("+") ? "text-[#5C9E6A]" : "text-[#B85A50]"}`}>
              {move}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function BriefPreview() {
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-serif text-[40px] font-black italic leading-none tracking-[-0.03em] text-[#F0EDE6]">
            NVDA
          </div>
          <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.08em] text-[#3E3D3A]">
            NVIDIA Corporation / Latest 10-Q
          </div>
        </div>
        <div className="text-right font-mono text-[9px] uppercase leading-[1.8] tracking-[0.08em] text-[#3E3D3A]">
          AI-assisted
          <br />
          Source-backed
          <br />
          <span className="mt-1 inline-block border border-[#3E3D3A] px-2 py-0.5 text-[#F0EDE6]">
            Confidence / High
          </span>
        </div>
      </div>

      <div className="grid border border-[#222120] sm:grid-cols-4">
        {[
          ["Filing", "10-Q", ""],
          ["Signals", "7", "text-[#5C9E6A]"],
          ["Freshness", "Updated", "text-[#5C9E6A]"],
          ["Confidence", "High", ""],
        ].map(([label, value, tone]) => (
          <div key={label} className="border-b border-r border-[#222120] p-3 last:border-r-0 sm:border-b-0">
            <div className="mb-1 font-mono text-[8px] uppercase tracking-[0.12em] text-[#3E3D3A]">
              {label}
            </div>
            <div className={`font-mono text-[13px] font-medium tracking-[0.04em] text-[#F0EDE6] ${tone}`}>
              {value}
            </div>
          </div>
        ))}
      </div>

      <p className="border-l border-[#3E3D3A] pl-4 text-[11px] leading-[1.75] text-[#9A9690]">
        Supply concentration and demand cyclicality remain key filing themes.
        Management commentary is framed with filing context and beginner-friendly
        caveats.
      </p>
    </>
  )
}

function SourceTrailPreview() {
  return (
    <div className="border border-[#222120]">
      <div className="flex justify-between border-b border-[#222120] bg-[#161616] px-4 py-2 font-mono text-[8px] uppercase tracking-[0.12em] text-[#3E3D3A]">
        <span>Source Trail / Margin Pressure</span>
        <span className="text-[#9A9690]">Confidence / High</span>
      </div>
      <div className="grid md:grid-cols-[1fr_1fr_1fr_72px]">
        {[
          ["Insight", "Margin pressure increased in the filing period."],
          ["Evidence", "Cost of revenue grew faster than revenue."],
          ["Source", "10-Q / Mgmt Discussion / Cost of Revenue"],
          ["Conf.", "High"],
        ].map(([label, value], index) => (
          <div key={label} className={`border-b border-r border-[#222120] p-3 last:border-r-0 md:border-b-0 ${index === 3 ? "bg-[#161616]" : ""}`}>
            <div className="mb-1 font-mono text-[8px] uppercase tracking-[0.10em] text-[#3E3D3A]">{label}</div>
            <div className="text-[11px] leading-[1.5] text-[#9A9690]">{value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EditorialSection({
  number,
  tag,
  page,
  title,
  children,
}: {
  number: string
  tag: string
  page: string
  title: ReactNode
  children: ReactNode
}) {
  return (
    <section className="editorial-section">
      <div className="editorial-section-rule">
        <span className="editorial-section-number">{number}</span>
        <span className="editorial-section-tag">{tag}</span>
        <div className="editorial-section-line" />
        <span className="editorial-section-page">{page}</span>
      </div>
      <h2 className="editorial-section-title">{title}</h2>
      {children}
    </section>
  )
}

function ResearchList({
  title,
  meta,
  items,
  positive = false,
}: {
  title: string
  meta: string
  items: string[]
  positive?: boolean
}) {
  return (
    <div className="border-b border-[#222120] p-6 lg:border-b-0 lg:border-r lg:last:border-r-0">
      <div className="mb-6 flex justify-between border-b border-[#222120] pb-3 font-mono text-[9px] uppercase tracking-[0.14em] text-[#3E3D3A]">
        <span>{title}</span>
        <span>{meta}</span>
      </div>
      <ul className="grid gap-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-xs leading-[1.5] text-[#9A9690]">
            <span className={`mt-px w-4 shrink-0 font-mono text-[10px] ${positive ? "text-[#F0EDE6]" : "text-[#3E3D3A]"}`}>
              {positive ? "✓" : "—"}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function CityStrip() {
  const cities = [
    "New York / SEC filings",
    "London / risk review",
    "Tokyo / source trails",
    "Singapore / research desk",
    "San Francisco / AI context",
    "Toronto / filing delta",
    "Amsterdam / report history",
    "Sydney / watchlists",
  ]
  const doubled = [...cities, ...cities]

  return (
    <div className="editorial-ticker-bar border-t">
      <div className="editorial-ticker-track">
        {doubled.map((city, index) => (
          <div key={`${city}-${index}`} className="editorial-ticker-item font-mono text-[9px] uppercase tracking-[0.10em] text-[#3E3D3A]">
            {city}
          </div>
        ))}
      </div>
    </div>
  )
}

function PricingColumn({
  plan,
  price,
  period = "/ mo",
  cta,
  href,
  features,
  featured = false,
}: {
  plan: string
  price: string
  period?: string
  cta: string
  href: string
  features: string[]
  featured?: boolean
}) {
  return (
    <div className={`flex flex-col border-b border-r border-[#222120] p-7 last:border-r-0 lg:border-b-0 ${featured ? "bg-[#111111]" : ""}`}>
      <div className="mb-5 border-b border-[#222120] pb-4 font-mono text-[9px] uppercase tracking-[0.14em] text-[#3E3D3A]">
        {plan}
      </div>
      <div className="mb-7 flex items-baseline gap-2">
        <span className="editorial-price">{price}</span>
        <span className="font-mono text-[11px] tracking-[0.06em] text-[#3E3D3A]">{period}</span>
      </div>
      <ul className="mb-7 grid flex-1 gap-2.5">
        {features.map((feature) => (
          <li key={feature} className="flex gap-2.5 text-[11px] leading-[1.5] text-[#9A9690] before:content-['—'] before:text-[#3E3D3A]">
            {feature}
          </li>
        ))}
      </ul>
      <Link href={href} className={featured ? "stokr-button-primary w-full" : "stokr-button-secondary w-full"}>
        {cta}
      </Link>
    </div>
  )
}
