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
import { createHash } from 'node:crypto'
import type { CloudConfig } from '@/lib/cloud/config'
import { buildCsp } from '@/lib/cloud/csp'

/** Cloudflare's per-line limit for a _headers file. */
export const HEADERS_LINE_MAX = 2000
/** Cloudflare's limit on header rules in a _headers file (workers/static-assets/headers). */
export const HEADERS_RULES_MAX = 100

/**
 * - nosniff: a response is only ever read as the type it declares.
 * - Referrer-Policy: other sites see the origin, never the path (a lesson hash or ?billing=return).
 * - X-Frame-Options: no framing (clickjacking), for browsers without frame-ancestors.
 * - HSTS: .dev is HTTPS-only already (preloaded TLD); the header keeps any other host honest.
 * - COOP same-origin-allow-popups: Google's popup sign-in needs its popup to reach window.opener.
 * - Permissions-Policy: no camera, microphone, location, USB or Payment Request API; screen capture
 *   only for this origin (the QA harness uses getDisplayMedia).
 * - X-Permitted-Cross-Domain-Policies none: no Flash or PDF cross-domain policy file is honoured.
 * - CORP same-origin: our responses cannot be embedded by other sites. It only governs what WE
 *   serve, so loading Pyodide, GIS or MSAL from their hosts is unaffected. No COEP: it would block
 *   the sign-in popups and the Pyodide CDN (D4 audit P5).
 */
export const SECURITY_HEADERS: ReadonlyArray<readonly [string, string]> = [
  ['X-Content-Type-Options', 'nosniff'],
  ['Referrer-Policy', 'strict-origin-when-cross-origin'],
  ['X-Frame-Options', 'DENY'],
  ['Strict-Transport-Security', 'max-age=31536000; includeSubDomains'],
  ['Cross-Origin-Opener-Policy', 'same-origin-allow-popups'],
  ['Permissions-Policy', 'camera=(), microphone=(), geolocation=(), usb=(), payment=(), display-capture=(self)'],
  ['X-Permitted-Cross-Domain-Policies', 'none'],
  ['Cross-Origin-Resource-Policy', 'same-origin'],
]

/** A built page: its path inside out/ (e.g. "privacy.html") and its HTML. */
export interface BuiltPage {
  file: string
  html: string
}

