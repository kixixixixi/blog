import type { Metadata } from "next"
import Link from "next/link"
import { getArchive } from "@/lib/posts.ts"

export const metadata: Metadata = {
  title: "アーカイブ",
  alternates: { canonical: "/archive/" },
}

const Page = () => (
  <>
    <h1>アーカイブ</h1>
    {getArchive().map(({ month, posts }) => (
      <section key={month} aria-labelledby={month}>
        <h2 id={month}>{month}</h2>
        <ul className="archive-list">
          {posts.map((p) => (
            <li key={p.slug}>
              <time dateTime={p.date}>{p.date}</time>{" "}
              <Link href={`/posts/${p.slug}/`}>{p.title}</Link>
            </li>
          ))}
        </ul>
      </section>
    ))}
  </>
)
export default Page
