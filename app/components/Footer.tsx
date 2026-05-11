import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#05070A] px-4 py-8 text-sm text-[#6F7685] sm:px-6 md:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]">
        <div className="min-w-0 space-y-2">
          <p className="text-lg font-bold text-white">stokr</p>
          <p className="max-w-xl leading-6">
            stokr provides informational research tools only and does not
            provide financial advice.
          </p>

          <p>
            Powered by{" "}
            <a
              href="https://safaraj.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#19C37D] hover:text-white"
            >
              safaraj.com
            </a>
          </p>
        </div>

        <div>
          <p className="font-semibold text-white">Research</p>
          <div className="mt-3 grid gap-2">
            <Link href="/blog" className="hover:text-white">
              Blog
            </Link>
            <Link href="/compare" className="hover:text-white">
              Compare Stocks
            </Link>
            <Link href="/resources" className="hover:text-white">
              Resources
            </Link>
            <Link href="/glossary" className="hover:text-white">
              Glossary
            </Link>
          </div>
        </div>

        <div>
          <p className="font-semibold text-white">Legal</p>
          <div className="mt-3 grid gap-2">
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

        <div>
          <p className="font-semibold text-white">Support</p>
          <div className="mt-3 grid gap-2">
            <a href="mailto:stokrsupport@stokr.live" className="break-all hover:text-white">
              stokrsupport@stokr.live
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

