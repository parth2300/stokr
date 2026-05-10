"use client"

import Link from "next/link"
import { ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import NavBar from "@/app/components/navBar"
import { trackClickUpgrade } from "@/app/lib/analytics"
import { supabase } from "@/app/lib/supabase"
import { isUserPremium, PremiumProfile } from "@/app/lib/premium"

type Profile = PremiumProfile & {
  id: string
}

export default function PremiumRouteGuard({
  children,
}: {
  children: ReactNode
}) {
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "allowed" | "blocked">(
    "loading"
  )

  useEffect(() => {
    async function checkAccess() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setStatus("blocked")
        router.replace("/login")
        return
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select(
          "id, plan, access_tier, is_premium_override, premium_override_until, subscription_status, subscription_current_period_end"
        )
        .eq("id", user.id)
        .maybeSingle()

      if (profileError || !profileData) {
        setStatus("blocked")
        return
      }

      const profile = profileData as Profile
      const premium = isUserPremium(profile)

      if (!premium) {
        setStatus("blocked")
        return
      }

      setStatus("allowed")
    }

    checkAccess()
  }, [router])

  if (status === "loading") {
    return (
      <main className="stokr-page">
        <section className="relative flex min-h-screen items-center justify-center px-6 py-10">
          <div className="stokr-bg" />

          <div className="stokr-card relative z-10 p-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#7C8CFF]">
              Checking Access
            </p>

            <h1 className="mt-3 text-3xl font-bold text-white">
              Loading dashboard
            </h1>

            <p className="mt-3 text-sm text-slate-400">
              Verifying premium access.
            </p>
          </div>
        </section>
      </main>
    )
  }

  if (status === "blocked") {
    return (
      <main className="stokr-page">
        <section className="stokr-shell">
          <div className="stokr-bg" />

          <div className="stokr-container">
            <NavBar showSearch />

            <div className="mx-auto mt-20 max-w-2xl">
              <section className="stokr-card border-[#7C9DFF]/30 bg-[#111827]/90 p-6 text-center sm:p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
                  Premium Feature
                </p>

                <h1 className="mt-3 text-3xl font-bold text-white">
                  Unlock the premium dashboard
                </h1>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#A3AAB8]">
                  Premium unlocks saved research history, watchlist insights,
                  risk alerts, filing changes, and unlimited AI stock reports.
                </p>

                <Link
                  href="/pricing"
                  onClick={() => trackClickUpgrade("premium_dashboard")}
                  className="stokr-button-primary mt-6 inline-flex"
                >
                  Upgrade to Premium
                </Link>

                <p className="mt-4 text-sm text-[#A3AAB8]">
                  Use code 1MFREE for your first month free.
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return <>{children}</>
}

