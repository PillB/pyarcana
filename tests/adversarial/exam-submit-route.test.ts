/**
 * Behavioural tests for the exam routes, run against the real route handlers.
 *
 * Only the session, the database and the Firestore mirror are replaced (node:test module mocks);
 * the grading, the draw check, the time limit and the key redaction run as in production. The
 * database is an in-memory store that honours the `where` clauses these routes send and throws on
 * any it does not model, so a route that starts filtering differently fails here instead of passing.
 *
 * Run: node --import tsx --test --experimental-test-module-mocks tests/adversarial/exam-submit-route.test.ts
 */
import { before, beforeEach, describe, it, mock } from 'node:test'
import assert from 'node:assert/strict'

type Row = Record<string, unknown>

const store: { attempts: Row[]; questions: Row[]; forms: Row[] } = {
  attempts: [],
  questions: [],
  forms: [],
}
let sessionUserId: string | null = 'learner'
let nextId = 0

function matchesOne(value: unknown, want: unknown, key: string): boolean {
  if (want === null) return value == null
  if (typeof want !== 'object') return value === want
  if (Object.keys(want as object).length !== 1) throw new Error(`fake db: unmodelled filter on ${key}`)
  const [op, arg] = Object.entries(want as object)[0]!
  if (op === 'in' && Array.isArray(arg)) return arg.includes(value)
  if (op === 'not' && arg === null) return value != null
  if (op === 'gte' && typeof arg === 'number') return typeof value === 'number' && value >= arg
  throw new Error(`fake db: unmodelled filter on ${key}: ${JSON.stringify(want)}`)
}
const matches = (row: Row, where: Row) =>
  Object.entries(where).every(([key, want]) => matchesOne(row[key], want, key))

// Every call yields first, so two requests interleave the way they do against a real database.
const tick = () => new Promise((resolve) => setImmediate(resolve))
const copy = <T,>(rows: T[]) => rows.map((r) => ({ ...r }))

const db = {
  examAttempt: {
    async findUnique({ where }: { where: { id: string } }) {
      await tick()
      const row = store.attempts.find((a) => a.id === where.id)
      return row ? { ...row } : null
    },
    async findMany({ where, orderBy }: { where: Row; orderBy?: Row }) {
      await tick()
      const rows = copy(store.attempts.filter((a) => matches(a, where)))
      if (orderBy?.attemptNumber === 'asc') {
        rows.sort((a, b) => (a.attemptNumber as number) - (b.attemptNumber as number))
      }
      return rows
    },
    async updateMany({ where, data }: { where: Row; data: Row }) {
      await tick()
      const hit = store.attempts.filter((a) => matches(a, where))
      for (const a of hit) Object.assign(a, data)
      return { count: hit.length }
    },
    async create({ data }: { data: Row & { form?: { create: { items: string } } } }) {
      await tick()
      const { form, ...fields } = data
      const clash = store.attempts.some((a) =>
        ['userId', 'sectionId', 'attemptNumber'].every((k) => a[k] === fields[k]))
      if (clash) throw new Error('fake db: unique (userId, sectionId, attemptNumber) violated')
      const row: Row = {
        id: `new-${++nextId}`,
        startedAt: new Date(),
        completedAt: null,
        timeSpentSec: 0,
        gradingVersion: 0,
        ...fields,
      }
      store.attempts.push(row)
      if (form) store.forms.push({ attemptId: row.id, items: form.create.items })
      return { ...row }
    },
  },
  examAttemptForm: {
    async findUnique({ where }: { where: { attemptId: string } }) {
      await tick()
      const row = store.forms.find((f) => f.attemptId === where.attemptId)
      return row ? { ...row } : null
    },
  },
  questionBank: {
    async findMany({ where }: { where: Row }) {
      await tick()
      return copy(store.questions.filter((q) => matches(q, where)))
    },
  },
  progress: { findMany: async () => [] },
  exerciseAttempt: { findMany: async () => [] },
}

// Node 25.9 renamed mock.module's `namedExports` option to `exports` and deprecated the old name
// (nodejs/node#61727). CI runs Node 22, which only has `namedExports`.
function moduleExports(named: Record<string, unknown>) {
  const [major, minor] = process.versions.node.split('.').map(Number)
  return major > 25 || (major === 25 && minor >= 9) ? { exports: named } : { namedExports: named }
}

mock.module('next-auth', moduleExports({
  getServerSession: async () => (sessionUserId ? { user: { id: sessionUserId } } : null),
}))
mock.module('@/lib/auth', moduleExports({ authOptions: {} }))
mock.module('@/lib/db', moduleExports({ db }))
mock.module('@/lib/firebase/sync', moduleExports({
  syncExamAttempt: async () => {},
  syncProgress: async () => {},
}))

