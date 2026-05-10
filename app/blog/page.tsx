import type { Metadata } from "next"
import Link from "next/link"
import NavBar from "../components/navBar"
import { blogPosts } from "../lib/blogPosts"

export const metadata: Metadata = {
  title: "Blog | stokr AI Stock Research",
  description:
    "Read beginner-friendly stock research guides, SEC filing explainers, risk analysis breakdowns, and investing education from stokr.",
}

export default function BlogPage() {
  return (
    <main className="stokr-page">
      <section className="stokr-shell">
        <div className="stokr-bg" />

        <div className="stokr-container">
          <NavBar showSearch />

          <section className="py-12 sm:py-16">
            <p className="stokr-kicker">Research Education</p>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              stokr Blog
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-7 text-[#A3AAB8] sm:text-lg">
              Beginner-friendly stock research, filing breakdowns, and market
              education without the noise.
            </p>
          </section>

          <section className="grid gap-5 pb-16 md:grid-cols-2 xl:grid-cols-3">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="stokr-card flex min-h-[260px] flex-col p-5 transition hover:border-[#7C9DFF]/35 hover:bg-[#151923]"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#A3AAB8]">
                  <span className="rounded-full border border-[#7C9DFF]/25 bg-[#7C9DFF]/10 px-3 py-1 text-[#DDE2FF]">
                    {post.category}
                  </span>
                  <span>{post.readTime}</span>
                  <span>{post.date}</span>
                </div>

                <h2 className="mt-5 text-xl font-bold leading-snug text-white">
                  {post.title}
                </h2>

                <p className="mt-3 flex-1 text-sm leading-6 text-[#A3AAB8]">
                  {post.description}
                </p>

                <span className="mt-5 text-sm font-semibold text-[#7C9DFF]">
                  Read article
                </span>
              </Link>
            ))}
          </section>
        </div>
      </section>
    </main>
  )
}
