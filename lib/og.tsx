import { ImageResponse } from "next/og"
import { site } from "@/lib/site.ts"

/** Noto Sans JP subset containing only `text` (satori needs ttf/otf). */
const loadFont = async (text: string) => {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&text=${encodeURIComponent(text)}`
  ).then((res) => res.text())
  const url = css.match(
    /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/
  )?.[1]
  if (!url) throw new Error("Noto Sans JP の取得に失敗")
  return fetch(url).then((res) => res.arrayBuffer())
}

/** 1200x630 OGP image: big `title`, footer `sub` + accent-coloured `accent`. */
export const ogImage = async (title: string, sub: string, accent = "") =>
  new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#0B0D10",
        color: "#E6E8EB",
        borderTop: "12px solid #8b7cff",
      }}
    >
      <div style={{ display: "flex", fontSize: 64, lineHeight: 1.35 }}>
        {title}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 30,
          color: "#9AA0A6",
        }}
      >
        <div style={{ display: "flex", gap: 24 }}>
          <span>{sub}</span>
          <span style={{ color: "#8b7cff" }}>{accent}</span>
        </div>
        <span>{site.name}</span>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Noto Sans JP",
          data: await loadFont(title + sub + accent + site.name),
          weight: 700,
        },
      ],
    }
  )
