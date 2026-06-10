import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: false,
  allowedDevOrigins: ["*.lhr.life", "*.loca.lt", "*.trycloudflare.com"]
};

export default nextConfig;
