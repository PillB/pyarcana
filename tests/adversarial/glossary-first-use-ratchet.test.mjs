/**
 * How many glossary terms are still declared later than the course first uses them.
 *
 * `glossary-first-use.test.mjs` holds the same contract absolutely — no term may be declared
 * late — and passes today. It passes because its matcher is narrow in two ways it does not
 * claim to be: it tests only the `term` field, never the `aliases`, and its lookbehind
 * `(?<![\w\`])` drops any mention whose first character is preceded by a backtick, which is how
 * this course writes most keywords.
 *
 * Counted with every alias, 21 terms are declared late and the strict gate sees none of them —
 * `mlops` by 23 sections, `fastapi` by 20, `generator` by 19, `outlier` by 13. The cause is
 * recorded in `audit/fixer/rca/stale-first-section.md`: `firstSectionId` was never re-derived
 * after the curriculum rewrite, and commit a492d8ea remapped 19 values through
 * SECTION_ID_RENAMES — a storage migration that preserves the slot, not the meaning.
 *
 * Widening the strict gate would fail every round until all 21 are repaired, and repairing them
 * is not purely mechanical: pointing a term earlier also moves its hover earlier, and several
 * definitions lean on vocabulary the earlier section has not taught (`overfitting`'s said
 * "training data" and "score"), so the text needs rewriting by the content author. So this is a
 * ratchet instead: the debt is counted, cannot grow, and must be lowered as it is paid.
 */
import assert from 'node:assert/strict'
import test from 'node:test'

import { GLOSSARY_TERMS, aliasIsAcronym } from '../../src/lib/glossary/terms'
import { COURSE_SECTIONS } from '../../src/lib/course'

/** Terms declared later than their first appearance anywhere in the course. */
const DECLARED_LATE_OWED = 21
/** Terms no alias of which appears anywhere: dead entries, or an alias that is simply wrong. */
const NEVER_APPEARS_OWED = 5

function survey() {
  const order = new Map(COURSE_SECTIONS.map((s, i) => [s.id, i + 1]))
  const haystack = COURSE_SECTIONS.map((s) => JSON.stringify(s))
  const late = []
  const dead = []
  for (const t of GLOSSARY_TERMS) {
    const declared = order.get(t.firstSectionId)
    if (!declared) continue
    const alts = [t.term, ...(t.aliases ?? [])].filter(Boolean)
    let first = null
    for (let i = 0; i < haystack.length && first === null; i++) {
      for (const a of alts) {
        const rx = new RegExp(
          `(?<![\\p{L}\\d_])${a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}\\d_])`,
          aliasIsAcronym(a) ? 'u' : 'iu',
        )
        if (rx.test(haystack[i])) { first = i + 1; break }
      }
    }
    if (first === null) dead.push(t.id)
    else if (first < declared) late.push(`${t.id}: declared S${String(declared).padStart(2, '0')} but first used S${String(first).padStart(2, '0')}`)
  }
  return { late, dead }
}

test('no more glossary terms are declared later than the course uses them', () => {
  const { late } = survey()
  assert.ok(
    late.length <= DECLARED_LATE_OWED,
    `${late.length} terms declared late, owed is ${DECLARED_LATE_OWED}:\n  ${late.join('\n  ')}`,
  )
  assert.equal(
    late.length, DECLARED_LATE_OWED,
    `only ${late.length} remain — lower DECLARED_LATE_OWED to ${late.length} so the ratchet keeps what was fixed`,
  )
})

test('no more glossary terms are unreachable by any of their aliases', () => {
  const { dead } = survey()
  assert.ok(dead.length <= NEVER_APPEARS_OWED,
    `${dead.length} terms match nowhere, owed is ${NEVER_APPEARS_OWED}: ${dead.join(', ')}`)
  assert.equal(dead.length, NEVER_APPEARS_OWED,
    `only ${dead.length} remain — lower NEVER_APPEARS_OWED to ${dead.length}`)
})

test('the strict gate really is blind to this, which is why the ratchet exists', () => {
  // If the strict gate ever starts catching these, this ratchet is redundant and should go.
  // Asserted so the redundancy is noticed rather than quietly maintained forever.
  const { late } = survey()
  assert.ok(late.length > 0, 'nothing is late; delete this file and widen glossary-first-use instead')
})
