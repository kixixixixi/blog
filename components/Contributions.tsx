import { FC } from "react"
import type { Post } from "@/lib/posts.ts"

const DAY = 86_400_000
const WEEKS = 53

/** GitHub-style yearly heatmap of posts per day, ending at build date. */
export const Contributions: FC<{ posts: Post[]; today?: Date }> = ({
  posts,
  today = new Date(),
}) => {
  const counts = new Map<string, number>()
  for (const p of posts) counts.set(p.date, (counts.get(p.date) ?? 0) + 1)
  const end = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  // first column starts on a Sunday
  const start = end - ((WEEKS - 1) * 7 + new Date(end).getUTCDay()) * DAY
  const days = Array.from({ length: (end - start) / DAY + 1 }, (_, i) => {
    const date = new Date(start + i * DAY).toISOString().slice(0, 10)
    return { date, count: counts.get(date) ?? 0 }
  })
  const total = days.reduce((n, d) => n + d.count, 0)
  return (
    <section className="contributions" aria-labelledby="contrib">
      <h2 id="contrib">{total} notes in the last year</h2>
      <div className="contrib-box">
        <div className="contrib-scroll">
          <div className="contrib-grid">
            {days.map(({ date, count }) => (
              <span
                key={date}
                data-level={Math.min(count, 4)}
                title={`${date}: ${count} note${count === 1 ? "" : "s"}`}
              />
            ))}
          </div>
        </div>
        <p className="contrib-legend" aria-hidden>
          Less <span data-level="0" />
          <span data-level="1" />
          <span data-level="2" />
          <span data-level="3" />
          <span data-level="4" /> More
        </p>
      </div>
    </section>
  )
}
