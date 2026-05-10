"use client"

import { useEffect } from "react"
import { trackResourceView } from "../lib/analytics"

export default function ResourceViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    trackResourceView(slug)
  }, [slug])

  return null
}
