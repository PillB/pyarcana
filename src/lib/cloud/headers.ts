/**
 * Response headers and ads.txt for the Cloudflare deploy (DESIGN-v3 §A step 2, §E, §K).
 *
 * GitHub Pages cannot send headers, so the static export carries its CSP in a <meta> tag
 * (layout.tsx). On Cloudflare Workers Static Assets the deploy script also writes out/_headers,
 * which the platform applies to every asset response. The header CSP is the meta CSP, byte for
 * byte: both are enforced, so any difference would block whatever only one of them allows. As a
 * real header, `frame-ancestors 'none'` works (browsers ignore it in <meta>), and X-Frame-Options
 * covers older browsers.
 *
 * ads.txt authorizes one AdSense publisher to sell ad space on the domain. It is written only when
 * a publisher id is configured, and a malformed id throws: a deploy must stop rather than publish
 * a wrong or injected authorization line.
 *
 * /.well-known/security.txt (RFC 9116) tells researchers where to report a vulnerability. It is
 * written into the root build at deploy time (public/ is a protected path), with Expires 300 days
 * after the build: always under the RFC's one-year advice, renewed by every deploy.
 */
import type { CloudConfig } from '@/lib/cloud/config'
import { buildCsp } from '@/lib/cloud/csp'

/** Cloudflare's per-line limit for a _headers file. */
export const HEADERS_LINE_MAX = 2000

/**
 * - nosniff: a response is only ever read as the type it declares.
 * - Referrer-Policy: other sites see the origin, never the path (a lesson hash or ?billing=return).
 * - X-Frame-Options: no framing (clickjacking), for browsers without frame-ancestors.
 * - HSTS: .dev is HTTPS-only already (preloaded TLD); the header keeps any other host honest.
 * - COOP same-origin-allow-popups: Google's popup sign-in needs its popup to reach window.opener.
 * - Permissions-Policy: no camera, microphone, location, USB or Payment Request API; screen capture
 *   only for this origin (the QA harness uses getDisplayMedia).
 */
export const SECURITY_HEADERS: ReadonlyArray<readonly [string, string]> = [
  ['X-Content-Type-Options', 'nosniff'],
  ['Referrer-Policy', 'strict-origin-when-cross-origin'],
  ['X-Frame-Options', 'DENY'],
  ['Strict-Transport-Security', 'max-age=31536000; includeSubDomains'],
  ['Cross-Origin-Opener-Policy', 'same-origin-allow-popups'],
  ['Permissions-Policy', 'camera=(), microphone=(), geolocation=(), usb=(), payment=(), display-capture=(self)'],
]

/** The _headers file: one rule for every asset path. */
export function buildHeadersFile(cfg: CloudConfig): string {
  const headers: Array<readonly [string, string]> = [['Content-Security-Policy', buildCsp(cfg)], ...SECURITY_HEADERS]
  const lines = ['/*', ...headers.map(([name, value]) => `  ${name}: ${value}`)]
  return `${lines.map(checkHeaderLine).join('\n')}\n`
}

/** A line Cloudflare would reject (too long) or that would split into two (a line break) throws. */
export function checkHeaderLine(line: string): string {
  if (line.length > HEADERS_LINE_MAX || /[\r\n]/.test(line)) throw new Error(`_headers line refused (${line.length} chars)`)
  return line
}

/** Read a _headers file back into {path: {header: value}} (for tests and the deploy check). */
export function parseHeadersFile(text: string): Record<string, Record<string, string>> {
  const rules: Record<string, Record<string, string>> = {}
  let current: Record<string, string> | null = null
  for (const line of text.split('\n')) {
    if (line.trim() === '' || line.trimStart().startsWith('#')) continue
    if (!/^\s/.test(line)) {
      current = {}
      rules[line.trim()] = current
      continue
    }
    const colon = line.indexOf(':')
    if (current && colon > 0) current[line.slice(0, colon).trim()] = line.slice(colon + 1).trim()
  }
  return rules
}

/** Google's certification authority id for AdSense in ads.txt (IAB ads.txt spec, field 4). */
export const GOOGLE_ADS_TXT_CERT = 'f08c47fec0942fa0'
const ADSENSE_CLIENT = /^ca-pub-(\d{16})$/

/** The ads.txt body, or null when no AdSense publisher id is configured. */
export function buildAdsTxt(cfg: CloudConfig): string | null {
  const client = cfg.ads.adsenseClient
  if (client === '') return null
  const m = ADSENSE_CLIENT.exec(client)
  if (!m) throw new Error(`AdSense publisher id must look like ca-pub- followed by 16 digits; got ${JSON.stringify(client)}`)
  return `google.com, pub-${m[1]}, DIRECT, ${GOOGLE_ADS_TXT_CERT}\n`
}

/** Days from the build to security.txt's Expires (RFC 9116 advises less than a year). */
export const SECURITY_TXT_DAYS = 300

/** The security.txt body for the account edition, or null where there is none (stage off). */
export function buildSecurityTxt(cfg: CloudConfig, nowMs: number): string | null {
  if (cfg.launchStage === 'off') return null
  const origin = cfg.canonicalOrigin.replace(/\/+$/, '')
  if (!/^https:\/\/[a-z0-9.-]+$/.test(origin)) throw new Error(`security.txt needs an https canonical origin; got ${JSON.stringify(cfg.canonicalOrigin)}`)
  const host = new URL(origin).hostname
  const expires = new Date(nowMs + SECURITY_TXT_DAYS * 86_400_000).toISOString().replace(/\.\d{3}Z$/, 'Z')
  return [
    `Contact: mailto:security@${host}`,
    `Expires: ${expires}`,
    'Preferred-Languages: es, en',
    `Canonical: ${origin}/.well-known/security.txt`,
    `Policy: ${origin}/security`,
    '',
  ].join('\n')
}
