"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { trackSearchStock } from "../lib/analytics"

type StockSearchResult = {
    ticker: string
    name: string
    cik: string
}

function SearchIcon({ size = 28, strokeWidth = 1.8 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
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

const clientSearchCache = new Map<string, StockSearchResult[]>()

export default function StockSearchBar({
    variant = "hero",
}: {
    variant?: "hero" | "nav"
}) {
    const router = useRouter()

    const [query, setQuery] = useState("")
    const [results, setResults] = useState<StockSearchResult[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [activeIndex, setActiveIndex] = useState(-1)

    const wrapperRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const cleanedQuery = query.trim().toLowerCase()

        if (cleanedQuery.length < 2) {
            queueMicrotask(() => {
                setResults([])
                setIsOpen(false)
                setActiveIndex(-1)
            })

            return
        }

        if (clientSearchCache.has(cleanedQuery)) {
            const cachedResults = clientSearchCache.get(cleanedQuery) || []

            const timeoutId = window.setTimeout(() => {
                setResults(cachedResults)
                setIsOpen(true)
            }, 0)

            return () => {
                window.clearTimeout(timeoutId)
            }
        }

        const timeoutId = window.setTimeout(async () => {
            try {
                setIsLoading(true)

                const res = await fetch(`/api/search-stocks?q=${encodeURIComponent(cleanedQuery)}`)
                const data = await res.json()

                if (!res.ok) {
                    setResults([])
                    setIsOpen(false)
                    return
                }

                const nextResults = data.results || []

                clientSearchCache.set(cleanedQuery, nextResults)

                setResults(nextResults)
                setIsOpen(true)
                setActiveIndex(-1)
            } catch {
                setResults([])
                setIsOpen(false)
            } finally {
                setIsLoading(false)
            }
        }, 300)

        return () => window.clearTimeout(timeoutId)
    }, [query])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    function goToStock(ticker: string) {
        const cleanedTicker = ticker.trim().toLowerCase()

        if (!cleanedTicker) return

        trackSearchStock(cleanedTicker.toUpperCase())
        router.push(`/stocks/${cleanedTicker}-stock-analysis`)
    }

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault()

        if (activeIndex >= 0 && results[activeIndex]) {
            goToStock(results[activeIndex].ticker)
            return
        }

        if (results.length > 0) {
            goToStock(results[0].ticker)
            return
        }

        if (query.trim()) {
            goToStock(query)
        }
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (!isOpen || results.length === 0) return

        if (event.key === "ArrowDown") {
            event.preventDefault()
            setActiveIndex((current) =>
                current < results.length - 1 ? current + 1 : 0
            )
        }

        if (event.key === "ArrowUp") {
            event.preventDefault()
            setActiveIndex((current) =>
                current > 0 ? current - 1 : results.length - 1
            )
        }

        if (event.key === "Enter" && activeIndex >= 0) {
            event.preventDefault()
            goToStock(results[activeIndex].ticker)
        }

        if (event.key === "Escape") {
            setIsOpen(false)
        }
    }

    const wrapperClass =
        variant === "nav"
            ? "relative w-full max-w-[260px]"
            : "relative w-full max-w-xl"

    const formClass =
        variant === "nav"
            ? "rounded-md border border-white/[0.08] bg-[#0B0F16] px-3 py-2"
            : "rounded-lg border border-white/[0.12] bg-[#F4F1EA] px-4 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.22)] sm:px-5"

    const inputClass =
        variant === "nav"
            ? "w-full bg-transparent text-sm uppercase text-[#F4F6FA] outline-none placeholder:normal-case placeholder:text-[#6F7685]"
            : "w-full bg-transparent font-mono text-base uppercase text-[#0F172A] outline-none placeholder:normal-case placeholder:font-sans placeholder:text-[#64748B]"

    const iconSize = variant === "nav" ? 20 : 28

    return (
        <div ref={wrapperRef} className={wrapperClass}>
            <form onSubmit={handleSubmit} className={formClass}>
                <div className="flex items-center justify-between gap-4">
                    <input
                        placeholder={variant === "nav" ? "Search ticker" : "Search AAPL, NVDA, TSLA..."}
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        onKeyDown={handleKeyDown}
                        className={inputClass} />

                    <button
                        type="submit"
                        aria-label="Search ticker"
                        className={`transition ${variant === "nav" ? "text-[#A3AAB8] hover:text-white" : "text-[#334155] hover:text-[#0F172A]"}`}
                    >
                        <SearchIcon size={iconSize} />
                    </button>
                </div>
            </form>

            {isOpen && (
                <div className="search-dropdown-scroll absolute left-0 right-0 z-50 mt-3 max-h-[228px] overflow-y-auto overflow-x-hidden
                 rounded-lg border border-white/[0.10] bg-[#0B0F16] shadow-xl">
                    {isLoading && (
                        <div className="px-5 py-4 text-sm text-slate-400">
                            Searching...
                        </div>
                    )}

                    {!isLoading && results.length === 0 && (
                        <div className="px-5 py-4 text-sm text-slate-400">
                            No matching stocks found.
                        </div>
                    )}

                    {!isLoading &&
                        results.map((stock, index) => {
                            const isActive = activeIndex === index

                            return (
                                <button
                                    key={`${stock.ticker}-${stock.cik}`}
                                    type="button"
                                    onClick={() => goToStock(stock.ticker)}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    className={`flex w-full items-center justify-between gap-4 px-5 py-3 text-left transition ${isActive ? "bg-[#19C37D]/12" : "hover:bg-white/10"
                                        }`}
                                >
                                    <div>
                                        <p className="font-semibold text-white">{stock.ticker}</p>
                                        <p className="max-w-[260px] truncate text-sm text-[#A3AAB8] sm:max-w-[360px]">
                                            {stock.name}
                                        </p>
                                    </div>

                                    <span className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                                        View
                                    </span>
                                </button>
                            )
                        })}
                </div>
            )}
        </div>
    )
}

