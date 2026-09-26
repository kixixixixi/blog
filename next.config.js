import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js"

/** @type {(phase: string) => import('next').NextConfig} */
const nextConfig = (phase) => {
  const dev = phase === PHASE_DEVELOPMENT_SERVER
  return {
    // dev needs a server for the editor routes (*.dev.ts, *.dev.tsx)
    output: dev ? undefined : "export",
    pageExtensions: dev ? ["tsx", "ts", "dev.tsx", "dev.ts"] : ["tsx", "ts"],
    trailingSlash: true,
    images: {
      unoptimized: true,
    },
  }
}

export default nextConfig
