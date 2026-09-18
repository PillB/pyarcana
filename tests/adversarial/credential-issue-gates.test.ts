/**
 * Adversarial route tests — POST /api/credentials/issue, the capstone-credential gate.
 *
 * The route used to ask for ExamAttempt rows whose sectionId was 'S04', 'S08', ... 'S52', but
 * ExamView stores section.id, a slug ('iteration-summaries', 'career-strategy'). No row ever
 * matched, so no learner could be issued a credential. It also counted passing attempts, not
 * sections, so one section retaken three times would have counted three times.
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

if (typeof mock.module !== 'function') {
  throw new Error(
    'mock.module is unavailable: run with --experimental-test-module-mocks ' +
      '(npm run test:adversarial:node passes it).'
  )
}

const LEARNER = 'learner-1'
const OTHER_LEARNER = 'learner-2'
const BADGE = 'evidence_grounded_ai_systems_capstone'

// The 13 gate sections as the database holds them: section.id slugs, never S## numbers.
// Written out by hand, not derived from COURSE_SECTIONS, so the test does not share the
// mapping it is checking.
const GATE_SLUGS: Record<string, string> = {
  S04: 'iteration-summaries',
  S08: 'files-ingestion',
  S13: 'evidence-dashboard',
  S17: 'packaging',
  S21: 'fastapi',
  S26: 'integrator-phase1',
  S30: 'security-infra',
  S34: 'cv-ai-integration',
  S39: 'integrator-phase2',
  S43: 'llmops',
  S47: 'opensource',
  S51: 'integrator-final',
  S52: 'career-strategy',
}
// Slugs the S01-S13 rename retired. Rows written before the rename can still carry them.
const PRE_RENAME_SLUGS: Record<string, string> = {
  S04: 'functions-modules',
  S08: 'pandas',
  S13: 'rpa-automation',
}

type AttemptRow = {
  id: string
  userId: string
  sectionId: string
  attemptNumber: number
  score: number
  completedAt: Date | null
}

let attempts: AttemptRow[] = []
let notifications: Array<Record<string, unknown>> = []

function attempt(
  sectionId: string,
  score: number,
  { attemptNumber = 1, userId = LEARNER, completed = true } = {}
): AttemptRow {
  return {
    id: `${userId}:${sectionId}:${attemptNumber}`,
    userId,
    sectionId,
    attemptNumber,
    score,
    completedAt: completed ? new Date('2026-09-01T12:00:00Z') : null,
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

async function requestCredential() {
  const res = await POST(
    new NextRequest('http://localhost/api/credentials/issue', {
      method: 'POST',
      body: JSON.stringify({ badgeId: BADGE, specificationVersion: '1.0.0' }),
    })
  )
  return { status: res.status, body: await res.json() }
}

/** One passing attempt for every gate, stored under its current slug. */
function everyGatePassed(score = 90): AttemptRow[] {
  return Object.values(GATE_SLUGS).map((slug) => attempt(slug, score))
}

function withoutGate(rows: AttemptRow[], tag: string): AttemptRow[] {
  return rows.filter((r) => r.sectionId !== GATE_SLUGS[tag])
}

beforeEach(() => {
  attempts = []
  notifications = []
})

describe('POST /api/credentials/issue — gate eligibility', () => {
  it('issues when every gate section is passed, whichever slug each attempt was stored under', async () => {
    attempts = [
      ...withoutGate(withoutGate(withoutGate(everyGatePassed(), 'S04'), 'S08'), 'S13'),
      // Exactly on the credential floor: the floor is inclusive.
      attempt(GATE_SLUGS.S04, 85),
      // Written before the S01-S13 rename, on a database the rename migration has not reached.
      attempt(PRE_RENAME_SLUGS.S08, 92),
      // Passed under the old slug, then a worse retake under the new one: the best score counts.
      attempt(PRE_RENAME_SLUGS.S13, 88),
      attempt(GATE_SLUGS.S13, 40, { attemptNumber: 2 }),
    ]

    const { status, body } = await requestCredential()

    assert.equal(status, 201, `expected a credential, got ${JSON.stringify(body)}`)
    assert.equal(body.credential.badgeId, BADGE)
    assert.equal(body.credential.credentialClass, 'D')
    assert.equal(body.credential.holderReference, `pyarcana:user:${LEARNER}`)
    assert.match(body.credential.signature, /^[0-9a-f]{64}$/)
    assert.equal(notifications.length, 1)
    assert.equal(notifications[0].recipientId, LEARNER)
    assert.equal(notifications[0].type, 'credential_issued')
    assert.deepEqual(JSON.parse(String(notifications[0].body)), body.credential)
  })

  it('counts a section once, however many passing attempts it has', async () => {
    attempts = [
      ...withoutGate(everyGatePassed(), 'S52'),
      // S04 passed three more times, under both of its slugs: 15 passing gate rows, 12 sections.
      attempt(GATE_SLUGS.S04, 95, { attemptNumber: 2 }),
      attempt(GATE_SLUGS.S04, 100, { attemptNumber: 3 }),
      attempt(PRE_RENAME_SLUGS.S04, 90),
      // A passed section that is not a gate does not stand in for the missing one.
      attempt('setup', 100),
    ]

    const { status, body } = await requestCredential()

    assert.equal(status, 403)
    assert.equal(body.passedGates, 12)
    assert.equal(body.requiredGates, 13)
    assert.equal(notifications.length, 0)
  })

  it('does not open a gate on an exam pass below the credential floor', async () => {
    // 84 passes the exam (pass mark 70) but not badge_catalog.json's 85% credential floor.
    attempts = [...withoutGate(everyGatePassed(), 'S52'), attempt(GATE_SLUGS.S52, 84)]

    const { status, body } = await requestCredential()

    assert.equal(status, 403)
    assert.equal(body.passedGates, 12)
    assert.equal(notifications.length, 0)
  })

  it("never counts another learner's attempt or an unfinished one (D11)", async () => {
    attempts = [
      ...withoutGate(everyGatePassed(), 'S52'),
      attempt(GATE_SLUGS.S52, 100, { userId: OTHER_LEARNER }),
      attempt(GATE_SLUGS.S52, 100, { completed: false }),
    ]

    const { status, body } = await requestCredential()

    assert.equal(status, 403)
    assert.equal(body.passedGates, 12)
    assert.equal(notifications.length, 0)
  })
})
