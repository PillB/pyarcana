/**
 * The QA tutorial teaches testers how to classify what they find. An example
 * that contradicts the course it describes teaches them to classify wrongly,
 * and nothing else in the suite reads this file.
 *
 * The exercise these guard replaced asserted that S08 came after S12. It does
 * not: S08 is "Archivos, CSV, JSON y contratos de ingesta" and it runs four
 * sections earlier, so the scenario never demonstrated the missing prerequisite
 * it claimed and the answer marked correct did not follow from it.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'

const CONTENT = readFileSync('src/lib/qa-tour-content.ts', 'utf8')

/** index number -> section title, read from the live course index. */
function sections() {
  const index = readFileSync('src/lib/course/index.ts', 'utf8')
  const map = new Map()
  for (const m of index.matchAll(
    /import\s+\{\s*section(\d{2})\s*\}\s+from\s+['"]\.\/sections\/([^'"]+)['"]/g,
  )) {
    const src = readFileSync(`src/lib/course/sections/${m[2]}.ts`, 'utf8')
    map.set(Number(m[1]), src.match(/^\s*title:\s*(['"])(.*?)\1/m)[2])
  }
  return map
}

test('every section the tutorial names actually exists', () => {
  const known = sections()
  const named = [...new Set([...CONTENT.matchAll(/\bS(\d{2})\b/g)].map((m) => Number(m[1])))]
  assert.ok(named.length > 0, 'the tutorial should ground its examples in real sections')
  assert.deepEqual(named.filter((n) => !known.has(n)), [], 'tutorial cites sections that do not exist')
})

test('the missing-prerequisite example really is missing a prerequisite', () => {
  // The whole point of the case is that the tool it demands is taught later.
  // If someone reorders the curriculum, this stops being true silently.
  const known = sections()
  assert.match(CONTENT, /En S06 el ejercicio pide/, 'the prerequisite example moved; re-verify it')
  assert.match(known.get(6), /Colecciones/, 'S06 is no longer the collections section')
  assert.match(known.get(15), /Pandas/, 'S15 is no longer where pandas is introduced')
  assert.ok(15 > 6, 'the cited prerequisite must come after the exercise')
})

test('every exercise marks exactly one option correct, and explains the rest', () => {
  const blocks = CONTENT.split(/exercise:\s*\{/).slice(1)
  assert.ok(blocks.length >= 3, 'the tutorial should drill more than a single field')
  for (const [i, block] of blocks.entries()) {
    const correct = block.match(/correct:\s*'([^']+)'/)
    assert.ok(correct, `exercise ${i + 1}: no correct answer declared`)
    const values = [...block.matchAll(/value:\s*'([^']+)'/g)].map((m) => m[1])
    assert.ok(values.includes(correct[1]), `exercise ${i + 1}: correct answer is not an option`)
    assert.equal(
      new Set(values).size,
      values.length,
      `exercise ${i + 1}: the same option is offered twice`,
    )
    const feedback = [...block.matchAll(/feedback:/g)].length
    assert.equal(
      feedback,
      values.length,
      `exercise ${i + 1}: ${values.length} options but ${feedback} explanations — a wrong pick must say why`,
    )
  }
})

test('the tutorial keys its own completion, not the platform tour', () => {
  // The two tours are deliberately independent: finishing the 17-step course
  // tour must not suppress this, and vice versa.
  assert.match(CONTENT, /QA_TOUR_STORAGE_KEY\s*=\s*'pyarcana:qaTourCompleted'/)
  assert.ok(
    !/['"]pyarcana:tourCompleted['"]/.test(CONTENT),
    'the QA tutorial must not read or write the platform tour key',
  )
  // And the specs must seed both, or the tutorial covers the form under test.
  for (const spec of readdirSync('scripts').filter((f) => f.endsWith('.spec.ts'))) {
    const src = readFileSync(`scripts/${spec}`, 'utf8')
    if (!src.includes('qa-harness-open')) continue
    assert.match(src, /pyarcana:qaTourCompleted/, `${spec} opens the harness without seeding the tutorial key`)
  }
})

test('every option the form offers is defined, with a worked example', () => {
  // The tour used to teach only the boundaries the exercises could fit -- four
  // options at a time -- so nine of the twenty-one choices were never defined
  // anywhere. A tester met "Compatibilidad / rendimiento" for the first time in
  // the dropdown itself, which is exactly where a taxonomy stops being usable.
  const session = readFileSync('src/lib/qa-session.ts', 'utf8')

  const valuesOf = (constName) => {
    const block = session.slice(session.indexOf(`export const ${constName} = [`))
    return [...block.slice(0, block.indexOf(']')).matchAll(/value:\s*'([a-z-]+)'/g)].map((m) => m[1])
  }
  const definedIn = (constName) => {
    const block = CONTENT.slice(CONTENT.indexOf(`export const ${constName}: QATermDefinition[] = [`))
    const end = block.indexOf('\n]')
    return [...block.slice(0, end).matchAll(/value:\s*'([a-z-]+)'/g)].map((m) => m[1])
  }

  for (const [form, tour] of [
    ['QA_CATEGORIES', 'QA_CATEGORY_DEFINITIONS'],
    ['QA_CAUSES', 'QA_CAUSE_DEFINITIONS'],
    ['QA_SEVERITIES', 'QA_SEVERITY_DEFINITIONS'],
  ]) {
    const offered = valuesOf(form)
    const defined = definedIn(tour)
    assert.ok(offered.length > 0, `${form}: could not read the form's options`)
    assert.deepEqual(
      offered.filter((v) => !defined.includes(v)),
      [],
      `${form}: options the tester is offered but the tutorial never defines`,
    )
    assert.deepEqual(
      defined.filter((v) => !offered.includes(v)),
      [],
      `${tour}: definitions for options the form no longer offers`,
    )
  }
})

test('each definition says what it means and shows one', () => {
  // "X means abc, such as cde" -- the example is the half that makes a
  // definition checkable, so an empty or throwaway one is worse than none.
  const entries = [...CONTENT.matchAll(
    /value:\s*'([a-z-]+)',\s*\n\s*means:\s*\n?\s*'((?:[^'\\]|\\.)*)',\s*\n\s*example:\s*\n?\s*'((?:[^'\\]|\\.)*)',/g,
  )]
  assert.equal(entries.length, 21, `expected 21 defined options, found ${entries.length}`)
  for (const [, value, means, example] of entries) {
    assert.ok(means.trim().length > 20, `${value}: "means" is too short to define anything`)
    assert.ok(example.trim().length > 30, `${value}: needs a concrete example, not a gesture at one`)
    // A definition that restates the label teaches nothing.
    assert.ok(
      !means.trim().toLowerCase().startsWith(value.split('-')[0]),
      `${value}: the meaning just repeats the label`,
    )
  }
})