type Handler = (request: Request) => Promise<Response>
let submit: Handler
let start: Handler
let listAttempts: Handler
let getProgress: () => Promise<Response>

// Imported after the mocks are registered, so the routes bind to them. (A hook, not top-level
// await: tsx compiles this package's .ts files as CommonJS.)
before(async () => {
  ;({ POST: submit } = await import('../../src/app/api/exam/submit/route.ts'))
  ;({ POST: start } = await import('../../src/app/api/exam/start/route.ts'))
  ;({ GET: listAttempts } = await import('../../src/app/api/exam/attempts/route.ts'))
  ;({ GET: getProgress } = await import('../../src/app/api/progress/route.ts'))
})

// Two sections, 8 concepts x 3 variants each, as prisma/seed.ts builds the bank.
function bank(sectionId: string, idPrefix = sectionId): Row[] {
  return Array.from({ length: 24 }, (_, n) => {
    const concept = Math.floor(n / 3)
    const variant = (n % 3) + 1
    return {
      id: `${idPrefix}-c${concept}-v${variant}`,
      sectionId,
      concept: `concept-${concept}`,
      variant,
      question: `${sectionId} question ${concept}.${variant}`,
      options: JSON.stringify(['A', 'B', 'C', 'D']),
      correctIndex: (concept + variant) % 4,
      explanation: `why ${concept}.${variant}`,
    }
  })
}

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000)

/** An open attempt, started just now, that drew variant `variant` of the eight `setup` concepts. */
function attempt(id: string, attemptNumber: number, variant: number, extra: Row = {}): Row {
  const seed = Array.from({ length: 8 }, (_, c) => ({
    concept: `concept-${c}`,
    variant,
    questionId: `setup-c${c}-v${variant}`,
  }))
  return {
    id,
    userId: 'learner',
    sectionId: 'setup',
    attemptNumber,
    answers: '[]',
    score: 0,
    startedAt: new Date(),
    completedAt: null,
    timeSpentSec: 0,
    variantSeed: JSON.stringify(seed),
    gradingVersion: 0,
    ...extra,
  }
}

/** An attempt graded by the current code; pass gradingVersion 0 for one graded before the fix. */
const graded = (id: string, n: number, variant: number, extra: Row = {}) =>
  attempt(id, n, variant, { completedAt: minutesAgo(30), score: 60, gradingVersion: 1, ...extra })

const question = (id: string) => store.questions.find((q) => q.id === id)!
const right = (id: string) => ({ questionId: id, selectedIndex: question(id).correctIndex as number })
const wrong = (id: string) => ({
  questionId: id,
  selectedIndex: ((question(id).correctIndex as number) + 1) % 4,
})
const drawn = (variant: number) => Array.from({ length: 8 }, (_, c) => `setup-c${c}-v${variant}`)
const stored = (id: string) => store.attempts.find((a) => a.id === id)!
const hasKey = (answers: Row[]) => answers.some((a) => 'correctIndex' in a || 'explanation' in a)

async function post(attemptId: string, answers: { questionId: string; selectedIndex: number }[]) {
  const res = await submit(
    new Request('http://localhost/api/exam/submit', {
      method: 'POST',
      body: JSON.stringify({ attemptId, answers, timeSpentSec: 300 }),
    })
  )
  return { status: res.status, body: await res.json() }
}

async function startExam(sectionId = 'setup') {
  const res = await start(
    new Request('http://localhost/api/exam/start', {
      method: 'POST',
      body: JSON.stringify({ sectionId }),
    })
  )
  return { status: res.status, body: await res.json() }
}

async function listed(): Promise<Row[]> {
  const res = await listAttempts(new Request('http://localhost/api/exam/attempts?sectionId=setup'))
  return (await res.json()).attempts
}

beforeEach(() => {
  sessionUserId = 'learner'
  store.questions = [...bank('setup'), ...bank('basics')]
  store.attempts = [attempt('att-1', 1, 1)]
  store.forms = []
})

