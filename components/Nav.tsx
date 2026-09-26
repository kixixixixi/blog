"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ComponentProps, FC } from "react"

// Static export uses trailing slashes; tag paths may arrive encoded.
const normalize = (p: string) => decodeURIComponent(p.replace(/\/?$/, "/"))

/**
 * Link that marks itself `aria-current` on its own page, or under any of
 * `prefixes` (e.g. the Posts tab stays active on `/posts/…`).
 */
export const NavLink: FC<
  ComponentProps<typeof Link> & { href: string; prefixes?: string[] }
> = ({ prefixes = [], ...props }) => {
  const path = normalize(usePathname())
  const current =
    path === normalize(props.href) || prefixes.some((p) => path.startsWith(p))
  return <Link {...props} aria-current={current ? "page" : undefined} />
}
