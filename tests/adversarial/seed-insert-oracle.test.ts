/**
 * Contract: what scripts/lib/learner_text.mts reads from prisma/seed.ts is exactly what the seed
 * inserts into the QuestionBank table.
 *
 * The reader parses the file; the seed evaluates it. If they ever disagree (a bank built by a
 * function call, a question spread in from elsewhere, a field the insert renames), every gate that
 * trusts the reader would be measuring a bank no learner sees. This runs the real seed.ts with
 * `@prisma/client` replaced by a recorder, so no database is touched, and compares field by field.
 *
 * The real bank cannot show how the seed numbers variants. Every section is 24 questions in
 * aligned triples, so the old numbering (`count % 3 + 1`) and the per-(section, concept) counter
 * agree on every row. The last tests run the seed's own `main()` over a synthetic bank whose
 * concepts are interleaved, where the two numberings differ, and compare against labels written by
 * hand.
 *
 * Run: node --experimental-test-module-mocks --import tsx --test tests/adversarial/seed-insert-oracle.test.ts
 */
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { after, before, mock, test } from 'node:test'
import { fileURLToPath, pathToFileURL } from 'node:url'

import ts from 'typescript'

import { readQuestionBank } from '../../scripts/lib/learner_text.mts'

if (typeof mock.module !== 'function') {
  throw new Error('mock.module is unavailable: run with --experimental-test-module-mocks')
}

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..')
const SEED_PATH = join(ROOT, 'prisma/seed.ts')

type Row = {
  id: number
  sectionId: string
  concept: string
  variant: number
  question: string
  options: string
  correctIndex: number
  explanation: string
}

/**
 * A recorder to stand in for PrismaClient. `rows` is what the table would hold, `inserted` is the
 * data each create() was called with (copied at the moment of the insert), `calls` is the order of
 * everything the seed asked the client to do. findMany returns rows in insertion order.
 */
function makeRecorder() {
  const rows: Row[] = []
  const inserted: Omit<Row, 'id'>[] = []
  const calls: string[] = []
  let disconnected!: () => void
  const done = new Promise<void>((resolve) => { disconnected = resolve })

  class RecordingPrismaClient {
    questionBank = {
      deleteMany: async () => { calls.push('deleteMany'); rows.length = 0; return { count: 0 } },
      create: async ({ data }: { data: Omit<Row, 'id'> }) => {
        const row = { id: rows.length + 1, ...data }
        rows.push(row)
        inserted.push({ ...data })
        return row
      },
      findMany: async () => { calls.push('findMany'); return rows.map((r) => ({ ...r })) },
      update: async ({ where, data }: { where: { id: number }; data: Partial<Row> }) => {
        calls.push('update')
        const row = rows.find((r) => r.id === where.id)
        if (!row) throw new Error(`update of unknown id ${where.id}`)
        Object.assign(row, data)
        return row
      },
    }

    subscriptionPlan = { upsert: async () => { calls.push('upsert') } }

    async $disconnect() {
      calls.push('$disconnect')
      disconnected()
    }
  }

  return { rows, inserted, calls, done, Client: RecordingPrismaClient }
}
type Recorder = ReturnType<typeof makeRecorder>

/** Import a seed module (it runs main() on load) and wait until it disconnects the recorder. */
async function runSeed(specifier: string, recorder: Recorder): Promise<{ exitCode: number | undefined; errors: unknown[] }> {
  const restore = { log: console.log, error: console.error, exit: process.exit }
  const errors: unknown[] = []
  let exitCode: number | undefined
  console.log = () => {}
  console.error = (...args: unknown[]) => { errors.push(args) }
  process.exit = ((code?: number) => { exitCode = code ?? 0 }) as typeof process.exit
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    await import(specifier)
    await Promise.race([recorder.done, new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error('seed never disconnected')), 30_000)
    })])
  } finally {
    clearTimeout(timer)
    Object.assign(console, { log: restore.log, error: restore.error })
    process.exit = restore.exit
  }
  return { exitCode, errors }
}

