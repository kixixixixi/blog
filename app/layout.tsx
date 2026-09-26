import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import Link from "next/link"
import { ReactNode } from "react"
import { DevRefresh } from "@/components/DevRefresh"
import { NavLink } from "@/components/Nav"
import { getPosts, getTags } from "@/lib/posts.ts"
import { site } from "@/lib/site.ts"
import "./globals.css"

const sans = Inter({ subsets: ["latin"], variable: "--font-inter" })
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
  alternates: { canonical: "/", types: { "application/rss+xml": "/rss.xml" } },
  openGraph: { siteName: site.name, locale: "ja_JP", type: "website" },
  twitter: { card: "summary" },
}

export const viewport: Viewport = { themeColor: "#0B0D10", colorScheme: "dark" }

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang={site.lang} className={`${sans.variable} ${mono.variable}`}>
    <body>
      {process.env.NODE_ENV === "development" && <DevRefresh />}
      <a className="skip-link" href="#main">
        本文へスキップ
      </a>
      <header className="site-header">
        <div className="site-bar">
          <Link href="/" className="site-title">
            {site.name}
          </Link>
          <nav className="header-nav" aria-label="サイト">
            <a href={site.github} rel="noopener noreferrer">
              GitHub
            </a>
            <a href="/rss.xml">RSS</a>
            {process.env.NODE_ENV === "development" && (
              <Link href="/new/">New</Link>
            )}
          </nav>
        </div>
        <nav className="tabs" aria-label="セクション">
          <NavLink href="/">Overview</NavLink>
          <NavLink href="/archive/" prefixes={["/posts/"]}>
            Notes <span className="count">{getPosts().length}</span>
          </NavLink>
          <NavLink href="/tags/" prefixes={["/tags/"]}>
            Topics <span className="count">{getTags().length}</span>
          </NavLink>
          <NavLink href="/about/">About</NavLink>
        </nav>
      </header>
      <main id="main">
        {children}
        <footer className="site-footer">
          <p>&copy; {site.author}</p>
        </footer>
      </main>
    </body>
  </html>
)
export default RootLayout
