import { ogImage } from "@/lib/og.tsx"
import { getPost, getPosts } from "@/lib/posts.ts"
import { formatDate } from "@/lib/site.ts"

export const dynamic = "force-static"
export const dynamicParams = false
export const generateStaticParams = () =>
  getPosts().map(({ slug }) => ({ slug }))

export const GET = async (
  _: Request,
  { params }: { params: Promise<{ slug: string }> }
) => {
  const post = getPost((await params).slug)!
  return ogImage(
    post.title,
    formatDate(post.date),
    post.tags.map((t) => `#${t}`).join("  ")
  )
}
