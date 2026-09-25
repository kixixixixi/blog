import { FC, ReactNode } from "react"

/**
 * `<Tweet url="https://x.com/user/status/123">本文</Tweet>` — quoted as static
 * HTML; the X widget script is intentionally not loaded.
 */
export const Tweet: FC<{
  url: string
  author?: string
  children?: ReactNode
}> = ({ url, author, children }) => {
  const { hostname } = new URL(url)
  if (!["x.com", "twitter.com"].includes(hostname))
    throw new Error(`Tweet: 不正なURL ${url}`)
  return (
    <blockquote className="tweet" cite={url}>
      {children}
      <footer>
        — {author && <>{author} </>}
        <a href={url} rel="noopener noreferrer">
          X で見る
        </a>
      </footer>
    </blockquote>
  )
}
