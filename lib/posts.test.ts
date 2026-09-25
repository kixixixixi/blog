import { describe, expect, it } from "vitest"
import { parsePosts } from "./posts.ts"

const base = {
  id: 1,
  slug: "a",
  title: "A",
  date: "2026-01-01",
  path: "posts/a.mdx",
  published: true,
}
const read = (files: Record<string, string>) => (p: string) => files[p] ?? null

describe("parsePosts", () => {
  it("accepts valid posts and defaults tags", () => {
    expect(parsePosts([base], read({ "posts/a.mdx": "body" }))[0].tags).toEqual(
      []
    )
  })

  it.each([
    ["missing field", [{ ...base, title: undefined }], /title/],
    ["invalid date", [{ ...base, date: "2026-02-30" }], /date/],
    [
      "duplicate id",
      [base, { ...base, slug: "b", path: "posts/b.mdx" }],
      /id が重複/,
    ],
    [
      "duplicate slug",
      [base, { ...base, id: 2, path: "posts/b.mdx" }],
      /slug が重複/,
    ],
    ["missing file", [{ ...base, path: "posts/none.mdx" }], /存在しない/],
    [
      "empty published body",
      [{ ...base, path: "posts/empty.mdx" }],
      /本文が空/,
    ],
  ])("rejects %s", (_, raw, message) => {
    expect(() =>
      parsePosts(
        raw,
        read({ "posts/a.mdx": "x", "posts/b.mdx": "x", "posts/empty.mdx": " " })
      )
    ).toThrow(message)
  })

  it("allows an empty body for drafts", () => {
    expect(() =>
      parsePosts([{ ...base, published: false }], read({ "posts/a.mdx": "" }))
    ).not.toThrow()
  })
})
