import { NextResponse } from "next/server"
import {
    getLatestAnnualReports,
    getFilingDocumentText,
} from "../../lib/secEdgar"
import { prepareFilingComparisonText } from "../../lib/filingComparisonText"
import { generateFilingComparison } from "../../lib/generateFilingComparison"

import {
    getCachedFilingComparison,
    saveCachedFilingComparison,
} from "../../lib/filingComparisonCache"


const comparisonCache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000

function isValidTicker(ticker: string) {
    return /^[A-Z]{1,10}$/.test(ticker)
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const ticker = searchParams.get("ticker")?.trim().toUpperCase()

        if (!ticker) {
            return NextResponse.json({ error: "Missing ticker" }, { status: 400 })
        }

        if (!isValidTicker(ticker)) {
            return NextResponse.json({ error: "Invalid ticker" }, { status: 400 })
        }

        const cached = comparisonCache.get(ticker)
        const now = Date.now()

        if (cached && now - cached.timestamp < CACHE_DURATION_MS) {
            return NextResponse.json(cached.data)
        }

        const reports = await getLatestAnnualReports(ticker, 2)

        if (!reports || reports.filings.length < 2) {
            return NextResponse.json(
                { error: "Not enough 10-K filings found for comparison" },
                { status: 404 }
            )
        }

        const [latest, previous] = reports.filings

        const cachedComparison = await getCachedFilingComparison({
            ticker,
            latestAccessionNumber: latest.accessionNumber,
            previousAccessionNumber: previous.accessionNumber,
        })

        if (cachedComparison) {
            return NextResponse.json({
                ticker,
                companyName: cachedComparison.company_name,
                latestFiling: latest,
                previousFiling: previous,
                comparison: cachedComparison.comparison_json,
                source: "cache",
                generatedAt: cachedComparison.updated_at,
            })
        }

        const [latestTextRaw, previousTextRaw] = await Promise.all([
            getFilingDocumentText({
                cik: reports.company.cik,
                accessionNumber: latest.accessionNumber,
                primaryDocument: latest.primaryDocument,
            }),
            getFilingDocumentText({
                cik: reports.company.cik,
                accessionNumber: previous.accessionNumber,
                primaryDocument: previous.primaryDocument,
            }),
        ])

        const latestText = prepareFilingComparisonText(latestTextRaw)
        const previousText = prepareFilingComparisonText(previousTextRaw)

        const comparison = await generateFilingComparison({
            ticker,
            companyName: reports.company.name,
            latestFilingText: latestText,
            previousFilingText: previousText,
        })

        await saveCachedFilingComparison({
            ticker,
            companyName: reports.company.name,
            latestAccessionNumber: latest.accessionNumber,
            previousAccessionNumber: previous.accessionNumber,
            latestFilingDate: latest.filingDate,
            previousFilingDate: previous.filingDate,
            comparisonJson: comparison,
        })

        const responseData = {
            ticker,
            companyName: reports.company.name,
            latestFiling: latest,
            previousFiling: previous,
            comparison,
            generatedAt: new Date().toISOString(),
            source: "openai"
        }

        comparisonCache.set(ticker, {
            data: responseData,
            timestamp: now,
        })

        return NextResponse.json(responseData)
    } catch (err) {
        return NextResponse.json(
            {
                error:
                    err instanceof Error
                        ? err.message
                        : "Failed to generate filing comparison",
            },
            { status: 500 }
        )
    }
}