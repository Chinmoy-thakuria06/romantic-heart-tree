import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["framer-motion", "@react-three/drei"]
  }
};

export default nextConfig;
