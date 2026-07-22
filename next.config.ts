import type { NextConfig } from "next";

const isStaticExport = process.env.NEXT_OUTPUT === "export";
const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const basePath = configuredBasePath
  ? `/${configuredBasePath.replace(/^\/+|\/+$/g, "")}`
  : "";

const nextConfig: NextConfig = {
  output: isStaticExport ? "export" : "standalone",
  basePath: isStaticExport ? basePath : undefined,
  assetPrefix: isStaticExport ? basePath : undefined,
  images: isStaticExport ? { unoptimized: true } : undefined,
  reactStrictMode: true,
};

export default nextConfig;
