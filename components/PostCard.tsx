import Link from "next/link"
import { FC } from "react"
import type { Post } from "@/lib/posts.ts"
import { TagList } from "./TagList"

export const PostCard: FC<{ post: Post }> = ({ post }) => (
  <article className="post-card">
    <h3>
      <Link href={`/posts/${post.slug}/`}>{post.title}</Link>
    </h3>
    <time dateTime={post.date}>{post.date}</time>
    {post.description && <p>{post.description}</p>}
    <TagList tags={post.tags} />
  </article>
)

export const PostList: FC<{ posts: Post[] }> = ({ posts }) => (
  <ul className="post-list">
    {posts.map((p) => (
      <li key={p.slug}>
        <PostCard post={p} />
      </li>
    ))}
  </ul>
)
