import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverComponentsExternalPackages: ['clarifai-nodejs-grpc'],
  },
};

export default nextConfig;
