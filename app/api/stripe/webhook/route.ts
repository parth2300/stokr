import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { stripe } from "@/app/lib/stripe"
import { supabaseAdmin } from "@/app/lib/supabaseAdmin"

function getSubscriptionPeriodEnd(subscription: Stripe.Subscription) {
    return subscription.items.data[0]?.current_period_end
        ? new Date(subscription.items.data[0].current_period_end * 1000).toISOString()
        : null
}

function getSubscriptionPriceId(subscription: Stripe.Subscription) {
    return subscription.items.data[0]?.price.id || null
}

function getAccessTier(status: Stripe.Subscription.Status | string | null) {
    return status === "active" || status === "trialing" ? "premium" : "free"
}

async function updateProfileFromSubscription(subscription: Stripe.Subscription) {
    const customerId =
        typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id

    const subscriptionId = subscription.id
    const status = subscription.status
    const accessTier = getAccessTier(status)
    const currentPeriodEnd = getSubscriptionPeriodEnd(subscription)
    const stripePriceId = getSubscriptionPriceId(subscription)
    const now = new Date().toISOString()

    const { data: existingProfile, error: existingProfileError } = await supabaseAdmin
        .from("profiles")
        .select("premium_created_at")
        .eq("stripe_customer_id", customerId)
        .maybeSingle()

    if (existingProfileError) {
        throw new Error(existingProfileError.message)
    }

    const updateData = {
        stripe_subscription_id: subscriptionId,
        stripe_price_id: stripePriceId,
        subscription_status: status,
        subscription_current_period_end: currentPeriodEnd,
        subscription_cancel_at_period_end: subscription.cancel_at_period_end,
        access_tier: accessTier,
        premium_updated_at: now,
        ...(accessTier === "premium" && !existingProfile?.premium_created_at
            ? { premium_created_at: now }
            : {}),
    }

    const { error } = await supabaseAdmin
        .from("profiles")
        .update(updateData)
        .eq("stripe_customer_id", customerId)

    if (error) {
        throw new Error(error.message)
    }
}

async function updateProfileFromCheckoutSession(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.supabaseUserId || session.client_reference_id

    const customerId =
        typeof session.customer === "string"
            ? session.customer
            : session.customer?.id

    const subscriptionId =
        typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id

    if (!userId || !customerId) {
        return
    }

    let subscription: Stripe.Subscription | null = null
    let subscriptionStatus: Stripe.Subscription.Status | null = null
    let currentPeriodEnd: string | null = null
    let stripePriceId: string | null = null
    let cancelAtPeriodEnd = false

    if (subscriptionId) {
        subscription = await stripe.subscriptions.retrieve(subscriptionId)

        subscriptionStatus = subscription.status
        currentPeriodEnd = getSubscriptionPeriodEnd(subscription)
        stripePriceId = getSubscriptionPriceId(subscription)
        cancelAtPeriodEnd = subscription.cancel_at_period_end
    }

    const accessTier = getAccessTier(subscriptionStatus)
    const now = new Date().toISOString()

    const { data: existingProfile, error: existingProfileError } = await supabaseAdmin
        .from("profiles")
        .select("premium_created_at")
        .eq("id", userId)
        .maybeSingle()

    if (existingProfileError) {
        throw new Error(existingProfileError.message)
    }

    const updateData = {
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId || null,
        stripe_price_id: stripePriceId,
        subscription_status: subscriptionStatus,
        subscription_current_period_end: currentPeriodEnd,
        subscription_cancel_at_period_end: cancelAtPeriodEnd,
        access_tier: accessTier,
        premium_updated_at: now,
        ...(accessTier === "premium" && !existingProfile?.premium_created_at
            ? { premium_created_at: now }
            : {}),
    }

    const { error } = await supabaseAdmin
        .from("profiles")
        .update(updateData)
        .eq("id", userId)

    if (error) {
        throw new Error(error.message)
    }
}

export async function POST(req: NextRequest) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!webhookSecret) {
        return NextResponse.json(
            { error: "Missing STRIPE_WEBHOOK_SECRET" },
            { status: 500 }
        )
    }

    const signature = req.headers.get("stripe-signature")

    if (!signature) {
        return NextResponse.json(
            { error: "Missing Stripe signature" },
            { status: 400 }
        )
    }

    let event: Stripe.Event

    try {
        const rawBody = await req.text()

        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
    } catch (err) {
        return NextResponse.json(
            {
                error:
                    err instanceof Error
                        ? `Webhook signature verification failed: ${err.message}`
                        : "Webhook signature verification failed.",
            },
            { status: 400 }
        )
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session
                await updateProfileFromCheckoutSession(session)
                break
            }

            case "customer.subscription.created":
            case "customer.subscription.updated":
            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription
                await updateProfileFromSubscription(subscription)
                break
            }

            default:
                break
        }

        return NextResponse.json({ received: true })
    } catch (err) {
        return NextResponse.json(
            {
                error: err instanceof Error ? err.message : "Webhook handler failed.",
            },
            { status: 500 }
        )
    }
}