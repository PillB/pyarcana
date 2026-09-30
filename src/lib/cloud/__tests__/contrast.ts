/**
 * WCAG contrast from the site's own tokens (src/app/globals.css) and the Tailwind classes a
 * component uses. oklch -> OKLab -> linear sRGB (Björn Ottosson's matrices, the ones CSS Color 4
 * specifies), gamut-clipped, then alpha-composited in gamma-encoded sRGB the way browsers paint
 * `bg-x/10` over a surface, then WCAG 2.x relative luminance and ratio.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export type Theme = 'light' | 'dark'
type Rgba = [number, number, number, number]

function block(css: string, selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`)
  if (start < 0) throw new Error(`no ${selector} block`)
  const body = css.slice(start, css.indexOf('\n}', start))
  const out: Record<string, string> = {}
  for (const m of body.matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)) out[m[1]] = m[2].trim()
  return out
}

const CSS = readFileSync(join(process.cwd(), 'src/app/globals.css'), 'utf8')
const TOKENS: Record<Theme, Record<string, string>> = { light: block(CSS, ':root'), dark: { ...block(CSS, ':root'), ...block(CSS, '.dark') } }

const clip = (v: number) => Math.min(1, Math.max(0, v))
const encode = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055)
const decode = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)

/** oklch(L C h [/ a]) -> gamma-encoded sRGB 0..1 with alpha. */
export function parseOklch(value: string): Rgba {
  const m = /^oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+%?))?\s*\)$/.exec(value)
  if (!m) throw new Error(`not oklch: ${value}`)
  const L = m[1].endsWith('%') ? parseFloat(m[1]) / 100 : parseFloat(m[1])
  const C = parseFloat(m[2])
  const h = (parseFloat(m[3]) * Math.PI) / 180
  const alpha = m[4] === undefined ? 1 : m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4])
  const a = C * Math.cos(h)
  const b = C * Math.sin(h)
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const mm = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  const r = 4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * s
  const g = -1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * s
  const bl = -0.0041960863 * l - 0.7034186147 * mm + 1.707614701 * s
  return [encode(clip(r)), encode(clip(g)), encode(clip(bl)), alpha]
}

/** A colour class body like 'destructive/10' or 'muted-foreground' -> RGBA in a theme. */
export function tokenColour(spec: string, theme: Theme): Rgba {
  const [name, pct] = spec.split('/')
  const raw = TOKENS[theme][name]
  if (!raw) throw new Error(`no token --${name} (${theme})`)
  const c = parseOklch(raw)
  return pct === undefined ? c : [c[0], c[1], c[2], c[3] * (parseInt(pct, 10) / 100)]
}

export function over(top: Rgba, bottom: Rgba): Rgba {
  const a = top[3]
  return [top[0] * a + bottom[0] * (1 - a), top[1] * a + bottom[1] * (1 - a), top[2] * a + bottom[2] * (1 - a), 1]
}

function luminance(c: Rgba): number {
  return 0.2126 * decode(c[0]) + 0.7152 * decode(c[1]) + 0.0722 * decode(c[2])
}

export function ratio(fg: Rgba, bg: Rgba): number {
  const a = luminance(over(fg, bg))
  const b = luminance(bg)
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

/**
 * The colour a class list gives one property ('text' | 'bg' | 'border') in a theme: the last
 * unprefixed class wins in light; in dark a `dark:` class overrides it. Variant prefixes other than
 * dark: (hover:, focus-visible:, data-[...]:) are ignored.
 */
export function classColour(classes: string, prop: 'text' | 'bg' | 'border', theme: Theme): string | null {
  let found: string | null = null
  let dark: string | null = null
  for (const cls of classes.split(/\s+/)) {
    const m = new RegExp(`^(dark:)?${prop}-([a-z-]+(?:/\\d+)?)$`).exec(cls)
    if (!m || !(m[2].split('/')[0] in TOKENS.light)) continue
    if (m[1]) dark = m[2]
    else found = m[2]
  }
  return theme === 'dark' && dark ? dark : found
}
