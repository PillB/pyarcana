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

/**
 * What pressing a step's «Marcar…» or «Desmarcar» button changes (state-machine audit, 25 Nov 2026).
 *
 * Before, only a self-check pass could mark the section complete. A learner who passed the check
 * first and finished «Tú haces» last had every step done: the section header said «Completada»
 * (it reads the steps) while the menu, the dashboard count and «Continuar» (they read
 * `completedSections`) said it was not, until a retake of the check.
 *
 * Marking a step marks the section when that step was the last one missing, whichever it is.
 * Unmarking only unmarks the step: completion is sticky, like a pass (W01), so «Desmarcar» never
 * takes away a finished section, and the header reads `completedSections` as well.
 */
export function stepToggleChanges(
  step: string,
  stepsDone: readonly string[],
  sectionComplete: boolean,
  allSteps: readonly string[],
): { toggleStep: true; markSection: boolean } {
  if (stepsDone.includes(step)) return { toggleStep: true, markSection: false }
  const after = [...stepsDone, step]
  return { toggleStep: true, markSection: !sectionComplete && allSteps.every((s) => after.includes(s)) }
}

/**
 * Every step done but the section not recorded complete: the state the old code left behind for
 * learners who finished a step other than the check last. Opening the section repairs it (adds only).
 */
export function needsCompletionRepair(stepsDone: readonly string[], sectionComplete: boolean, allSteps: readonly string[]): boolean {
  return !sectionComplete && allSteps.length > 0 && allSteps.every((s) => stepsDone.includes(s))
}
