'use client'

import NavBar from "./components/navBar"
import TopStocksTable from "./components/topStocksTable"
import StockSearchBar from "./components/stockSearchBar"

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0F172A] text-white">
      <section className="relative min-h-screen px-6 py-5 md:px-10 lg:px-20">
        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_18%,rgba(255,138,101,0.34),transparent_38%),radial-gradient(circle_at_82%_70%,rgba(124,157,255,0.34),transparent_48%),radial-gradient(circle_at_32%_48%,rgba(124,157,255,0.12),transparent_45%)]" />
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10 mx-auto w-full max-w-6xl">
          {/* Navbar */}
          <NavBar />

          {/* Hero */}
          <div className="grid min-h-[calc(100vh-88px)] grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
            {/* Left */}
            <div className="flex flex-col justify-center">
              <h1 className="max-w-2xl text-5xl font-extrabold leading-tight">
                Elite stock insights that can change your financial future.
              </h1>

              {/* Search */}
              <StockSearchBar />

              <p className="mt-20 max-w-3xl text-lg text-slate-300">
                Get instant access to high-level, data-driven insights on any stock you search.
              </p>
            </div>

            {/* Right Table */}
            <div className="flex justify-center lg:justify-center">
              <TopStocksTable />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}