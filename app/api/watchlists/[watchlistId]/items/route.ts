import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/app/lib/supabaseAdmin"
import { getApiUser } from "@/app/lib/apiAuth"

function normalizeTicker(value: unknown) {
  if (typeof value !== "string") return ""

  return value.trim().toUpperCase()
}

function isValidTicker(ticker: string) {
  return /^[A-Z]{1,10}$/.test(ticker)
}

async function verifyWatchlistOwner(watchlistId: string, userId: string) {
  const { data, error } = await supabaseAdmin
    .from("watchlists")
    .select("id")
    .eq("id", watchlistId)
    .eq("user_id", userId)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return Boolean(data)
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ watchlistId: string }> }
) {
  try {
    const { user, error: authError } = await getApiUser(req)

    if (authError || !user) {
      return NextResponse.json(
        { error: authError || "Not authenticated" },
        { status: 401 }
      )
    }

    const { watchlistId } = await params

    const ownsWatchlist = await verifyWatchlistOwner(watchlistId, user.id)

    if (!ownsWatchlist) {
      return NextResponse.json(
        { error: "Watchlist not found" },
        { status: 404 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from("watchlist_items")
      .select("*")
      .eq("watchlist_id", watchlistId)
      .eq("user_id", user.id)
      .order("ticker", { ascending: true })

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({
      items: data || [],
    })
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to load watchlist items",
      },
      { status: 500 }
    )
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ watchlistId: string }> }
) {
  try {
    const { user, error: authError } = await getApiUser(req)

    if (authError || !user) {
      return NextResponse.json(
        { error: authError || "Not authenticated" },
        { status: 401 }
      )
    }

    const { watchlistId } = await params
    const body = await req.json().catch(() => null)

    const ticker = normalizeTicker(body?.ticker)
    const companyName =
      typeof body?.companyName === "string" ? body.companyName.trim() : null
    const notes = typeof body?.notes === "string" ? body.notes.trim() : null

    if (!isValidTicker(ticker)) {
      return NextResponse.json(
        { error: "Invalid ticker. Use 1–10 letters." },
        { status: 400 }
      )
    }

    const ownsWatchlist = await verifyWatchlistOwner(watchlistId, user.id)

    if (!ownsWatchlist) {
      return NextResponse.json(
        { error: "Watchlist not found" },
        { status: 404 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from("watchlist_items")
      .insert({
        watchlist_id: watchlistId,
        user_id: user.id,
        ticker,
        company_name: companyName,
        notes,
      })
      .select("*")
      .single()

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: `${ticker} is already in this watchlist.` },
          { status: 409 }
        )
      }

      throw new Error(error.message)
    }

    return NextResponse.json(
      {
        item: data,
      },
      { status: 201 }
    )
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to add ticker to watchlist",
      },
      { status: 500 }
    )
  }
}