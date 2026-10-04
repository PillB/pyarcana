#!/usr/bin/env node
/**
 * D16 proof: the Firebase stand-ins change the static builds' bundle and nothing a visitor sees.
 *
 * For each static build (GitHub Pages "/pyarcana" and pyarcana.dev ""), the SAME source is built
 * twice: once with the stand-ins off (PYARCANA_FIREBASE_STUB=0, today's bundle) and once with them
 * on. Then:
 *   1. the same HTML pages exist in both;
 *   2. every page's visible text is identical (scripts, styles, links and React's text markers
 *      removed; chunk names legitimately differ);
 *   3. the "off" build contains Firebase (the check can detect it) and the "on" build does not;
 *   4. the JavaScript saved is reported.
 * Usage: node scripts/static_bundle_firebase_check.mjs [--keep]   (about 4 builds; minutes each)
 */
import { spawnSync } from 'node:child_process'
import { cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const MARKERS = /identitytoolkit\.googleapis|firestore\.googleapis|securetoken\.googleapis|@firebase\/(?:app|auth|firestore)/
const work = mkdtempSync(join(tmpdir(), 'pyarcana-firebase-check-'))

function files(dir, pick) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name)
    return statSync(full).isDirectory() ? files(full, pick) : pick(full) ? [full] : []
  })
}

function build(basePath, stub) {
  const env = { ...process.env, NEXT_PUBLIC_BASE_PATH: basePath, PYARCANA_FIREBASE_STUB: stub ? '1' : '0' }
  const r = spawnSync('node', ['scripts/build_static_export.mjs'], { cwd: ROOT, env, stdio: ['ignore', 'ignore', 'inherit'] })
  if (r.status !== 0) throw new Error(`static build failed (base "${basePath}", stub ${stub})`)
  const dest = join(work, `${basePath ? 'pages' : 'root'}-${stub ? 'on' : 'off'}`)
  cpSync(join(ROOT, 'out'), dest, { recursive: true })
  return dest
}

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<link[^>]*>/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function jsBytes(dir) {
  return files(dir, (f) => f.endsWith('.js')).reduce((n, f) => n + statSync(f).size, 0)
}

function firebaseFiles(dir) {
  return files(dir, (f) => /\.(js|html)$/.test(f)).filter((f) => MARKERS.test(readFileSync(f, 'utf8'))).map((f) => relative(dir, f))
}

function compare(off, on, label) {
  const pages = (d) => files(d, (f) => f.endsWith('.html')).map((f) => relative(d, f)).sort()
  const [a, b] = [pages(off), pages(on)]
  const problems = []
  if (JSON.stringify(a) !== JSON.stringify(b)) problems.push(`page lists differ: ${a.length} vs ${b.length}`)
  for (const page of a.filter((p) => b.includes(p))) {
    if (visibleText(readFileSync(join(off, page), 'utf8')) !== visibleText(readFileSync(join(on, page), 'utf8'))) problems.push(`visible text differs: ${page}`)
  }
  const before = firebaseFiles(off)
  const after = firebaseFiles(on)
  if (before.length === 0) problems.push('control failed: the build without stand-ins has no Firebase, so this check proves nothing')
  if (after.length > 0) problems.push(`Firebase still shipped in: ${after.join(', ')}`)
  const saved = jsBytes(off) - jsBytes(on)
  console.log(`${label}: ${a.length} pages, visible text ${problems.some((p) => p.startsWith('visible')) ? 'DIFFERS' : 'identical'}; Firebase files ${before.length} -> ${after.length}; JavaScript ${jsBytes(off)} -> ${jsBytes(on)} bytes (${saved} saved)`)
  return problems
}

const problems = []
try {
  for (const [basePath, label] of [['/pyarcana', 'GitHub Pages (/pyarcana)'], ['', 'pyarcana.dev (root)']]) {
    const off = build(basePath, false)
    const on = build(basePath, true)
    problems.push(...compare(off, on, label).map((p) => `${label}: ${p}`))
  }
} finally {
  if (!process.argv.includes('--keep')) rmSync(work, { recursive: true, force: true })
  else console.log(`kept builds in ${work}`)
}
if (problems.length) {
  console.error(`FAIL\n${problems.join('\n')}`)
  process.exit(1)
}
console.log('PASS: same pages, same visible text, no Firebase shipped')
