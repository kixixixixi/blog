"use client"
import { ComponentProps, FC, useRef, useState } from "react"

/** Overrides `pre`: language label, copy button, keyboard-scrollable body. */
export const Code: FC<ComponentProps<"pre"> & { "data-language"?: string }> = (
  props
) => {
  const ref = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)
  const lang = props["data-language"]
  const copy = async () => {
    await navigator.clipboard.writeText(ref.current?.innerText ?? "")
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="code-block">
      <div className="code-header">
        <span>{lang && lang !== "text" ? lang : ""}</span>
        <button type="button" onClick={copy}>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <pre {...props} ref={ref} tabIndex={0} />
    </div>
  )
}
