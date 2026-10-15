import type { NextConfig } from "next";

const isVercel = process.env.VERCEL === "1";

const nextConfig: NextConfig = {
  output: isVercel ? undefined : "export",
  devIndicators: false,
  experimental:
    process.env.TECH_NOTE_SERIAL_BUILD === "1" ? { cpus: 1 } : undefined,
  basePath: "/tech-note",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
