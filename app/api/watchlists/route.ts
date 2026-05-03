import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/app/lib/supabaseAdmin"
import { getApiUser } from "@/app/lib/apiAuth"
import type { PremiumProfile } from "@/app/lib/premium"
import { cleanOptionalText, cleanRequiredText } from "@/app/lib/validation"
import { canCreateWatchlist } from "@/app/lib/watchlistLimits"

type Profile = PremiumProfile & {
  id: string
}

export async function GET(req: Request) {
  try {
    const { user, error: authError } = await getApiUser(req)

    if (authError || !user) {
      return NextResponse.json(
        { error: authError || "Not authenticated" },
        { status: 401 }
      )
    }

    const { data: watchlists, error: watchlistsError } = await supabaseAdmin
      .from("watchlists")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })

    if (watchlistsError) {
      throw new Error(watchlistsError.message)
    }

    const { data: items, error: itemsError } = await supabaseAdmin
      .from("watchlist_items")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (itemsError) {
      throw new Error(itemsError.message)
    }

    return NextResponse.json({
      watchlists: watchlists || [],
      items: items || [],
    })
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to load watchlists",
      },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const { user, error: authError } = await getApiUser(req)

    if (authError || !user) {
      return NextResponse.json(
        { error: authError || "Not authenticated" },
        { status: 401 }
      )
    }

    const body = await req.json().catch(() => null)
    const name = cleanRequiredText(body?.name, 60)
    const description = cleanOptionalText(body?.description, 300)
    const requestedDefault = body?.isDefault === true

    if (!name) {
      return NextResponse.json(
        { error: "Watchlist name is required" },
        { status: 400 }
      )
    }

    const { data: profileData, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select(
        "id, plan, access_tier, is_premium_override, premium_override_until, subscription_status, subscription_current_period_end"
      )
      .eq("id", user.id)
      .maybeSingle()

    if (profileError) {
      throw new Error(profileError.message)
    }

    const profile = profileData as Profile | null

    const { count, error: countError } = await supabaseAdmin
      .from("watchlists")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)

    if (countError) {
      throw new Error(countError.message)
    }

    const currentCount = count || 0

    const limitResult = canCreateWatchlist({
      profile,
      currentWatchlistCount: currentCount,
    })

    if (!limitResult.allowed) {
      return NextResponse.json(
        {
          error:
            limitResult.reason ||
            "You cannot create another watchlist with your current plan.",
          limit: limitResult.limit,
          currentCount: limitResult.currentCount,
        },
        { status: 403 }
      )
    }

    const isDefault = requestedDefault && currentCount === 0

    const { data, error } = await supabaseAdmin
      .from("watchlists")
      .insert({
        user_id: user.id,
        name,
        description,
        is_default: isDefault,
      })
      .select("*")
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json(
      {
        watchlist: data,
      },
      { status: 201 }
    )
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to create watchlist",
      },
      { status: 500 }
    )
  }
}