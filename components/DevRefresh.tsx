"use client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

/**
 * `next dev` only: content/ is read via fs, not imported, so HMR never sees
 * edits. Re-render server components when content/ changes instead.
 */
export const DevRefresh = () => {
  const router = useRouter()
  useEffect(() => {
    let last: string | undefined
    // ponytail: 1s mtime poll, switch to fs.watch + SSE if polling gets slow
    const id = setInterval(async () => {
      if (document.visibilityState !== "visible") return
      const v = await (await fetch("/api/content-version/")).text()
      if (last !== undefined && v !== last) router.refresh()
      last = v
    }, 1000)
    return () => clearInterval(id)
  }, [router])
  return null
}
