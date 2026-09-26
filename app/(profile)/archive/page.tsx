import type { Metadata } from "next"
import { PostList } from "@/components/PostCard"
import { getArchive } from "@/lib/posts.ts"

export const metadata: Metadata = {
  title: "アーカイブ",
  alternates: { canonical: "/archive/" },
}

const Page = () => (
  <>
    <h1 className="page-title">Notes</h1>
    {getArchive().map(({ month, posts }) => (
      <section key={month} aria-labelledby={month}>
        <h2 id={month} className="month">
          {month}
        </h2>
        <PostList posts={posts} />
      </section>
    ))}
  </>
)
export default Page
