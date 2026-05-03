import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/app/lib/supabaseAdmin"
import { getApiUser } from "@/app/lib/apiAuth"

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
    const body = await req.json().catch(() => null)

    const companyName =
      typeof body?.companyName === "string" ? body.companyName.trim() : null
    const notes = typeof body?.notes === "string" ? body.notes.trim() : null

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