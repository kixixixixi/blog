"use client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

/**
 * `next dev` only: content/ is read via fs, not imported, so HMR never sees
 * edits. Re-render server components periodically instead.
 */
export const DevRefresh = () => {
  const router = useRouter()
  useEffect(() => {
    // ponytail: blind 1s poll, switch to fs.watch + SSE if re-rendering gets slow
    const id = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh()
    }, 1000)
    return () => clearInterval(id)
  }, [router])
  return null
}
