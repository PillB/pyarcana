/**
 * Contract: a statement found false does not come back, in any quoting or wrapping, anywhere a
 * learner reads (the 52 active sections, the glossary, the exam bank, the public capstone files).
 *
 * No gate checked that a statement about Python or statistics is true: each checks form or runs
 * code against pinned outputs. The glossary's p-value hover, S18's "bootstrap if the tails are
 * heavy or n is small" and S10's "`python -m` without fighting sys.path" were each polished by
 * later rounds and kept. audit/fixer/known_false_claims.json records each one with its source and
 * correct form; scripts/lib/false_claims.mts finds it. This test holds:
 *   (a) the real tree at exactly the owed count per entry - debt cannot grow, and a fix must be
 *       recorded by lowering the count (0 = enforced);
 *   (b) each pattern against its own worked examples;
 *   (c) each original statement injected into every container a learner reads text from, with
 *       the formatting a rewrite could add, and found again at the right line;
 *   (d) the scan actually covering the course;
 *   (e) a floor of entry ids, so an entry cannot be deleted to make a hit go away.
 *
 * Run: node --import tsx --test tests/adversarial/known-false-claims.test.ts
 */
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  CAPSTONES, compilePattern, courseUnits, firstMatch, loadRegistry, normalize, occurrences, scan, unitsFromText,
  type Entry, type Hit,
} from '../../scripts/lib/false_claims.mts'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..')
const ENTRIES = loadRegistry(ROOT)
const CAPSTONE_FILES = readdirSync(join(ROOT, CAPSTONES)).sort().map((f) => `${CAPSTONES}/${f}`)

/**
 * Hits each entry still has in the real tree. Lower a count when a fix lands; 0 means enforced.
 * Measured 2026-10-12 on main + PR #86, re-measured 2026-10-13 when PR #85's S10 bank landed on
 * top: its rewrites carry the `-m` claim in a key AND its explanation (KFC-003 4 -> 5) and the
 * circular-import claim in a key and an explanation (KFC-004 2 -> 4). Not new debt: the same S10
 * claims, now counted where #85 put them; the S10 Codex round (O20) pays all of them to 0.
 */
const OWED: Record<string, number> = {
  'KFC-001': 0, // ENFORCED 2026-10-13 (S18 round, 0b-7). Was 2: glossary p-value hover (terms.ts:840): the definition, and the 0.05 cut-off - S18 round, 0b-7
  'KFC-002': 0, // ENFORCED 2026-10-13. Was 10: S18 bootstrap advice, including the pinned output of :229 - S18 round
  'KFC-003': 0, // ENFORCED 2026-10-13 (S10 round, O20). Was 5: S10 :69, :98, :821; the S10 exam key and its explanation
  'KFC-004': 0, // ENFORCED 2026-10-13 (S10 round, O20). Was 4: S10 :71, :751; the S10 exam key and its explanation
  'KFC-005': 0, // ENFORCED 2026-10-13 (S10 round, O20). Was 1: S10 :366
  'KFC-006': 0, // ENFORCED 2026-10-13. Was 1: glossary correlation - S18 round (owner ruling 2026-10-12)
  'KFC-007': 0, // ENFORCED 2026-10-13. Was 1: glossary train/test split - S18 round
  'KFC-008': 0, // ENFORCED 2026-10-13. Was 1: glossary ROC-AUC - S18 round
  'KFC-009': 0, // ENFORCED 2026-10-13. Was 1: glossary StratifiedKFold - S18 round
  'KFC-011': 1, // S12 :314 (S12-T3-B) - the Codex correction of that sentence lowers this to 0
}

const describe = (h: Hit) => `${h.file}:${h.line} | ${h.excerpt}`

test('(e) no entry is removed, and every entry has an owed count', () => {
  const ids = ENTRIES.map((e) => e.id)
  // KFC-010 is the S12 UNIQUE-index entry, on a branch not merged when KFC-011 landed; whichever
  // of the two lands second turns this into the plain range 1..11.
  for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 9, 11]) {
    const id = `KFC-${String(n).padStart(3, '0')}`
    assert.ok(ids.includes(id), `${id} was removed from the registry; fix the text instead`)
  }
  assert.deepEqual([...ids].sort(), Object.keys(OWED).sort(), 'each entry needs an owed count here, and only entries')
  assert.equal(new Set(ids).size, ids.length, 'duplicate entry id')
})

