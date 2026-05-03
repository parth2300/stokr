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
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

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
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
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
    setMenuOpen(false)
    window.location.href = "/"
  }

  return (
    <nav className="flex w-full items-center justify-between">
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
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-2xl bg-black/70 px-6 py-2 text-white hover:bg-black/80"
            >
              {username}
            </button>

            {menuOpen && (
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
    </nav>
  )
}