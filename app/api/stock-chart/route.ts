import { NextResponse } from "next/server"
import {
    ChartRange,
    calculatePriceSummary,
    formatChartData,
    getAlphaVantageFunction,
    getSeriesKey,
} from "../../lib/formatStockChart"

type CachedChart = {
    data: unknown
    timestamp: number
}

const chartCache = new Map<string, CachedChart>()

const CACHE_DURATION_BY_RANGE: Record<ChartRange, number> = {
    "1D": 5 * 60 * 1000,
    "7D": 15 * 60 * 1000,
    "1M": 60 * 60 * 1000,
    "3M": 6 * 60 * 60 * 1000,
    "1Y": 12 * 60 * 60 * 1000,
}

function isValidRange(range: string): range is ChartRange {
    return ["1D", "7D", "1M", "3M", "1Y"].includes(range)
}

function getFallbackChartData(ticker: string, range: ChartRange) {
    const basePrice = 100

    const pointCountByRange: Record<ChartRange, number> = {
        "1D": 24,
        "7D": 7,
        "1M": 22,
        "3M": 13,
        "1Y": 12,
    }

    const pointCount = pointCountByRange[range]

    const chartData = Array.from({ length: pointCount }, (_, index) => {
        const wave = Math.sin(index / 3) * 2
        const trend = index * 0.35
        const price = basePrice + wave + trend

        return {
            label: getFallbackLabel(index, range),
            price: Number(price.toFixed(2)),
        }
    })

    const summary = calculatePriceSummary(chartData)

    return {
        ticker,
        range,
        price: summary.price,
        changeAmount: summary.changeAmount,
        changePercent: summary.changePercent,
        isPositive: summary.isPositive,
        chartData,
        updatedAt: new Date().toISOString(),
        isFallback: true,
    }
}

function getFallbackLabel(index: number, range: ChartRange) {
    if (range === "1D") {
        const totalMinutes = 9 * 60 + 30 + index * 30
        const hour = Math.floor(totalMinutes / 60)
        const minute = totalMinutes % 60

        return `${hour}:${String(minute).padStart(2, "0")}`
    }

    if (range === "7D") {
        return ["Mon", "Tue", "Wed", "Thu", "Fri", "Mon", "Tue"][index] || `Day ${index + 1}`
    }

    if (range === "1M") {
        return `Day ${index + 1}`
    }

    if (range === "3M") {
        return `W${index + 1}`
    }

    return [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ][index] || `M${index + 1}`
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)

        const ticker = searchParams.get("ticker")?.trim().toUpperCase()
        const rangeParam = searchParams.get("range")?.trim().toUpperCase() || "1M"

        if (!ticker) {
            return NextResponse.json({ error: "Missing ticker" }, { status: 400 })
        }

        if (!isValidRange(rangeParam)) {
            return NextResponse.json({ error: "Invalid range" }, { status: 400 })
        }

        const cacheKey = `${ticker}:${rangeParam}`
        const now = Date.now()
        const cached = chartCache.get(cacheKey)

        if (cached && now - cached.timestamp < CACHE_DURATION_BY_RANGE[rangeParam]) {
            return NextResponse.json(cached.data, {
                headers: {
                    "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900",
                },
            })
        }

        const apiKey = process.env.ALPHA_VANTAGE_API_KEY

        if (!apiKey) {
            return NextResponse.json(
                { error: "Missing Alpha Vantage API key" },
                { status: 500 }
            )
        }

        const alphaConfig = getAlphaVantageFunction(rangeParam)

        const url =
            alphaConfig.functionName === "TIME_SERIES_INTRADAY"
                ? `https://www.alphavantage.co/query?function=${alphaConfig.functionName}&symbol=${ticker}&interval=${alphaConfig.interval}&outputsize=compact&apikey=${apiKey}`
                : `https://www.alphavantage.co/query?function=${alphaConfig.functionName}&symbol=${ticker}&outputsize=full&apikey=${apiKey}`

        const res = await fetch(url)
        const rawData = await res.json()

        if (rawData.Note || rawData.Information) {
            if (cached) {
                return NextResponse.json(cached.data, {
                    headers: {
                        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900",
                    },
                })
            }

            const fallbackData = getFallbackChartData(ticker, rangeParam)

            chartCache.set(cacheKey, {
                data: fallbackData,
                timestamp: now,
            })

            return NextResponse.json(fallbackData, {
                headers: {
                    "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900",
                },
            })
        }

        const seriesKey = getSeriesKey(rangeParam)
        const timeSeries = rawData[seriesKey]

        if (!timeSeries) {
            return NextResponse.json(
                { error: "No chart data found for this ticker" },
                { status: 404 }
            )
        }

        const chartData = formatChartData(timeSeries, rangeParam)
        const summary = calculatePriceSummary(chartData)

        const responseData = {
            ticker,
            range: rangeParam,
            price: summary.price,
            changeAmount: summary.changeAmount,
            changePercent: summary.changePercent,
            isPositive: summary.isPositive,
            chartData,
            updatedAt: new Date().toISOString(),
        }

        chartCache.set(cacheKey, {
            data: responseData,
            timestamp: now,
        })

        return NextResponse.json(responseData, {
            headers: {
                "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900",
            },
        })
    } catch {
        return NextResponse.json(
            { error: "Failed to fetch stock chart data" },
            { status: 500 }
        )
    }
}