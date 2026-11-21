/**
 * Contract: a competency badge needs the self-check of every section it requires (proposal 11,
 * §5.2 item 1).
 *
 * The engine averages the self-checks it finds and skips the sections that have none
 * (engine.ts aggregateSelfCheck). Before the catalog listed `Sxx-SELFCHECK` in
 * required_activities, one self-check at 100 out of five sections met the 85% floor, and the
 * badge was awarded. The catalog now lists each one, so a missing self-check blocks the badge at
 * the required-activities gate and names the section, which is what the learner needs to read.
 *
 * Run: node --import tsx --test tests/adversarial/badge-self-check-required.test.ts
 */
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { EligibilityEngine } from '../../src/lib/eligibility/engine'
import type { ActivityEvidence, BadgeSpec, LearnerProgress } from '../../src/lib/eligibility/types'
import { EDITION_DYNAMIC, TIER_YOU_DO } from '../../src/lib/eligibility/types'
import { loadBadgeSpecs } from '../../src/lib/eligibility/badge-specs'

const BADGE = 'python_data_foundations'
const { specs } = loadBadgeSpecs()
const spec = specs.get(BADGE) as BadgeSpec

function activity(id: string, score: number): ActivityEvidence {
  return { activity_id: id, evidence_tier: TIER_YOU_DO, score_pct: score, server_verified: true }
}

/** Everything the badge asks for at 90, the critical competency at 100, and the given self-checks. */
function progress(selfChecks: string[]): LearnerProgress {
  const activities = spec.required_sections.flatMap((s) => [activity(`${s}-YOUDO`, 90), activity(`${s}-EXAM`, 90)])
  for (const section of selfChecks) activities.push(activity(`${section}-SELFCHECK`, 100))
  return {
    learner_id: 'synthetic-learner',
    awarded_badges: [],
    activities,
    critical_competency_scores: spec.critical_competencies.map((c) => ({ competency_id: c, rubric_score_pct: 100 })),
    project_results: Object.fromEntries(spec.required_projects.map((p) => [p, 90])),
  }
}

describe(`${BADGE}: one self-check is not enough`, () => {
  const engine = new EligibilityEngine()

  it('the catalog lists the self-check of every required section', () => {
    for (const section of spec.required_sections) {
      assert.ok(spec.required_activities.includes(`${section}-SELFCHECK`), section)
    }
  })

  it('awards the badge with every self-check (positive control)', () => {
    const report = engine.evaluate(BADGE, progress(spec.required_sections), { edition: EDITION_DYNAMIC })
    assert.equal(report.eligible, true, JSON.stringify(report.blocking_reasons))
  })

  it('blocks the badge with one self-check out of five, and names the missing ones', () => {
    const report = engine.evaluate(BADGE, progress(['S01']), { edition: EDITION_DYNAMIC })
    assert.equal(report.eligible, false)
    const gate = report.requirements.find((r) => r.requirement_id === 'required_activities')
    assert.ok(gate && !gate.passed, 'the required-activities gate fails')
    for (const section of ['S02', 'S03', 'S04', 'S05']) {
      assert.match(gate.blocking_reason ?? '', new RegExp(`${section}-SELFCHECK`))
    }
    assert.doesNotMatch(gate.blocking_reason ?? '', /S01-SELFCHECK/)
  })
})
