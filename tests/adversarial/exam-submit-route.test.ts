/**
 * Behavioural tests for the exam routes, run against the real route handlers.
 *
 * Only the session, the database and the Firestore mirror are replaced (node:test module mocks);
 * the grading, the draw check and the key release run as in production. The database is an
 * in-memory store that honours the `where` clauses these routes send and throws on any it does
 * not model, so a route that starts filtering differently fails here instead of passing.
 *
 * Run: node --import tsx --test --experimental-test-module-mocks tests/adversarial/exam-submit-route.test.ts
 */
import { before, beforeEach, describe, it, mock } from 'node:test'
import assert from 'node:assert/strict'

type Row = Record<string, unknown>

const store: { attempts: Row[]; questions: Row[] } = { attempts: [], questions: [] }
let sessionUserId: string | null = 'learner'

function matches(row: Row, where: Row): boolean {
  return Object.entries(where).every(([key, want]) => {
    if (want === null) return row[key] == null
    if (typeof want !== 'object') return row[key] === want
    const list = (want as { in?: unknown[] }).in
    if (!Array.isArray(list) || Object.keys(want as object).length !== 1) {
      throw new Error(`fake db: unmodelled filter on ${key}: ${JSON.stringify(want)}`)
    }
    return list.includes(row[key])
  })
}

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
    async findMany({ where }: { where: Row }) {
      await tick()
      return copy(store.attempts.filter((a) => matches(a, where)))
    },
    async updateMany({ where, data }: { where: Row; data: Row }) {
      await tick()
      const hit = store.attempts.filter((a) => matches(a, where))
      for (const a of hit) Object.assign(a, data)
      return { count: hit.length }
    },
    // The pre-fix route completed attempts with update(); modelled so the old code can be run.
    async update({ where, data }: { where: { id: string }; data: Row }) {
      await tick()
      const row = store.attempts.find((a) => a.id === where.id)
      if (!row) throw new Error('fake db: update on a missing row')
      return { ...Object.assign(row, data) }
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

mock.module('next-auth', {
  namedExports: {
    getServerSession: async () => (sessionUserId ? { user: { id: sessionUserId } } : null),
  },
})
mock.module('@/lib/auth', { namedExports: { authOptions: {} } })
mock.module('@/lib/db', { namedExports: { db } })
mock.module('@/lib/firebase/sync', {
  namedExports: { syncExamAttempt: async () => {}, syncProgress: async () => {} },
})

type Handler = (request: Request) => Promise<Response>
let submit: Handler
let listAttempts: Handler
let getProgress: () => Promise<Response>

// Imported after the mocks are registered, so the routes bind to them. (A hook, not top-level
// await: tsx compiles this package's .ts files as CommonJS.)
before(async () => {
  ;({ POST: submit } = await import('../../src/app/api/exam/submit/route.ts'))
  ;({ GET: listAttempts } = await import('../../src/app/api/exam/attempts/route.ts'))
  ;({ GET: getProgress } = await import('../../src/app/api/progress/route.ts'))
})

// Two sections, 8 concepts x 3 variants each, as prisma/seed.ts builds the bank.
function bank(sectionId: string): Row[] {
  return Array.from({ length: 24 }, (_, n) => {
    const concept = Math.floor(n / 3)
    const variant = (n % 3) + 1
    return {
      id: `${sectionId}-c${concept}-v${variant}`,
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

/** An open attempt that drew variant `variant` of each of the eight `setup` concepts. */
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
    startedAt: new Date('2026-09-18T09:00:00Z'),
    completedAt: null,
    timeSpentSec: 0,
    variantSeed: JSON.stringify(seed),
    ...extra,
  }
}

const question = (id: string) => store.questions.find((q) => q.id === id)!
const right = (id: string) => ({ questionId: id, selectedIndex: question(id).correctIndex as number })
const wrong = (id: string) => ({ questionId: id, selectedIndex: ((question(id).correctIndex as number) + 1) % 4 })
const drawn = (variant: number) => Array.from({ length: 8 }, (_, c) => `setup-c${c}-v${variant}`)

async function post(attemptId: string, answers: { questionId: string; selectedIndex: number }[]) {
  const res = await submit(
    new Request('http://localhost/api/exam/submit', {
      method: 'POST',
      body: JSON.stringify({ attemptId, answers, timeSpentSec: 300 }),
    })
  )
  return { status: res.status, body: await res.json() }
}

const stored = (id: string) => store.attempts.find((a) => a.id === id)!

beforeEach(() => {
  sessionUserId = 'learner'
  store.questions = [...bank('setup'), ...bank('basics')]
  store.attempts = [attempt('att-1', 1, 1)]
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

  it('grades a full, honest submission as before', async () => {
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

describe('the answer key is released only after the last attempt', () => {
  it('withholds correct answers and explanations while attempts remain', async () => {
    const { body } = await post('att-1', drawn(1).map(wrong))
    assert.equal(body.detailedAnswers.length, 8)
    for (const a of body.detailedAnswers) {
      assert.equal('correctIndex' in a, false)
      assert.equal('explanation' in a, false)
      assert.equal(a.correct, false)
    }
    assert.equal(body.answerKeyReleased, false)
  })

  it('releases them when the third attempt is graded', async () => {
    store.attempts = [
      attempt('att-1', 1, 1, { completedAt: new Date(), score: 50 }),
      attempt('att-2', 2, 2, { completedAt: new Date(), score: 60 }),
      attempt('att-3', 3, 3),
    ]
    const { body } = await post('att-3', drawn(3).map(wrong))
    assert.equal(body.answerKeyReleased, true)
    const first = body.detailedAnswers[0]
    assert.equal(first.correctIndex, question(first.questionId).correctIndex)
    assert.equal(first.explanation, question(first.questionId).explanation)
  })

  it('counts attempts stored under the pre-rename slug toward the same section', async () => {
    // `setup` was never renamed; `collections` was `numpy`. Build that section's history.
    store.questions = [...bank('collections'), ...bank('numpy')]
    const seed = (v: number) =>
      JSON.stringify(Array.from({ length: 8 }, (_, c) => ({ concept: `concept-${c}`, variant: v, questionId: `numpy-c${c}-v${v}` })))
    store.attempts = [
      attempt('att-1', 1, 1, { sectionId: 'numpy', completedAt: new Date(), variantSeed: seed(1) }),
      attempt('att-2', 2, 2, { sectionId: 'numpy', completedAt: new Date(), variantSeed: seed(2) }),
      attempt('att-3', 3, 3, { sectionId: 'collections', variantSeed: seed(3) }),
    ]
    const ids = Array.from({ length: 8 }, (_, c) => `numpy-c${c}-v3`)
    const { status, body } = await post('att-3', ids.map(right))
    assert.equal(status, 200)
    assert.equal(body.score, 100)
    assert.equal(body.answerKeyReleased, true)
  })

  it('keeps the key closed while another attempt of the section is still open', async () => {
    store.attempts = [
      attempt('att-1', 1, 1),
      attempt('att-2', 2, 2, { completedAt: new Date() }),
      attempt('att-3', 3, 3),
    ]
    const { body } = await post('att-3', drawn(3).map(right))
    assert.equal(body.answerKeyReleased, false)
    assert.equal('correctIndex' in body.detailedAnswers[0], false)
  })
})

describe('the key does not leak through the endpoints that list attempts', () => {
  async function listed(): Promise<Row[]> {
    const res = await listAttempts(new Request('http://localhost/api/exam/attempts?sectionId=setup'))
    return (await res.json()).attempts
  }
  async function fromProgress(): Promise<Row[]> {
    const res = await getProgress()
    return (await res.json()).examAttempts.setup
  }

  it('exam/attempts and progress drop the key from a graded attempt while attempts remain', async () => {
    await post('att-1', drawn(1).map(wrong))
    for (const rows of [await listed(), await fromProgress()]) {
      const answers = JSON.parse(rows[0]!.answers as string)
      assert.equal(answers.length, 8)
      assert.ok(answers.every((a: Row) => !('correctIndex' in a) && !('explanation' in a)))
      assert.equal(rows[0]!.score, 0)
    }
  })

  it('both return the key once all three attempts are graded', async () => {
    store.attempts = [
      attempt('att-1', 1, 1, { completedAt: new Date() }),
      attempt('att-2', 2, 2, { completedAt: new Date() }),
      attempt('att-3', 3, 3),
    ]
    await post('att-3', drawn(3).map(wrong))
    for (const rows of [await listed(), await fromProgress()]) {
      const graded = rows.find((r) => r.id === 'att-3')!
      assert.ok(JSON.parse(graded.answers as string).every((a: Row) => typeof a.correctIndex === 'number'))
    }
  })
})
