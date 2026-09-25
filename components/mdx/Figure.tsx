import { FC } from "react"

/** `<Figure src="/images/a.png" alt="…" caption="…" width="800" height="600" />` */
export const Figure: FC<{
  src: string
  alt: string
  caption?: string
  width?: string
  height?: string
}> = ({ src, alt, caption, width, height }) => (
  <figure>
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
    />
    {caption && <figcaption>{caption}</figcaption>}
  </figure>
)
