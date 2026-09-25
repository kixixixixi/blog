import { getPosts } from "@/lib/posts.ts"
import { absoluteUrl, site } from "@/lib/site.ts"

export const dynamic = "force-static"

const esc = (s: string) =>
  s.replace(
    /[<>&'"]/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
      })[c]!
  )

const rfc822 = (date: string) =>
  new Date(`${date}T00:00:00+09:00`).toUTCString()

export const GET = () => {
  const posts = getPosts().slice(0, 50)
  const items = posts
    .map((p) => {
      const url = absoluteUrl(`/posts/${p.slug}/`)
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(p.date)}</pubDate>
${p.description ? `      <description>${esc(p.description)}</description>\n` : ""}${p.tags.map((t) => `      <category>${esc(t)}</category>\n`).join("")}    </item>`
    })
    .join("\n")
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.name)}</title>
    <link>${site.url}/</link>
    <description>${esc(site.description)}</description>
    <language>ja</language>
    <atom:link href="${absoluteUrl("/rss.xml")}" rel="self" type="application/rss+xml"/>
${posts[0] ? `    <lastBuildDate>${rfc822(posts[0].updated ?? posts[0].date)}</lastBuildDate>\n` : ""}${items}
  </channel>
</rss>
`
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  })
}
