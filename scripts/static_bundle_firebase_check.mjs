#!/usr/bin/env node
/**
 * D18 proof: the static builds leave Firebase out, and nothing a visitor sees changes.
 *
 * "Before" is a git ref (default HEAD) built in a temporary worktree with Firebase included
 * (PYARCANA_FIREBASE_STUB=0 switches off the stand-ins older refs had; a ref without them ignores
 * it). "After" is this working tree. Both static builds are compared (GitHub Pages "/pyarcana" and
 * pyarcana.dev ""):
 *   1. the same HTML pages exist in both;
 *   2. every page's visible text is identical (scripts, styles, links and React's text markers
 *      removed; chunk names legitimately differ);
 *   3. "before" contains Firebase (the check can detect it) and "after" does not;
 *   4. the JavaScript saved is reported.
 * Usage: node scripts/static_bundle_firebase_check.mjs [--before=<git ref>] [--keep]
 */
import { spawnSync } from 'node:child_process'
import { cpSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, symlinkSync } from 'node:fs'
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

const BEFORE = (process.argv.find((a) => a.startsWith('--before=')) ?? '--before=HEAD').slice('--before='.length)

/** A checkout of the "before" ref, sharing this repository's node_modules. */
function beforeTree() {
  const dir = join(work, 'before-src')
  const r = spawnSync('git', ['worktree', 'add', '--detach', dir, BEFORE], { cwd: ROOT, stdio: ['ignore', 'ignore', 'inherit'] })
  if (r.status !== 0) throw new Error(`git worktree add ${BEFORE} failed`)
  symlinkSync(join(ROOT, 'node_modules'), join(dir, 'node_modules'))
  return dir
}

function build(cwd, basePath, label) {
  const env = { ...process.env, NEXT_PUBLIC_BASE_PATH: basePath, PYARCANA_FIREBASE_STUB: '0' }
  const r = spawnSync('node', ['scripts/build_static_export.mjs'], { cwd, env, stdio: ['ignore', 'ignore', 'inherit'] })
  if (r.status !== 0) throw new Error(`static build failed (${label}, base "${basePath}")`)
  const dest = join(work, `${basePath ? 'pages' : 'root'}-${label}`)
  cpSync(join(cwd, 'out'), dest, { recursive: true })
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
  if (before.length === 0) problems.push(`control failed: the "before" build (${BEFORE}) has no Firebase, so this check proves nothing`)
  if (after.length > 0) problems.push(`Firebase still shipped in: ${after.join(', ')}`)
  const saved = jsBytes(off) - jsBytes(on)
  console.log(`${label}: ${a.length} pages, visible text ${problems.some((p) => p.startsWith('visible')) ? 'DIFFERS' : 'identical'}; Firebase files ${before.length} -> ${after.length}; JavaScript ${jsBytes(off)} -> ${jsBytes(on)} bytes (${saved} saved)`)
  return problems
}

const problems = []
let beforeDir = null
try {
  beforeDir = beforeTree()
  for (const [basePath, label] of [['/pyarcana', 'GitHub Pages (/pyarcana)'], ['', 'pyarcana.dev (root)']]) {
    const off = build(beforeDir, basePath, 'before')
    const on = build(ROOT, basePath, 'after')
    problems.push(...compare(off, on, label).map((p) => `${label}: ${p}`))
  }
} finally {
  if (beforeDir) spawnSync('git', ['worktree', 'remove', '--force', beforeDir], { cwd: ROOT, stdio: 'ignore' })
  if (!process.argv.includes('--keep')) rmSync(work, { recursive: true, force: true })
  else console.log(`kept builds in ${work}`)
}
if (problems.length) {
  console.error(`FAIL\n${problems.join('\n')}`)
  process.exit(1)
}
console.log(`PASS against ${BEFORE}: same pages, same visible text, no Firebase shipped`)
