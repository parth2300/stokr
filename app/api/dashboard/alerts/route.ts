import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/app/lib/supabaseAdmin"
import { getApiUser } from "@/app/lib/apiAuth"
import {
  cleanRequiredText,
  isValidTicker,
  normalizeTicker,
} from "@/app/lib/validation"

function formatTimeAgo(value: string | null | undefined) {
  if (!value) return "Recently"

  const date = new Date(value).getTime()

  if (!Number.isFinite(date)) return "Recently"

  const diffMs = Date.now() - date
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMinutes < 1) return "Just now"
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`

  return `${diffDays}d ago`
}

function normalizeSeverity(value: string | null | undefined) {
  if (value === "High" || value === "Medium" || value === "Low") {
    return value
  }

  return "Medium"
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

    const { data, error } = await supabaseAdmin
      .from("user_alerts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(8)

    if (error) {
      throw new Error(error.message)
    }

    const alerts = (data || []).map((alert) => ({
      ticker: String(alert.ticker || "").toUpperCase(),
      title: alert.title || "Alert",
      description: alert.message || "No alert message provided.",
      severity: normalizeSeverity(alert.severity),
      timeAgo: formatTimeAgo(alert.created_at),
      isRead: Boolean(alert.is_read),
      alertType: alert.alert_type || "general",
    }))

    return NextResponse.json({
      alerts,
    })
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Failed to load dashboard alerts",
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

    const ticker = normalizeTicker(body?.ticker)
    const alertType = cleanRequiredText(body?.alertType || "general", 60)
    const title = cleanRequiredText(body?.title, 120)
    const message = cleanRequiredText(body?.message, 500)
    const severity = normalizeSeverity(
      typeof body?.severity === "string" ? body.severity : "Medium"
    )

    if (!ticker) {
      if (!isValidTicker(ticker)) {
        return NextResponse.json({ error: "Invalid ticker" }, { status: 400 })
      }
    }

    if (!title) {
      return NextResponse.json({ error: "Alert title is required" }, { status: 400 })
    }

    if (!message) {
      return NextResponse.json({ error: "Alert message is required" }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from("user_alerts")
      .insert({
        user_id: user.id,
        ticker,
        alert_type: alertType,
        severity,
        title,
        message,
      })
      .select("*")
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json(
      {
        alert: data,
      },
      { status: 201 }
    )
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to create alert",
      },
      { status: 500 }
    )
  }
}