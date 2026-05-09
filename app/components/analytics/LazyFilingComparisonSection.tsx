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
                <div className="h-72 rounded-xl border border-white/[0.08] bg-[#11141C]" />
            )}
        </div>
    )
}
