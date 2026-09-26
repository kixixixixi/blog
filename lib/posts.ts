import fs from "node:fs"
import path from "node:path"
import { z } from "zod"

const CONTENT_DIR = path.join(process.cwd(), "content")

/** `next dev`: re-read content on every request and show drafts. */
const isDev = process.env.NODE_ENV === "development"

const PostSchema = z.strictObject({
  id: z.int().positive(),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug は小文字英数字とハイフンのみ"),
  title: z.string().min(1),
  description: z.string().optional(),
  date: z.iso.date(),
  updated: z.iso.date().optional(),
  tags: z.array(z.string().min(1)).default([]),
  category: z.string().optional(),
  path: z.string().regex(/^posts\/[^/]+\.mdx$/, "path は posts/*.mdx"),
  image: z.string().optional(),
  published: z.boolean(),
})

export type Post = z.infer<typeof PostSchema>

/**
 * Validates raw posts.json data. `readBody` returns the MDX source for a
 * content-relative path, or null if the file does not exist.
 * Throws one Error listing every problem found.
 */
export const parsePosts = (
  raw: unknown,
  readBody: (p: string) => string | null
): Post[] => {
  const result = z.array(PostSchema).safeParse(raw)
  if (!result.success)
    throw new Error(`posts.json が不正:\n${z.prettifyError(result.error)}`)

  const errors: string[] = []
  const seen = { id: new Set<number>(), slug: new Set<string>() }
  for (const post of result.data) {
    const at = `[id=${post.id} slug=${post.slug}]`
    if (seen.id.has(post.id)) errors.push(`${at} id が重複`)
    if (seen.slug.has(post.slug)) errors.push(`${at} slug が重複`)
    seen.id.add(post.id)
    seen.slug.add(post.slug)
    if (post.updated && post.updated < post.date)
      errors.push(`${at} updated が date より前`)
    const body = readBody(post.path)
    if (body === null)
      errors.push(`${at} MDXファイルが存在しない: content/${post.path}`)
    else if (post.published && body.trim() === "")
      errors.push(`${at} 公開記事なのに本文が空`)
  }
  if (errors.length)
    throw new Error(`posts.json の検証に失敗:\n${errors.join("\n")}`)
  return result.data
}

const readBody = (p: string) => {
  try {
    return fs.readFileSync(path.join(CONTENT_DIR, p), "utf8")
  } catch {
    return null
  }
}

let cache: Post[] | undefined

/** Every post in posts.json (including drafts), validated. */
export const loadPosts = (): Post[] => {
  if (cache) return cache
  const file = path.join(CONTENT_DIR, "posts.json")
  let raw: unknown
  try {
    raw = JSON.parse(fs.readFileSync(file, "utf8"))
  } catch (e) {
    throw new Error(`content/posts.json を読めない: ${(e as Error).message}`, {
      cause: e,
    })
  }
  const posts = parsePosts(raw, readBody)
  if (!isDev) cache = posts
  return posts
}

/** Published posts (plus drafts in dev), newest first. */
export const getPosts = (): Post[] =>
  loadPosts()
    .filter((p) => p.published || isDev)
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)

export const getPost = (slug: string) => getPosts().find((p) => p.slug === slug)

export const getPostSource = (post: Post) => readBody(post.path) ?? ""

/** Neighbours in date order: `newer` / `older`. */
export const getAdjacentPosts = (slug: string) => {
  const posts = getPosts()
  const i = posts.findIndex((p) => p.slug === slug)
  return { newer: posts[i - 1], older: posts[i + 1] }
}

/** Tags with post counts, most used first. */
export const getTags = () => {
  const counts = new Map<string, number>()
  for (const p of getPosts())
    for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1)
  return [...counts]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
}

export const getPostsByTag = (tag: string) =>
  getPosts().filter((p) => p.tags.includes(tag))

/** Posts grouped by "YYYY-MM", newest month first. */
export const getArchive = () => {
  const months = new Map<string, Post[]>()
  for (const p of getPosts()) {
    const m = p.date.slice(0, 7)
    months.set(m, [...(months.get(m) ?? []), p])
  }
  return [...months].map(([month, posts]) => ({ month, posts }))
}
