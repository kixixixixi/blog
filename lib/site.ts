export const site = {
  title: "槿花一朝の夢のまた夢",
  name: "kixixixixi log",
  url: "https://blog.kixixixixi.com",
  description: "読んだもの、書いたコード、考えたことのログ。",
  author: "kixixixixi",
  lang: "ja",
} as const

/** Absolute URL for a site path such as `/posts/foo/`. */
export const absoluteUrl = (path: string) => new URL(path, site.url).toString()
