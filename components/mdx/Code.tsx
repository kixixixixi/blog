import { ComponentProps, FC } from "react"

/** Overrides `pre` so long code blocks are keyboard-scrollable. */
export const Code: FC<ComponentProps<"pre">> = (props) => (
  // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
  <pre {...props} tabIndex={0} />
)
