"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { supabase } from "../lib/supabase"
import StockSearchBar from "./stockSearchBar"
import { isUserPremium, PremiumProfile } from "../lib/premium"

type Profile = PremiumProfile & {
  id: string
  username?: string | null
  email?: string | null
}

export default function NavBar({ showSearch = false }: { showSearch?: boolean }) {
  const [username, setUsername] = useState<string | null>(null)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const accountMenuRef = useRef<HTMLDivElement | null>(null)
  const mobileMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser()
      const user = data.user

      if (!user) {
        setUsername(null)
        setIsSignedIn(false)
        setIsPremium(false)
        return
      }

      setIsSignedIn(true)
      setUsername(user.user_metadata?.username || user.email || "Account")

      const { data: profileData } = await supabase
        .from("profiles")
        .select(
          "id, username, email, plan, access_tier, is_premium_override, premium_override_until, subscription_status, subscription_current_period_end"
        )
        .eq("id", user.id)
        .maybeSingle()

      const profile = profileData as Profile | null

      setIsPremium(isUserPremium(profile))
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

  async function handleLogout() {
    await supabase.auth.signOut()
    setUsername(null)
    setIsSignedIn(false)
    setIsPremium(false)
    setAccountMenuOpen(false)
    setMobileMenuOpen(false)
    window.location.href = "/"
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false)
  }

  return (
    <nav className="relative flex w-full items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <div className="h-8 w-12">
          <svg viewBox="0 0 64 40" className="h-full w-full" fill="none">
            <path d="M2 32 L20 12 L34 28 L54 4" stroke="#22C55E" strokeWidth="2" />
            <path d="M47 4 H54 V11" stroke="#22C55E" strokeWidth="2" />
            <path d="M20 12 L34 28" stroke="#EF4444" strokeWidth="2" />
          </svg>
        </div>
        <span className="text-2xl font-bold tracking-tight text-white">stokr</span>
      </Link>

      {/* Desktop nav */}
      <div className="hidden items-center gap-8 rounded-2xl bg-white/85 px-4 py-1.5 text-sm text-black shadow-lg md:flex">
        {isSignedIn && isPremium && (
          <Link href="/dashboard" className="rounded-xl px-4 py-2 hover:bg-black/5">
            Dashboard
          </Link>
        )}

        {isSignedIn && (
          <Link href="/watchlist" className="rounded-xl px-4 py-2 hover:bg-black/5">
            Watchlist
          </Link>
        )}

        {!isPremium && (
          <Link href="/pricing" className="rounded-xl px-4 py-2 hover:bg-black/5">
            Pricing
          </Link>
        )}

        <a href="#" className="rounded-xl px-4 py-2 hover:bg-black/5">
          News
        </a>

        <Link href="/about" className="rounded-xl px-4 py-2 hover:bg-black/5">
          About
        </Link>

        {showSearch && <StockSearchBar variant="nav" />}

        {username ? (
          <div className="relative" ref={accountMenuRef}>
            <button
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              className="rounded-2xl bg-black/70 px-6 py-2 text-white hover:bg-black/80"
            >
              {username}
            </button>

            {accountMenuOpen && (
              <div className="absolute right-0 z-50 mt-2 w-36 rounded-xl bg-white p-2 text-black shadow-xl">
                <button
                  onClick={handleLogout}
                  className="w-full rounded-lg px-4 py-2 text-left hover:bg-slate-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-2xl bg-black/70 px-6 py-2 text-white hover:bg-black/80"
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile nav */}
      <div className="md:hidden" ref={mobileMenuRef}>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white shadow-lg backdrop-blur hover:bg-white/15"
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
          <div className="absolute right-0 top-14 z-50 w-72 rounded-3xl border border-white/10 bg-black/95 p-4 text-white shadow-2xl backdrop-blur">
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

              <a
                href="#"
                onClick={closeMobileMenu}
                className="rounded-2xl px-4 py-3 text-sm hover:bg-white/10"
              >
                News
              </a>

              <Link
                href="/about"
                onClick={closeMobileMenu}
                className="rounded-2xl px-4 py-3 text-sm hover:bg-white/10"
              >
                About
              </Link>

              <div className="mt-2 border-t border-white/10 pt-3">
                {username ? (
                  <>
                    <div className="mb-2 rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/80">
                      {username}
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full rounded-2xl bg-white px-4 py-3 text-left text-sm font-semibold text-black hover:bg-white/90"
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
  )
}