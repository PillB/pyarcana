/**
 * A hover hint that turns on after the learner needed it is not a hint.
 *
 * `firstSectionId` gates availability: `termsAvailableAt` hides a term until
 * the learner reaches that section. So if a term is declared for S18 and the
 * prose uses it in S16, the two sections where it is most confusing are exactly
 * the two where nothing explains it. That was true of "Distribución normal".
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const SECTIONS = 'src/lib/course/sections'

/**
 * Learner-visible prose only -- the strings inside `paragraphs:` arrays.
 *
 * Scanning the raw file instead looks like it works and is quietly wrong: the
 * first "use" of URL in S01 is a code comment I wrote about the URL hash, and
 * `pre`/`code` blocks are full of identifiers nobody is being taught. A gate
 * built on that would move glossary terms to satisfy source nobody reads.
 */
function proseOf(src) {
  const chunks = []
  for (const block of src.matchAll(/paragraphs:\s*\[([\s\S]*?)\n\s*\]/g)) {
    for (const quoted of block[1].matchAll(/"((?:\\.|[^"\\]){20,})"|'((?:\\.|[^'\\]){20,})'/g)) {
      chunks.push(quoted[1] ?? quoted[2])
    }
  }
  return chunks.join('\n')
}

/** routing id -> curriculum index, and the learner prose of each section. */
function course() {
  const index = readFileSync('src/lib/course/index.ts', 'utf8')
  const order = new Map()
  const prose = new Map()
  for (const m of index.matchAll(
    /import\s+\{\s*section(\d{2})\s*\}\s+from\s+['"]\.\/sections\/([^'"]+)['"]/g,
  )) {
    const n = Number(m[1])
    const src = readFileSync(`${SECTIONS}/${m[2]}.ts`, 'utf8')
    order.set(src.match(/^\s*id:\s*(['"])(.*?)\1/m)[2], n)
    prose.set(n, proseOf(src))
  }
  return { order, prose }
}

function glossaryEntries() {
  const src = readFileSync('src/lib/glossary/terms.ts', 'utf8')
  return [...src.matchAll(/\n    term: '([^']+)',[\s\S]*?\n    firstSectionId: '([^']+)',/g)]
    .map((m) => ({ term: m[1], firstSectionId: m[2] }))
}

test('every glossary term points at a section that exists', () => {
  const { order } = course()
  const bad = glossaryEntries()
    .filter((e) => !order.has(e.firstSectionId))
    .map((e) => `${e.term} -> '${e.firstSectionId}'`)
  assert.deepEqual(bad, [], 'firstSectionId values with no matching section')
})

test('no term is introduced later than the section that first uses it', () => {
  const { order, prose } = course()
  const sections = [...prose.keys()].sort((a, b) => a - b)
  const late = []

  for (const { term, firstSectionId } of glossaryEntries()) {
    const declared = order.get(firstSectionId)
    if (declared === undefined) continue
    // Word-boundary, case-insensitive, and not inside an identifier: "set"
    // must not match "settings", and Distribución/distribución are the same
    // word to a reader.
    const pattern = new RegExp(`(?<![\\w\`])${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w])`, 'i')
    const firstUse = sections.find((n) => pattern.test(prose.get(n)))
    if (firstUse !== undefined && firstUse < declared) {
      late.push(`${term}: declared S${String(declared).padStart(2, '0')} but first used S${String(firstUse).padStart(2, '0')}`)
    }
  }

  assert.deepEqual(late, [], 'terms whose hint is withheld until after first contact')
})
