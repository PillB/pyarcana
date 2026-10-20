/**
 * What passing a section's self-check changes in the learner's progress.
 *
 * Learner walkthrough, 5 Oct 2026 (W01): the store only offers toggles, and the self-check toggled
 * on every pass. Passing marked the quiz step; the result card's «Marcar como completada» then
 * toggled it, and the section, back off. A retake toggled them off as well. On all 52 sections,
 * finishing a section un-finished it, in the browser and on the account.
 *
 * A pass only ever adds. It marks the quiz step if it is not marked, and the section complete when
 * every step is then done and the section is not already complete. The caller applies these
 * through the store's toggles, so the toggle can never run on something already set.
 */
export function quizPassChanges(
  stepsDone: readonly string[],
  sectionComplete: boolean,
  allSteps: readonly string[],
): { markQuiz: boolean; markSection: boolean } {
  const markQuiz = !stepsDone.includes('quiz')
  const after = markQuiz ? [...stepsDone, 'quiz'] : stepsDone
  const markSection = !sectionComplete && allSteps.every((s) => after.includes(s))
  return { markQuiz, markSection }
}
