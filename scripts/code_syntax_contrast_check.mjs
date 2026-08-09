#!/usr/bin/env node
/**
 * Static contrast check: syntax token CSS vars vs code-bg (oklch → sRGB approx via canvas not available in node).
 * Uses a simple oklch parser + conversion for AA gates; Playwright is source of truth for live DOM.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const css = fs.readFileSync(path.join(root, 'src/app/globals.css'), 'utf8')

// Extract .code-block-dark block vars
const m = css.match(/\.code-block-dark\s*\{([\s\S]*?)\n\}/)
if (!m) {
  console.error('no .code-block-dark block')
  process.exit(1)
}
const vars = {}
for (const line of m[1].split('\n')) {
  const vm = line.match(/--([a-z0-9-]+):\s*([^;]+);/i)
  if (vm) vars[vm[1]] = vm[2].trim()
}

// Minimal oklch(L C H) → sRGB (approx, chroma small so OK for AA gate)
function oklchToSrgb(str) {
  const mm = str.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/i)
  if (!mm) return null
  const L = parseFloat(mm[1])
  const C = parseFloat(mm[2])
  const H = (parseFloat(mm[3]) * Math.PI) / 180
  const a = C * Math.cos(H)
  const b = C * Math.sin(H)
  // OKLab → linear sRGB (Björn Ottosson)
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b
  const l = l_ * l_ * l_
  const m3 = m_ * m_ * m_
  const s = s_ * s_ * s_
  let r = +4.0767416621 * l - 3.3077115913 * m3 + 0.2309699292 * s
  let g = -1.2684380046 * l + 2.6097574011 * m3 - 0.3413193965 * s
  let bl = -0.0041960863 * l - 0.7034186147 * m3 + 1.707614701 * s
  const comp = (c) => {
    c = Math.max(0, Math.min(1, c))
    return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055
  }
  return [comp(r) * 255, comp(g) * 255, comp(bl) * 255]
}

function relL([r, g, b]) {
  const lin = (c) => {
    const x = c / 255
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}
function contrast(fg, bg) {
  const a = relL(fg)
  const b = relL(bg)
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

const bg = oklchToSrgb(vars['code-bg'] || 'oklch(0.16 0.02 260)')
const pairs = [
  ['code-fg', 4.5],
  ['code-comment', 4.5],
  ['code-string', 4.5],
  ['code-keyword', 4.5],
  ['code-builtin', 4.5],
  ['code-number', 4.5],
  ['code-line-num', 3],
]

const results = []
for (const [name, min] of pairs) {
  const raw = vars[name]
  if (!raw || !bg) {
    results.push({ name, ok: false, error: 'missing' })
    continue
  }
  const fg = oklchToSrgb(raw)
  const r = contrast(fg, bg)
  results.push({ name, min, ratio: Math.round(r * 100) / 100, ok: r >= min, fg: raw, bg: vars['code-bg'] })
}

const report = {
  generated_at: new Date().toISOString(),
  method: 'oklch→sRGB approx for code-block-dark tokens',
  results,
  ok: results.every((x) => x.ok),
}
const out = path.join(root, 'course-state/code_syntax_contrast_report.json')
fs.writeFileSync(out, JSON.stringify(report, null, 2))
console.log(JSON.stringify(report, null, 2))
process.exitCode = report.ok ? 0 : 1
