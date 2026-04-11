import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standalone for Netlify deployment
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
