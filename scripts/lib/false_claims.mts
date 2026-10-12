/**
 * Find statements already shown false, wherever a learner can read them.
 *
 * Every gate in this repository checks form (prose measures, structure, first use) or runs lesson
 * code against pinned outputs; none checked that a statement about Python or statistics is true.
 * So a false claim found once could come back in the next rewrite: the glossary's p-value hover,
 * S18's "bootstrap if the tails are heavy or n is small", S10's "`python -m` runs without fighting
 * sys.path" were each polished by later rounds and kept. The registry
 * (audit/fixer/known_false_claims.json) records each one with its source and its correct form,
 * and this module finds it again, in any quoting or line wrapping.
 *
 * Text is read by scripts/lib/learner_text.mts (the TypeScript parser), never by regex over code.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { literalsFromSource, readQuestionBank } from './learner_text.mts'

export type Scope = 'sections' | 'glossary' | 'exam-bank' | 'capstones'

export type Entry = {
  id: string
  title: string
  scope: Scope[]
  patterns: string[]
  correct_statement: string
  citation: { source: string; url: string; quote: string }
  verified_by: string
  examples: { positive: string[]; negative: string[] }
  allow: { file: string; excerpt: string; reason: string }[]
  found: { date: string; locations: string[] }
  decision: string
}

/** One readable string: a literal in a .ts file, a markdown paragraph, a JSON string value. */
export type Unit = { file: string; scope: Scope; line: number; text: string }
export type Hit = { id: string; file: string; line: number; excerpt: string; allowed: boolean }

export const REGISTRY = 'audit/fixer/known_false_claims.json'
export const GLOSSARY = 'src/lib/glossary/terms.ts'
export const SEED = 'prisma/seed.ts'
export const CAPSTONES = 'public/capstones'

/** Which scope a repository file belongs to, or undefined when no learner reads it. */
export function scopeOf(file: string, sectionFiles: string[]): Scope | undefined {
  if (file === GLOSSARY) return 'glossary'
  if (file === SEED) return 'exam-bank'
  if (file.startsWith(`${CAPSTONES}/`)) return 'capstones'
  return sectionFiles.includes(file) ? 'sections' : undefined
}

/**
 * Accent-free, lower-case text with formatting removed, so the same sentence matches whether it is
 * in **bold**, `code`, «quotes», curly or straight quotes, or a Python identifier
 * (`preferir_bootstrap_si_colas`). Quote marks carry no claim, so they are dropped, not mapped.
 */
