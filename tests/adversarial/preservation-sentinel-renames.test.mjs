/**
 * Contract: the preservation sentinel treats a section id as preserved when
 * SECTION_ID_RENAMES carries it, one to one, to an id that is still active: the move
 * `migrateSectionIds` carries learner progress across. Any other disappearance is still
 * a removal, and a map the sentinel cannot read fails the gate.
 *
 * The rules are unit-tested against scripts/section_id_renames.mjs. Three cases then run
 * the real CLI against a throwaway 52-section git repository built from the real map in
 * src/lib/section-id-migrations.ts, so they grow with the map as later batches append to it.
 */
import { after, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SECTION_ID_RENAMES } from '../../src/lib/section-id-migrations.ts'
import { PROGRESS_FIELDS } from '../../src/lib/progress-sanitize.ts'
import {
  SECTION_ID_RENAMES_PATH,
  classifyMissingSectionIds,
  parseSectionIdRenames,
} from '../../scripts/section_id_renames.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..')
const SENTINEL = join(ROOT, 'scripts/preservation_sentinel.mjs')
const REAL_MAP_SOURCE = readFileSync(join(ROOT, SECTION_ID_RENAMES_PATH), 'utf8')
const ENTRIES = Object.entries(SECTION_ID_RENAMES)

/** Rewrite one entry line of the real map; refuse to go on if the line is not there. */
function editMapEntry(from, to, replacement) {
  const quoted = (s) => `['"]?${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]?`
  const line = new RegExp(`^[ \\t]*${quoted(from)}\\s*:\\s*${quoted(to)},?[ \\t]*\\n`, 'm')
  const edited = REAL_MAP_SOURCE.replace(line, replacement)
  assert.notEqual(edited, REAL_MAP_SOURCE, `entry ${from} -> ${to} not found in ${SECTION_ID_RENAMES_PATH}`)
  return edited
}

describe('parseSectionIdRenames', () => {
  it('reads the real map exactly as the app module exports it', () => {
    assert.ok(ENTRIES.length > 0, 'SECTION_ID_RENAMES is empty')
    assert.deepEqual([...parseSectionIdRenames(REAL_MAP_SOURCE)], ENTRIES)
  })

  it('accepts quoted and bare keys, comments, and a last entry without a comma', () => {
    const source = [
      'export const SECTION_ID_RENAMES: Readonly<Record<string, string>> = {',
      '  // Batch B',
      "  'old-a': 'new-a', // trailing note",
      '  "old-b": "new-b",',
      "  oldC: 'new-c'",
      '}',
    ].join('\n')
    assert.deepEqual(
      [...parseSectionIdRenames(source)],
      [['old-a', 'new-a'], ['old-b', 'new-b'], ['oldC', 'new-c']]
    )
  })

  it('throws, rather than returning an empty map, on anything it cannot read', () => {
    const unreadable = {
      'a spread': editMapEntry(...ENTRIES[0], '  ...LEGACY_RENAMES,\n'),
      'two entries on one line': editMapEntry(...ENTRIES[0], "  'x': 'y', 'z': 'w',\n"),
      'a computed value': editMapEntry(...ENTRIES[0], "  'x': prefix + 'y',\n"),
      'a duplicate key': editMapEntry(...ENTRIES[0], `  '${ENTRIES[0][0]}': 'y',\n  '${ENTRIES[0][0]}': 'z',\n`),
      'a renamed declaration': REAL_MAP_SOURCE.replace('SECTION_ID_RENAMES', 'SECTION_SLUG_RENAMES'),
    }
    for (const [label, source] of Object.entries(unreadable)) {
      assert.notEqual(source, REAL_MAP_SOURCE, label)
      assert.throws(() => parseSectionIdRenames(source), /SECTION_ID_RENAMES/, label)
    }
  })
})

describe('classifyMissingSectionIds', () => {
  const renames = new Map([['old-a', 'new-a'], ['old-b', 'new-b']])
  const classify = (before, after, map = renames) =>
    classifyMissingSectionIds(new Set(before), new Set(after), map)

  it('counts an id whose target is active and new as renamed, and ignores ids still present', () => {
    assert.deepEqual(classify(['keep', 'old-a'], ['keep', 'new-a']), {
      renamed: [{ from: 'old-a', to: 'new-a' }],
      removed: [],
    })
  })

  it('removes an id with no map entry', () => {
    const { renamed, removed } = classify(['keep', 'gone'], ['keep', 'other'])
    assert.deepEqual(renamed, [])
    assert.deepEqual(removed, [{ id: 'gone', reason: 'no SECTION_ID_RENAMES entry' }])
  })

  it('removes a mapped id whose target is not active', () => {
    const { renamed, removed } = classify(['old-a'], ['new-a-typo'])
    assert.deepEqual(renamed, [])
    assert.deepEqual(removed.map(({ id }) => id), ['old-a'])
    assert.match(removed[0].reason, /new-a, which is not an active section id/)
  })

  it('removes a mapped id whose target already existed: that is a merge, not a rename', () => {
    const { removed } = classify(['old-a', 'new-a'], ['new-a'])
    assert.deepEqual(removed.map(({ id }) => id), ['old-a'])
    assert.match(removed[0].reason, /already an active section id/)
  })

  it('removes both ids when two map to the same target', () => {
    const shared = new Map([['old-a', 'new-a'], ['old-b', 'new-a']])
    const { renamed, removed } = classify(['old-a', 'old-b'], ['new-a', 'other'], shared)
    assert.deepEqual(renamed, [])
    assert.deepEqual(removed.map(({ id }) => id), ['old-a', 'old-b'])
    assert.match(removed[0].reason, /old-b also maps to/)
  })
})

