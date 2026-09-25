import { FC } from "react"

/**
 * `<Embed url="https://…" title="…" description="…" />` — a static link card.
 * No fetching or third-party script; title/description are written by hand.
 */
export const Embed: FC<{
  url: string
  title?: string
  description?: string
}> = ({ url, title, description }) => {
  const { protocol, hostname } = new URL(url)
  if (protocol !== "https:" && protocol !== "http:")
    throw new Error(`Embed: 不正なURL ${url}`)
  return (
    <a className="card" href={url} rel="noopener noreferrer">
      <span className="card-title">{title ?? url}</span>
      {description && <span className="card-description">{description}</span>}
      <span className="card-host">{hostname}</span>
    </a>
  )
}
