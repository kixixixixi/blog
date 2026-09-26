import Link from "next/link"
import { CSSProperties, FC } from "react"
import type { Post } from "@/lib/posts.ts"
import { formatDate } from "@/lib/site.ts"
import { TagList, tagColor } from "./TagList"

export const PostCard: FC<{ post: Post; n?: number }> = ({ post, n }) => (
  <article
    className="post-card"
    style={
      post.tags[0]
        ? ({ "--tag": tagColor(post.tags[0]) } as CSSProperties)
        : undefined
    }
  >
    {n !== undefined && (
      <span className="post-no" aria-hidden>
        {String(n).padStart(2, "0")}
      </span>
    )}
    <h3>
      <Link href={`/posts/${post.slug}/`}>{post.title}</Link>
    </h3>
    {post.description && <p>{post.description}</p>}
    <div className="post-card-meta">
      <TagList tags={post.tags} />
      <time dateTime={post.date}>{formatDate(post.date)}</time>
    </div>
  </article>
)

/** `grid` = numbered index cards; default = ruled rows. */
export const PostList: FC<{ posts: Post[]; grid?: boolean }> = ({
  posts,
  grid,
}) => (
  <ul className={grid ? "post-grid" : "post-list"}>
    {posts.map((p, i) => (
      <li key={p.slug}>
        <PostCard post={p} n={grid ? i + 1 : undefined} />
      </li>
    ))}
  </ul>
)