describe('exam/submit grades the questions the attempt drew', () => {
  it('one correct answer out of eight drawn does not score 100%', async () => {
    const { status, body } = await post('att-1', [right('setup-c0-v1')])
    assert.equal(status, 200)
    assert.equal(body.totalQuestions, 8)
    assert.equal(body.correctCount, 1)
    assert.equal(body.score, 13)
    assert.equal(body.passed, false)
    assert.equal(stored('att-1').score, 13)
  })

  it('rejects a questionId from another section with 400 and leaves the attempt open', async () => {
    const { status } = await post('att-1', [right('basics-c0-v1')])
    assert.equal(status, 400)
    assert.equal(stored('att-1').completedAt, null)
    assert.equal(stored('att-1').score, 0)
  })

  it('rejects a drawn answer mixed with a foreign one', async () => {
    const { status } = await post('att-1', [...drawn(1).map(right), right('basics-c3-v2')])
    assert.equal(status, 400)
    assert.equal(stored('att-1').completedAt, null)
  })

  it('rejects duplicate answers, so repeating a known answer cannot inflate the score', async () => {
    const { status } = await post('att-1', Array(8).fill(right('setup-c0-v1')))
    assert.equal(status, 400)
    assert.equal(stored('att-1').completedAt, null)
    assert.equal(stored('att-1').score, 0)
  })

  it('grades a full, honest submission as before, and records the grading version', async () => {
    // Sent in the shuffled order the learner saw; six right, two wrong.
    const order = [5, 2, 7, 0, 6, 1, 4, 3].map((c) => `setup-c${c}-v1`)
    const answers = order.map((id, n) => (n < 6 ? right(id) : wrong(id)))
    const { status, body } = await post('att-1', answers)
    assert.equal(status, 200)
    assert.deepEqual(
      [body.score, body.correctCount, body.totalQuestions, body.passed],
      [75, 6, 8, true]
    )
    assert.deepEqual(body.detailedAnswers.map((a: Row) => a.questionId), order)
    assert.deepEqual(
      body.detailedAnswers.map((a: Row) => [a.selectedIndex, a.correct]),
      answers.map((a, n) => [a.selectedIndex, n < 6])
    )
    assert.equal(body.detailedAnswers[0].question, 'setup question 5.1')
    assert.deepEqual(body.detailedAnswers[0].options, ['A', 'B', 'C', 'D'])

    const row = stored('att-1')
    assert.equal(row.score, 75)
    assert.ok(row.completedAt instanceof Date)
    assert.equal(row.timeSpentSec, 300)
    assert.equal(row.gradingVersion, 1)
    // The stored record keeps the full key for the admin views.
    const saved = JSON.parse(row.answers as string)
    assert.equal(saved.length, 8)
    assert.equal(saved[0].correctIndex, question('setup-c5-v1').correctIndex)
  })

  it('refuses with 409 an attempt whose draw cannot be read, rather than grading the ids sent', async () => {
    store.attempts = [attempt('att-1', 1, 1, { variantSeed: 'not json' })]
    const { status } = await post('att-1', [right('setup-c0-v1')])
    assert.equal(status, 409)
    assert.equal(stored('att-1').completedAt, null)
  })
})

describe('exam/submit keeps its ownership and completion checks', () => {
  it("answers 404 for another learner's attempt and leaves it untouched", async () => {
    sessionUserId = 'intruder'
    const { status } = await post('att-1', drawn(1).map(right))
    assert.equal(status, 404)
    assert.equal(stored('att-1').completedAt, null)
  })

  it('answers 401 without a session', async () => {
    sessionUserId = null
    assert.equal((await post('att-1', drawn(1).map(right))).status, 401)
  })

  it('refuses a second submission of a completed attempt', async () => {
    assert.equal((await post('att-1', drawn(1).map(wrong))).status, 200)
    const again = await post('att-1', drawn(1).map(right))
    assert.equal(again.status, 400)
    assert.equal(stored('att-1').score, 0)
  })

  it('completes an attempt once when two submissions race', async () => {
    const [a, b] = await Promise.all([
      post('att-1', drawn(1).map(wrong)),
      post('att-1', drawn(1).map(right)),
    ])
    assert.deepEqual([a.status, b.status].sort(), [200, 400])
    const winner = a.status === 200 ? a : b
    assert.equal(stored('att-1').score, winner.body.score)
  })
})

describe('the answer key never reaches the learner', () => {
  it('is withheld after a first attempt', async () => {
    const { body } = await post('att-1', drawn(1).map(wrong))
    assert.equal(body.detailedAnswers.length, 8)
    assert.equal(hasKey(body.detailedAnswers), false)
    assert.ok(body.detailedAnswers.every((a: Row) => a.correct === false))
  })

  it('is withheld after the last attempt too', async () => {
    store.attempts = [graded('att-1', 1, 1), graded('att-2', 2, 2), attempt('att-3', 3, 3)]
    const { status, body } = await post('att-3', drawn(3).map(wrong))
    assert.equal(status, 200)
    assert.equal(hasKey(body.detailedAnswers), false)
  })

  it('is absent from exam/attempts and progress, even once every attempt is graded', async () => {
    store.attempts = [graded('att-1', 1, 1), graded('att-2', 2, 2), attempt('att-3', 3, 3)]
    await post('att-3', drawn(3).map(wrong))
    const fromProgress = (await (await getProgress()).json()).examAttempts.setup
    for (const rows of [await listed(), fromProgress]) {
      assert.equal(rows.length, 3)
      const last = JSON.parse(rows.find((r: Row) => r.id === 'att-3').answers)
      assert.equal(last.length, 8)
      assert.equal(hasKey(last), false)
    }
  })

  it("is absent from exam/start's refusal at the attempt cap", async () => {
    const withKey = JSON.stringify([
      { questionId: 'setup-c0-v1', correctIndex: 1, explanation: 'x', correct: false },
    ])
    store.attempts = [1, 2, 3].map((n) => graded(`att-${n}`, n, n, { answers: withKey }))
    const { status, body } = await startExam()
    assert.equal(status, 403)
    assert.equal(body.attempts.length, 3)
    assert.ok(body.attempts.every((a: Row) => !hasKey(JSON.parse(a.answers as string))))
  })
})

