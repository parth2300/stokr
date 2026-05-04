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
import {
  checkReportAccess,
  isValidReportTicker,
  recordReportUse,
} from "../../lib/reportAccess"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const ticker = searchParams.get("ticker")?.trim().toUpperCase()

    if (!ticker) {
      return NextResponse.json({ error: "Missing ticker" }, { status: 400 })
    }

    if (!isValidReportTicker(ticker)) {
      return NextResponse.json({ error: "Invalid ticker" }, { status: 400 })
    }

    const annualReport = await getLatestAnnualReport(ticker)

    if (!annualReport || !annualReport.filing) {
      return NextResponse.json(
        { error: "No latest 10-K found for this ticker" },
        { status: 404 }
      )
    }

    const access = await checkReportAccess(req, ticker)

    if (!access.allowed || !access.owner) {
      return NextResponse.json(
        {
          error: access.error || "Report access denied.",
          used: access.used,
          remaining: access.remaining,
          limit: access.limit,
        },
        { status: access.status || 403 }
      )
    }

    const cached = await getCachedAnalysisForFiling({
      ticker,
      formType: annualReport.filing.form,
      filingAccessionNumber: annualReport.filing.accessionNumber,
    })

    if (cached) {
      if (!access.premium) {
        await recordReportUse(access.owner, ticker)
      }

      return NextResponse.json({
        source: "cache",
        data: cached,
        access: {
          premium: access.premium,
          used: access.used,
          remaining: access.premium
            ? "unlimited"
            : Math.max(access.remaining - 1, 0),
          limit: access.premium ? "unlimited" : access.limit,
        },
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

    if (!access.premium) {
      await recordReportUse(access.owner, ticker)
    }

    return NextResponse.json({
      source: "openai",
      data: saved,
      access: {
        premium: access.premium,
        used: access.used,
        remaining: access.premium
          ? "unlimited"
          : Math.max(access.remaining - 1, 0),
        limit: access.premium ? "unlimited" : access.limit,
      },
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