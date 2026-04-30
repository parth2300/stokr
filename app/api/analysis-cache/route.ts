import { NextResponse } from "next/server"
import { getCachedAnalysis } from "@/app/lib/analysisCache"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const ticker = searchParams.get("ticker")

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

    return NextResponse.json({ data: cachedAnalysis })
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