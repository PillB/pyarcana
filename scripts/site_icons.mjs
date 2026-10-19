/**
 * The icons browsers and crawlers ask for on their own, rasterized from public/favicon.svg at build
 * (round of 19 Oct 2026, item 5; S21). The live site answered 404 for /favicon.ico (Google Search
 * takes ICO or PNG, not SVG, and wants more than 48×48) and for /apple-touch-icon.png and its
 * -precomposed twin (Apple requires a PNG; layout.tsx declared an SVG).
 *
 *   favicon.ico                      32×32 (one PNG inside an ICO container)
 *   apple-touch-icon.png             180×180, opaque: the tile filled to the corners
 *   apple-touch-icon-precomposed.png the same file, for older iOS
 *   icon-192.png, icon-512.png       the favicon as drawn
 *   icon-maskable-512.png            full-bleed tile, the mark inside the central circle of radius
 *                                    40% (W3C Web App Manifest "maskable"; web.dev)
 *   manifest.webmanifest             192, 512 and the maskable 512, under the build's base path
 *
 * The art: favicon.svg's FIRST <rect> is its tile; the rest is the mark. New art only replaces
 * favicon.svg (Pablo may send it later); nothing here names its colours. Never logo.svg, which
 * draws an "R" although its description says "Monograma PA" (19 Oct 2026).
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

/** The tile rect (the first <rect>) and the SVG split around it. */
export function splitSvg(svg) {
  const open = /<svg\b[^>]*>/.exec(svg)
  const close = svg.lastIndexOf('</svg>')
  if (!open || close < 0) throw new Error('favicon.svg is not an <svg> document')
  const body = svg.slice(open.index + open[0].length, close)
  const defs = (/<defs>[\s\S]*?<\/defs>/.exec(body) ?? [''])[0]
  const tile = /<rect\b[^>]*\/>/.exec(body)
  if (!tile) throw new Error('favicon.svg has no <rect>: its first <rect> must be the tile')
  const fill = /\bfill="([^"]+)"/.exec(tile[0])?.[1]
  if (!fill) throw new Error('favicon.svg: the tile <rect> has no fill')
  const view = /\bviewBox="([^"]+)"/.exec(open[0])?.[1] ?? '0 0 64 64'
  const [, , w, h] = view.split(/\s+/).map(Number)
  const mark = body.replace(defs, '').replace(tile[0], '').replace(/<title[\s\S]*?<\/title>|<desc[\s\S]*?<\/desc>/g, '')
  return { view, w, h, defs, fill, mark }
}

/** The tile filled to the corners, with the mark scaled by `scale` about the centre. */
export function fullBleedSvg(svg, scale = 1) {
  const { view, w, h, defs, fill, mark } = splitSvg(svg)
  const cx = w / 2
  const cy = h / 2
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view}">${defs}<rect width="${w}" height="${h}" fill="${fill}"/>` +
    `<g transform="translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})">${mark}</g></svg>`
}

/** An ICO file holding one PNG (valid since Windows Vista; every current browser reads it). */
export function icoFromPng(png, size) {
  const header = Buffer.alloc(22)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(1, 4) // one image
  header.writeUInt8(size >= 256 ? 0 : size, 6)
  header.writeUInt8(size >= 256 ? 0 : size, 7)
  header.writeUInt8(0, 8) // no palette
  header.writeUInt8(0, 9)
  header.writeUInt16LE(1, 10) // colour planes
  header.writeUInt16LE(32, 12) // bits per pixel
  header.writeUInt32LE(png.length, 14)
  header.writeUInt32LE(22, 18) // image offset
  return Buffer.concat([header, png])
}

/** The mark's scale in the maskable icon: its art reaches ~27/64 from the centre, 0.82 keeps it under 40%. */
export const MASKABLE_SCALE = 0.82

const png = (svg, size, opaque) => {
  const img = sharp(Buffer.from(svg), { density: 72 * Math.ceil(size / 64) * 4 }).resize(size, size)
  return (opaque ? img.flatten({ background: '#000000' }).removeAlpha() : img).png().toBuffer()
}

/** Write every icon and the manifest into outDir. Returns the files written. */
export async function writeSiteIcons(svgPath, outDir, basePath) {
  const svg = readFileSync(svgPath, 'utf8')
  const files = {
    'favicon.ico': icoFromPng(await png(svg, 32, false), 32),
    'apple-touch-icon.png': await png(fullBleedSvg(svg), 180, true),
    'icon-192.png': await png(svg, 192, false),
    'icon-512.png': await png(svg, 512, false),
    'icon-maskable-512.png': await png(fullBleedSvg(svg, MASKABLE_SCALE), 512, true),
  }
  files['apple-touch-icon-precomposed.png'] = files['apple-touch-icon.png']
  files['manifest.webmanifest'] = `${JSON.stringify(manifest(basePath), null, 2)}\n`
  for (const [name, data] of Object.entries(files)) writeFileSync(join(outDir, name), data)
  return Object.keys(files)
}

/** The Web App Manifest, every URL under the build's base path. */
export function manifest(basePath) {
  return {
    name: 'PyArcana',
    short_name: 'PyArcana',
    description: 'Curso online de Python para Data Analysis y Data Science en español peruano.',
    lang: 'es-PE',
    start_url: `${basePath}/`,
    scope: `${basePath}/`,
    display: 'browser',
    icons: [
      { src: `${basePath}/icon-192.png`, sizes: '192x192', type: 'image/png' },
      { src: `${basePath}/icon-512.png`, sizes: '512x512', type: 'image/png' },
      { src: `${basePath}/icon-maskable-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
