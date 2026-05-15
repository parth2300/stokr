"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { useEffect, useId, useRef, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"
import StockSearchBar from "./stockSearchBar"
import { isUserPremium, PremiumProfile } from "../lib/premium"
import AccountSettingsModal from "./account/AccountSettingsModal"

type Profile = PremiumProfile & {
  id: string
  username?: string | null
  email?: string | null
}

function MobileSheetLink({
  href,
  onClick,
  children,
}: {
  href: string
  onClick: () => void
  children: ReactNode
}) {
  return (
    <Link href={href} prefetch={false} onClick={onClick} className="mobile-sheet-row">
      {children}
    </Link>
  )
}

export default function NavBar({ showSearch = false }: { showSearch?: boolean }) {
  const [username, setUsername] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileButtonVisible, setMobileButtonVisible] = useState(true)

  const accountMenuRef = useRef<HTMLDivElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const lastScrollYRef = useRef(0)
  const loadedProfileForRef = useRef<string | null>(null)
  const sheetId = useId()

  useEffect(() => {
    let isMounted = true

    async function loadUser(sessionUser?: User | null) {
      const user = sessionUser ?? null

      if (!user) {
        loadedProfileForRef.current = null
        if (!isMounted) return
        setUsername(null)
        setEmail(null)
        setIsSignedIn(false)
        setIsPremium(false)
        return
      }

      if (!isMounted) return
      setIsSignedIn(true)
      setUsername(user.user_metadata?.username || user.email || "Account")
      setEmail(user.email || null)

      if (loadedProfileForRef.current === user.id) return
      loadedProfileForRef.current = user.id

      const { data: profileData } = await supabase
        .from("profiles")
        .select(
          "id, username, email, plan, access_tier, is_premium_override, premium_override_until, subscription_status, subscription_current_period_end"
        )
        .eq("id", user.id)
        .maybeSingle()

      const profile = profileData as Profile | null

      if (!isMounted) return
      setIsPremium(isUserPremium(profile))
      setUsername(profile?.username || user.user_metadata?.username || user.email || "Account")
      setEmail(profile?.email || user.email || null)
    }

    supabase.auth.getSession().then(({ data }) => {
      loadUser(data.session?.user ?? null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      loadUser(session?.user ?? null)
    })

    return () => {
      isMounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node

      if (accountMenuRef.current && !accountMenuRef.current.contains(target)) {
        setAccountMenuOpen(false)
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

  useEffect(() => {
    if (!mobileMenuOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    function handleScroll() {
      if (mobileMenuOpen) {
        setMobileButtonVisible(true)
        return
      }

      const currentY = window.scrollY
      const lastY = lastScrollYRef.current

      if (currentY < 80) {
        setMobileButtonVisible(true)
      } else if (currentY > lastY + 24) {
        setMobileButtonVisible(false)
      } else if (currentY < lastY - 12) {
        setMobileButtonVisible(true)
      }

      lastScrollYRef.current = currentY
    }

    lastScrollYRef.current = window.scrollY
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [mobileMenuOpen])

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
    setMobileButtonVisible(true)
  }

  return (
    <>
    <nav className="editorial-nav">
      <div className="flex min-w-0 items-center gap-8">
        <Link href="/" prefetch={false} className="editorial-logo shrink-0">stokr</Link>

        <div className="hidden min-w-0 items-center gap-6 xl:flex">
          <Link href="/" prefetch={false} className="editorial-nav-link">Research</Link>
          <Link href="/compare" prefetch={false} className="editorial-nav-link">Compare</Link>
          {!isPremium && (
            <Link href="/pricing" prefetch={false} className="editorial-nav-link">Pricing</Link>
          )}
          <Link href="/about" prefetch={false} className="editorial-nav-link">About</Link>
          <Link href="/blog" prefetch={false} className="editorial-nav-link">Blog</Link>
          {isSignedIn && isPremium && (
            <Link href="/dashboard" prefetch={false} className="editorial-nav-link">Desk</Link>
          )}
          {isSignedIn && (
            <Link href="/watchlist" prefetch={false} className="editorial-nav-link">Tracker</Link>
          )}
        </div>
      </div>

      <div className="editorial-nav-center">
        Vol. I / Issue No. 01 / SEC Intelligence
      </div>

      {/* Desktop nav */}
      <div className="hidden min-w-0 items-center justify-end gap-5 xl:flex">
        {showSearch && <StockSearchBar variant="nav" />}

        {username ? (
          <div className="relative" ref={accountMenuRef}>
            <button
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
            className="max-w-[180px] truncate font-mono text-[10px] uppercase tracking-[0.10em] text-[#9A9690] hover:text-[#F0EDE6]"
            >
              {username}
            </button>

            {accountMenuOpen && (
              <div className="absolute right-0 z-50 mt-2 w-60 border border-[#2E2D2A] bg-[#0C0C0C] p-2 text-[#F0EDE6]">
                <div className="border-b border-[#222120] px-3 py-2">
                  <p className="truncate text-sm font-medium text-white">
                    {username || "Account"}
                  </p>
                  {email && (
                    <p className="mt-0.5 truncate text-xs normal-case tracking-normal text-[#9A9690]">
                      {email}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => {
                    setAccountMenuOpen(false)
                    setAccountSettingsOpen(true)
                  }}
                  className="mt-1 w-full px-3 py-2.5 text-left text-xs text-[#9A9690] hover:bg-[#161616] hover:text-[#F0EDE6]"
                >
                  Manage account
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-2.5 text-left text-xs text-[#9A9690] hover:bg-[#161616] hover:text-[#F0EDE6]"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link href="/login" prefetch={false} className="editorial-nav-link">Log in</Link>
            <Link href="/login" prefetch={false} className="stokr-button-primary min-h-0 px-[18px] py-2">Start free</Link>
          </>
        )}
      </div>

      <div className="justify-self-end xl:hidden" />
    </nav>
    <button
      type="button"
      onClick={() => setMobileMenuOpen((current) => !current)}
      aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
      aria-expanded={mobileMenuOpen}
      aria-controls={sheetId}
      className={`mobile-floating-nav-button xl:hidden ${mobileMenuOpen ? "is-open" : ""} ${mobileButtonVisible || mobileMenuOpen ? "" : "is-hidden"}`}
    >
      <span className="sr-only">
        {mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
      </span>
      <span className="mobile-floating-nav-icon" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    </button>

    {mobileMenuOpen && (
      <button
        type="button"
        aria-label="Close navigation menu backdrop"
        className="mobile-nav-backdrop xl:hidden"
        onClick={closeMobileMenu}
      />
    )}

    <section
      id={sheetId}
      role="dialog"
      aria-modal="true"
      aria-hidden={!mobileMenuOpen}
      aria-label="Mobile navigation menu"
      className={`mobile-bottom-sheet xl:hidden ${mobileMenuOpen ? "is-open" : ""}`}
    >
      <div className="border-b border-[#222120] px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#3E3D3A]">
            Navigation
          </p>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeMobileMenu}
            aria-label="Close navigation menu"
            className="flex h-10 w-10 items-center justify-center border border-[#2E2D2A] bg-[#111111] text-[#F0EDE6] hover:bg-[#161616]"
          >
            <span className="text-xl leading-none" aria-hidden="true">X</span>
          </button>
        </div>

        <div className="mobile-bottom-sheet-search mt-4">
          <StockSearchBar variant="nav" wide onNavigate={closeMobileMenu} />
        </div>
      </div>

      <div className="grid">
        <MobileSheetLink href="/" onClick={closeMobileMenu}>Research</MobileSheetLink>
        <MobileSheetLink href="/compare" onClick={closeMobileMenu}>Compare</MobileSheetLink>
        <MobileSheetLink href="/about" onClick={closeMobileMenu}>About</MobileSheetLink>
        <MobileSheetLink href="/blog" onClick={closeMobileMenu}>Blog</MobileSheetLink>
        <MobileSheetLink href={isSignedIn && isPremium ? "/dashboard" : isSignedIn ? "/pricing" : "/login"} onClick={closeMobileMenu}>Desk</MobileSheetLink>
        <MobileSheetLink href={isSignedIn ? "/watchlist" : "/login"} onClick={closeMobileMenu}>Tracker</MobileSheetLink>
        {!isPremium && (
          <MobileSheetLink href="/pricing" onClick={closeMobileMenu}>Pricing</MobileSheetLink>
        )}
      </div>

      <div className="border-t border-[#222120] px-5 py-4">
        {username ? (
          <>
            <div className="mb-4 border border-[#222120] bg-[#111111] px-4 py-3">
              <p className="truncate text-sm font-medium text-[#F0EDE6]">{username}</p>
              {email && (
                <p className="mt-1 truncate text-xs normal-case tracking-normal text-[#9A9690]">
                  {email}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false)
                setAccountSettingsOpen(true)
              }}
              className="mobile-sheet-row"
            >
              Manage account
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false)
                setAccountSettingsOpen(true)
              }}
              className="mobile-sheet-row"
            >
              Delete account
            </button>
            <button type="button" onClick={handleLogout} className="mobile-sheet-row text-[#F0EDE6]">
              Log out
            </button>
          </>
        ) : (
          <div className="grid gap-3">
            <Link href="/login" prefetch={false} onClick={closeMobileMenu} className="mobile-sheet-row">
              Log in
            </Link>
            <Link
              href="/login"
              prefetch={false}
              onClick={closeMobileMenu}
              className="flex min-h-12 items-center justify-center bg-[#F0EDE6] px-4 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[#0C0C0C]"
            >
              Start free
            </Link>
          </div>
        )}
      </div>
    </section>
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

