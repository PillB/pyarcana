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
 * The _headers file. Every path gets the security headers from one /* rule, then one rule per page
 * path detaches the /* CSP ("! Content-Security-Policy") and sets the page's own, hashed policy.
 *
 * The /* policy is buildCsp itself: script-src with 'unsafe-inline' and NO hashes. It must never be
 * stricter than any page's policy, because the rule order is not ours to rely on. Cloudflare's docs
 * and workers-shared apply rules in file order, but pyarcana.dev answered "/" with the page policy
 * FIRST and the /* policy appended after it (24 Nov 2026, c33c9503): two enforced policies, and the
 * /* one (then 404.html's hashes) blocked 9 of the home page's 12 inline scripts, so React never
 * hydrated (no Entrar button, dead theme and language toggles). "/" is the only rule key that sorts
 * byte-wise before "/*", and every other page kept one header, so the platform appears to sort rule
 * keys; whatever it does, the detach only works when /* comes first. With a lenient /*, either order
 * gives the page's hashed policy: alone, or intersected with a policy that allows every inline
 * script. verifyHeadersFile proves that for every page under file, sorted and reversed order.
 *
 * Trade-off: a missing path (the 404 page) gets the 'unsafe-inline' policy, as its <meta> copy
 * already does, instead of 404.html's hashes. A hashed /* cannot be made order-proof: it would need
 * every page's hashes (114 on 24 Nov 2026, about 6,300 characters, over Cloudflare's 2,000-character
 * line limit). The 404 page is static and renders nothing from the request.
 */
export function buildHeadersFile(cfg: CloudConfig, pages: BuiltPage[] = []): string {
  const notFound = pages.find((p) => p.file === '404.html')
  if (pages.length && !notFound) throw new Error('_headers: the build has no 404.html, so missing paths would be answered with no page at all (wrangler.toml not_found_handling = "404-page")')
  const rules: string[][] = [['/*', `  Content-Security-Policy: ${buildCsp(cfg)}`, ...SECURITY_HEADERS.map(([n, v]) => `  ${n}: ${v}`)]]
  for (const page of pages) {
    if (page.file === '404.html') continue
    const csp = hashedCsp(cfg, inlineScriptHashes(page.html))
    for (const path of pagePaths(page.file)) rules.push([path, '  ! Content-Security-Policy', `  Content-Security-Policy: ${csp}`])
  }
  if (rules.length > HEADERS_RULES_MAX) throw new Error(`_headers: ${rules.length} rules, Cloudflare takes at most ${HEADERS_RULES_MAX}`)
  return `${rules.flat().map(checkHeaderLine).join('\n')}\n`
}

/** The rule orders verifyHeadersFile tries: the file's, byte-sorted keys (what "/" showed live), reversed. */
export const RULE_ORDERS = ['file', 'sorted', 'reversed'] as const
export type RuleOrder = (typeof RULE_ORDERS)[number]

/** Cloudflare's rule pattern: "*" matches anything, the rest literally (workers-shared rules-engine). */
function ruleMatches(rule: string, path: string): boolean {
  const re = rule.split('*').map((part) => part.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')).join('.*')
  return new RegExp(`^${re}$`).test(path)
}

/**
 * The header values a path would receive, applying the matching rules in the given order the way
 * Cloudflare's asset worker does (workers-shared asset-worker attachCustomHeaders): per rule, delete
 * the detached headers, then set each header the first time and append it after that.
 */
export function simulateHeaders(text: string, path: string, order: RuleOrder): Record<string, string[]> {
  const parsed = parseHeadersFile(text)
  let keys = Object.keys(parsed)
  if (order === 'sorted') keys = [...keys].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
  if (order === 'reversed') keys = [...keys].reverse()
  const out: Record<string, string[]> = {}
  const set = new Set<string>()
  for (const key of keys.filter((k) => ruleMatches(k, path))) {
    const entries = Object.entries(parsed[key])
    for (const [name] of entries.filter(([n]) => n.startsWith('! '))) delete out[name.slice(2).toLowerCase()]
    for (const [name, value] of entries.filter(([n]) => !n.startsWith('! '))) {
      const lower = name.toLowerCase()
      out[lower] = set.has(lower) ? [...(out[lower] ?? []), value] : [value]
      set.add(lower)
    }
  }
  return out
}

/**
 * Whether one CSP lets an inline script with this hash source run (CSP3 "does a source list allow
 * all inline behavior"): listed by hash, or 'unsafe-inline' with no hash or nonce in the list
 * (a hash or nonce makes browsers ignore 'unsafe-inline'). script-src falls back to default-src.
 */
export function policyAllowsInline(policy: string, hash: string): boolean {
  const directives = policy.split(';').map((d) => d.trim().split(/\s+/))
  const list = directives.find((d) => d[0] === 'script-src') ?? directives.find((d) => d[0] === 'default-src')
  if (!list) return true
  const sources = list.slice(1)
  if (sources.includes(hash)) return true
  return sources.includes("'unsafe-inline'") && !sources.some((s) => /^'(sha(256|384|512)|nonce)-/.test(s))
}

/**
 * Every way the _headers file would block a page's own inline scripts: for each page path (and a
 * missing path, answered with 404.html), under every RULE_ORDERS order, every enforced CSP must
 * allow every inline script of the page. Empty means the file is safe whatever order the platform
 * uses. Each failure names the path, the order, how many policies arrived and what they block.
 */
export function verifyHeadersFile(text: string, pages: BuiltPage[]): string[] {
  const failures: string[] = []
  const targets = pages.flatMap((page) =>
    page.file === '404.html' ? [{ path: '/__pyarcana-missing-path__', page }] : pagePaths(page.file).map((path) => ({ path, page })),
  )
  for (const { path, page } of targets) {
    const hashes = inlineScriptHashes(page.html)
    for (const order of RULE_ORDERS) {
      const policies = simulateHeaders(text, path, order)['content-security-policy'] ?? []
      if (policies.length === 0) failures.push(`${path} (${order} order): no Content-Security-Policy at all; expected the page's hashed policy`)
      policies.forEach((policy, i) => {
        const blocked = hashes.filter((h) => !policyAllowsInline(policy, h))
        if (blocked.length) failures.push(`${path} (${order} order): policy ${i + 1} of ${policies.length} blocks ${blocked.length} of ${hashes.length} inline scripts of ${page.file}, e.g. ${blocked[0]}`)
      })
    }
  }
  return failures
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
