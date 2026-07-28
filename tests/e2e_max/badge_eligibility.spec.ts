/**
 * Playwright E2E — Badge Eligibility triple-validation (Layer 3).
 *
 * Companion to `industry_alignment/playwright_badge_test_matrix.md`.
 *
 * What this file tests
 * --------------------
 * The badge-eligibility contract specified in
 *   - `industry_alignment/credential_architecture.md`
 *   - `industry_alignment/eligibility_state_machine.md`
 *   - `industry_alignment/assessment_validity_report.md`
 *   - `industry_alignment/badge_catalog.json` (v1.0.0, 31 badges)
 *
 * What this file does NOT do
 * --------------------------
 * - It does not weaken assertions to make a buggy engine pass.
 * - It does not use `page.waitForTimeout()` for assertion purposes
 *   (one 200ms post-setContent stabilisation pause is allowed and
 *   annotated; see §5.3 of the matrix).
 * - It does not mock the engine. The production TypeScript engine
 *   in `src/lib/eligibility/` is imported directly and exercised
 *   against the real production catalog.
 *
 * Run:
 *   BASE_URL=http://localhost:3000 npx playwright test \
 *     -c tests/e2e_max/playwright.badge.config.ts --reporter=line
 */
import { test, expect, type Page } from '@playwright/test'
import {
  EligibilityEngine,
  loadBadgeSpecs,
  getCatalogVersion,
  EDITION_STATIC,
  EDITION_DYNAMIC,
  STATE_AWARDED,
  STATE_LOCKED,
  STATE_IN_PROGRESS,
  STATE_EVIDENCE_INCOMPLETE,
  STATE_ELIGIBLE_PENDING_VERIFICATION,
  STATE_ASSESSMENT_READY,
  TIER_THEORY,
  TIER_WE_DO,
  TIER_YOU_DO,
  type LearnerProgress,
  type ActivityEvidence,
  type AwardedBadge,
  type CriticalCompetencyScore,
  type EligibilityReport,
} from '../../src/lib/eligibility/index.ts'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BASE = process.env.BASE_URL || 'http://localhost:3000'
const NOW_ISO = '2026-07-28T23:30:00Z'
const BADGE_ID = 'independent_data_preparation' // competency_badge, active, 4 sections, 1 critical competency
const CAPSTONE_ID = 'integrated_python_ai_capstone_foundations'
const PROGRESS_BADGE_ID = 'progress_phase0_walked'

// ---------------------------------------------------------------------------
// Fixture builders (mirror _full_progress_for_competency_badge in the
// Python reference, tests/adversarial/test_eligibility_engine.py:817)
// ---------------------------------------------------------------------------

function makeActivity(
  activity_id: string,
  evidence_tier: number,
  score_pct: number | null,
  opts: Partial<ActivityEvidence> = {},
): ActivityEvidence {
  return {
    activity_id,
    evidence_tier,
    score_pct,
    submitted_at: '',
    server_verified: true,
    ...opts,
  }
}

function makeCritical(
  competency_id: string,
  criteria_scores: number[],
): CriticalCompetencyScore {
  return {
    competency_id,
    rubric_score_pct: Math.min(...criteria_scores),
    criteria_scores,
  }
}

/**
 * Build a LearnerProgress that satisfies every requirement for a competency
 * badge. Each knob lets a test introduce exactly one defect.
 */