test('(b) every entry is complete, and its patterns pass their own worked examples', () => {
  for (const e of ENTRIES) {
    for (const field of ['title', 'correct_statement', 'verified_by', 'decision'] as const) {
      assert.ok(e[field]?.trim(), `${e.id}: ${field} is empty`)
    }
    assert.ok(e.citation.source && e.citation.url.startsWith('https://') && e.citation.quote, `${e.id}: citation incomplete`)
    assert.ok(e.examples.positive.length && e.examples.negative.length, `${e.id}: needs positive and negative examples`)
    for (const p of e.patterns) compilePattern(p)
    for (const text of e.examples.positive) assert.ok(firstMatch(e, text), `${e.id} misses its own positive: ${text}`)
    for (const text of e.examples.negative) assert.equal(firstMatch(e, text), null, `${e.id} flags its own negative: ${text}`)
    for (const p of e.patterns) {
      const one = { patterns: [p] }
      assert.ok(e.examples.positive.some((t) => firstMatch(one, t)), `${e.id}: no positive example exercises ${p}`)
    }
  }
})

test('every entry names a fact test that exists, so its correct statement is demonstrated', () => {
  for (const e of ENTRIES) {
    const [file, cls, method] = e.verified_by.split('::')
    assert.ok(file && cls && method, `${e.id}: verified_by must be path::Class::method`)
    const source = readFileSync(join(ROOT, file), 'utf8')
    assert.match(source, new RegExp(`^class ${cls}\\b`, 'm'), `${e.id}: no class ${cls} in ${file}`)
    assert.match(source, new RegExp(`^ {4}def ${method}\\(`, 'm'), `${e.id}: no test ${method} in ${file}`)
  }
})

test('the {Wn} window crosses a dot inside a word but not a sentence end', () => {
  const re = compilePattern('a{W40}b')
  assert.ok(re.test('a usa sys.path y 0.05 b'))
  assert.ok(!re.test('a termina. b'))
  assert.ok(!re.test('a termina\nb'))
  assert.equal(normalize('**Árbol** «x» “w” \'v\' `y_z`'), 'arbol x w v y z')
})

/** The containers a rewrite could put a sentence in, each with the line it starts on. */
/** Split at the space nearest the middle, so a phrase is cut between two words. */
function halves(s: string): [string, string] {
  const mid = Math.floor(s.length / 2)
  const cut = s.lastIndexOf(' ', mid) > 0 ? s.lastIndexOf(' ', mid) : mid
  return [s.slice(0, cut), s.slice(cut)]
}

