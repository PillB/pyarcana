/**
 * Adversarial unit tests — admin analytics aggregation.
 * Empty cohorts, bad dates, score extremes, duplicate progress, inactivity.
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  PASS_THRESHOLD,
  bandForPhase,
  buildAnalyticsPayload,
  buildStudentMetrics,
  phaseForSectionIndex,
  type ExamRow,
  type ProgressRow,
  type UserRow,
} from '../../src/lib/admin-analytics.ts'
import { COURSE_SECTIONS, PHASES } from '../../src/lib/course/index.ts'

const NOW = new Date('2026-07-21T12:00:00.000Z')

/** A row graded by the current code over questions the learner had not seen (isEvidence). */
const GRADED_NOW = { gradingVersion: 1, exposedItems: 0 }

function user(partial: Partial<UserRow> & { id: string }): UserRow {
  return {
    email: `${partial.id}@test.pe`,
    name: partial.name ?? partial.id,
    createdAt: partial.createdAt ?? '2026-07-01T00:00:00.000Z',
    role: partial.role,
    ...partial,
  }
}

describe('phase bands come from phase, never from fixed index thresholds (design G-4)', () => {
  it('every course section is banded by the phase whose range holds its index', () => {
    for (const s of COURSE_SECTIONS) {
      const owner = PHASES.find((p) => {
        const [lo, hi] = p.sections.split('-').map(Number)
        return s.index >= (lo ?? NaN) && s.index <= (hi ?? NaN)
      })
      assert.ok(owner, `${s.id} at index ${s.index} sits in no PHASES range`)
      assert.equal(phaseForSectionIndex(s.index), bandForPhase(owner.id), s.id)
    }
  })

  it('phase 0 is shown as band 1; phases 1 to 3 keep their own band', () => {
    assert.deepEqual([0, 1, 2, 3].map((p) => bandForPhase(p as 0 | 1 | 2 | 3)), [1, 1, 2, 3])
  })

  it('a renumber moves the band boundary with the phase table', () => {
    // Phase 2 starts at 29 after two sections are inserted before it. Fixed thresholds at 26 and
    // 39 would band index 27 as 2 and miss the move; the phase table bands it as 1.
    const renumbered = [
      { id: 0, sections: '1-13' },
      { id: 1, sections: '14-28' },
      { id: 2, sections: '29-42' },
      { id: 3, sections: '43-55' },
    ] as const
    assert.equal(phaseForSectionIndex(27, renumbered), 1)
    assert.equal(phaseForSectionIndex(29, renumbered), 2)
  })

  it('an index that no phase range holds has no band, rather than an invented one', () => {
    assert.equal(phaseForSectionIndex(0), null)
    assert.equal(phaseForSectionIndex(99), null)
  })
})