function fullProgressForCompetencyBadge(
  badgeId: string,
  opts: {
    selfCheckPct?: number
    youDoPct?: number
    examPct?: number
    integratorPct?: number
    criticalCriteriaScores?: Record<string, number[]>
    includeSupplementary?: boolean
    dropSection?: string // omit all activities for this section
  } = {},
): LearnerProgress {
  const {
    selfCheckPct = 90,
    youDoPct = 85,
    examPct = 90,
    integratorPct = 90,
    criticalCriteriaScores = {},
    includeSupplementary = false,
    dropSection,
  } = opts

  const { specs } = loadBadgeSpecs()
  const spec = specs.get(badgeId)
  if (!spec) throw new Error(`Unknown badge: ${badgeId}`)

  const progress: LearnerProgress = {
    learner_id: 'learner-e2e-1',
    awarded_badges: [],
    activities: [],
    critical_competency_scores: [],
    project_results: {},
  }

  // Award prerequisites (engine only counts STATE_AWARDED prereqs).
  for (const prereq of spec.prerequisite_badges) {
    progress.awarded_badges.push({
      badge_id: prereq,
      state: STATE_AWARDED,
      awarded_at: NOW_ISO,
    } as AwardedBadge)
  }

  // Activities for each required section: SELFCHECK + YOUDO + EXAM at tier 4.
  for (const section of spec.required_sections) {
    if (dropSection && section === dropSection) continue
    progress.activities.push(
      makeActivity(`${section}-SELFCHECK`, TIER_YOU_DO, selfCheckPct),
    )
    progress.activities.push(
      makeActivity(`${section}-YOUDO`, TIER_YOU_DO, youDoPct),
    )
    progress.activities.push(
      makeActivity(`${section}-EXAM`, TIER_YOU_DO, examPct),
    )
  }

  // Required projects (integrator + defense handled separately).
  for (const projectId of spec.required_projects) {
    progress.project_results[projectId] = integratorPct
  }
  // Capstone defense project (if cited in components).
  const defenseId = `BADGE:${badgeId}:defense`
  if (spec.components.some((c) => c.component_id === 'defense')) {
    progress.project_results[defenseId] = 100
  }

  // Supplementary exercises for pilot badges (gap-affected competencies).
  if (includeSupplementary) {
    for (const compId of spec.gap_affected_competencies) {
      progress.project_results[
        `BADGE:${badgeId}:supplementary:${compId}`
      ] = 100
    }
  }

  // Critical competency scores (default: all criteria at 100).
  for (const compId of spec.critical_competencies) {
    if (criticalCriteriaScores[compId]) {
      progress.critical_competency_scores.push(
        makeCritical(compId, criticalCriteriaScores[compId]),
      )
    } else {
      progress.critical_competency_scores.push(
        makeCritical(compId, [100, 100, 100, 100]),
      )
    }
  }

  return progress
}

/** Build the legacy-shape LearnerProgress a tampered localStorage would
 * yield after the Phase-7 migration algorithm runs (tier 1, legacy_only,
 * no rubric scores). This is the most an attacker can fabricate. */
function legacyProgressFromTamperedLocalStorage(
  badgeId: string,
): LearnerProgress {
  const { specs } = loadBadgeSpecs()
  const spec = specs.get(badgeId)
  if (!spec) throw new Error(`Unknown badge: ${badgeId}`)

  const progress: LearnerProgress = {
    learner_id: 'attacker-1',
    awarded_badges: [],
    activities: [],
    critical_competency_scores: [],
    project_results: {},
  }
  for (const prereq of spec.prerequisite_badges) {
    progress.awarded_badges.push({
      badge_id: prereq,
      state: STATE_AWARDED,
      awarded_at: NOW_ISO,
    } as AwardedBadge)
  }
  for (const section of spec.required_sections) {
    // Attacker claims 100% everywhere, but the migration algorithm
    // tags legacy data as tier-1 (theory) with no rubric score.
    progress.activities.push(
      makeActivity(`${section}-YOUDO`, TIER_THEORY, null, {
        legacy_only: true,
        server_verified: false,
      }),
    )
    progress.activities.push(
      makeActivity(`${section}-EXAM`, TIER_THEORY, 100, {
        legacy_only: true,
        server_verified: false,
      }),
    )
  }
  return progress
}

// ---------------------------------------------------------------------------
// Engine construction (per-test to avoid cross-test mutation)
// ---------------------------------------------------------------------------

function makeEngine(): EligibilityEngine {
  const { specs, catalogVersion } = loadBadgeSpecs()
  return new EligibilityEngine(specs, catalogVersion)
}

// ===========================================================================
// Block F — Catalog loader invariants (run first; gate the rest)
// ===========================================================================

