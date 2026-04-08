import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove 'output: export' to enable API routes (serverless functions)
  // Netlify will automatically deploy API routes as serverless functions
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
