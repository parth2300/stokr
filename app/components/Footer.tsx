import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-[#222120] bg-[#0C0C0C]">
      <div className="grid gap-8 border-b border-[#222120] p-6 sm:p-10 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] lg:p-12">
        <div className="min-w-0 lg:pr-10">
          <Link href="/" className="editorial-logo mb-4 block text-2xl">
            stokr
          </Link>
          <p className="mb-5 max-w-md text-[11px] leading-[1.75] text-[#9A9690]">
            The research desk for SEC filing intelligence. Source-backed briefs,
            risk context, and transparent research trails for investors who want
            less noise.
          </p>
          <span className="font-mono text-[9px] uppercase tracking-[0.10em] text-[#3E3D3A]">
            v1.0.0 / Vol. I / Issue No. 01
          </span>
        </div>

        <FooterColumn
          title="Research"
          links={[
            ["Blog", "/blog"],
            ["Compare", "/compare"],
            ["Resources", "/resources"],
            ["Glossary", "/glossary"],
          ]}
        />
        <FooterColumn
          title="Product"
          links={[
            ["Pricing", "/pricing"],
            ["About", "/about"],
            ["Research Tracker", "/watchlist"],
          ]}
        />
        <FooterColumn
          title="Legal"
          links={[
            ["Terms", "/terms"],
            ["Privacy", "/privacy"],
          ]}
        />

        <div>
          <div className="mb-4 border-b border-[#222120] pb-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[#3E3D3A]">
            Connect
          </div>
          <div className="grid gap-2.5">
            <a
              href="mailto:stokrsupport@stokr.live"
              className="break-all text-[11px] tracking-[0.02em] text-[#9A9690] transition hover:text-[#F0EDE6]"
            >
              stokrsupport@stokr.live
            </a>
            <a
              href="https://safaraj.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] tracking-[0.02em] text-[#9A9690] transition hover:text-[#F0EDE6]"
            >
              safaraj.com
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 px-6 py-4 font-mono text-[9px] uppercase tracking-[0.10em] text-[#3E3D3A] sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-12">
        <span>© MMXXVI stokr / Research Intelligence</span>
        <span>stokr provides informational research tools only. Not financial advice.</span>
        <span>SEC Filing Context</span>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: [string, string][]
}) {
  return (
    <div>
      <div className="mb-4 border-b border-[#222120] pb-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[#3E3D3A]">
        {title}
      </div>
      <div className="grid gap-2.5">
        {links.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className="text-[11px] tracking-[0.02em] text-[#9A9690] transition hover:text-[#F0EDE6]"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  )
}