const SCRIPT_TAG = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi
const NON_JS_TYPE = /\btype\s*=\s*["']?(application\/(ld\+)?json|text\/plain)/i

/**
 * The CSP hash source of every inline script a browser would run in this page: <script> without
 * src, and not a JSON data block (which never runs, so CSP does not apply to it). The hash covers
 * the element's text exactly as written, which is what the browser hashes.
 */
export function inlineScriptHashes(html: string): string[] {
  const hashes = new Set<string>()
  for (const m of html.matchAll(SCRIPT_TAG)) {
    if (/\bsrc\s*=/i.test(m[1]) || NON_JS_TYPE.test(m[1])) continue
    hashes.add(`'sha256-${createHash('sha256').update(m[2], 'utf8').digest('base64')}'`)
  }
  return [...hashes]
}

/**
 * The page's header policy (round of 19 Oct 2026, S1): buildCsp with script-src listing the page's
 * inline-script hashes instead of 'unsafe-inline'. Nothing else changes, so it is never looser than
 * the meta copy the page carries.
 */
export function hashedCsp(cfg: CloudConfig, hashes: string[]): string {
  return buildCsp(cfg)
    .split('; ')
    .map((d) => (d.startsWith('script-src ') ? [...d.split(' ').filter((v) => v !== "'unsafe-inline'"), ...hashes].join(' ') : d))
    .join('; ')
}

/** The request paths a page answers: /privacy and /privacy/ for privacy.html, / for index.html. */
export function pagePaths(file: string): string[] {
  const path = `/${file.replace(/\\/g, '/')}`.replace(/(\/index)?\.html$/, '')
  return path === '' ? ['/'] : [path, `${path}/`]
}

/**
 * The _headers file. Every path gets the security headers from one /* rule, whose CSP is 404.html's
 * (missing paths are answered with the 404 page: wrangler.toml not_found_handling). Then one rule
 * per page path detaches that CSP ("! Content-Security-Policy") and sets the page's own. Without
 * the detach line overlapping rules would merge into one comma-joined header, i.e. two enforced
 * policies. Cloudflare's asset worker applies matching rules in file order and, within a rule,
 * removes before it sets (workers-shared asset-worker headers.ts attachCustomHeaders), so /* must
 * come first. With no pages (a unit test, or before a build) the one /* rule carries buildCsp.
 */
export function buildHeadersFile(cfg: CloudConfig, pages: BuiltPage[] = []): string {
  const notFound = pages.find((p) => p.file === '404.html')
  if (pages.length && !notFound) throw new Error('_headers: the build has no 404.html, so missing paths would get no page policy')
  const fallback = notFound ? hashedCsp(cfg, inlineScriptHashes(notFound.html)) : buildCsp(cfg)
  const rules: string[][] = [['/*', `  Content-Security-Policy: ${fallback}`, ...SECURITY_HEADERS.map(([n, v]) => `  ${n}: ${v}`)]]
  for (const page of pages) {
    if (page.file === '404.html') continue
    const csp = hashedCsp(cfg, inlineScriptHashes(page.html))
    for (const path of pagePaths(page.file)) rules.push([path, '  ! Content-Security-Policy', `  Content-Security-Policy: ${csp}`])
  }
  if (rules.length > HEADERS_RULES_MAX) throw new Error(`_headers: ${rules.length} rules, Cloudflare takes at most ${HEADERS_RULES_MAX}`)
  return `${rules.flat().map(checkHeaderLine).join('\n')}\n`
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
    if (current && /^\s*! /.test(line)) {
      current[line.trim()] = ''
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
  // https only, except a local test server (the e2e harness serves http://localhost:8787).
  if (!/^https:\/\/[a-z0-9.-]+$/.test(origin) && !/^http:\/\/localhost(:\d+)?$/.test(origin)) {
    throw new Error(`security.txt needs an https canonical origin; got ${JSON.stringify(cfg.canonicalOrigin)}`)
  }
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

/** Paths never listed in the sitemap: sign-in, admin, testers, credential lookups, capstone briefs. */
export const SITEMAP_EXCLUDED = ['/admin', '/cuenta', '/qa', '/verify', '/capstones']

/**
 * sitemap.xml for the account edition (round of 19 Oct 2026, S21): every built public page, at the
 * canonical origin. Google: a sitemap helps a site that "is new and has few external links". Null
 * at stage off (the GitHub Pages edition keeps its own robots.txt and no sitemap).
 */
export function buildSitemap(cfg: CloudConfig, pages: BuiltPage[]): string | null {
  if (cfg.launchStage === 'off') return null
  const origin = cfg.canonicalOrigin.replace(/\/+$/, '')
  const paths = pages
    .filter((p) => p.file !== '404.html' && !p.file.startsWith('_'))
    .map((p) => pagePaths(p.file)[0])
    .filter((path) => !SITEMAP_EXCLUDED.some((x) => path === x || path.startsWith(`${x}/`)))
    .sort()
  const urls = paths.map((path) => `  <url><loc>${origin}${path === '/' ? '/' : path}</loc></url>`)
  return ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...urls, '</urlset>', ''].join('\n')
}

/** robots.txt with the Sitemap line appended once (Cloudflare prepends its managed block; ours follows). */
export function robotsWithSitemap(cfg: CloudConfig, robots: string): string | null {
  if (cfg.launchStage === 'off') return null
  const line = `Sitemap: ${cfg.canonicalOrigin.replace(/\/+$/, '')}/sitemap.xml`
  const body = robots.split('\n').filter((l) => !/^Sitemap:/i.test(l.trim())).join('\n').replace(/\n*$/, '\n')
  return `${body}\n${line}\n`
}
