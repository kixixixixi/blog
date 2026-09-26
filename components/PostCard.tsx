import Link from "next/link"
import { FC } from "react"
import type { Post } from "@/lib/posts.ts"
import { formatDate } from "@/lib/site.ts"
import { TagList } from "./TagList"

export const PostCard: FC<{ post: Post }> = ({ post }) => (
  <article className="post-card">
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

/** `grid` = pinned-repo style boxes; default = repository-list rows. */
export const PostList: FC<{ posts: Post[]; grid?: boolean }> = ({
  posts,
  grid,
}) => (
  <ul className={grid ? "post-grid" : "post-list"}>
    {posts.map((p) => (
      <li key={p.slug}>
        <PostCard post={p} />
      </li>
    ))}
  </ul>
)
