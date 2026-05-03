import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/app/lib/supabaseAdmin"
import { getApiUser } from "@/app/lib/apiAuth"
import {
  cleanOptionalText,
  cleanRequiredText,
  isValidUuid,
} from "@/app/lib/validation"

export async function PATCH(
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
    if (!isValidUuid(watchlistId)) {
      return NextResponse.json(
        { error: "Invalid watchlist id" },
        { status: 400 }
      )
    }
    const body = await req.json().catch(() => null)

    const name = cleanRequiredText(body?.name, 60)
    const description = cleanOptionalText(body?.description, 300)
    typeof body?.description === "string" ? body.description.trim() : null

    if (!name) {
      return NextResponse.json(
        { error: "Watchlist name is required" },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from("watchlists")
      .update({
        name,
        description,
        updated_at: new Date().toISOString(),
      })
      .eq("id", watchlistId)
      .eq("user_id", user.id)
      .select("*")
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({
      watchlist: data,
    })
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to update watchlist",
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
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
    if (!isValidUuid(watchlistId)) {
      return NextResponse.json(
        { error: "Invalid watchlist id" },
        { status: 400 }
      )
    }

    const { data: watchlist, error: watchlistError } = await supabaseAdmin
      .from("watchlists")
      .select("id, is_default")
      .eq("id", watchlistId)
      .eq("user_id", user.id)
      .maybeSingle()

    if (watchlistError) {
      throw new Error(watchlistError.message)
    }

    if (!watchlist) {
      return NextResponse.json(
        { error: "Watchlist not found" },
        { status: 404 }
      )
    }

    if (watchlist.is_default) {
      return NextResponse.json(
        { error: "Default watchlist cannot be deleted" },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from("watchlists")
      .delete()
      .eq("id", watchlistId)
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
        error: err instanceof Error ? err.message : "Failed to delete watchlist",
      },
      { status: 500 }
    )
  }
}