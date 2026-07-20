#!/usr/bin/env node
/**
 * Token presence + sanity check for CSS color variables.
 * True WCAG ratios use computed sRGB in Playwright (07_glossary_i18n_a11y.spec.ts).
 * oklch L is NOT sRGB relative luminance — do not fake AA from L alone.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const css = fs.readFileSync(path.join(root, 'src/app/globals.css'), 'utf8')

function parseBlock(name) {
  const re = new RegExp(`${name}\\s*\\{([\\s\\S]*?)\\n\\}`)
  const m = css.match(re)
  if (!m) return {}
  const vars = {}
  for (const line of m[1].split('\n')) {
    const vm = line.match(/--([a-z0-9-]+):\s*([^;]+);/i)
    if (vm) vars[vm[1]] = vm[2].trim()
  }
  return vars
}

const required = [
  'background',
  'foreground',
  'muted-foreground',
  'primary',
  'primary-foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
]

const report = {
  generated_at: new Date().toISOString(),
  method:
    'Token presence for light/dark. Pixel AA validated in Playwright via getComputedStyle RGB.',
  themes: {},
  notes: [
    'muted-foreground darkened in light theme (0.50→0.42 oklch L) for better secondary text.',
    'muted-foreground lightened in dark theme (0.72→0.78 oklch L).',
  ],
}

for (const theme of [':root', '\\.dark']) {
  const label = theme === ':root' ? ':root' : '.dark'
  const v = parseBlock(theme)
  const missing = required.filter((k) => !v[k])
  report.themes[label] = {
    present: required.length - missing.length,
    missing,
    sample: {
      background: v.background,
      foreground: v.foreground,
      'muted-foreground': v['muted-foreground'],
    },
  }
}

report.ok = Object.values(report.themes).every((t) => t.missing.length === 0)
const out = path.join(root, 'course-state/a11y_contrast_report.json')
fs.writeFileSync(out, JSON.stringify(report, null, 2))
console.log(JSON.stringify(report, null, 2))
process.exitCode = report.ok ? 0 : 1
