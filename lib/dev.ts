/** `next dev` listens on all interfaces; only accept same-origin browser calls. */
export const isSameOrigin = (req: Request) => {
  const origin = req.headers.get("origin")
  return !!origin && new URL(origin).host === req.headers.get("host")
}
