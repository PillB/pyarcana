/**
 * out/_headers and out/ads.txt for the Cloudflare deploy (DESIGN-v3 §A step 2, §E, §K).
 *
 * - _headers carries the SAME Content-Security-Policy as the <meta> tag (so the two can never
 *   disagree and block each other), as a real header where frame-ancestors actually works, plus
 *   the standard security headers. Cloudflare refuses a _headers line over 2000 characters.
 * - ads.txt exists only when an AdSense publisher id is configured, and a malformed id stops the
 *   deploy instead of publishing a broken or injected authorization line.
 * - scripts/cloud-headers.mjs writes both from the committed config into a built out/ directory.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { CLOUD_CONFIG, type CloudConfig } from '@/lib/cloud/config'
import { buildCsp, LEGACY_CSP } from '@/lib/cloud/csp'
import { buildAdsTxt, buildHeadersFile, buildSecurityTxt, buildSitemap, checkHeaderLine, hashedCsp, robotsWithSitemap, inlineScriptHashes, pagePaths, parseHeadersFile, SECURITY_TXT_DAYS, type BuiltPage } from '@/lib/cloud/headers'
import { createHash } from 'node:crypto'

const ON: CloudConfig = {
  ...structuredClone(CLOUD_CONFIG),
  launchStage: 'paid',
  canonicalOrigin: 'https://pyarcana.dev',
  apiBaseUrl: 'https://api.pyarcana.dev',
  googleClientId: 'x.apps.googleusercontent.com',
  microsoftClientId: '11111111-2222-3333-4444-555555555555',
  ads: { provider: 'adsense', adsenseClient: 'ca-pub-1234567890123456', adsenseSlots: { section_end: '1' }, ethicaladsPublisher: '' },
}

test('_headers: one rule for every asset, the meta CSP as a header, standard security headers', () => {
  const text = buildHeadersFile(CLOUD_CONFIG)
  const rules = parseHeadersFile(text)
  assert.deepEqual(Object.keys(rules), ['/*'])
  const h = rules['/*']
  assert.equal(h['Content-Security-Policy'], buildCsp(CLOUD_CONFIG))
  assert.equal(h['Content-Security-Policy'], LEGACY_CSP)
  assert.match(h['Content-Security-Policy'], /frame-ancestors 'none'/)
  assert.equal(h['X-Content-Type-Options'], 'nosniff')
  assert.equal(h['X-Frame-Options'], 'DENY')
  assert.equal(h['Referrer-Policy'], 'strict-origin-when-cross-origin')
  assert.match(h['Strict-Transport-Security'], /^max-age=\d{8,}/)
  // Google's popup sign-in needs its popup to keep window.opener (GIS documentation).
  assert.equal(h['Cross-Origin-Opener-Policy'], 'same-origin-allow-popups')
  // The QA harness captures the screen with getDisplayMedia: display-capture must stay allowed.
  assert.match(h['Permissions-Policy'], /display-capture=\(self\)/)
  assert.match(h['Permissions-Policy'], /camera=\(\)/)
  // D4 audit P5: two cheap headers; never COEP (it would block the sign-in popups and the Pyodide CDN).
  assert.equal(h['X-Permitted-Cross-Domain-Policies'], 'none')
  assert.equal(h['Cross-Origin-Resource-Policy'], 'same-origin')
  assert.equal(h['Cross-Origin-Embedder-Policy'], undefined)
})

test('_headers follows the config: provider hosts appear in the header exactly as in the meta tag', () => {
  const h = parseHeadersFile(buildHeadersFile(ON))['/*']
  assert.equal(h['Content-Security-Policy'], buildCsp(ON))
  for (const host of ['https://accounts.google.com/gsi/client', 'https://login.microsoftonline.com', 'https://pagead2.googlesyndication.com', 'https://api.pyarcana.dev']) {
    assert.ok(h['Content-Security-Policy'].includes(host), host)
  }
})

test('every _headers line fits Cloudflare\'s 2000-character limit, even with every provider on', () => {
  for (const cfg of [CLOUD_CONFIG, ON]) {
    for (const line of buildHeadersFile(cfg).split('\n')) assert.ok(line.length <= 2000, `${line.length} chars`)
  }
})

test('a line over 2000 characters, or one holding a line break, is refused instead of written', () => {
  const at = (n: number) => `  X-Test: ${'a'.repeat(n - 10)}`
  assert.equal(checkHeaderLine(at(2000)).length, 2000)
  assert.throws(() => checkHeaderLine(at(2001)), /refused/)
  assert.throws(() => checkHeaderLine('  X-Test: a\n  Set-Cookie: x=1'), /refused/)
  assert.throws(() => checkHeaderLine('  X-Test: a\r'), /refused/)
})

test('ads.txt: none without an AdSense id; the Google line for a well-formed id', () => {
  assert.equal(buildAdsTxt(CLOUD_CONFIG), null)
  assert.equal(buildAdsTxt(ON), 'google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0\n')
})

test('ads.txt: a malformed or injected publisher id is refused, never published', () => {
  for (const bad of ['ca-pub-1', 'pub-1234567890123456', 'ca-pub-123456789012345x', 'ca-pub-1234567890123456\ngoogle.com, pub-6666666666666666, DIRECT', ' ca-pub-1234567890123456']) {
    const cfg = { ...ON, ads: { ...ON.ads, adsenseClient: bad } }
    assert.throws(() => buildAdsTxt(cfg), /AdSense/, JSON.stringify(bad))
  }
})

// --- the CLI --------------------------------------------------------------------------------------

const SCRIPT = join(process.cwd(), 'scripts/cloud-headers.mjs')
const INDEX = '<!doctype html><script>self.__next_f.push([1,"a"])</script>'
const NOT_FOUND = '<!doctype html><script>console.log(404)</script>'
const run = (dir: string) => spawnSync(process.execPath, [SCRIPT, dir], { encoding: 'utf8' })

test('CLI: writes _headers from the committed config into a built out/ and no ads.txt by default', () => {
  const dir = mkdtempSync(join(tmpdir(), 'pa-out-'))
  writeFileSync(join(dir, 'index.html'), INDEX)
  writeFileSync(join(dir, '404.html'), NOT_FOUND)
  const r = run(dir)
  assert.equal(r.status, 0, r.stderr)
  assert.equal(readFileSync(join(dir, '_headers'), 'utf8'), buildHeadersFile(CLOUD_CONFIG, [{ file: '404.html', html: NOT_FOUND }, { file: 'index.html', html: INDEX }]))
  assert.equal(existsSync(join(dir, 'ads.txt')), false)
})

test('CLI: refuses a directory that is not a built export, and writes nothing there', () => {
  const dir = mkdtempSync(join(tmpdir(), 'pa-empty-'))
  const r = run(dir)
  assert.notEqual(r.status, 0)
  assert.deepEqual(readdirSync(dir), [])
})

test('CLI: a stale ads.txt with no AdSense id configured stops the deploy', () => {
  const dir = mkdtempSync(join(tmpdir(), 'pa-stale-'))
  writeFileSync(join(dir, 'index.html'), INDEX)
  writeFileSync(join(dir, '404.html'), NOT_FOUND)
  writeFileSync(join(dir, 'ads.txt'), 'google.com, pub-6666666666666666, DIRECT, f08c47fec0942fa0\n')
  const r = run(dir)
  assert.notEqual(r.status, 0)
  assert.match(r.stderr, /ads\.txt/)
})

// --- security.txt (RFC 9116; audit 10.1) -----------------------------------------------------------

test('security.txt: contact, an Expires under a year renewed per build, languages and canonical; none at stage off', () => {
  const now = Date.parse('2026-10-05T12:00:00.000Z')
  const body = buildSecurityTxt(ON, now)!
  const fields = Object.fromEntries(body.trim().split('\n').map((l) => [l.slice(0, l.indexOf(':')), l.slice(l.indexOf(':') + 2)]))
  assert.equal(fields.Contact, 'mailto:security@pyarcana.dev')
  assert.equal(fields['Preferred-Languages'], 'es, en')
  assert.equal(fields.Canonical, 'https://pyarcana.dev/.well-known/security.txt')
  assert.match(fields.Expires, /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/)
  const days = (Date.parse(fields.Expires) - now) / 86_400_000
  assert.ok(days === SECURITY_TXT_DAYS && days < 365, `Expires ${days} days ahead`)
  assert.ok(body.endsWith('\n'))
  assert.equal(buildSecurityTxt({ ...ON, launchStage: 'off' }, now), null, 'the GitHub Pages build has no account edition to report on')
  assert.throws(() => buildSecurityTxt({ ...ON, canonicalOrigin: 'http://pyarcana.dev' }, now), /https/)
  assert.match(buildSecurityTxt({ ...ON, canonicalOrigin: 'http://localhost:8787' }, now)!, /^Contact: mailto:security@localhost$/m, 'the local e2e server')
})

test('CLI: a root build (base path "") also gets /.well-known/security.txt', () => {
  const dir = mkdtempSync(join(tmpdir(), 'pa-root-'))
  writeFileSync(join(dir, 'index.html'), INDEX)
  writeFileSync(join(dir, '404.html'), NOT_FOUND)
  writeFileSync(join(dir, 'deployment.json'), JSON.stringify({ base_path: '' }))
  const r = run(dir)
  assert.equal(r.status, 0, r.stderr)
  assert.match(readFileSync(join(dir, '.well-known', 'security.txt'), 'utf8'), /^Contact: mailto:security@pyarcana\.dev\n/)
})

// --- per-page CSP hashes (round of 19 Oct 2026, S1) -----------------------------------------------

const sha = (text: string) => `'sha256-${createHash('sha256').update(text, 'utf8').digest('base64')}'`
const script = (cspOf: string) => cspOf.split('; ').find((d) => d.startsWith('script-src ')) ?? ''

test('inlineScriptHashes: every inline script a browser runs, hashed as written; never src= or JSON data blocks', () => {
  const guard = "(function(){window.__g=1})()"
  const push = 'self.__next_f.push([1,"<x>&amp;"])'
  const html = `<head><script>${guard}</script><script src="/_next/a.js" async=""></script><script type="application/ld+json">{"a":1}</script>` +
    `<script id="__NEXT_DATA__" type="application/json">{}</script></head><body><script>${push}</script><script>${guard}</script></body>`
  assert.deepEqual(inlineScriptHashes(html), [sha(guard), sha(push)], 'one hash per distinct inline script, in page order')
  assert.equal(sha('alert(1)'), "'sha256-bhHHL3z2vDgxUt0W3dWQOrprscmda2Y5pLsLg4GF+pI='", 'the CSP sha256 form (base64 of the SHA-256 of the text)')
})

test('hashedCsp: script-src drops \'unsafe-inline\' for the hashes; nothing else changes', () => {
  const strict = hashedCsp(ON, [sha('a'), sha('b')])
  assert.doesNotMatch(script(strict), /'unsafe-inline'/)
  assert.ok(script(strict).endsWith(`${sha('a')} ${sha('b')}`))
  assert.equal(strict.replace(` ${sha('a')} ${sha('b')}`, '').replace(script(strict).replace(` ${sha('a')} ${sha('b')}`, ''), script(buildCsp(ON))), buildCsp(ON))
  assert.match(strict, /style-src 'self' 'unsafe-inline'/, 'styles are out of scope (Observatory scores script-src)')
})

test('pagePaths: the paths a built page answers, with and without the trailing slash', () => {
  assert.deepEqual(pagePaths('index.html'), ['/'])
  assert.deepEqual(pagePaths('privacy.html'), ['/privacy', '/privacy/'])
  assert.deepEqual(pagePaths('docs/index.html'), ['/docs', '/docs/'])
  assert.deepEqual(pagePaths('docs/a.html'), ['/docs/a', '/docs/a/'])
})

test('_headers with pages: /* first with 404.html\'s hashes, then per path a detach line and that page\'s own policy', () => {
  const pages: BuiltPage[] = [
    { file: '404.html', html: '<script>nf()</script>' },
    { file: 'index.html', html: '<script>home()</script>' },
    { file: 'privacy.html', html: '<script>priv()</script>' },
  ]
  const text = buildHeadersFile(ON, pages)
  assert.deepEqual(text.split('\n').filter((l) => l && !/^\s/.test(l)), ['/*', '/', '/privacy', '/privacy/'], 'file order: Cloudflare applies matching rules in it')
  const rules = parseHeadersFile(text)
  assert.equal(rules['/*']['Content-Security-Policy'], hashedCsp(ON, [sha('nf()')]))
  assert.equal(rules['/*']['X-Frame-Options'], 'DENY', 'the security headers stay on every path')
  for (const [path, body] of [['/', 'home()'], ['/privacy', 'priv()'], ['/privacy/', 'priv()']]) {
    assert.ok('! Content-Security-Policy' in rules[path], `${path} detaches the /* policy, or the two would be comma-joined into two`)
    assert.equal(rules[path]['Content-Security-Policy'], hashedCsp(ON, [sha(body)]))
  }
  assert.throws(() => buildHeadersFile(ON, pages.slice(1)), /404\.html/)
})

test('_headers refuses more than 100 rules and lines over 2000 characters instead of writing them', () => {
  const nf = { file: '404.html', html: '' }
  const many = Array.from({ length: 50 }, (_, i) => ({ file: `p${i}.html`, html: '' }))
  assert.doesNotThrow(() => buildHeadersFile(ON, [nf, ...many.slice(0, 49)]), '99 rules fit')
  assert.throws(() => buildHeadersFile(ON, [nf, ...many]), /101 rules/)
  const crowded = { file: 'x.html', html: Array.from({ length: 30 }, (_, i) => `<script>s${i}()</script>`).join('') }
  assert.throws(() => buildHeadersFile(ON, [nf, crowded]), /_headers line refused/)
})

// --- sitemap.xml and robots.txt (round of 19 Oct 2026, S21) ----------------------------------------

test('sitemap.xml: public pages at the canonical origin; never admin, account, QA, verify or capstones; none at stage off', () => {
  const pages = ['index.html', 'privacy.html', 'admin.html', 'cuenta.html', 'qa.html', 'verify.html', '404.html', '_not-found.html', 'capstones/x.html', 'empezar.html'].map((file) => ({ file, html: '' }))
  const xml = buildSitemap(ON, pages)!
  assert.deepEqual([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]), ['https://pyarcana.dev/', 'https://pyarcana.dev/empezar', 'https://pyarcana.dev/privacy'])
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>\n<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/)
  assert.equal(buildSitemap({ ...ON, launchStage: 'off' }, pages), null)
})

test('robots.txt gains exactly one Sitemap line, after our rules; none at stage off', () => {
  const once = robotsWithSitemap(ON, 'User-agent: *\nAllow: /\n')!
  assert.equal(once, 'User-agent: *\nAllow: /\n\nSitemap: https://pyarcana.dev/sitemap.xml\n')
  assert.equal(robotsWithSitemap(ON, once), once, 'running the deploy step twice adds no second line')
  assert.equal(robotsWithSitemap({ ...ON, launchStage: 'off' }, 'x'), null)
})
