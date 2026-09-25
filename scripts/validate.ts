// Validates posts.json, every MDX body, and internal links. Run: pnpm validate
import fs from "node:fs"
import path from "node:path"
import { checkMdx } from "../lib/mdx.ts"
import { getPosts, getPostSource, loadPosts } from "../lib/posts.ts"

const errors: string[] = []

let posts
try {
  posts = loadPosts()
} catch (e) {
  console.error((e as Error).message)
  process.exit(1)
}

const slugs = new Set(getPosts().map((p) => p.slug))

for (const post of posts) {
  const file = `content/${post.path}`
  const source = getPostSource(post)
  try {
    await checkMdx(source)
  } catch (e) {
    errors.push(`${file}: ${(e as Error).message}`)
  }

  // Internal links: markdown `](/x)` and JSX `src="/x"` / `href="/x"` / `image`.
  const targets = [
    ...source.matchAll(/\]\((\/[^)\s]*)/g),
    ...source.matchAll(/(?:src|href)="(\/[^"]*)"/g),
  ].map((m) => m[1])
  if (post.image) targets.push(post.image)
  for (const target of targets) {
    const [pathname] = target.split(/[?#]/)
    const slug = pathname.match(/^\/posts\/([^/]+)\/?$/)?.[1]
    if (slug) {
      if (!slugs.has(slug))
        errors.push(`${file}: 存在しない(または非公開)記事へのリンク ${target}`)
    } else if (
      path.extname(pathname) &&
      !fs.existsSync(path.join("public", decodeURIComponent(pathname)))
    ) {
      errors.push(`${file}: public に存在しないファイル ${target}`)
    }
  }
}

if (errors.length) {
  console.error(`検証エラー:\n${errors.join("\n")}`)
  process.exit(1)
}
console.log(`✓ ${posts.length} 記事を検証`)
