import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      // 你未来若用到 Webflow/CDN 图，也可以提前加：
      // { protocol: "https", hostname: "cdn.prod.website-files.com" },
      // { protocol: "https", hostname: "assets.website-files.com" },
    ],
    // 如果你更喜欢老写法，也可以用 domains：
    // domains: ["images.unsplash.com"],
  },
};

export default nextConfig;
