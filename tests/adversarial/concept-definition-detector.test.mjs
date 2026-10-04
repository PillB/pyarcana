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
import { POST_CUE, PHENOMENON_CUE, definesTerm } from '../../scripts/concept_detector.mts'

// `.fixer/` is gitignored, so on a fresh checkout — CI — the events cache does not exist, and
// reading it crashed this whole file before a single assertion ran. Extract from the sections
// themselves instead: the test then checks the course being committed, not whatever a previous
// local run left behind.
const extracted = execFileSync(
  'npx', ['tsx', 'scripts/course_event_extractor.mts'],
  { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 },
)
const events = JSON.parse(extracted)

// The map is built here, from those same events, by the real build_concepts. It used to be
// read from course-state/concept_map.json, which nothing in CI regenerates, so these assertions
// held whatever the last local run had committed: a change that moved a first definition onto
// a hint went unseen until someone rebuilt the map. TEACHING_KINDS comes from the same module.
// It was copied here and "kept in step" by hand, and nothing kept it in step.
const BUILD = [
  'import json, sys',
  "sys.path.insert(0, 'scripts')",
  'from concept_map import build_concepts, TEACHING_KINDS',
  "json.dump({'map': build_concepts(json.load(sys.stdin)), 'teaching': sorted(TEACHING_KINDS)}, sys.stdout)",
].join('\n')
const built = JSON.parse(execFileSync('python3', ['-c', BUILD], {
  input: extracted, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024,
}))
const conceptMap = built.map
// Where a definition may be the first one. `outcome` is among them because D1 puts taglines,
// learning outcomes and jobRelevance on the same footing; weDo preamble and instruction because
// We Do is a teaching phase. A weDo *hint* is not: it appears after the learner is stuck.
const TEACHING = new Set(built.teaching)

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
  const ev = events.events.find((e) => e.kind === 'outcome' && /Ruff es un programa que señala/.test(e.text ?? ''))
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
  assert.ok(definingEvent(/El \*\*broadcasting\*\* reutiliza sin copiar/, 'broadcasting'))
  assert.ok(definingEvent(/La \*\*correlación\*\* mide asociación, \*\*no causa\*\*/, 'correlaci-n'))
  assert.ok(definingEvent(/Tras S01–S13 trabajaste con listas y dicts de Python\. Un \*\*ndarray\*\* es distinto/, 'dtype'))
})

test('a command line that starts a sentence is not a definition of its command', () => {
  // "`git restore archivo` descarta cambios sin commit" is an instruction about a command,
  // not an explanation of Git. The formatted span has to be the term and nothing else.
  assert.equal(definingEvent(/`git restore archivo` descarta cambios/, 'git'), false)
  assert.equal(definingEvent(/`git remote -v` permite/, 'git'), false)
})

test('an appositive with the definite article teaches, an ordinary sentence does not', () => {
  // "`pip`, el instalador de paquetes de Python" is the course's commonest gloss shape.
  assert.ok(definingEvent(/`pip`, el instalador de paquetes de Python/, 'pip'))
  // "Si solo haces `pass` dentro del `if`, el print posterior usa la última `i` del `for`"
  // has the same opening and defines nothing: its connector is 35 characters away.
  assert.equal(definingEvent(/Si solo haces `pass` dentro del `if`/, 'if'), false)
})

test('naming a term in Spanish is not defining it', () => {
  // "un outlier (un valor atípico) de 120" translates the word and says nothing about it.
  assert.equal(definingEvent(/un outlier \(un valor atípico\) de 120/, 'outlier'), false)
  // But "bloques de filas llamados **row groups**" does teach: the description precedes it.
  assert.ok(definingEvent(/bloques de filas llamados \*\*row groups\*\*/, 'row-group'))
})

test('a negated verb describes what a thing is not', () => {
  // "Devolver una tupla no hace que el lote continúe por sí solo" matched the article and a
  // describing verb, and was credited as the definition of tuple.
  assert.equal(definingEvent(/Devolver una tupla no hace que el lote contin/, 'tuple'), false)
})

/**
 * No assertion above may name a block by its position in the array.
 *
 * `theory[5].callout` and `theory[0].p1` were both written as positional ids, and S05's
 * concepts round inserted one teaching block ahead of the first - every later index shifted,
 * this file failed, and the gate restored a round that took S05 from 8 surprising uses to 0.
 * The same thing cost S33's round earlier the same day. A subtopic id like `S14-T2-B` is a
 * fact about the course and survives; `theory[5]` is a fact about an array and does not.
 *
 * The first version of this guard only knew `theory[N]`, and S15's round walked straight past
 * it: `stdlib-deep.S15-T4-B#10.p2` reads like a subtopic id but `#10` is a block ordinal
 * inside that subtopic, and inserting one block made it `#11`. Both spellings are checked now.
 */
