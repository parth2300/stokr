import { supabaseAdmin } from "./supabaseAdmin"
import { isUserPremium, PremiumProfile } from "./premium"

const FREE_REPORT_LIMIT = 3
const FREE_REPORT_WINDOW_DAYS = 7

type ReportAccessOwner =
  | {
      type: "user"
      userId: string
      profile: PremiumProfile | null
    }
  | {
      type: "visitor"
      visitorId: string
      profile: null
    }

type ReportAccessResult = {
  allowed: boolean
  premium: boolean
  remaining: number
  used: number
  limit: number
  windowDays: number
  owner: ReportAccessOwner | null
  error?: string
  status?: number
}

function getBearerToken(req: Request) {
  const authHeader = req.headers.get("authorization") || ""

  if (!authHeader.startsWith("Bearer ")) {
    return null
  }

  return authHeader.slice("Bearer ".length).trim()
}

function normalizeTicker(ticker: string) {
  return ticker.trim().toUpperCase()
}

function getWindowStartIso() {
  const windowStart = new Date()
  windowStart.setDate(windowStart.getDate() - FREE_REPORT_WINDOW_DAYS)

  return windowStart.toISOString()
}

export function isValidReportTicker(ticker: string) {
  return /^[A-Z]{1,10}$/.test(ticker)
}

async function getReportAccessOwner(req: Request): Promise<ReportAccessOwner | null> {
  const token = getBearerToken(req)

  if (token) {
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token)

    if (!error && user) {
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select(
          "plan, access_tier, is_premium_override, premium_override_until, subscription_status, subscription_current_period_end"
        )
        .eq("id", user.id)
        .maybeSingle()

      return {
        type: "user",
        userId: user.id,
        profile: profile as PremiumProfile | null,
      }
    }
  }

  const visitorId = req.headers.get("x-stokr-visitor-id")?.trim()

  if (!visitorId || visitorId.length < 12 || visitorId.length > 120) {
    return null
  }

  return {
    type: "visitor",
    visitorId,
    profile: null,
  }
}

export async function checkReportAccess(
  req: Request,
  tickerValue: string
): Promise<ReportAccessResult> {
  const ticker = normalizeTicker(tickerValue)

  if (!isValidReportTicker(ticker)) {
    return {
      allowed: false,
      premium: false,
      remaining: 0,
      used: 0,
      limit: FREE_REPORT_LIMIT,
      windowDays: FREE_REPORT_WINDOW_DAYS,
      owner: null,
      error: "Invalid ticker",
      status: 400,
    }
  }

  const owner = await getReportAccessOwner(req)

  if (!owner) {
    return {
      allowed: false,
      premium: false,
      remaining: 0,
      used: 0,
      limit: FREE_REPORT_LIMIT,
      windowDays: FREE_REPORT_WINDOW_DAYS,
      owner: null,
      error: "Missing report access identity.",
      status: 401,
    }
  }

  const premium = owner.type === "user" && isUserPremium(owner.profile)

  if (premium) {
    return {
      allowed: true,
      premium: true,
      remaining: Number.POSITIVE_INFINITY,
      used: 0,
      limit: Number.POSITIVE_INFINITY,
      windowDays: FREE_REPORT_WINDOW_DAYS,
      owner,
    }
  }

  const windowStartIso = getWindowStartIso()

  const existingQuery = supabaseAdmin
    .from("report_usage")
    .select("id")
    .eq("ticker", ticker)
    .gte("created_at", windowStartIso)
    .limit(1)

  if (owner.type === "user") {
    existingQuery.eq("user_id", owner.userId)
  } else {
    existingQuery.eq("visitor_id", owner.visitorId)
  }

  const { data: existingRows, error: existingError } = await existingQuery

  if (existingError) {
    return {
      allowed: false,
      premium: false,
      remaining: 0,
      used: 0,
      limit: FREE_REPORT_LIMIT,
      windowDays: FREE_REPORT_WINDOW_DAYS,
      owner,
      error: existingError.message,
      status: 500,
    }
  }

  const alreadyUsedThisTickerThisWeek = Boolean(existingRows?.length)

  const countQuery = supabaseAdmin
    .from("report_usage")
    .select("ticker", { count: "exact", head: true })
    .gte("created_at", windowStartIso)

  if (owner.type === "user") {
    countQuery.eq("user_id", owner.userId)
  } else {
    countQuery.eq("visitor_id", owner.visitorId)
  }

  const { count, error: countError } = await countQuery

  if (countError) {
    return {
      allowed: false,
      premium: false,
      remaining: 0,
      used: 0,
      limit: FREE_REPORT_LIMIT,
      windowDays: FREE_REPORT_WINDOW_DAYS,
      owner,
      error: countError.message,
      status: 500,
    }
  }

  const used = count || 0
  const remaining = Math.max(FREE_REPORT_LIMIT - used, 0)

  if (alreadyUsedThisTickerThisWeek) {
    return {
      allowed: true,
      premium: false,
      remaining,
      used,
      limit: FREE_REPORT_LIMIT,
      windowDays: FREE_REPORT_WINDOW_DAYS,
      owner,
    }
  }

  if (used >= FREE_REPORT_LIMIT) {
    return {
      allowed: false,
      premium: false,
      remaining: 0,
      used,
      limit: FREE_REPORT_LIMIT,
      windowDays: FREE_REPORT_WINDOW_DAYS,
      owner,
      error: "Free report limit reached. Free users get 3 AI stock reports per week.",
      status: 402,
    }
  }

  return {
    allowed: true,
    premium: false,
    remaining,
    used,
    limit: FREE_REPORT_LIMIT,
    windowDays: FREE_REPORT_WINDOW_DAYS,
    owner,
  }
}

export async function recordReportUse(owner: ReportAccessOwner, tickerValue: string) {
  const ticker = normalizeTicker(tickerValue)
  const windowStartIso = getWindowStartIso()

  if (owner.type === "user") {
    const { data: existingRows, error: existingError } = await supabaseAdmin
      .from("report_usage")
      .select("id")
      .eq("user_id", owner.userId)
      .eq("ticker", ticker)
      .gte("created_at", windowStartIso)
      .limit(1)

    if (existingError) {
      throw new Error(existingError.message)
    }

    if (existingRows && existingRows.length > 0) {
      return
    }

    const { error: insertError } = await supabaseAdmin.from("report_usage").insert({
      user_id: owner.userId,
      visitor_id: null,
      ticker,
    })

    if (insertError) {
      throw new Error(insertError.message)
    }

    return
  }

  const { data: existingRows, error: existingError } = await supabaseAdmin
    .from("report_usage")
    .select("id")
    .eq("visitor_id", owner.visitorId)
    .eq("ticker", ticker)
    .gte("created_at", windowStartIso)
    .limit(1)

  if (existingError) {
    throw new Error(existingError.message)
  }

  if (existingRows && existingRows.length > 0) {
    return
  }

  const { error: insertError } = await supabaseAdmin.from("report_usage").insert({
    user_id: null,
    visitor_id: owner.visitorId,
    ticker,
  })

  if (insertError) {
    throw new Error(insertError.message)
  }
}