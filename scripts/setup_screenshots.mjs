#!/usr/bin/env node
/**
 * Sesión 0 screenshots: take the browser ones, and report which are missing or stale.
 *
 *   node --import tsx scripts/setup_screenshots.mjs --report        # what exists, what is due
 *   node --import tsx scripts/setup_screenshots.mjs --take          # capture every browser shot
 *   node --import tsx scripts/setup_screenshots.mjs --take --only gh-signup-form
 *
 * The retake routine (DESIGN.md §7): run --report monthly and whenever python.org, git-scm.com,
 * GitHub or VS Code change their download pages; --take refreshes every page that a script can
 * reach. Installer and desktop captures (source 'owner-capture') cannot be scripted: --report
 * lists them for the owner to retake by hand on Windows and macOS.
 *
 * Needs Chromium (CHROMIUM=…, else /opt/pw-browsers/chromium, else Playwright's own) and network
 * access to the pages. The Claude Code cloud sandbox of 5 Oct 2026 could not reach python.org,
 * git-scm.com, code.visualstudio.com or github.com pages (proxy policy, ERR_TUNNEL_CONNECTION_FAILED),
 * so this script was exercised there only against a local page (workers/billing/e2e/setup.e2e.mjs).
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SHOT_DIR = path.join(ROOT, 'src/assets/setup')
const RECORDS = path.join(SHOT_DIR, 'shots.json')
export const VIEWPORT = Object.freeze({ width: 1280, height: 800 })

/** Box of `rect` as percentages of the viewport, rounded to 0.1, padded by 0.6 so the line clears the text. */
export function percentBox(rect, vp = VIEWPORT) {
  const pad = 0.6
  const r1 = (n) => Math.round(n * 10) / 10
  const x = Math.max(0, (rect.x / vp.width) * 100 - pad)
  const y = Math.max(0, (rect.y / vp.height) * 100 - pad)
  const w = Math.min(100 - x, (rect.width / vp.width) * 100 + 2 * pad)
  const h = Math.min(100 - y, (rect.height / vp.height) * 100 + 2 * pad)
  return { x: r1(x), y: r1(y), w: r1(w), h: r1(h) }
}

/**
 * The box around the spec's selector, or undefined with a warning when it cannot be measured.
 * Pages change: a picture without a box is still true, a box around the wrong thing is not, and a
 * capture that throws leaves nothing at all. Look at every capture before committing it.
 */
async function measureBox(page, spec) {
  const el = page.locator(spec.selector).first()
  if ((await el.count()) === 0) return warnNoBox(spec, 'matches nothing on the page')
  await el.scrollIntoViewIfNeeded()
  const rect = await el.boundingBox()
  if (!rect) return warnNoBox(spec, 'is not visible')
  if (rect.y < 0 || rect.y + rect.height > VIEWPORT.height) return warnNoBox(spec, 'does not fit in the window')
  return percentBox(rect)
}

function warnNoBox(spec, why) {
  console.warn(`WARN  ${spec.id}: selector ${spec.selector} ${why}; captured without a box. Check the page and fix the selector in content.ts.`)
  return undefined
}

/**
 * Capture one spec on an open page. Writes `<outDir>/<id>.png` and returns its record.
 */
export async function captureShot(page, spec, { outDir = SHOT_DIR, today, url = spec.url } = {}) {
  await page.setViewportSize(VIEWPORT)
  await page.goto(url, { waitUntil: 'networkidle', timeout: 45_000 })
  let box
  if (spec.selector) box = await measureBox(page, spec)
  await page.screenshot({ path: path.join(outDir, `${spec.id}.png`) })
  return { id: spec.id, checkedOn: today, width: VIEWPORT.width, height: VIEWPORT.height, ...(box ? { box } : {}) }
}

/** Merge new records into the stored list, replacing by id. Pure. */
export function mergeRecords(stored, fresh) {
  const byId = new Map(stored.map((r) => [r.id, r]))
  for (const r of fresh) byId.set(r.id, r)
  return [...byId.values()].sort((a, b) => a.id.localeCompare(b.id))
}

/** One line per spec: missing, stale or ok. Pure. */
export function report(specs, records, today, maxAgeDays) {
  const byId = new Map(records.map((r) => [r.id, r]))
  return specs.map((s) => {
    const r = byId.get(s.id)
    if (!r) return { id: s.id, source: s.source, state: 'missing' }
    // A drawn recreation is a stand-in: it stays on the list until a real capture replaces it.
    if (r.illustration) return { id: s.id, source: s.source, state: 'illustration' }
    const age = Math.floor((Date.parse(`${today}T00:00:00Z`) - Date.parse(`${r.checkedOn}T00:00:00Z`)) / 86_400_000)
    return { id: s.id, source: s.source, state: age > maxAgeDays ? 'stale' : 'ok', age }
  })
}

async function main() {
  const { SETUP_SHOTS } = await import('../src/lib/setup/content.ts')
  const { SHOT_MAX_AGE_DAYS } = await import('../src/lib/setup/screenshots.ts')
  const today = new Date().toISOString().slice(0, 10)
  const stored = existsSync(RECORDS) ? JSON.parse(readFileSync(RECORDS, 'utf8')) : []
  const args = process.argv.slice(2)
  if (args.includes('--take')) {
    const only = args.includes('--only') ? args[args.indexOf('--only') + 1] : null
    const specs = SETUP_SHOTS.filter((s) => s.source === 'browser-script' && (!only || s.id === only))
    const { chromium } = await import('playwright')
    const { sandboxTrustArgs } = await import('../workers/billing/e2e/sandbox-trust.mjs')
    const sandbox = '/opt/pw-browsers/chromium'
    const executablePath = process.env.CHROMIUM || (existsSync(sandbox) ? sandbox : undefined)
    const browser = await chromium.launch({ args: sandboxTrustArgs(), ...(executablePath ? { executablePath } : {}) })
    const page = await (await browser.newContext({ locale: 'es-PE', colorScheme: 'light' })).newPage()
    const fresh = []
    let failed = 0
    for (const spec of specs) {
      try {
        fresh.push(await captureShot(page, spec, { today }))
        console.log(`took  ${spec.id}`)
      } catch (e) {
        failed += 1
        console.error(`FAIL  ${spec.id}: ${String(e.message).split('\n')[0]}`)
      }
    }
    await browser.close()
    writeFileSync(RECORDS, `${JSON.stringify(mergeRecords(stored, fresh), null, 2)}\n`)
    execFileSync(process.execPath, [path.join(ROOT, 'scripts/setup_shots_index.mjs')], { stdio: 'inherit' })
    console.log('Look at every new picture before committing it: a page can change under a selector that still matches.')
    process.exit(failed ? 1 : 0)
  }
  const rows = report(SETUP_SHOTS, stored, today, SHOT_MAX_AGE_DAYS)
  for (const r of rows) console.log(`${r.state.padEnd(8)} ${r.source.padEnd(15)} ${r.id}${r.age !== undefined ? `  (${r.age} days)` : ''}`)
  const due = rows.filter((r) => r.state !== 'ok').length
  const drawn = rows.filter((r) => r.state === 'illustration').length
  console.log(`\n${rows.length - due} of ${rows.length} captures current; ${due} due (${drawn} of them illustrations awaiting a real capture, the rest missing or older than ${SHOT_MAX_AGE_DAYS} days).`)
}

// No top-level await: the unit tests import this file through tsx, which loads it as CommonJS.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e)
    process.exit(1)
  })
}
