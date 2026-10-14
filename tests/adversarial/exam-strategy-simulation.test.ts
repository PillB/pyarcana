/**
 * Contract: an exam cannot be passed by a rule that ignores what the question asks.
 *
 * Issue A4. Exams were passable without knowledge: 31 banks keep every key at option B; the key
 * is the longest option in about nine questions of ten; in apis-sql-geo and evidence-dashboard
 * every key contains the concept's slug, which exam/start used to send. Owner decision O20
 * (2026-10-07) shuffles the options per attempt. That removes position cues and nothing else, so
 * this test measures what is left, bank by bank.
 *
 * It runs the REAL bank (read from the seed by scripts/lib/learner_text.mts, never by regex) through
 * the REAL draw, presentation and grading: drawOnePerConcept, presentQuestion, toLearnerQuestion,
 * the form's JSON round trip through parseFormItems, and gradeExamAnswers. Each simulated learner
 * takes up to MAX_EXAM_ATTEMPTS attempts, each drawn the way exam/start draws it (earlier
 * attempts' variantSeed passed in, so variants are not repeated), and stops at the first pass.
 *
 * A bank is passable by a strategy when the share of learners who pass within the attempts
 * exceeds 5%. Answering at random passes 1.26% of the time (8 questions, 4 options, 6 right needed
 * for 75 >= 70, three tries). Fixed-position strategies must pass no bank; strategies that read the
 * options' text are counted against exact owed lists, which fall as banks are rewritten - the cue
 * is in the text, and no order fixes it.
 *
 * Strategies, each choosing among the options as shown, ties to the first shown:
 *   A, B, C, D   always the same position
 *   longest      the longest option
 *   clang        the option sharing the most content words with the stem (a "clang association",
 *                one of the cues item-writing guides tell authors to avoid)
 *   slug         the option containing the concept's slug, else the first; a learner can learn the
 *                slugs, so the simulation grants them
 *
 * The RNG is seeded per bank, so a run is repeatable and a bank's verdict does not depend on which
 * banks ran before it. Within a bank every strategy is scored on the same simulated learners'
 * attempts (common random numbers): a draw never depends on the answers, so this is the same
 * experiment as one run per strategy, seven times cheaper, and paired across strategies.
 *
 * Run: node --import tsx --test tests/adversarial/exam-strategy-simulation.test.ts
 */
