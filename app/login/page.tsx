"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import NavBar from "../components/navBar"
import { supabase } from "../lib/supabase"
import { validateSignup } from "../lib/validateSignup"

const TERMS_VERSION = "2026-05-04"

export default function LoginPage() {
    const router = useRouter()

    const [mode, setMode] = useState<"login" | "signup">("login")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [identifier, setIdentifier] = useState("")
    const [password, setPassword] = useState("")
    const [acceptedTerms, setAcceptedTerms] = useState(false)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            if (mode === "signup") {
                const cleanedUsername = username.trim()
                const cleanedEmail = email.trim().toLowerCase()

                const validationError = validateSignup(
                    cleanedUsername,
                    cleanedEmail,
                    password
                )

                if (validationError) {
                    setError(validationError)
                    return
                }

                if (!acceptedTerms) {
                    setError("You must accept the Terms of Service to create an account.")
                    return
                }

                const { data: existingUsername, error: usernameCheckError } =
                    await supabase
                        .from("profiles")
                        .select("username")
                        .eq("username", cleanedUsername)
                        .maybeSingle()

                if (usernameCheckError) {
                    setError(usernameCheckError.message)
                    return
                }

                if (existingUsername) {
                    setError("Username is already taken")
                    return
                }

                const acceptedTermsAt = new Date().toISOString()

                const { data, error: signUpError } = await supabase.auth.signUp({
                    email: cleanedEmail,
                    password,
                    options: {
                        data: {
                            username: cleanedUsername,
                            accepted_terms: true,
                            accepted_terms_at: acceptedTermsAt,
                            accepted_terms_version: TERMS_VERSION,
                        },
                    },
                })

                if (signUpError) {
                    setError(signUpError.message)
                    return
                }

                if (!data.user) {
                    setError("Could not create account")
                    return
                }

                const { error: profileError } = await supabase
                    .from("profiles")
                    .insert({
                        id: data.user.id,
                        username: cleanedUsername,
                        email: cleanedEmail,
                        accepted_terms: true,
                        accepted_terms_at: acceptedTermsAt,
                        accepted_terms_version: TERMS_VERSION,
                    })

                if (profileError) {
                    setError(profileError.message)
                    return
                }

                router.push("/")
                return
            }

            let loginEmail = identifier.trim()

            if (!loginEmail) {
                setError("Username or email is required")
                return
            }

            if (!password) {
                setError("Password is required")
                return
            }

            if (!identifier.includes("@")) {
                const { data, error: usernameError } = await supabase
                    .from("profiles")
                    .select("email")
                    .eq("username", identifier.trim())
                    .maybeSingle()

                if (usernameError || !data) {
                    setError("Username not found")
                    return
                }

                loginEmail = data.email
            }

            const { error: loginError } = await supabase.auth.signInWithPassword({
                email: loginEmail,
                password,
            })

            if (loginError) {
                setError(loginError.message)
                return
            }

            router.push("/")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    function switchMode() {
        setMode(mode === "signup" ? "login" : "signup")
        setError("")
        setPassword("")
        setAcceptedTerms(false)
    }

    return (
        <main className="min-h-screen overflow-hidden bg-[#0F172A] text-white">
            <section className="relative min-h-screen px-6 py-5 md:px-10 lg:px-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_18%,rgba(255,138,101,0.34),transparent_38%),radial-gradient(circle_at_82%_70%,rgba(124,157,255,0.34),transparent_48%),radial-gradient(circle_at_32%_48%,rgba(124,157,255,0.12),transparent_45%)]" />
                <div className="absolute inset-0 bg-black/10" />

                <div className="relative z-10 mx-auto max-w-7xl">
                    <NavBar />

                    <div className="grid min-h-[calc(100vh-88px)] grid-cols-1 items-center gap-16 lg:grid-cols-2">
                        <form
                            onSubmit={handleSubmit}
                            className="mx-auto w-full max-w-sm rounded-[28px] border border-[#7C9DFF]/70 bg-white px-8 py-8 text-black shadow-[0_0_18px_rgba(124,157,255,0.18)]"
                        >
                            <h1 className="mb-6 text-center text-xl font-semibold">
                                {mode === "signup" ? "Sign Up" : "Login"}
                            </h1>

                            {mode === "signup" ? (
                                <>
                                    <input
                                        placeholder="Username"
                                        value={username}
                                        onChange={(event) => setUsername(event.target.value)}
                                        required
                                        className="mb-4 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#7C9DFF]"
                                    />

                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        required
                                        className="mb-4 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#7C9DFF]"
                                    />
                                </>
                            ) : (
                                <input
                                    placeholder="Username or Email"
                                    value={identifier}
                                    onChange={(event) => setIdentifier(event.target.value)}
                                    required
                                    className="mb-4 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#7C9DFF]"
                                />
                            )}

                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                                className="mb-4 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#7C9DFF]"
                            />

                            {mode === "signup" && (
                                <label className="mb-4 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={acceptedTerms}
                                        onChange={(event) =>
                                            setAcceptedTerms(event.target.checked)
                                        }
                                        className="mt-1 h-4 w-4 shrink-0"
                                    />

                                    <span>
                                        I agree to the{" "}
                                        <Link
                                            href="/terms"
                                            target="_blank"
                                            className="font-semibold text-[#4F73FF] hover:text-[#2447D8]"
                                        >
                                            Terms of Service
                                        </Link>
                                        . I understand that stokr provides informational
                                        research only and does not provide financial,
                                        investment, or trading advice.
                                    </span>
                                </label>
                            )}

                            {error && (
                                <p className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={
                                    isLoading || (mode === "signup" && !acceptedTerms)
                                }
                                className="w-full rounded-xl bg-[#0F172A] px-4 py-3 font-semibold text-white hover:bg-[#1E293B] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isLoading
                                    ? mode === "signup"
                                        ? "Creating Account..."
                                        : "Logging In..."
                                    : mode === "signup"
                                      ? "Create Account"
                                      : "Login"}
                            </button>

                            <button
                                type="button"
                                onClick={switchMode}
                                className="mt-4 w-full text-sm text-slate-600 hover:text-black"
                            >
                                {mode === "signup"
                                    ? "Already have an account? Login"
                                    : "Need an account? Sign up"}
                            </button>
                        </form>

                        <div className="text-center lg:text-left">
                            <h2 className="max-w-xl text-center text-5xl font-light leading-tight tracking-wide sm:text-3xl lg:text-5xl">
                                Get instant, clear answers from complex filings—no digging, no guesswork.
                                See what actually changed, spot the risks faster, and make smarter decisions in seconds.
                            </h2>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}