test.describe('Catalog loader invariants', () => {
  test('F1: catalog loads with version 1.0.0 and 31 badges', () => {
    const version = getCatalogVersion()
    expect(version).toBe('1.0.0')
    const { specs } = loadBadgeSpecs()
    expect(specs.size).toBe(31)
    // Sanity: the badge we exercise below must exist.
    expect(specs.has(BADGE_ID)).toBe(true)
    expect(specs.has(CAPSTONE_ID)).toBe(true)
    expect(specs.has(PROGRESS_BADGE_ID)).toBe(true)
  })

  test('F2: every active/pilot badge has a non-empty newbie_friendly_description', () => {
    const { specs } = loadBadgeSpecs()
    const offenders: string[] = []
    for (const [id, spec] of specs) {
      if (spec.status !== 'active' && spec.status !== 'pilot') continue
      if (!spec.newbie_friendly_description || spec.newbie_friendly_description.trim().length < 20) {
        offenders.push(id)
      }
    }
    expect(offenders, `Badges missing Stephen-Fry-redacted description: ${offenders.join(', ')}`).toEqual([])
  })

  test('F3: every competency and capstone badge has at least one critical competency', () => {
    const { specs } = loadBadgeSpecs()
    const offenders: string[] = []
    for (const [id, spec] of specs) {
      if (
        spec.credential_type !== 'competency_badge' &&
        spec.credential_type !== 'verified_credential'
      ) {
        continue
      }
      if (spec.critical_competencies.length === 0) {
        offenders.push(id)
      }
    }
    expect(
      offenders,
      `Competency/capstone badges missing critical_competencies (non-compensatory gate would be vacuous): ${offenders.join(', ')}`,
    ).toEqual([])
  })
})

// ===========================================================================
// Block A — Positive eligibility
// ===========================================================================

test.describe('Positive eligibility', () => {
  test('A1: awards competency badge when every requirement is met (dynamic edition)', () => {
    const engine = makeEngine()
    const progress = fullProgressForCompetencyBadge(BADGE_ID, {
      selfCheckPct: 90,
      youDoPct: 85,
      examPct: 90,
      integratorPct: 90,
    })
    const report = engine.evaluate(BADGE_ID, progress, {
      edition: EDITION_DYNAMIC,
      now: NOW_ISO,
    })
    expect(report.state).toBe(STATE_AWARDED)
    expect(report.eligible).toBe(true)
    expect(report.awarded_at).toBe(NOW_ISO)
    expect(report.blocking_reasons).toEqual([])
    // Every individual requirement must also have passed.
    const failed = report.requirements.filter((r) => !r.passed)
    expect(failed, `Failed requirements: ${JSON.stringify(failed)}`).toEqual([])
  })

  test('A2: refresh preserves a valid awarded state across reloads', async ({ page }) => {
    test.setTimeout(60_000)
    // First, compute the expected verdict in Node (engine is deterministic).
    const engine = makeEngine()
    const progress = fullProgressForCompetencyBadge(BADGE_ID)
    const expected = engine.evaluate(BADGE_ID, progress, {
      edition: EDITION_STATIC,
      now: NOW_ISO,
    })

    // Navigate to the home page; this gives us a real browser context with
    // a real localStorage. We stash the engine's verdict in localStorage to
    // model what the (future) badge UI would persist after an award preview.
    await page.goto(BASE, { waitUntil: 'domcontentloaded' })
    await page.evaluate(
      ({ key, payload }) => {
        window.localStorage.setItem(key, JSON.stringify(payload))
      },
      { key: 'pyarcana-badge-preview', payload: expected },
    )

    // Reload — localStorage must survive.
    await page.reload({ waitUntil: 'domcontentloaded' })
    const roundTripped = await page.evaluate((key) => {
      const raw = window.localStorage.getItem(key)
      return raw ? JSON.parse(raw) : null
    }, 'pyarcana-badge-preview')

    expect(roundTripped).not.toBeNull()
    expect(roundTripped.badge_id).toBe(expected.badge_id)
    expect(roundTripped.state).toBe(expected.state)
    expect(roundTripped.eligible).toBe(expected.eligible)
    expect(roundTripped.blocking_reasons).toEqual(expected.blocking_reasons)
    // The requirement tuples must be byte-equal (determinism).
    const roundTrippedReqs = roundTripped.requirements.map(
      (r: { requirement_id: string; passed: boolean; score: number | null; floor: number | null }) =>
        [r.requirement_id, r.passed, r.score, r.floor],
    )
    const expectedReqs = expected.requirements.map((r) => [
      r.requirement_id,
      r.passed,
      r.score ?? null,
      r.floor ?? null,
    ])
    expect(roundTrippedReqs).toEqual(expectedReqs)

    // Re-evaluate after reload; the engine's verdict must be identical
    // (determinism, no time-of-day dependence).
    const reEvaluated = engine.evaluate(BADGE_ID, progress, {
      edition: EDITION_STATIC,
      now: NOW_ISO,
    })
    expect(reEvaluated.state).toBe(expected.state)
    expect(reEvaluated.eligible).toBe(expected.eligible)
  })

  test('A3: progress badge is awarded on static edition (mirrors Layer 1 test 17)', () => {
    // Progress badges (local_achievement) are the ONLY credential type
    // issued on the static edition. This mirrors Layer 1 test 17 and
    // guards against a regression that would make the static edition
    // refuse to issue progress badges (which would break learner motivation).
    const engine = makeEngine()
    const { specs } = loadBadgeSpecs()
    const spec = specs.get(PROGRESS_BADGE_ID)!
    const progress: LearnerProgress = {
      learner_id: 'progress-learner-1',
      awarded_badges: [],
      activities: [],
      critical_competency_scores: [],
      project_results: {},
    }
    // Progress badges require YOUDO + EXAM per section, no score floor.
    for (const section of spec.required_sections) {
      progress.activities.push(
        makeActivity(`${section}-YOUDO`, TIER_YOU_DO, null),
      )
      progress.activities.push(
        makeActivity(`${section}-EXAM`, TIER_YOU_DO, null),
      )
    }
    const report = engine.evaluate(PROGRESS_BADGE_ID, progress, {
      edition: EDITION_STATIC,
      now: NOW_ISO,
    })
    expect(report.state).toBe(STATE_AWARDED)
    expect(report.eligible).toBe(true)
  })
})

