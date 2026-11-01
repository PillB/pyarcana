/** Emit S01 learner-facing prose in actual display order for the Python audit.
 * A regex over raw source previously grouped *all* headings before paragraphs,
 * making a heading appear before a definition that the learner saw earlier.
 */
import { section01 } from '../src/lib/course/sections/s01-setup'

const chunks: [string, string][] = [
  ['tagline', section01.tagline],
  ['jobRelevance', section01.jobRelevance],
  ...section01.learningOutcomes.map((o) => ['learningOutcome', o.text] as [string, string]),
]
for (const block of section01.theory) {
  chunks.push(['theory.heading', block.heading])
  for (const paragraph of block.paragraphs ?? []) {
    chunks.push(['theory.paragraph', paragraph])
  }
  if (block.callout) chunks.push(['theory.callout', block.callout.content])
  if (block.figure?.caption) chunks.push(['theory.figure', block.figure.caption])
  if (block.code?.code) chunks.push(['theory.code', block.code.code])
}
chunks.push(['iDo.intro', section01.iDo.intro])
for (const step of section01.iDo.steps) {
  chunks.push(['iDo.title', step.title])
  if (step.description) chunks.push(['iDo.description', step.description])
  if (step.why) chunks.push(['iDo.why', step.why])
  if (step.code?.code) chunks.push(['iDo.code', step.code.code])
  if (step.retrospective) chunks.push(['iDo.retrospective', step.retrospective])
}
chunks.push(['weDo.intro', section01.weDo.intro])
for (const step of section01.weDo.steps) {
  chunks.push(['weDo.title', step.title])
  chunks.push(['weDo.preamble', step.preamble ?? ''])
  chunks.push(['weDo.instruction', step.instruction])
  if (step.hint) chunks.push(['weDo.hint', step.hint])
  for (const hint of step.hints ?? []) chunks.push(['weDo.hint', hint])
  chunks.push(['weDo.starter', step.starterCode.code])
  if (step.tests) chunks.push(['weDo.tests', step.tests])
  if (step.retrospective) chunks.push(['weDo.retrospective', step.retrospective])
}
chunks.push(['youDo.context', section01.youDo.context])
for (const requirement of section01.youDo.requirements) chunks.push(['youDo.requirement', requirement])
for (const objective of section01.youDo.objectives) chunks.push(['youDo.objective', objective])
for (const row of section01.youDo.rubric) chunks.push(['youDo.rubric', row.criterion])
for (const question of section01.selfCheck.questions) {
  chunks.push(['selfCheck.question', question.question])
  for (const option of question.options) chunks.push(['selfCheck.option', option])
  chunks.push(['selfCheck.explanation', question.explanation])
}
process.stdout.write(JSON.stringify(chunks.filter(([, text]) => typeof text === 'string' && text.trim())))
