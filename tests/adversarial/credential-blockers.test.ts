/**
 * Adversarial tests — the capstone-credential gate fails closed.
 *
 * Issuance used to refuse while unverifiedRequirements(spec) was non-empty: a list of what was
 * known to be missing (self-checks, You Do, integrator project, defense, prerequisite badges). The
 * day each of those got a server verifier the list would have emptied and the gate opened, without
 * the checks it never named: the eligibility engine's badge status, required activities, CP
 * projects, critical competencies at 100%, supplementary exercises and overall score
 * (src/lib/eligibility/engine.ts). Now every check is a blocker until this server shows it passed:
 * a requirement by a registered server verifier, an engine gate by the real engine run on the
 * evidence those verifiers attest. Issuance itself stays closed (owner decision AV3-2): the
 * production registry verifies exams only, and no credential is stored as a Credential row yet.
 *
 * Harness: the real POST handler, as in credential-issue-gates.test.ts, with next-auth and the
 * database replaced. The verifier registry (@/lib/credential-verifiers) is replaced too, so each
 * test can say which requirements are verified, and can lift the standing store blocker.
 *
 * STAND-IN, test only: the fake verifiers below pass requirements this server cannot verify
 * (self-check, You Do, integrator project, defense, prerequisite badges) and attest engine evidence
 * for them. They exist to drive the gate into each state, including the one where it opens (K3),
 * which proves the refusals in K1, K2 and K4 are not an "always 403". No production code
 * registers them. section_exams is the real verifier, reading the fake ExamAttempt table.
 *
 * Run: node --experimental-test-module-mocks --import tsx --test tests/adversarial/credential-blockers.test.ts
 *      (npm run test:adversarial:node passes the flag)
 */
import { before, beforeEach, describe, it, mock } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { NextRequest } from 'next/server'
import { COURSE_SECTIONS } from '../../src/lib/course/index.ts'
import { credentialSpec } from '../../src/lib/credential-gates.ts'
// Loaded before the registry is replaced below: these are the production values (K6). A module
// imported statically here keeps its real exports; every later import of it gets the mock.
import {
  SERVER_VERIFIERS as PRODUCTION_VERIFIERS,
  credentialStorePersists as productionStorePersists,
  verifySectionExams,
} from '../../src/lib/credential-verifiers.ts'
import type { ServerVerifier, VerifierResult } from '../../src/lib/credential-verifiers.ts'
import { ENGINE_GATES, EligibilityEngine, GATE_REQUIREMENTS } from '../../src/lib/eligibility/engine.ts'
import type { BadgeSpec, LearnerProgress } from '../../src/lib/eligibility/types.ts'

if (typeof mock.module !== 'function') {
  throw new Error(
    'mock.module is unavailable: run with --experimental-test-module-mocks ' +
      '(npm run test:adversarial:node passes it).'
  )
}

const REPO_ROOT = join(import.meta.dirname, '..', '..')
const LEARNER = 'learner-1'
const FOUNDATIONS = 'integrated_python_ai_capstone_foundations'
const MASTERY = 'integrated_python_ai_capstone_integrated_mastery'
const FINAL = 'evidence_grounded_ai_systems_capstone'

// Each capstone credential's own catalog version (badges[].version in badge_catalog.json), written
// out by hand so the test does not read the value it checks. None is the catalog's top-level 1.0.0:
// each credential's claim text changed on 2026-10-13 ("a prueba de manipulación" became a clause
// that reveals an alteration, owner decision O25), so each carries the next patch version of its
// own. The clause was reworded again on 2026-10-14, before any release, to speak of the credential
// record and not the learner's evidence; the requirements did not change, so the versions did not
// move again.
const VERSION: Record<string, string> = {
  integrated_python_ai_capstone_foundations: '1.0.1',
  integrated_python_ai_capstone_independent: '1.0.1',
  integrated_python_ai_capstone_advanced_applied: '1.0.1',
  integrated_python_ai_capstone_integrated_mastery: '1.1.1',
  evidence_grounded_ai_systems_capstone: '1.0.1',
}
const CREDENTIALS = Object.keys(VERSION)

