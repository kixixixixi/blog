import Link from "next/link"
import { FC } from "react"
import { getTags } from "@/lib/posts.ts"

// Muted hues at similar lightness, so no tag shouts over the others.
const palette = [
  "#9d8cff",
  "#6cc4b8",
  "#e0b86a",
  "#e58a9b",
  "#7fb0e8",
  "#a8c97f",
  "#d49a6a",
  "#c98fd6",
  "#8fa3b8",
  "#e6d28a",
]

/** Colour by alphabetical position, so current tags never share a colour. */
export const tagColor = (tag: string) => {
  const names = getTags()
    .map((t) => t.tag)
    .sort()
  return palette[Math.max(names.indexOf(tag), 0) % palette.length]
}

export const TagDot: FC<{ tag: string }> = ({ tag }) => (
  <span className="dot" style={{ background: tagColor(tag) }} aria-hidden />
)

export const TagList: FC<{ tags: string[]; counts?: Map<string, number> }> = ({
  tags,
  counts,
}) =>
  tags.length > 0 && (
    <ul className="tags" aria-label="タグ">
      {tags.map((t) => (
        <li key={t}>
          <Link href={`/tags/${encodeURIComponent(t)}/`}>
            <TagDot tag={t} />
            {t}
            {counts && <span className="count">{counts.get(t)}</span>}
          </Link>
        </li>
      ))}
    </ul>
  )
