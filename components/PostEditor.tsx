"use client"
import { useRouter } from "next/navigation"
import { KeyboardEvent, useEffect, useRef, useState } from "react"

/**
 * `next dev` only: edit the article body. Saves while typing (debounced) and
 * re-renders the page, so the preview is the real build output. Invalid MDX
 * is rejected by the server and the last valid preview stays.
 */
export const PostEditor = ({
  slug,
  source,
}: {
  slug: string
  source: string
}) => {
  const router = useRouter()
  const [text, setText] = useState(source)
  const [status, setStatus] = useState("")
  const sent = useRef(source) // last body sent; not resent even if rejected
  const seq = useRef(0)

  const save = async (body: string) => {
    if (body === sent.current) return
    sent.current = body
    const n = ++seq.current
    setStatus("保存中…")
    const res = await fetch(`/api/posts/${slug}/`, { method: "PUT", body })
    if (n !== seq.current) return // a newer save superseded this one
    if (res.ok) {
      setStatus("保存済み")
      router.refresh()
    } else setStatus(`エラー: ${await res.text()}`)
  }

  useEffect(() => {
    const id = setTimeout(() => save(text), 300)
    return () => clearTimeout(id)
  })

  const onKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "s") {
      e.preventDefault()
      save(text)
    }
  }

  return (
    <aside className="post-editor" aria-label="記事エディタ">
      <textarea
        aria-label="本文 (MDX)"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        spellCheck={false}
      />
      <p>
        <output>{status || "入力すると自動保存・反映"}</output>
      </p>
    </aside>
  )
}