// Blocker codes, by hand from the catalog: every capstone credential has these five components.
const COMPONENTS = [
  'COMPONENT:self_check',
  'COMPONENT:you_do_projects',
  'COMPONENT:section_exams',
  'COMPONENT:integrator_project',
  'COMPONENT:defense',
]
const BASE_CRITICAL = ['reproducibility_determinism', 'communication_audience_tuned']
const CRITICAL: Record<string, string[]> = {
  integrated_python_ai_capstone_foundations: BASE_CRITICAL,
  integrated_python_ai_capstone_independent: [...BASE_CRITICAL, 'business_framing_judgment'],
  integrated_python_ai_capstone_advanced_applied: [...BASE_CRITICAL, 'business_framing_judgment', 'mlops_fluency'],
  integrated_python_ai_capstone_integrated_mastery: [...BASE_CRITICAL, 'business_framing_judgment', 'mlops_fluency'],
  evidence_grounded_ai_systems_capstone: [
    'sql_competency',
    'leakage_prevention',
    'selector_resilience',
    'type_safety_production_hardening',
    'mlops_fluency',
    'business_framing_judgment',
    'communication_audience_tuned',
    'reproducibility_determinism',
  ],
}
// Gap-affected critical competencies (types.ts GAP_AFFECTED_COMPETENCIES): only the final capstone has any.
const SUPPLEMENTARY: Record<string, string[]> = {
  evidence_grounded_ai_systems_capstone: [
    'sql_competency',
    'leakage_prevention',
    'selector_resilience',
    'type_safety_production_hardening',
  ],
}
const FOUNDATIONS_CRITICAL = BASE_CRITICAL.map((id) => `CRITICAL_COMPETENCY:${id}`)

// ── Boundaries the route does not own ──

type AttemptRow = {
  id: string
  userId: string
  sectionId: string
  attemptNumber: number
  score: number
  completedAt: Date | null
  gradingVersion: number
  exposedItems: number
}

let attempts: AttemptRow[] = []
let notifications: Array<Record<string, unknown>> = []

/** Every section of the course passed once, under its current slug. */
function everySectionPassed(score: number): AttemptRow[] {
  return COURSE_SECTIONS.map((s) => ({
    id: `${LEARNER}:${s.id}:1`,
    userId: LEARNER,
    sectionId: s.id,
    attemptNumber: 1,
    score,
    completedAt: new Date('2026-09-01T12:00:00Z'),
    gradingVersion: 1,
    exposedItems: 0,
  }))
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
      return attempts.filter((row) => matchesWhere(row, (args.where ?? {}) as Record<string, unknown>))
    },
  },
  notification: {
    create: async ({ data }: { data: Record<string, unknown> }) => {
      notifications.push(data)
      return data
    },
  },
}

/** The registry the route sees. Mutated per test, never replaced: the mock holds this object. */
const registry: Record<string, ServerVerifier> = {}
let storePersists = false

function useRegistry(verifiers: Record<string, ServerVerifier>): void {
  for (const key of Object.keys(registry)) delete registry[key]
  Object.assign(registry, verifiers)
}

mock.module('next-auth', {
  namedExports: { getServerSession: async () => ({ user: { id: LEARNER } }) },
})
mock.module('@/lib/auth', { namedExports: { authOptions: {} } })
mock.module('@/lib/db', { namedExports: { db: fakeDb } })
mock.module('@/lib/credential-verifiers', {
  namedExports: { SERVER_VERIFIERS: registry, credentialStorePersists: () => storePersists },
})

type IssueRoute = typeof import('../../src/app/api/credentials/issue/route.ts')
type Blockers = typeof import('../../src/lib/credential-blockers.ts')
let POST: IssueRoute['POST']
let issuanceBlockers: Blockers['issuanceBlockers']
let BLOCKER_FOR_GATE: Blockers['BLOCKER_FOR_GATE']

before(async () => {
  // Loaded after the mocks, so both see the test registry; and as the dynamic LMS.
  delete process.env.NEXT_PUBLIC_STATIC_SITE
  ;({ POST } = await import('../../src/app/api/credentials/issue/route.ts'))
  ;({ issuanceBlockers, BLOCKER_FOR_GATE } = await import('../../src/lib/credential-blockers.ts'))
})

beforeEach(() => {
  attempts = []
  notifications = []
  storePersists = false
  useRegistry({})
})

async function requestCredential(badgeId: string, specificationVersion = VERSION[badgeId]) {
  const res = await POST(
    new NextRequest('http://localhost/api/credentials/issue', {
      method: 'POST',
      body: JSON.stringify({ badgeId, specificationVersion }),
    })
  )
  return { status: res.status, body: await res.json() }
}