const real = makeRecorder()
const { rows, inserted, calls } = real
mock.module('@prisma/client', { namedExports: { PrismaClient: real.Client } })

let exitCode: number | undefined

before(async () => {
  const run = await runSeed('../../prisma/seed.ts', real)
  exitCode = run.exitCode
  assert.deepEqual(run.errors, [], 'the seed logged an error against the recorder')
})

test('the recorder stood in for the database (otherwise nothing below means anything)', () => {
  assert.equal(exitCode, undefined, 'the seed exited through its error path')
  assert.equal(calls[0], 'deleteMany')
  assert.equal(calls.at(-1), '$disconnect', calls.join(','))
  assert.ok(rows.length > 1000, `only ${rows.length} rows recorded`)
  assert.equal(inserted.length, rows.length)
})

test('every inserted row is the reader\'s question, in the same order, field by field', () => {
  const banks = readQuestionBank(readFileSync(SEED_PATH, 'utf8'), 'prisma/seed.ts')
  const expected = banks.flatMap((b) => b.questions.map((q) => ({
    sectionId: b.slug,
    concept: q.concept,
    question: q.question,
    options: JSON.stringify(q.options),
    correctIndex: q.correctIndex,
    explanation: q.explanation,
  })))
  const actual = rows.map(({ sectionId, concept, question, options, correctIndex, explanation }) =>
    ({ sectionId, concept, question, options, correctIndex, explanation }))
  assert.equal(actual.length, expected.length)
  assert.deepEqual(actual, expected)
})

test('each insert carries the reader\'s variant, and no pass renumbers the rows afterwards', () => {
  const banks = readQuestionBank(readFileSync(SEED_PATH, 'utf8'), 'prisma/seed.ts')
  const expected = banks.flatMap((b) => b.questions.map((q) => `${b.slug}|${q.concept}|${q.variant}`))
  // Read from the data passed to create(), not from the recorded rows: a later update() would
  // otherwise hide a wrong variant that the insert itself wrote.
  assert.deepEqual(inserted.map((r) => `${r.sectionId}|${r.concept}|${r.variant}`), expected)
  assert.deepEqual(calls.filter((c) => c === 'update' || c === 'findMany'), [], 'the seed renumbers after inserting')
})

test('within each (section, concept) the inserted variants are 1, 2, 3 in bank order', () => {
  const byConcept = new Map<string, number[]>()
  for (const r of inserted) {
    const key = `${r.sectionId}|${r.concept}`
    byConcept.set(key, [...(byConcept.get(key) ?? []), r.variant])
  }
  assert.ok(byConcept.size > 0)
  for (const [key, variants] of byConcept) {
    assert.deepEqual(variants, [1, 2, 3], key)
  }
})

// --- a bank of a different shape ---------------------------------------------------------------

/**
 * The synthetic bank: each section's concepts in bank order. Alpha interleaves two concepts, so no
 * run of three rows is one concept. Beta reuses a concept id from alpha (its count restarts in a
 * new section) and has three rows, so the running row count is no multiple of 3 when gamma begins.
 */
const SYNTHETIC: Record<string, string[]> = {
  alpha: ['one', 'two', 'one', 'two', 'one', 'two'],
  beta: ['one', 'two', 'one'],
  gamma: ['one'],
}

/** The labels the bank must get, written by hand: the nth row of a concept in a section is variant n. */
const SYNTHETIC_LABELS = [
  'alpha|one|1', 'alpha|two|1', 'alpha|one|2', 'alpha|two|2', 'alpha|one|3', 'alpha|two|3',
  'beta|one|1', 'beta|two|1', 'beta|one|2',
  'gamma|one|1',
]

const syntheticLiteral = (): string => {
  const question = (slug: string, concept: string, i: number) =>
    `{ concept: '${concept}', question: '${slug} ${i}', options: ['a', 'b', 'c', 'd'], correctIndex: 0, explanation: 'x' }`
  const banks = Object.entries(SYNTHETIC).map(([slug, concepts]) =>
    `  ${slug}: [\n${concepts.map((c, i) => `    ${question(slug, c, i)},`).join('\n')}\n  ],`)
  return `{\n${banks.join('\n')}\n}`
}

