import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Static HTML export into `out/`, served as-is by Cloudflare Pages
  output: "export",
  // Hide the dev-only route indicator; compile and runtime errors still show
  devIndicators: false,
  images: {
    // A static export has no image optimization server, so images are served as they are
    unoptimized: true,
    qualities: [85],
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
}

export default nextConfig
