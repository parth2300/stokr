import Link from "next/link"
import type { Metadata } from "next"
import NavBar from "../components/navBar"
import StockSearchBar from "../components/stockSearchBar"

export const metadata: Metadata = {
  title: "About stokr | Transparent Filing-Backed Stock Research",
  description:
    "Learn how stokr turns SEC filings, financial metrics, risk disclosures, and company data into source-backed research briefs for normal investors.",
  alternates: {
    canonical: "https://stokr.live/about",
  },
}

const processSteps = [
  {
    title: "Search a company",
    body: "Start with a ticker and open a focused company research brief.",
  },
  {
    title: "Review the filing-backed brief",
    body: "See company context organized around filings, metrics, and disclosures.",
  },
  {
    title: "Inspect risks and financial signals",
    body: "Compare risk themes, margins, liquidity, debt, and cash flow context.",
  },
  {
    title: "Trace insights through Source Trail",
    body: "Connect each major takeaway back to filing or company source context.",
  },
  {
    title: "Save to Research Tracker",
    body: "Keep companies you want to revisit as reports and filings change.",
  },
]

const differentiators = [
  {
    title: "Source Trail",
    body: "Trace major takeaways back to filings, metrics, or company disclosures, so users can see where the research context came from.",
  },
  {
    title: "Filing Delta",
    body: "See meaningful wording, risk, financial, or operating changes across company filings when enough filing data is available.",
  },
  {
    title: "Plain-English Context",
    body: "Turn dense filing language into readable research cards without stripping away the important caveats.",
  },
  {
    title: "Balanced Thesis Framing",
    body: "Inspect the Upside Thesis and Downside Thesis side by side without treating either as a prediction.",
  },
]

const notItems = [
  "Not a stock picker",
  "Not financial advice",
  "Not a guarantee of performance",
  "Not a replacement for personal due diligence",
  "Not designed to tell users what to buy or sell",
]

const audiences = [
  "Newer investors who want clearer research",
  "Intermediate investors who want faster filing context",
  "Watchlist users who want to follow companies over time",
  "Anyone who wants less market noise and more company-specific context",
]

export default function AboutPage() {
  return (
    <main className="stokr-page">
      <section className="stokr-shell">
        <div className="stokr-bg stokr-grid-bg" />

        <div className="stokr-container">
          <NavBar showSearch />

          <section className="grid gap-8 py-8 sm:py-10 lg:grid-cols-[1fr_0.82fr] lg:items-center lg:py-12">
            <div className="min-w-0">
              <p className="stokr-kicker">About stokr</p>

              <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-[#F8FAFC] sm:text-5xl lg:text-6xl">
                Stock research should show its work.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-[#CBD5E1] sm:text-lg">
                stokr is built to turn SEC filings, financial metrics, risk
                disclosures, and company data into clear research briefs that
                help users understand what a company actually disclosed.
              </p>

              <p className="mt-5 max-w-2xl rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm leading-6 text-[#A3AAB8]">
                stokr provides informational research tools only and does not
                provide financial advice.
              </p>

              <div className="mt-7 max-w-xl">
                <StockSearchBar />
              </div>
            </div>

            <SourcePreview />
          </section>

          <section className="py-8 sm:py-10">
            <div className="stokr-card overflow-hidden p-5 sm:p-7">
              <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
                <div className="min-w-0">
                  <p className="stokr-kicker">Why stokr exists</p>
                  <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    Most investors are not short on information. They are buried in it.
                  </h2>
                </div>

                <div className="rounded-lg border border-white/[0.08] bg-[#0D1017] p-5">
                  <p className="text-base leading-8 text-[#CBD5E1]">
                    Filings, metrics, charts, headlines, opinions, and analyst
                    commentary are scattered across different places. stokr
                    organizes company research into a clearer starting point:
                    filing-backed, source-aware, and easier to inspect.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-8 sm:py-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="stokr-kicker">How stokr works</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  A filing-first research flow.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-[#A3AAB8]">
                Each step is built to move from company data to source-backed
                context without turning research into a stock call.
              </p>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {processSteps.map((item, index) => (
                <div key={item.title} className="stokr-card group p-5 transition hover:border-white/[0.14] hover:bg-[#111722]">
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#19C37D]">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 text-base font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#A3AAB8]">{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="py-8 sm:py-10">
            <div className="mb-6 max-w-2xl">
              <p className="stokr-kicker">What makes stokr different</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Built around evidence, not vibes.
              </h2>
            </div>
            <div className="grid gap-5 lg:grid-cols-4">
              {differentiators.map((item) => (
                <article key={item.title} className="stokr-card p-5 transition hover:border-white/[0.14] hover:bg-[#111722]">
                  <h3 className="text-base font-semibold text-[#F5F5F0]">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#CBD5E1]">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="py-8 sm:py-10">
            <div className="grid gap-6 rounded-xl border border-[#C8A96A]/25 bg-[#C8A96A]/10 p-5 sm:p-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <p className="stokr-kicker text-[#D8BE82]">What stokr is not</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                  Built for research clarity, not financial promises.
                </h2>
                <p className="mt-4 text-sm leading-7 text-[#CBD5E1]">
                  stokr does not tell users what to buy or sell. It is designed to
                  help users inspect company-specific information with less noise.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {notItems.map((item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-white/[0.08] bg-[#05070A]/70 px-4 py-3 text-sm text-[#CBD5E1]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-8 sm:py-10">
            <div className="max-w-2xl">
              <p className="stokr-kicker">Who it is for</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                For users who want company-specific context.
              </h2>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {audiences.map((item) => (
                <div key={item} className="stokr-card-muted p-5 transition hover:border-white/[0.14] hover:bg-[#111722]">
                  <p className="text-sm leading-7 text-[#CBD5E1]">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="pb-12 pt-8 sm:pt-10">
            <div className="stokr-card overflow-hidden p-5 sm:p-8">
              <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
                <div>
                  <p className="stokr-kicker">Start researching</p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    Start with a company. Follow the evidence.
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-[#A3AAB8]">
                    Search a ticker, review the source-backed brief, and decide
                    what deserves a closer look.
                  </p>
                </div>

                <div className="min-w-0">
                  <StockSearchBar />
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Link href="/" className="stokr-button-primary">
                      Search ticker
                    </Link>
                    <Link href="/pricing" className="stokr-button-secondary">
                      View pricing
                    </Link>
                    <Link href="/stocks/nvda-stock-analysis" className="stokr-button-secondary">
                      View sample report
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}

function SourcePreview() {
  return (
    <aside className="stokr-card min-w-0 p-4 sm:p-5">
      <div className="rounded-lg border border-[#D8D1C3] bg-[#F4F1EA] p-4 text-[#172033]">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#64748B]">
          Research receipt
        </p>
        <p className="mt-1 text-xs text-[#64748B]">AI-assisted context · Confidence: High</p>

        <div className="mt-4 divide-y divide-[#D8D1C3] border-y border-[#D8D1C3]">
          <PreviewBlock label="Insight" value="Margin pressure increased." />
          <PreviewBlock
            label="Evidence"
            value="Cost of revenue grew faster than revenue in the latest filing period."
          />
          <PreviewBlock
            label="Source"
            value="10-Q -> Management Discussion -> Cost of Revenue"
          />
          <PreviewBlock label="Confidence" value="High, source-backed context" />
        </div>
      </div>
    </aside>
  )
}

function PreviewBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2 py-3 sm:grid-cols-[6rem_1fr] sm:gap-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#64748B]">
        {label}
      </p>
      <p className="mt-1 break-words text-sm leading-6">{value}</p>
    </div>
  )
}
