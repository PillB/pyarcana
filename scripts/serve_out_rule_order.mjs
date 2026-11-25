#!/usr/bin/env node
/**
 * Serve a built static export (out/) and apply its out/_headers the way Cloudflare's asset worker
 * does, under a chosen RULE ORDER (headers.ts simulateHeaders): `file`, `sorted` or `reversed`.
 *
 * Why: on 24 Nov 2026 pyarcana.dev applied the "/" rule before "/*" (byte-sorted keys) while
 * `wrangler dev` keeps file order, so every local check passed and the live home page never
 * hydrated. `--order sorted` replays production's order locally; run browser checks against it.
 *
 *   node --import tsx scripts/serve_out_rule_order.mjs [--out out] [--port 8788] [--order sorted]
 *
 * Paths: "/" -> index.html, "/x" and "/x/" -> x.html, files as they are, anything else -> 404.html
 * with status 404 (wrangler.toml not_found_handling = "404-page"). Refuses to start (exit 1) when
 * out/ has no index.html or no _headers, saying which and what to run.
 */
import { createServer } from 'node:http'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'
import { simulateHeaders, RULE_ORDERS } from '../src/lib/cloud/headers.ts'

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`)
  return i > 0 ? process.argv[i + 1] : fallback
}
const outDir = resolve(arg('out', 'out'))
const port = Number(arg('port', '8788'))
const order = arg('order', 'sorted')
const refuse = (msg) => {
  console.error(`serve_out_rule_order: REFUSED: ${msg}`)
  process.exit(1)
}
if (!RULE_ORDERS.includes(order)) refuse(`--order ${order}; expected one of ${RULE_ORDERS.join(', ')}`)
if (!existsSync(join(outDir, 'index.html'))) refuse(`${outDir}/index.html is missing; run NEXT_PUBLIC_BASE_PATH= node scripts/build_static_export.mjs`)
if (!existsSync(join(outDir, '_headers'))) refuse(`${outDir}/_headers is missing; run node scripts/cloud-headers.mjs ${outDir}`)
const headersText = readFileSync(join(outDir, '_headers'), 'utf8')

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.txt': 'text/plain', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json', '.xml': 'application/xml', '.wasm': 'application/wasm' }

function isFile(p) {
  return existsSync(p) && statSync(p).isFile()
}

/** The file a request path resolves to, and its status. */
function resolveFile(pathname) {
  const clean = decodeURIComponent(pathname).replace(/\/+$/, '') || '/'
  if (clean.includes('..')) return { file: join(outDir, '404.html'), status: 404 }
  const candidates = clean === '/' ? ['index.html'] : [clean.slice(1), `${clean.slice(1)}.html`, `${clean.slice(1)}/index.html`]
  const hit = candidates.map((c) => join(outDir, c)).find(isFile)
  return hit ? { file: hit, status: 200 } : { file: join(outDir, '404.html'), status: 404 }
}

createServer((req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost')
  const { file, status } = resolveFile(pathname)
  const headers = { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' }
  for (const [name, values] of Object.entries(simulateHeaders(headersText, pathname, order))) headers[name] = values
  res.writeHead(status, headers)
  res.end(readFileSync(file))
}).listen(port, () => console.log(`serve_out_rule_order: ${outDir} on http://localhost:${port} (rule order: ${order})`))
