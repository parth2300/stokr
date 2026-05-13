"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import NavBar from "../components/navBar"
import { supabase } from "../lib/supabase"
import { validateSignup } from "../lib/validateSignup"
import { trackLogin, trackSignUp } from "../lib/analytics"

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

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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

                trackSignUp("email")
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

            trackLogin("email")
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
        <main className="stokr-page">
            <section className="stokr-shell">
                <div className="stokr-bg" />

                <div className="stokr-container">
                    <NavBar />

                    <div className="grid min-h-[calc(100vh-96px)] grid-cols-1 items-center gap-10 py-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:py-14">
                        <form
                            onSubmit={handleSubmit}
                            className="stokr-card mx-auto w-full max-w-md p-6 text-white sm:p-8"
                        >
                            <p className="stokr-kicker text-center">
                                Account
                            </p>

                            <h1 className="mt-3 text-center text-2xl font-semibold tracking-tight">
                                {mode === "signup" ? "Sign Up" : "Login"}
                            </h1>

                            <p className="mb-6 mt-2 text-center text-sm leading-6 text-[#94A3B8]">
                                {mode === "signup"
                                    ? "Create an account to save research and revisit companies."
                                    : "Return to your source-backed research workspace."}
                            </p>

                            {mode === "signup" ? (
                                <>
                                    <input
                                        placeholder="Username"
                                        value={username}
                                        onChange={(event) => setUsername(event.target.value)}
                                        required
                                        className="stokr-input mb-4"
                                    />

                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        required
                                        className="stokr-input mb-4"
                                    />
                                </>
                            ) : (
                                <input
                                    placeholder="Username or Email"
                                    value={identifier}
                                    onChange={(event) => setIdentifier(event.target.value)}
                                    required
                                    className="stokr-input mb-4"
                                />
                            )}

                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                                className="stokr-input mb-4"
                            />

                            {mode === "login" && (
                                <div className="mb-4 text-right">
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm font-medium text-[#7C9DFF] hover:text-white"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                            )}

                            {mode === "signup" && (
                                <label className="mb-4 flex items-start gap-3 rounded-lg border border-white/[0.10] bg-[#0D1117] p-4 text-sm text-[#A3AAB8]">
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
                                            className="font-semibold text-[#9AA6FF] hover:text-white"
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
                                <p className="stokr-status-error mb-4">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={
                                    isLoading || (mode === "signup" && !acceptedTerms)
                                }
                                className="stokr-button-primary w-full"
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
                                className="mt-4 w-full text-sm text-[#A3AAB8] hover:text-white"
                            >
                                {mode === "signup"
                                    ? "Already have an account? Login"
                                    : "Need an account? Sign up"}
                            </button>
                        </form>

                        <div className="text-center lg:text-left">
                            <p className="stokr-kicker">Research workspace</p>
                            <h2 className="mx-auto mt-4 max-w-xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:mx-0">
                                Clear stock research without digging through every filing.
                            </h2>
                            <div className="mx-auto mt-6 grid max-w-xl gap-3 text-left lg:mx-0">
                                {[
                                    "Save companies to your Research Tracker.",
                                    "Reopen recent source-backed briefs.",
                                    "Keep filing context and risk notes organized.",
                                ].map((item) => (
                                    <div
                                        key={item}
                                        className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-[#CBD5E1]"
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
