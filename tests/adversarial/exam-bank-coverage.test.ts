/**
 * Contract: every course section has a complete exam bank, read through the one reader.
 *
 * The rules are the course's: 8 concepts per section, 3 variants per concept, 4 options per
 * question, a key that points at one of them, no option repeated inside a question, an explanation,
 * and no bank keyed by a section's pre-rename slug (a bank under `performance` is never drawn for
 * `apis-sql-geo`). The rules live in coverageProblems(), a pure function, so each defect below is
 * recreated on a synthetic bank and the check is shown to name it. Without those recreations a
 * green result on the real seed would not show the check can fail.
 *
 * Run: node --import tsx --test tests/adversarial/exam-bank-coverage.test.ts
 */
import assert from 'node:assert/strict'
import { dirname, join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { COURSE_SECTIONS } from '../../src/lib/course'
import { SECTION_ID_RENAMES } from '../../src/lib/section-id-migrations.ts'
import { readSeedQuestionBank, type Bank, type BankQuestion } from '../../scripts/lib/learner_text.mts'
import { coverageProblems } from '../../scripts/lib/exam_bank_coverage.mts'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..')
const SECTION_IDS = COURSE_SECTIONS.map((s) => s.id)

/** A bank the course's rules accept: `concepts` concepts, `variants` each, `options` per question. */
function bankOf(slug: string, { concepts = 8, variants = 3, options = 4 } = {}): Bank {
  const questions: BankQuestion[] = []
  for (let c = 0; c < concepts; c++) {
    for (let v = 1; v <= variants; v++) {
      questions.push({
        concept: `${slug}-c${c}`,
        question: `${slug} pregunta ${c}.${v}`,
        options: Array.from({ length: options }, (_, o) => `${c}.${v}:${o}`),
        correctIndex: 0,
        explanation: `porque ${c}.${v}`,
        variant: v,
        line: 1,
      })
    }
  }
  return { slug, keyStyle: 'identifier', line: 1, questions }
}

/** The synthetic set with one bank replaced by `change(bank)`. */
function withBank(banks: Bank[], slug: string, change: (b: Bank) => Bank): Bank[] {
  return banks.map((b) => (b.slug === slug ? change(b) : b))
}

/** The same bank with the question at `index` given new fields. */
function patched(bank: Bank, index: number, fields: Partial<BankQuestion>): Bank {
  return { ...bank, questions: bank.questions.map((q, i) => (i === index ? { ...q, ...fields } : q)) }
}

const complete = () => SECTION_IDS.map((id) => bankOf(id))

test('the real seed: every course section has a bank that meets the rules', () => {
  const banks = readSeedQuestionBank(ROOT)
  assert.equal(banks.length, COURSE_SECTIONS.length, 'one bank per section, no more and no fewer')
  assert.deepEqual(coverageProblems(banks, SECTION_IDS, SECTION_ID_RENAMES), [])
})

test('the control: a complete synthetic set of banks reports nothing', () => {
  assert.deepEqual(coverageProblems(complete(), SECTION_IDS, SECTION_ID_RENAMES), [])
})

test('a section with no bank is named', () => {
  const banks = complete().filter((b) => b.slug !== 'basics')
  const problems = coverageProblems(banks, SECTION_IDS, SECTION_ID_RENAMES)
  assert.deepEqual(problems, ['no bank for section "basics"'])
})

test('a concept with two variants instead of three is named', () => {
  const banks = withBank(complete(), 'basics', (b) => ({
    ...b,
    questions: b.questions.filter((q) => !(q.concept === 'basics-c0' && q.variant === 3)),
  }))
  const problems = coverageProblems(banks, SECTION_IDS, SECTION_ID_RENAMES)
  assert.equal(problems.length, 1, problems.join('\n'))
  assert.match(problems[0]!, /bank "basics" concept "basics-c0" has variants \[1, 2\]/)
})

test('a question with three options instead of four is named', () => {
  const banks = withBank(complete(), 'setup', (b) => patched(b, 5, { options: ['a', 'b', 'c'] }))
  const problems = coverageProblems(banks, SECTION_IDS, SECTION_ID_RENAMES)
  assert.equal(problems.length, 1, problems.join('\n'))
  assert.match(problems[0]!, /bank "setup" line 1 has 3 options, want 4/)
})

test('a question that repeats an option is named', () => {
  const banks = withBank(complete(), 'collections', (b) => patched(b, 0, { options: ['x', 'y', 'x', 'z'] }))
  const problems = coverageProblems(banks, SECTION_IDS, SECTION_ID_RENAMES)
  assert.equal(problems.length, 1, problems.join('\n'))
  assert.match(problems[0]!, /bank "collections" line 1 repeats an option/)
})

test('a key outside the options, and a blank explanation, are named', () => {
  let banks = withBank(complete(), 'basics', (b) => patched(b, 1, { correctIndex: 4 }))
  banks = withBank(banks, 'files-ingestion', (b) => patched(b, 2, { explanation: '   ' }))
  const problems = coverageProblems(banks, SECTION_IDS, SECTION_ID_RENAMES)
  assert.equal(problems.length, 2, problems.join('\n'))
  assert.match(problems.join('\n'), /key 4 is not one of its 4 options/)
  assert.match(problems.join('\n'), /empty explanation/)
})

test('a bank keyed by a pre-rename slug is named, even when the new slug is missing too', () => {
  // `performance` was renamed to `apis-sql-geo`: a bank under the old key is never drawn for the new id.
  const banks = complete().filter((b) => b.slug !== 'apis-sql-geo')
  banks.push(bankOf('performance'))
  const problems = coverageProblems(banks, SECTION_IDS, SECTION_ID_RENAMES)
  assert.ok(problems.includes('no bank for section "apis-sql-geo"'), problems.join('\n'))
  assert.ok(
    problems.some((p) => /bank "performance" is keyed by a pre-rename slug; the section is "apis-sql-geo"/.test(p)),
    problems.join('\n'),
  )
})

test('a bank that belongs to no section is named', () => {
  const problems = coverageProblems([...complete(), bankOf('retired-section')], SECTION_IDS, SECTION_ID_RENAMES)
  assert.deepEqual(problems, ['bank "retired-section" belongs to no section'])
})
