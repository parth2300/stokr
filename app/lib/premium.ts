export type PremiumProfile = {
  plan?: string | null
  access_tier?: string | null

  is_premium_override?: boolean | null
  premium_override_until?: string | null

  subscription_status?: string | null
  subscription_current_period_end?: string | null
}

function isFutureDate(value?: string | null) {
  if (!value) return false

  const date = new Date(value).getTime()

  return Number.isFinite(date) && date > Date.now()
}

export function isUserPremium(profile: PremiumProfile | null | undefined) {
  if (!profile) return false

  const hasManualPremium =
    profile.is_premium_override === true &&
    (!profile.premium_override_until ||
      isFutureDate(profile.premium_override_until))

  if (hasManualPremium) return true

  const hasActiveStripeAccess =
    profile.subscription_status === "active" ||
    profile.subscription_status === "trialing"

  if (hasActiveStripeAccess) return true

  const hasCanceledButStillPaidAccess =
    profile.subscription_status === "canceled" &&
    isFutureDate(profile.subscription_current_period_end)

  if (hasCanceledButStillPaidAccess) return true

  const hasTierAccess =
    profile.access_tier === "premium" ||
    profile.access_tier === "pro" ||
    profile.access_tier === "admin"

  if (hasTierAccess) return true

  return false
}

export function getUserAccessTier(profile: PremiumProfile | null | undefined) {
  if (!profile) return "free"

  if (profile.access_tier === "admin") return "admin"
  if (profile.access_tier === "pro") return "pro"
  if (isUserPremium(profile)) return "premium"

  return "free"
}