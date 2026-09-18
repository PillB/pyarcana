/**
 * The preservation sentinel lets a section id go only when a migration carries it.
 *
 * It used to fail on any removed id, which made the deliberate S01-S13 slug rename (shipped
 * with `migrateSectionIds`, so no learner loses progress) indistinguishable from an id that
 * simply vanished. Both directions are pinned here: a rename with a live target passes, and a
 * removal with no migration, or a migration pointing at nothing, still fails - that loss is
 * what the sentinel exists to catch.
 */
import assert from 'node:assert/strict'
import test from 'node:test'
import { classifyRemovedSectionIds, sectionIdRenames } from '../../scripts/preservation_sentinel.mjs'

const live = new Set(['decisions-rules', 'iteration-summaries'])

test('a removed id that the migration carries to a live section is a rename', () => {
  const v = classifyRemovedSectionIds(['data-structures'], new Map([['data-structures', 'decisions-rules']]), live)
  assert.deepEqual(v.renamed, [{ code: 'AUTHORIZED_RENAME', id: 'data-structures', to: 'decisions-rules' }])
  assert.deepEqual(v.lost, [])
})

test('a removed id with no migration is still a loss', () => {
  const v = classifyRemovedSectionIds(['oop'], new Map(), live)
  assert.equal(v.renamed.length, 0)
  assert.equal(v.lost[0].code, 'SECTION_ID_REMOVED')
  assert.equal(v.lost[0].id, 'oop')
})

test('a migration that points at no active section is still a loss', () => {
  const v = classifyRemovedSectionIds(['numpy'], new Map([['numpy', 'no-such-section']]), live)
  assert.equal(v.renamed.length, 0)
  assert.match(v.lost[0].message, /migrates to no-such-section, which is not an active section/)
})

test('the committed migration map is what the sentinel reads', () => {
  // Read through git at HEAD, the same way the sentinel does, so a parse that silently returns
  // nothing - which would turn every rename back into a loss - fails here instead.
  const renames = sectionIdRenames('HEAD')
  assert.equal(renames.get('data-structures'), 'decisions-rules')
  assert.equal(renames.get('rpa-automation'), 'evidence-dashboard')
  assert.ok(renames.size >= 11, `expected the batch-A renames, found ${renames.size}`)
})
