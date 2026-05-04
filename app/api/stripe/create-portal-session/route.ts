import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/app/lib/stripe"
import { supabaseAdmin } from "@/app/lib/supabaseAdmin"

function getBearerToken(req: NextRequest) {
    const authHeader = req.headers.get("authorization") || ""

    if (!authHeader.startsWith("Bearer ")) {
        return null
    }

    return authHeader.slice("Bearer ".length)
}

export async function POST(req: NextRequest) {
    try {
        const token = getBearerToken(req)

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

        const {
            data: { user },
            error: userError,
        } = await supabaseAdmin.auth.getUser(token)

        if (userError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { data: profile, error: profileError } = await supabaseAdmin
            .from("profiles")
            .select("stripe_customer_id")
            .eq("id", user.id)
            .maybeSingle()

        if (profileError) {
            return NextResponse.json(
                { error: profileError.message },
                { status: 500 }
            )
        }

        if (!profile?.stripe_customer_id) {
            return NextResponse.json(
                { error: "No Stripe customer found for this account." },
                { status: 404 }
            )
        }

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: profile.stripe_customer_id,
            return_url: `${siteUrl}/dashboard`,
        })

        return NextResponse.json({ url: portalSession.url })
    } catch (err) {
        return NextResponse.json(
            {
                error:
                    err instanceof Error
                        ? err.message
                        : "Failed to create subscription portal session.",
            },
            { status: 500 }
        )
    }
}