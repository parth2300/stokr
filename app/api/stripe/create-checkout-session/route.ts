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

        if (!process.env.STRIPE_PREMIUM_PRICE_ID) {
            return NextResponse.json(
                { error: "Missing STRIPE_PREMIUM_PRICE_ID" },
                { status: 500 }
            )
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
            .select("id, email, username, stripe_customer_id")
            .eq("id", user.id)
            .maybeSingle()

        if (profileError) {
            return NextResponse.json(
                { error: profileError.message },
                { status: 500 }
            )
        }

        let stripeCustomerId = profile?.stripe_customer_id || null

        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: profile?.email || user.email || undefined,
                name: profile?.username || undefined,
                metadata: {
                    supabaseUserId: user.id,
                },
            })

            stripeCustomerId = customer.id

            const { error: updateError } = await supabaseAdmin
                .from("profiles")
                .update({
                    stripe_customer_id: stripeCustomerId,
                    premium_updated_at: new Date().toISOString(),
                })
                .eq("id", user.id)

            if (updateError) {
                return NextResponse.json(
                    { error: updateError.message },
                    { status: 500 }
                )
            }
        }

        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            customer: stripeCustomerId,
            line_items: [
                {
                    price: process.env.STRIPE_PREMIUM_PRICE_ID,
                    quantity: 1,
                },
            ],
            success_url: `${siteUrl}/dashboard?checkout=success`,
            cancel_url: `${siteUrl}/pricing?checkout=cancelled`,
            client_reference_id: user.id,
            metadata: {
                supabaseUserId: user.id,
            },
            subscription_data: {
                metadata: {
                    supabaseUserId: user.id,
                },
            },
            allow_promotion_codes: true,
        })

        return NextResponse.json({ url: session.url })
    } catch (err) {
        return NextResponse.json(
            {
                error:
                    err instanceof Error
                        ? err.message
                        : "Failed to create checkout session.",
            },
            { status: 500 }
        )
    }
}