// ── Test-only verifiers (STAND-IN: see the header) ──

/** The tier the engine requires of a capstone's required activities (TIER_YOU_DO). */
const TIER_YOU_DO = 4

type Attests = VerifierResult['attests']

/** A test-only verifier: it passes, and attests whatever `attests` returns for the badge. */
function fake(attests: (spec: BadgeSpec) => Attests = () => ({})): ServerVerifier {
  return (spec) => ({ passed: true, attests: attests(spec) })
}

function sectionActivities(spec: BadgeSpec, kind: string, score: number) {
  return spec.required_sections.map((s) => ({
    activity_id: `${s}-${kind}`,
    evidence_tier: TIER_YOU_DO,
    score_pct: score,
    server_verified: true,
  })) as NonNullable<Attests['activities']>
}

function awarded(badgeIds: string[]) {
  return badgeIds.map((badge_id) => ({ badge_id, state: 'awarded' as const }))
}

/** The CP projects and synthesis, plus the supplementary exercises (`skip` leaves one out). */
function projectResults(spec: BadgeSpec, score: number, skip = ''): Record<string, number> {
  const supplementary = spec.gap_affected_competencies.map(
    (id) => `BADGE:${spec.badge_id}:supplementary:${id}`
  )
  const ids = [...spec.required_projects, ...supplementary].filter((id) => id !== skip)
  return Object.fromEntries(ids.map((id) => [id, score]))
}

/** The defense, and a rubric score for each critical competency (`lowered` gets 99). */
function defense(spec: BadgeSpec, lowered = ''): Attests {
  return {
    project_results: { [`BADGE:${spec.badge_id}:defense`]: 100 },
    critical_competency_scores: spec.critical_competencies.map((competency_id) => ({
      competency_id,
      rubric_score_pct: competency_id === lowered ? 99 : 100,
    })),
  }
}

/** Every requirement verified, attesting everything every engine gate asks for. */
function allVerified(): Record<string, ServerVerifier> {
  return {
    section_exams: verifySectionExams,
    prerequisite_badges: fake((spec) => ({ awarded_badges: awarded(spec.prerequisite_badges) })),
    self_check: fake((spec) => ({ activities: sectionActivities(spec, 'SELFCHECK', 100) })),
    you_do_projects: fake((spec) => ({ activities: sectionActivities(spec, 'YOUDO', 100) })),
    integrator_project: fake((spec) => ({ project_results: projectResults(spec, 100) })),
    defense: fake((spec) => defense(spec)),
  }
}

const blocked = (kind: string, codes: string[]) => codes.map((code) => ({ code, kind }))

// ── K1 ──

describe('K1: verifying every requirement the old list named does not open issuance', () => {
  it('refuses when the five listed requirements pass but attest nothing to the engine', async () => {
    // A verifier's pass never clears an engine gate: the engine still sees no activity, project,
    // rubric or awarded badge beyond the exams, so its own gates hold.
    useRegistry({
      section_exams: verifySectionExams,
      self_check: fake(),
      you_do_projects: fake(),
      integrator_project: fake(),
      defense: fake(),
      prerequisite_badges: fake(),
    })
    storePersists = true // lifted, so the refusal is the engine's, not the missing store's
    attempts = everySectionPassed(100)

    for (const badgeId of CREDENTIALS) {
      const { status, body } = await requestCredential(badgeId)
      const codes = (body.blockers ?? []).map((b: { code: string }) => b.code)

      assert.equal(status, 403, `${badgeId} opened on listed verifiers alone: ${JSON.stringify(body)}`)
      for (const code of [
        'REQUIRED_ACTIVITIES',
        'REQUIRED_PROJECTS',
        'OVERALL_SCORE',
        ...CRITICAL[badgeId].map((id) => `CRITICAL_COMPETENCY:${id}`),
        ...(SUPPLEMENTARY[badgeId] ?? []).map((id) => `SUPPLEMENTARY:${id}`),
      ]) {
        assert.ok(codes.includes(code), `${badgeId}: ${code} missing from ${codes}`)
      }
      assert.deepEqual(body.unverifiedRequirements, [], badgeId)
    }
    assert.equal(notifications.length, 0)
  })

  it('refuses on the checks the old list never named, even with its evidence attested', async () => {
    // Each listed verifier attests only its own evidence: activities, CP projects, the defense
    // score and the prerequisite badges. Nothing attests a critical-competency rubric or a
    // supplementary exercise, which no listed requirement covers.
    useRegistry({
      ...allVerified(),
      integrator_project: fake((spec) => ({
        project_results: Object.fromEntries(spec.required_projects.map((id) => [id, 100])),
      })),
      defense: fake((spec) => ({ project_results: { [`BADGE:${spec.badge_id}:defense`]: 100 } })),
    })
    storePersists = true
    attempts = everySectionPassed(100)

    for (const badgeId of CREDENTIALS) {
      const { status, body } = await requestCredential(badgeId)

      assert.equal(status, 403, badgeId)
      assert.deepEqual(
        body.blockers,
        [
          ...blocked('unmet', [
            ...CRITICAL[badgeId].map((id) => `CRITICAL_COMPETENCY:${id}`),
            ...(SUPPLEMENTARY[badgeId] ?? []).map((id) => `SUPPLEMENTARY:${id}`),
          ]),
          ...blocked('not_evaluated', ['OVERALL_SCORE', 'EDITION']),
        ],
        badgeId
      )
    }
    assert.equal(notifications.length, 0)
  })
})

