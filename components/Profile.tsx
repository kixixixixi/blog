import { FC } from "react"
import { getPosts, getTags } from "@/lib/posts.ts"
import { site } from "@/lib/site.ts"
import { NavLink } from "./Nav"
import { TagDot } from "./TagList"

/** Left column of the GitHub-profile-style layout. */
export const Profile: FC = () => (
  <aside className="profile">
    <img
      className="avatar"
      src={`${site.github}.png?size=460`}
      alt=""
      width={230}
      height={230}
    />
    <p className="profile-name">
      <span>{site.title}</span>
      <span className="profile-handle">{site.author}</span>
    </p>
    <p className="profile-bio">{site.description}</p>
    <ul className="profile-links">
      <li>
        <a href={site.github} rel="noopener noreferrer">
          github.com/{site.author}
        </a>
      </li>
      <li>
        <a href="/rss.xml">RSS feed</a>
      </li>
      <li>
        <span>{getPosts().length}</span> notes
      </li>
    </ul>
    <nav className="profile-section" aria-label="タグ">
      <h2>Topics</h2>
      <ul className="topic-list">
        {getTags().map(({ tag, count }) => (
          <li key={tag}>
            <NavLink href={`/tags/${encodeURIComponent(tag)}/`}>
              <TagDot tag={tag} />
              {tag}
              <span className="count">{count}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  </aside>
)
