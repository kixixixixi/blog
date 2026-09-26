import type { Metadata } from "next"
import { site } from "@/lib/site.ts"

export const metadata: Metadata = {
  title: "About",
  alternates: { canonical: "/about/" },
}

const Page = () => (
  <>
    <h1 className="page-title">About</h1>
    <div className="prose">
      <p>{site.description}</p>
      <p>
        {site.title} — {site.author}.{" "}
        <a href={site.github} rel="noopener noreferrer">
          GitHub
        </a>
      </p>
    </div>
  </>
)
export default Page
