export const site = {
  title: "槿花一朝の夢のまた夢",
  name: "kixixixixi log",
  url: "https://blog.kixixixixi.com",
  description: "読んだもの、書いたコード、考えたことのログ。",
  author: "kixixixixi",
  github: "https://github.com/kixixixixi",
  lang: "ja",
} as const

/** Absolute URL for a site path such as `/posts/foo/`. */
export const absoluteUrl = (path: string) => new URL(path, site.url).toString()

/** `2026-09-26` → `2026.09.26` */
export const formatDate = (date: string) => date.replaceAll("-", ".")
