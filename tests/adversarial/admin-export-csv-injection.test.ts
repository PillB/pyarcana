/**
 * Adversarial route tests — GET /api/admin/export, the students and attempts CSV reports.
 *
 * Both reports were built by string concatenation, writing `"${r.name}"` and `"${a.user.email}"`
 * straight into a cell. Two defects followed, and both are the export's to fix:
 *
 *  - CSV injection (OWASP). `name` is learner-controlled and the local part of an address may
 *    legally start with `=`, `+`, `-` or `@`, so `=HYPERLINK("http://evil","click")` in a name
 *    became a live formula the moment an admin opened the file in Excel, Calc or Sheets.
 *  - Broken rows. A `"` inside a value closed the quoted field early and every later column on
 *    that row shifted; a comma or a newline did the same. An admin reading the file saw a
 *    plausible row with the wrong learner's numbers in it.
 *
 * These tests run the real GET handler and parse its output with an independent RFC 4180 reader
 * — a spreadsheet's job, written here so the test cannot agree with the export by sharing its
 * code. Only the boundaries the route does not own are replaced (next-auth, the database); the
 * section-id canonicalisation and the completion arithmetic run as in production. The fake
 * database applies the route's `where` clause literally and refuses any operator it does not
 * model, so a route that starts filtering differently fails here instead of passing.
 *
 * Run: node --experimental-test-module-mocks --import tsx --test tests/adversarial/admin-export-csv-injection.test.ts
 *      (npm run test:adversarial:node passes the flag)
 */
import { before, beforeEach, describe, it, mock } from 'node:test'
import assert from 'node:assert/strict'
import { GRADING_VERSION } from '../../src/lib/exam-scoring.ts'

if (typeof mock.module !== 'function') {
  throw new Error(
    'mock.module is unavailable: run with --experimental-test-module-mocks ' +
      '(npm run test:adversarial:node passes it).'
  )
}

// The headers an admin's spreadsheet is keyed on. Written out literally, not derived from the
// route, so a column added, dropped or reordered fails here rather than silently reaching them.
const STUDENT_HEADERS =
  'ID,Email,Nombre,Fecha Registro,Secciones Completadas,% Completado,Intentos Exam,Score Promedio'
const ATTEMPT_HEADERS =
  'Attempt ID,User Email,Section,Attempt #,Score,Time (sec),Completed At,Counts as evidence'

/** What Excel, LibreOffice Calc and Google Sheets read as the first character of a formula. */
const FORMULA_TRIGGERS = ['=', '+', '-', '@', '\t', '\r']

type Row = Record<string, unknown>

const store: { users: Row[]; progress: Row[]; attempts: Row[] } = { users: [], progress: [], attempts: [] }

function matchesOne(value: unknown, want: unknown, key: string): boolean {
  if (want === null) return value == null
  if (typeof want !== 'object') return value === want
  const entries = Object.entries(want as object)
  if (entries.length !== 1) throw new Error(`fake db: unmodelled filter on ${key}`)
  const [op, arg] = entries[0]!
  if (op === 'not' && arg === null) return value != null
  throw new Error(`fake db: unmodelled filter on ${key}: ${JSON.stringify(want)}`)
}
const matches = (row: Row, where: Row) =>
  Object.entries(where).every(([key, want]) => matchesOne(row[key], want, key))

const project = (row: Row, select?: Row) =>
  select ? Object.fromEntries(Object.keys(select).map((k) => [k, row[k]])) : { ...row }

const fakeDb = {
  user: {
    async findMany({ where, select }: { where: Row; select?: Row }) {
      return store.users.filter((u) => matches(u, where)).map((u) => project(u, select))
    },
  },
  progress: {
    async findMany({ where }: { where: Row }) {
      return store.progress.filter((p) => matches(p, where)).map((p) => ({ ...p }))
    },
  },
  examAttempt: {
    async findMany({ where, include }: { where: Row; include?: { user?: boolean } }) {
      return store.attempts
        .filter((a) => matches(a, where))
        .map((a) => (include?.user ? { ...a, user: store.users.find((u) => u.id === a.userId) } : { ...a }))
    },
  },
}

let sessionRole = 'ADMIN'
mock.module('next-auth', {
  namedExports: { getServerSession: async () => ({ user: { id: 'admin-1', role: sessionRole } }) },
})
mock.module('@/lib/auth', { namedExports: { authOptions: {} } })
mock.module('@/lib/db', { namedExports: { db: fakeDb } })

type ExportRoute = typeof import('../../src/app/api/admin/export/route.ts')
let GET: ExportRoute['GET']

before(async () => {
  // The route must load after the mocks are registered, and as the dynamic LMS.
  delete process.env.NEXT_PUBLIC_STATIC_SITE
  ;({ GET } = await import('../../src/app/api/admin/export/route.ts'))
})

/**
 * RFC 4180, as a spreadsheet reads it: a quoted field may hold commas, newlines and `""` for a
 * literal quote. Deliberately not the export's own escaping run backwards.
 */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [[]]
  let field = ''
  let quoted = false
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i]
    if (quoted) {
      if (c !== '"') field += c
      else if (text[i + 1] === '"') { field += '"'; i += 1 }
      else quoted = false
      continue
    }
    if (c === '"') quoted = true
    else if (c === ',') { rows[rows.length - 1]!.push(field); field = '' }
    else if (c === '\n') { rows[rows.length - 1]!.push(field); field = ''; rows.push([]) }
    else field += c
  }
  rows[rows.length - 1]!.push(field)
  return rows
}

