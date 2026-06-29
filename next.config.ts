import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NODE_ENV === "production" ? ".next_production" : ".next",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
  },
  allowedDevOrigins: ["10.5.119.199", "localhost"],
  devIndicators: false
};

export default nextConfig;
