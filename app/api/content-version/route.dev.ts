// Dev-only (see pageExtensions in next.config.js): latest mtime under content/, polled by DevRefresh.
import fs from "node:fs"
import path from "node:path"

const CONTENT_DIR = path.join(process.cwd(), "content")

export const GET = () => {
  let latest = 0
  for (const f of fs.readdirSync(CONTENT_DIR, { recursive: true }))
    latest = Math.max(
      latest,
      fs.statSync(path.join(CONTENT_DIR, String(f))).mtimeMs
    )
  return new Response(String(latest))
}
