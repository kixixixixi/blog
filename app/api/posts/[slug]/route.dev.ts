// Dev-only (see pageExtensions in next.config.js): save an article body (PUT) or its posts.json entry (PATCH).
import fs from "node:fs"
import path from "node:path"
import { isSameOrigin, savePosts } from "@/lib/dev.ts"
import { checkMdx } from "@/lib/mdx.ts"
import { loadPosts, parsePosts } from "@/lib/posts.ts"

export const PUT = async (
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) => {
  if (!isSameOrigin(req)) return new Response("forbidden", { status: 403 })

  const { slug } = await params
  const post = loadPosts().find((p) => p.slug === slug)
  if (!post) return new Response("not found", { status: 404 })

  const source = await req.text()
  try {
    await checkMdx(source)
  } catch (e) {
    return new Response((e as Error).message, { status: 422 })
  }
  fs.writeFileSync(path.join(process.cwd(), "content", post.path), source)
  return new Response(null, { status: 204 })
}

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) => {
  if (!isSameOrigin(req)) return new Response("forbidden", { status: 403 })

  const { slug } = await params
  const posts = loadPosts()
  const post = posts.find((p) => p.slug === slug)
  if (!post) return new Response("not found", { status: 404 })

  // id/slug/path stay fixed: they key the URL and the MDX file
  const next: Record<string, unknown> = {
    ...post,
    ...(await req.json()),
    id: post.id,
    slug,
    path: post.path,
  }
  // "" clears an optional field (JSON.stringify drops undefined)
  for (const k in next) if (next[k] === "") next[k] = undefined
  let parsed
  try {
    // same checks as pnpm validate; the body file is unchanged here
    parsed = parsePosts(
      posts.map((p) => (p === post ? next : p)),
      () => "x"
    )
  } catch (e) {
    return new Response((e as Error).message, { status: 422 })
  }
  await savePosts(parsed)
  return new Response(null, { status: 204 })
}
