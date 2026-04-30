import { NextResponse } from "next/server"
import {
  getCachedAnalysisForFiling,
  saveCachedAnalysis,
} from "../../lib/analysisCache"
import { generateStockAnalysis } from "../../lib/generateStockAnalysis"
import {
  getLatestAnnualReport,
  getFilingDocumentText,
} from "../../lib/secEdgar"
import { prepareFilingTextForAnalysis } from "../../lib/filingText"

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

    const annualReport = await getLatestAnnualReport(ticker)

    if (!annualReport || !annualReport.filing) {
      return NextResponse.json(
        { error: "No latest 10-K found for this ticker" },
        { status: 404 }
      )
    }

    const cached = await getCachedAnalysisForFiling({
      ticker,
      formType: annualReport.filing.form,
      filingAccessionNumber: annualReport.filing.accessionNumber,
    })

    if (cached) {
      return NextResponse.json({
        source: "cache",
        data: cached,
      })
    }

    const filingText = await getFilingDocumentText({
      cik: annualReport.company.cik,
      accessionNumber: annualReport.filing.accessionNumber,
      primaryDocument: annualReport.filing.primaryDocument,
    })

    const preparedText = prepareFilingTextForAnalysis(filingText)

    const analysis = await generateStockAnalysis({
      ticker,
      companyName: annualReport.company.name,
      filingText: preparedText,
    })

    const saved = await saveCachedAnalysis({
      ticker,
      companyName: annualReport.company.name,
      cik: annualReport.company.cik,
      formType: annualReport.filing.form,
      filingAccessionNumber: annualReport.filing.accessionNumber,
      filingDate: annualReport.filing.filingDate,
      analysisJson: analysis,
    })

    return NextResponse.json({
      source: "openai",
      data: saved,
    })
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to generate analysis",
      },
      { status: 500 }
    )
  }
}