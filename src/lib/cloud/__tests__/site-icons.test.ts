import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import sharp from 'sharp'
import { writeSiteIcons, splitSvg, MASKABLE_SCALE } from '../../../../scripts/site_icons.mjs'

// Round of 19 Oct 2026, item 5 (S21): the icons browsers and crawlers request on their own, from
// public/favicon.svg, at the sizes Google and Apple ask for.

const dir = mkdtempSync(join(tmpdir(), 'pa-icons-'))
// No top-level await here (tsx compiles tests to CommonJS): each test awaits the one build.
const ready: Promise<string[]> = writeSiteIcons('public/favicon.svg', dir, '/pyarcana')
const meta = async (f: string) => { await ready; return sharp(join(dir, f)).metadata() }
const raw = async (f: string) => { await ready; return sharp(join(dir, f)).ensureAlpha().raw().toBuffer({ resolveWithObject: true }) }

test('every file is written', async () => {
  assert.deepEqual([...(await ready)].sort(), ['apple-touch-icon-precomposed.png', 'apple-touch-icon.png', 'favicon.ico', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'manifest.webmanifest'])
})

test('favicon.ico is an ICO holding one 32×32 PNG', async () => {
  await ready
  const ico = readFileSync(join(dir, 'favicon.ico'))
  assert.deepEqual([ico.readUInt16LE(0), ico.readUInt16LE(2), ico.readUInt16LE(4)], [0, 1, 1], 'reserved, type icon, one image')
  assert.deepEqual([ico[6], ico[7]], [32, 32])
  const png = ico.subarray(ico.readUInt32LE(18), ico.readUInt32LE(18) + ico.readUInt32LE(14))
  const m = await sharp(png).metadata()
  assert.deepEqual([m.format, m.width, m.height], ['png', 32, 32])
})

test('the PNGs have the sizes they declare', async () => {
  for (const [f, size] of [['apple-touch-icon.png', 180], ['apple-touch-icon-precomposed.png', 180], ['icon-192.png', 192], ['icon-512.png', 512], ['icon-maskable-512.png', 512]] as const) {
    const m = await meta(f)
    assert.deepEqual([m.format, m.width, m.height], ['png', size, size], f)
  }
})

test('apple-touch-icon and the maskable icon are opaque, the tile reaching every corner', async () => {
  for (const f of ['apple-touch-icon.png', 'icon-maskable-512.png']) {
    const { data, info } = await raw(f)
    for (let i = 3; i < data.length; i += 4) if (data[i] !== 255) assert.fail(`${f}: transparent pixel at ${(i - 3) / 4}`)
    const px = (x: number, y: number) => [...data.subarray((y * info.width + x) * 4, (y * info.width + x) * 4 + 3)]
    for (const [x, y] of [[0, 0], [info.width - 1, 0], [0, info.height - 1], [info.width - 1, info.height - 1]]) {
      const [r, g, b] = px(x, y)
      assert.ok(g > r && g > b && r + g + b > 30, `${f} corner ${x},${y} is the tile's green, not black: ${[r, g, b]}`)
    }
  }
  // The drawn favicon keeps its transparent rounded corners (a different file on purpose).
  const { data } = await raw('icon-512.png')
  assert.equal(data[3], 0, 'icon-512 corner pixel is transparent')
})

test('maskable: the mark stays inside the central circle of radius 40% (W3C safe zone)', async () => {
  const { data, info } = await raw('icon-maskable-512.png')
  const c = info.width / 2
  let goldInside = 0
  for (let y = 0; y < info.height; y += 2) {
    for (let x = 0; x < info.width; x += 2) {
      const i = (y * info.width + x) * 4
      const gold = data[i] > 150 && data[i + 1] > 110 && data[i + 2] < 140 && data[i] > data[i + 2] + 60
      const d = Math.hypot(x - c, y - c) / info.width
      if (gold && d > 0.4) assert.fail(`gold at ${x},${y}, ${(d * 100).toFixed(1)}% from the centre`)
      if (gold) goldInside += 1
    }
  }
  assert.ok(goldInside > 1000, 'the mark is drawn')
  assert.ok(MASKABLE_SCALE < 1)
})

test('the manifest lists 192, 512 and the maskable 512 under the build\'s base path', async () => {
  await ready
  const m = JSON.parse(readFileSync(join(dir, 'manifest.webmanifest'), 'utf8'))
  assert.equal(m.start_url, '/pyarcana/')
  assert.deepEqual(m.icons.map((i: { src: string; sizes: string; purpose?: string }) => [i.src, i.sizes, i.purpose ?? '']), [
    ['/pyarcana/icon-192.png', '192x192', ''], ['/pyarcana/icon-512.png', '512x512', ''], ['/pyarcana/icon-maskable-512.png', '512x512', 'maskable']])
})

test('the art is the favicon: its first <rect> is the tile; logo.svg (an "R") is never the source', () => {
  const { fill } = splitSvg(readFileSync('public/favicon.svg', 'utf8'))
  assert.match(fill, /^url\(#/)
  assert.doesNotMatch(readFileSync('scripts/site_icons.mjs', 'utf8'), /'public\/logo\.svg'|logo\.svg'\)/)
  assert.match(readFileSync('scripts/build_static_export.mjs', 'utf8'), /writeSiteIcons\(join\(projectRoot, 'public', 'favicon\.svg'\)/)
})

test('layout.tsx declares the ICO with its size, the Apple PNG first, a manifest, and no shortcut', () => {
  const layout = readFileSync('src/app/layout.tsx', 'utf8')
  assert.match(layout, /\{ url: `\$\{SITE_BASE_PATH\}\/favicon\.ico`, sizes: "32x32" \}/)
  assert.match(layout, /apple: \[\s*\{ url: `\$\{SITE_BASE_PATH\}\/apple-touch-icon\.png`, sizes: "180x180", type: "image\/png" \}/)
  assert.match(layout, /manifest: `\$\{SITE_BASE_PATH\}\/manifest\.webmanifest`/)
  assert.doesNotMatch(layout, /shortcut:/)
})
