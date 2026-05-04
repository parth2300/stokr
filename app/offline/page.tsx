import Link from "next/link"

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-[#0F172A] text-white">
      <section className="relative flex min-h-screen items-center justify-center px-6 py-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_18%,rgba(255,138,101,0.22),transparent_38%),radial-gradient(circle_at_82%_70%,rgba(124,157,255,0.28),transparent_48%)]" />
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 w-full max-w-xl rounded-[30px] border border-[#7C9DFF]/40 bg-white/[0.045] p-8 text-center shadow-[0_0_24px_rgba(124,157,255,0.12)] backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#7C9DFF]">
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