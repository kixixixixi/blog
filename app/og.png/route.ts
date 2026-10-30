import { ogImage } from "@/lib/og.tsx"
import { site } from "@/lib/site.ts"

export const dynamic = "force-static"

export const GET = () => ogImage(site.title, site.description)
