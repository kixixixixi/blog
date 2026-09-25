import Link from "next/link"
import { PostList } from "@/components/PostCard"
import { TagList } from "@/components/TagList"
import { getArchive, getPosts, getTags } from "@/lib/posts.ts"
import { site } from "@/lib/site.ts"

const LATEST = 10

const Page = () => {
  const tags = getTags()
  return (
    <>
      <section className="intro">
        <h1>{site.name}</h1>
        <p>{site.description}</p>
      </section>
      <section aria-labelledby="latest">
        <h2 id="latest">最新記事</h2>
        <PostList posts={getPosts().slice(0, LATEST)} />
        <p>
          <Link href="/archive/">すべての記事 →</Link>
        </p>
      </section>
      <section aria-labelledby="tags">
        <h2 id="tags">タグ</h2>
        <TagList
          tags={tags.map((t) => t.tag)}
          counts={new Map(tags.map((t) => [t.tag, t.count]))}
        />
      </section>
      <section aria-labelledby="months">
        <h2 id="months">月別</h2>
        <ul className="inline-list">
          {getArchive().map(({ month, posts }) => (
            <li key={month}>
              <Link href={`/archive/#${month}`}>
                {month} ({posts.length})
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
export default Page
