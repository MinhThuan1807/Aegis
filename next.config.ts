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
  // Webpack config for fallback (if Turbopack doesn't handle it)
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    return config;
  },
};

export default nextConfig;
