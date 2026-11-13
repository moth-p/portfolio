import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Hide the dev-only route indicator; compile and runtime errors still show
  devIndicators: false,
  images: {
    qualities: [85],
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
}

export default nextConfig
