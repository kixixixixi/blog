"use client"
import { KeyboardEvent, useState } from "react"

/** `next dev` only: edit the article body; DevRefresh shows the result. */
export const PostEditor = ({
  slug,
  source,
}: {
  slug: string
  source: string
}) => {
  const [text, setText] = useState(source)
  const [status, setStatus] = useState("")

  const save = async () => {
    setStatus("保存中…")
    const res = await fetch(`/api/posts/${slug}/`, { method: "PUT", body: text })
    setStatus(res.ok ? "保存済み" : `エラー: ${await res.text()}`)
  }
  const onKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "s") {
      e.preventDefault()
      save()
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
        <button type="button" onClick={save}>
          保存 (⌘S)
        </button>{" "}
        <output>{status}</output>
      </p>
    </aside>
  )
}
