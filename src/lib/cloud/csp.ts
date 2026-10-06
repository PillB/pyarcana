/**
 * The Content-Security-Policy <meta> of the static export, built from the public config
 * (DESIGN-v2 §8.13, v3 §E). The shipped config (stage off) yields exactly the policy the site
 * shipped before accounts existed; a host is added only when the stage is on AND the feature that
 * needs it is configured. House ads, same-origin '/api' and the QA placeholders need nothing.
 */
import { normalizeOrigin, type CloudConfig } from '@/lib/cloud/config'
import { PYODIDE_CDN } from '@/lib/pyodide'

/**
 * D4 audit (setup thread, 4 Oct 2026), P4:
 * - no Firebase hosts: the Firebase client is bundled but never configured in either static
 *   build (no NEXT_PUBLIC_FIREBASE_*), so those hosts were open and unused. A build that does
 *   configure Firebase (the server edition) must add them back;
 * - jsDelivr only for the Pyodide folder (PYODIDE_CDN), not the whole CDN;
 * - 'wasm-unsafe-eval' instead of 'unsafe-eval': Pyodide compiles WebAssembly and nothing here
 *   evaluates JavaScript strings (checked in Chromium, e2e/usage.e2e.mjs);
 * - 'unsafe-inline' stays: the export's inline scripts change hash on every build (see layout.tsx).
 */
const WASM_EVAL = "'wasm-unsafe-eval'"

const BASE: ReadonlyArray<[string, string[]]> = [
  ['default-src', ["'self'"]],
  ['script-src', ["'self'", "'unsafe-inline'", WASM_EVAL, PYODIDE_CDN]],
  ['style-src', ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com']],
  ['img-src', ["'self'", 'data:', 'https:']],
  ['font-src', ["'self'", 'data:']],
  ['connect-src', ["'self'", PYODIDE_CDN]],
  ['frame-src', []],
  ['object-src', ["'none'"]],
  ['base-uri', ["'self'"]],
  ['form-action', ["'self'"]],
  ['frame-ancestors', ["'none'"]],
  ['upgrade-insecure-requests', []],
]

type Additions = Partial<Record<'script-src' | 'style-src' | 'connect-src' | 'frame-src', string[]>>

function additions(cfg: CloudConfig): Additions[] {
  const out: Additions[] = []
  if (cfg.googleClientId) {
    out.push({
      'script-src': ['https://accounts.google.com/gsi/client'],
      'style-src': ['https://accounts.google.com/gsi/style'],
      'connect-src': ['https://accounts.google.com/gsi/'],
      'frame-src': ['https://accounts.google.com/gsi/'],
    })
  }
  if (cfg.microsoftClientId) out.push({ 'connect-src': ['https://login.microsoftonline.com'] })
  const api = /^https?:\/\//.test(cfg.apiBaseUrl) ? normalizeOrigin(new URL(cfg.apiBaseUrl).origin) : null
  if (api) out.push({ 'connect-src': [api] })
  if (cfg.ads.provider === 'adsense' && cfg.ads.adsenseClient) {
    out.push({
      'script-src': ['https://pagead2.googlesyndication.com'],
      'connect-src': ['https://pagead2.googlesyndication.com'],
      'frame-src': ['https://googleads.g.doubleclick.net', 'https://tpc.googlesyndication.com'],
    })
  }
  if (cfg.ads.provider === 'ethicalads' && cfg.ads.ethicaladsPublisher) {
    // The client script comes from media.ethicalads.io and fetches the ad decision as a JSONP
    // <script> from server.ethicalads.io (ethical-ad-client index.js AD_DECISION_URL), so both hosts
    // belong in script-src; images and view pixels are <img> (img-src https: already allows them).
    // connect-src keeps the decision host too, as before, for a client version that uses fetch.
    out.push({ 'script-src': ['https://media.ethicalads.io', 'https://server.ethicalads.io'], 'connect-src': ['https://server.ethicalads.io'] })
  }
  return out
}

export function buildCsp(cfg: CloudConfig): string {
  const extra = cfg.launchStage === 'off' ? [] : additions(cfg)
  return BASE.map(([name, values]) => {
    const added = extra.flatMap((a) => a[name as keyof Additions] ?? [])
    if (name === 'frame-src') return added.length ? `frame-src 'self' ${[...new Set(added)].join(' ')}` : ''
    return [name, ...values, ...new Set(added)].join(' ')
  })
    .filter((d) => d !== '')
    .join('; ')
}

/**
 * The policy of a build with the stage off (GitHub Pages); the default config must reproduce it
 * byte for byte. Since the D4 audit it no longer equals the pre-accounts policy: Firebase hosts
 * gone, jsDelivr narrowed to Pyodide, 'wasm-unsafe-eval' for 'unsafe-eval'.
 */
export const LEGACY_CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' ${PYODIDE_CDN}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  `connect-src 'self' ${PYODIDE_CDN}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join('; ')

/** Directives a browser ignores in a <meta> policy (CSP3 §3.3), and logs an error for. */
const HEADER_ONLY = new Set(['frame-ancestors', 'report-uri', 'sandbox'])

/**
 * The policy as the <meta http-equiv> copy carries it: buildCsp minus the header-only directives.
 * The Cloudflare build sends the full policy as a header (_headers), where they take effect.
 *
 * `devServer` adds 'unsafe-eval' to script-src for `next dev` only. Its runtime (React Refresh,
 * eval source maps) evaluates strings, so under the strict policy nothing hydrates and every page
 * stays as the server rendered it (the Next.js CSP guide makes the same exception). A build never
 * passes it, and the header copy (buildCsp) has no such option.
 */
export function metaCsp(cfg: CloudConfig, opts: { devServer?: boolean } = {}): string {
  const directives = buildCsp(cfg)
    .split('; ')
    .filter((d) => !HEADER_ONLY.has(d.split(' ')[0]))
  if (!opts.devServer) return directives.join('; ')
  return directives.map((d) => (d.startsWith('script-src ') ? `${d} 'unsafe-eval'` : d)).join('; ')
}
