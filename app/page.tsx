import Link from "next/link"
import NavBar from "./components/navBar"
import StockSearchBar from "./components/stockSearchBar"
import TopStocksTable from "./components/topStocksTable"

const researchBuildSteps = [
  {
    label: "Latest filing detected",
    detail: "10-Q attached to the brief",
  },
  {
    label: "Risk language scanned",
    detail: "Disclosure themes organized",
  },
  {
    label: "Financial signals organized",
    detail: "Margins, liquidity, debt, cash flow",
  },
  {
    label: "Source Trail attached",
    detail: "Evidence mapped to filing context",
  },
  {
    label: "Research brief ready",
    detail: "Source-backed summary assembled",
  },
]

const features = [
  {
    name: "Research Brief",
    detail:
      "A clear company overview that separates filing-backed facts from market noise.",
  },
  {
    name: "Filing Delta",
    detail:
      "See new risk language, liquidity changes, debt updates, and management commentary shifts.",
  },
  {
    name: "Disclosed Risk Signals",
    detail:
      "Review the risks the company actually disclosed, grouped into readable research context.",
  },
  {
    name: "Company Strength Snapshot",
    detail:
      "Track revenue, margins, liquidity, debt, and operating signals in one compact view.",
  },
  {
    name: "Upside Thesis",
    detail:
      "Understand the strongest research case without turning it into a stock recommendation.",
  },
  {
    name: "Downside Thesis",
    detail:
      "Keep the concerns, pressures, and disclosed risks visible before forming an opinion.",
  },
  {
    name: "Source Trail",
    detail:
      "Trace major takeaways back to filings, sections, evidence, and source context.",
  },
]

const beforeItems = [
  "Open filings manually",
  "Search financial statements",
  "Read scattered opinions",
  "Compare risks by hand",
  "Still wonder what matters",
]

const afterItems = [
  "Search ticker",
  "Review source-backed brief",
  "See filing changes",
  "Understand risks",
  "Compare upside/downside",
  "Save to Research Tracker",
]

const filingDeltaItems = [
  "New risk language",
  "Removed risk language",
  "Intensified wording",
  "Segment changes",
  "Liquidity changes",
  "Debt changes",
  "Management commentary changes",
]

