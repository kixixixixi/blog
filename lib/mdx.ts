import { compile, evaluate } from "@mdx-js/mdx"
import rehypeShiki from "@shikijs/rehype"
import * as runtime from "react/jsx-runtime"
import rehypeKatex from "rehype-katex"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import type { ShikiTransformer } from "shiki"

/**
 * JSX tags an article may use. Anything else (raw HTML, <iframe>, <script>,
 * imports, `{expressions}`) fails the build. Keep in sync with
 * components/mdx/index.tsx (enforced by the type there).
 */
export const mdxComponentNames = [
  "YouTube",
  "Embed",
  "Figure",
  "GitHubRepo",
  "Tweet",
  "Note",
] as const
export type MdxComponentName = (typeof mdxComponentNames)[number]

type Node = {
  type: string
  name?: string | null
  alt?: string | null
  attributes?: { type: string; name?: string; value?: unknown }[]
  children?: Node[]
  position?: { start: { line: number } }
}

const remarkAllowlist = () => (tree: Node) => {
  const allowed = new Set<string>(mdxComponentNames)
  const walk = (node: Node) => {
    const fail = (msg: string) => {
      throw new Error(`${msg} (line ${node.position?.start.line ?? "?"})`)
    }
    switch (node.type) {
      case "mdxjsEsm":
        fail("import / export は使用できない")
        break
      case "mdxFlowExpression":
      case "mdxTextExpression":
        fail(
          "JavaScript式 {…} は使用できない。文字としての { は \\{ でエスケープ"
        )
        break
      case "mdxJsxFlowElement":
      case "mdxJsxTextElement":
        if (!node.name || !allowed.has(node.name))
          fail(
            `<${node.name ?? ""}> は許可されていない。使用可能: ${mdxComponentNames.join(", ")}`
          )
        for (const a of node.attributes ?? [])
          if (
            a.type !== "mdxJsxAttribute" ||
            (a.value !== null && typeof a.value !== "string")
          )
            fail(
              `<${node.name}> の属性は文字列リテラルのみ (${a.name ?? "spread"})`
            )
        break
      case "image":
        if (!node.alt?.trim()) fail("画像に alt テキストがない")
        break
    }
    node.children?.forEach(walk)
  }
  walk(tree)
}

const remarkPlugins = [remarkGfm, remarkMath, remarkAllowlist]

/** Parse + safety check only (no highlighting); used by `pnpm validate`. */
export const checkMdx = async (source: string) => {
  await compile(source, { remarkPlugins })
}

const languageLabel: ShikiTransformer = {
  name: "language-label",
  pre(node) {
    node.properties["data-language"] = this.options.lang
  },
}

/** Compile an article to a React component at build time. */
export const renderMdx = async (source: string) => {
  const { default: Content } = await evaluate(source, {
    ...runtime,
    remarkPlugins,
    rehypePlugins: [
      rehypeKatex,
      [
        rehypeShiki,
        {
          themes: { light: "github-light", dark: "github-dark" },
          defaultLanguage: "text",
          fallbackLanguage: "text",
          transformers: [languageLabel],
        },
      ],
    ],
  })
  return Content
}
