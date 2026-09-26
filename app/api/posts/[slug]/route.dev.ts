// Dev-only (see pageExtensions in next.config.js): save an article body.
import fs from "node:fs"
import path from "node:path"
import { isSameOrigin } from "@/lib/dev.ts"
import { checkMdx } from "@/lib/mdx.ts"
import { loadPosts } from "@/lib/posts.ts"

export const PUT = async (
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) => {
  if (!isSameOrigin(req))
    return new Response("forbidden", { status: 403 })

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
