'use client'
import React from "react"
import NavBar from "./components/navBar"
import TopStocksTable from "./components/topStocksTable"
import { useState } from "react"
import { useRouter } from "next/navigation"
import StockSearchBar from "./components/stockSearchBar"

function SearchIcon({ size = 28, strokeWidth = 1.8 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <path
        d="M16.2 16.2L21 21"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  )
}

const tableRows = Array.from({ length: 7 })

export default function Home() {
  const router = useRouter()
  const [ticker, setTicker] = useState("")

  function handleSearch(event: React.FormEvent) {
    event.preventDefault()

    const cleanedTicker = ticker.trim().toLowerCase()

    if (!cleanedTicker) return

    router.push(`/stocks/${cleanedTicker}-stock-analysis`)
  }
  return (
    <main className="min-h-screen overflow-hidden bg-[#0F172A] text-white">
      <section className="relative min-h-screen px-6 py-5 md:px-10 lg:px-20">

        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_18%,rgba(255,138,101,0.34),transparent_38%),radial-gradient(circle_at_82%_70%,rgba(124,157,255,0.34),transparent_48%),radial-gradient(circle_at_32%_48%,rgba(124,157,255,0.12),transparent_45%)]" />
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10 mx-auto max-w-7xl">

          {/* Navbar */}
          <NavBar />


          {/* Hero */}
          <div className="grid min-h-[calc(100vh-88px)] grid-cols-1 items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">

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

            {/* Right (Table) */}
            <div className="flex justify-center lg:justify-end">
              <TopStocksTable />
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}