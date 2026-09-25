import type { Metadata } from "next"
import { TagList } from "@/components/TagList"
import { getTags } from "@/lib/posts.ts"

export const metadata: Metadata = {
  title: "タグ",
  alternates: { canonical: "/tags/" },
}

const Page = () => {
  const tags = getTags()
  return (
    <>
      <h1>タグ</h1>
      <TagList
        tags={tags.map((t) => t.tag)}
        counts={new Map(tags.map((t) => [t.tag, t.count]))}
      />
    </>
  )
}
export default Page
