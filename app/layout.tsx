import type { Metadata } from "next"
import Link from "next/link"
import { ReactNode } from "react"
import { site } from "@/lib/site.ts"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
  alternates: { canonical: "/", types: { "application/rss+xml": "/rss.xml" } },
  openGraph: { siteName: site.name, locale: "ja_JP", type: "website" },
  twitter: { card: "summary" },
}

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang={site.lang}>
    <body>
      <a className="skip-link" href="#main">
        本文へスキップ
      </a>
      <header className="site-header">
        <Link href="/" className="site-title">
          {site.title}
        </Link>
        <nav aria-label="サイト">
          <Link href="/archive/">アーカイブ</Link>
          <Link href="/tags/">タグ</Link>
          <a href="/rss.xml">RSS</a>
        </nav>
      </header>
      <main id="main">{children}</main>
      <footer className="site-footer">
        <p>&copy; {site.author}</p>
      </footer>
    </body>
  </html>
)
export default RootLayout
