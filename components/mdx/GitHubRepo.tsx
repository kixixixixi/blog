import { FC } from "react"
import { Embed } from "./Embed"

/** `<GitHubRepo repository="owner/name" description="…" />` */
export const GitHubRepo: FC<{ repository: string; description?: string }> = ({
  repository,
  description,
}) => {
  if (!/^[\w.-]+\/[\w.-]+$/.test(repository))
    throw new Error(`GitHubRepo: 不正な repository ${repository}`)
  return (
    <Embed
      url={`https://github.com/${repository}`}
      title={repository}
      description={description}
    />
  )
}
