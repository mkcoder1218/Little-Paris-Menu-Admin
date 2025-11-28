import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    // No remote patterns needed for base64
  },
};

export default nextConfig;

