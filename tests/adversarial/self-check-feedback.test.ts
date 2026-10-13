/**
 * Contract: the self-check cannot be passed by elimination.
 *
 * Each section's self-check unlocks the next one at 70%, with unlimited retries. It used to mark
 * every question right or wrong after every attempt and highlight the correct option, so a learner
 * who remembered which options had been wrong passed without learning anything: with four options,
 * within three retries, every time. Owner ruling, 2026-10-12: shuffle the options on every attempt,
 * and show the key, the marks and the explanations only once an attempt reaches 70%.
 *
 * The simulation below plays that learner against every section's real self-check, through the
 * same `revealsKey` the component uses to decide what to show. It recreates the old leak (marks
 * after every attempt: passed within three retries) and measures what remains under the rule
 * (only the score below 70%: a learner can still use it as an oracle, changing one answer at a
 * time, but it costs many more attempts - reported, not hidden).
 *
 * Run: node --import tsx --test tests/adversarial/self-check-feedback.test.ts
 */
import assert from 'node:assert/strict'
import test from 'node:test'

import { COURSE_SECTIONS } from '../../src/lib/course'
import {
  SELF_CHECK_PASS_PCT,
  authoredOrders,
  gradeSelfCheck,
  optionOrders,
  revealsKey,
  shuffledOrder,
  type Rng,
} from '../../src/lib/self-check'
import type { QuizQuestion } from '../../src/lib/types'

/** What a submitted attempt shows: every question's mark, or only the score. */
type Feedback = 'marks' | 'score'
type Policy = (pct: number) => Feedback

/** The rule the component follows. */
const RULE: Policy = (pct) => (revealsKey(pct) ? 'marks' : 'score')
/** The old behaviour: marks after every attempt. */
const ALWAYS_MARKS: Policy = () => 'marks'

/**
 * A learner who knows nothing and remembers everything: which options were marked wrong, and the
 * score each attempt got. Options are tracked by authored index, which stands for "the option with
 * this text": the shuffle moves options around, not the learner's memory of them.
 * Returns the number of attempts it took to reach the pass mark.
 */
function eliminationLearner(questions: QuizQuestion[], policy: Policy): number {
  const choice = questions.map(() => 0)
  const settled = questions.map(() => false)
  let attempts = 0
  let lastCorrect = -1
  let probing: { q: number; previous: number } | null = null
  for (;;) {
    attempts += 1
    const answers = Object.fromEntries(choice.map((c, i) => [i, c]))
    const { correct, pct } = gradeSelfCheck(questions, answers)
    if (pct >= SELF_CHECK_PASS_PCT) return attempts
    if (attempts > 500) throw new Error('the learner never passed')
    if (policy(pct) === 'marks') {
      questions.forEach((q, i) => {
        if (choice[i] === q.correctIndex) settled[i] = true
        else choice[i] += 1
      })
      continue
    }
    // Score only: read the last probe from the score, then probe the next unsettled question.
    if (probing) {
      if (correct > lastCorrect) settled[probing.q] = true
      else if (correct < lastCorrect) {
        choice[probing.q] = probing.previous
        settled[probing.q] = true
      }
    }
    lastCorrect = correct
    const q = settled.findIndex((s) => !s)
    probing = { q, previous: choice[q] }
    choice[q] += 1
    if (choice[q] === questions[q].options.length - 1) settled[q] = true // the last one left is right
  }
}

const SECTIONS = COURSE_SECTIONS.filter((s) => s.selfCheck.questions.length > 0)

test('the old behaviour, recreated: with marks after every attempt, elimination passes every section within three retries', () => {
  const slow = SECTIONS.map((s) => [s.id, eliminationLearner(s.selfCheck.questions, ALWAYS_MARKS)] as const)
    .filter(([, attempts]) => attempts > 4)
  assert.deepEqual(slow, [], 'the recreation no longer reproduces the leak')
})

test('under the rule, only the score shows below 70%, and elimination costs many more attempts', () => {
  const attempts = SECTIONS.map((s) => eliminationLearner(s.selfCheck.questions, RULE))
  const mean = attempts.reduce((a, b) => a + b, 0) / attempts.length
  const marks = SECTIONS.map((s) => eliminationLearner(s.selfCheck.questions, ALWAYS_MARKS))
  const meanMarks = marks.reduce((a, b) => a + b, 0) / marks.length
  // Measured 2026-10-12 over the 52 sections; the assertion is the plan's bound, the numbers are the record.
  assert.ok(mean - 1 > 3, `elimination now passes in ${mean.toFixed(1)} attempts on average (${(mean - 1).toFixed(1)} retries)`)
  assert.ok(mean > 2 * meanMarks, `score-only ${mean.toFixed(1)} vs marks ${meanMarks.toFixed(1)} attempts`)
  console.log(`elimination: ${meanMarks.toFixed(1)} attempts with marks, ${mean.toFixed(1)} with the score only`)
})

test('the key shows exactly from the pass mark', () => {
  assert.equal(revealsKey(SELF_CHECK_PASS_PCT - 1), false)
  assert.equal(revealsKey(SELF_CHECK_PASS_PCT), true)
  assert.equal(SELF_CHECK_PASS_PCT, 70)
})

test('grading reads authored option indexes, so the display order cannot change a score', () => {
  const q: QuizQuestion = { question: '¿?', options: ['a', 'b', 'c', 'd'], correctIndex: 2, explanation: 'x' }
  assert.deepEqual(gradeSelfCheck([q], { 0: 2 }), { correct: 1, total: 1, pct: 100 })
  assert.deepEqual(gradeSelfCheck([q], { 0: 0 }), { correct: 0, total: 1, pct: 0 })
  assert.deepEqual(gradeSelfCheck([q], {}), { correct: 0, total: 1, pct: 0 })
})

test('shuffledOrder draws every permutation exactly once over every possible sequence of draws', () => {
  for (let n = 1; n <= 5; n++) {
    const seen = new Map<string, number>()
    const bounds = new Set<string>()
    const enumerate = (prefix: number[]): void => {
      const calls: number[] = []
      let k = 0
      const rng: Rng = (m) => {
        calls.push(m)
        const v = prefix[k++]
        return v === undefined ? 0 : v
      }
      const order = shuffledOrder(n, rng)
      if (k > prefix.length) {
        // Branch on the first draw this prefix did not fix, over every value it can take.
        for (let v = 0; v < calls[prefix.length]; v++) enumerate([...prefix, v])
        return
      }
      bounds.add(calls.join(','))
      seen.set(order.join(','), (seen.get(order.join(',')) ?? 0) + 1)
    }
    enumerate([])
    const factorial = Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a * b, 1)
    assert.equal(seen.size, factorial, `n=${n}: not every permutation is reachable`)
    assert.ok([...seen.values()].every((c) => c === 1), `n=${n}: some permutation is drawn more often`)
    assert.deepEqual([...bounds], [Array.from({ length: n - 1 }, (_, i) => n - i).join(',')], `n=${n}: wrong draw bounds`)
  }
})

test('the first render keeps the authored order (so the static HTML and hydration agree); later ones shuffle', () => {
  const questions = SECTIONS[0].selfCheck.questions
  assert.deepEqual(authoredOrders(questions), questions.map((q) => q.options.map((_, i) => i)))
  let calls = 0
  // A draw of 0 swaps each position with the first: never the identity for two or more options.
  const orders = optionOrders(questions, () => { calls += 1; return 0 })
  assert.ok(calls > 0)
  assert.ok(orders.some((o, i) => o.join() !== authoredOrders(questions)[i].join()), 'optionOrders did not reorder anything')
})
