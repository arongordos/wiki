import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      new URL(`${process.env.BLOB_BASE_URL}/**`),
    ],
  },
};

export default nextConfig;
