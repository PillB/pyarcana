/**
 * Adversarial route tests — POST /api/credentials/issue, the capstone-credential gate.
 *
 * The route used to ask for ExamAttempt rows whose sectionId was 'S04', 'S08', ... 'S52', but
 * ExamView stores section.id, a slug ('iteration-summaries', 'career-strategy'). No row ever
 * matched, so no learner could be issued a credential. It also counted passing attempts, not
 * sections, and it applied one course-wide set of sections to every badge.
 *
 * Now each badge is checked against its own catalog entry: the exams of its required_sections,
 * each counted once at the credential floor, and every other requirement of the badge. Only
 * exam evidence is recorded on this server, so no credential is issued on exams alone.
 *
 * These tests run the real POST handler. Only the boundaries it does not own are replaced: the
 * session (next-auth) and the database. The fake database applies the route's `where` clause
 * literally and refuses any operator it does not know, so a query keyed on the wrong ids
 * returns nothing, exactly as SQLite would.
 *
 * Run: node --experimental-test-module-mocks --import tsx --test tests/adversarial/credential-issue-gates.test.ts
 *      (npm run test:adversarial:node passes the flag)
 */
import { before, beforeEach, describe, it, mock } from 'node:test'
import assert from 'node:assert/strict'
import { NextRequest } from 'next/server'
import { COURSE_SECTIONS } from '../../src/lib/course/index.ts'

if (typeof mock.module !== 'function') {
  throw new Error(
    'mock.module is unavailable: run with --experimental-test-module-mocks ' +
      '(npm run test:adversarial:node passes it).'
  )
}

const LEARNER = 'learner-1'
const OTHER_LEARNER = 'learner-2'
const FOUNDATIONS = 'integrated_python_ai_capstone_foundations'

// How many exams each capstone credential requires (required_sections in badge_catalog.json).
const REQUIRED_EXAMS: Record<string, number> = {
  integrated_python_ai_capstone_foundations: 13, // S01-S13
  integrated_python_ai_capstone_independent: 13, // S14-S26
  integrated_python_ai_capstone_advanced_applied: 13, // S27-S39
  integrated_python_ai_capstone_integrated_mastery: 12, // S40-S51
  evidence_grounded_ai_systems_capstone: 1, // S52
}
// What the server cannot verify yet: every blueprint component but the exams, and the
// prerequisite badges. Each capstone credential lists all of them.
const UNVERIFIED = ['self_check', 'you_do_projects', 'integrator_project', 'defense', 'prerequisite_badges']

// Foundations' sections as the database holds them: section.id slugs, never S## numbers.
// Written out by hand, not derived from COURSE_SECTIONS, so the test does not share the
// mapping it is checking.
const FOUNDATIONS_SLUGS: Record<string, string> = {
  S01: 'setup',
  S02: 'basics',
  S03: 'decisions-rules',
  S04: 'iteration-summaries',
  S05: 'functions-contracts',
  S06: 'collections',
  S07: 'text-unicode-regex',
  S08: 'files-ingestion',
  S09: 'exceptions-logging',
  S10: 'modules-packaging-cli',
  S11: 'oop-domain',
  S12: 'apis-sql-geo',
  S13: 'evidence-dashboard',
}
// Slugs the S01-S13 rename retired. Rows written before the rename can still carry them.
const PRE_RENAME_SLUGS: Record<string, string> = {
  S04: 'functions-modules',
  S08: 'pandas',
  S13: 'rpa-automation',
}
// S52: a capstone gate under the old course-wide rule, but not a Foundations requirement.
const S52_SLUG = 'career-strategy'

type AttemptRow = {
  id: string
  userId: string
  sectionId: string
  attemptNumber: number
  score: number
  completedAt: Date | null
  /** How exam/submit graded the row; 0 is before the 2026-09-18 fix (GRADING_VERSION). */
  gradingVersion: number
}

let attempts: AttemptRow[] = []
let notifications: Array<Record<string, unknown>> = []

function attempt(
  sectionId: string,
  score: number,
  { attemptNumber = 1, userId = LEARNER, completed = true, gradingVersion = 1 } = {}
): AttemptRow {
  return {
    id: `${userId}:${sectionId}:${attemptNumber}`,
    userId,
    sectionId,
    attemptNumber,
    score,
    completedAt: completed ? new Date('2026-09-01T12:00:00Z') : null,
    gradingVersion,
  }
}

/** Prisma's filter semantics for the operators the route uses; anything else is an error. */
function matchesWhere(row: AttemptRow, where: Record<string, unknown>): boolean {
  return Object.entries(where).every(([field, condition]) => {
    if (!(field in row)) throw new Error(`fake db: unknown ExamAttempt field ${field}`)
    const value = row[field as keyof AttemptRow]
    if (condition === null || typeof condition !== 'object') return value === condition
    return Object.entries(condition as Record<string, unknown>).every(([op, arg]) => {
      if (op === 'in') return (arg as unknown[]).includes(value)
      if (op === 'not') return value !== arg
      if (op === 'gte') return typeof value === 'number' && value >= (arg as number)
      throw new Error(`fake db: unsupported operator ${field}.${op}`)
    })
  })
}

const fakeDb = {
  examAttempt: {
    findMany: async (args: Record<string, unknown>) => {
      const unsupported = Object.keys(args).filter((k) => k !== 'where')
      if (unsupported.length) throw new Error(`fake db: unsupported findMany args ${unsupported}`)
      const where = (args.where ?? {}) as Record<string, unknown>
      return attempts.filter((row) => matchesWhere(row, where))
    },
  },
  notification: {
    create: async ({ data }: { data: Record<string, unknown> }) => {
      notifications.push(data)
      return data
    },
  },
}

