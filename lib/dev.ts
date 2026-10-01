import fs from "node:fs"
import path from "node:path"
import { format } from "prettier"
import type { Post } from "@/lib/posts.ts"

/** `next dev` listens on all interfaces; only accept same-origin browser calls. */
export const isSameOrigin = (req: Request) => {
  const origin = req.headers.get("origin")
  return !!origin && new URL(origin).host === req.headers.get("host")
}

/** Write posts.json formatted like the checked-in file. */
export const savePosts = async (posts: Post[]) =>
  fs.writeFileSync(
    path.join(process.cwd(), "content", "posts.json"),
    await format(JSON.stringify(posts), { parser: "json" })
  )
