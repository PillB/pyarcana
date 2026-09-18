/**
 * The preservation sentinel lets a section id go only when a migration carries it.
 *
 * It used to fail on any removed id, which made the deliberate S01-S13 slug rename (shipped
 * with `migrateSectionIds`, so no learner loses progress) indistinguishable from an id that
 * simply vanished. Both directions are pinned here: a rename with a live target passes, and a
 * removal with no migration, or a migration pointing at nothing, still fails - that loss is
 * what the sentinel exists to catch.
 *
 * The rules live in scripts/section_id_renames.mjs, which the sentinel imports. Each tree is
 * { section id: section number }, as the sentinel reads it from src/lib/course/index.ts.
 */
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import {
  SECTION_ID_RENAMES_PATH,
  classifyMissingSectionIds,
  parseSectionIdRenames,
} from '../../scripts/section_id_renames.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..')
const live = new Map([['decisions-rules', '03'], ['iteration-summaries', '04']])

test('a removed id that the migration carries to a live section is a rename', () => {
  const v = classifyMissingSectionIds(
    new Map([['data-structures', '03']]), live, new Map([['data-structures', 'decisions-rules']]))
  assert.deepEqual(v.renamed, [{ from: 'data-structures', to: 'decisions-rules' }])
  assert.deepEqual(v.removed, [])
})

test('a removed id with no migration is still a loss', () => {
  const v = classifyMissingSectionIds(new Map([['oop', '05']]), live, new Map())
  assert.equal(v.renamed.length, 0)
  assert.equal(v.removed[0].reason, 'no SECTION_ID_RENAMES entry')
  assert.equal(v.removed[0].id, 'oop')
})

test('a migration that points at no active section is still a loss', () => {
  const v = classifyMissingSectionIds(
    new Map([['numpy', '06']]), live, new Map([['numpy', 'no-such-section']]))
  assert.equal(v.renamed.length, 0)
  assert.match(v.removed[0].reason, /maps it to no-such-section, which is not an active section id/)
})

test('the committed migration map is what the sentinel reads', () => {
  // Read through git at HEAD, the same way the sentinel does, so a parse that silently returns
  // nothing - which would turn every rename back into a loss - fails here instead.
  const source = execFileSync('git', ['show', `HEAD:${SECTION_ID_RENAMES_PATH}`], { cwd: ROOT, encoding: 'utf8' })
  const renames = parseSectionIdRenames(source)
  assert.equal(renames.get('data-structures'), 'decisions-rules')
  assert.equal(renames.get('rpa-automation'), 'evidence-dashboard')
  assert.ok(renames.size >= 11, `expected the batch-A renames, found ${renames.size}`)
})