describe('buildStudentMetrics', () => {
  it('empty users → empty metrics (no throw)', () => {
    assert.deepEqual(buildStudentMetrics([], [], [], {}, NOW), [])
  })

  it('new user never started is at_risk after 7d inactive', () => {
    const u = user({
      id: 'u1',
      createdAt: '2026-07-01T00:00:00.000Z', // 20 days before NOW
    })
    const [m] = buildStudentMetrics([u], [], [], {}, NOW)
    assert.equal(m!.sectionsStarted, 0)
    assert.equal(m!.risk, 'at_risk')
    assert.ok(m!.riskReason)
  })

  it('section completion requires all 5 substeps', () => {
    const u = user({ id: 'u2', createdAt: NOW.toISOString() })
    const progress: ProgressRow[] = ['theory', 'ido', 'wedo', 'youdo'].map((subStep) => ({
      userId: 'u2',
      sectionId: 'setup',
      subStep,
      completed: true,
      completedAt: NOW.toISOString(),
    }))
    const [m] = buildStudentMetrics([u], progress, [], {}, NOW)
    assert.equal(m!.sectionsStarted, 1)
    assert.equal(m!.sectionsCompleted, 0)

    progress.push({
      userId: 'u2',
      sectionId: 'setup',
      subStep: 'quiz',
      completed: true,
      completedAt: NOW.toISOString(),
    })
    const [m2] = buildStudentMetrics([u], progress, [], {}, NOW)
    assert.equal(m2!.sectionsCompleted, 1)
  })

  it('best score uses max; incomplete exams ignored', () => {
    const u = user({ id: 'u3', createdAt: NOW.toISOString() })
    const exams: ExamRow[] = [
      {
        userId: 'u3',
        sectionId: 'setup',
        score: 40,
        completedAt: NOW.toISOString(),
        ...GRADED_NOW,
      },
      {
        userId: 'u3',
        sectionId: 'setup',
        score: 85,
        completedAt: NOW.toISOString(),
        ...GRADED_NOW,
      },
      {
        userId: 'u3',
        sectionId: 'setup',
        score: 99,
        completedAt: null, // incomplete
        ...GRADED_NOW,
      },
    ]
    const [m] = buildStudentMetrics([u], [], exams, {}, NOW)
    assert.equal(m!.avgBestScore, 85)
    assert.equal(m!.examAttemptsCount, 2)
    assert.equal(m!.hasPassedExam, true)
    assert.equal(m!.bestScoresBySection.setup, 85)
  })

  it('pass threshold boundary 70', () => {
    const u = user({ id: 'u4', createdAt: NOW.toISOString() })
    const exams: ExamRow[] = [
      {
        userId: 'u4',
        sectionId: 'setup',
        score: PASS_THRESHOLD,
        completedAt: NOW.toISOString(),
        ...GRADED_NOW,
      },
    ]
    const [m] = buildStudentMetrics([u], [], exams, {}, NOW)
    assert.equal(m!.hasPassedExam, true)
  })

  it('scores that are not evidence count as activity but never as a score (D12)', () => {
    const u = user({ id: 'u9', createdAt: NOW.toISOString() })
    const at = (score: number, grading: Partial<ExamRow>): ExamRow => ({
      userId: 'u9', sectionId: 'setup', score, completedAt: NOW.toISOString(), timeSpentSec: 60, ...grading,
    })
    const exams: ExamRow[] = [
      at(100, { gradingVersion: 0, exposedItems: 0 }), // graded before the fix: may be forged
      at(95, { gradingVersion: 1, exposedItems: 3 }), // on questions whose key was seen
      at(100, {}), // a caller that did not select the grading fields
      at(55, GRADED_NOW),
    ]
    const [m] = buildStudentMetrics([u], [], exams, {}, NOW)
    assert.equal(m!.bestScoresBySection.setup, 55)
    assert.equal(m!.avgExamScore, 55)
    assert.equal(m!.hasPassedExam, false)
    assert.equal(m!.examAttemptsCount, 4)
    assert.equal(m!.totalTimeSpentSec, 240)

    const payload = buildAnalyticsPayload([m!], [], exams, [u], { now: NOW })
    const setup = payload.sections.find((x) => x.sectionId === 'setup')!
    assert.equal(setup.avgBestScore, 55)
    assert.equal(setup.attemptCount, 4)
    assert.equal(payload.kpis.passRate, 0)
    assert.equal(payload.kpis.totalExamAttempts, 4)
  })

  it('inactive 14d with prior activity → inactive risk', () => {
    const u = user({ id: 'u5', createdAt: '2026-06-01T00:00:00.000Z' })
    const progress: ProgressRow[] = [
      {
        userId: 'u5',
        sectionId: 'setup',
        subStep: 'theory',
        completed: true,
        completedAt: '2026-06-20T00:00:00.000Z', // >14d before NOW
      },
    ]
    const [m] = buildStudentMetrics([u], progress, [], {}, NOW)
    assert.equal(m!.risk, 'inactive')
  })

  it('does not count incomplete progress rows as started', () => {
    const u = user({ id: 'u6', createdAt: NOW.toISOString() })
    const progress: ProgressRow[] = [
      {
        userId: 'u6',
        sectionId: 'setup',
        subStep: 'theory',
        completed: false,
        completedAt: null,
      },
    ]
    const [m] = buildStudentMetrics([u], progress, [], {}, NOW)
    assert.equal(m!.sectionsStarted, 0)
  })

  it('exercise count defaults to 0 for missing user', () => {
    const u = user({ id: 'u7', createdAt: NOW.toISOString() })
    const [m] = buildStudentMetrics([u], [], [], { other: 9 }, NOW)
    assert.equal(m!.exercisesAttempted, 0)
  })
})

describe('buildAnalyticsPayload', () => {
  it('handles zero students without NaN KPIs', () => {
    const payload = buildAnalyticsPayload([], [], [], [], { now: NOW })
    assert.equal(payload.kpis.totalStudents, 0)
    assert.equal(payload.kpis.avgCompletionPct, 0)
    assert.equal(payload.kpis.passRate, 0)
    assert.equal(payload.funnel.registered, 0)
    assert.ok(payload.timeseries.length === 30)
    assert.ok(payload.scoreHistogram.length === 10)
  })

  it('score histogram buckets 100 into last bin', () => {
    const u = user({ id: 'u8', createdAt: NOW.toISOString() })
    const exams: ExamRow[] = [
      {
        userId: 'u8',
        sectionId: 'setup',
        score: 100,
        completedAt: NOW.toISOString(),
        ...GRADED_NOW,
      },
    ]
    const students = buildStudentMetrics([u], [], exams, {}, NOW)
    const payload = buildAnalyticsPayload(students, [], exams, [u], { now: NOW })
    const last = payload.scoreHistogram[payload.scoreHistogram.length - 1]!
    assert.equal(last.bucket, '90-100')
    assert.equal(last.count, 1)
  })

  it('the phase breakdown files a phase 0 section under band 1', () => {
    // `basics` is phase 0. Before the fix the breakdown matched raw phases 1 to 3 only, so a
    // learner who finished a phase 0 section counted in no band at all.
    const u = user({ id: 'u10', createdAt: NOW.toISOString() })
    const progress: ProgressRow[] = [
      { userId: 'u10', sectionId: 'basics', subStep: 'theory', completed: true, completedAt: NOW.toISOString() },
    ]
    const students = buildStudentMetrics([u], progress, [], {}, NOW)
    const payload = buildAnalyticsPayload(students, progress, [], [u], { now: NOW })
    const band1 = payload.phaseBreakdown.find((b) => b.phase === 1)
    assert.equal(band1?.started, 1)
  })
})
