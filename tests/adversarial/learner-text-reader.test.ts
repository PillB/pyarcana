/**
 * Contract: scripts/lib/learner_text.mts reads every bank in prisma/seed.ts, whatever the key's
 * quote style, and refuses a bank it cannot read as a plain literal instead of guessing.
 *
 * The defect class this guards: three tools each read the bank with their own regex and each saw a
 * different subset. test_exam_length_cue.py read only single-quoted keys, so `setup` and `basics`
 * were never measured and six other banks were counted inside `iteration-summaries`;
 * v3_invariant_validator.py read only unquoted keys; a report concluded that five sections had
 * no exam bank because their keys were double-quoted. The parity test below compares two
 * independent methods and the course's own section list, so a reader that goes blind to a key
 * style fails here instead of producing a confident wrong number.
 */
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { COURSE_SECTIONS } from '../../src/lib/course'
import {
  keyCensus, literalsFromSource, NonLiteralBank, readQuestionBank, readSeedQuestionBank,
} from '../../scripts/lib/learner_text.mts'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..')
const SEED_PATH = join(ROOT, 'prisma/seed.ts')
const SEED = readFileSync(SEED_PATH, 'utf8')

const q = (concept: string, opts: string, idx = 0) =>
  `    { concept: '${concept}', question: '¿Qué?', options: [${opts}], correctIndex: ${idx}, explanation: 'Porque.' },\n`

/** One bank per key style, with the strings that broke regex readers: escapes, «», a backtick. */
const MIXED = [
  'type Q = { concept: string }\n',
  'const QUESTION_BANK: Record<string, Q[]> = {\n',
  '  setup: [\n',
  q('a', `'it\\'s', "dice \\"hola\\"", \`plantilla\`, '«término»'`, 2),
  '  ],\n',
  "  // 'fake': [  <- a commented-out key is not a bank\n",
  "  'decisions-rules': [\n",
  q('b', `'uno', 'dos', 'tres', 'cuatro'`),
  q('b', `'uno', 'dos', 'tres', 'cuatro'`),
  '  ],\n',
  '  "functions-contracts": [\n',
  q('c', `'w', 'x' + 'y', 'z', 'v'`, 3),
  '  ],\n',
  '}\n',
].join('')

