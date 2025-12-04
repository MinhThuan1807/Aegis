import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Transpile recharts to work with React 19 and Turbopack
  transpilePackages: ['recharts', 'victory-vendor', 'd3-shape', 'd3-path'],
  images: {
    domains: ['images.unsplash.com'],
  },
};

export default nextConfig;
