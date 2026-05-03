import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/app/lib/supabaseAdmin"
import { getApiUser } from "@/app/lib/apiAuth"
import { cleanOptionalText, isValidUuid } from "@/app/lib/validation"

export async function PATCH(
  req: Request,
  {
    params,
  }: { params: Promise<{ watchlistId: string; itemId: string }> }
) {
  try {
    const { user, error: authError } = await getApiUser(req)

    if (authError || !user) {
      return NextResponse.json(
        { error: authError || "Not authenticated" },
        { status: 401 }
      )
    }

    const { watchlistId, itemId } = await params

    if (!isValidUuid(watchlistId)) {
      return NextResponse.json(
        { error: "Invalid watchlist id" },
        { status: 400 }
      )
    }

    if (!isValidUuid(itemId)) {
      return NextResponse.json(
        { error: "Invalid watchlist item id" },
        { status: 400 }
      )
    }

    const body = await req.json().catch(() => null)

    const companyName = cleanOptionalText(body?.companyName, 120)
    const notes = cleanOptionalText(body?.notes, 500)

    const { data, error } = await supabaseAdmin
      .from("watchlist_items")
      .update({
        company_name: companyName,
        notes,
      })
      .eq("id", itemId)
      .eq("watchlist_id", watchlistId)
      .eq("user_id", user.id)
      .select("*")
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({
      item: data,
    })
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to update watchlist item",
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: { params: Promise<{ watchlistId: string; itemId: string }> }
) {
  try {
    const { user, error: authError } = await getApiUser(req)

    if (authError || !user) {
      return NextResponse.json(
        { error: authError || "Not authenticated" },
        { status: 401 }
      )
    }

    const { watchlistId, itemId } = await params
    console.log("DELETE WATCHLIST PARAMS:", {
      watchlistId,
      itemId,
      validWatchlistId: isValidUuid(watchlistId),
      validItemId: isValidUuid(itemId),
    })

    if (!isValidUuid(watchlistId)) {
      return NextResponse.json(
        { error: "Invalid watchlist id" },
        { status: 400 }
      )
    }

    if (!isValidUuid(itemId)) {
      return NextResponse.json(
        { error: "Invalid watchlist item id" },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from("watchlist_items")
      .delete()
      .eq("id", itemId)
      .eq("watchlist_id", watchlistId)
      .eq("user_id", user.id)

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({
      success: true,
    })
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to delete watchlist item",
      },
      { status: 500 }
    )
  }
}