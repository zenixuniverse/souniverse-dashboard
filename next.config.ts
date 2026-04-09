import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable server-side rendering for API routes
  // No static export - we need serverless functions
  
  // Optimize images
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
