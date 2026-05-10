"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import NavBar from "../components/navBar"
import { trackGlossarySearch } from "../lib/analytics"
import { glossaryTerms, type GlossaryFormula } from "../lib/glossaryTerms"

const categories = [
  "All",
  "Financial Metrics",
  "SEC Filings",
  "Risk Analysis",
  "Stock Research",
  "Valuation",
]

function FormulaCard({ formula }: { formula: GlossaryFormula }) {
  const denominatorIsOne = formula.denominator === "1"

  return (
    <div className="mt-4 rounded-xl border border-[#7C9DFF]/25 bg-[#7C9DFF]/10 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C7D2FE]">
        Formula
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-200">
        <span className="font-semibold text-white">{formula.label} =</span>
        {denominatorIsOne ? (
          <span className="rounded-lg border border-white/[0.10] bg-[#0F172A] px-4 py-2 font-semibold text-[#DDE2FF]">
            {formula.numerator}
          </span>
        ) : (
          <span className="inline-flex min-w-[220px] flex-col items-center rounded-lg border border-white/[0.10] bg-[#0F172A] px-4 py-3 text-center">
            <span className="w-full pb-2 font-semibold text-[#DDE2FF]">
              {formula.numerator}
            </span>
            <span className="h-px w-full bg-[#7C9DFF]/55" />
            <span className="w-full pt-2 font-semibold text-slate-200">
              {formula.denominator}
            </span>
          </span>
        )}
      </div>
      {formula.note && (
        <p className="mt-3 text-xs leading-5 text-slate-400">{formula.note}</p>
      )}
    </div>
  )
}

export default function GlossaryPage() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")
  const lastTrackedQueryRef = useRef("")

  useEffect(() => {
    const trimmedQuery = query.trim()

    if (trimmedQuery.length < 2 || trimmedQuery === lastTrackedQueryRef.current) return

    const timeout = window.setTimeout(() => {
      lastTrackedQueryRef.current = trimmedQuery
      trackGlossarySearch(trimmedQuery)
    }, 700)

    return () => window.clearTimeout(timeout)
  }, [query])

  const filteredTerms = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return glossaryTerms.filter((item) => {
      const matchesCategory = category === "All" || item.category === category
      const searchable = `${item.term} ${item.category} ${item.definition} ${item.whyItMatters}`.toLowerCase()
      const matchesQuery = !normalizedQuery || searchable.includes(normalizedQuery)

      return matchesCategory && matchesQuery
    })
  }, [category, query])

  return (
    <main className="stokr-page">
      <section className="stokr-shell">
        <div className="stokr-bg" />

        <div className="stokr-container">
          <NavBar showSearch />

          <section className="py-12 sm:py-16">
            <p className="stokr-kicker">Plain-English Research Terms</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Investing Glossary
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-[#A3AAB8] sm:text-lg">
              Plain-English explanations of the terms beginners see when researching stocks.
            </p>
          </section>

          <section className="stokr-card-muted mb-8 p-4 sm:p-5">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
              <label className="block">
                <span className="text-sm font-semibold text-white">Search glossary</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search terms like free cash flow, EPS, 10-K..."
                  className="mt-2 h-11 w-full rounded-lg border border-white/[0.10] bg-[#08090D] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#7C9DFF]/60"
                />
              </label>

              <div>
                <p className="text-sm font-semibold text-white">Category</p>
                <div className="mt-2 flex max-w-full gap-2 overflow-x-auto pb-1">
                  {categories.map((item) => {
                    const isActive = item === category

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setCategory(item)}
                        className={`h-11 shrink-0 rounded-lg border px-4 text-sm font-semibold transition ${
                          isActive
                            ? "border-[#7C9DFF]/60 bg-[#7C9DFF]/15 text-white"
                            : "border-white/[0.10] bg-[#151923] text-slate-300 hover:bg-[#191E29]"
                        }`}
                      >
                        {item}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-5 pb-12 lg:grid-cols-2">
            {filteredTerms.map((item) => (
              <article key={item.term} className="stokr-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7C9DFF]">
                      {item.category}
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-white">{item.term}</h2>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-300">
                  {item.definition}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  <span className="font-semibold text-slate-200">Why it matters: </span>
                  {item.whyItMatters}
                </p>

                {item.formula && <FormulaCard formula={item.formula} />}

                {item.relatedLinks && item.relatedLinks.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.relatedLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="rounded-full border border-white/[0.10] bg-[#151923] px-3 py-1.5 text-xs font-semibold text-[#DDE2FF] hover:bg-[#191E29]"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </section>

          {filteredTerms.length === 0 && (
            <section className="stokr-card mb-12 p-6 text-center">
              <h2 className="text-xl font-bold text-white">No glossary terms found</h2>
              <p className="mt-2 text-sm text-slate-400">
                Try another search term or choose a different category.
              </p>
            </section>
          )}

          <section className="stokr-card-muted mb-12 p-5">
            <p className="text-sm leading-6 text-slate-300">
              stokr provides informational research tools only and does not provide financial advice.
            </p>
          </section>
        </div>
      </section>
    </main>
  )
}
