import type { NextConfig } from "next";

const nextConfig: NextConfig = { 
  images: {
    remotePatterns: [new URL('https://assets.aceternity.com/logo-dark.png')],
  }

  /* config options here */
};

export default nextConfig;