test('no assertion in this file is pinned to a block index', () => {
  // Paragraph and item indexes too (`.p5`, `outcome[4]`, `hint[1]`, `selfCheck[3]`): a negative
  // pinned that way passes on whatever paragraph shifts into the slot, since most paragraphs
  // define nothing - the failure reads as success. Anchor on the sentence instead.
  const source = fs.readFileSync('tests/adversarial/concept-definition-detector.test.mjs', 'utf8')
  const positional = source
    .split('\n')
    .map((line, i) => [i + 1, line])
    .filter(([, line]) => !/^\s*(\/\/|\*)/.test(line))
    .filter(([, line]) => /(?:defines\(\s*|location === )'[^']*(?:\[\d+\]|#\d+|\.p\d+\b)/.test(line))
    .map(([n, line]) => `${n}: ${line.trim()}`)
  assert.deepEqual(
    positional, [],
    'match the sentence with definingEvent() instead; an inserted block renumbers these',
  )
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
  // POST_CUE itself, imported: this test used to declare a copy of its plural branch.
  assert.equal(POST_CUE.test(' son dos límites calculados a partir de los cuartiles'), true)
  assert.equal(POST_CUE.test(' son dos.'), false)
  assert.equal(POST_CUE.test(' son dos, y ya las viste'), false)
})

/**
 * Find an event by what it says, never by where it sits.
 *
 * The first version of the two tests below pinned `advanced-models.theory[10].p1`. The very
 * next round inserted a teaching block ahead of it, every later index shifted by one, and the
 * test failed on content that was strictly better - which, because a failing gate restores
 * the section, would have thrown away a round that took S33 from 27 surprising uses to 1.
 * A positional id is a fact about the array, not about the course.
 */
const definingEvent = (re, term) => {
  const ev = events.events.find((e) => re.test(e.text ?? ''))
  assert.ok(ev, `the sentence ${re} must still exist to guard this rule`)
  return ev.defines.includes(term)
}

test('a marked term that divides something teaches it, a command line that does not', () => {
  // "La **validación cruzada** (CV) divide los datos en `k` partes" is S33's definition, and
  // `divide` was missing from the verb list, so cross-validation scored never-explained in all
  // 52 sections while the paragraph that teaches it sat in the section it belongs to.
  assert.ok(definingEvent(/\*\*validaci[oó]n cruzada\*\*.{0,12}divide los datos/, 'cross-validation'))
  // The guard that keeps the verb honest: the formatted span still has to be the term itself.
  // "`git commit -m \"docs: …\"` crea un commit" explains a command's effect, not what git is.
  assert.equal(definingEvent(/`git commit -m "docs: indicar Python 3\.12"` crea/, 'git'), false)
})

test('a phenomenon defined by when it happens is taught', () => {
  // "**Overfit** ocurre cuando un modelo aprende demasiado bien los datos…" is how S33 teaches
  // it. No copula, and `ocurrir` describes no property, so every rule missed it and the
  // definition of record fell to a learning outcome instead of the block written to teach it.
  assert.ok(definingEvent(/\*\*Overfit\*\* ocurre cuando/, 'overfitting'))
})

test('`ocurre` without `cuando` locates a thing rather than defining it', () => {
  // The guard, asserted on the rule because the course does not currently write the bad shape.
  // The extractor's own PHENOMENON_CUE, not a copy of it as this used to be.
  assert.equal(PHENOMENON_CUE.test(' ocurre cuando un modelo aprende demasiado bien los datos'), true)
  assert.equal(PHENOMENON_CUE.test(' ocurre en la línea 3'), false)
  assert.equal(PHENOMENON_CUE.test(' ocurre dos veces por lote'), false)
})

test('a self-check explanation still cannot introduce a term', () => {
  // The same scan that added `divide` offered `crea`, whose only other effect in the whole
  // course was to credit this explanation with venv. Surfaces the learner reaches after
  // answering are reinforcement; the surface hierarchy has to outrank any verb rule.
  const ev = events.events.find((e) => e.kind === 'selfcheck.explanation'
    && /une dos contratos: usa el instalador del intérprete activo/.test(e.text ?? ''))
  assert.ok(ev, 'the S01 self-check explanation that exposed this must still exist to guard')
  // Present first: with `?.` a renamed concept compared `undefined` and passed.
  const venv = conceptMap['virtual-environment-venv']
  assert.ok(venv, 'the venv concept must exist for this to check anything')
  assert.notEqual(venv.first_definition?.kind, 'selfcheck.explanation',
    'venv cannot be introduced by a self-check explanation')
})

test('a keyword marked as both bold and code is still a marked subject', () => {
  // The course's commonest way of marking a keyword is both marks at once. One mark was all
  // FORMATTED_SUBJECT accepted, so "**`for`** recorre el grupo y entrega cada valor una vez"
  // - S04's actual teaching sentence - was credited with nothing, and the only definition of
  // `for` in 52 sections was a weDo preamble reading "(base del gate de resúmenes)". `for`
  // has 1421 uses. Rewording that parenthesis would have taken the gated course-wide measure
  // from 268 to 1126, so a style pass over an exercise preamble could have quadrupled it.
  assert.ok(definingEvent(/\*\*`for`\*\* recorre el grupo/, 'for'))
})

test('stacking the marks does not let a command line define its command', () => {
  // The guard that keeps the rule honest is the closing mark, not the opening one: the span
  // has to be the term and nothing else. "**`pip freeze`** escribe..." opens a sentence the
  // same way and is an instruction about a command, not an explanation of pip.
  assert.equal(definingEvent(/\*\*`pip freeze`\*\* escribe/, 'pip'), false)
})

test('a marked keyword followed by what it checks is taught there (`comprueba`)', () => {
  // A property, not a pinned sentence: any theory paragraph that opens a sentence with the bare
  // marked name of a glossary term and says it «comprueba» something is crediting that term.
  const rx = /(?:^|[.;:!?]\s+)\*\*`(\w+)`\*\*\s+comprueban?\b/
  const missed = events.events
    .filter((e) => e.kind === 'theory.paragraph')
    .flatMap((e) => { const m = rx.exec(e.text); return m && e.mentions.includes(m[1]) && !e.defines.includes(m[1]) ? [`${m[1]} @ ${e.location}`] : [] })
  assert.deepEqual(missed, [])
})

test('an indefinite article plus BOTH marks still introduces the term', () => {
  // The stacked-mark bug, found a second time in a sibling regex. FORMATTED_SUBJECT was widened
  // for "**`for`**"; INDEFINITE_BEFORE was not, so "Un **`set`** reúne valores distintos y sin
  // repetir" - S03's course-first definition of `set` - credited nothing, `set` read as first
  // defined in S11, and 64 earlier uses counted as surprises. Two sentences in the course have
  // this shape and both are real definitions, so the property is stated over all of them.
  const shaped = events.events.filter((e) => /\b(?:[Uu]n|[Uu]na|[Uu]nos|[Uu]nas)\s+\*\*`(\w[\w-]*)`\*\*/.test(e.text))
  assert.ok(shaped.length > 0, 'nothing has this shape any more; this guard has stopped checking')
  const missed = shaped
    .filter((e) => {
      const id = /\b(?:[Uu]n|[Uu]na|[Uu]nos|[Uu]nas)\s+\*\*`(\w[\w-]*)`\*\*/.exec(e.text)[1]
      return e.mentions.includes(id) && !e.defines.includes(id)
    })
    .map((e) => e.location)
  assert.deepEqual(missed, [])
})

/**
 * Four shapes the detector does not credit. Each cost a round of 2026-10-02 a rewrite - S25,
 * S32 (three passes, one per shape), S33 and S13 - and each time the prose moved and the
 * detector stayed put, because each shape occurs once or twice course-wide. Conceded, not
 * fixed, and pinned so that a detector change which starts crediting one has to flip its line
 * here on purpose. Each sits beside the nearest shape that IS credited, so the pin holds the
 * boundary rather than a detector that credits nothing.
 */
const credits = (text, alias) => definesTerm(text, text.indexOf(alias), alias.length, 'theory.paragraph', [alias])

test('conceded: a marked span wider than the glossary term is not credited', () => {
  assert.equal(credits('El **encoding one-hot** convierte cada categoría en columnas de ceros y unos.', 'one-hot'), false)
  assert.equal(credits('El **one-hot** convierte cada categoría en columnas de ceros y unos.', 'one-hot'), true)
})

test('conceded: two names sharing one verb credit neither', () => {
  assert.equal(credits('**joblib** o **pickle** son formatos para guardar un modelo entrenado en disco.', 'joblib'), false)
  assert.equal(credits('**joblib** es un formato para guardar un modelo entrenado en disco.', 'joblib'), true)
})

test('conceded: a marked term after a comma is not a sentence subject', () => {
  assert.equal(credits('Para guardar el modelo, **joblib** produce un archivo con el objeto entrenado.', 'joblib'), false)
  assert.equal(credits('Hay que guardar el modelo. **joblib** produce un archivo con el objeto entrenado.', 'joblib'), true)
})

test('conceded: a gloss more than 45 characters from its term is not attached to it', () => {
  assert.equal(credits('La **ER**, en todo este curso, en sus proyectos y en cada capstone del nivel cuatro, es un proceso que une registros.', 'ER'), false)
  assert.equal(credits('La **ER**, en todo este curso, es un proceso que une registros de una misma entidad.', 'ER'), true)
})
