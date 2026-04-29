import NavBar from "../components/navBar"

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0F172A] text-white">
      <section className="relative min-h-screen px-6 py-5 md:px-10 lg:px-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_18%,rgba(255,138,101,0.32),transparent_38%),radial-gradient(circle_at_82%_70%,rgba(124,157,255,0.34),transparent_48%),radial-gradient(circle_at_32%_48%,rgba(124,157,255,0.12),transparent_45%)]" />
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <NavBar />

          <div className="grid min-h-[calc(100vh-88px)] grid-cols-1 items-center gap-14 py-16 lg:grid-cols-[1fr_0.9fr]">
            <section>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#7C9DFF]">
                About Stokr
              </p>

              <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Making complex company filings easier to understand.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
                Stokr turns dense financial filings, company data, and market information into clear,
                organized insights so users can understand what matters faster.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                  <p className="text-2xl font-bold text-white">01</p>
                  <p className="mt-2 text-sm text-slate-300">Search a public company</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                  <p className="text-2xl font-bold text-white">02</p>
                  <p className="mt-2 text-sm text-slate-300">Analyze filings and data</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                  <p className="text-2xl font-bold text-white">03</p>
                  <p className="mt-2 text-sm text-slate-300">Get clear insights instantly</p>
                </div>
              </div>
            </section>

            <section className="rounded-[32px] border border-[#7C9DFF]/60 bg-white/[0.04] p-8 shadow-[0_0_22px_rgba(124,157,255,0.14)] backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-blue-100">
                Why Stokr exists
              </h2>

              <p className="mt-4 leading-relaxed text-slate-300">
                Company filings are valuable, but they are often long, technical, and difficult to compare.
                Stokr is built to reduce that friction by highlighting summaries, risks, financial signals,
                and changes that would otherwise take time to find manually.
              </p>

              <div className="mt-8 space-y-5">
                <div>
                  <h3 className="font-semibold text-white">Plain-English analysis</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">
                    Complex financial language is simplified into readable insights.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-white">Filing-focused intelligence</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">
                    Stokr focuses on what companies report directly through SEC filings.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-white">Built for faster research</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">
                    The goal is not to replace research, but to make the first layer of analysis faster.
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="text-sm leading-relaxed text-slate-300">
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