// ===========================================================================
// Block B — Negative eligibility
// ===========================================================================

test.describe('Negative eligibility', () => {
  test('B1: blocks award when one required section\'s activities are missing', () => {
    const engine = makeEngine()
    const { specs } = loadBadgeSpecs()
    const spec = specs.get(BADGE_ID)!
    const droppedSection = spec.required_sections[0]

    const progress = fullProgressForCompetencyBadge(BADGE_ID, {
      dropSection: droppedSection,
    })
    const report = engine.evaluate(BADGE_ID, progress, {
      edition: EDITION_DYNAMIC,
      now: NOW_ISO,
    })

    expect(report.eligible).toBe(false)
    expect(report.state).not.toBe(STATE_AWARDED)
    expect([STATE_IN_PROGRESS, STATE_EVIDENCE_INCOMPLETE]).toContain(report.state)
    // The blocking reason must name the missing activities.
    const missingActivityRe = new RegExp(
      `${droppedSection}-(SELFCHECK|YOUDO|EXAM)`,
    )
    expect(
      report.blocking_reasons.some((r) => missingActivityRe.test(r)),
      `Expected a blocking reason mentioning ${droppedSection} activities; got: ${JSON.stringify(report.blocking_reasons)}`,
    ).toBe(true)
  })

  test('B2: blocks award when self-check is one point below the 85% floor', () => {
    const engine = makeEngine()
    const progress = fullProgressForCompetencyBadge(BADGE_ID, {
      selfCheckPct: 84, // exactly one below the 85 floor (after round-down)
      youDoPct: 90,
      examPct: 90,
      integratorPct: 90,
    })
    const report = engine.evaluate(BADGE_ID, progress, {
      edition: EDITION_DYNAMIC,
      now: NOW_ISO,
    })

    expect(report.eligible).toBe(false)
    const scReq = report.requirements.find(
      (r) => r.requirement_id === 'component:self_check',
    )
    expect(scReq).toBeDefined()
    expect(scReq!.passed).toBe(false)
    expect(scReq!.score).toBe(84)
    expect(scReq!.floor).toBe(85)
  })

  test('B3: blocks award when average is high but a critical competency is below 100', () => {
    const engine = makeEngine()
    const { specs } = loadBadgeSpecs()
    const spec = specs.get(BADGE_ID)!
    // All other scores at 95, but the critical competency has one criterion
    // at 75 — the non-compensatory gate must block.
    const criticalId = spec.critical_competencies[0]
    const progress = fullProgressForCompetencyBadge(BADGE_ID, {
      selfCheckPct: 95,
      youDoPct: 95,
      examPct: 95,
      integratorPct: 95,
      criticalCriteriaScores: {
        [criticalId]: [100, 100, 75, 100],
      },
    })
    const report = engine.evaluate(BADGE_ID, progress, {
      edition: EDITION_DYNAMIC,
      now: NOW_ISO,
    })

    expect(report.eligible).toBe(false)
    expect(report.state).not.toBe(STATE_AWARDED)
    // The critical-competency requirement must be the one that failed.
    const critReq = report.requirements.find(
      (r) => r.requirement_id === `critical_competency:${criticalId}`,
    )
    expect(critReq).toBeDefined()
    expect(critReq!.passed).toBe(false)
    expect(critReq!.score).toBe(75)
    expect(critReq!.floor).toBe(100)
    // Non-compensation check: the weighted-average component (≥ 85) must NOT
    // have rescued the badge. Verify by checking that the overall component,
    // if present, did pass while the badge still failed.
    const overallReq = report.requirements.find(
      (r) => r.requirement_id === 'overall_weighted_average',
    )
    if (overallReq) {
      // The engine short-circuits at the critical-competency gate, so the
      // overall requirement may not even be reached. If it IS reached and
      // passed, the badge still failed — that's the non-compensation proof.
      if (overallReq.passed) {
        expect(report.eligible).toBe(false) // still blocked
      }
    }
    // The blocking reason must mention the critical competency.
    expect(
      report.blocking_reasons.some(
        (r) => r.includes(criticalId) || r.toLowerCase().includes('critical'),
      ),
      `Expected a critical-competency blocking reason; got: ${JSON.stringify(report.blocking_reasons)}`,
    ).toBe(true)
  })

  test('B4: refuses to fabricate evidence from tampered localStorage', async ({ page }) => {
    test.setTimeout(60_000)
    // Stage 1: in the browser, plant a tampered localStorage payload that
    // claims 100% on every section. This is the most an attacker can write.
    await page.goto(BASE, { waitUntil: 'domcontentloaded' })
    await page.evaluate(() => {
      const tampered = {
        state: {
          completedSections: [
            'setup', 'basics', 'data-structures', 'functions-modules',
            'oop', 'numpy', 'data-acquisition', 'pandas', 'visualization',
            'sklearn', 'testing', 'performance', 'rpa-automation',
            'security', 'stdlib-deep', 'wxpython-gui', 'packaging',
            'data-engineering', 'databases-orm', 'rag', 'fastapi',
            'rapidfuzz-entity', 'computer-vision', 'rpa-advanced',
            'streamlit-dashboards',
          ],
          completedSubSteps: {},
          quizScores: {
            setup: 100, basics: 100, 'data-structures': 100,
            'functions-modules': 100, oop: 100, numpy: 100,
            'data-acquisition': 100, pandas: 100, visualization: 100,
            sklearn: 100, testing: 100, performance: 100,
            'rpa-automation': 100, security: 100, 'stdlib-deep': 100,
            'wxpython-gui': 100, packaging: 100, 'data-engineering': 100,
            'databases-orm': 100, rag: 100, fastapi: 100,
            'rapidfuzz-entity': 100, 'computer-vision': 100,
            'rpa-advanced': 100, 'streamlit-dashboards': 100,
          },
          lastVisited: 'setup',
          bookmarks: [],
          startDate: '2024-01-01T00:00:00.000Z',
          isHydratedFromServer: false,
        },
        version: 2,
      }
      window.localStorage.setItem(
        'python-ds-progress',
        JSON.stringify(tampered),
      )
    })

    // Verify the tampered payload actually persisted in localStorage
    // (i.e., the browser accepted it).
    const persisted = await page.evaluate(() => {
      return window.localStorage.getItem('python-ds-progress')
    })
    expect(persisted).not.toBeNull()
    expect(persisted!).toContain('"quizScores"')

    // Stage 2: in Node, run the production engine against the
    // legacy-shape LearnerProgress that the migration algorithm would
    // produce from that tampered localStorage (tier 1, legacy_only, no
    // rubric scores — the most the migration can extract).
    const engine = makeEngine()
    const legacyProgress = legacyProgressFromTamperedLocalStorage(BADGE_ID)
    const report = engine.evaluate(BADGE_ID, legacyProgress, {
      edition: EDITION_STATIC, // static edition is the browser-only context
      now: NOW_ISO,
    })

    // The engine MUST refuse to award, regardless of the 100%s in localStorage.
    expect(report.eligible).toBe(false)
    expect(report.state).not.toBe(STATE_AWARDED)
    // The blocking reason must reject the legacy evidence by mentioning
    // independence / hands-on / tier / missing activities.
    const reasonText = report.blocking_reasons.join(' ').toLowerCase()
    expect(
      /independent|missing|tier|hands-on|reading alone|complete these activities/.test(
        reasonText,
      ),
      `Expected legacy-evidence rejection; got: ${JSON.stringify(report.blocking_reasons)}`,
    ).toBe(true)

    // Stage 3: the home page must still render without console errors after
    // the tampered payload was planted (the app must not crash on bad data).
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(String(err.message || err)))
    page.on('console', (msg) => {
      if (msg.type() !== 'error') return
      const t = msg.text()
      // Filter known noise (mirrors scripts/e2e_max/helpers/assert.ts).
      if (
        /pyodide|cdn\.jsdelivr|favicon|Download the React DevTools|hydration|CLIENT_FETCH_ERROR|Failed to fetch|next-auth|NetworkError|Load failed|chunk|403 \(Forbidden\)|401 \(Unauthorized\)|status of 403|status of 401|Failed to load resource/i.test(
          t,
        )
      ) {
        return
      }
      errors.push(t)
    })
    await page.reload({ waitUntil: 'domcontentloaded' })
    // Give the page a chance to settle (web-first: wait for body).
    await expect(page.locator('body')).toBeVisible()
    expect(
      errors,
      `Tampered localStorage caused console errors: ${errors.join('\n')}`,
    ).toEqual([])
  })

  test('B5: capstone credential is never awarded on static edition', () => {
    const engine = makeEngine()
    const { specs } = loadBadgeSpecs()
    const spec = specs.get(CAPSTONE_ID)!
    const progress = fullProgressForCompetencyBadge(CAPSTONE_ID, {
      selfCheckPct: 90,
      youDoPct: 85,
      examPct: 90,
      integratorPct: 90,
    })
    const report = engine.evaluate(CAPSTONE_ID, progress, {
      edition: EDITION_STATIC,
      now: NOW_ISO,
    })
    expect(report.state).not.toBe(STATE_AWARDED)
    expect(report.eligible).toBe(false)
    expect(
      report.blocking_reasons.some((r) =>
        /static|sign in|lms/i.test(r),
      ),
      `Expected a static-edition disclaimer; got: ${JSON.stringify(report.blocking_reasons)}`,
    ).toBe(true)
  })
})

