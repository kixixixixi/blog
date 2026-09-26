import Link from "next/link"
import { Contributions } from "@/components/Contributions"
import { PostList } from "@/components/PostCard"
import { getPosts } from "@/lib/posts.ts"

const PINNED = 6

const Page = () => {
  const posts = getPosts()
  return (
    <>
      <section className="readme">
        <h1 className="readme-path">
          kixixixixi / <strong>README</strong>.md
        </h1>
        <p>
          技術、歴史、考えたこと。
          <br />
          小さな実験と記録。
        </p>
      </section>
      <section aria-labelledby="latest">
        <div className="section-head">
          <h2 id="latest">Latest notes</h2>
          <Link href="/archive/">All notes →</Link>
        </div>
        <PostList posts={posts.slice(0, PINNED)} grid />
      </section>
      <Contributions posts={posts} />
    </>
  )
}
export default Page
