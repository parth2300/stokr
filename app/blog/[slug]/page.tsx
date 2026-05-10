import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import NavBar from "@/app/components/navBar"
import { blogPosts } from "@/app/lib/blogPosts"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://stokr.live"

type BlogPostPageProps = {
  params: Promise<{ slug: string }>
}

function getPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug)
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)

  if (!post) {
    return {
      title: "Blog | stokr AI Stock Research",
    }
  }

  const url = `${siteUrl}/blog/${post.slug}`

  return {
    title: `${post.title} | stokr Blog`,
    description: post.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${post.title} | stokr Blog`,
      description: post.description,
      url,
      siteName: "stokr",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | stokr Blog`,
      description: post.description,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="stokr-page">
      <section className="stokr-shell">
        <div className="stokr-bg" />

        <div className="stokr-container">
          <NavBar showSearch />

          <article className="mx-auto max-w-3xl py-12 sm:py-16">
            <Link
              href="/blog"
              className="text-sm font-semibold text-[#7C9DFF] hover:text-white"
            >
              Back to blog
            </Link>

            <div className="mt-8 flex flex-wrap items-center gap-2 text-xs font-medium text-[#A3AAB8]">
              <span className="rounded-full border border-[#7C9DFF]/25 bg-[#7C9DFF]/10 px-3 py-1 text-[#DDE2FF]">
                {post.category}
              </span>
              <span>{post.readTime}</span>
              <span>{post.date}</span>
            </div>

            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
              {post.title}
            </h1>

            <p className="mt-5 text-lg leading-8 text-[#A3AAB8]">
              {post.description}
            </p>

            <div className="mt-10 space-y-9">
              {post.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-2xl font-bold text-white">
                    {section.heading}
                  </h2>

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
                stokr provides informational research tools only and does not
                provide financial advice.
              </p>
            </section>

            {post.relatedLinks.length > 0 && (
              <section className="mt-6">
                <h2 className="text-xl font-bold text-white">
                  Related reading
                </h2>

                <div className="mt-4 grid gap-3">
                  {post.relatedLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-xl border border-white/[0.08] bg-[#11141C] p-4 transition hover:border-[#7C9DFF]/35 hover:bg-[#151923]"
                    >
                      <p className="text-sm font-semibold text-[#DDE2FF]">
                        {link.label}
                      </p>

                      <p className="mt-1 text-sm leading-6 text-[#A3AAB8]">
                        {link.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <section className="stokr-card mt-6 p-5">
              <h2 className="text-xl font-bold text-white">
                Research a stock with stokr
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#A3AAB8]">
                Search a ticker to review filing summaries, financial context,
                risk factors, and bull vs bear cases.
              </p>

              <Link href="/" className="stokr-button-primary mt-5 inline-flex">
                Research a stock with stokr
              </Link>
            </section>
          </article>
        </div>
      </section>
    </main>
  )
}
