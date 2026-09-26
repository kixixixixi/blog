// Dev-only (see pageExtensions in next.config.js): create a draft post.
import fs from "node:fs"
import path from "node:path"
import { format } from "prettier"
import { isSameOrigin } from "@/lib/dev.ts"
import { loadPosts, parsePosts } from "@/lib/posts.ts"

const CONTENT_DIR = path.join(process.cwd(), "content")

export const POST = async (req: Request) => {
  if (!isSameOrigin(req)) return new Response("forbidden", { status: 403 })

  const form = await req.formData()
  const slug = String(form.get("slug") ?? "").trim()
  const title = String(form.get("title") ?? "").trim()
  const back = (error: string) =>
    Response.redirect(
      new URL(`/new/?${new URLSearchParams({ slug, title, error })}`, req.url),
      303
    )

  const posts = loadPosts()
  const post = {
    id: Math.max(0, ...posts.map((p) => p.id)) + 1,
    slug,
    title,
    date: new Date().toLocaleDateString("sv-SE"), // local YYYY-MM-DD
    tags: [],
    path: `posts/${slug}.mdx`,
    published: false,
  }
  const file = path.join(CONTENT_DIR, post.path)
  if (fs.existsSync(file)) return back(`content/${post.path} が既に存在`)
  try {
    // same checks as pnpm validate (slug format, duplicates…); new body is ""
    parsePosts([...posts, post], (p) => (p === post.path ? "" : "x"))
  } catch (e) {
    return back((e as Error).message)
  }

  fs.writeFileSync(file, "")
  const json = JSON.stringify([...posts, post])
  fs.writeFileSync(
    path.join(CONTENT_DIR, "posts.json"),
    await format(json, { parser: "json" })
  )
  return Response.redirect(new URL(`/posts/${slug}/`, req.url), 303)
}