mock.module('next-auth', {
  namedExports: { getServerSession: async () => ({ user: { id: LEARNER } }) },
})
mock.module('@/lib/auth', { namedExports: { authOptions: {} } })
mock.module('@/lib/db', { namedExports: { db: fakeDb } })

type IssueRoute = typeof import('../../src/app/api/credentials/issue/route.ts')
let POST: IssueRoute['POST']

before(async () => {
  // The route must load after the mocks are registered, and as the dynamic LMS.
  delete process.env.NEXT_PUBLIC_STATIC_SITE
  ;({ POST } = await import('../../src/app/api/credentials/issue/route.ts'))
})

async function requestCredential(badgeId = FOUNDATIONS) {
  const res = await POST(
    new NextRequest('http://localhost/api/credentials/issue', {
      method: 'POST',
      body: JSON.stringify({ badgeId, specificationVersion: '1.0.0' }),
    })
  )
  return { status: res.status, body: await res.json() }
}

/** One passing attempt for every Foundations section, stored under its current slug. */
function foundationsPassed(score = 90): AttemptRow[] {
  return Object.values(FOUNDATIONS_SLUGS).map((slug) => attempt(slug, score))
}

function without(rows: AttemptRow[], ...tags: string[]): AttemptRow[] {
  const drop = new Set(tags.map((t) => FOUNDATIONS_SLUGS[t]))
  return rows.filter((r) => !drop.has(r.sectionId))
}

beforeEach(() => {
  attempts = []
  notifications = []
})

describe('POST /api/credentials/issue — eligibility per badge', () => {
  it('never issues a capstone credential on exam evidence alone', async () => {
    // Every section of the course passed at 100: all the exam evidence there can be.
    attempts = COURSE_SECTIONS.map((s) => attempt(s.id, 100))

    for (const [badgeId, required] of Object.entries(REQUIRED_EXAMS)) {
      const { status, body } = await requestCredential(badgeId)

      assert.equal(status, 403, `${badgeId} was issued on exams alone: ${JSON.stringify(body)}`)
      assert.equal(body.requiredSections, required, badgeId)
      assert.equal(body.passedSections, required, badgeId)
      assert.deepEqual(body.unverifiedRequirements, UNVERIFIED, badgeId)
    }
    assert.equal(notifications.length, 0)
  })

  it("checks Foundations' own sections, whichever slug each attempt was stored under", async () => {
    attempts = [
      ...without(foundationsPassed(), 'S04', 'S08', 'S13'),
      // Exactly on the credential floor: the floor is inclusive.
      attempt(FOUNDATIONS_SLUGS.S04, 85),
      // Written before the S01-S13 rename, on a database the rename migration has not reached.
      attempt(PRE_RENAME_SLUGS.S08, 92),
      // Passed under the old slug, then a worse retake under the new one: the best score counts.
      attempt(PRE_RENAME_SLUGS.S13, 88),
      attempt(FOUNDATIONS_SLUGS.S13, 40, { attemptNumber: 2 }),
    ]

    const { status, body } = await requestCredential()

    // S52 was never attempted, and Foundations does not ask for it.
    assert.equal(body.requiredSections, 13)
    assert.equal(body.passedSections, 13)
    assert.equal(status, 403)
    assert.equal(notifications.length, 0)
  })

  it('counts a section once, however many passing attempts it has', async () => {
    attempts = [
      ...without(foundationsPassed(), 'S13'),
      // S04 passed three more times, under both of its slugs: 15 passing rows, 12 sections.
      attempt(FOUNDATIONS_SLUGS.S04, 95, { attemptNumber: 2 }),
      attempt(FOUNDATIONS_SLUGS.S04, 100, { attemptNumber: 3 }),
      attempt(PRE_RENAME_SLUGS.S04, 90),
      // A passed section Foundations does not require does not stand in for the missing one.
      attempt(S52_SLUG, 100),
    ]

    const { body } = await requestCredential()

    assert.equal(body.passedSections, 12)
    assert.equal(body.requiredSections, 13)
  })

  it('does not count an exam pass below the credential floor', async () => {
    // 84 passes the exam (pass mark 70) but not badge_catalog.json's 85% credential floor.
    attempts = [...without(foundationsPassed(), 'S13'), attempt(FOUNDATIONS_SLUGS.S13, 84)]

    const { body } = await requestCredential()

    assert.equal(body.passedSections, 12)
  })

  it('never counts an attempt graded before the 2026-09-18 fix, whose score may be forged (D12)', async () => {
    attempts = foundationsPassed(100).map((row) => ({ ...row, gradingVersion: 0 }))
    assert.equal((await requestCredential()).body.passedSections, 0)

    attempts = [
      ...without(foundationsPassed(), 'S13'),
      attempt(FOUNDATIONS_SLUGS.S13, 100, { gradingVersion: 0 }),
    ]
    assert.equal((await requestCredential()).body.passedSections, 12)
  })

  it("never counts another learner's attempt or an unfinished one (D11)", async () => {
    attempts = [
      ...without(foundationsPassed(), 'S13'),
      attempt(FOUNDATIONS_SLUGS.S13, 100, { userId: OTHER_LEARNER }),
      attempt(FOUNDATIONS_SLUGS.S13, 100, { completed: false }),
    ]

    const { body } = await requestCredential()

    assert.equal(body.passedSections, 12)
  })

  it('refuses a badge that is not a capstone credential', async () => {
    attempts = COURSE_SECTIONS.map((s) => attempt(s.id, 100))

    for (const badgeId of ['python_data_foundations', 'progress_journey_completed', 'no_such_badge']) {
      const { status } = await requestCredential(badgeId)
      assert.equal(status, 400, badgeId)
    }
    assert.equal(notifications.length, 0)
  })
})
