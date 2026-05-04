import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/app/lib/supabaseAdmin"
import { getApiUser } from "@/app/lib/apiAuth"
import { isUserPremium, PremiumProfile } from "@/app/lib/premium"

type Profile = PremiumProfile & {
  id: string
  plan?: string | null
  access_tier?: string | null
}

function formatPlan(profile: Profile | null) {
  if (!profile) return "Free"

  if (profile.access_tier === "admin") return "Admin"
  if (profile.access_tier === "pro") return "Pro"
  if (isUserPremium(profile)) return "Premium"

  return "Free"
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
    const premium = isUserPremium(profile)

    const [
      watchlistCountResult,
      savedStockCountResult,
      watchlistItemsResult,
      activeAlertsResult,
    ] = await Promise.all([
      supabaseAdmin
        .from("watchlists")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),

      supabaseAdmin
        .from("watchlist_items")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),

      supabaseAdmin
        .from("watchlist_items")
        .select("ticker")
        .eq("user_id", user.id),

      supabaseAdmin
        .from("user_alerts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_read", false),
    ])

    if (watchlistCountResult.error) {
      throw new Error(watchlistCountResult.error.message)
    }

    if (savedStockCountResult.error) {
      throw new Error(savedStockCountResult.error.message)
    }

    if (watchlistItemsResult.error) {
      throw new Error(watchlistItemsResult.error.message)
    }

    if (activeAlertsResult.error) {
      throw new Error(activeAlertsResult.error.message)
    }

    const tickers = Array.from(
      new Set((watchlistItemsResult.data || []).map((item) => item.ticker))
    )

    let savedReportCount = 0

    if (tickers.length > 0) {
      const { count, error: reportCountError } = await supabaseAdmin
        .from("analysis_cache")
        .select("id", { count: "exact", head: true })
        .in("ticker", tickers)

      if (reportCountError) {
        throw new Error(reportCountError.message)
      }

      savedReportCount = count || 0
    }

    const activeAlerts = activeAlertsResult.count || 0

    return NextResponse.json({
      planStatus: formatPlan(profile),
      isPremium: premium,
      reportsUsed: savedReportCount,
      monthlyReportLimit: premium ? null : 3,
      watchlistCount: watchlistCountResult.count || 0,
      savedStockCount: savedStockCountResult.count || 0,
      activeAlerts,
      activeAlertDetail:
        activeAlerts > 0 ? `${activeAlerts} unread alerts` : "No unread alerts",
    })
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Failed to load dashboard summary",
      },
      { status: 500 }
    )
  }
}