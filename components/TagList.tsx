import Link from "next/link"
import { FC } from "react"

export const TagList: FC<{ tags: string[]; counts?: Map<string, number> }> = ({
  tags,
  counts,
}) =>
  tags.length > 0 && (
    <ul className="tags" aria-label="タグ">
      {tags.map((t) => (
        <li key={t}>
          <Link href={`/tags/${encodeURIComponent(t)}/`}>
            #{t}
            {counts && <span className="count"> ({counts.get(t)})</span>}
          </Link>
        </li>
      ))}
    </ul>
  )
