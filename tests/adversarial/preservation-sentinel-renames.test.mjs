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
  // Each tree is { id: section number }, as the sentinel reads it from src/lib/course/index.ts.
  const classify = (before, after, map = renames) =>
    classifyMissingSectionIds(new Map(Object.entries(before)), new Map(Object.entries(after)), map)

  it('counts an id whose target is active and new as renamed, and ignores ids still present', () => {
    assert.deepEqual(classify({ keep: '01', 'old-a': '02' }, { keep: '01', 'new-a': '02' }), {
      renamed: [{ from: 'old-a', to: 'new-a' }],
      removed: [],
    })
  })

  it('removes an id with no map entry', () => {
    const { renamed, removed } = classify({ keep: '01', gone: '02' }, { keep: '01', other: '02' })
    assert.deepEqual(renamed, [])
    assert.deepEqual(removed, [{ id: 'gone', reason: 'no SECTION_ID_RENAMES entry' }])
  })

  it('removes a mapped id whose target is not active', () => {
    const { renamed, removed } = classify({ 'old-a': '01' }, { 'new-a-typo': '01' })
    assert.deepEqual(renamed, [])
    assert.deepEqual(removed.map(({ id }) => id), ['old-a'])
    assert.match(removed[0].reason, /new-a, which is not an active section id/)
  })

  it('removes a mapped id whose target already existed: that is a merge, not a rename', () => {
    const { removed } = classify({ 'old-a': '01', 'new-a': '02' }, { 'new-a': '02' })
    assert.deepEqual(removed.map(({ id }) => id), ['old-a'])
    assert.match(removed[0].reason, /already an active section id/)
  })

  it('removes both ids when two map to the same target', () => {
    const shared = new Map([['old-a', 'new-a'], ['old-b', 'new-a']])
    const { renamed, removed } = classify({ 'old-a': '01', 'old-b': '02' }, { 'new-a': '01', other: '02' }, shared)
    assert.deepEqual(renamed, [])
    assert.deepEqual(removed.map(({ id }) => id), ['old-a', 'old-b'])
    assert.match(removed[0].reason, /old-b also maps to/)
  })

  it('removes both ids when a map swaps two sections: progress would cross lessons', () => {
    // Every target is active, new and unique, yet `migrateSectionIds` would hand S03's
    // completions and quiz scores to S04 and the other way round.
    const swapped = new Map([['old-03', 'new-04'], ['old-04', 'new-03']])
    const { renamed, removed } = classify(
      { 'old-03': '03', 'old-04': '04' },
      { 'new-03': '03', 'new-04': '04' },
      swapped
    )
    assert.deepEqual(renamed, [])
    assert.deepEqual(removed.map(({ id }) => id), ['old-03', 'old-04'])
    assert.match(removed[0].reason, /new-04, which is section 04, not section 03/)
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

describe('preservation sentinel CLI: a comparison that cannot run fails', () => {
  // With no base, or one git could not read, the sentinel reported no deletions, skipped every
  // comparison and exited 0 - indistinguishable from a clean run.
  const tempDirs = []
  after(() => {
    for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true })
  })

  /** A repository with one commit: no origin/main to merge-base with, no HEAD~1. */
  function oneCommitRepo() {
    const dir = mkdtempSync(join(tmpdir(), 'sentinel-base-'))
    tempDirs.push(dir)
    const git = (...args) => execFileSync('git', ['-c', 'user.name=sentinel-test',
      '-c', 'user.email=sentinel-test@example.invalid', '-c', 'commit.gpgsign=false', ...args],
    { cwd: dir, encoding: 'utf8' })
    git('init', '-q')
    writeFileSync(join(dir, 'README.md'), 'only commit\n')
    git('add', '-A')
    git('commit', '-q', '-m', 'only commit')
    return dir
  }

  function run(dir, args) {
    const env = { ...process.env }
    for (const key of ['PRESERVATION_BASE', 'GITHUB_BASE_SHA', 'GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE']) {
      delete env[key]
    }
    const done = spawnSync(process.execPath, [SENTINEL, ...args], { cwd: dir, encoding: 'utf8', env })
    const resultPath = join(dir, 'audit/safe-agent/preservation-sentinel-result.json')
    return { status: done.status, result: JSON.parse(readFileSync(resultPath, 'utf8')) }
  }

  it('fails when no base can be resolved', () => {
    const { status, result } = run(oneCommitRepo(), [])
    assert.equal(status, 1)
    assert.deepEqual(result.failures.map((f) => f.code), ['BASE_UNRESOLVED'])
  })

  it('fails when git cannot diff against the base it was given', () => {
    const { status, result } = run(oneCommitRepo(), ['--base', 'deadbeef'.repeat(5)])
    assert.equal(status, 1)
    assert.ok(result.failures.some((f) => f.code === 'BASE_UNREADABLE'), JSON.stringify(result.failures))
  })

  /** A repository whose first commit is a 52-section curriculum the sentinel can read. */
  function curriculumRepo() {
    const dir = mkdtempSync(join(tmpdir(), 'sentinel-compare-'))
    tempDirs.push(dir)
    const git = (...args) => execFileSync('git', ['-c', 'user.name=sentinel-test',
      '-c', 'user.email=sentinel-test@example.invalid', '-c', 'commit.gpgsign=false', ...args],
    { cwd: dir, encoding: 'utf8' }).trim()
    git('init', '-q')
    const pad = (i) => String(i).padStart(2, '0')
    mkdirSync(join(dir, 'src/lib/course/sections'), { recursive: true })
    const numbers = Array.from({ length: 52 }, (_, i) => pad(i + 1))
    writeFileSync(join(dir, 'src/lib/course/index.ts'),
      numbers.map((n) => `import { section${n} } from './sections/s${n}'`).join('\n') + '\n')
    for (const n of numbers) {
      writeFileSync(join(dir, `src/lib/course/sections/s${n}.ts`),
        `export const section${n} = {\n  id: 'section-${n}',\n  index: ${Number(n)},\n}\n`)
    }
    writeFileSync(join(dir, 'src/lib/progress-sanitize.ts'),
      `export const PROGRESS_FIELDS = ${JSON.stringify(PROGRESS_FIELDS)}\n`)
    writeFileSync(join(dir, 'NOTES.md'), 'a tracked file a later commit may delete\n')
    const commit = (message) => {
      git('add', '-A')
      git('commit', '-q', '-m', message)
      return git('rev-parse', 'HEAD')
    }
    return { dir, git, commit, base: commit('52 sections') }
  }

  it('fails when the curriculum cannot be read, even though nothing was deleted', () => {
    // Moving index.ts is the obvious first step of inserting sections into its ordered list.
    // `git diff --diff-filter=D` reads the move as a rename, so no file counts as deleted, and
    // the curriculum compare threw into a warning: the sentinel exited 0 having compared no
    // section and no exercise id.
    const { dir, git, commit, base } = curriculumRepo()
    git('mv', 'src/lib/course/index.ts', 'src/lib/course/course-index.ts')
    commit('move the index')
    assert.match(git('diff', '--name-status', `${base}...HEAD`), /^R\d*\tsrc\/lib\/course\/index\.ts/m,
      'the fixture must be a rename, the case the deletion check cannot see')
    const { status, result } = run(dir, ['--base', base])
    assert.equal(status, 1)
    assert.deepEqual(result.failures.map((f) => f.code), ['CURRICULUM_UNCOMPARABLE'])
  })

  describe('a push that created the branch', () => {
    // GitHub sends forty zeros as `before` when a push creates the branch. That is not a commit:
    // `git diff 0000…...HEAD` failed with BASE_UNREADABLE on the first push of every new branch.
    const ZEROS = '0'.repeat(40)
    const withBase = (base) => ({ PRESERVATION_BASE: base })

    function runEnv(dir, extraEnv) {
      const env = { ...process.env }
      for (const key of ['PRESERVATION_BASE', 'GITHUB_BASE_SHA', 'GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE']) {
        delete env[key]
      }
      const done = spawnSync(process.execPath, [SENTINEL], { cwd: dir, encoding: 'utf8', env: { ...env, ...extraEnv } })
      const resultPath = join(dir, 'audit/safe-agent/preservation-sentinel-result.json')
      return { status: done.status, result: JSON.parse(readFileSync(resultPath, 'utf8')) }
    }

    it('compares against where the branch left origin/main', () => {
      const { dir, git, commit, base } = curriculumRepo()
      git('update-ref', 'refs/remotes/origin/main', base)
      writeFileSync(join(dir, 'README.md'), 'a change on the new branch\n')
      commit('branch work')
      const { status, result } = runEnv(dir, withBase(ZEROS))
      assert.deepEqual(result.failures, [])
      assert.equal(status, 0)
      assert.equal(result.base, base)
    })

    it('still sees a deletion two commits back, which HEAD~1 would miss', () => {
      const { dir, git, commit, base } = curriculumRepo()
      git('update-ref', 'refs/remotes/origin/main', base)
      git('rm', '-q', 'NOTES.md')
      commit('delete a tracked file')
      writeFileSync(join(dir, 'README.md'), 'a later, innocent commit\n')
      commit('branch work')
      const { status, result } = runEnv(dir, withBase(ZEROS))
      assert.equal(status, 1)
      assert.equal(result.base, base)
      assert.deepEqual(result.failures.map((f) => f.code), ['UNAUTHORIZED_DELETE'])
    })

    it('fails unresolved when there is no origin/main, rather than settling for HEAD~1', () => {
      const { dir, commit } = curriculumRepo()
      writeFileSync(join(dir, 'README.md'), 'a change\n')
      commit('branch work')
      const { status, result } = runEnv(dir, withBase(ZEROS))
      assert.equal(status, 1)
      assert.deepEqual(result.failures.map((f) => f.code), ['BASE_UNRESOLVED'])
    })
  })
})
