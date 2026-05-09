import Link from "next/link"

export default function OfflinePage() {
  return (
    <main className="stokr-page">
      <section className="relative flex min-h-screen items-center justify-center px-6 py-10">
        <div className="stokr-bg" />
        <div className="absolute inset-0 bg-black/20" />

        <div className="stokr-card relative z-10 w-full max-w-xl p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#7C8CFF]">
            Offline
          </p>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight">
            stokr needs internet access
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            Stock prices, AI reports, watchlists, billing, and account features require a live connection.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-bold text-[#0F172A] hover:bg-blue-100"
          >
            Try Again
          </Link>
        </div>
      </section>
    </main>
  )
}