function containers(text: string): Array<{ file: string; scope: Entry['scope'][number]; raw: string; line: number }> {
  const ts = (s: string) => s.replace(/\\/g, '\\\\')
  const dq = (s: string) => ts(s).replace(/"/g, '\\"')
  const sq = ts(text).replace(/'/g, "\\'")
  const [t1, t2] = halves(ts(text).replace(/`/g, '\\`').replace(/\$\{/g, '\\${'))
  const [p1, p2] = halves(text)
  const q = (field: string) => `    { concept: 'c', question: ${field}, options: ['a', 'b', 'c', 'd'], correctIndex: 0, explanation: 'x' },\n`
  return [
    { file: 'src/lib/course/sections/sXX.ts', scope: 'sections', raw: `const a = 1\nconst s = {\n  t: "${dq(text)}",\n}\n`, line: 3 },
    { file: 'src/lib/course/sections/sXX.ts', scope: 'sections', raw: `\nconst s = '${sq}'\n`, line: 2 },
    { file: 'src/lib/course/sections/sXX.ts', scope: 'sections', raw: `\n\nconst s = \`${t1}\n${t2.trimStart()}\`\n`, line: 3 },
    { file: 'src/lib/course/sections/sXX.ts', scope: 'sections', raw: `const s =\n  "${dq(p1)}" +\n  "${dq(p2)}"\n`, line: 2 },
    { file: 'src/lib/glossary/terms.ts', scope: 'glossary', raw: `export const T = [\n  { id: 'x', definition: "${dq(text)}" },\n]\n`, line: 2 },
    ...['setup', "'decisions-rules'", '"functions-contracts"'].map((key) => ({
      file: 'prisma/seed.ts', scope: 'exam-bank' as const,
      raw: `const QUESTION_BANK = {\n  ${key}: [\n${q(`"${dq(text)}"`)}  ],\n}\n`, line: 3,
    })),
    { file: `${CAPSTONES}/X_BRIEF.md`, scope: 'capstones', raw: `# T\n\nUno.\n\n${p1}\n${p2.trimStart()}\n`, line: 5 },
    { file: `${CAPSTONES}/X_RUBRIC.json`, scope: 'capstones', raw: `{\n  "a": [\n    ${JSON.stringify(text)}\n  ]\n}\n`, line: 3 },
  ]
}

/** What a rewrite could do to the same sentence without changing its claim. */
const DISGUISES: Array<[string, (s: string) => string]> = [
  ['as written', (s) => s],
  ['curly and guillemet quotes', (s) => s.replace(/"([^"]*)"/g, '“$1”').replace(/`([^`]*)`/g, '«$1»')],
  ['bold words', (s) => s.replace(/\b(\p{L}{6,})\b/u, '**$1**')],
  ['decomposed accents', (s) => s.normalize('NFD')],
  ['upper case', (s) => s.toUpperCase()],
]

test('(c) each original statement is found again in every container and disguise, as often, at its line', () => {
  for (const e of ENTRIES) {
    for (const original of e.examples.positive) {
      const expected = occurrences(e, original).length
      assert.ok(expected >= 1, `${e.id}: its own positive has no occurrence`)
      for (const [how, disguise] of DISGUISES) {
        for (const c of containers(disguise(original))) {
          if (!e.scope.includes(c.scope)) continue
          const hits = scan([e], unitsFromText(c.file, c.scope, c.raw))
          const label = `${e.id} | ${how} | ${c.file} (${c.scope}) | ${original.slice(0, 60)}`
          assert.equal(hits.length, expected, `found ${hits.length} times, expected ${expected}: ${label}\n${c.raw}`)
          for (const h of hits) assert.equal(h.line, c.line, `wrong line: ${label}`)
        }
      }
    }
  }
})

test('every occurrence counts: a claim written twice in one string is two hits, one sentence is one', () => {
  const e = ENTRIES.find((x) => x.id === 'KFC-003')!
  const once = e.examples.positive[0]
  const units = (text: string) => unitsFromText('src/lib/course/sections/sXX.ts', 'sections', `const s = "${text.replace(/"/g, '\\"')}"\n`)
  assert.equal(scan([e], units(once)).length, 1)
  assert.equal(scan([e], units(`${once} ${once}`)).length, 2, 'a second copy in the same string must raise the count')
  // Both KFC-003 patterns match this sentence (it says "sin pelear con sys.path" and "evita ... cwd"):
  const both = 'Con `python -m` corres sin pelear con sys.path y evitas depender del cwd.'
  assert.ok(e.patterns.every((p) => firstMatch({ patterns: [p] }, both)), 'fixture no longer matches both patterns')
  assert.equal(occurrences(e, both).length, 1, 'overlapping matches of two patterns are one occurrence')
})

test('an allow entry covers exactly the hit it names, and a stale one is caught', () => {
  const e: Entry = {
    ...ENTRIES.find((x) => x.id === 'KFC-003')!,
    allow: [{ file: 'src/lib/course/sections/sXX.ts', excerpt: 'Error común: creer que', reason: 'refutes the claim' }],
  }
  const refuting = 'Error común: creer que `python -m` corre sin pelear con sys.path.'
  const units = unitsFromText('src/lib/course/sections/sXX.ts', 'sections', `const a = "${refuting}"\nconst b = "${e.examples.positive[0]}"\n`)
  const hits = scan([e], units)
  assert.deepEqual(hits.map((h) => h.allowed), [true, false])
  assert.equal(staleAllows([e], hits).length, 0)
  assert.deepEqual(staleAllows([e], hits.slice(1)).map((a) => a.excerpt), ['Error común: creer que'])
})

/** Allow entries that do not cover exactly one hit: stale, or too broad to be an exception. */
function staleAllows(entries: Entry[], hits: Hit[]): Entry['allow'] {
  return entries.flatMap((e) => e.allow.filter((a) =>
    hits.filter((h) => h.id === e.id && h.allowed && h.file === a.file && h.excerpt.includes(normalize(a.excerpt).slice(0, 20))).length !== 1))
}

const units = courseUnits(ROOT, CAPSTONE_FILES)
const hits = scan(ENTRIES, units)

test('(d) the scan reads the whole course: 52 sections, the glossary, every exam question, the capstones', () => {
  const files = (scope: string) => new Set(units.filter((u) => u.scope === scope).map((u) => u.file))
  assert.equal(files('sections').size, 52)
  assert.deepEqual([...files('glossary')], ['src/lib/glossary/terms.ts'])
  assert.equal(units.filter((u) => u.scope === 'exam-bank').length, 1248 * 6, 'question + 4 options + explanation, per question')
  assert.equal(files('capstones').size, CAPSTONE_FILES.length)
  assert.ok(CAPSTONE_FILES.length >= 26, `only ${CAPSTONE_FILES.length} capstone files`)
})

test('(a) the real tree holds each entry at exactly its owed count', () => {
  assert.deepEqual(staleAllows(ENTRIES, hits), [], 'an allow entry covers no hit, or more than one')
  for (const e of ENTRIES) {
    const open = hits.filter((h) => h.id === e.id && !h.allowed)
    const owed = OWED[e.id]
    const listing = open.map(describe).join('\n  ')
    assert.ok(open.length <= owed,
      `${e.id} (${e.title}) appears ${open.length} times, owed ${owed}:\n  ${listing}\n` +
      `Correct statement: ${e.correct_statement}\nSource: ${e.citation.source} - ${e.citation.url}`)
    assert.equal(open.length, owed, `${e.id}: only ${open.length} left - lower OWED['${e.id}'] to ${open.length}`)
  }
})
