"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import type { BlogPost } from "../lib/blogPosts"

type BlogIndexClientProps = {
  posts: BlogPost[]
}

export default function BlogIndexClient({ posts }: BlogIndexClientProps) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(posts.map((post) => post.category))).sort()],
    [posts]
  )

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return posts.filter((post) => {
      const matchesCategory = category === "All" || post.category === category
      const searchableText = `${post.title} ${post.description} ${post.category}`.toLowerCase()
      const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery)

      return matchesCategory && matchesQuery
    })
  }, [category, posts, query])

  return (
    <>
      <section className="mb-8 flex w-full justify-end">
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-end">
          <label className="block w-full sm:w-52">
            <span className="text-sm font-semibold text-white">Category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-2 h-11 w-full rounded-lg border border-white/[0.10] bg-[#151923] px-4 text-sm font-semibold text-white outline-none transition focus:border-[#7C9DFF]/60"
            >
              {categories.map((item) => (
                <option key={item} value={item} className="bg-[#151923] text-white">
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="block w-full sm:w-[380px]">
            <span className="text-sm font-semibold text-white">Search articles</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title, topic, or keyword..."
              className="mt-2 h-11 w-full rounded-lg border border-white/[0.10] bg-[#08090D] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#7C9DFF]/60"
            />
          </label>
        </div>
      </section>

      <section className="grid gap-5 pb-16 md:grid-cols-2 xl:grid-cols-3">
        {filteredPosts.map((post) => (
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

      {filteredPosts.length === 0 && (
        <section className="stokr-card mb-16 p-6 text-center">
          <h2 className="text-xl font-bold text-white">No articles found</h2>
          <p className="mt-2 text-sm text-slate-400">
            Try another search term or choose a different category.
          </p>
        </section>
      )}
    </>
  )
}
