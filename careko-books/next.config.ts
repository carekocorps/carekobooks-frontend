import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.carekobooks.space",
        pathname: "/images/**", 
      },
    ],
  },
};

export default nextConfig;