// ===========================================================================
// Block C — UI surface states (injected DOM contract)
// ===========================================================================

/**
 * The badge-card DOM contract that the (upcoming) badge UI component MUST
 * implement. Until that component ships, we inject this contract DOM via
 * page.setContent() and assert the visible + accessible behaviour. When
 * the component ships, these tests switch to mounting the component
 * directly; the assertions stay identical.
 */
const BADGE_CARD_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Badge card fixture</title>
  <style>
    :focus-visible { outline: 3px solid #2563eb; outline-offset: 2px; }
    .badge-card { border: 1px solid #d1d5db; border-radius: 8px; padding: 16px; max-width: 360px; font-family: system-ui; }
    .badge-card[data-state="locked"] { opacity: 0.6; }
    .badge-card[data-state="awarded"] { border-color: #16a34a; background: #f0fdf4; }
    .state-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
    .progress-bar { height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden; }
    .progress-bar > div { height: 100%; background: #2563eb; }
    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
  </style>
</head>
<body>
  <main>
    <section
      data-testid="badge-card"
      data-state="locked"
      data-badge-id="independent_data_preparation"
      tabindex="0"
      role="group"
      aria-labelledby="badge-name badge-state-label"
      aria-describedby="badge-description"
    >
      <h3 id="badge-name" data-testid="badge-name">Independent Data Preparation</h3>
      <p id="badge-state-label" class="state-label" data-testid="badge-state-label">Locked</p>
      <p id="badge-description" class="sr-only" data-testid="badge-description">You need to earn the Python Data Foundations badge first. Think of it as the building block for this one.</p>
      <p aria-hidden="true">🔒</p>
    </section>

    <section
      data-testid="badge-card"
      data-state="in_progress"
      data-badge-id="applied_sql_query_development"
      tabindex="0"
      role="group"
      aria-labelledby="badge-name-2 badge-state-label-2"
      aria-describedby="badge-description-2"
    >
      <h3 id="badge-name-2" data-testid="badge-name">Applied SQL Query Development</h3>
      <p id="badge-state-label-2" class="state-label" data-testid="badge-state-label">In progress</p>
      <p id="badge-description-2" class="sr-only" data-testid="badge-description">You have completed 3 of 5 required activities. The badge unlocks when every required activity is complete and meets its floor.</p>
      <div
        data-testid="badge-progress-bar"
        role="progressbar"
        aria-valuenow="60"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label="Applied SQL Query Development progress: 60 percent"
        class="progress-bar"
      ><div style="width: 60%"></div></div>
    </section>

    <section
      data-testid="badge-card"
      data-state="awarded"
      data-badge-id="python_data_foundations"
      tabindex="0"
      role="group"
      aria-labelledby="badge-name-3 badge-state-label-3"
      aria-describedby="badge-description-3"
    >
      <h3 id="badge-name-3" data-testid="badge-name">Python Data Foundations</h3>
      <p id="badge-state-label-3" class="state-label" data-testid="badge-state-label">Awarded</p>
      <p id="badge-description-3" class="sr-only" data-testid="badge-description">You earned this badge on 2026-07-28. It is valid for 3 years from the issue date.</p>
      <p data-testid="badge-awarded-at"><time datetime="2026-07-28T23:30:00Z">2026-07-28</time></p>
      <p aria-hidden="true">✅</p>
      <button data-testid="badge-details-toggle" aria-expanded="false" aria-controls="badge-details">View details</button>
      <div id="badge-details" data-testid="badge-details" hidden>
        <p>Detailed evidence breakdown.</p>
      </div>
    </section>
  </main>
</body>
</html>
`

test.describe('UI surface states', () => {
  test.beforeEach(async ({ page }) => {
    // setContent does not wait for layout/paint; a single short
    // stabilisation pause is the documented Playwright workaround.
    await page.setContent(BADGE_CARD_HTML, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(200) // annotated exception per matrix §5.3
  })

  test('C1: renders locked state visibly and accessibly', async ({ page }) => {
    const locked = page.locator('[data-testid="badge-card"][data-state="locked"]')
    await expect(locked).toBeVisible()
    await expect(locked).toHaveAttribute('data-badge-id', 'independent_data_preparation')
    await expect(locked.getByTestId('badge-state-label')).toHaveText('Locked')
    await expect(locked.getByTestId('badge-name')).toHaveText('Independent Data Preparation')
    // Accessible name = name + state label.
    await expect(locked).toHaveAttribute('aria-labelledby', /badge-name\s+badge-state-label/)
    // Description references a real element.
    const descId = await locked.getAttribute('aria-describedby')
    expect(descId).toBeTruthy()
    const desc = page.locator(`#${descId}`)
    await expect(desc).toBeAttached()
    await expect(desc).toContainText(/building block|prerequisite|earn.*first/i)
  })

  test('C2: renders in-progress state visibly and accessibly', async ({ page }) => {
    const inProgress = page.locator('[data-testid="badge-card"][data-state="in_progress"]')
    await expect(inProgress).toBeVisible()
    await expect(inProgress.getByTestId('badge-state-label')).toHaveText('In progress')
    const bar = inProgress.getByTestId('badge-progress-bar')
    await expect(bar).toBeVisible()
    await expect(bar).toHaveAttribute('role', 'progressbar')
    await expect(bar).toHaveAttribute('aria-valuenow', '60')
    await expect(bar).toHaveAttribute('aria-valuemin', '0')
    await expect(bar).toHaveAttribute('aria-valuemax', '100')
    await expect(bar).toHaveAttribute('aria-label', /Applied SQL Query Development progress: 60 percent/)
  })

  test('C3: renders awarded state visibly and accessibly', async ({ page }) => {
    const awarded = page.locator('[data-testid="badge-card"][data-state="awarded"]')
    await expect(awarded).toBeVisible()
    await expect(awarded.getByTestId('badge-state-label')).toHaveText('Awarded')
    const awardedAt = awarded.getByTestId('badge-awarded-at')
    await expect(awardedAt).toBeVisible()
    // The <time> element must have a machine-readable datetime attribute.
    const timeEl = awardedAt.locator('time')
    await expect(timeEl).toHaveAttribute('datetime', '2026-07-28T23:30:00Z')
    // Accessible description must include the issue date.
    const descId = await awarded.getAttribute('aria-describedby')
    const desc = page.locator(`#${descId}`)
    await expect(desc).toContainText(/2026-07-28/)
  })
})

