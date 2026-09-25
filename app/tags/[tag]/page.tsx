import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PostList } from "@/components/PostCard"
import { getPostsByTag, getTags } from "@/lib/posts.ts"

type Props = { params: Promise<{ tag: string }> }

export const dynamicParams = false
export const generateStaticParams = () => getTags().map(({ tag }) => ({ tag }))

// Non-ASCII params may arrive percent-encoded.
const tagOf = async (params: Props["params"]) =>
  decodeURIComponent((await params).tag)

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const tag = await tagOf(params)
  return {
    title: `#${tag}`,
    description: `「${tag}」タグの記事一覧`,
    alternates: { canonical: `/tags/${encodeURIComponent(tag)}/` },
  }
}

const Page = async ({ params }: Props) => {
  const tag = await tagOf(params)
  const posts = getPostsByTag(tag)
  if (posts.length === 0) notFound()
  return (
    <>
      <h1>#{tag}</h1>
      <PostList posts={posts} />
    </>
  )
}
export default Page
