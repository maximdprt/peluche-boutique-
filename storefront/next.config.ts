import type { NextConfig } from "next"

const config: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "http", hostname: "localhost", port: "9000" }, { protocol: "https", hostname: "**" }],
  },
}

export default config
