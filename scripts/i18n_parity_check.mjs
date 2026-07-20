#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const text = fs.readFileSync(path.join(root, 'src/lib/i18n.ts'), 'utf8')

function keysFor(lang) {
  const re = new RegExp(`'${lang}'\\s*:\\s*\\{`)
  const m = text.match(re)
  if (!m) return new Set()
  const start = m.index + m[0].length
  let depth = 1
  let i = start
  while (i < text.length && depth > 0) {
    if (text[i] === '{') depth++
    else if (text[i] === '}') depth--
    i++
  }
  const body = text.slice(start, i - 1)
  return new Set([...body.matchAll(/'([^']+)':\s*'/g)].map((x) => x[1]))
}

const langs = ['es-PE', 'es-ES', 'en']
const sets = Object.fromEntries(langs.map((l) => [l, keysFor(l)]))
const all = new Set(langs.flatMap((l) => [...sets[l]]))
const report = {
  generated_at: new Date().toISOString(),
  counts: Object.fromEntries(langs.map((l) => [l, sets[l].size])),
  missing: Object.fromEntries(
    langs.map((l) => [l, [...all].filter((k) => !sets[l].has(k)).sort()])
  ),
}
report.ok = langs.every((l) => report.missing[l].length === 0)

// Scan hardcoded Spanish chrome (heuristic) in course components
const courseDir = path.join(root, 'src/components/course')
const hard = []
const spanishHints =
  /(?:Entrar|Cerrar sesión|Iniciar sesión|Marcar|Enviar respuestas|Ver solución|Ocultar solución|Panel de Administración)/
for (const f of fs.readdirSync(courseDir).filter((x) => x.endsWith('.tsx'))) {
  const t = fs.readFileSync(path.join(courseDir, f), 'utf8')
  if (!t.includes("t('") && !t.includes('useI18n') && spanishHints.test(t)) {
    hard.push({ file: f, note: 'Spanish chrome strings without useI18n (heuristic)' })
  }
}
report.hardcoded_chrome_candidates = hard
report.hardcoded_ok = hard.length === 0 // informational — many intentional content strings

const out = path.join(root, 'course-state/i18n_parity_report.json')
fs.writeFileSync(out, JSON.stringify(report, null, 2))
console.log(JSON.stringify({ ok: report.ok, counts: report.counts, hard: hard.length }, null, 2))
process.exitCode = report.ok ? 0 : 1