// ── K2 ──

type GateCase = {
  gate: string
  badgeId: string
  /** Replaces verifiers in allVerified() to leave this gate, and only it, unmet. */
  change: Record<string, ServerVerifier>
  examScore?: number
  unmet: string
  /** The gates the engine stops before, in its order. */
  notEvaluated: string[]
}

const ROUTE_CASES: GateCase[] = [
  {
    gate: 'prerequisite_badges',
    badgeId: FOUNDATIONS,
    change: {
      prerequisite_badges: fake((spec) => ({ awarded_badges: awarded(spec.prerequisite_badges.slice(1)) })),
    },
    unmet: 'PREREQUISITES',
    notEvaluated: ['REQUIRED_ACTIVITIES', 'REQUIRED_PROJECTS', ...COMPONENTS, ...FOUNDATIONS_CRITICAL, 'OVERALL_SCORE', 'EDITION'],
  },
  {
    gate: 'required_activities',
    badgeId: FOUNDATIONS,
    change: { you_do_projects: fake((spec) => ({ activities: sectionActivities(spec, 'YOUDO', 100).slice(1) })) },
    unmet: 'REQUIRED_ACTIVITIES',
    notEvaluated: ['REQUIRED_PROJECTS', ...COMPONENTS, ...FOUNDATIONS_CRITICAL, 'OVERALL_SCORE', 'EDITION'],
  },
  {
    gate: 'required_projects',
    badgeId: FOUNDATIONS,
    change: { integrator_project: fake((spec) => ({ project_results: projectResults(spec, 100, 'CP-N1-A') })) },
    unmet: 'REQUIRED_PROJECTS',
    notEvaluated: [...COMPONENTS, ...FOUNDATIONS_CRITICAL, 'OVERALL_SCORE', 'EDITION'],
  },
  {
    gate: 'component_floors',
    badgeId: FOUNDATIONS,
    change: { self_check: fake((spec) => ({ activities: sectionActivities(spec, 'SELFCHECK', 50) })) },
    unmet: 'COMPONENT:self_check',
    notEvaluated: ['OVERALL_SCORE', 'EDITION'],
  },
  {
    gate: 'critical_competencies',
    badgeId: FOUNDATIONS,
    change: { defense: fake((spec) => defense(spec, 'communication_audience_tuned')) },
    unmet: 'CRITICAL_COMPETENCY:communication_audience_tuned',
    notEvaluated: ['OVERALL_SCORE', 'EDITION'],
  },
  {
    gate: 'supplementary_exercises',
    badgeId: FINAL,
    change: {
      integrator_project: fake((spec) => ({
        project_results: projectResults(spec, 100, `BADGE:${FINAL}:supplementary:sql_competency`),
      })),
    },
    unmet: 'SUPPLEMENTARY:sql_competency',
    notEvaluated: ['OVERALL_SCORE', 'EDITION'],
  },
  {
    // Every component on its own floor (self-check 85, You Do 80, exams 85, integrator 85,
    // defense 100), and a weighted average of 83, below the 85 the badge asks for.
    gate: 'overall_weighted_average',
    badgeId: FOUNDATIONS,
    change: {
      self_check: fake((spec) => ({ activities: sectionActivities(spec, 'SELFCHECK', 85) })),
      you_do_projects: fake((spec) => ({ activities: sectionActivities(spec, 'YOUDO', 80) })),
      integrator_project: fake((spec) => ({ project_results: projectResults(spec, 85) })),
    },
    examScore: 85,
    unmet: 'OVERALL_SCORE',
    notEvaluated: ['EDITION'],
  },
]

