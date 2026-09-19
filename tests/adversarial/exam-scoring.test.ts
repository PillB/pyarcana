/**
 * Adversarial unit tests — exam scoring & submit schema.
 * Targets: empty answers, OOR indices, missing questions, NaN, state corruption.
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  EXAM_TIME_LIMIT_SEC,
  GRADED_AS_EVIDENCE,
  GRADING_VERSION,
  PASS_THRESHOLD,
  UNANSWERED,
  bestScoreBySection,
  checkAnswersAgainstDraw,
  countedAttempts,
  examSubmitSchema,
  expiredAttemptClosure,
  gradeExamAnswers,
  isLegacyAttempt,
  nextAttemptNumber,
  parseFormItems,
  parseVariantSeed,
  redactAttemptsForLearner,
  submissionDeadline,
  toFormItem,
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
      bank,
      ['q1', 'q2']
    )
    assert.equal(perfect.score, 100)
    assert.equal(perfect.passed, true)
    assert.equal(perfect.correctCount, 2)

    const half = gradeExamAnswers(
      [
        { questionId: 'q1', selectedIndex: 1 },
        { questionId: 'q2', selectedIndex: 1 },
      ],
      bank,
      ['q1', 'q2']
    )
    assert.equal(half.score, 50)
    assert.equal(half.passed, false)
  })

  it('treats missing questions as incorrect (no throw)', () => {
    const r = gradeExamAnswers([{ questionId: 'ghost', selectedIndex: 0 }], bank, ['ghost'])
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
    const r = gradeExamAnswers([{ questionId: 't', selectedIndex: 1 }], tiny, ['t'])
    assert.equal(r.detailedAnswers[0]!.correct, false)
  })

  it('malformed options JSON does not throw; still grades by index', () => {
    const bad = new Map([
      ['b', { id: 'b', correctIndex: 0, options: '{not-json' }],
    ])
    const r = gradeExamAnswers([{ questionId: 'b', selectedIndex: 0 }], bad, ['b'])
    assert.equal(r.detailedAnswers[0]!.correct, true)
    assert.equal(r.score, 100)
  })

  it('empty answers array returns score 0 not NaN (defense in depth)', () => {
    const r = gradeExamAnswers([], bank, [])
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
    const r = gradeExamAnswers(answers, map, answers.map((a) => a.questionId))
    assert.equal(r.score, 70)
    assert.equal(r.passed, true)
    assert.equal(PASS_THRESHOLD, 70)
  })

  it('accepts plain object bank (not only Map)', () => {
    const r = gradeExamAnswers(
      [{ questionId: 'q1', selectedIndex: 1 }],
      { q1: { id: 'q1', correctIndex: 1, options: ['a', 'b'] } },
      ['q1']
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

// An eight-concept section, as exam/start draws it: one variant per concept. `other` is a second
// section's bank, answered correctly, to stand in for questions the attempt never drew.
const drawnBank = new Map(
  Array.from({ length: 8 }, (_, i) => [
    `setup-${i}`,
    { id: `setup-${i}`, concept: `c${i}`, variant: 1, correctIndex: i % 4, options: ['a', 'b', 'c', 'd'], explanation: `e${i}` },
  ])
)
const drawnIds = [...drawnBank.keys()]
const other = new Map(
  Array.from({ length: 8 }, (_, i) => [
    `basics-${i}`,
    { id: `basics-${i}`, concept: `b${i}`, variant: 1, correctIndex: 0, options: ['a', 'b', 'c', 'd'] },
  ])
)
const bothBanks = new Map([...drawnBank, ...other])
const right = (id: string) => ({ questionId: id, selectedIndex: bothBanks.get(id)!.correctIndex })

describe('gradeExamAnswers — scored over the questions drawn, not the answers sent', () => {
  it('one correct answer out of eight drawn scores 13%, not 100%', () => {
    const r = gradeExamAnswers([right('setup-3')], drawnBank, drawnIds)
    assert.equal(r.totalQuestions, 8)
    assert.equal(r.correctCount, 1)
    assert.equal(r.score, 13)
    assert.equal(r.passed, false)
    // The seven it skipped are graded, as unanswered and wrong.
    assert.equal(r.detailedAnswers.length, 8)
    const skipped = r.detailedAnswers.filter((a) => a.questionId !== 'setup-3')
    assert.ok(skipped.every((a) => a.selectedIndex === UNANSWERED && a.correct === false))
  })

  it('answers to questions from another section earn nothing', () => {
    const foreign = [...other.keys()].map(right)
    const r = gradeExamAnswers(foreign, bothBanks, drawnIds)
    assert.equal(r.correctCount, 0)
    assert.equal(r.score, 0)
    assert.ok(r.detailedAnswers.every((a) => a.questionId.startsWith('setup-')))
  })

  it('repeating one correct answer eight times counts it once', () => {
    const r = gradeExamAnswers(Array(8).fill(right('setup-0')), drawnBank, drawnIds)
    assert.equal(r.correctCount, 1)
    assert.equal(r.score, 13)
  })

  it('a later wrong copy of an answer does not replace the first', () => {
    const r = gradeExamAnswers(
      [right('setup-1'), { questionId: 'setup-1', selectedIndex: 3 }],
      drawnBank,
      drawnIds
    )
    assert.equal(r.detailedAnswers.find((a) => a.questionId === 'setup-1')!.correct, true)
  })

  it('a full, honest submission grades as before, in the order it was answered', () => {
    // Answered in the shuffled order the learner saw; six right, two wrong.
    const order = ['setup-5', 'setup-2', 'setup-7', 'setup-0', 'setup-6', 'setup-1', 'setup-4', 'setup-3']
    const answers = order.map((id, n) =>
      n < 6 ? right(id) : { questionId: id, selectedIndex: (drawnBank.get(id)!.correctIndex + 1) % 4 }
    )
    const r = gradeExamAnswers(answers, drawnBank, drawnIds)
    assert.equal(r.totalQuestions, 8)
    assert.equal(r.correctCount, 6)
    assert.equal(r.score, 75)
    assert.equal(r.passed, true)
    assert.deepEqual(r.detailedAnswers.map((a) => a.questionId), order)
    assert.deepEqual(r.detailedAnswers.map((a) => a.correct), [true, true, true, true, true, true, false, false])
    // What is stored keeps the key; the route decides what the learner sees.
    assert.equal(r.detailedAnswers[0]!.correctIndex, drawnBank.get('setup-5')!.correctIndex)
    assert.equal(r.detailedAnswers[0]!.explanation, 'e5')
  })
})

describe('checkAnswersAgainstDraw', () => {
  it('rejects a question the attempt did not draw', () => {
    assert.deepEqual(checkAnswersAgainstDraw([right('setup-0'), right('basics-0')], drawnIds), {
      ok: false,
      reason: 'not-drawn',
      questionId: 'basics-0',
    })
  })

  it('rejects the same question answered twice', () => {
    assert.deepEqual(checkAnswersAgainstDraw([right('setup-0'), right('setup-0')], drawnIds), {
      ok: false,
      reason: 'duplicate',
      questionId: 'setup-0',
    })
  })

  it('accepts a partial submission of drawn questions', () => {
    assert.deepEqual(checkAnswersAgainstDraw([right('setup-4')], drawnIds), { ok: true })
  })
})

describe('parseVariantSeed — an unreadable draw is not gradable', () => {
  it('reads the seed exam/start writes', () => {
    const seed = JSON.stringify([
      { concept: 'venv', variant: 2, questionId: 'q1' },
      { concept: 'git', variant: 1, questionId: 'q2' },
    ])
    assert.deepEqual(parseVariantSeed(seed)?.map((d) => d.questionId), ['q1', 'q2'])
  })

  it('returns null for malformed, empty, id-less or repeated seeds', () => {
    assert.equal(parseVariantSeed('{not json'), null)
    assert.equal(parseVariantSeed('[]'), null)
    assert.equal(parseVariantSeed('{"questionId":"q1"}'), null)
    assert.equal(parseVariantSeed(JSON.stringify([{ concept: 'venv', variant: 1 }])), null)
    assert.equal(
      parseVariantSeed(JSON.stringify([{ questionId: 'q1' }, { questionId: 'q1' }])),
      null
    )
  })
})

describe('the answer key never reaches a learner', () => {
  const stored = JSON.stringify([
    { questionId: 'setup-0', concept: 'c0', variant: 1, selectedIndex: 1, correctIndex: 0, correct: false, explanation: 'e0', question: 'Q', options: ['a', 'b'] },
  ])
  const row = (id: string, completedAt: string | null, gradingVersion = GRADING_VERSION) =>
    ({ id, sectionId: 'setup', completedAt, gradingVersion, answers: stored })
  const done = '2026-09-18T10:00:00.000Z'

  it('strips the key and explanation from every attempt, the last one included', () => {
    const rows = redactAttemptsForLearner([row('a1', done), row('a2', done), row('a3', done)])
    for (const r of rows) {
      const [a] = JSON.parse(r.answers)
      assert.equal('correctIndex' in a, false)
      assert.equal('explanation' in a, false)
      assert.deepEqual([a.selectedIndex, a.correct, a.question], [1, false, 'Q'])
    }
  })

  it('turns unreadable stored answers into an empty list rather than passing them through', () => {
    const [r] = redactAttemptsForLearner([{ ...row('a1', null), answers: '{"correctIndex":0' }])
    assert.equal(r!.answers, '[]')
  })

  it('flags attempts graded before the fix, and only those', () => {
    const rows = redactAttemptsForLearner([row('old', done, 0), row('new', done), row('open', null, 0)])
    assert.deepEqual(rows.map((r) => r.legacy), [true, false, false])
  })
})

describe('attempts graded before the fix', () => {
  const done = '2026-09-18T10:00:00.000Z'

  it('a completed attempt without a grading version is legacy; an open one is not', () => {
    assert.equal(isLegacyAttempt({ completedAt: done, gradingVersion: 0 }), true)
    assert.equal(isLegacyAttempt({ completedAt: done }), true)
    assert.equal(isLegacyAttempt({ completedAt: done, gradingVersion: GRADING_VERSION }), false)
    // Started before the fix and still open: the current code will grade it.
    assert.equal(isLegacyAttempt({ completedAt: null, gradingVersion: 0 }), false)
  })

  it('legacy attempts do not use up an attempt, and new numbers follow all of them', () => {
    const attempts = [
      { attemptNumber: 1, completedAt: done, gradingVersion: 0 },
      { attemptNumber: 2, completedAt: done, gradingVersion: 0 },
      { attemptNumber: 3, completedAt: done, gradingVersion: 0 },
      { attemptNumber: 4, completedAt: done, gradingVersion: GRADING_VERSION },
    ]
    assert.equal(countedAttempts(attempts).length, 1)
    assert.equal(nextAttemptNumber(attempts), 5)
    assert.equal(nextAttemptNumber([]), 1)
  })

  it('the evidence filter admits only the current grading', () => {
    assert.deepEqual(GRADED_AS_EVIDENCE, { gradingVersion: { gte: 1 } })
  })
})

describe('time limit', () => {
  const start = new Date('2026-09-18T10:00:00.000Z')

  it('refuses submissions after 60 minutes plus a 2-minute grace for the request', () => {
    assert.equal(EXAM_TIME_LIMIT_SEC, 3600)
    assert.equal(submissionDeadline(start).toISOString(), '2026-09-18T11:02:00.000Z')
  })

  it('closes an expired attempt at the end of its hour, with 0 and nothing answered, as graded now', () => {
    const c = expiredAttemptClosure(start)
    assert.equal(c.completedAt.toISOString(), '2026-09-18T11:00:00.000Z')
    assert.deepEqual([c.score, c.answers, c.timeSpentSec, c.gradingVersion], [0, '[]', 3600, GRADING_VERSION])
  })
})

describe('attempt form — the questions as shown, with their key', () => {
  const q = { id: 'q1', concept: 'venv', variant: 2, question: '¿Q?', options: '["a","b","c"]', correctIndex: 2, explanation: 'porque' }

  it('round-trips a bank row into the key submit grades against', () => {
    const key = parseFormItems(JSON.stringify([toFormItem(q)]))!
    assert.deepEqual(key.get('q1'), {
      id: 'q1', concept: 'venv', variant: 2, correctIndex: 2, explanation: 'porque', question: '¿Q?', options: ['a', 'b', 'c'],
    })
    const r = gradeExamAnswers([{ questionId: 'q1', selectedIndex: 2 }], key, ['q1'])
    assert.equal(r.score, 100)
  })

  it('returns null for a form that cannot be read, rather than an empty key', () => {
    assert.equal(parseFormItems('not json'), null)
    assert.equal(parseFormItems('[]'), null)
    assert.equal(parseFormItems(JSON.stringify([{ questionId: 'q1' }])), null)
    assert.equal(parseFormItems(JSON.stringify([{ questionId: 'q1', correctIndex: '0' }])), null)
  })
})
