import Link from "next/link"
import NavBar from "./components/navBar"
import TopStocksTable from "./components/topStocksTable"
import StockSearchBar from "./components/stockSearchBar"

export default function Home() {
  return (
    <main className="stokr-page">
      <section className="stokr-shell">
        <div className="stokr-bg" />

        <div className="stokr-container max-w-6xl">
          <NavBar />

          <div className="grid min-h-[calc(100vh-96px)] grid-cols-1 items-center gap-10 py-14 sm:py-18 lg:grid-cols-[1fr_0.82fr]">
            <div className="flex flex-col justify-center">
              <p className="stokr-kicker">AI stock research</p>

              <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-[#F4F6FA] sm:text-5xl lg:text-6xl">
                Stock research without the noise.
              </h1>

              <StockSearchBar />

              <p className="mt-7 max-w-2xl text-base leading-7 text-[#A3AAB8] sm:text-lg">
                stokr turns filings, financials, risks, charts, and bull/bear
                cases into clear research summaries for faster company
                analysis.
              </p>

              <div className="mt-8 grid max-w-2xl gap-2 sm:grid-cols-3">
                {["SEC context", "Risk factors", "Cached reports"].map((item) => (
                  <div key={item} className="stokr-card-muted px-4 py-3 text-sm text-[#A3AAB8]">
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex max-w-2xl flex-wrap items-center gap-3 text-sm text-[#A3AAB8]">
                <Link href="/blog" className="font-medium text-[#9AA6FF] hover:text-white">
                  Read the blog
                </Link>
                <span className="text-[#4B5565]">/</span>
                <Link href="/stocks/nvda" className="hover:text-white">
                  NVDA research
                </Link>
                <Link href="/stocks/aapl" className="hover:text-white">
                  AAPL research
                </Link>
                <Link href="/stocks/tsla" className="hover:text-white">
                  TSLA research
                </Link>
                <span className="text-[#4B5565]">/</span>
                <Link href="/pricing" className="hover:text-white">
                  Pricing
                </Link>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <TopStocksTable />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