describe('preservation sentinel CLI: section id renames', () => {
  const fillers = Array.from({ length: 52 - ENTRIES.length }, (_, i) => `filler-${i + 1}`)
  const oldIds = [...ENTRIES.map(([from]) => from), ...fillers]
  const newIds = [...ENTRIES.map(([, to]) => to), ...fillers]
  const tempDirs = []
  after(() => {
    for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true })
  })

  const git = (dir, ...args) =>
    execFileSync(
      'git',
      ['-c', 'user.name=sentinel-test', '-c', 'user.email=sentinel-test@example.invalid', '-c', 'commit.gpgsign=false', ...args],
      { cwd: dir, encoding: 'utf8' }
    ).trim()

  function commitCurriculum(dir, ids, mapSource) {
    const pad = (i) => String(i + 1).padStart(2, '0')
    mkdirSync(join(dir, 'src/lib/course/sections'), { recursive: true })
    const imports = ids.map((_, i) => `import { section${pad(i)} } from './sections/s${pad(i)}'`)
    writeFileSync(join(dir, 'src/lib/course/index.ts'), imports.join('\n') + '\n')
    ids.forEach((id, i) => {
      const section = `export const section${pad(i)} = {\n  id: '${id}',\n  index: ${i + 1},\n}\n`
      writeFileSync(join(dir, `src/lib/course/sections/s${pad(i)}.ts`), section)
    })
    const fields = `export const PROGRESS_FIELDS = ${JSON.stringify(PROGRESS_FIELDS)}\n`
    writeFileSync(join(dir, 'src/lib/progress-sanitize.ts'), fields)
    writeFileSync(join(dir, SECTION_ID_RENAMES_PATH), mapSource)
    git(dir, 'add', '-A')
    git(dir, 'commit', '-q', '-m', `curriculum ${ids.length}`)
    return git(dir, 'rev-parse', 'HEAD')
  }

  /** Commit the old ids with the real map, then `afterIds` with `mapSource`; run the sentinel. */
  function runSentinel(afterIds, mapSource) {
    const dir = mkdtempSync(join(tmpdir(), 'sentinel-renames-'))
    tempDirs.push(dir)
    git(dir, 'init', '-q')
    const base = commitCurriculum(dir, oldIds, REAL_MAP_SOURCE)
    commitCurriculum(dir, afterIds, mapSource)
    const env = { ...process.env }
    for (const key of ['PRESERVATION_BASE', 'GITHUB_BASE_SHA', 'GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE']) {
      delete env[key]
    }
    const run = spawnSync(process.execPath, [SENTINEL, '--base', base], { cwd: dir, encoding: 'utf8', env })
    const resultPath = join(dir, 'audit/safe-agent/preservation-sentinel-result.json')
    return { status: run.status, result: JSON.parse(readFileSync(resultPath, 'utf8')) }
  }

  const removedIds = (result) =>
    result.failures.filter((f) => f.code === 'SECTION_ID_REMOVED').map((f) => f.id)

  it('passes every rename in the real SECTION_ID_RENAMES', () => {
    assert.ok(fillers.length >= 1, 'fixture needs a section outside the rename map')
    const { status, result } = runSentinel(newIds, REAL_MAP_SOURCE)
    assert.deepEqual(result.failures, [])
    assert.equal(status, 0)
    assert.deepEqual(result.curriculum.renamed_section_ids, ENTRIES.map(([from, to]) => ({ from, to })))
    assert.deepEqual(result.curriculum.removed_section_ids, [])
  })

  it('fails the id whose map entry is deleted, and an id removed with no entry at all', () => {
    const [from, to] = ENTRIES[0]
    const afterIds = newIds.map((id) => (id === 'filler-1' ? 'unmapped-new-section' : id))
    const { status, result } = runSentinel(afterIds, editMapEntry(from, to, ''))
    assert.equal(status, 1)
    assert.deepEqual(removedIds(result), [from, 'filler-1'])
    assert.deepEqual([...new Set(result.failures.map((f) => f.code))], ['SECTION_ID_REMOVED'])
    assert.equal(result.curriculum.renamed_section_ids.length, ENTRIES.length - 1)
  })

  it('fails closed when the committed map cannot be read', () => {
    const { status, result } = runSentinel(newIds, editMapEntry(...ENTRIES[0], '  ...LEGACY_RENAMES,\n'))
    assert.equal(status, 1)
    assert.ok(
      result.failures.some((f) => f.code === 'SECTION_ID_RENAMES_UNREADABLE'),
      JSON.stringify(result.failures)
    )
    assert.deepEqual(removedIds(result), ENTRIES.map(([from]) => from))
  })
})
