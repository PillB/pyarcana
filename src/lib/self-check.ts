/**
 * The self-check ("Autocheck") at the end of each section: how its options are ordered, how an
 * attempt is graded, and when the key is shown.
 *
 * The self-check unlocks the next section at SELF_CHECK_PASS_PCT, with unlimited retries. It used
 * to show every option in authored order, and to mark every question right or wrong after every
 * attempt, with the correct option highlighted. So a learner could pass by elimination without
 * learning anything: answer, read which options were wrong, answer again. With four options that
 * takes at most three retries, and the keys also sat in a repeating pattern of positions per
 * section. Owner ruling, 2026-10-12: shuffle the options on every attempt, and show the key, the
 * marks and the explanations only once an attempt reaches the pass mark. Below it, the score.
 *
 * What this does not change: on the static site the questions and their keys ship in the
 * JavaScript bundle, so a learner who reads the bundle can still find them. And the score is
 * itself a signal: changing one answer and watching the score move reveals that answer, at the
 * cost of many more attempts (tests/adversarial/self-check-feedback.test.ts measures how many).
 */
import type { QuizQuestion } from './types'

/** The score, in percent, that completes the step and shows the key. */
export const SELF_CHECK_PASS_PCT = 70

/** An integer in [0, n). Math.random is enough here: the key is in the bundle anyway. */
export type Rng = (n: number) => number

export const mathRandomInt: Rng = (n) => Math.floor(Math.random() * n)

/** A uniformly random permutation of 0..n-1 (Fisher–Yates; `j` drawn from [0, i]). */
export function shuffledOrder(n: number, rng: Rng): number[] {
  const order = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) {
    const j = rng(i + 1)
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order
}

/** One display order per question: `orders[q][displayed] = authored option index`. */
export function optionOrders(questions: QuizQuestion[], rng: Rng): number[][] {
  return questions.map((q) => shuffledOrder(q.options.length, rng))
}

/** The authored order, used for the first render so the static HTML and hydration agree. */
export function authoredOrders(questions: QuizQuestion[]): number[][] {
  return questions.map((q) => q.options.map((_, i) => i))
}

/**
 * Answers are kept as AUTHORED option indexes, so grading never depends on the display order.
 * `answers[q]` is the authored index of the option chosen for question q.
 */
export function gradeSelfCheck(
  questions: QuizQuestion[],
  answers: Record<number, number>
): { correct: number; total: number; pct: number } {
  const total = questions.length
  const correct = questions.reduce((acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0), 0)
  return { correct, total, pct: total > 0 ? Math.round((correct / total) * 100) : 0 }
}

/** Whether a submitted attempt shows the key, the right/wrong marks and the explanations. */
export function revealsKey(pct: number): boolean {
  return pct >= SELF_CHECK_PASS_PCT
}
