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
import { execFileSync } from 'node:child_process'

// `.fixer/` is gitignored, so on a fresh checkout — CI — the events cache does not exist, and
// reading it crashed this whole file before a single assertion ran. Extract from the sections
// themselves instead: the test then checks the course being committed, not whatever a previous
// local run left behind.
const events = JSON.parse(execFileSync(
  'npx', ['tsx', 'scripts/course_event_extractor.mts'],
  { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 },
))
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

/**
 * The 2026-09-17 round added five definition shapes and two guards. Each one is pinned here in
 * both directions, because every rule in this detector that was added without its negative case
 * later credited something absurd.
 */
const defines = (location, term) => {
  const ev = events.events.find((e) => e.location === location)
  assert.ok(ev, `${location} must still exist to guard this rule`)
  return ev.defines.includes(term)
}

test('a cue glued to the end of a verb is not a definition', () => {
  // "si haces `clean = raw` … y luego mutas `clean`, corrompes el original" credited `dict`
  // and `list`, because "corromp-ES EL" contains "es el". Eighteen credits had this shape.
  assert.equal(defines('basics.S02-T2-B.callout', 'dict'), false)
  assert.equal(defines('basics.S02-T2-B.callout', 'list'), false)
})

test('a term the course marks as a term, plus a verb, teaches it', () => {
  // A keyword or a bolded noun never takes the indefinite article the older rule required,
  // so "El **broadcasting** alinea shapes…" scored as a surprising use of broadcasting.
  assert.ok(defines('security.S14-T2-B.p0', 'broadcasting'))
  assert.ok(defines('data-engineering.S18-T3-A.p0', 'correlaci-n'))
  assert.ok(defines('security.S14-T1-A.p0', 'dtype'))
})

test('a command line that starts a sentence is not a definition of its command', () => {
  // "`git restore archivo` descarta cambios sin commit" is an instruction about a command,
  // not an explanation of Git. The formatted span has to be the term and nothing else.
  assert.equal(defines('setup.S01-T3-B.p5', 'git'), false)
  assert.equal(defines('setup.S01-T3-B.p2', 'git'), false)
})

test('an appositive with the definite article teaches, an ordinary sentence does not', () => {
  // "`pip`, el instalador de paquetes de Python" is the course's commonest gloss shape.
  assert.ok(defines('setup.theory[0].p1', 'pip'))
  // "Si solo haces `pass` dentro del `if`, el print posterior usa la última `i` del `for`"
  // has the same opening and defines nothing: its connector is 35 characters away.
  assert.equal(defines('computer-vision.S23-T1-B-E1.hint[1]', 'if'), false)
})

test('naming a term in Spanish is not defining it', () => {
  // "un outlier (un valor atípico) de 120" translates the word and says nothing about it.
  assert.equal(defines('data-engineering.S18-T1-A.p2', 'outlier'), false)
  // But "bloques de filas llamados **row groups**" does teach: the description precedes it.
  assert.ok(defines('stdlib-deep.S15-T4-B#10.p2', 'row-group'))
})

test('a negated verb describes what a thing is not', () => {
  // "Devolver una tupla no hace que el lote continúe por sí solo" matched the article and a
  // describing verb, and was credited as the definition of tuple.
  assert.equal(defines('functions-contracts.theory[5].callout', 'tuple'), false)
})

test('a subsection title is not a surprise when its own first paragraph defines the term', () => {
  const t = conceptMap['p-value']
  assert.ok(t.first_definition, 'p-value must still be defined in theory')
  assert.deepEqual(
    t.surprising_uses.filter((u) => u.kind === 'theory.heading'
      && u.location.split('.').slice(0, -1).join('.')
         === t.first_definition.location.split('.').slice(0, -1).join('.')),
    [],
    'the heading of the block that defines the term cannot be a surprising use of it',
  )
})

test('L3 requires a worked example, not just a heading and a figure', () => {
  const wrong = Object.entries(conceptMap)
    .filter(([, c]) => c.depth === 'L3' && (c.examples ?? []).length === 0)
    .map(([id]) => id)
  assert.deepEqual(wrong, [], 'L3 is L2 plus orientation and a figure, so it cannot skip the example')
})

test('a pair defined in the plural with a quantifier counts as teaching', () => {
  // "Las **cercas de Tukey** son dos límites calculados a partir de los cuartiles" is how
  // Spanish defines a pair; the cue list only knew "es un/una" and "son unos/unas", so S16's
  // own sentence left the term reported as never explained in all 52 sections.
  const p2 = events.events.find(
    (e) => e.kind === 'theory.paragraph' && /\*\*cercas de Tukey\*\* son dos/.test(e.text),
  )
  assert.ok(p2, 'the S16 quartiles paragraph that says what a cerca is must still exist')
  assert.ok(
    p2.defines.includes('cercas-de-tukey'),
    `the sentence that says what a cerca is must teach it; defines: ${p2.defines.join(', ')}`,
  )
})

test('a plural copula with no noun after the numeral is a count, not a definition', () => {
  // The guard that keeps "las opciones son dos" out: the numeral has to introduce a noun.
  const cue =
    /^[^.!?;]{0,45}?(?<!\p{L})(?:es un|es una|son unos|son unas|son (?:dos|tres|cuatro|cinco|seis|\d+)\s+\p{L}{3,})/iu
  assert.equal(cue.test(' son dos límites calculados a partir de los cuartiles'), true)
  assert.equal(cue.test(' son dos.'), false)
  assert.equal(cue.test(' son dos, y ya las viste'), false)
})

test('a marked term that divides something teaches it, a command line that does not', () => {
  // "La **validación cruzada** (CV) divide los datos en `k` partes" is S33's definition, and
  // `divide` was missing from the verb list, so cross-validation scored never-explained in all
  // 52 sections while the paragraph that teaches it sat in the section it belongs to.
  assert.ok(defines('advanced-models.theory[10].p1', 'cross-validation'))
  // The guard that keeps the verb honest: the formatted span still has to be the term itself.
  // "`git commit -m \"docs: …\"` crea un commit" explains a command's effect, not what git is.
  assert.equal(defines('setup.theory[17].p1', 'git'), false)
})

test('a self-check explanation still cannot introduce a term', () => {
  // The same scan that added `divide` offered `crea`, whose only other effect in the whole
  // course was to credit this explanation with venv. Surfaces the learner reaches after
  // answering are reinforcement; the surface hierarchy has to outrank any verb rule.
  const ev = events.events.find((e) => e.location === 'setup.selfCheck[3].explanation')
  assert.ok(ev, 'the S01 self-check explanation that exposed this must still exist to guard')
  assert.equal(
    conceptMap['virtual-environment-venv']?.first_definition?.kind === 'selfcheck.explanation',
    false,
    'venv cannot be introduced by a self-check explanation',
  )
})
