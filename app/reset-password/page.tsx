"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import NavBar from "../components/navBar"
import { supabase } from "../lib/supabase"

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [ready, setReady] = useState(false)
    const [isCheckingSession, setIsCheckingSession] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    useEffect(() => {
        let isMounted = true

        async function loadSession() {
            const { data } = await supabase.auth.getSession()

            if (isMounted) {
                setReady(Boolean(data.session))
                setIsCheckingSession(false)
            }
        }

        loadSession()

        const { data: listener } = supabase.auth.onAuthStateChange((event) => {
            if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
                setReady(true)
            }
        })

        return () => {
            isMounted = false
            listener.subscription.unsubscribe()
        }
    }, [])

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError("")
        setSuccess("")

        if (!ready) {
            setError("Open this page from the password reset email link.")
            return
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.")
            return
        }

        if (password !== confirmPassword) {
            setError("Passwords must match.")
            return
        }

        setIsLoading(true)

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password,
            })

            if (updateError) {
                setError(updateError.message)
                return
            }

            setSuccess("Password updated. You can now log in.")
            setPassword("")
            setConfirmPassword("")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    const showMissingSessionMessage = !isCheckingSession && !ready && !success

    return (
        <main className="stokr-page">
            <section className="stokr-shell">
                <div className="stokr-bg" />

                <div className="stokr-container">
                    <NavBar />

                    <div className="grid min-h-[calc(100vh-96px)] grid-cols-1 items-center gap-10 py-12 lg:grid-cols-[0.9fr_1.1fr]">
                        <form
                            onSubmit={handleSubmit}
                            className="stokr-card mx-auto w-full max-w-md p-6 text-white sm:p-8"
                        >
                            <p className="stokr-kicker mb-2 text-center">
                                Account security
                            </p>

                            <h1 className="mb-3 text-center text-4xl font-semibold italic">
                                Reset password
                            </h1>

                            <p className="mb-6 text-center text-sm leading-6 text-[#A3AAB8]">
                                Choose a new password for your stokr account.
                            </p>

                            {showMissingSessionMessage && (
                                <p className="mb-4 border border-[#2E2D2A] bg-[#111111] px-3 py-2 text-sm text-[#9A9690]">
                                    Open this page from the password reset email
                                    link.
                                </p>
                            )}

                            <input
                                type="password"
                                placeholder="New password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                minLength={8}
                                required
                                className="stokr-input mb-4"
                            />

                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(event) =>
                                    setConfirmPassword(event.target.value)
                                }
                                minLength={8}
                                required
                                className="stokr-input mb-4"
                            />

                            {error && (
                                <p className="stokr-status-error mb-4">
                                    {error}
                                </p>
                            )}

                            {success && (
                                <p className="stokr-status-success mb-4">
                                    {success}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={!ready || isLoading || Boolean(success)}
                                className="stokr-button-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isLoading ? "Updating..." : "Update password"}
                            </button>

                            {success ? (
                                <Link
                                    href="/login"
                                    className="mt-4 block text-center font-mono text-xs font-medium uppercase tracking-[0.14em] text-[#D63C2F] hover:text-[#F0EDE6]"
                                >
                                    Go to login
                                </Link>
                            ) : (
                                <Link
                                    href="/login"
                                    className="mt-4 block text-center font-mono text-xs font-medium uppercase tracking-[0.14em] text-[#D63C2F] hover:text-[#F0EDE6]"
                                >
                                    Back to login
                                </Link>
                            )}
                        </form>

                        <div className="text-center lg:text-left">
                            <p className="stokr-kicker">Protected research</p>
                            <h2 className="mx-auto mt-4 max-w-xl text-5xl font-semibold italic leading-[0.98] tracking-normal sm:text-6xl lg:mx-0">
                                Keep your account secure and your research close.
                            </h2>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
