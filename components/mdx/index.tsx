import { FC } from "react"
import type { MdxComponentName } from "@/lib/mdx.ts"
import { Code } from "./Code"
import { Embed } from "./Embed"
import { Figure } from "./Figure"
import { GitHubRepo } from "./GitHubRepo"
import { Note } from "./Note"
import { Tweet } from "./Tweet"
import { YouTube } from "./YouTube"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const allowed: Record<MdxComponentName, FC<any>> = {
  YouTube,
  Embed,
  Figure,
  GitHubRepo,
  Tweet,
  Note,
}

export const mdxComponents = { ...allowed, pre: Code }
