import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.fanclub-bbb.shop",
        pathname: "/images/**", 
      },
    ],
  },
};

export default nextConfig;
