import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "../../../lib/supabaseAdmin"

function getBearerToken(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || ""

  if (!authHeader.startsWith("Bearer ")) {
    return null
  }

  return authHeader.slice("Bearer ".length)
}

export async function DELETE(req: NextRequest) {
  try {
    const token = getBearerToken(req)

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token)

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json().catch(() => null)
    const confirmation = String(body?.confirmation || "").trim()

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, username, email")
      .eq("id", user.id)
      .maybeSingle()

    if (profileError) {
      return NextResponse.json(
        { error: "Failed to verify account." },
        { status: 500 }
      )
    }

    const expectedUsername = String(profile?.username || "").trim()
    const expectedEmail = String(profile?.email || user.email || "").trim()

    const matchesUsername = expectedUsername && confirmation === expectedUsername
    const matchesEmail = expectedEmail && confirmation === expectedEmail

    if (!matchesUsername && !matchesEmail) {
      return NextResponse.json(
        { error: "Confirmation does not match your username or email." },
        { status: 400 }
      )
    }

    await supabaseAdmin.from("watchlist_items").delete().eq("user_id", user.id)
    await supabaseAdmin.from("watchlists").delete().eq("user_id", user.id)
    await supabaseAdmin.from("profiles").delete().eq("id", user.id)

    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(user.id)

    if (deleteUserError) {
      return NextResponse.json(
        { error: deleteUserError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Failed to delete account." },
      { status: 500 }
    )
  }
}