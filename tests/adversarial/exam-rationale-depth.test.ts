/**
 * Contract: an exam explanation lets a reviewer check the key without opening the lesson.
 *
 * About 1248 questions live in `QUESTION_BANK` in prisma/seed.ts (52 banks of 24), and their
 * `explanation` field had no content contract and no measure. Learners never see it: every
 * learner-facing exam route strips the key and the explanation (owner decision D12,
 * `audit/fixer/decisions.md`). So its only reader is the person who checks that the key is right,
 * and an explanation that restates the key gives that person nothing to check against.
 *
 * Definition. An explanation is THIN when any one of these holds:
 *   (a) short     — it is under 40 characters (code points, trimmed);
 *   (b) restates  — it adds at most 1 content word that is not already in the question or in the
 *                   key option. Words are runs of Unicode letters and digits, accent-folded (NFD,
 *                   combining marks removed) and lowercased; Spanish function words (STOP_WORDS)
 *                   and words under 3 characters are dropped; each word is stemmed by truncating it
 *                   to 6 characters, so «validación» and «validar» are one word;
 *   (c) duplicate — after the same folding, it is word-for-word identical to another explanation
 *                   in the same bank.
 *
 * Sources. Shute (2008), "Focus on Formative Feedback", Review of Educational Research 78(1),
 * 153–189, separates knowledge-of-correct-response feedback (the right answer, nothing more) from
 * elaborated feedback (why it is right); rule (b) is the mechanical edge of that line. The item
 * writers' guide of the American Board of Radiology (OLA, 2023, "Write the rationale", p. 14) asks
 * that a rationale explain why the key is correct and, where it applies, why each distractor is
 * not, in three to five sentences. The NBME Item-Writing Guide (2021) is often cited for this; it
 * does not say it. What it says is that content experts must be able to agree on the key and
 * verify it in item review — which is the job these explanations exist to support.
 *
 * Known limit. This flags only certain thinness. Padding passes: an explanation that adds two
 * unrelated words clears (b), and one of 40 characters clears (a), whether or not either helps a
 * reviewer. The ABR's floor is about 800 characters; this one is 40. A count of zero here would
 * mean nothing is certainly thin, not that every explanation is good.
 *
 * Measured 2026-10-12 on the real bank: 571 of 1248 are thin (a 499, b 168, c 48; an item can
 * break more than one rule); 23 banks are at least half thin; 8 banks have none; 1066
 * explanations name no distractor (reported below, not gated). On a systematic sample of 10
 * flagged items, none was a false positive. Near the 40-character line the rule can misfire: an
 * explanation like «loc es por etiqueta; iloc por posición.» (39) contrasts the key with a
 * distractor and is flagged by (a) alone.
 *
 * The self-check explanations learners do see are held to the same definition at exactly their
 * owed set: 2 of 395 are thin (data-engineering selfCheck[1], streaming-data selfCheck[1]), so the
 * absolute 0 the plan asked for would be red today. Repairing them is learner-facing Spanish, for
 * Codex in those sections' rounds.
 *
 * The bank is read with `readSeedQuestionBank` (the TypeScript AST reader), never with a regex over
 * seed.ts: three regex readers each saw a different subset of the bank's three key styles.
 */
