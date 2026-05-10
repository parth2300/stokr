import type { Metadata } from "next"
import NavBar from "../components/navBar"
import { blogPosts } from "../lib/blogPosts"
import BlogIndexClient from "./BlogIndexClient"

export const metadata: Metadata = {
  title: "Blog | stokr AI Stock Research",
  description:
    "Beginner-friendly stock research guides, SEC filing explainers, financial metric breakdowns, and investing education from stokr.",
}

export default function BlogPage() {
  const posts = [...blogPosts].sort(
    (firstPost, secondPost) =>
      new Date(secondPost.date).getTime() - new Date(firstPost.date).getTime()
  )

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

          <BlogIndexClient posts={posts} />
        </div>
      </section>
    </main>
  )
}
