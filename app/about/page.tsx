import NavBar from "../components/navBar"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About stokr | AI Stock Research",
  description:
    "Learn how stokr helps investors research public companies faster with AI-powered SEC filing analysis, financial metrics, risk factors, and transparent summaries.",
  alternates: {
    canonical: "https://stokr.live/about",
  },
}

export default function AboutPage() {
  return (
    <main className="stokr-page">
      <section className="stokr-shell">
        <div className="stokr-bg" />

        <div className="stokr-container">
          <NavBar showSearch />

          <div className="grid min-h-[calc(100vh-96px)] grid-cols-1 items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_0.9fr]">
            <section>
              <p className="stokr-kicker">
                About Stokr
              </p>

              <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Making complex company filings easier to understand.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-[#A3AAB8]">
                Stokr turns dense financial filings, company data, and market information into clear,
                organized insights so users can understand what matters faster.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="stokr-card p-5">
                  <p className="text-2xl font-semibold text-white">01</p>
                  <p className="mt-2 text-sm text-[#A3AAB8]">Search a public company</p>
                </div>

                <div className="stokr-card p-5">
                  <p className="text-2xl font-semibold text-white">02</p>
                  <p className="mt-2 text-sm text-[#A3AAB8]">Analyze filings and data</p>
                </div>

                <div className="stokr-card p-5">
                  <p className="text-2xl font-semibold text-white">03</p>
                  <p className="mt-2 text-sm text-[#A3AAB8]">Get clear insights instantly</p>
                </div>
              </div>
            </section>

            <section className="stokr-card p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-[#F4F6FA]">
                Why Stokr exists
              </h2>

              <p className="mt-4 leading-7 text-[#A3AAB8]">
                Company filings are valuable, but they are often long, technical, and difficult to compare.
                Stokr is built to reduce that friction by highlighting summaries, risks, financial signals,
                and changes that would otherwise take time to find manually.
              </p>

              <div className="mt-8 space-y-5">
                <div>
                  <h3 className="font-semibold text-white">Plain-English analysis</h3>
                  <p className="mt-1 text-sm leading-6 text-[#A3AAB8]">
                    Complex financial language is simplified into readable insights.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-white">Filing-focused intelligence</h3>
                  <p className="mt-1 text-sm leading-6 text-[#A3AAB8]">
                    Stokr focuses on what companies report directly through SEC filings.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-white">Built for faster research</h3>
                  <p className="mt-1 text-sm leading-6 text-[#A3AAB8]">
                    The goal is not to replace research, but to make the first layer of analysis faster.
                  </p>
                </div>
              </div>

              <div className="stokr-card-muted mt-8 p-5">
                <p className="text-sm leading-relaxed text-[#A3AAB8]">
                  <span className="font-semibold text-white">Disclaimer:</span> Stokr provides informational
                  analysis only. It does not provide financial, investment, or trading advice.
                </p>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  )
}
