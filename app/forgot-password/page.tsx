"use client"

import Link from "next/link"
import { useState } from "react"
import NavBar from "../components/navBar"
import { supabase } from "../lib/supabase"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError("")
        setSuccess("")
        setIsLoading(true)

        try {
            const siteUrl =
                process.env.NEXT_PUBLIC_SITE_URL || window.location.origin

            const { error: resetError } =
                await supabase.auth.resetPasswordForEmail(email.trim(), {
                    redirectTo: `${siteUrl}/reset-password`,
                })

            if (resetError) {
                setError(resetError.message)
                return
            }

            setSuccess(
                "If an account exists for that email, a reset link has been sent."
            )
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

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
                            <p className="mb-2 text-center text-xs font-medium uppercase tracking-[0.18em] text-[#7C9DFF]">
                                Account recovery
                            </p>

                            <h1 className="mb-3 text-center text-2xl font-semibold">
                                Forgot password?
                            </h1>

                            <p className="mb-6 text-center text-sm leading-6 text-[#A3AAB8]">
                                Enter your email and we will send a reset link if
                                the account exists.
                            </p>

                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                                className="mb-4 w-full rounded-lg border border-white/[0.10] bg-[#0D1017] px-4 py-3 text-white outline-none placeholder:text-[#6F7685] focus:border-[#7C9DFF]"
                            />

                            {error && (
                                <p className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
                                    {error}
                                </p>
                            )}

                            {success && (
                                <p className="mb-4 rounded-xl border border-[#7C9DFF]/25 bg-[#7C9DFF]/10 px-3 py-2 text-sm text-[#D7DEFF]">
                                    {success}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="stokr-button-primary w-full"
                            >
                                {isLoading ? "Sending..." : "Send reset link"}
                            </button>

                            <Link
                                href="/login"
                                className="mt-4 block text-center text-sm font-medium text-[#7C9DFF] hover:text-white"
                            >
                                Back to login
                            </Link>
                        </form>

                        <div className="text-center lg:text-left">
                            <p className="stokr-kicker">Secure access</p>
                            <h2 className="mx-auto mt-4 max-w-xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:mx-0">
                                Get back to your stock research workspace.
                            </h2>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
