import Link from "next/link"
import { FC } from "react"
import { getTags } from "@/lib/posts.ts"

// GitHub linguist-style colours.
const palette = [
  "#3178c6",
  "#f1e05a",
  "#e34c26",
  "#89e051",
  "#b07219",
  "#00add8",
  "#f34b7d",
  "#8b7cff",
  "#dea584",
  "#4f5d95",
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
