import { NextResponse } from "next/server"
import { getCachedAnalysis } from "@/app/lib/analysisCache"
import { checkReportAccess, recordReportUse } from "@/app/lib/reportAccess"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const ticker = searchParams.get("ticker")?.trim().toUpperCase()

    if (!ticker) {
      return NextResponse.json(
        { error: "Missing ticker" },
        { status: 400 }
      )
    }

    const cachedAnalysis = await getCachedAnalysis(ticker)

    if (!cachedAnalysis) {
      return NextResponse.json(
        { error: "No cached analysis found" },
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

    if (!access.premium) {
      await recordReportUse(access.owner, ticker)
    }

    return NextResponse.json({
      data: cachedAnalysis,
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
          err instanceof Error ? err.message : "Failed to read cached analysis",
      },
      { status: 500 }
    )
  }
}