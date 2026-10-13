/**
 * Does a PyArcana database hold the exam bank this checkout defines? Read-only; owner-run.
 *
 *   node --import tsx scripts/exam_bank_db_check.mts --db <path/to/database.sqlite>
 *
 * For each course section, the rows the database holds under the section's current id are compared
 * with the bank prisma/seed.ts defines for it. Each section gets one status:
 *
 *   fresh        the rows match the bank
 *   stale        the rows are well formed and of the bank's shape, but their content differs
 *   missing      no rows under the current id or any pre-rename id
 *   alias-only   rows exist only under a pre-rename id (the rename migration has not reached them)
 *   malformed    a row exam/start cannot show (options that are not a list of two or more strings,
 *                or a key outside them); the same check exam/start runs before it creates an attempt
 *   wrong-shape  the (concept, variant, option count) rows differ from the bank's
 *
 * A section's content hash is sha256 over its rows: each row is JSON of
 * [concept, variant, question, options, correctIndex, explanation], the rows are sorted, and the
 * sorted lines are joined with a newline. `variant` is in the hash, so each label is tied to the
 * question it numbers: a database whose variant 1 and variant 2 are swapped is stale, not fresh.
 * `variant` is also in the shape, which catches a missing or extra label before content is compared.
 *
 * Exit 0: every section is fresh. Exit 1: at least one is not. Exit 2: the check could not run
 * (no --db, no such file, no node:sqlite, not a PyArcana database, or this checkout's bank cannot
 * be read). The database is opened with readOnly: true, and the check prints hashes and counts,
 * never question text.
 */
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { COURSE_SECTIONS } from '../src/lib/course/index'
import { bankOptions, InvalidBankRow, toFormItem } from '../src/lib/exam-scoring.ts'
import { SECTION_ID_RENAMES } from '../src/lib/section-id-migrations.ts'
import { readSeedQuestionBank, type Bank, type BankQuestion } from './lib/learner_text.mts'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

export type SectionStatus = 'fresh' | 'stale' | 'missing' | 'malformed' | 'alias-only' | 'wrong-shape'

export type SectionReport = {
  id: string
  status: SectionStatus
  /** Rows under the section's current id. */
  rows: number
  /** Rows under a pre-rename id. Informational: exam/start prefers the current id's rows. */
  aliasRows: number
  dbSha256: string | null
  bankSha256: string
  detail: string[]
}

export type Outcome = { exitCode: 0 | 1 | 2; reports: SectionReport[]; error?: string }

type SqliteModule = typeof import('node:sqlite')

export type Env = {
  loadSqlite: () => Promise<SqliteModule>
  loadBank: () => RepoBank
}

export type RepoBank = { banks: Bank[]; sectionIds: string[]; renamedFrom: Readonly<Record<string, string>> }

/** One row of QuestionBank, as the database stores it. */
type DbRow = {
  id: string
  sectionId: string
  concept: string
  variant: number
  question: string
  options: string
  correctIndex: number
  explanation: string
}