// Badge status and edition cannot be reached through the route: the catalog has no retired
// capstone, and on the static edition the route answers 503 before any gate. They are checked on
// issuanceBlockers, which the route calls.
const DIRECT_CASES = ['badge_status', 'edition']

describe('K2: each engine gate alone holds issuance closed', () => {
  it('has a case for every engine gate', () => {
    assert.deepEqual(
      [...ROUTE_CASES.map((c) => c.gate), ...DIRECT_CASES].sort(),
      [...ENGINE_GATES].sort()
    )
  })

  for (const c of ROUTE_CASES) {
    it(`${c.gate}: only it unmet -> 403, blocked by ${c.unmet} and the gates the engine never reached`, async () => {
      useRegistry({ ...allVerified(), ...c.change })
      storePersists = true // lifted, so the gate under test is the only unmet check
      attempts = everySectionPassed(c.examScore ?? 100)

      const { status, body } = await requestCredential(c.badgeId)

      assert.equal(status, 403)
      assert.deepEqual(body.blockers, [
        { code: c.unmet, kind: 'unmet' },
        ...blocked('not_evaluated', c.notEvaluated),
      ])
      assert.equal(notifications.length, 0)
    })
  }

  it('badge_status: a retired badge -> blocked by BADGE_STATUS, every later gate unevaluated', () => {
    storePersists = true
    const spec = { ...credentialSpec(FOUNDATIONS)!, status: 'retired' as const }
    const evidence = { examAttempts: everySectionPassed(100), edition: 'dynamic' as const }

    assert.deepEqual(issuanceBlockers(spec, evidence, allVerified()), [
      { code: 'BADGE_STATUS', kind: 'unmet' },
      ...blocked('not_evaluated', [
        'PREREQUISITES',
        'REQUIRED_ACTIVITIES',
        'REQUIRED_PROJECTS',
        ...COMPONENTS,
        ...FOUNDATIONS_CRITICAL,
        'OVERALL_SCORE',
        'EDITION',
      ]),
    ])
  })

  it('edition: everything verified on the static edition -> blocked by EDITION alone', () => {
    storePersists = true
    const evidence = { examAttempts: everySectionPassed(100), edition: 'static' as const }

    assert.deepEqual(issuanceBlockers(credentialSpec(FOUNDATIONS)!, evidence, allVerified()), [
      { code: 'EDITION', kind: 'unmet' },
    ])
  })
})

// ── K3 ──

describe('K3: the gate opens only when every check passes', () => {
  it('issues each capstone credential with every requirement and gate verified (test-only stand-ins)', async () => {
    useRegistry(allVerified())
    storePersists = true
    attempts = everySectionPassed(100)

    for (const badgeId of CREDENTIALS) {
      const { status, body } = await requestCredential(badgeId)

      assert.equal(status, 201, `${badgeId}: ${JSON.stringify(body)}`)
      assert.equal(body.credential.badgeId, badgeId)
      assert.equal(body.credential.specificationVersion, VERSION[badgeId])
    }
    assert.equal(notifications.length, CREDENTIALS.length)
  })

  it('still refuses with only the standing store blocker while no Credential row is written', async () => {
    useRegistry(allVerified())
    attempts = everySectionPassed(100)

    for (const badgeId of CREDENTIALS) {
      const { status, body } = await requestCredential(badgeId)

      assert.equal(status, 403, badgeId)
      assert.deepEqual(body.blockers, [{ code: 'CREDENTIAL_STORE_NOT_IMPLEMENTED', kind: 'standing' }])
    }
    assert.equal(notifications.length, 0)
  })
})

// ── K4 ──

