import type { Metadata } from "next"
import Link from "next/link"
import NavBar from "../components/navBar"
import { resources } from "../lib/resources"

export const metadata: Metadata = {
  title: "Resources | stokr AI Stock Research",
  description:
    "Stock research checklists, templates, and beginner-friendly investing resources from stokr.",
}

export default function ResourcesPage() {
  return (
    <main className="stokr-page">
      <section className="stokr-shell">
        <div className="stokr-bg" />

        <div className="stokr-container">
          <NavBar showSearch />

          <section className="py-12 sm:py-16">
            <p className="stokr-kicker">Research Tools</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Stock Research Resources
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-[#A3AAB8] sm:text-lg">
              Simple checklists and frameworks for researching companies without the noise.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/compare" className="stokr-button-primary">
                Compare stocks
              </Link>
              <Link href="/glossary" className="stokr-button-secondary">
                Open glossary
              </Link>
            </div>
          </section>

          <section className="grid gap-5 pb-12 md:grid-cols-2 xl:grid-cols-3">
            {resources.map((resource) => (
              <Link
                key={resource.slug}
                href={`/resources/${resource.slug}`}
                className="stokr-card flex min-h-[250px] flex-col p-5 transition hover:border-[#7C9DFF]/35 hover:bg-[#151923]"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#A3AAB8]">
                  <span className="rounded-full border border-[#7C9DFF]/25 bg-[#7C9DFF]/10 px-3 py-1 text-[#DDE2FF]">
                    {resource.category}
                  </span>
                  <span>{resource.readTime}</span>
                </div>

                <h2 className="mt-5 text-xl font-bold leading-snug text-white">
                  {resource.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-[#A3AAB8]">
                  {resource.description}
                </p>
                <span className="mt-5 text-sm font-semibold text-[#7C9DFF]">
                  Open resource
                </span>
              </Link>
            ))}
          </section>

          <section className="stokr-card-muted mb-12 p-5">
            <p className="text-sm leading-6 text-slate-300">
              stokr provides informational research tools only and does not provide financial advice.
            </p>
          </section>
        </div>
      </section>
    </main>
  )
}
