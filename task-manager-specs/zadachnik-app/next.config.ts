import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: false,
  outputFileTracingRoot: __dirname,
  allowedDevOrigins: ["*.lhr.life", "*.loca.lt", "*.trycloudflare.com"]
};

export default nextConfig;