describe('K4: the server signs the badge version, never the client one', () => {
  it('refuses a client specificationVersion that differs from the badge catalog entry', async () => {
    useRegistry(allVerified())
    storePersists = true
    attempts = everySectionPassed(100)

    const forged = await requestCredential(FOUNDATIONS, '9.9.9')
    assert.equal(forged.status, 403)
    assert.deepEqual(forged.body.blockers, [{ code: 'SPEC_VERSION_MISMATCH', kind: 'unmet' }])

    // 1.0.0 is the catalog's top-level version; Mastery's own entry is 1.1.1 (1.1.0 until its claim
    // text changed on 2026-10-13, EXAM-02 before that).
    const catalogWide = await requestCredential(MASTERY, '1.0.0')
    assert.equal(catalogWide.status, 403)
    assert.deepEqual(catalogWide.body.blockers, [{ code: 'SPEC_VERSION_MISMATCH', kind: 'unmet' }])
    assert.equal(notifications.length, 0)

    // The version before the claim wording changed would sign a statement under a specification
    // whose claim said "a prueba de manipulación": the server refuses it.
    const beforeTheWording = await requestCredential(MASTERY, '1.1.0')
    assert.equal(beforeTheWording.status, 403)
    assert.deepEqual(beforeTheWording.body.blockers, [{ code: 'SPEC_VERSION_MISMATCH', kind: 'unmet' }])
    assert.equal(notifications.length, 0)

    const { status, body } = await requestCredential(MASTERY, '1.1.1')
    assert.equal(status, 201)
    assert.equal(body.credential.specificationVersion, '1.1.1')

    // The signed statement claims only what the catalog's public claim makes, and it is built from
    // the badge's own entry: the statement helper is the one source of it.
    const statement: string = body.credential.capabilityStatement
    for (const phrase of UNBACKED_STATEMENT_CLAIMS) {
      assert.doesNotMatch(statement, new RegExp(phrase, 'i'), `the signed statement claims "${phrase}"`)
    }
    const { capabilityStatement } = await import('../../src/lib/credential-statement.ts')
    assert.equal(statement, capabilityStatement(credentialSpec(MASTERY)!))
  })
})

/** Claims the route signed before the catalog's public claim was the source. None is in the catalog. */
const UNBACKED_STATEMENT_CLAIMS = ['critical evidence', 'hidden validation', 'independent review']

// ── K5 ──

type RawBadge = {
  badge_id: string
  credential_type: string
  prerequisite_badges: string[]
  assessment_blueprint: { components: Array<{ component_id: string }> }
}

/** The capstone credentials as badge_catalog.json lists them, read without the app's parser. */
function catalogCredentials(): RawBadge[] {
  const raw = JSON.parse(
    readFileSync(join(REPO_ROOT, 'src/lib/eligibility/badge_catalog.json'), 'utf8')
  ) as { badges: RawBadge[] }
  return raw.badges.filter((b) => b.credential_type === 'verified_credential')
}

/** A learner who meets every gate of `spec`, built by hand rather than through any verifier. */
function fullProgress(spec: BadgeSpec): LearnerProgress {
  return {
    learner_id: LEARNER,
    awarded_badges: awarded(spec.prerequisite_badges),
    activities: ['SELFCHECK', 'YOUDO', 'EXAM'].flatMap((kind) => sectionActivities(spec, kind, 100)),
    critical_competency_scores: defense(spec).critical_competency_scores ?? [],
    project_results: { ...projectResults(spec, 100), ...defense(spec).project_results },
  }
}

describe('K5: every check has a blocker', () => {
  it('maps every engine gate to its own blocker code', () => {
    assert.deepEqual(Object.keys(BLOCKER_FOR_GATE), [...ENGINE_GATES])
    const codes = Object.values(BLOCKER_FOR_GATE)
    assert.equal(new Set(codes).size, codes.length, `two gates share a code: ${codes}`)
    for (const code of codes) assert.match(code, /^[A-Z_]+$/)
  })

  it('blocks every component and the prerequisites of all five capstone credentials while unverified', () => {
    const credentials = catalogCredentials()
    assert.equal(credentials.length, 5)

    for (const raw of credentials) {
      const blockers = issuanceBlockers(
        credentialSpec(raw.badge_id)!,
        { examAttempts: [], edition: 'dynamic' },
        {}
      )
      const unverified = blockers.filter((b) => b.kind === 'unverified').map((b) => b.code)

      assert.deepEqual(unverified, [
        ...raw.assessment_blueprint.components.map((c) => `COMPONENT:${c.component_id}`),
        ...(raw.prerequisite_badges.length > 0 ? ['PREREQUISITES'] : []),
      ], raw.badge_id)
    }
  })

  it("names every requirement the engine reports under one of ENGINE_GATES, for all five credentials", () => {
    for (const raw of catalogCredentials()) {
      const spec = credentialSpec(raw.badge_id)!
      const engine = new EligibilityEngine(new Map([[spec.badge_id, spec]]))
      const report = engine.evaluate(spec.badge_id, fullProgress(spec), { edition: 'dynamic' })

      assert.equal(report.state, 'awarded', `${raw.badge_id}: ${report.blocking_reasons}`)
      assert.deepEqual(
        report.requirements.map((r) => r.requirement_id),
        ENGINE_GATES.flatMap((g) => GATE_REQUIREMENTS[g](spec).map((r) => r.requirement_id)),
        raw.badge_id
      )
    }
  })
})

