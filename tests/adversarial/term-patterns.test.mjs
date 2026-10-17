/**
 * Every name a glossary term declares must be able to match.
 *
 * The extractor finds a term's mentions with one alternation per term, and an alternation takes
 * the first alternative that matches, not the longest. Listed after its own prefix ("leakage",
 * then "leakage temporal"), a compound alias could never match whole, and the definition after
 * it would be looked for in the wrong place. termPatterns sorts longest first, which makes the
 * order aliases are declared in irrelevant. These tests hold that on the real glossary and the
 * real builder, not on a copy of either.
 */
import assert from 'node:assert/strict'
import test from 'node:test'
import { termPatterns } from '../../scripts/concept_detector.mts'
import { GLOSSARY_TERMS } from '../../src/lib/glossary/terms.ts'

/** The longest match a term's patterns make starting at the beginning of `text`, or ''. */
function matchAtStart(names, text) {
  const { re, reExact } = termPatterns(names)
  const hits = [...(re ? text.matchAll(re) : []), ...(reExact ? text.matchAll(reExact) : [])]
  return hits.filter((m) => m.index === 0).map((m) => m[0]).sort((a, b) => b.length - a.length)[0] ?? ''
}

test('every name of every glossary term is matched whole by that term', () => {
  const unreachable = []
  let names = 0
  for (const t of GLOSSARY_TERMS) {
    const all = [t.term, ...(t.aliases ?? [])].filter(Boolean)
    for (const name of all) {
      names++
      if (matchAtStart(all, name) !== name) unreachable.push(`${t.id}: ${JSON.stringify(name)}`)
    }
  }
  assert.ok(GLOSSARY_TERMS.length > 0 && names > GLOSSARY_TERMS.length,
    `read ${GLOSSARY_TERMS.length} terms and ${names} names; the glossary did not load`)
  assert.deepEqual(unreachable, [])
})

test('a compound alias beats its own prefix whichever is declared first', () => {
  const text = 'Leakage temporal es usar información posterior al corte.'
  for (const names of [['leakage', 'leakage temporal'], ['leakage temporal', 'leakage']]) {
    assert.equal(matchAtStart(names, text), 'Leakage temporal', JSON.stringify(names))
  }
})
