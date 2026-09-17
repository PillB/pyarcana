/**
 * What counts as having taught a term.
 *
 * The concept map is the instrument behind "a learner met this word before anyone explained
 * it". Three defects made it report the opposite of the truth:
 *
 *  - `definesTerm` knew only copulas ("es un/es una"), so "Una **tupla** reúne varios valores
 *    en un orden fijo" — the paragraph that actually teaches tuples — did not count, and the
 *    four paragraphs teaching the term were filed as *surprising uses* of it.
 *  - PAREN_GLOSS accepted any parenthetical of 18+ characters, so the tuple literal
 *    `(valor, tipo_esperado)` inside a weDo hint was credited as the definition instead.
 *  - Any surface could carry a first definition, so a quiz distractor was recorded as the
 *    place that taught `distribución normal`.
 *
 * These assert against the generated artifacts rather than re-implementing the regexes, so
 * they fail if the detector regresses in either direction.
 */
import assert from 'node:assert/strict'
import test from 'node:test'
import fs from 'node:fs'

const events = JSON.parse(fs.readFileSync('.fixer/events.json', 'utf8'))
const conceptMap = JSON.parse(fs.readFileSync('course-state/concept_map.json', 'utf8'))

// Kept in step with TEACHING_KINDS in scripts/concept_map.py. `outcome` is here because D1 puts
// taglines, learning outcomes and jobRelevance on the same footing, and weDo preamble and
// instruction because We Do is a teaching phase - the learner works with guidance, and that is
// the guidance. A weDo *hint* is not: it appears after the learner is already stuck.
const TEACHING = new Set([
  'theory.paragraph', 'theory.callout', 'theory.heading', 'theory.code.explanation',
  'ido.why', 'ido.preamble', 'ido.description', 'ido.intro', 'ido.retrospective',
  'wedo.intro', 'wedo.preamble', 'wedo.instruction', 'youdo.context', 'jobRelevance',
  'tagline', 'outcome',
])

const NEVER_TEACHING = ['wedo.hint', 'wedo.title', 'wedo.starter', 'wedo.tests',
  'selfcheck.question', 'selfcheck.option', 'selfcheck.explanation', 'solution',
  'youdo.requirement', 'youdo.objective', 'youdo.rubric', 'resource']

test('a surface the learner only reaches after being stuck cannot introduce a term', () => {
  // The reductio that motivated all of this: `distribución normal` was "taught" by a quiz
  // distractor, and `dict-comprehension` by a weDo title.
  const offenders = Object.entries(conceptMap)
    .filter(([, c]) => c.first_definition && NEVER_TEACHING.includes(c.first_definition.kind))
    .map(([id, c]) => `${id} <- ${c.first_definition.kind}`)
  assert.deepEqual(offenders, [])
})

test('a term defined at a later occurrence in the same text still counts', () => {
  // "añade Python y Ruff; Ruff es un programa que señala errores" - testing only the first
  // occurrence missed this, because the `;` blocks the cue, and ruff scored never-explained
  // across 39 uses with its definition in the same sentence.
  const ev = events.events.find((e) => e.location === 'setup.outcome[4]')
  assert.ok(ev, 'the S01 outcome that exposed this must still exist to guard')
  assert.ok(ev.defines.includes('ruff'), 'the definition is in the second occurrence, not the first')
})

test('a verb-first Spanish definition counts as teaching the term', () => {
  const para = events.events.find(
    (e) => e.kind === 'theory.paragraph' && /Una \*\*tupla\*\* re[uú]ne/.test(e.text),
  )
  assert.ok(para, 'the tuple theory paragraph must still exist to guard')
  assert.ok(
    para.defines.includes('tuple'),
    'a definition written with a describing verb rather than a copula must still count',
  )
})

test('a code literal in parentheses is not a gloss', () => {
  const hint = events.events.find(
    (e) => e.kind === 'wedo.hint' && e.text.includes('tipo_esperado'),
  )
  assert.ok(hint, 'the hint that exposed this must still exist to guard')
  assert.ok(
    !hint.defines.includes('tuple'),
    '`(valor, tipo_esperado)` is an argument list, not a definition of tuple',
  )
})

test('tuple is taught in theory, not by the hint that mentions it', () => {
  const t = conceptMap.tuple
  assert.ok(t.first_definition, 'tuple must have a definition')
  assert.ok(
    TEACHING.has(t.first_definition.kind),
    `tuple is taught on ${t.first_definition.kind}, which is not a teaching surface`,
  )
  assert.equal(
    t.surprising_uses.length, 0,
    'the paragraphs that teach tuple must not be reported as surprising uses of it',
  )
})

test('no concept is credited to a non-teaching surface', () => {
  const offenders = Object.entries(conceptMap)
    .filter(([, c]) => c.first_definition && !TEACHING.has(c.first_definition.kind))
    .map(([id, c]) => `${id} <- ${c.first_definition.kind}`)
  assert.deepEqual(
    offenders, [],
    'a hint, quiz option or starter cannot be where a learner first learns a term',
  )
})

test('L3 requires a worked example, not just a heading and a figure', () => {
  const wrong = Object.entries(conceptMap)
    .filter(([, c]) => c.depth === 'L3' && (c.examples ?? []).length === 0)
    .map(([id]) => id)
  assert.deepEqual(wrong, [], 'L3 is L2 plus orientation and a figure, so it cannot skip the example')
})
