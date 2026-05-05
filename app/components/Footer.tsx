import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0F172A] px-6 py-6 text-sm text-slate-400 md:px-10 lg:px-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p>
            stokr provides informational stock research only and does not provide
            financial, investment, or trading advice.
          </p>

          <p>
            Powered by{" "}
            <a
              href="https://safaraj.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#7C9DFF] hover:text-blue-200"
            >
              safaraj.com
            </a>
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link href="/terms" className="hover:text-white">
            Terms
          </Link>

          <Link href="/privacy" className="hover:text-white">
            Privacy
          </Link>

          <Link href="/pricing" className="hover:text-white">
            Pricing
          </Link>
        </div>
      </div>
    </footer>
  )
}