"use client"

import { useEffect, useRef, useState } from "react"
import { supabase } from "../../lib/supabase"

type AccountSettingsModalProps = {
  isOpen: boolean
  onClose: () => void
  username: string | null
  email: string | null
  isPremium: boolean
}

async function getAuthHeader() {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.access_token) {
    throw new Error("Missing auth session.")
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
  }
}

export default function AccountSettingsModal({
  isOpen,
  onClose,
  username,
  email,
  isPremium,
}: AccountSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<"settings" | "subscription">("settings")
  const [deleteInput, setDeleteInput] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isManagingSubscription, setIsManagingSubscription] = useState(false)
  const [error, setError] = useState("")
  const dialogRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const confirmationValue = username || email || ""
  const canDelete = deleteInput.trim() === confirmationValue

  async function handleManageSubscription() {
    setError("")
    setIsManagingSubscription(true)

    try {
      const authHeader = await getAuthHeader()

      const res = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
        headers: authHeader,
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(data?.error || "Unable to open subscription portal.")
      }

      if (data?.url) {
        window.location.href = data.url
        return
      }

      throw new Error("Subscription portal URL missing.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to manage subscription.")
    } finally {
      setIsManagingSubscription(false)
    }
  }

  async function handleDeleteAccount() {
    if (!canDelete) {
      setError("Confirmation does not match your account.")
      return
    }

    setError("")
    setIsDeleting(true)

    try {
      const authHeader = await getAuthHeader()

      const res = await fetch("/api/account/delete", {
        method: "DELETE",
        headers: {
          ...authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          confirmation: deleteInput.trim(),
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(data?.error || "Failed to delete account.")
      }

      await supabase.auth.signOut()
      window.location.href = "/"
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete account.")
      setIsDeleting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-settings-title"
      onMouseDown={(event) => {
        if (
          dialogRef.current &&
          !dialogRef.current.contains(event.target as Node)
        ) {
          onClose()
        }
      }}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-2xl rounded-xl border border-white/[0.10] bg-[#11141C] p-6 text-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#7C8CFF]">
              Account
            </p>
            <h2 id="account-settings-title" className="mt-2 text-2xl font-bold">
              Settings
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Manage your stokr account, subscription, and account deletion.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/15"
          >
            Close
          </button>
        </div>

        <div className="mt-6 flex rounded-2xl border border-white/10 bg-black/20 p-1">
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold ${
              activeTab === "settings"
                ? "bg-white text-[#0F172A]"
                : "text-slate-300 hover:bg-white/10"
            }`}
          >
            Settings
          </button>

          <button
            onClick={() => setActiveTab("subscription")}
            className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold ${
              activeTab === "subscription"
                ? "bg-white text-[#0F172A]"
                : "text-slate-300 hover:bg-white/10"
            }`}
          >
            Subscription
          </button>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="mt-6 space-y-5">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Profile
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-500">Username</p>
                  <p className="mt-1 font-semibold text-white">
                    {username || "No username saved"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="mt-1 break-all font-semibold text-white">
                    {email || "No email saved"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Plan
              </p>

              <p className="mt-2 text-lg font-bold text-white">
                {isPremium ? "Premium" : "Free"}
              </p>

              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Free users can use the core watchlist. Premium users unlock advanced dashboard features and expanded account limits.
              </p>
            </div>

            <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-200">
                Delete Account
              </p>

              <p className="mt-3 text-sm leading-relaxed text-red-100/80">
                This permanently deletes your account data. To confirm, type:
              </p>

              <p className="mt-2 rounded-xl bg-black/30 px-3 py-2 text-sm font-bold text-white">
                {confirmationValue || "No username or email found"}
              </p>

              <input
                value={deleteInput}
                onChange={(event) => setDeleteInput(event.target.value)}
                placeholder="Type your username or email"
                className="mt-4 w-full rounded-2xl border border-red-300/20 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-red-300/50"
              />

              <button
                onClick={handleDeleteAccount}
                disabled={!canDelete || isDeleting}
                className="mt-4 rounded-2xl bg-red-500 px-5 py-3 text-sm font-bold text-white hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? "Deleting Account..." : "Delete Account"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "subscription" && (
          <div className="mt-6 space-y-5">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Current Plan
              </p>

              <p className="mt-2 text-2xl font-bold text-white">
                {isPremium ? "Premium" : "Free"}
              </p>

              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Manage billing, payment method, invoices, cancellation, or upgrades through Stripe.
              </p>

              <button
                onClick={handleManageSubscription}
                disabled={isManagingSubscription}
                className="mt-5 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-[#0F172A] hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isManagingSubscription ? "Opening..." : "Manage Subscription"}
              </button>
            </div>

            {!isPremium && (
              <div className="rounded-2xl border border-[#7C8CFF]/30 bg-[#7C8CFF]/10 p-5">
                <p className="text-sm font-semibold text-[#DDE2FF]">
                  You are currently on the free plan.
                </p>

                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  Once Stripe checkout is added, this section can route free users to the upgrade checkout flow.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

