/**
 * How exam/start draws an attempt: which variant of each concept, and in what order. The
 * randomness is a parameter, `rng(n)`, an integer in [0, n): exam/start passes secureRandomInt
 * (exam-rng.ts), and the tests pass a replay or a seeded generator so a draw can be enumerated or
 * repeated.
 */
import type { ExamAttempt, QuestionBank } from '@prisma/client'
import { itemKey } from './exam-scoring'

/** An integer in [0, n), every value equally likely. */
export type Rng = (n: number) => number

/**
 * A uniformly random order of 0..n-1: the Fisher–Yates shuffle (Durstenfeld's form), which makes
 * each of the n! orders equally likely when rng is uniform. Each step draws j from [0, i]
 * inclusive. Drawing it from [0, i) instead (Sattolo) reaches only the (n-1)! cyclic orders, and
 * drawing it from [0, n) at every step gives n^(n-1) equally likely runs, which cannot spread
 * evenly over n! orders.
 */
export function shuffledOrder(n: number, rng: Rng): number[] {
  const order = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) {
    const j = rng(i + 1)
    ;[order[i], order[j]] = [order[j]!, order[i]!]
  }
  return order
}

/**
 * One question per concept, in shuffled order. Per concept it prefers, in turn: a variant whose key
 * the learner never saw and that no earlier attempt drew; one whose key they never saw; one no
 * earlier attempt drew; any. A key seen before the fix is worse than a variant met again without
 * it, so reuse comes before exposure.
 */
export function drawOnePerConcept(
  allQuestions: QuestionBank[],
  earlier: ReadonlyArray<Pick<ExamAttempt, 'variantSeed'>>,
  seenKeys: Set<string>,
  rng: Rng
) {
  // Group questions by concept.
  // V3 exam model: N concepts × 1 variant per attempt (full sections: N=8).
  // Question count is dynamic — not hardcoded. Expanding the seed/bank to more
  // concepts automatically yields more questions without changing this sampler.
  const byConcept = new Map<string, QuestionBank[]>()
  for (const q of allQuestions) {
    if (!byConcept.has(q.concept)) byConcept.set(q.concept, [])
    byConcept.get(q.concept)!.push(q)
  }

  // For each concept, select ONE variant randomly, avoiding variants used in previous attempts
  const usedVariants = new Set<string>()
  for (const att of earlier) {
    try {
      const seed = JSON.parse(att.variantSeed) as { concept: string; variant: number }[]
      for (const s of seed) usedVariants.add(`${s.concept}-${s.variant}`)
    } catch {}
  }

  const selectedQuestions: QuestionBank[] = []
  const variantSeed: { concept: string; variant: number; questionId: string }[] = []

  // One question per distinct concept present in the bank for this section
  for (const [concept, variants] of byConcept.entries()) {
    // Filter out already-used variants for this concept, and variants whose key was seen
    const fresh = (list: QuestionBank[]) =>
      list.filter((v) => !usedVariants.has(`${concept}-${v.variant}`))
    const unseen = variants.filter((v) => !seenKeys.has(itemKey(concept, v.variant)))

    // If all variants used (after 3 attempts), reset to allow reuse; exposure is the last resort
    const available = [fresh(unseen), unseen, fresh(variants), variants].find((t) => t.length > 0)!

    // Random selection
    const selected = available[rng(available.length)]
    selectedQuestions.push(selected)
    variantSeed.push({
      concept: selected.concept,
      variant: selected.variant,
      questionId: selected.id,
    })
  }

  // Shuffle question order (anti-cheating)
  for (let i = selectedQuestions.length - 1; i > 0; i--) {
    const j = rng(i + 1)
    ;[selectedQuestions[i], selectedQuestions[j]] = [selectedQuestions[j], selectedQuestions[i]]
  }
  return { selectedQuestions, variantSeed }
}