import assert from 'node:assert/strict'
import { dirname, join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { COURSE_SECTIONS } from '../../src/lib/course'
import { type Bank, type BankQuestion, readQuestionBank, readSeedQuestionBank } from '../../scripts/lib/learner_text.mts'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..')
const BANKS = readSeedQuestionBank(ROOT)

const MIN_CHARS = 40
const MAX_ADDED_WORDS = 1
const MIN_WORD = 3
const STEM = 6

/** Spanish function words, accent-folded. Two-letter ones are listed for completeness; MIN_WORD drops them anyway. */
const STOP_WORDS = new Set(`
  el la los las un una unos unas lo al del
  a ante bajo con contra de desde durante en entre hacia hasta mediante para por segun sin sobre tras
  y e o u ni pero sino aunque porque pues como cuando si mientras
  yo tu ella ellos ellas nosotros usted ustedes me te se nos le les mi mis tus su sus
  este esta esto estos estas ese esa eso esos esas aquel cual cuales quien quienes donde cuyo cuya
  otro otra otros otras todo toda todos todas cada mismo misma
  es son ser era eran fue sido siendo hay ha han haber estan estar puede pueden debe deben
  que no mas muy
`.split(/\s+/).filter(Boolean))

/**
 * Thin exam explanations still owed. Lower it as they are repaired; it may not grow.
 * 2026-10-12: 571, first measured. 2026-10-13: 558, after the GLM lane's 110 rewrites (D21)
 * repaired 8 thin explanations in S10 and 5 in S11.
 */
const THIN_RATIONALES_OWED = 558
/** Banks where at least half the explanations (12 of 24) are thin. */
const THIN_BANKS_OWED = 23
/**
 * The same debt by bank, so a failure can name the bank that grew and list its thin items. Every
 * bank is listed, the clean ones at 0, so a bank that stops being read is noticed: losing a bank
 * with nothing thin in it would otherwise leave every count unchanged.
 */
const THIN_BY_BANK_OWED: Record<string, number> = {
  setup: 0, basics: 0, 'decisions-rules': 0, 'iteration-summaries': 0, 'functions-contracts': 0,
  collections: 0, 'files-ingestion': 0, 'exceptions-logging': 0, 'modules-packaging-cli': 2,
  'oop-domain': 1, 'text-unicode-regex': 1, 'apis-sql-geo': 24, 'evidence-dashboard': 24, security: 2, 'stdlib-deep': 4, 'wxpython-gui': 9, packaging: 16,
  'data-engineering': 2, 'databases-orm': 2, rag: 1, fastapi: 4, 'rapidfuzz-entity': 1,
  'computer-vision': 6, 'rpa-advanced': 11, 'streamlit-dashboards': 12, 'integrator-phase1': 15,
  'async-concurrency': 4, 'llm-agents': 5, mlops: 13, 'security-infra': 4, 'streaming-data': 7,
  microservices: 18, 'advanced-models': 20, 'cv-ai-integration': 11, 'system-design': 3,
  'ai-apis-advanced': 19, 'dbt-bigquery': 22, 'performance-extreme': 18, 'integrator-phase2': 18,
  'architecture-ddd-decisions': 6, 'llm-finetuning': 18, 'graph-rag': 22, llmops: 23, multimodal: 23,
  iac: 24, 'gpu-computing': 24, opensource: 24, 'ai-governance': 23, 'data-contracts': 1,
  'tech-leadership': 23, 'integrator-final': 24, 'career-strategy': 24,
}

type Item = Pick<BankQuestion, 'question' | 'options' | 'correctIndex' | 'explanation'>
type Rule = 'short' | 'restates' | 'duplicate'
type Thin = { slug: string; index: number; rules: Rule[]; explanation: string }
type Survey = { thin: Thin[]; counts: Map<string, { thin: number; total: number }> }

function words(text: string): string[] {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []
}

function contentStems(text: string): Set<string> {
  return new Set(words(text).filter((w) => w.length >= MIN_WORD && !STOP_WORDS.has(w)).map((w) => w.slice(0, STEM)))
}

/** Content words of the explanation that neither the question nor the key option already has. */
function addedStems(item: Item): string[] {
  const known = new Set([...contentStems(item.question), ...contentStems(item.options[item.correctIndex] ?? '')])
  return [...contentStems(item.explanation)].filter((s) => !known.has(s))
}

const normalized = (text: string): string => words(text).join(' ')

/** Normalized explanations that occur more than once in `items`. */
function repeatedExplanations(items: Item[]): Set<string> {
  const seen = new Map<string, number>()
  for (const item of items) {
    const key = normalized(item.explanation)
    seen.set(key, (seen.get(key) ?? 0) + 1)
  }
  return new Set([...seen].filter(([, n]) => n > 1).map(([key]) => key))
}

function thinRules(item: Item, repeated: Set<string>): Rule[] {
  const rules: Rule[] = []
  if ([...item.explanation.trim()].length < MIN_CHARS) rules.push('short')
  if (addedStems(item).length <= MAX_ADDED_WORDS) rules.push('restates')
  if (repeated.has(normalized(item.explanation))) rules.push('duplicate')
  return rules
}

/** The thin explanations of one bank. Rule (c) compares within `items`, never across banks. */
function thinIn(slug: string, items: Item[]): Thin[] {
  const repeated = repeatedExplanations(items)
  return items.flatMap((item, index) => {
    const rules = thinRules(item, repeated)
    return rules.length ? [{ slug, index, rules, explanation: item.explanation }] : []
  })
}

function survey(banks: Bank[]): Survey {
  const thin: Thin[] = []
  const counts = new Map<string, { thin: number; total: number }>()
  for (const bank of banks) {
    const found = thinIn(bank.slug, bank.questions)
    thin.push(...found)
    counts.set(bank.slug, { thin: found.length, total: bank.questions.length })
  }
  return { thin, counts }
}

/** True when the explanation uses a word that only a distractor (not the question or key) has. */
function namesADistractor(item: Item): boolean {
  const known = new Set([...contentStems(item.question), ...contentStems(item.options[item.correctIndex] ?? '')])
  const said = contentStems(item.explanation)
  return item.options.some((option, i) =>
    i !== item.correctIndex && [...contentStems(option)].some((s) => !known.has(s) && said.has(s)))
}

const describe = (t: Thin): string => `${t.slug}[${t.index}] (${t.rules.join(', ')}): ${t.explanation}`

/**
 * Self-check explanations, which learners do read, that are thin by the same definition. Exactly
 * these two, measured 2026-10-12; repair them in their sections' rounds and strike them here. A
 * ratchet, not the absolute 0 the plan asked for, because the tree is at 2.
 */
const SELFCHECK_THIN_OWED = ['data-engineering[1]', 'streaming-data[1]']

test('self-check explanations, which learners read, stay at exactly their owed thin set', () => {
  const thin = COURSE_SECTIONS.flatMap((s) => thinIn(s.id, s.selfCheck.questions))
  const found = thin.map((t) => `${t.slug}[${t.index}]`).sort()
  const added = found.filter((k) => !SELFCHECK_THIN_OWED.includes(k))
  const fixed = SELFCHECK_THIN_OWED.filter((k) => !found.includes(k))
  assert.deepEqual(added, [], `new thin self-check explanations:\n  ${thin.filter((t) => added.includes(`${t.slug}[${t.index}]`)).map(describe).join('\n  ')}`)
  assert.deepEqual(fixed, [], `repaired - strike them from SELFCHECK_THIN_OWED: ${fixed.join(', ')}`)
  // A floor, not an exact count: a section that adds a question must not fail here (Codex P2 on
  // #89). It catches a read that lost questions; a new thin one is caught by `added` above.
  const read = COURSE_SECTIONS.reduce((n, s) => n + s.selfCheck.questions.length, 0)
  assert.ok(read >= 395, `only ${read} self-check questions were read, of at least 395`)
})

const bankOf = (banks: Bank[], slug: string): Bank => {
  const bank = banks.find((b) => b.slug === slug)
  assert.ok(bank, `no bank "${slug}"`)
  return bank
}

// ---------------------------------------------------------------------------------------------
// Synthetic banks, written as seed source and read back through the real reader.

type Draft = Item
type KeyStyle = Bank['keyStyle']

const KEY_SOURCE: Record<KeyStyle, (slug: string) => string> = {
  identifier: (slug) => slug,
  single: (slug) => `'${slug}'`,
  double: (slug) => `"${slug}"`,
}

function draftSource(d: Draft, i: number): string {
  const s = JSON.stringify
  return `    { concept: 'c${i}', question: ${s(d.question)}, options: ${s(d.options)}, `
    + `correctIndex: ${d.correctIndex}, explanation: ${s(d.explanation)} },\n`
}

function seedWith(banks: Array<[KeyStyle, string, Draft[]]>): string {
  const body = banks.map(([style, slug, drafts]) =>
    `  ${KEY_SOURCE[style](slug)}: [\n${drafts.map(draftSource).join('')}  ],\n`).join('')
  return `const QUESTION_BANK = {\n${body}}\n`
}

/** Short, and nothing else: it adds three words the question and key do not have. */
const SHORT: Draft = {
  question: '¿Dónde guardas los pesos de un modelo entrenado?',
  options: ['En un almacenamiento de artefactos versionado, fuera del repositorio Git', 'En el repositorio', 'En la base de datos', 'En el notebook'],
  correctIndex: 0,
  explanation: 'Object store = blobs.',
}

const KEY_TEXT = 'Verificar si el intérprete se llama python3 o está fuera del PATH'
/** Long enough for (a), unique in its bank for (c): only (b) can see that it copies the key. */
const KEY_COPY: Draft = {
  question: '¿Qué haces primero si `python --version` falla en una laptop nueva?',
  options: [KEY_TEXT, 'Instalar pandas globalmente', 'Ejecutar git init', 'Reiniciar el editor'],
  correctIndex: 0,
  explanation: KEY_TEXT,
}

const SHARED = 'Un índice compuesto solo acelera las consultas que filtran por su primera columna; las demás lo recorren entero.'
/** Two questions with one explanation. Each is long and adds words to its own question: only (c) flags them. */
const DUPLICATES: Draft[] = [
  {
    question: '¿Por qué la consulta por fecha sigue lenta con un índice (cliente, fecha)?',
    options: ['Porque el índice empieza por cliente', 'Porque falta memoria', 'Porque fecha es texto', 'Porque hay demasiadas filas'],
    correctIndex: 0,
    explanation: SHARED,
  },
  {
    question: '¿Qué índice sirve para buscar por cliente?',
    options: ['Uno cuya primera columna sea cliente', 'Cualquiera que incluya cliente', 'Ninguno', 'Uno por cada columna'],
    correctIndex: 0,
    explanation: SHARED,
  },
]

/** Elaborated: it says why the key works and why one distractor fails. */
const ELABORATED: Draft = {
  question: 'Tras `edad_txt = "  19  "`, ¿cuál es la conversión segura a entero?',
  options: ['int(edad_txt.strip())', 'eval(edad_txt)', 'float(edad_txt) sin strip', 'edad_txt + 0'],
  correctIndex: 0,
  explanation: 'strip quita los espacios de los bordes e int acepta el resto; eval ejecutaría cualquier código que llegue en el campo.',
}

/** The rules each question of one bank breaks, read through `survey`: the path the ratchets use. */
function rulesOf(banks: Bank[], slug: string): Rule[][] {
  const { thin } = survey(banks)
  return bankOf(banks, slug).questions.map((_, i) => thin.find((x) => x.slug === slug && x.index === i)?.rules ?? [])
}

// ---------------------------------------------------------------------------------------------

test('worked positives: each rule flags its own case, and only that rule', () => {
  const banks = readQuestionBank(seedWith([
    ['identifier', 'positives', [SHORT, KEY_COPY, ELABORATED]],
    ['single', 'duplicates', DUPLICATES],
  ]))
  assert.deepEqual(rulesOf(banks, 'positives'), [['short'], ['restates'], []],
    'short -> (a); a word-for-word copy of the key -> (b); the elaborated control -> nothing')
  assert.deepEqual(rulesOf(banks, 'duplicates'), [['duplicate'], ['duplicate']],
    'two identical explanations in one bank: both are flagged by (c), and by nothing else')
})

test('worked negatives: two real, elaborated explanations are not thin', () => {
  // Referenced by slug and index through the reader, so this follows the bank if it is edited.
  for (const [slug, index] of [['setup', 0], ['decisions-rules', 3]] as const) {
    const item = bankOf(BANKS, slug).questions[index]
    const rules = rulesOf(BANKS, slug)[index]
    assert.deepEqual(rules, [], `${slug}[${index}] is flagged ${rules.join(', ')}: ${item.explanation}`)
    assert.ok(addedStems(item).length >= 5,
      `${slug}[${index}] adds only ${addedStems(item).join(', ')}; pick a clearly elaborated example`)
  }
})

test('the measure reads banks in every key style, and (c) never compares across banks', () => {
  // The keys the real seed writes this way: `setup:`, `'decisions-rules':`, `"functions-contracts":`.
  const styles: KeyStyle[] = ['identifier', 'single', 'double']
  const slugs = ['setup', 'decisions-rules', 'functions-contracts']
  const banks = readQuestionBank(seedWith(styles.map((style, i) => [style, slugs[i], [SHORT, ELABORATED]])))
  assert.deepEqual(banks.map((b) => b.keyStyle), styles, 'the synthetic seed lost a key style')
  const { thin, counts } = survey(banks)
  assert.deepEqual(thin.map((t) => [t.slug, t.index, t.rules]), slugs.map((slug) => [slug, 0, ['short']]),
    'the same explanation once in each of three banks is no duplicate: (c) compares within a bank')
  assert.deepEqual([...counts.values()], styles.map(() => ({ thin: 1, total: 2 })))
})

test('the distractor detector sees a named distractor and only that', () => {
  assert.equal(namesADistractor(ELABORATED), true, '«eval» appears only in a distractor and in the explanation')
  assert.equal(namesADistractor({ ...ELABORATED, explanation: 'strip quita los espacios de los bordes e int acepta el resto.' }), false)
  assert.equal(namesADistractor(KEY_COPY), false, 'a copy of the key names no distractor')
  assert.equal(namesADistractor(bankOf(BANKS, 'basics').questions[3]), true, 'basics[3] rules out eval by name')
})

test('thin exam explanations do not grow, and repairs are kept', (t) => {
  const { thin, counts } = survey(BANKS)
  const owedSum = Object.values(THIN_BY_BANK_OWED).reduce((a, b) => a + b, 0)
  assert.equal(owedSum, THIN_RATIONALES_OWED, 'THIN_BY_BANK_OWED must add up to THIN_RATIONALES_OWED')
  const unread = Object.keys(THIN_BY_BANK_OWED).filter((slug) => !counts.has(slug))
  assert.deepEqual(unread, [], `banks in the ledger that the reader no longer returns: ${unread.join(', ')}`)

  const owed = (slug: string) => THIN_BY_BANK_OWED[slug] ?? 0
  const grew = new Set([...counts].filter(([slug, c]) => c.thin > owed(slug)).map(([slug]) => slug))
  const shrank = [...counts].filter(([slug, c]) => c.thin < owed(slug)).map(([slug, c]) => `'${slug}': ${c.thin}`)
  const fresh = thin.filter((x) => grew.has(x.slug)).map(describe)
  assert.ok(grew.size === 0 && thin.length <= THIN_RATIONALES_OWED,
    `${thin.length} thin exam explanations, owed is ${THIN_RATIONALES_OWED}. `
    + `Banks that grew: ${[...grew].join(', ')}; the new thin items are among these:\n  ${fresh.join('\n  ')}`)
  assert.equal(thin.length, THIN_RATIONALES_OWED,
    `only ${thin.length} remain - lower THIN_RATIONALES_OWED to ${thin.length}, `
    + `and in THIN_BY_BANK_OWED set ${shrank.join(', ')}, so the ratchet keeps what was fixed`)
  // No bank grew and the totals match, so no bank shrank either: the ledger equals the bank.

  const byRule = (r: Rule) => thin.filter((x) => x.rules.includes(r)).length
  const clean = [...counts].filter(([, c]) => c.thin === 0).map(([slug]) => slug)
  const silent = BANKS.flatMap((b) => b.questions).filter((q) => !namesADistractor(q)).length
  t.diagnostic(`thin ${thin.length} of ${BANKS.reduce((n, b) => n + b.questions.length, 0)}: `
    + `(a) short ${byRule('short')}, (b) restates ${byRule('restates')}, (c) duplicate ${byRule('duplicate')}`)
  t.diagnostic(`${clean.length} banks have no thin explanation: ${clean.join(', ')}`)
  t.diagnostic(`${silent} explanations name no distractor (reported, not gated)`)
})

test('no further bank becomes mostly thin', () => {
  const { counts } = survey(BANKS)
  const mostly = [...counts].filter(([, c]) => 2 * c.thin >= c.total)
  const newly = mostly.filter(([slug, c]) => 2 * (THIN_BY_BANK_OWED[slug] ?? 0) < c.total)
  assert.ok(mostly.length <= THIN_BANKS_OWED,
    `${mostly.length} banks are at least half thin, owed is ${THIN_BANKS_OWED}. Newly over the line: `
    + newly.map(([slug, c]) => `${slug} ${c.thin}/${c.total}`).join(', '))
  assert.equal(mostly.length, THIN_BANKS_OWED,
    `only ${mostly.length} remain - lower THIN_BANKS_OWED to ${mostly.length}`)
})
