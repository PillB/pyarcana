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