describe('exam/start keeps the questions as shown, and submit grades against them', () => {
  it('returns the questions without their key, and stores the key in a form of its own', async () => {
    store.attempts = []
    const { status, body } = await startExam()
    assert.equal(status, 200)
    assert.equal(body.questions.length, 8)
    assert.ok(body.questions.every((q: Row) => !('correctIndex' in q) && !('explanation' in q)))
    assert.equal(body.timeLimitSec, 3600)
    const items = JSON.parse(store.forms.find((f) => f.attemptId === body.attemptId)!.items as string)
    assert.deepEqual(items.map((i: Row) => i.questionId), body.questions.map((q: Row) => q.id))
    assert.ok(items.every((i: Row) => i.correctIndex === question(i.questionId as string).correctIndex))
  })

  it('grades against the form after the bank is reseeded with new ids and moved keys', async () => {
    store.attempts = []
    const { body } = await startExam()
    const answers = body.questions.map((q: Row) => right(q.id as string))
    // prisma/seed.ts deletes the bank and recreates it: new ids, and here every key moves too.
    store.questions = bank('setup', 'reseeded').map((q) => ({
      ...q,
      correctIndex: ((q.correctIndex as number) + 1) % 4,
    }))
    const res = await post(body.attemptId, answers)
    assert.equal(res.status, 200)
    assert.equal(res.body.score, 100)
  })

  it('refuses with 409 an attempt whose form cannot be read', async () => {
    store.attempts = []
    const { body } = await startExam()
    store.forms.find((f) => f.attemptId === body.attemptId)!.items = '{"broken"'
    const res = await post(body.attemptId, body.questions.map((q: Row) => right(q.id as string)))
    assert.equal(res.status, 409)
    assert.equal(stored(body.attemptId).completedAt, null)
  })
})

describe('the 60-minute limit', () => {
  it('grades a submission that arrives within the 2-minute grace', async () => {
    store.attempts = [attempt('att-1', 1, 1, { startedAt: minutesAgo(61) })]
    const { status, body } = await post('att-1', drawn(1).map(right))
    assert.equal(status, 200)
    assert.equal(body.score, 100)
  })

  it('refuses a later submission with 409 and closes the attempt with 0', async () => {
    const startedAt = minutesAgo(63)
    store.attempts = [attempt('att-1', 1, 1, { startedAt })]
    const { status } = await post('att-1', drawn(1).map(right))
    assert.equal(status, 409)
    const row = stored('att-1')
    assert.equal(row.score, 0)
    assert.equal(row.gradingVersion, 1)
    assert.equal((row.completedAt as Date).getTime(), startedAt.getTime() + 3600_000)
  })

  it('exam/start closes an attempt abandoned past its time, and it still uses up an attempt', async () => {
    store.attempts = [
      graded('att-1', 1, 1),
      graded('att-2', 2, 2),
      attempt('att-3', 3, 3, { startedAt: minutesAgo(180) }),
    ]
    const { status } = await startExam()
    assert.equal(status, 403)
    assert.equal(stored('att-3').score, 0)
    assert.ok(stored('att-3').completedAt instanceof Date)
    assert.equal(stored('att-3').gradingVersion, 1)
  })
})

describe('attempts graded before the fix', () => {
  const legacy = (n: number, variant: number) =>
    graded(`old-${n}`, n, variant, { gradingVersion: 0, score: 100 })

  it('do not use up an attempt: after three of them all three remain', async () => {
    store.attempts = [legacy(1, 1), legacy(2, 2), legacy(3, 3)]
    const { status, body } = await startExam()
    assert.equal(status, 200)
    assert.equal(body.attemptNumber, 1)
    assert.equal(body.attemptsUsed, 0)
    // Stored after them, so (userId, sectionId, attemptNumber) stays unique.
    assert.equal(stored(body.attemptId).attemptNumber, 4)
  })

  it('are listed and flagged, and their variants are drawn last', async () => {
    store.attempts = [legacy(1, 1), legacy(2, 2)]
    const { body } = await startExam()
    assert.ok(body.questions.every((q: Row) => (q.id as string).endsWith('-v3')))
    assert.deepEqual(
      (await listed()).map((a) => [a.id, a.legacy]),
      [['old-1', true], ['old-2', true], [body.attemptId, false]]
    )
  })
})
