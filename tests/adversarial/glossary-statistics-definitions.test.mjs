/**
 * Contract: the glossary hover for p-value states what a p-value is (design step 0b-7, O17).
 *
 * The hover a learner sees on every "p-value" said: «Probabilidad de observar el resultado si la
 * hipótesis nula es cierta. <0.05 típicamente "significativo".» That is the probability of the
 * observed result alone, which is not a p-value (for 1000 fair coin flips, exactly 500 heads has
 * probability 0.025 and a p-value of 1: tests/adversarial/test_taught_claims_hold.py), and it
 * teaches a cut-off as the meaning. The ASA statement (Wasserstein & Lazar 2016) defines it as the
 * probability, under the model, of a summary "equal to or more extreme than its observed value",
 * and principle 3 says no conclusion should rest on a threshold alone. S18 already teaches it
 * right (s18:356: «al menos tan grande como la tuya si el tratamiento no tuviera ningún efecto»).
 *
 * audit/fixer/known_false_claims.json (KFC-001) keeps the old wording from coming back anywhere;
 * this pins what the hover itself must say.
 *
 * Run: node --import tsx --test tests/adversarial/glossary-statistics-definitions.test.mjs
 */
import assert from 'node:assert/strict'
import test from 'node:test'

import { GLOSSARY_TERMS } from '../../src/lib/glossary/terms'

const EXTREMENESS = /(al menos tan|igual o m[aá]s|tan o m[aá]s) (extrem|grande)/i
const UNDER_NULL = /(hip[oó]tesis nula|\bH0\b|\bH₀\b|ning[uú]n efecto|sin efecto)/i
const THRESHOLD = /0[.,]05|significativ/i
const EXTREMENESS_EN = /at least as extreme/i
const UNDER_NULL_EN = /null hypothesis|\bH0\b|\bH₀\b|no effect/i
const THRESHOLD_EN = /0[.,]05|significan/i

/**
 * Why an entry's English field fails, or null. `definitionEn` is the hover BODY in English mode
 * (src/components/course/TermHint.tsx: `lang === 'en' && term.definitionEn ? term.definitionEn
 * : term.definition`), so a bare name there replaces the definition with a word that repeats the
 * title ("p-value: p-value"). The field was used as "the English name" from 2026-08-21 on; that
 * convention was wrong, and the S18 round's review caught it.
 */
function englishFieldProblem(entry) {
  const en = entry.definitionEn?.trim()
  if (!en) return null
  const names = [entry.term, ...(entry.aliases ?? [])].map((n) => n.toLowerCase())
  if (names.includes(en.toLowerCase())) return `definitionEn is the term's name, not a definition: "${en}"`
  if (en.split(/\s+/).length < 6) return `definitionEn is too short to define anything: "${en}"`
  return null
}

/** Why a p-value definition fails, or [] when it states what a p-value is. */
function problems(entry) {
  const out = []
  if (!entry) return ['no p-value entry']
  if (!EXTREMENESS.test(entry.definition)) out.push('no "at least as extreme / as large" wording')
  if (!UNDER_NULL.test(entry.definition)) out.push('does not say it is computed under the null (or no effect)')
  if (THRESHOLD.test(entry.definition)) out.push('teaches the 0.05 cut-off or "significativo" as the meaning')
  if (!entry.definitionEn?.trim()) out.push('no English definition')
  else if (englishFieldProblem(entry)) out.push(englishFieldProblem(entry))
  else {
    // The English body is what an English-mode learner reads, so it carries the same three
    // safeguards as the Spanish one (Codex P2 on #94: only the first was checked).
    if (!EXTREMENESS_EN.test(entry.definitionEn)) out.push('the English definition lacks "at least as extreme"')
    if (!UNDER_NULL_EN.test(entry.definitionEn)) out.push('the English definition does not say it is computed under the null (or no effect)')
    if (THRESHOLD_EN.test(entry.definitionEn)) out.push('the English definition teaches the 0.05 cut-off or "significant" as the meaning')
  }
  return out
}

test('the checks fail the definition that was shipped, and pass a correct one', () => {
  const shipped = {
    term: 'p-value', aliases: ['p-value', 'valor p'],
    definition: 'Probabilidad de observar el resultado si la hipótesis nula es cierta. <0.05 típicamente "significativo".',
  }
  assert.deepEqual(problems(shipped), [
    'no "at least as extreme / as large" wording',
    'teaches the 0.05 cut-off or "significativo" as the meaning',
    'no English definition',
  ])
  const correct = {
    term: 'p-value', aliases: ['p-value', 'valor p'],
    definition: 'Si la hipótesis nula fuera cierta, la probabilidad de obtener un resultado al menos tan extremo como el observado. No es la probabilidad de que la hipótesis nula sea cierta.',
    definitionEn: 'The probability, computed assuming the null hypothesis, of a result at least as extreme as the one observed.',
  }
  assert.deepEqual(problems(correct), [])
  // The first fix written for this entry put the English NAME in the field; it must fail.
  assert.deepEqual(problems({ ...correct, definitionEn: 'p-value' }), [
    'definitionEn is the term\'s name, not a definition: "p-value"',
  ])
  // The misconception, restored in English only: the Spanish body is correct, so every check
  // that reads only the Spanish passes it.
  assert.deepEqual(problems({ ...correct, definitionEn: 'The probability of a result at least as extreme as the one observed; p < 0.05 is significant.' }), [
    'the English definition does not say it is computed under the null (or no effect)',
    'the English definition teaches the 0.05 cut-off or "significant" as the meaning',
  ])
})

test('the p-value hover states what a p-value is', () => {
  const entry = GLOSSARY_TERMS.find((t) => t.id === 'p-value')
  assert.deepEqual(problems(entry), [], `the hover says: ${entry?.definition}`)
})

test('every English hover body in the glossary is a definition, not a name', () => {
  const bad = GLOSSARY_TERMS.map((t) => [t.id, englishFieldProblem(t)]).filter(([, p]) => p)
  assert.deepEqual(bad, [], 'TermHint shows definitionEn as the hover body in English mode')
})