export function normalize(s: string): string {
  return s.normalize('NFKC')
    .replace(/["'‘’‚‛“”„«»]/g, '')
    .replace(/\*\*|__|[*`]/g, '')
    .replace(/_/g, ' ')
    .normalize('NFD').replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[ \t ]+/g, ' ')
}

/** Two readings of a text: newlines as sentence ends, and single newlines as spaces (wrapping). */
export function views(text: string): [string, string] {
  const strict = normalize(text)
  return [strict, strict.replace(/([^\n])\n(?!\n)/g, '$1 ')]
}

/**
 * A registry pattern as a RegExp. `{Wn}` is up to n characters that do not cross a sentence end:
 * a `.`, `!` or `?` followed by whitespace, or a newline. A `.` inside `sys.path` or `0.05` is not
 * an end, so the window crosses it.
 */
export function compilePattern(pattern: string): RegExp {
  const src = pattern.replace(/\{W(\d+)\}/g, (_, n) => `(?:[^.!?\\n]|[.!?](?=\\S)){0,${n}}`)
  return new RegExp(src, 'u')
}

/**
 * Every occurrence of the entry in the text, as [start, end) spans of the normalized text. All
 * patterns, both views (they have the same length), every match; spans that overlap are merged,
 * so one sentence two patterns both match counts once, and a sentence written twice counts twice.
 * Counting one hit per string let a patch add a second copy of a claim to a string that already
 * had one without changing any count (Codex P1 on #88).
 */
export function occurrences(entry: Pick<Entry, 'patterns'>, text: string): Array<[number, number]> {
  const spans: Array<[number, number]> = []
  for (const view of views(text)) {
    for (const p of entry.patterns) {
      for (const m of view.matchAll(new RegExp(compilePattern(p).source, 'gu'))) {
        if (m[0].length) spans.push([m.index, m.index + m[0].length])
      }
    }
  }
  spans.sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const merged: Array<[number, number]> = []
  for (const [start, end] of spans) {
    const last = merged.at(-1)
    if (last && start < last[1]) last[1] = Math.max(last[1], end)
    else merged.push([start, end])
  }
  return merged
}

/** The first match of any of the entry's patterns in either view of the text, or null. */
export function firstMatch(entry: Pick<Entry, 'patterns'>, text: string): RegExpExecArray | null {
  for (const view of views(text)) {
    for (const p of entry.patterns) {
      const m = compilePattern(p).exec(view)
      if (m) return m
    }
  }
  return null
}

function bankUnits(file: string, raw: string): Unit[] {
  return readQuestionBank(raw, file).flatMap((bank) =>
    bank.questions.flatMap((q) => [q.question, ...q.options, q.explanation]
      .map((text) => ({ file, scope: 'exam-bank' as const, line: q.line, text }))))
}

function markdownUnits(file: string, raw: string, scope: Scope): Unit[] {
  const units: Unit[] = []
  let line = 1
  for (const para of raw.split(/\n\s*\n/)) {
    if (para.trim()) units.push({ file, scope, line, text: para })
    line += para.split('\n').length + 1
  }
  return units
}

function jsonUnits(file: string, raw: string, scope: Scope): Unit[] {
  const units: Unit[] = []
  const walk = (v: unknown): void => {
    if (typeof v === 'string') {
      const probe = JSON.stringify(v).slice(1, 40)
      const at = raw.indexOf(probe)
      units.push({ file, scope, line: at < 0 ? 1 : raw.slice(0, at).split('\n').length, text: v })
    } else if (Array.isArray(v)) v.forEach(walk)
    else if (v && typeof v === 'object') Object.values(v).forEach(walk)
  }
  walk(JSON.parse(raw))
  return units
}

/**
 * The readable units of one file's text: the exam bank's questions, options and explanations; a
 * TypeScript file's string literals; a markdown file's paragraphs; a JSON file's string values.
 */
export function unitsFromText(file: string, scope: Scope, raw: string): Unit[] {
  if (scope === 'exam-bank') return bankUnits(file, raw)
  if (file.endsWith('.json')) return jsonUnits(file, raw, scope)
  if (file.endsWith('.md')) return markdownUnits(file, raw, scope)
  return literalsFromSource(raw, file).map((l) => ({ file, scope, ...l }))
}

function fileUnits(root: string, file: string, scope: Scope): Unit[] {
  return unitsFromText(file, scope, readFileSync(join(root, file), 'utf8'))
}

/** The section files COURSE_SECTIONS is built from, read from the index's imports. */
export function activeSectionFiles(root: string): string[] {
  const index = readFileSync(join(root, 'src/lib/course/index.ts'), 'utf8')
  return [...index.matchAll(/from '\.\/sections\/([^']+)'/g)].map((m) => `src/lib/course/sections/${m[1]}.ts`)
}

/** Every unit of learner-readable text in scope, from the real tree. */
export function courseUnits(root: string, capstoneFiles: string[]): Unit[] {
  return [
    ...activeSectionFiles(root).flatMap((f) => fileUnits(root, f, 'sections')),
    ...fileUnits(root, GLOSSARY, 'glossary'),
    ...fileUnits(root, SEED, 'exam-bank'),
    ...capstoneFiles.flatMap((f) => fileUnits(root, f, 'capstones')),
  ]
}

function excerpt(flat: string, [start, end]: [number, number]): string {
  return flat.slice(Math.max(0, start - 60), end + 60).replace(/\s+/g, ' ').trim()
}

/**
 * One hit per occurrence of every entry in its scopes, each marked allowed when an allow entry
 * covers it. An allow entry covers a whole unit, so every occurrence in it.
 */
export function scan(entries: Entry[], units: Unit[]): Hit[] {
  const hits: Hit[] = []
  for (const entry of entries) {
    for (const unit of units) {
      if (!entry.scope.includes(unit.scope)) continue
      const spans = occurrences(entry, unit.text)
      if (!spans.length) continue
      const flat = normalize(unit.text)
      const allowed = entry.allow.some((a) => a.file === unit.file && flat.includes(normalize(a.excerpt)))
      for (const span of spans) {
        hits.push({ id: entry.id, file: unit.file, line: unit.line, excerpt: excerpt(flat, span), allowed })
      }
    }
  }
  return hits
}

export function loadRegistry(root: string): Entry[] {
  return JSON.parse(readFileSync(join(root, REGISTRY), 'utf8')).entries
}
