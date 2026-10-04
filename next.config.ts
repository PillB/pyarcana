import path from "node:path";
import type { NextConfig } from "next";
import { RetryChunkLoadPlugin } from "webpack-retry-chunk-load-plugin";

const isStaticExport = process.env.NEXT_OUTPUT === "export";
// D16 (5 Oct 2026): the static builds never configure Firebase (no NEXT_PUBLIC_FIREBASE_*, and the
// CSP refuses its hosts), so they get null stand-ins instead of ~280 KB of Firebase. The server
// edition and dev are untouched. PYARCANA_FIREBASE_STUB=0 turns it off, for the before/after check
// (scripts/static_bundle_firebase_check.mjs) or to undo it.
const stubFirebase = process.env.NEXT_PUBLIC_STATIC_SITE === "1" && process.env.PYARCANA_FIREBASE_STUB !== "0";
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
  webpack: (config, { isServer, webpack }) => {
    if (stubFirebase) {
      // "@/lib/firebase/client" is resolved through tsconfig paths before resolve.alias could match
      // it, so the replacement keys on the RESOLVED file instead; the package import is an alias.
      config.plugins = config.plugins || [];
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /[\\/]src[\\/]lib[\\/]firebase[\\/]client(\.ts)?$/,
          path.resolve(process.cwd(), "src/lib/firebase/client.static.ts"),
        ),
      );
      config.resolve = config.resolve || {};
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        "firebase/auth$": path.resolve(process.cwd(), "src/lib/firebase/auth.static.ts"),
      };
    }
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
