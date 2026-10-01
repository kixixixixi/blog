"use client"
import { useRouter } from "next/navigation"
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react"
import type { Post } from "@/lib/posts.ts"

/**
 * `next dev` only: edit the article body and its posts.json entry. Saves while typing (debounced) and
 * re-renders the page, so the preview is the real build output. Invalid MDX
 * is rejected by the server and the last valid preview stays.
 */
export const PostEditor = ({
  post,
  source,
}: {
  post: Post
  source: string
}) => {
  const { slug } = post
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

  const saveMeta = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const s = (k: string) => String(f.get(k) ?? "").trim()
    const meta = {
      title: s("title"),
      description: s("description"),
      date: s("date"),
      updated: s("updated"),
      tags: s("tags")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      image: s("image"),
      published: f.has("published"),
    }
    ++seq.current // drop any in-flight body save status
    setStatus("保存中…")
    const res = await fetch(`/api/posts/${slug}/`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(meta),
    })
    if (res.ok) {
      setStatus("メタ情報を保存")
      router.refresh()
    } else setStatus(`エラー: ${await res.text()}`)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "s") {
      e.preventDefault()
      save(text)
    }
  }

  return (
    <aside className="post-editor" aria-label="記事エディタ">
      <details>
        <summary>メタ情報</summary>
        <form className="post-meta-form" onSubmit={saveMeta}>
          <label>
            タイトル
            <input name="title" required defaultValue={post.title} />
          </label>
          <label>
            説明
            <input name="description" defaultValue={post.description} />
          </label>
          <label>
            date
            <input name="date" type="date" required defaultValue={post.date} />
          </label>
          <label>
            updated
            <input name="updated" type="date" defaultValue={post.updated} />
          </label>
          <label>
            タグ (カンマ区切り)
            <input name="tags" defaultValue={post.tags.join(", ")} />
          </label>
          <label>
            image
            <input name="image" defaultValue={post.image} />
          </label>
          <label>
            <input
              name="published"
              type="checkbox"
              defaultChecked={post.published}
            />
            published
          </label>
          <button type="submit">保存</button>
        </form>
      </details>
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
