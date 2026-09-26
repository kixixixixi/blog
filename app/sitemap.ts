import type { MetadataRoute } from "next"
import { getPosts, getTags } from "@/lib/posts.ts"
import { absoluteUrl } from "@/lib/site.ts"

export const dynamic = "force-static"

const sitemap = (): MetadataRoute.Sitemap => [
  { url: absoluteUrl("/") },
  { url: absoluteUrl("/archive/") },
  { url: absoluteUrl("/about/") },
  { url: absoluteUrl("/tags/") },
  ...getPosts().map((p) => ({
    url: absoluteUrl(`/posts/${p.slug}/`),
    lastModified: p.updated ?? p.date,
  })),
  ...getTags().map(({ tag }) => ({
    url: absoluteUrl(`/tags/${encodeURIComponent(tag)}/`),
  })),
]
export default sitemap
