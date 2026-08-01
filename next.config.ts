import type { NextConfig } from "next";
import { RetryChunkLoadPlugin } from "webpack-retry-chunk-load-plugin";

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

  // Auto-retry failed chunk loads at the webpack level. This catches
  // ChunkLoadError BEFORE it bubbles up to React's error boundary — the user
  // never sees an error at all in the common case. Same plugin Vercel uses
  // internally (see github.com/vercel/next.js/discussions/82651).
  //
  // On a static export (GitHub Pages), ChunkLoadError happens when a user's
  // cached HTML references chunks from a previous deploy but a new deploy
  // renamed them (content hashing). The retry appends a cache-busting query
  // so the CDN re-fetches; if the chunk still doesn't exist after 3 retries,
  // the lastResortScript triggers a hard reload (which fetches fresh HTML
  // with current chunk hashes). global-error.tsx + chunk-guard.js handle any
  // case that still slips through.
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins = config.plugins || [];
      config.plugins.push(
        new RetryChunkLoadPlugin({
          maxRetries: 3,
          // Stringified function — appended to the script src as a cache-busting
          // query so GitHub Pages CDN/Fastly re-fetches rather than serving the
          // same 404 from cache.
          cacheBust:
            'function(chunkId, retries) { return "?retry=" + retries + "&chunk=" + chunkId; }',
          // Stringified code executed in the browser if all retries fail.
          // Hard reload to fetch fresh HTML with current chunk hashes.
          lastResortScript:
            'window.location.reload();',
        })
      );
    }
    return config;
  },
};

export default nextConfig;
