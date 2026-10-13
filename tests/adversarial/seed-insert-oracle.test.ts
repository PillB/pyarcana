/**
 * Contract: what scripts/lib/learner_text.mts reads from prisma/seed.ts is exactly what the seed
 * inserts into the QuestionBank table.
 *
 * The reader parses the file; the seed evaluates it. If they ever disagree (a bank built by a
 * function call, a question spread in from elsewhere, a field the insert renames), every gate that
 * trusts the reader would be measuring a bank no learner sees. This runs the real seed.ts with
 * `@prisma/client` replaced by a recorder, so no database is touched, and compares field by field.
 *
 * Run: node --experimental-test-module-mocks --import tsx --test tests/adversarial/seed-insert-oracle.test.ts
 */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { before, mock, test } from 'node:test'
import { fileURLToPath } from 'node:url'

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

const rows: Row[] = []
/** The data each create() was called with, copied at the moment of the insert. */
const inserted: Omit<Row, 'id'>[] = []
const calls: string[] = []
let disconnected!: () => void
const done = new Promise<void>((resolve) => { disconnected = resolve })

/** Records what the seed would write. findMany returns rows in insertion order. */
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

mock.module('@prisma/client', { namedExports: { PrismaClient: RecordingPrismaClient } })

let exitCode: number | undefined

before(async () => {
  const restore = { log: console.log, error: console.error, exit: process.exit }
  const errors: unknown[] = []
  console.log = () => {}
  console.error = (...args: unknown[]) => { errors.push(args) }
  process.exit = ((code?: number) => { exitCode = code ?? 0 }) as typeof process.exit
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    await import('../../prisma/seed.ts')
    await Promise.race([done, new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error('seed never disconnected')), 30_000)
    })])
  } finally {
    clearTimeout(timer)
    Object.assign(console, { log: restore.log, error: restore.error })
    process.exit = restore.exit
  }
  assert.deepEqual(errors, [], 'the seed logged an error against the recorder')
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
