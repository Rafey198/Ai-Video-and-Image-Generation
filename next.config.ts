import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
    ],
    unoptimized: process.env.NODE_ENV === "development",
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  async redirects() {
    return [
      { source: "/register", destination: "/signup", permanent: true },
      { source: "/careers", destination: "/about", permanent: false },
      { source: "/acceptable-use", destination: "/terms", permanent: false },
      { source: "/dmca", destination: "/terms", permanent: false },
      { source: "/security", destination: "/safety", permanent: false },
      { source: "/settings/profile", destination: "/settings", permanent: false },
    ];
  },
};

export default nextConfig;
