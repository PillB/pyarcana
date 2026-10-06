#!/usr/bin/env node
/**
 * Add one of your own Sesión 0 captures in one command.
 *
 *   node --import tsx scripts/setup_shot_add.mjs <id> <file.png> [--box x,y,w,h] [--date YYYY-MM-DD]
 *
 *   <id>     a spec id from SETUP_SHOTS (src/lib/setup/content.ts), e.g. win-py-installer-done
 *   --box    the rectangle around what to click, in PIXELS of that PNG: left, top, width, height.
 *            Leave it out when the picture shows a result, or when you drew the box yourself
 *            with the screenshot tool's markup.
 *   --date   the day you checked the screen (default: today)
 *
 * It copies the PNG to src/assets/setup/<id>.png, reads its real size, turns the box into the
 * percentages the page uses, writes the record into shots.json (replacing any earlier one,
 * including a reused picture with its credit), and regenerates index.ts. Then run the unit tests.
 */
import { copyFileSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SHOT_DIR = path.join(ROOT, 'src/assets/setup')
/** Wider than this, or heavier, and the page gets slow on a phone connection. */
const MAX_WIDTH = 1600
const MAX_KB = 600

/** [width, height] from a PNG's IHDR chunk; throws on anything that is not a PNG. */
export function pngSize(buf) {
  if (buf.length < 24 || buf.toString('latin1', 1, 4) !== 'PNG') throw new Error('not a PNG file (save the capture as .png)')
  return [buf.readUInt32BE(16), buf.readUInt32BE(20)]
}

/** A pixel rectangle "x,y,w,h" as percentages of the image, rounded to 0.1. Throws if it falls outside. */
export function pixelBoxToPercent(spec, width, height) {
  const n = String(spec).split(',').map((v) => Number(v.trim()))
  if (n.length !== 4 || n.some((v) => !Number.isFinite(v) || v < 0)) throw new Error('--box needs four numbers: left,top,width,height')
  const [x, y, w, h] = n
  if (w === 0 || h === 0 || x + w > width || y + h > height) throw new Error(`--box ${spec} does not fit inside the ${width}×${height} picture`)
  const r1 = (v) => Math.round(v * 10) / 10
  return { x: r1((x / width) * 100), y: r1((y / height) * 100), w: r1((w / width) * 100), h: r1((h / height) * 100) }
}

/** The record for an own capture. Pure. */
export function ownRecord(id, width, height, date, box) {
  return { id, checkedOn: date, width, height, ...(box ? { box } : {}) }
}

function arg(argv, name) {
  const i = argv.indexOf(name)
  return i >= 0 ? argv[i + 1] : undefined
}

async function main() {
  const argv = process.argv.slice(2)
  const [id, file] = argv
  if (!id || !file || id.startsWith('--')) {
    console.error('usage: node --import tsx scripts/setup_shot_add.mjs <id> <file.png> [--box x,y,w,h] [--date YYYY-MM-DD]')
    process.exit(2)
  }
  const { SETUP_SHOTS } = await import('../src/lib/setup/content.ts')
  const { mergeRecords } = await import('./setup_screenshots.mjs')
  if (!SETUP_SHOTS.some((s) => s.id === id)) {
    console.error(`unknown id "${id}". Known ids:\n  ${SETUP_SHOTS.map((s) => s.id).join('\n  ')}`)
    process.exit(2)
  }
  const date = arg(argv, '--date') ?? new Date().toISOString().slice(0, 10)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('--date must look like 2026-10-12')
  const [width, height] = pngSize(readFileSync(file))
  const boxArg = arg(argv, '--box')
  const box = boxArg ? pixelBoxToPercent(boxArg, width, height) : undefined
  copyFileSync(file, path.join(SHOT_DIR, `${id}.png`))
  const recordsPath = path.join(SHOT_DIR, 'shots.json')
  const stored = JSON.parse(readFileSync(recordsPath, 'utf8'))
  writeFileSync(recordsPath, `${JSON.stringify(mergeRecords(stored, [ownRecord(id, width, height, date, box)]), null, 2)}\n`)
  execFileSync(process.execPath, [path.join(ROOT, 'scripts/setup_shots_index.mjs')], { stdio: 'inherit' })
  console.log(`added ${id}: ${width}×${height}${box ? `, box ${JSON.stringify(box)}` : ''}, checked ${date}`)
  // The static export serves images as they are (images.unoptimized), so a Retina capture at 2x
  // goes to every learner at full weight. Warn; do not refuse, the picture is still correct.
  const kb = Math.round(readFileSync(file).length / 1024)
  if (width > MAX_WIDTH || kb > MAX_KB) {
    console.warn(`WARN  ${width} px wide, ${kb} KB. Shrink it to ${MAX_WIDTH} px wide, then run this again (measure --box on the shrunk file):`)
    console.warn(`      macOS:   sips -Z ${MAX_WIDTH} "${file}"`)
    console.warn(`      Windows: open it in Paint > Cambiar tamaño > Píxeles > Horizontal ${MAX_WIDTH}, keep the aspect ratio, save`)
  }
  console.log('Next: node scripts/run_billing_tests.mjs --only client, then look at /empezar.')
}

// No top-level await: the unit tests import this file through tsx (docs/agents/lessons.md).
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(`FAIL  ${e.message}`)
    process.exit(1)
  })
}