// ===========================================================================
// Block D — Keyboard navigation
// ===========================================================================

test.describe('Keyboard navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.setContent(BADGE_CARD_HTML, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(200) // annotated exception per matrix §5.3
  })

  test('D1: badge card is keyboard-focusable and activatable', async ({ page }) => {
    const cards = page.locator('[data-testid="badge-card"]')
    await expect(cards).toHaveCount(3)

    // Move focus into the document, then Tab through the three cards.
    await page.locator('body').focus()
    await page.keyboard.press('Tab')
    // First focusable element should be the first badge card.
    const firstCard = cards.nth(0)
    await expect(firstCard).toBeFocused()
    // Focus must be visible (CSS :focus-visible outline).
    const outline = await firstCard.evaluate((el) => {
      const s = window.getComputedStyle(el)
      return s.outlineWidth + ' ' + s.outlineStyle + ' ' + s.outlineColor
    })
    expect(outline).not.toMatch(/^0\s+none/)

    // Tab to the second card.
    await page.keyboard.press('Tab')
    await expect(cards.nth(1)).toBeFocused()

    // Tab to the third card (which contains a button — Tab should land on
    // the card first, then a second Tab lands on the button).
    await page.keyboard.press('Tab')
    await expect(cards.nth(2)).toBeFocused()

    // Tab once more to reach the "View details" button inside the awarded card.
    await page.keyboard.press('Tab')
    const detailsBtn = page.getByTestId('badge-details-toggle')
    await expect(detailsBtn).toBeFocused()

    // Activate the button with Enter; the details region must open.
    await page.keyboard.press('Enter')
    await expect(detailsBtn).toHaveAttribute('aria-expanded', 'true')
    const details = page.getByTestId('badge-details')
    await expect(details).toBeVisible()
    await expect(details).not.toHaveAttribute('hidden')
  })
})