/** The seed's own source, QUESTION_BANK swapped for `literal` and PrismaClient imported from `stubUrl`. */
function syntheticSeedText(literal: string, stubUrl: string): string {
  const text = readFileSync(SEED_PATH, 'utf8')
  const sf = ts.createSourceFile('seed.ts', text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const declared = sf.statements.filter(ts.isVariableStatement)
    .flatMap((s) => [...s.declarationList.declarations])
    .filter((d) => ts.isIdentifier(d.name) && d.name.text === 'QUESTION_BANK')
  assert.equal(declared.length, 1, 'expected one top-level QUESTION_BANK in the seed')
  const init = declared[0]!.initializer
  assert.ok(init, 'QUESTION_BANK has no initializer')
  const spliced = text.slice(0, init.getStart(sf)) + literal + text.slice(init.getEnd())
  const IMPORT = "import { PrismaClient } from '@prisma/client'"
  assert.equal(spliced.split(IMPORT).length - 1, 1, `the seed no longer has the line this test rewrites: ${IMPORT}`)
  return spliced.replace(IMPORT, () => `import { PrismaClient } from '${stubUrl}'`)
}

let scratch = ''
after(() => {
  if (scratch) rmSync(scratch, { recursive: true, force: true })
})

/** Run the seed's main() against a recorder, with the synthetic bank in place of the real one. */
async function seedSynthetic(): Promise<{ recorder: Recorder; seedText: string; exitCode: number | undefined }> {
  scratch ||= mkdtempSync(join(tmpdir(), 'seed-insert-oracle-'))
  const stub = join(scratch, 'prisma-client-stub.mts')
  const seed = join(scratch, 'seed-synthetic.mts')
  const recorder = makeRecorder()
  writeFileSync(stub, 'export class PrismaClient {}\n')
  mock.module(pathToFileURL(stub).href, { namedExports: { PrismaClient: recorder.Client } })
  const seedText = syntheticSeedText(syntheticLiteral(), pathToFileURL(stub).href)
  writeFileSync(seed, seedText)
  const run = await runSeed(pathToFileURL(seed).href, recorder)
  assert.deepEqual(run.errors, [], 'the synthetic seed logged an error against the recorder')
  return { recorder, seedText, exitCode: run.exitCode }
}

test('the synthetic bank is not vacuous: the old numbering, count % 3 + 1, would mislabel it', () => {
  const rowsInBankOrder = Object.entries(SYNTHETIC).flatMap(([slug, concepts]) => concepts.map((c) => `${slug}|${c}`))
  const oldNumbering = rowsInBankOrder.map((key, count) => `${key}|${count % 3 + 1}`)
  assert.equal(oldNumbering.length, SYNTHETIC_LABELS.length)
  const wrong = oldNumbering.filter((label, i) => label !== SYNTHETIC_LABELS[i])
  assert.ok(wrong.length >= 5, `the old numbering mislabels only ${wrong.length} of ${oldNumbering.length} rows`)
})

test('the seed numbers an interleaved bank 1, 2, 3 per (section, concept) as it inserts', async () => {
  const { recorder, seedText, exitCode: code } = await seedSynthetic()
  assert.equal(code, undefined, 'the synthetic seed exited through its error path')
  assert.equal(recorder.calls[0], 'deleteMany', recorder.calls.join(','))
  assert.equal(recorder.calls.at(-1), '$disconnect')
  const labels = recorder.inserted.map((r) => `${r.sectionId}|${r.concept}|${r.variant}`)
  assert.deepEqual(labels, SYNTHETIC_LABELS)
  assert.deepEqual(recorder.calls.filter((c) => c === 'update' || c === 'findMany'), [], 'the seed renumbers after inserting')
  // The reader, which every gate trusts, gives the synthetic bank the same labels.
  const read = readQuestionBank(seedText, 'seed-synthetic.ts').flatMap((b) => b.questions.map((q) => `${b.slug}|${q.concept}|${q.variant}`))
  assert.deepEqual(read, SYNTHETIC_LABELS)
})
