/**
 * Contract: scripts/exam_bank_db_check.mts tells the owner whether a database's exam bank matches
 * the bank in this checkout, and never writes to the database it reads.
 *
 * The database is built the way the app builds one: every file in prisma/migrations, in order,
 * then the rows the reader sees in prisma/seed.ts. Each defect below is applied to that database
 * and the check must name exactly the sections it affects. A read-only check that said "fresh"
 * for a database it had not read would be worse than no check, so the first test asserts the
 * clean database is fresh, and the others assert the defects are reported and nothing else is.
 *
 * Run: node --import tsx --test tests/adversarial/exam-bank-db-check.test.ts
 */
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { after, before, test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { DatabaseSync } from 'node:sqlite'

import { COURSE_SECTIONS } from '../../src/lib/course'
import { readSeedQuestionBank, type Bank } from '../../scripts/lib/learner_text.mts'
import { check, formatReport, openBankDatabase, type Outcome, type SectionStatus } from '../../scripts/exam_bank_db_check.mts'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..')
const BANKS: Bank[] = readSeedQuestionBank(ROOT)
const DOUBLE_KEYED = BANKS.filter((b) => b.keyStyle === 'double').map((b) => b.slug).sort()
const MIGRATIONS = readdirSync(join(ROOT, 'prisma/migrations'), { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort()

let dir = ''
let template = ''
let counter = 0

before(() => {
  dir = mkdtempSync(join(tmpdir(), 'exam-bank-db-check-'))
  template = join(dir, 'template.sqlite')
  buildTemplate(template)
})

after(() => {
  rmSync(dir, { recursive: true, force: true })
})

/** The real migrations applied, then every bank row inserted as the seed inserts it. */
function buildTemplate(path: string): void {
  const db = new DatabaseSync(path)
  try {
    for (const name of MIGRATIONS) {
      db.exec(readFileSync(join(ROOT, 'prisma/migrations', name, 'migration.sql'), 'utf8'))
    }
    const insert = db.prepare(
      'INSERT INTO "QuestionBank" ("id","sectionId","concept","variant","question","options","correctIndex","explanation") VALUES (?,?,?,?,?,?,?,?)',
    )
    let n = 0
    for (const bank of BANKS) {
      for (const q of bank.questions) {
        insert.run(`qb-${++n}`, bank.slug, q.concept, q.variant, q.question, JSON.stringify(q.options), q.correctIndex, q.explanation)
      }
    }
  } finally {
    db.close()
  }
}

/** A fresh copy of the template, so each test edits its own database. */
function bankDatabase(): string {
  const path = join(dir, `bank-${++counter}.sqlite`)
  copyFileSync(template, path)
  return path
}

/** The one statement a test runs against a database, through the same handle the check uses. */
function edit(path: string, sql: string, params: Array<string | number> = []): void {
  const db = new DatabaseSync(path)
  try {
    db.prepare(sql).run(...params)
  } finally {
    db.close()
  }
}

const statusesOf = (outcome: Outcome) => new Map(outcome.reports.map((r) => [r.id, r.status]))

/** The sections whose status is not `fresh`, and what it is. */
function notFresh(outcome: Outcome): Array<[string, SectionStatus]> {
  return outcome.reports.filter((r) => r.status !== 'fresh').map((r) => [r.id, r.status]).sort()
}

const sha256 = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex')

const SETUP_DOC = join(ROOT, 'docs/ELI5_DYNAMIC_LMS_SETUP.md')

/** The setup doc's section on this check, from its heading to the next horizontal rule. */
function docSection(): string {
  const text = readFileSync(SETUP_DOC, 'utf8')
  const start = text.indexOf('## Check the exam bank in the database')
  assert.notEqual(start, -1, 'the setup doc lost its section on the exam bank check')
  const end = text.indexOf('\n---', start)
  return text.slice(start, end === -1 ? undefined : end)
}

test('a database built from the real migrations and this checkout\'s bank is fresh in every section', async () => {
  const outcome = await check(bankDatabase())
  assert.equal(outcome.error, undefined, outcome.error)
  assert.equal(outcome.exitCode, 0)
  assert.equal(outcome.reports.length, COURSE_SECTIONS.length)
  assert.deepEqual(notFresh(outcome), [])
})

test('the five double-quoted banks, deleted, are exactly the five reported missing', async () => {
  assert.equal(DOUBLE_KEYED.length, 5, `the seed has ${DOUBLE_KEYED.length} double-quoted banks; the scenario expects 5`)
  const path = bankDatabase()
  for (const slug of DOUBLE_KEYED) edit(path, 'DELETE FROM "QuestionBank" WHERE "sectionId" = ?', [slug])
  const outcome = await check(path)
  assert.equal(outcome.exitCode, 1)
  assert.deepEqual(notFresh(outcome), DOUBLE_KEYED.map((id) => [id, 'missing']))
})

test('the hash does not depend on the order rows are stored in', async () => {
  // Re-insert every row in reverse, so each section's rows come back in the opposite order.
  const path = bankDatabase()
  const db = new DatabaseSync(path)
  try {
    const rows = db.prepare('SELECT * FROM "QuestionBank"').all() as Array<Record<string, string | number>>
    db.exec('DELETE FROM "QuestionBank"')
    const insert = db.prepare(
      'INSERT INTO "QuestionBank" ("id","sectionId","concept","variant","question","options","correctIndex","explanation") VALUES (?,?,?,?,?,?,?,?)',
    )
    for (const r of rows.reverse()) {
      insert.run(r.id!, r.sectionId!, r.concept!, r.variant!, r.question!, r.options!, r.correctIndex!, r.explanation!)
    }
  } finally {
    db.close()
  }
  const outcome = await check(path)
  assert.equal(outcome.exitCode, 0)
  assert.deepEqual(notFresh(outcome), [])
})

test('one changed option makes only its section stale', async () => {
  const path = bankDatabase()
  edit(path, 'UPDATE "QuestionBank" SET "options" = ? WHERE "id" = (SELECT "id" FROM "QuestionBank" WHERE "sectionId" = ? LIMIT 1)', [
    JSON.stringify(['uno', 'dos', 'tres', 'cuatro']),
    'setup',
  ])
  const outcome = await check(path)
  assert.equal(outcome.exitCode, 1)
  assert.deepEqual(notFresh(outcome), [['setup', 'stale']])
})

test('variant labels swapped between two questions of one concept make only its section stale', async () => {
  // Same rows, same shape, same multiset of labels: only the tie between a label and its question is
  // broken. The old seed numbered rows in a findMany pass with no orderBy, so a database it wrote may
  // carry labels in another order than the new seed's insert-time counter gives them.
  const bank = BANKS.find((b) => b.slug === 'setup')!
  const concept = bank.questions[0]!.concept
  const [first, second] = bank.questions.filter((q) => q.concept === concept)
  assert.notEqual(first!.question, second!.question, 'the two variants must differ, or swapping them changes nothing')
  const path = bankDatabase()
  // The unique key (sectionId, concept, variant) forbids a direct swap, so go through a free value.
  const relabel = (from: number, to: number) => edit(
    path,
    'UPDATE "QuestionBank" SET "variant" = ? WHERE "sectionId" = ? AND "concept" = ? AND "variant" = ?',
    [to, 'setup', concept, from],
  )
  relabel(1, 99)
  relabel(2, 1)
  relabel(99, 2)
  const outcome = await check(path)
  assert.equal(outcome.exitCode, 1)
  assert.deepEqual(notFresh(outcome), [['setup', 'stale']])
})

test('a key of 9 on a four-option question makes its section malformed, not stale', async () => {
  const path = bankDatabase()
  edit(path, 'UPDATE "QuestionBank" SET "correctIndex" = 9 WHERE "id" = (SELECT "id" FROM "QuestionBank" WHERE "sectionId" = ? LIMIT 1)', ['basics'])
  const outcome = await check(path)
  assert.equal(outcome.exitCode, 1)
  assert.deepEqual(notFresh(outcome), [['basics', 'malformed']])
  const report = outcome.reports.find((r) => r.id === 'basics')!
  assert.match(report.detail.join('\n'), /correctIndex 9 is not one of its 4 options/)
})

test('rows only under a pre-rename slug are alias-only for the renamed section', async () => {
  const path = bankDatabase()
  edit(path, 'UPDATE "QuestionBank" SET "sectionId" = ? WHERE "sectionId" = ?', ['performance', 'apis-sql-geo'])
  const outcome = await check(path)
  assert.equal(outcome.exitCode, 1)
  assert.deepEqual(notFresh(outcome), [['apis-sql-geo', 'alias-only']])
  // The old slug is not a section, so it is not reported as one.
  assert.equal(statusesOf(outcome).has('performance'), false)
})

test('rows left under the old slug beside the current id\'s rows are counted, and do not fail the check', async () => {
  // The rename migration keeps twins. exam/start keeps one copy of each (concept, variant) and prefers
  // the current id's, so twins of the same rows change nothing a learner sees.
  const rowsInBank = BANKS.find((b) => b.slug === 'apis-sql-geo')!.questions.length
  const path = bankDatabase()
  edit(path, 'INSERT INTO "QuestionBank" ("id","sectionId","concept","variant","question","options","correctIndex","explanation") '
    + 'SELECT "id" || \'-old\', ?, "concept", "variant", "question", "options", "correctIndex", "explanation" '
    + 'FROM "QuestionBank" WHERE "sectionId" = ?', ['performance', 'apis-sql-geo'])
  const outcome = await check(path)
  assert.equal(outcome.exitCode, 0)
  assert.deepEqual(notFresh(outcome), [])
  const report = outcome.reports.find((r) => r.id === 'apis-sql-geo')!
  assert.deepEqual([report.status, report.rows, report.aliasRows], ['fresh', rowsInBank, rowsInBank])
  // The count is on the printed line, so the owner sees the leftover rows.
  assert.match(formatReport('test.sqlite', outcome), new RegExp(`^fresh\\s+apis-sql-geo\\s+${rowsInBank}\\s+${rowsInBank}\\s`, 'm'))
})

test('an extra variant makes only its section wrong-shape', async () => {
  const path = bankDatabase()
  edit(path, 'INSERT INTO "QuestionBank" ("id","sectionId","concept","variant","question","options","correctIndex","explanation") '
    + 'SELECT "id" || \'-extra\', "sectionId", "concept", 4, "question", "options", "correctIndex", "explanation" '
    + 'FROM "QuestionBank" WHERE "sectionId" = ? LIMIT 1', ['collections'])
  const outcome = await check(path)
  assert.deepEqual(notFresh(outcome), [['collections', 'wrong-shape']])
})

test('the check reads through a handle that refuses writes, and leaves the database unchanged', async () => {
  const path = bankDatabase()
  const handle = openBankDatabase(path, await import('node:sqlite'))
  try {
    assert.throws(() => handle.exec('DELETE FROM "QuestionBank"'), /readonly/i)
  } finally {
    handle.close()
  }
  const outcome = await check(path)
  assert.equal(outcome.exitCode, 0)
  assert.deepEqual(notFresh(outcome), [])
})

test('a sqlite module that cannot be loaded exits 2 and reports nothing', async () => {
  const outcome = await check(bankDatabase(), {
    loadSqlite: async () => {
      throw Object.assign(new Error('No such built-in module: node:sqlite'), { code: 'ERR_UNKNOWN_BUILTIN_MODULE' })
    },
  })
  assert.equal(outcome.exitCode, 2)
  assert.match(outcome.error ?? '', /node:sqlite/)
  assert.deepEqual(outcome.reports, [])
})

test('a database with no QuestionBank table exits 2, not fresh', async () => {
  const path = join(dir, 'not-pyarcana.sqlite')
  new DatabaseSync(path).close()
  const outcome = await check(path)
  assert.equal(outcome.exitCode, 2)
  assert.match(outcome.error ?? '', /QuestionBank/)
})

test('the command line: no --db and a missing file both exit 2, and the missing file is not created', () => {
  const script = join(ROOT, 'scripts/exam_bank_db_check.mts')
  const run = (args: string[]) => spawnSync(process.execPath, ['--import', 'tsx', script, ...args], {
    cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
  })
  assert.equal(run([]).status, 2)
  const absent = join(dir, 'never-created.sqlite')
  const res = run(['--db', absent])
  assert.equal(res.status, 2, res.stderr)
  assert.equal(existsSync(absent), false, 'the check must not create the file it was asked to read')
})

test('the command line leaves the database byte-identical and exits 0 on a fresh one', () => {
  const path = bankDatabase()
  const before = sha256(path)
  const size = statSync(path).size
  const res = spawnSync(process.execPath, ['--import', 'tsx', join(ROOT, 'scripts/exam_bank_db_check.mts'), '--db', path], {
    cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
  })
  assert.equal(res.status, 0, res.stderr)
  assert.equal(sha256(path), before)
  assert.equal(statSync(path).size, size)
  // Hashes and counts, never question text: no question in the bank may appear in the output.
  const leaked = BANKS.flatMap((b) => b.questions).filter((q) => res.stdout.includes(q.question))
  assert.deepEqual(leaked.map((q) => q.question), [])
  // Every section of the course is fresh and nothing else is: the count is the course's, not a literal.
  assert.match(
    res.stdout,
    new RegExp(`^summary: fresh ${COURSE_SECTIONS.length}, stale 0, missing 0, malformed 0, alias-only 0, wrong-shape 0$`, 'm'),
  )
})

test('the setup doc describes the check without a section count that the course will outgrow', () => {
  // The course gains sections; a count written into the doc goes stale without any test noticing.
  assert.doesNotMatch(docSection(), /\b\d+\s+(course\s+)?sections\b/i)
})