/** The regex test_exam_length_cue.py used until this reader replaced it (its `_BANK`). */
const LEGACY_SINGLE_QUOTE_ONLY = /^ {2}'([a-z0-9-]+)': \[/gm

test('the legacy regex is blind to two of the three key styles (the defect, recreated)', () => {
  const seen = [...MIXED.matchAll(LEGACY_SINGLE_QUOTE_ONLY)].map((m) => m[1])
  assert.deepEqual(seen, ['decisions-rules'], 'the recreation no longer reproduces the defect')
})

test('reads one bank per key style, decoding every option exactly', () => {
  const banks = readQuestionBank(MIXED)
  assert.deepEqual(banks.map((b) => [b.slug, b.keyStyle]), [
    ['setup', 'identifier'], ['decisions-rules', 'single'], ['functions-contracts', 'double'],
  ])
  assert.deepEqual(banks[0].questions[0].options, ["it's", 'dice "hola"', 'plantilla', '«término»'])
  assert.equal(banks[0].questions[0].correctIndex, 2)
  assert.deepEqual(banks[2].questions[0].options, ['w', 'xy', 'z', 'v'], 'a + chain of literals is one option')
  assert.deepEqual(banks[1].questions.map((x) => x.variant), [1, 2], 'variants number by order within a concept')
  assert.deepEqual(keyCensus(banks), { identifier: 1, single: 1, double: 1 })
})

test('refuses what it cannot read as a literal, naming the line', () => {
  const bankWith = (body: string) => `const QUESTION_BANK = {\n  setup: [\n${body}  ],\n}\n`
  const cases: Array<[string, string, RegExp]> = [
    ['substitution', q('a', '`${x}`, \'b\', \'c\', \'d\''), /not a plain string/],
    ['spread question', '    ...more,\n', /spread/],
    ['unknown field', "    { concept: 'a', question: 'q', options: ['a'], correctIndex: 0, explanation: 'e', hint: 'h' },\n", /unknown field "hint"/],
    ['missing field', "    { concept: 'a', question: 'q', options: ['a'], correctIndex: 0 },\n", /lacks explanation/],
    ['float index', "    { concept: 'a', question: 'q', options: ['a'], correctIndex: 1.5, explanation: 'e' },\n", /non-negative integer/],
    ['computed index', "    { concept: 'a', question: 'q', options: ['a'], correctIndex: N, explanation: 'e' },\n", /non-negative integer/],
  ]
  for (const [name, body, message] of cases) {
    assert.throws(() => readQuestionBank(bankWith(body)), (err: unknown) => {
      assert.ok(err instanceof NonLiteralBank, `${name}: not a NonLiteralBank`)
      assert.match(err.message, message, name)
      assert.equal(err.line, 3, `${name}: wrong line`)
      return true
    })
  }
  assert.throws(() => readQuestionBank('const QUESTION_BANK = {\n  [k]: [],\n}\n'), /computed or numeric/)
  assert.throws(() => readQuestionBank("const QUESTION_BANK = {\n  setup: [],\n  'setup': [],\n}\n"), /declared twice/)
  assert.throws(() => readQuestionBank('const OTHER = {}\n'), /found 0/)
})

test('the real seed: two independent counts and the course agree', () => {
  const banks = readQuestionBank(SEED)
  // Independent method: a line regex over all three key styles, on the initializer only.
  const start = SEED.indexOf('const QUESTION_BANK')
  const end = SEED.indexOf('\nasync function main')
  assert.ok(start > 0 && end > start, 'seed.ts no longer has QUESTION_BANK before main()')
  const body = SEED.slice(start, end)
  const keyLines = [...body.matchAll(/^ {2}(?:([a-z0-9-]+)|'([a-z0-9-]+)'|"([a-z0-9-]+)"): \[$/gm)]
    .map((m) => m[1] ?? m[2] ?? m[3])
  const indexLines = body.match(/^\s+correctIndex: \d+,?$/gm) ?? []

  assert.deepEqual(banks.map((b) => b.slug), keyLines, 'the parser and the line count disagree on the banks')
  assert.equal(banks.reduce((n, b) => n + b.questions.length, 0), indexLines.length)
  assert.deepEqual(
    [...banks.map((b) => b.slug)].sort(),
    COURSE_SECTIONS.map((s) => s.id).sort(),
    'every section has exactly one bank, keyed by its current id',
  )
  const census = keyCensus(banks)
  assert.ok(census.identifier > 0 && census.single > 0 && census.double > 0,
    `this seed mixes all three key styles; one vanished from the read: ${JSON.stringify(census)}`)
})

test('readSeedQuestionBank, the loader consumers use, reads exactly this file', () => {
  assert.deepEqual(readSeedQuestionBank(ROOT), readQuestionBank(SEED, 'prisma/seed.ts'))
})

test('the CLI prints the same banks, and exits 2 on a refusal', () => {
  const run = (args: string[]) => spawnSync(process.execPath, ['--import', 'tsx', 'scripts/learner_text_extractor.mts', ...args], {
    cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
  })
  const ok = run(['--question-bank', 'prisma/seed.ts'])
  assert.equal(ok.status, 0, ok.stderr)
  const printed = JSON.parse(ok.stdout)
  assert.deepEqual(printed.banks, readQuestionBank(SEED, 'prisma/seed.ts'))

  const bad = run(['--question-bank', 'tests/adversarial/learner-text-reader.test.ts'])
  assert.equal(bad.status, 2, 'a file with no QUESTION_BANK must be refused, not read as empty')
  assert.match(bad.stderr, /refused: expected one top-level QUESTION_BANK/)
})

test('literalsFromSource returns prose, never comments, keys or module paths', () => {
  const src = [
    "import x from './mod'",
    '// Un comentario con bootstrap si colas pesadas',
    "const o = { 'clave-larga': 'texto visible', otra: `plantilla ${x} con hueco` }",
    "const s = 'primera mitad ' +",
    "  'segunda mitad'",
    'const t = String.raw`etiquetada`',
  ].join('\n')
  const lits = literalsFromSource(src)
  assert.deepEqual(lits.map((l) => l.text), ['texto visible', 'plantilla  …  con hueco', 'primera mitad segunda mitad'])
  assert.deepEqual(lits.map((l) => l.line), [3, 3, 4])
})
