"use client"

import { useEffect, useRef, useState } from "react"
import FilingComparisonCard from "./filingComparisonCard"

export default function LazyFilingComparisonSection({ ticker }: { ticker: string }) {
    const sectionRef = useRef<HTMLDivElement | null>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (!sectionRef.current) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            {
                rootMargin: "300px",
            }
        )

        observer.observe(sectionRef.current)

        return () => {
            observer.disconnect()
        }
    }, [])

    return (
        <div ref={sectionRef} className="mt-8">
            {isVisible ? (
                <FilingComparisonCard ticker={ticker} />
            ) : (
                <div className="stokr-card h-72 animate-pulse p-5 sm:p-6">
                    <p className="stokr-kicker">Filing Delta</p>
                    <div className="mt-5 h-5 w-64 max-w-full rounded-full bg-white/10" />
                    <div className="mt-4 h-3 w-full rounded-full bg-white/[0.08]" />
                    <div className="mt-3 h-3 w-3/4 rounded-full bg-white/[0.08]" />
                </div>
            )}
        </div>
    )
}