// ── K6 ──

describe('K6: what production verifies', () => {
  it('verifies section exams and nothing else', () => {
    assert.deepEqual(Object.keys(PRODUCTION_VERIFIERS), ['section_exams'])
    assert.equal(PRODUCTION_VERIFIERS.section_exams, verifySectionExams)
  })

  it('writes no Credential row yet, so the standing store blocker is on', () => {
    assert.equal(productionStorePersists(), false)
  })
})

// ── K7 ──

/**
 * A NEXT_PUBLIC_ name is inlined into the browser bundle at build time (Next.js 16.4 docs,
 * nextjs.org/docs/app/guides/environment-variables, "Bundling Environment Variables for the
 * Browser"), so a signing key read under one is published. ADR 5 removed the only one this
 * project had: HMAC is symmetric, and its verification key is its signing key.
 * Over-matches on purpose (DESIGN contains SIGN): a false positive costs an entry below.
 */
const PUBLIC_SECRET_NAME = /\bNEXT_PUBLIC_[A-Z0-9_]*(?:KEY|SECRET|SIGN|TOKEN|PASSWORD|PRIVATE)[A-Z0-9_]*/g

/** Public by design, each with the source that says so. */
const PUBLIC_BY_DESIGN: Record<string, string> = {
  // "API keys for Firebase services only identify your Firebase project and app to those
  // services" (firebase.google.com/docs/projects/api-keys). Data is guarded by Security Rules.
  NEXT_PUBLIC_FIREBASE_API_KEY: 'firebase.google.com/docs/projects/api-keys',
}

function sourceFiles(dir: string): string[] {
  return readdirSync(join(REPO_ROOT, dir), { recursive: true, encoding: 'utf8' })
    .filter((f) => /\.(?:[cm]?[jt]sx?)$/.test(f))
    .map((f) => join(dir, f))
}

describe('K7: no signing key is published to the browser', () => {
  it('the pattern catches the names it is meant to, and passes the public ones', () => {
    const names = (text: string) => text.match(PUBLIC_SECRET_NAME) ?? []
    assert.deepEqual(names('process.env.NEXT_PUBLIC_CREDENTIAL_VERIFY_KEY'), ['NEXT_PUBLIC_CREDENTIAL_VERIFY_KEY'])
    assert.deepEqual(names('NEXT_PUBLIC_HMAC_SIGNING_SECRET'), ['NEXT_PUBLIC_HMAC_SIGNING_SECRET'])
    assert.deepEqual(names('NEXT_PUBLIC_SIGNATURE'), ['NEXT_PUBLIC_SIGNATURE'])
    assert.deepEqual(names('process.env.NEXT_PUBLIC_STATIC_SITE, NEXT_PUBLIC_BASE_PATH'), [])
    assert.deepEqual(names('process.env.CREDENTIAL_SIGNING_KEY'), [])
  })

  it('no file under src/ names a NEXT_PUBLIC_ key, secret, token or signing value', () => {
    const files = sourceFiles('src')
    assert.ok(files.length > 100, `only ${files.length} source files found under src/`)

    const found = files.flatMap((file) =>
      (readFileSync(join(REPO_ROOT, file), 'utf8').match(PUBLIC_SECRET_NAME) ?? [])
        .filter((name) => !(name in PUBLIC_BY_DESIGN))
        .map((name) => `${file}: ${name}`)
    )

    assert.deepEqual(found, [])
  })
})
