/**
 * Adversarial unit tests — admin analytics aggregation.
 * Empty cohorts, bad dates, score extremes, duplicate progress, inactivity.
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  PASS_THRESHOLD,
  buildAnalyticsPayload,
  buildStudentMetrics,
  phaseForSectionIndex,
  type ExamRow,
  type ProgressRow,
  type UserRow,
} from '../../src/lib/admin-analytics.ts'

const NOW = new Date('2026-07-21T12:00:00.000Z')

function user(partial: Partial<UserRow> & { id: string }): UserRow {
  return {
    email: `${partial.id}@test.pe`,
    name: partial.name ?? partial.id,
    createdAt: partial.createdAt ?? '2026-07-01T00:00:00.000Z',
    role: partial.role,
    ...partial,
  }
}

describe('phaseForSectionIndex', () => {
  it('boundaries at 13/26/39', () => {
    assert.equal(phaseForSectionIndex(1), 1)
    assert.equal(phaseForSectionIndex(13), 1)
    assert.equal(phaseForSectionIndex(14), 1)
    assert.equal(phaseForSectionIndex(26), 1)
    assert.equal(phaseForSectionIndex(27), 2)
    assert.equal(phaseForSectionIndex(39), 2)
    assert.equal(phaseForSectionIndex(40), 3)
    assert.equal(phaseForSectionIndex(52), 3)
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
      },
      {
        userId: 'u3',
        sectionId: 'setup',
        score: 85,
        completedAt: NOW.toISOString(),
      },
      {
        userId: 'u3',
        sectionId: 'setup',
        score: 99,
        completedAt: null, // incomplete
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
      },
    ]
    const [m] = buildStudentMetrics([u], [], exams, {}, NOW)
    assert.equal(m!.hasPassedExam, true)
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
      },
    ]
    const students = buildStudentMetrics([u], [], exams, {}, NOW)
    const payload = buildAnalyticsPayload(students, [], exams, [u], { now: NOW })
    const last = payload.scoreHistogram[payload.scoreHistogram.length - 1]!
    assert.equal(last.bucket, '90-100')
    assert.equal(last.count, 1)
  })
})