/** The fields the content hash covers, once options are parsed. */
type Content = {
  concept: string
  variant: number
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

const shapeKey = (concept: string, variant: number, optionCount: number): string =>
  `${concept} variant ${variant} (${optionCount} options)`

/** sha256 over the sorted content rows, one JSON line each (see the header). */
export function contentDigest(rows: Content[]): string {
  const lines = rows.map((r) => JSON.stringify([r.concept, r.variant, r.question, r.options, r.correctIndex, r.explanation])).sort()
  return createHash('sha256').update(lines.join('\n')).digest('hex')
}

const bankContent = (q: BankQuestion): Content => ({
  concept: q.concept,
  variant: q.variant,
  question: q.question,
  options: q.options,
  correctIndex: q.correctIndex,
  explanation: q.explanation,
})

/** Why exam/start could not show this row, or undefined when it can. */
function rowProblem(row: DbRow): string | undefined {
  try {
    const options = bankOptions(row)
    toFormItem(row, options.map((_, i) => i))
    return undefined
  } catch (err) {
    if (err instanceof InvalidBankRow) return err.message
    throw err
  }
}

/** The multiset difference a \ b, for listing what one side has and the other does not. */
function surplus(a: string[], b: string[]): string[] {
  const left = new Map<string, number>()
  for (const x of b) left.set(x, (left.get(x) ?? 0) + 1)
  const out: string[] = []
  for (const x of a) {
    const n = left.get(x) ?? 0
    if (n > 0) left.set(x, n - 1)
    else out.push(x)
  }
  return out
}

/** Every reason a section's rows are wrong in shape, listed both ways, or [] when they match. */
function shapeDetail(rows: DbRow[], bank: Bank): string[] {
  const inDb = rows.map((r) => shapeKey(r.concept, r.variant, bankOptions(r).length))
  const inBank = bank.questions.map((q) => shapeKey(q.concept, q.variant, q.options.length))
  const extra = surplus(inDb, inBank)
  const missing = surplus(inBank, inDb)
  if (!extra.length && !missing.length) return []
  const list = (label: string, items: string[]) => (items.length ? [`${label}: ${items.slice(0, 5).join('; ')}`] : [])
  return [`${rows.length} rows, bank has ${bank.questions.length}`, ...list('only in database', extra), ...list('only in bank', missing)]
}

/** The first problem that applies to a section, in the order the header lists them. */
function classify(id: string, current: DbRow[], aliasRows: DbRow[], bank: Bank): SectionReport {
  const base = { id, rows: current.length, aliasRows: aliasRows.length, bankSha256: contentDigest(bank.questions.map(bankContent)) }
  if (current.length === 0) {
    if (aliasRows.length === 0) return { ...base, status: 'missing', dbSha256: null, detail: ['no rows under this id or a pre-rename id'] }
    const from = [...new Set(aliasRows.map((r) => r.sectionId))].join(', ')
    return { ...base, status: 'alias-only', dbSha256: null, detail: [`${aliasRows.length} rows only under pre-rename id ${from}`] }
  }
  const bad = current.map((r) => [r, rowProblem(r)] as const).filter(([, p]) => p !== undefined)
  if (bad.length) {
    return { ...base, status: 'malformed', dbSha256: null, detail: bad.map(([r, p]) => `${r.concept} variant ${r.variant}: ${p}`) }
  }
  const shape = shapeDetail(current, bank)
  if (shape.length) return { ...base, status: 'wrong-shape', dbSha256: null, detail: shape }
  const dbSha256 = contentDigest(current.map((r) => ({ ...r, options: bankOptions(r) })))
  const status: SectionStatus = dbSha256 === base.bankSha256 ? 'fresh' : 'stale'
  return { ...base, status, dbSha256, detail: status === 'stale' ? ['content differs from the bank'] : [] }
}

/** One report per section in `sectionIds`, from every QuestionBank row. */
export function checkRows(rows: DbRow[], repo: RepoBank): SectionReport[] {
  const bankOf = new Map(repo.banks.map((b) => [b.slug, b]))
  return repo.sectionIds.map((id) => {
    const bank = bankOf.get(id)
    if (!bank) throw new Error(`this checkout has no exam bank for section "${id}"`)
    const aliases = Object.keys(repo.renamedFrom).filter((old) => repo.renamedFrom[old] === id)
    const current = rows.filter((r) => r.sectionId === id)
    const aliasRows = rows.filter((r) => aliases.includes(r.sectionId))
    return classify(id, current, aliasRows, bank)
  })
}

/** A read-only handle. Every write through it throws, so the check cannot change the database. */
export function openBankDatabase(path: string, sqlite: SqliteModule): InstanceType<SqliteModule['DatabaseSync']> {
  return new sqlite.DatabaseSync(path, { readOnly: true })
}

function readRows(db: InstanceType<SqliteModule['DatabaseSync']>): DbRow[] {
  const table = db.prepare('SELECT name FROM sqlite_master WHERE type = \'table\' AND name = \'QuestionBank\'').all()
  if (table.length === 0) throw new Error('no QuestionBank table: this is not a PyArcana database')
  return db.prepare(
    'SELECT "id","sectionId","concept","variant","question","options","correctIndex","explanation" FROM "QuestionBank"',
  ).all() as unknown as DbRow[]
}

const refused = (error: string): Outcome => ({ exitCode: 2, reports: [], error })
const reason = (err: unknown): string => (err instanceof Error ? err.message : String(err))

let repoCache: RepoBank | undefined
function repoBank(): RepoBank {
  repoCache ??= {
    banks: readSeedQuestionBank(ROOT),
    sectionIds: COURSE_SECTIONS.map((s) => s.id),
    renamedFrom: SECTION_ID_RENAMES,
  }
  return repoCache
}

export const defaultEnv: Env = {
  loadSqlite: () => import('node:sqlite'),
  loadBank: repoBank,
}

/** Compare the database at `dbPath` with this checkout's bank. Never writes to the database. */
export async function check(dbPath: string | undefined, overrides: Partial<Env> = {}): Promise<Outcome> {
  const env: Env = { ...defaultEnv, ...overrides }
  if (!dbPath) return refused('usage: --db <path to the sqlite database>')
  if (!existsSync(dbPath)) return refused(`no file at ${dbPath}`)
  let repo: RepoBank
  try {
    repo = env.loadBank()
  } catch (err) {
    return refused(`cannot read this checkout's exam bank: ${reason(err)}`)
  }
  let sqlite: SqliteModule
  try {
    sqlite = await env.loadSqlite()
  } catch (err) {
    return refused(`node:sqlite is not available (Node 22.13 or newer provides it): ${reason(err)}`)
  }
  let db: InstanceType<SqliteModule['DatabaseSync']>
  try {
    db = openBankDatabase(dbPath, sqlite)
  } catch (err) {
    return refused(`cannot open ${dbPath} read-only: ${reason(err)}`)
  }
  try {
    const reports = checkRows(readRows(db), repo)
    return { exitCode: reports.every((r) => r.status === 'fresh') ? 0 : 1, reports }
  } catch (err) {
    return refused(reason(err))
  } finally {
    db.close()
  }
}

const COUNT_KEYS: SectionStatus[] = ['fresh', 'stale', 'missing', 'malformed', 'alias-only', 'wrong-shape']

/** The printed report: one line per section, then the detail of each section that is not fresh. */
export function formatReport(dbPath: string, outcome: Outcome): string {
  const lines = [`exam bank check: ${dbPath}`, `checkout bank: ${outcome.reports.length} sections`]
  lines.push(`${'status'.padEnd(12)}${'section'.padEnd(32)}${'rows'.padEnd(6)}${'aliases'.padEnd(9)}database sha256 / bank sha256`)
  for (const r of outcome.reports) {
    const hashes = `${r.dbSha256 ?? '-'} / ${r.bankSha256}`
    lines.push(`${r.status.padEnd(12)}${r.id.padEnd(32)}${String(r.rows).padEnd(6)}${String(r.aliasRows).padEnd(9)}${hashes}`)
  }
  const counts = COUNT_KEYS.map((k) => `${k} ${outcome.reports.filter((r) => r.status === k).length}`)
  lines.push(`summary: ${counts.join(', ')}`)
  for (const r of outcome.reports.filter((x) => x.status !== 'fresh')) {
    for (const d of r.detail) lines.push(`  ${r.id} (${r.status}): ${d}`)
  }
  return lines.join('\n') + '\n'
}

/** `--db <path>` from argv, or undefined. Anything else is a usage error (exit 2). */
function parseArgs(argv: string[]): { dbPath?: string; error?: string } {
  if (argv.length === 0) return {}
  if (argv.length === 2 && argv[0] === '--db') return { dbPath: argv[1] }
  return { error: `usage: --db <path to the sqlite database>, got: ${argv.join(' ')}` }
}

/** The command: prints the report (or the refusal) and returns the exit code. */
export async function main(
  argv: string[],
  out: (text: string) => void = (t) => process.stdout.write(t),
  err: (text: string) => void = (t) => process.stderr.write(t),
  overrides: Partial<Env> = {},
): Promise<number> {
  const args = parseArgs(argv)
  const outcome = args.error ? refused(args.error) : await check(args.dbPath, overrides)
  if (outcome.error) {
    err(`exam bank check: refused: ${outcome.error}\n`)
    return 2
  }
  out(formatReport(args.dbPath!, outcome))
  return outcome.exitCode
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).then((code) => {
    process.exitCode = code
  })
}
