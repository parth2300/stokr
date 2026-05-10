import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import NavBar from "@/app/components/navBar"
import { resources } from "@/app/lib/resources"
import ResourceViewTracker from "../ResourceViewTracker"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://stokr.live"

type ResourcePageProps = {
  params: Promise<{ slug: string }>
}

function getResource(slug: string) {
  return resources.find((resource) => resource.slug === slug)
}

export function generateStaticParams() {
  return resources.map((resource) => ({ slug: resource.slug }))
}

export async function generateMetadata({
  params,
}: ResourcePageProps): Promise<Metadata> {
  const { slug } = await params
  const resource = getResource(slug)

  if (!resource) {
    return {
      title: "Resources | stokr AI Stock Research",
    }
  }

  const url = `${siteUrl}/resources/${resource.slug}`

  return {
    title: `${resource.title} | stokr Resources`,
    description: resource.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${resource.title} | stokr Resources`,
      description: resource.description,
      url,
      siteName: "stokr",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${resource.title} | stokr Resources`,
      description: resource.description,
    },
  }
}

export default async function ResourceDetailPage({ params }: ResourcePageProps) {
  const { slug } = await params
  const resource = getResource(slug)

  if (!resource) {
    notFound()
  }

  return (
    <main className="stokr-page">
      <ResourceViewTracker slug={resource.slug} />
      <section className="stokr-shell">
        <div className="stokr-bg" />

        <div className="stokr-container">
          <NavBar showSearch />

          <article className="mx-auto max-w-3xl py-12 sm:py-16">
            <Link href="/resources" className="text-sm font-semibold text-[#7C9DFF] hover:text-white">
              Back to resources
            </Link>

            <div className="mt-8 flex flex-wrap items-center gap-2 text-xs font-medium text-[#A3AAB8]">
              <span className="rounded-full border border-[#7C9DFF]/25 bg-[#7C9DFF]/10 px-3 py-1 text-[#DDE2FF]">
                {resource.category}
              </span>
              <span>{resource.readTime}</span>
            </div>

            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
              {resource.title}
            </h1>
            <p className="mt-5 text-lg leading-8 text-[#A3AAB8]">
              {resource.description}
            </p>

            <div className="mt-10 space-y-9">
              {resource.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-2xl font-bold text-white">{section.heading}</h2>
                  <div className="mt-4 space-y-4 text-base leading-8 text-slate-300">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  {section.bullets && (
                    <ul className="mt-5 space-y-3 text-base leading-7 text-slate-300">
                      {section.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="rounded-xl border border-white/[0.08] bg-[#11141C] px-4 py-3"
                        >
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            <section className="stokr-card-muted mt-12 p-5">
              <p className="text-sm leading-6 text-slate-300">
                stokr provides informational research tools only and does not provide financial advice.
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-bold text-white">Related links</h2>
              <div className="mt-4 grid gap-3">
                {resource.relatedLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-xl border border-white/[0.08] bg-[#11141C] p-4 text-sm font-semibold text-[#DDE2FF] transition hover:border-[#7C9DFF]/35 hover:bg-[#151923]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </section>
          </article>
        </div>
      </section>
    </main>
  )
}
