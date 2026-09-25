import { FC } from "react"

/** `<YouTube id="dQw4w9WgXcQ" title="…" />` — privacy-enhanced embed, lazy loaded. */
export const YouTube: FC<{ id: string; title?: string }> = ({
  id,
  title = "YouTube動画",
}) => (
  <div className="embed-video">
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`}
      title={title}
      loading="lazy"
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
    />
  </div>
)
