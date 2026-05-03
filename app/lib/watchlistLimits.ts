import { isUserPremium, PremiumProfile } from "./premium"

export type WatchlistLimitResult = {
  allowed: boolean
  limit: number | "unlimited"
  currentCount: number
  reason?: string
}

export function getWatchlistLimit(profile: PremiumProfile | null | undefined) {
  return isUserPremium(profile) ? "unlimited" : 1
}

export function canCreateWatchlist({
  profile,
  currentWatchlistCount,
}: {
  profile: PremiumProfile | null | undefined
  currentWatchlistCount: number
}): WatchlistLimitResult {
  const limit = getWatchlistLimit(profile)

  if (limit === "unlimited") {
    return {
      allowed: true,
      limit,
      currentCount: currentWatchlistCount,
    }
  }

  if (currentWatchlistCount < limit) {
    return {
      allowed: true,
      limit,
      currentCount: currentWatchlistCount,
    }
  }

  return {
    allowed: false,
    limit,
    currentCount: currentWatchlistCount,
    reason: "Free users can create one watchlist. Upgrade to Premium to create multiple watchlists.",
  }
}

export function getWatchlistLimitLabel(profile: PremiumProfile | null | undefined) {
  const limit = getWatchlistLimit(profile)

  if (limit === "unlimited") {
    return "Unlimited watchlists"
  }

  return `${limit} watchlist`
}