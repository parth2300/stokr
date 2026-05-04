"use client"

import { useEffect } from "react"

export default function PWARegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return

    if (process.env.NODE_ENV !== "production") return

    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Fail silently. PWA install should never block the app.
      })
    })
  }, [])

  return null
}