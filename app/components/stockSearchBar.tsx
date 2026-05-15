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
    wide = false,
    onNavigate,
}: {
    variant?: "hero" | "nav"
    wide?: boolean
    onNavigate?: () => void
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
        onNavigate?.()
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
            ? wide
                ? "relative w-full"
                : "relative w-full max-w-[260px]"
            : "relative w-full max-w-xl"

    const formClass =
        variant === "nav"
            ? "border border-[#2E2D2A] bg-[#0C0C0C] px-3 py-2"
            : "border border-[#2E2D2A] bg-[#111111]"

    const inputClass =
        variant === "nav"
            ? "w-full bg-transparent font-mono text-sm uppercase tracking-[0.08em] text-[#F0EDE6] outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-[#6B6761]"
            : "w-full bg-transparent px-5 py-3.5 font-mono text-xl font-medium uppercase tracking-[0.12em] text-[#F0EDE6] outline-none placeholder:tracking-[0.12em] placeholder:text-[#3E3D3A]"

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
                        className={variant === "nav" ? "text-[#9A9690] transition hover:text-[#F0EDE6]" : "self-stretch bg-[#F0EDE6] px-5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[#0C0C0C] transition hover:opacity-85"}
                    >
                        {variant === "nav" ? <SearchIcon size={iconSize} /> : "Analyze"}
                    </button>
                </div>
            </form>

            {isOpen && (
                <div className="search-dropdown-scroll absolute left-0 right-0 z-50 mt-3 max-h-[228px] overflow-y-auto overflow-x-hidden border border-[#2E2D2A] bg-[#0C0C0C]">
                    {isLoading && (
                        <div className="px-5 py-4 text-sm text-[#9A9690]">
                            Searching...
                        </div>
                    )}

                    {!isLoading && results.length === 0 && (
                        <div className="px-5 py-4 text-sm text-[#9A9690]">
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
                                    className={`flex w-full items-center justify-between gap-4 px-5 py-3 text-left transition ${isActive ? "bg-[#D63C2F]/12" : "hover:bg-[#161616]"
                                        }`}
                                >
                                    <div>
                                        <p className="font-mono font-semibold text-[#F0EDE6]">{stock.ticker}</p>
                                        <p className="max-w-[260px] truncate text-sm text-[#9A9690] sm:max-w-[360px]">
                                            {stock.name}
                                        </p>
                                    </div>

                                    <span className="border border-[#2E2D2A] bg-[#111111] px-3 py-1 font-mono text-xs uppercase tracking-[0.14em] text-[#9A9690]">
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