async function exportCsv(type: string): Promise<string> {
  const res = await GET(new Request(`http://localhost/api/admin/export?type=${type}`))
  assert.equal(res.status, 200)
  assert.match(res.headers.get('Content-Type') ?? '', /text\/csv/)
  return res.text()
}

/** Every cell a spreadsheet would evaluate rather than display. */
const formulaCells = (rows: string[][]) =>
  rows.flat().filter((cell) => FORMULA_TRIGGERS.includes(cell[0] ?? ''))

function addStudent(fields: { id: string; email: string; name: string | null }) {
  store.users.push({ ...fields, role: 'STUDENT', createdAt: new Date('2026-03-04T10:00:00.000Z') })
}

beforeEach(() => {
  store.users = []
  store.progress = []
  store.attempts = []
  sessionRole = 'ADMIN'
})

describe('GET /api/admin/export?type=students', () => {
  it('does not hand the admin a spreadsheet formula a learner wrote', async () => {
    addStudent({ id: 'u1', email: 'ana@example.com', name: '=HYPERLINK("http://evil","click")' })
    addStudent({ id: 'u2', email: '=SUM(A1:A9)@example.com', name: 'Beto' })
    addStudent({ id: 'u3', email: '+34movil@example.com', name: '@todos' })
    addStudent({ id: 'u4', email: 'dana@example.com', name: '\tDana' })

    const rows = parseCsv(await exportCsv('students'))

    assert.deepEqual(formulaCells(rows), [])
    // Disarmed, not discarded: the admin still reads the name the learner typed.
    const byId = new Map(rows.slice(1).map((r) => [r[0], r]))
    assert.equal(byId.get('u1')![2], `'=HYPERLINK("http://evil","click")`)
    assert.equal(byId.get('u3')![1], "'+34movil@example.com")
    assert.equal(byId.get('u4')![2], "'\tDana")
  })

  it('keeps every row on its own columns when a name carries " , or a newline', async () => {
    // An unbalanced `"` is what actually shifts the columns: the old export closed the field at
    // it, and the next `,` in the name then read as a column separator. A name whose quotes
    // happen to balance stayed on eight columns and only lost its quote marks, so both shapes
    // are here — one for the shift, one for the silent corruption.
    addStudent({ id: 'u1', email: 'ana@example.com', name: 'Ana " Ruiz, Beto' })
    addStudent({ id: 'u2', email: 'beto@example.com', name: 'Beto "El Jefe" Ruiz' })
    addStudent({ id: 'u3', email: 'caro@example.com', name: 'Caro\nDíaz' })
    addStudent({ id: 'u4', email: 'dina@example.com', name: null })

    const rows = parseCsv(await exportCsv('students'))

    assert.equal(rows[0]!.join(','), STUDENT_HEADERS)
    assert.equal(rows.length, 5, 'four learners and one header row')
    for (const row of rows) assert.equal(row.length, 8, `row shifted columns: ${JSON.stringify(row)}`)

    const names = rows.slice(1).map((r) => r[2])
    assert.deepEqual(
      new Set(names),
      new Set(['Ana " Ruiz, Beto', 'Beto "El Jefe" Ruiz', 'Caro\nDíaz', ''])
    )
    // The shifted row used to carry the next column's value, so an admin read a real date as a name.
    assert.deepEqual(rows[1]!.slice(3, 6), ['2026-03-04', '0', '0%'])
  })
})

describe('GET /api/admin/export?type=attempts', () => {
  it('neutralises a formula in the learner address and keeps the columns aligned', async () => {
    addStudent({ id: 'u1', email: '=cmd|calc!A1@example.com', name: 'Ana' })
    addStudent({ id: 'u2', email: '-lead@example.com', name: 'Beto' })
    store.attempts.push(
      {
        id: 'a1', userId: 'u1', sectionId: 'setup', attemptNumber: 1, score: 80,
        timeSpentSec: 900, completedAt: new Date('2026-04-01T09:00:00.000Z'),
        gradingVersion: GRADING_VERSION, exposedItems: 0,
      },
      {
        // A pre-rename slug, canonicalised by the route, not by the fake database. Graded over
        // questions whose key this learner had already seen, so its score is not evidence.
        id: 'a2', userId: 'u2', sectionId: 'pandas', attemptNumber: 2, score: 55,
        timeSpentSec: 1200, completedAt: new Date('2026-04-02T09:00:00.000Z'),
        gradingVersion: GRADING_VERSION, exposedItems: 3,
      },
    )

    const rows = parseCsv(await exportCsv('attempts'))

    assert.equal(rows[0]!.join(','), ATTEMPT_HEADERS)
    assert.deepEqual(formulaCells(rows), [])
    for (const row of rows) assert.equal(row.length, 8, `row shifted columns: ${JSON.stringify(row)}`)
    assert.deepEqual(rows[1]!.slice(1, 4), ["'=cmd|calc!A1@example.com", 'setup', '1'])
    assert.equal(rows[2]![2], 'files-ingestion')
    // The trailing column PR #70 added is escaped like every other cell, and still says what it
    // said: escaping a report must not quietly change what it reports.
    assert.deepEqual([rows[1]![7], rows[2]![7]], ['yes', 'no'])
  })
})

describe('the export stays behind the admin gate', () => {
  it('refuses a learner session', async () => {
    sessionRole = 'STUDENT'
    const res = await GET(new Request('http://localhost/api/admin/export?type=students'))
    assert.equal(res.status, 403)
  })
})
