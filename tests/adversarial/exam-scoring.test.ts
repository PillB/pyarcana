/**
 * Adversarial unit tests — exam scoring & submit schema.
 * Targets: empty answers, OOR indices, missing questions, NaN, state corruption.
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  PASS_THRESHOLD,
  bestScoreBySection,
  examSubmitSchema,
  gradeExamAnswers,
} from '../../src/lib/exam-scoring.ts'

const bank = new Map([
  [
    'q1',
    {
      id: 'q1',
      concept: 'venv',
      variant: 0,
      correctIndex: 1,
      options: JSON.stringify(['a', 'b', 'c', 'd']),
    },
  ],
  [
    'q2',
    {
      id: 'q2',
      concept: 'git',
      variant: 1,
      correctIndex: 0,
      options: ['yes', 'no'],
    },
  ],
])

describe('examSubmitSchema', () => {
  it('rejects empty answers (prevents divide-by-zero score)', () => {
    const r = examSubmitSchema.safeParse({
      attemptId: 'a1',
      answers: [],
      timeSpentSec: 10,
    })
    assert.equal(r.success, false)
  })

  it('rejects missing attemptId and negative time', () => {
    assert.equal(
      examSubmitSchema.safeParse({
        attemptId: '',
        answers: [{ questionId: 'q1', selectedIndex: 0 }],
        timeSpentSec: 0,
      }).success,
      false
    )
    assert.equal(
      examSubmitSchema.safeParse({
        attemptId: 'a1',
        answers: [{ questionId: 'q1', selectedIndex: 0 }],
        timeSpentSec: -1,
      }).success,
      false
    )
  })

  it('rejects selectedIndex above hard max and non-int', () => {
    assert.equal(
      examSubmitSchema.safeParse({
        attemptId: 'a1',
        answers: [{ questionId: 'q1', selectedIndex: 99 }],
        timeSpentSec: 1,
      }).success,
      false
    )
    assert.equal(
      examSubmitSchema.safeParse({
        attemptId: 'a1',
        answers: [{ questionId: 'q1', selectedIndex: 1.5 }],
        timeSpentSec: 1,
      }).success,
      false
    )
  })

  it('rejects timeSpentSec above 3600 (resource bound)', () => {
    assert.equal(
      examSubmitSchema.safeParse({
        attemptId: 'a1',
        answers: [{ questionId: 'q1', selectedIndex: 0 }],
        timeSpentSec: 3601,
      }).success,
      false
    )
  })

  it('accepts boundary valid payload', () => {
    const r = examSubmitSchema.safeParse({
      attemptId: 'a1',
      answers: [{ questionId: 'q1', selectedIndex: 0 }],
      timeSpentSec: 3600,
    })
    assert.equal(r.success, true)
  })

  it('rejects more than 100 answers (resource exhaustion)', () => {
    const answers = Array.from({ length: 101 }, (_, i) => ({
      questionId: `q${i}`,
      selectedIndex: 0,
    }))
    assert.equal(
      examSubmitSchema.safeParse({
        attemptId: 'a1',
        answers,
        timeSpentSec: 1,
      }).success,
      false
    )
  })
})

describe('gradeExamAnswers', () => {
  it('scores perfect and partial correctly', () => {
    const perfect = gradeExamAnswers(
      [
        { questionId: 'q1', selectedIndex: 1 },
        { questionId: 'q2', selectedIndex: 0 },
      ],
      bank
    )
    assert.equal(perfect.score, 100)
    assert.equal(perfect.passed, true)
    assert.equal(perfect.correctCount, 2)

    const half = gradeExamAnswers(
      [
        { questionId: 'q1', selectedIndex: 1 },
        { questionId: 'q2', selectedIndex: 1 },
      ],
      bank
    )
    assert.equal(half.score, 50)
    assert.equal(half.passed, false)
  })

  it('treats missing questions as incorrect (no throw)', () => {
    const r = gradeExamAnswers([{ questionId: 'ghost', selectedIndex: 0 }], bank)
    assert.equal(r.score, 0)
    assert.equal(r.detailedAnswers[0]!.correct, false)
    assert.equal(r.detailedAnswers[0]!.correctIndex, -1)
  })

  it('OOR selectedIndex vs options length is wrong even if equals correctIndex', () => {
    // correctIndex 1 but only 1 option → cannot be correct
    const tiny = new Map([
      [
        't',
        {
          id: 't',
          correctIndex: 1,
          options: JSON.stringify(['only']),
        },
      ],
    ])
    const r = gradeExamAnswers([{ questionId: 't', selectedIndex: 1 }], tiny)
    assert.equal(r.detailedAnswers[0]!.correct, false)
  })

  it('malformed options JSON does not throw; still grades by index', () => {
    const bad = new Map([
      ['b', { id: 'b', correctIndex: 0, options: '{not-json' }],
    ])
    const r = gradeExamAnswers([{ questionId: 'b', selectedIndex: 0 }], bad)
    assert.equal(r.detailedAnswers[0]!.correct, true)
    assert.equal(r.score, 100)
  })

  it('empty answers array returns score 0 not NaN (defense in depth)', () => {
    const r = gradeExamAnswers([], bank)
    assert.equal(r.score, 0)
    assert.equal(Number.isFinite(r.score), true)
    assert.equal(r.passed, false)
  })

  it('pass threshold is 70 inclusive', () => {
    // 7/10 = 70
    const answers = Array.from({ length: 10 }, (_, i) => ({
      questionId: `q${i}`,
      selectedIndex: i < 7 ? 0 : 1,
    }))
    const map = new Map(
      answers.map((a) => [
        a.questionId,
        { id: a.questionId, correctIndex: 0, options: ['a', 'b'] },
      ])
    )
    const r = gradeExamAnswers(answers, map)
    assert.equal(r.score, 70)
    assert.equal(r.passed, true)
    assert.equal(PASS_THRESHOLD, 70)
  })

  it('accepts plain object bank (not only Map)', () => {
    const r = gradeExamAnswers(
      [{ questionId: 'q1', selectedIndex: 1 }],
      { q1: { id: 'q1', correctIndex: 1, options: ['a', 'b'] } }
    )
    assert.equal(r.score, 100)
  })
})

describe('bestScoreBySection', () => {
  it('keeps max score and ignores invalid rows', () => {
    const best = bestScoreBySection([
      { sectionId: 'setup', score: 40 },
      { sectionId: 'setup', score: 90 },
      { sectionId: 'setup', score: 70 },
      { sectionId: 'numpy', score: null },
      { sectionId: 'numpy', score: Number.NaN },
      { sectionId: '', score: 100 },
      { sectionId: 'numpy', score: 150 }, // clamp to 100
      { sectionId: 'numpy', score: -5 },
    ])
    assert.equal(best.setup, 90)
    assert.equal(best.numpy, 100)
    assert.equal(best[''], undefined)
  })
})
