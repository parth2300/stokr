"use client"

import { ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
        router.replace("/pricing")
        return
      }

      const profile = profileData as Profile
      const premium = isUserPremium(profile)

      if (!premium) {
        setStatus("blocked")
        router.replace("/pricing")
        return
      }

      setStatus("allowed")
    }

    checkAccess()
  }, [router])

  if (status === "loading") {
    return (
      <main className="min-h-screen overflow-hidden bg-[#0F172A] text-white">
        <section className="relative flex min-h-screen items-center justify-center px-6 py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_18%,rgba(255,138,101,0.22),transparent_38%),radial-gradient(circle_at_82%_20%,rgba(124,157,255,0.28),transparent_42%),radial-gradient(circle_at_50%_70%,rgba(124,157,255,0.12),transparent_48%)]" />
          <div className="absolute inset-0 bg-black/20" />

          <div className="relative z-10 rounded-[30px] border border-[#7C9DFF]/40 bg-white/[0.045] p-8 text-center shadow-[0_0_24px_rgba(124,157,255,0.12)] backdrop-blur-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#7C9DFF]">
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
    return null
  }

  return <>{children}</>
}