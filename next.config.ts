import type { NextConfig } from "next";

// Static export: the whole app runs client-side against IndexedDB, so it deploys
// to Vercel (or any static host) with no server.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};
export default nextConfig;