import { before, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { QuestionBank } from '@prisma/client'

import { readSeedQuestionBank, type Bank } from '../../scripts/lib/learner_text.mts'
import { drawOnePerConcept, presentQuestion, type Rng } from '../../src/lib/exam-draw.ts'
import {
  MAX_EXAM_ATTEMPTS,
  gradeExamAnswers,
  parseFormItems,
  toFormItem,
  toLearnerQuestion,
  type FormItem,
  type QuestionKey,
} from '../../src/lib/exam-scoring.ts'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..')
const LEARNERS = 1000
/** A strategy that passes more learners than this, within their attempts, passes the bank. */
const PASSABLE = 0.05

// Exact owed lists, measured 2026-10-12 on the bank in this commit. 2026-10-14: plan PR 9's real S12 and S13
// banks leave all three lists (they were the only slug-passable banks).
// A bank that leaves a list was
// rewritten: strike it. A bank that joins one regressed. Neither may happen silently.
//
// Re-measured 2026-10-13, after #85's 110 rewrites (S05, S08-S11) landed beside this test, which
// had been measured on the bank before them. Two banks left: modules-packaging-cli no longer
// passes "longest" (3.7%), exceptions-logging no longer passes "clang". One joined: files-ingestion
// passes "clang" at 8.3% - a regression in #85's S08 rewrites, recorded here rather than hidden.
// The O20 redo round, which rewrites S08#7, owes it back to below the line.
//
// Paid 2026-10-13 by the O20 S10 round: Codex rewrote S08 questions 2, 7, 8, 12, 17 and 23 so
// the key is no longer the option sharing the most words with the stem, and files-ingestion
// leaves the "clang" list. 18 -> 17.
//
// Every bank: the key is the longest option in 1165 of 1248 questions, and every bank passes all
// 1000 learners. The fix is distractors as long and as specific as the key, never a trimmed key.
const BANKS_PASSABLE_BY_LONGEST_OWED = [
  'advanced-models', 'ai-apis-advanced', 'ai-governance',
  'architecture-ddd-decisions', 'async-concurrency', 'basics', 'career-strategy', 'collections',
  'computer-vision', 'cv-ai-integration', 'data-contracts', 'data-engineering', 'databases-orm',
  'dbt-bigquery', 'decisions-rules', 'exceptions-logging', 'fastapi',
  'files-ingestion', 'functions-contracts', 'gpu-computing', 'graph-rag', 'iac',
  'integrator-final', 'integrator-phase1', 'integrator-phase2', 'iteration-summaries',
  'llm-agents', 'llm-finetuning', 'llmops', 'microservices', 'mlops',
  'multimodal', 'oop-domain', 'opensource', 'packaging', 'performance-extreme', 'rag',
  'rapidfuzz-entity', 'rpa-advanced', 'security', 'security-infra', 'setup', 'stdlib-deep',
  'streaming-data', 'streamlit-dashboards', 'system-design', 'tech-leadership',
  'text-unicode-regex', 'wxpython-gui',
]
// Five of these sit within about two standard errors (0.7 points each at 1000 learners) of the 5%
// line: advanced-models, architecture-ddd-decisions, dbt-bigquery, fastapi and wxpython-gui, at
// 5.8-6.5%. A change to how the draw consumes randomness can move one across it; that is a
// re-measurement, not a regression, and the commit that updates the list should say so. The test
// prints the banks near the line on every run.
const BANKS_PASSABLE_BY_CLANG_OWED = [
  'advanced-models', 'architecture-ddd-decisions', 'async-concurrency',
  'collections', 'databases-orm', 'dbt-bigquery', 'decisions-rules',
  'fastapi', 'iteration-summaries', 'oop-domain', 'rag', 'setup',
  'streamlit-dashboards', 'text-unicode-regex', 'wxpython-gui',
]
// Every key in these two banks contains its concept's slug.
const BANKS_PASSABLE_BY_SLUG_OWED: string[] = []

// ---------------------------------------------------------------------------------------------
// The learner

type Shown = { id: string; question: string; options: string[] }
/** The position a learner picks among the options as shown. Only `slug` reads the concept. */
type Strategy = (q: Shown, concept: string) => number

/** The first position holding the highest score. */
const firstBest = (scores: number[]) => scores.reduce((best, s, i) => (s > scores[best]! ? i : best), 0)

/** Spanish and English function words that carry no content, normalised as contentWords does. */
const STOP = new Set(
  ('para como pero este esta estos estas esto cuando donde porque sobre entre tiene tienen solo ' +
    'cada todo todos toda todas desde hasta puede pueden debe deben cual cuales otro otra otros ' +
    'otras mismo misma tambien hace aunque segun antes despues durante mediante hacia dentro ' +
    'fuera siempre nunca algo nada tanto luego entonces mientras sino cuyo cuya ellos ellas ' +
    'nuestro nuestra unos unas dicho dicha ademas estan estar haber sido fueron sera with that ' +
    'this from have when what which your into than then they them there their').split(' ')
)

const wordsOf = new Map<string, Set<string>>()

/** Lowercased words of four letters or more, accents stripped, function words dropped. */
function contentWords(text: string): Set<string> {
  let words = wordsOf.get(text)
  if (!words) {
    const all = text.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').match(/[\p{L}\p{N}_]+/gu) ?? []
    words = new Set(all.filter((w) => w.length >= 4 && !STOP.has(w)))
    wordsOf.set(text, words)
  }
  return words
}

const STRATEGIES: Record<string, Strategy> = {
  A: () => 0,
  B: () => 1,
  C: () => 2,
  D: () => 3,
  longest: (q) => firstBest(q.options.map((o) => o.length)),
  clang: (q) => {
    const stem = contentWords(q.question)
    return firstBest(q.options.map((o) => [...contentWords(o)].filter((w) => stem.has(w)).length))
  },
  slug: (q, concept) => Math.max(0, q.options.findIndex((o) => o.toLowerCase().includes(concept.toLowerCase()))),
}
const FIXED_POSITION = ['A', 'B', 'C', 'D']

// ---------------------------------------------------------------------------------------------
// The exam, as exam/start and exam/submit run it

/** A small seeded generator (mulberry32) for repeatable runs; the server uses crypto.randomInt. */
function seeded(label: string): Rng {
  let h = 0x811c9dc5
  for (const ch of label) h = Math.imul(h ^ ch.codePointAt(0)!, 0x01000193)
  let a = h >>> 0
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  return (n) => Math.floor(next() * n)
}

/** The bank as the seed inserts it: one QuestionBank row per question, variants numbered 1..3. */
function rowsOf(bank: Bank): QuestionBank[] {
  return bank.questions.map((q) => ({
    id: `${bank.slug}/${q.concept}/${q.variant}`,
    sectionId: bank.slug,
    concept: q.concept,
    variant: q.variant,
    question: q.question,
    options: JSON.stringify(q.options),
    correctIndex: q.correctIndex,
    explanation: q.explanation,
    createdAt: new Date(0),
  }))
}

type Present = (q: QuestionBank, rng: Rng) => FormItem
const NO_KEYS_SEEN = new Set<string>()

/** One attempt as the learner received it, and the key exam/submit grades it against. */
type Attempt = { shown: Shown[]; key: Map<string, QuestionKey>; drawn: string[] }

/**
 * One learner's MAX_EXAM_ATTEMPTS attempts, each drawn as exam/start draws it, after the earlier
 * ones, and saved and read back as the form is. A draw never depends on the answers given, so the
 * same attempts serve every strategy: each strategy is scored on the same learners (common random
 * numbers), which is what makes their rates comparable, and a strategy's rate does not depend on
 * which other strategies run.
 */
function attemptsOf(bank: QuestionBank[], rng: Rng, present: Present): Attempt[] {
  const earlier: { variantSeed: string }[] = []
  const attempts: Attempt[] = []
  for (let n = 0; n < MAX_EXAM_ATTEMPTS; n++) {
    const { selectedQuestions, variantSeed } = drawOnePerConcept(bank, earlier, NO_KEYS_SEEN, rng)
    const items = selectedQuestions.map((q) => present(q, rng))
    const key = parseFormItems(JSON.stringify(items))
    assert.ok(key, 'the form exam/start would save must read back')
    attempts.push({ shown: items.map(toLearnerQuestion), key, drawn: variantSeed.map((d) => d.questionId) })
    earlier.push({ variantSeed: JSON.stringify(variantSeed) })
  }
  return attempts
}

/** Whether a learner following `strategy` passes one of their attempts (they stop at the first). */
function passesWith(strategy: Strategy, attempts: Attempt[], concept: Map<string, string>): boolean {
  return attempts.some((a) => {
    const answers = a.shown.map((q) => ({ questionId: q.id, selectedIndex: strategy(q, concept.get(q.id)!) }))
    return gradeExamAnswers(answers, a.key, a.drawn).passed
  })
}

/** Per strategy, the share of `learners` who pass within their attempts. */
function passRates(
  bank: QuestionBank[],
  strategies: Record<string, Strategy>,
  rng: Rng,
  present: Present = presentQuestion,
  learners = LEARNERS
): Record<string, number> {
  const concept = new Map(bank.map((q) => [q.id, q.concept]))
  const passed: Record<string, number> = Object.fromEntries(Object.keys(strategies).map((name) => [name, 0]))
  for (let n = 0; n < learners; n++) {
    const attempts = attemptsOf(bank, rng, present)
    for (const [name, strategy] of Object.entries(strategies)) {
      if (passesWith(strategy, attempts, concept)) passed[name]! += 1
    }
  }
  return Object.fromEntries(Object.entries(passed).map(([name, p]) => [name, p / learners]))
}

/** One strategy's rate. */
const passRate = (bank: QuestionBank[], name: string, rng: Rng, present?: Present, learners?: number) =>
  passRates(bank, { [name]: STRATEGIES[name]! }, rng, present, learners)[name]!

// ---------------------------------------------------------------------------------------------
// Recreations: the simulation sees a cue when there is one

/** 8 concepts x 3 variants with 4 options each; `option(c, v, k)` writes option k. */
function syntheticBank(correctIndex: number, option: (c: number, v: number, k: number) => string): QuestionBank[] {
  return Array.from({ length: 24 }, (_, n) => {
    const [c, v] = [Math.floor(n / 3), (n % 3) + 1]
    return {
      id: `synthetic/c${c}/${v}`, sectionId: 'synthetic', concept: `c${c}`, variant: v,
      question: `¿Pregunta ${c}.${v}?`, options: JSON.stringify([0, 1, 2, 3].map((k) => option(c, v, k))),
      correctIndex, explanation: '', createdAt: new Date(0),
    }
  })
}
const storedOrder: Present = (q) => toFormItem(q, [0, 1, 2, 3])

describe('recreations: a bank with a cue is passable, and the simulation says so', () => {
  const allB = syntheticBank(1, (c, v, k) => `opción ${'abcd'[k]} de ${c}.${v}`)
  const keyLongest = syntheticBank(2, (c, v, k) => (k === 2 ? `la opción correcta, más detallada, de ${c}.${v}` : `opción ${k}`))

  it('every key at B, shown in stored order: answering B passes every learner', () => {
    assert.equal(passRate(allB, 'B', seeded('allB/stored'), storedOrder, 200), 1)
  })

  it('every key at B, shuffled: answering B passes no more often than guessing', () => {
    assert.ok(passRate(allB, 'B', seeded('allB/shuffled')) <= PASSABLE)
  })

  it('every key the longest option, shuffled: picking the longest still passes every learner', () => {
    assert.equal(passRate(keyLongest, 'longest', seeded('longest'), presentQuestion, 200), 1)
  })
})

// ---------------------------------------------------------------------------------------------
// The real bank

describe(`the real bank: ${LEARNERS} learners per bank and strategy, ${MAX_EXAM_ATTEMPTS} attempts each`, () => {
  /** rates[strategy][bank] = share of learners who passed. */
  const rates: Record<string, Record<string, number>> = {}

  before(() => {
    for (const name of Object.keys(STRATEGIES)) rates[name] = {}
    for (const bank of readSeedQuestionBank(ROOT)) {
      const byStrategy = passRates(rowsOf(bank), STRATEGIES, seeded(bank.slug))
      for (const [name, rate] of Object.entries(byStrategy)) rates[name]![bank.slug] = rate
    }
  })

  const passable = (name: string) =>
    Object.entries(rates[name]!).filter(([, r]) => r > PASSABLE).map(([slug]) => slug).sort()

  /** The banks a strategy passes, with their rates, for the log. */
  const report = (name: string) =>
    passable(name).map((slug) => `${slug} ${(rates[name]![slug]! * 100).toFixed(1)}%`).join(', ') || 'none'

  it('no fixed-position strategy passes any bank', (t) => {
    for (const name of FIXED_POSITION) {
      const worst = Math.max(...Object.values(rates[name]!))
      t.diagnostic(`always ${name}: highest pass rate ${(worst * 100).toFixed(1)}% in any bank`)
    }
    const passed = Object.fromEntries(FIXED_POSITION.map((name) => [name, passable(name)]))
    assert.deepEqual(passed, Object.fromEntries(FIXED_POSITION.map((name) => [name, []])),
      FIXED_POSITION.map((name) => `always ${name}: ${report(name)}`).join('; '))
  })

  const owed: Array<[string, string[]]> = [
    ['longest', BANKS_PASSABLE_BY_LONGEST_OWED],
    ['clang', BANKS_PASSABLE_BY_CLANG_OWED],
    ['slug', BANKS_PASSABLE_BY_SLUG_OWED],
  ]
  /** Banks within two standard errors of the line, either side: the ones a re-measurement can move. */
  const nearLine = (name: string) => {
    const band = 2 * Math.sqrt((PASSABLE * (1 - PASSABLE)) / LEARNERS)
    return Object.entries(rates[name]!)
      .filter(([, r]) => Math.abs(r - PASSABLE) <= band)
      .map(([slug, r]) => `${slug} ${(r * 100).toFixed(1)}%`).sort().join(', ') || 'none'
  }

  for (const [name, list] of owed) {
    it(`the banks passable by "${name}" are exactly the ${list.length} owed`, (t) => {
      t.diagnostic(`${name}: ${passable(name).length} banks: ${report(name)}`)
      t.diagnostic(`${name}: near the ${PASSABLE * 100}% line: ${nearLine(name)}`)
      const found = passable(name)
      const joined = found.filter((s) => !list.includes(s))
      const left = list.filter((s) => !found.includes(s))
      assert.deepEqual({ joined, left }, { joined: [], left: [] },
        `"${name}" — banks that became passable regressed; banks that left were fixed: strike them from the owed list`)
    })
  }
})