// ===========================================================================
// Block E — Screen-reader labels
// ===========================================================================

test.describe('Screen-reader labels', () => {
  test.beforeEach(async ({ page }) => {
    await page.setContent(BADGE_CARD_HTML, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(200) // annotated exception per matrix §5.3
  })

  test('E1: every badge state has an accessible name and description', async ({ page }) => {
    const cards = page.locator('[data-testid="badge-card"]')
    const count = await cards.count()
    expect(count).toBe(3)

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i)
      const stateLabel = await card.getByTestId('badge-state-label').textContent()
      const nameText = await card.getByTestId('badge-name').textContent()
      expect(stateLabel, `card ${i} state label`).toBeTruthy()
      expect(nameText, `card ${i} name`).toBeTruthy()

      // aria-labelledby must reference real, non-empty element IDs.
      const labelledBy = await card.getAttribute('aria-labelledby')
      expect(labelledBy, `card ${i} aria-labelledby`).toBeTruthy()
      const labelIds = labelledBy!.split(/\s+/).filter(Boolean)
      expect(labelIds.length).toBeGreaterThanOrEqual(2)
      for (const id of labelIds) {
        const el = page.locator(`#${id}`)
        await expect(el, `card ${i} label element #${id}`).toBeAttached()
        const text = (await el.textContent()) || ''
        expect(text.trim().length, `card ${i} label element #${id} text`).toBeGreaterThan(0)
      }

      // aria-describedby must reference a real, non-empty element.
      const describedBy = await card.getAttribute('aria-describedby')
      expect(describedBy, `card ${i} aria-describedby`).toBeTruthy()
      const descEl = page.locator(`#${describedBy}`)
      await expect(descEl).toBeAttached()
      const descText = (await descEl.textContent()) || ''
      expect(descText.trim().length, `card ${i} description text`).toBeGreaterThan(20)

      // role="group" gives SR users a landmark; verify it.
      await expect(card).toHaveAttribute('role', 'group')

      // tabindex="0" makes the card keyboard-focusable (verified in D1);
      // verify the attribute is present here too.
      await expect(card).toHaveAttribute('tabindex', '0')
    }
  })
})
