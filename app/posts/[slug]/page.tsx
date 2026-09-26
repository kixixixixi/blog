import "katex/dist/katex.min.css"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { mdxComponents } from "@/components/mdx"
import { PostEditor } from "@/components/PostEditor"
import { TagList } from "@/components/TagList"
import { renderMdx } from "@/lib/mdx.ts"
import {
  getAdjacentPosts,
  getPost,
  getPosts,
  getPostSource,
} from "@/lib/posts.ts"
import { absoluteUrl, site } from "@/lib/site.ts"

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false
export const generateStaticParams = () =>
  getPosts().map(({ slug }) => ({ slug }))

const postPath = (slug: string) => `/posts/${slug}/`

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const post = getPost((await params).slug)
  if (!post) return {}
  const images = post.image ? [post.image] : undefined
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: postPath(post.slug) },
    openGraph: {
      type: "article",
      siteName: `${site.title} (${site.name})`,
      locale: "ja_JP",
      title: post.title,
      description: post.description,
      url: postPath(post.slug),
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      tags: post.tags,
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: post.title,
      description: post.description,
      images,
    },
  }
}

const Page = async ({ params }: Props) => {
  const post = getPost((await params).slug)
  if (!post) notFound()
  const source = getPostSource(post)
  const Content = await renderMdx(source)
  const { newer, older } = getAdjacentPosts(post.slug)
  const url = absoluteUrl(postPath(post.slug))
  const share = new URLSearchParams({
    text: `${post.title} | ${site.title} (${site.name})`,
    url,
  })

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    url,
    image: post.image ? absoluteUrl(post.image) : undefined,
    keywords: post.tags.join(","),
    author: { "@type": "Person", name: site.author },
    publisher: { "@type": "Person", name: site.author },
  }

  return (
    <article className="post">
      {process.env.NODE_ENV === "development" && (
        <PostEditor slug={post.slug} source={source} />
      )}
      <script
        type="application/ld+json"
        // "<" escaped so post text can't close the script tag
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <header className="post-header">
        <h1>
          {!post.published && "[下書き] "}
          {post.title}
        </h1>
        <p className="post-meta">
          <time dateTime={post.date}>{post.date}</time>
          {post.updated && post.updated !== post.date && (
            <>
              {" "}
              (更新: <time dateTime={post.updated}>{post.updated}</time>)
            </>
          )}
        </p>
        <TagList tags={post.tags} />
      </header>

      <div className="prose">
        <Content components={mdxComponents} />
      </div>

      <footer className="post-footer">
        <p className="share">
          共有:{" "}
          <a
            href={`https://x.com/intent/post?${share}`}
            rel="noopener noreferrer"
          >
            X
          </a>{" "}
          <a
            href={`https://b.hatena.ne.jp/entry/panel/?url=${encodeURIComponent(url)}`}
            rel="noopener noreferrer"
          >
            はてなブックマーク
          </a>{" "}
          <a
            href={`https://bsky.app/intent/compose?text=${encodeURIComponent(`${post.title} ${url}`)}`}
            rel="noopener noreferrer"
          >
            Bluesky
          </a>
        </p>
        <nav className="adjacent" aria-label="前後の記事">
          {older && (
            <Link href={postPath(older.slug)} rel="prev">
              ← {older.title}
            </Link>
          )}
          {newer && (
            <Link href={postPath(newer.slug)} rel="next">
              {newer.title} →
            </Link>
          )}
        </nav>
      </footer>
    </article>
  )
}
export default Page
