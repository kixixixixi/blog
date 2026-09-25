import { FC, ReactNode } from "react"

const labels = { note: "メモ", warning: "注意" } as const

/** `<Note type="warning">…</Note>` */
export const Note: FC<{ type?: keyof typeof labels; children: ReactNode }> = ({
  type = "note",
  children,
}) => (
  <aside className={`note note-${type}`} aria-label={labels[type]}>
    <strong className="note-label">{labels[type]}</strong>
    {children}
  </aside>
)