export default function Home() {
  return (
    <main className="stokr-page">
      <section className="stokr-shell">
        <div className="stokr-bg stokr-grid-bg" />

        <div className="stokr-container">
          <NavBar />

          <section className="grid grid-cols-1 items-center gap-8 py-8 sm:py-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10 lg:py-12">
            <div className="min-w-0">
              <p className="stokr-kicker">Filing-backed research system</p>

              <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-[#F8FAFC] sm:text-5xl lg:text-6xl">
                Stock research that shows its work.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-[#CBD5E1] sm:text-lg">
                stokr turns SEC filings, financial metrics, risk disclosures,
                and company data into clear source-backed research briefs, so
                users can understand a stock without getting buried in
                documents.
              </p>

              <div className="mt-7">
                <StockSearchBar />
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Link href="/stocks/nvda-stock-analysis" className="stokr-button-secondary">
                  View full sample Premium report
                </Link>
                <Link href="/pricing" className="stokr-button-primary">
                  See research plans
                </Link>
              </div>

              <p className="mt-7 max-w-xl border-l border-white/[0.10] pl-4 text-sm leading-6 text-[#A7ADBA]">
                Built around filings, risk context, financial signals, and
                source trails.
              </p>
            </div>

            <div className="grid min-w-0 gap-4">
              <ReportPreviewCard />
              <SourceTrailCard compact />
            </div>
          </section>

          <section className="py-8 sm:py-10">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="stokr-kicker">Research build</p>
                <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  From ticker search to a source-backed brief.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[#A3AAB8] sm:text-base">
                  stokr assembles filing context, disclosed risks, financial
                  signals, and Source Trail references into a research brief
                  that is easier to inspect.
                </p>
              </div>

              <ResearchBuildCard />
            </div>
          </section>

          <section className="py-8 sm:py-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="stokr-kicker">What stokr shows you</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Research objects, not generic AI widgets.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-[#A3AAB8]">
                Every section is built around a specific research job:
                understand the company, inspect the risks, compare the thesis,
                and trace the evidence.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <article key={feature.name} className="stokr-card p-5 transition hover:border-white/[0.14] hover:bg-[#111722]">
                  <h3 className="text-base font-semibold text-[#F5F5F0]">{feature.name}</h3>
                  <p className="mt-4 text-sm leading-6 text-[#CBD5E1]">{feature.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-6 py-8 sm:py-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="stokr-kicker">Source Trail</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Insight, evidence, source, confidence.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#A3AAB8]">
                stokr should make every major takeaway inspectable. The Source
                Trail pattern turns a summary into a transparent research card.
              </p>
            </div>

            <SourceTrailCard />
          </section>

          <section className="grid gap-5 py-8 sm:py-10 lg:grid-cols-2">
            <ResearchList title="Before stokr" items={beforeItems} muted />
            <ResearchList title="After stokr" items={afterItems} />
          </section>

          <section className="grid gap-8 py-8 sm:py-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            <div className="stokr-card p-5 sm:p-6">
              <p className="stokr-kicker">Filing Delta</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                Know what changed before you form an opinion.
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#A3AAB8]">
                stokr highlights wording, risk, and operating changes that are
                easy to miss across long company filings.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {filingDeltaItems.map((item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-white/[0.08] bg-[#0D1017] px-4 py-3 text-sm text-[#CBD5E1]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="min-w-0">
              <TopStocksTable />
            </div>
          </section>

          <section className="py-8 sm:py-10">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <ReportPreviewCard large />

              <div>
                <p className="stokr-kicker">Research plans</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Start with a brief. Upgrade for the full desk.
                </h2>
                <p className="mt-4 text-sm leading-7 text-[#A3AAB8]">
                  Upgrade for deeper research: unlimited reports, full 10-K
                  and 10-Q breakdowns, Filing Delta, saved history, and
                  priority processing.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/pricing" className="stokr-button-primary">
                    View pricing
                  </Link>
                  <Link href="/about" className="stokr-button-secondary">
                    How stokr works
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="pb-14">
            <div className="stokr-card-muted p-5 text-sm leading-6 text-[#A3AAB8]">
              <span className="font-semibold text-white">Disclaimer:</span>{" "}
              stokr provides informational research tools only and does not
              provide financial advice.
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}

function ReportPreviewCard({ large = false }: { large?: boolean }) {
  return (
    <aside className={`stokr-card min-w-0 overflow-hidden p-4 sm:p-5 ${large ? "" : "lg:ml-auto"}`}>
      <div className="min-w-0 rounded-lg border border-white/[0.10] bg-[#151B23] p-4 text-[#F8FAFC]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">
              Source-backed brief
            </p>
            <h2 className="mt-2 break-words text-2xl font-semibold tracking-tight">NVDA Research Brief</h2>
          </div>
        </div>
        <p className="mt-2 font-mono text-xs text-[#94A3B8]">
          Confidence: High &middot; AI-assisted context
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            ["Latest filing", "10-Q"],
            ["Freshness", "Updated"],
            ["Signals", "7 found"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-md border border-white/[0.08] bg-black/20 p-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#94A3B8]">
                {label}
              </p>
              <p className="mt-1 text-sm font-semibold">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          {[
            ["Disclosed Risk Signals", "Supply concentration and demand cyclicality remain key filing themes."],
            ["Upside Thesis", "Growth is supported by demand for accelerated computing and data center products."],
            ["Downside Thesis", "Margin pressure, export limits, or demand shifts could change the outlook."],
          ].map(([label, text]) => (
            <div key={label} className="rounded-md border border-white/[0.08] bg-black/20 p-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#94A3B8]">
                {label}
              </p>
              <p className="mt-1 text-sm leading-6 text-[#CBD5E1]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

function ResearchBuildCard() {
  return (
    <div className="research-build-card stokr-card relative min-w-0 overflow-hidden p-5 sm:p-6">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#19C37D]/55 to-transparent" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="stokr-kicker">NVDA / latest filing</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Research brief build</h3>
        </div>
        <p className="font-mono text-xs text-[#A7ADBA]">source-backed context</p>
      </div>

      <div className="mt-6 grid gap-3">
        {researchBuildSteps.map((step, index) => (
          <div
            key={step.label}
            className="research-build-step relative rounded-lg border border-white/[0.08] bg-[#0D1017] p-4"
            style={{ animationDelay: `${index * 120}ms` }}
          >
            <div className="flex gap-3">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#19C37D]/30 bg-[#19C37D]/8">
                <span className="h-1.5 w-1.5 rounded-full bg-[#19C37D]" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">{step.label}</p>
                <p className="mt-1 text-xs leading-5 text-[#94A3B8]">{step.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SourceTrailCard({ compact = false }: { compact?: boolean }) {
  return (
    <article className={`source-trail-card stokr-card p-5 ${compact ? "sm:p-5" : "sm:p-6"}`}>
      <p className="stokr-kicker">Research receipt</p>

      <div className={`mt-5 divide-y divide-white/[0.07] border-y border-white/[0.07]`}>
        <ResearchReceiptRow
          label="Insight"
          value="Margin pressure increased."
          strong
        />

        <ResearchReceiptRow
          label="Evidence"
          value="Cost of revenue grew faster than revenue in the latest filing period."
        />

        <ResearchReceiptRow
          label="Source"
          value="10-Q -> Management Discussion -> Cost of Revenue"
        />

        <ResearchReceiptRow
          label="Confidence"
          value="High, source-backed context"
        />
      </div>
    </article>
  )
}

function ResearchReceiptRow({
  label,
  value,
  strong = false,
}: {
  label: string
  value: string
  strong?: boolean
}) {
  return (
    <div className="grid gap-2 py-3 sm:grid-cols-[7rem_1fr] sm:gap-4">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#7B8494]">
        {label}
      </p>
      <p className={`break-words text-sm leading-6 ${strong ? "font-semibold text-[#F5F5F0]" : "text-[#CBD5E1]"}`}>
        {value}
      </p>
    </div>
  )
}

function ResearchList({
  title,
  items,
  muted = false,
}: {
  title: string
  items: string[]
  muted?: boolean
}) {
  return (
    <div className={muted ? "stokr-card-muted p-5 sm:p-6" : "stokr-card p-5 sm:p-6"}>
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-[#CBD5E1]">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#19C37D]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
