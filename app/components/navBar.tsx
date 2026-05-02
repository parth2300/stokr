"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { supabase } from "../lib/supabase"
import StockSearchBar from "./stockSearchBar"

export default function NavBar({ showSearch = false }: { showSearch?: boolean }) {
  const [username, setUsername] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser()
      const user = data.user

      if (user) {
        setUsername(user.user_metadata?.username || user.email || "Account")
      }
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
    setMenuOpen(false)
    window.location.href = "/"
  }

  return (
    <nav className="flex items-center justify-between">
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
        <a href="/pricing" className="rounded-xl px-4 py-2 hover:bg-black/5">Pricing</a>
        <a href="#" className="rounded-xl px-4 py-2 hover:bg-black/5">News</a>
        <a href="/about" className="rounded-xl px-4 py-2 hover:bg-black/5">About</a>

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
              <div className="absolute right-0 mt-2 w-36 rounded-xl bg-white p-2 text-black shadow-xl">
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