// Each numbered subtopic is owned by one theory block. A supporting block, such as a D24
// "Contraejemplo: …" block, carries no subtopicId (src/lib/course/sections/AGENTS.md,
// "Structure"). The packet parser merges a repeated tag, so a duplicate passes every other
// gate silently; this test is what makes it visible.
//
// OWED is the debt that main already had on 2026-11-09. It may only shrink: a section in it
// that no longer repeats the tag fails the test until its entry is removed.
import test from 'node:test'
import assert from 'node:assert/strict'
import { COURSE_SECTIONS } from '../../src/lib/course/index.ts'

const OWED = {
  setup: ['S01-T1-A', 'S01-T1-B'],
  'stdlib-deep': ['S15-T4-B'],
  'data-engineering': ['S18-T2-B', 'S18-T3-A'],
  'advanced-models': ['S33-T2-B', 'S33-T4-B'],
}

export function repeatedTags(theory) {
  const tags = theory.map((t) => t.subtopicId).filter(Boolean)
  return [...new Set(tags.filter((t, i) => tags.indexOf(t) !== i))].sort()
}

test('the detector flags a repeated tag and accepts an untagged supporting block', () => {
  const owner = { heading: 'Regla', subtopicId: 'S99-T1-A' }
  assert.deepEqual(repeatedTags([owner, { heading: 'Contraejemplo', subtopicId: 'S99-T1-A' }]), ['S99-T1-A'])
  assert.deepEqual(repeatedTags([owner, { heading: 'Contraejemplo' }]), [])
})

test('no section repeats a theory subtopicId beyond the debt main already had', () => {
  const found = {}
  for (const section of COURSE_SECTIONS) {
    const dup = repeatedTags(section.theory)
    if (dup.length) found[section.id] = dup
  }
  const added = Object.entries(found)
    .flatMap(([id, tags]) => tags.filter((t) => !(OWED[id] ?? []).includes(t)).map((t) => `${id}:${t}`))
  assert.deepEqual(added, [], 'a supporting block repeats a numbered subtopicId; remove the field')
  const repaid = Object.entries(OWED)
    .flatMap(([id, tags]) => tags.filter((t) => !(found[id] ?? []).includes(t)).map((t) => `${id}:${t}`))
  assert.deepEqual(repaid, [], 'debt repaid: remove these entries from OWED')
})
