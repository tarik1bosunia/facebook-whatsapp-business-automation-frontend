import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",

    images: {
    domains: ['i.pravatar.cc'],
  },
};

export default nextConfig;
