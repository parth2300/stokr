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
                            <p className="stokr-kicker mb-2 text-center">
                                Account recovery
                            </p>

                            <h1 className="mb-3 text-center text-4xl font-semibold italic">
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
                                disabled={isLoading}
                                className="stokr-button-primary w-full"
                            >
                                {isLoading ? "Sending..." : "Send reset link"}
                            </button>

                            <Link
                                href="/login"
                                className="mt-4 block text-center font-mono text-xs font-medium uppercase tracking-[0.14em] text-[#D63C2F] hover:text-[#F0EDE6]"
                            >
                                Back to login
                            </Link>
                        </form>

                        <div className="text-center lg:text-left">
                            <p className="stokr-kicker">Secure access</p>
                            <h2 className="mx-auto mt-4 max-w-xl text-5xl font-semibold italic leading-[0.98] tracking-normal sm:text-6xl lg:mx-0">
                                Get back to your stock research workspace.
                            </h2>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
