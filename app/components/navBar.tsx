"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { supabase } from "../lib/supabase"
import StockSearchBar from "./stockSearchBar"
import { isUserPremium, PremiumProfile } from "../lib/premium"
import AccountSettingsModal from "./account/AccountSettingsModal"

type Profile = PremiumProfile & {
  id: string
  username?: string | null
  email?: string | null
}

export default function NavBar({ showSearch = false }: { showSearch?: boolean }) {
  const [username, setUsername] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const accountMenuRef = useRef<HTMLDivElement | null>(null)
  const mobileMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser()
      const user = data.user

      if (!user) {
        setUsername(null)
        setEmail(null)
        setIsSignedIn(false)
        setIsPremium(false)
        return
      }

      setIsSignedIn(true)
      setUsername(user.user_metadata?.username || user.email || "Account")
      setEmail(user.email || null)

      const { data: profileData } = await supabase
        .from("profiles")
        .select(
          "id, username, email, plan, access_tier, is_premium_override, premium_override_until, subscription_status, subscription_current_period_end"
        )
        .eq("id", user.id)
        .maybeSingle()

      const profile = profileData as Profile | null

      setIsPremium(isUserPremium(profile))
      setUsername(profile?.username || user.user_metadata?.username || user.email || "Account")
      setEmail(profile?.email || user.email || null)
    }

    loadUser()

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadUser()
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node

      if (accountMenuRef.current && !accountMenuRef.current.contains(target)) {
        setAccountMenuOpen(false)
      }

      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setAccountMenuOpen(false)
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    setUsername(null)
    setEmail(null)
    setIsSignedIn(false)
    setIsPremium(false)
    setAccountMenuOpen(false)
    setAccountSettingsOpen(false)
    setMobileMenuOpen(false)
    window.location.href = "/"
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false)
  }

  return (
    <>
    <nav className="relative flex w-full items-center justify-between gap-4 rounded-xl border border-white/[0.08] bg-[#08090D]/92 px-4 py-3.5 sm:px-5">
      <Link href="/" className="flex shrink-0 items-center gap-2">
        <div className="h-8 w-11">
          <svg viewBox="0 0 64 40" className="h-full w-full" fill="none">
            <path d="M2 32 L20 12 L34 28 L54 4" stroke="#22C55E" strokeWidth="2" />
            <path d="M47 4 H54 V11" stroke="#22C55E" strokeWidth="2" />
            <path d="M20 12 L34 28" stroke="#EF4444" strokeWidth="2" />
          </svg>
        </div>
        <span className="text-2xl font-bold tracking-tight text-white">stokr</span>
      </Link>

      {/* Desktop nav */}
      <div className="hidden min-w-0 items-center gap-1 text-sm text-[#A3AAB8] lg:flex">
        {isSignedIn && isPremium && (
          <Link href="/dashboard" className="rounded-md px-3 py-2 hover:bg-white/[0.06] hover:text-white">
            Dashboard
          </Link>
        )}

        {isSignedIn && (
          <Link href="/watchlist" className="rounded-md px-3 py-2 hover:bg-white/[0.06] hover:text-white">
            Watchlist
          </Link>
        )}

        {!isPremium && (
          <Link href="/pricing" className="rounded-md px-3 py-2 hover:bg-white/[0.06] hover:text-white">
            Pricing
          </Link>
        )}

        <Link href="/about" className="rounded-md px-3 py-2 hover:bg-white/[0.06] hover:text-white">
          About
        </Link>

        <Link href="/blog" className="rounded-md px-3 py-2 hover:bg-white/[0.06] hover:text-white">
          Blog
        </Link>

        {showSearch && <StockSearchBar variant="nav" />}

        {username ? (
          <div className="relative" ref={accountMenuRef}>
            <button
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              className="max-w-[180px] truncate rounded-md border border-white/[0.12] bg-[#151923] px-3 py-2 font-medium text-white hover:bg-[#191E29]"
            >
              {username}
            </button>

            {accountMenuOpen && (
              <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-white/[0.10] bg-[#11141C] p-2 text-white shadow-xl">
                <div className="border-b border-white/[0.08] px-3 py-2">
                  <p className="truncate text-sm font-medium text-white">
                    {username || "Account"}
                  </p>
                  {email && (
                    <p className="mt-0.5 truncate text-xs text-[#6F7685]">
                      {email}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => {
                    setAccountMenuOpen(false)
                    setAccountSettingsOpen(true)
                  }}
                  className="mt-1 w-full rounded-md px-3 py-2.5 text-left text-sm text-[#A3AAB8] hover:bg-white/[0.06] hover:text-white"
                >
                  Manage account
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full rounded-md px-3 py-2.5 text-left text-sm text-[#A3AAB8] hover:bg-white/[0.06] hover:text-white"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-md bg-white px-4 py-2 font-medium text-[#08090D] hover:bg-[#E9ECF5]"
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile nav */}
      <div className="lg:hidden" ref={mobileMenuRef}>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.12] bg-[#151923] text-white hover:bg-[#191E29]"
        >
          <span className="sr-only">Open navigation menu</span>

          <div className="flex flex-col gap-1.5">
            <span
              className={`h-0.5 w-5 rounded-full bg-white transition ${
                mobileMenuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-5 rounded-full bg-white transition ${
                mobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-0.5 w-5 rounded-full bg-white transition ${
                mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>

        {mobileMenuOpen && (
          <div className="absolute right-0 top-14 z-50 w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-white/[0.10] bg-[#0B0D12] p-3 text-white shadow-2xl">
            <div className="flex flex-col gap-2">
              {showSearch && (
                <div className="mb-2">
                  <StockSearchBar variant="nav" />
                </div>
              )}

              {isSignedIn && isPremium && (
                <Link
                  href="/dashboard"
                  onClick={closeMobileMenu}
                  className="rounded-2xl px-4 py-3 text-sm hover:bg-white/10"
                >
                  Dashboard
                </Link>
              )}

              {isSignedIn && (
                <Link
                  href="/watchlist"
                  onClick={closeMobileMenu}
                  className="rounded-2xl px-4 py-3 text-sm hover:bg-white/10"
                >
                  Watchlist
                </Link>
              )}

              {!isPremium && (
                <Link
                  href="/pricing"
                  onClick={closeMobileMenu}
                  className="rounded-2xl px-4 py-3 text-sm hover:bg-white/10"
                >
                  Pricing
                </Link>
              )}

              <Link
                href="/about"
                onClick={closeMobileMenu}
                className="rounded-2xl px-4 py-3 text-sm hover:bg-white/10"
              >
                About
              </Link>

              <Link
                href="/blog"
                onClick={closeMobileMenu}
                className="rounded-2xl px-4 py-3 text-sm hover:bg-white/10"
              >
                Blog
              </Link>

              <div className="mt-2 border-t border-white/10 pt-3">
                {username ? (
                  <>
                    <div className="mb-2 rounded-lg border border-white/[0.08] bg-[#151923] px-4 py-3 text-sm text-white/80">
                      <p className="truncate font-medium text-white">{username}</p>
                      {email && (
                        <p className="mt-1 truncate text-xs text-[#6F7685]">
                          {email}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setMobileMenuOpen(false)
                        setAccountSettingsOpen(true)
                      }}
                      className="mb-2 w-full rounded-lg border border-white/[0.10] bg-[#151923] px-4 py-3 text-left text-sm font-medium text-white hover:bg-[#191E29]"
                    >
                      Manage account
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full rounded-lg bg-white px-4 py-3 text-left text-sm font-semibold text-black hover:bg-white/90"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="block rounded-2xl bg-white px-4 py-3 text-center text-sm font-semibold text-black hover:bg-white/90"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
    <AccountSettingsModal
      isOpen={accountSettingsOpen}
      onClose={() => setAccountSettingsOpen(false)}
      username={username}
      email={email}
      isPremium={isPremium}
    />
    </>
  )
}

