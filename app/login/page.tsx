"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import NavBar from "../components/navBar"
import { supabase } from "../lib/supabase"
import { validateSignup } from "../lib/validateSignup"

export default function LoginPage() {
    const router = useRouter()

    const [mode, setMode] = useState<"login" | "signup">("signup")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [identifier, setIdentifier] = useState("")
    const [password, setPassword] = useState("")
    const [acceptedTerms, setAcceptedTerms] = useState(false)
    const [error, setError] = useState("")

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault()
        setError("")

        try {
            if (mode === "signup") {
                const validationError = validateSignup(username, email, password)

                if (validationError) {
                    setError(validationError)
                    return
                }

                if (!acceptedTerms) {
                    setError("You must accept the terms and services")
                    return
                }

                const { data: existingUsername } = await supabase
                    .from("profiles")
                    .select("username")
                    .eq("username", username)
                    .maybeSingle()

                if (existingUsername) {
                    setError("Username is already taken")
                    return
                }

                const { data, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { username },
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

                const { error: profileError } = await supabase.from("profiles").insert({
                    id: data.user.id,
                    username,
                    email,
                })

                if (profileError) {
                    setError(profileError.message)
                    return
                }

                router.push("/")
            } else {
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
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong")
        }
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
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className="mb-4 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#7C9DFF]"
                                    />

                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="mb-4 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#7C9DFF]"
                                    />
                                </>
                            ) : (
                                <input
                                    placeholder="Username or Email"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    required
                                    className="mb-4 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#7C9DFF]"
                                />
                            )}

                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mb-4 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#7C9DFF]"
                            />

                            {mode === "signup" && (
                                <label className="mb-4 flex gap-3 text-sm text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={acceptedTerms}
                                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                                    />
                                    <span>
                                        I agree to the placeholder Terms and Services. Stokr provides
                                        informational analysis only and does not provide financial advice.
                                    </span>
                                </label>
                            )}

                            {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

                            <button className="w-full rounded-xl bg-[#0F172A] px-4 py-3 font-semibold text-white hover:bg-[#1E293B]">
                                {mode === "signup" ? "Create Account" : "Login"}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setMode(mode === "signup" ? "login" : "signup")
                                    setError("")
                                }}
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