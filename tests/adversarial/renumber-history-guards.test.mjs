/**
 * Contracts for the renumber history guards (design step 0b-1, design_ruled_final.md §4).
 *
 * Every guard is proven on fixtures: a throwaway git repository built inside the OS temp
 * directory, never inside this checkout (the adversarial runner fails a test that writes into
 * the tree). The fixtures are real git history, so the depth-1 `file://` clone case is real too.
 *
 * Covered here: the sentinel's section count comes from the HEAD roadmap (sentinel :159);
 * G-11 and G-15 in scripts/preservation/renumber_meaning_guard.mjs; G-14 in
 * scripts/preservation/curriculum55_freeze_guard.mjs.
 */
import { after, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PROGRESS_FIELDS } from '../../src/lib/progress-sanitize.ts'
import {
  ROADMAP_PATH,
  roadmapSectionCount,
} from '../../scripts/preservation/roadmap_section_count.mjs'
import {
  EXAM_BANK_PATTERN,
  FROZEN_PATHS,
  sectionFieldsOf,
} from '../../scripts/preservation/curriculum55_freeze_guard.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..')
const SENTINEL = join(ROOT, 'scripts/preservation_sentinel.mjs')
const REAL_ROADMAP = readFileSync(join(ROOT, ROADMAP_PATH), 'utf8')

const tempDirs = []
after(() => {
  for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true })
})

const IDENTITY = ['-c', 'user.name=history-test', '-c', 'user.email=history-test@example.invalid', '-c', 'commit.gpgsign=false']

/** A git call in `dir`. Commands are plain argv, so a fixture can never reach this checkout. */
function git(dir, ...args) {
  return execFileSync('git', [...IDENTITY, ...args], { cwd: dir, encoding: 'utf8' }).trim()
}

function newRepo() {
  const dir = mkdtempSync(join(tmpdir(), 'renumber-history-'))
  tempDirs.push(dir)
  git(dir, 'init', '-q', '-b', 'main')
  return dir
}

/** Roadmap markdown with one `### S<n> — ` heading per number, in the order given. */
function roadmapWith(numbers) {
  return numbers.map((n) => `### S${n} — Sección ${n}\n\nTexto.\n`).join('\n')
}

/**
 * A curriculum tree the sentinel can read: `count` imported sections, each with a stable id,
 * plus the progress contract and (when given) a roadmap. Returns the commit sha.
 */
function commitTree(dir, { count, roadmap }, message) {
  const pad = (i) => String(i).padStart(2, '0')
  mkdirSync(join(dir, 'src/lib/course/sections'), { recursive: true })
  const imports = Array.from({ length: count }, (_, i) => `import { section${pad(i + 1)} } from './sections/s${pad(i + 1)}'`)
  writeFileSync(join(dir, 'src/lib/course/index.ts'), imports.join('\n') + '\n')
  for (let i = 1; i <= count; i++) {
    const body = `export const section${pad(i)} = {\n  id: 'sec-${pad(i)}',\n  index: ${i},\n}\n`
    writeFileSync(join(dir, `src/lib/course/sections/s${pad(i)}.ts`), body)
  }
  writeFileSync(join(dir, 'src/lib/progress-sanitize.ts'), `export const PROGRESS_FIELDS = ${JSON.stringify(PROGRESS_FIELDS)}\n`)
  // A null roadmap is a deletion: `git add -A` must stage the removal, or the old file stays in HEAD.
  if (roadmap === null) rmSync(join(dir, ROADMAP_PATH), { force: true })
  else writeFileSync(join(dir, ROADMAP_PATH), roadmap)
  git(dir, 'add', '-A')
  git(dir, 'commit', '-q', '--allow-empty', '-m', message)
  return git(dir, 'rev-parse', 'HEAD')
}

/** Run the real sentinel CLI in `dir` against `base`, with the CI environment variables removed. */
function runSentinel(dir, base) {
  const env = { ...process.env }
  for (const key of ['PRESERVATION_BASE', 'GITHUB_BASE_SHA', 'GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE']) {
    delete env[key]
  }
  const run = spawnSync(process.execPath, [SENTINEL, '--base', base], { cwd: dir, encoding: 'utf8', env })
  const result = JSON.parse(readFileSync(join(dir, 'audit/safe-agent/preservation-sentinel-result.json'), 'utf8'))
  return { status: run.status, result }
}

const codes = (result) => result.failures.map((f) => f.code)

describe('roadmapSectionCount', () => {
  it('counts the real roadmap as the 52 sections its headings declare', () => {
    const headings = REAL_ROADMAP.match(/^### S\d+ — /gm) ?? []
    assert.equal(roadmapSectionCount(REAL_ROADMAP), 52)
    assert.equal(roadmapSectionCount(REAL_ROADMAP), headings.length)
  })

  it('counts the headings of any consecutive run, whatever the number it reaches', () => {
    assert.equal(roadmapSectionCount(roadmapWith([1, 2, 3])), 3)
    assert.equal(roadmapSectionCount(roadmapWith(Array.from({ length: 55 }, (_, i) => i + 1))), 55)
  })

  it('refuses a roadmap with a gap, a repeat, or no section headings at all', () => {
    assert.throws(() => roadmapSectionCount(roadmapWith([1, 2, 4])), /S3/)
    assert.throws(() => roadmapSectionCount(roadmapWith([1, 1, 2])), /S2|S1/)
    assert.throws(() => roadmapSectionCount('# Sin secciones\n'), /no section headings/)
  })
})

describe('preservation sentinel: the section count comes from the HEAD roadmap', () => {
  it('passes a 55-section tree whose roadmap declares 55, which the old literal 52 failed', () => {
    const dir = newRepo()
    const base = commitTree(dir, { count: 52, roadmap: roadmapWith(seq(52)) }, 'curriculum 52')
    commitTree(dir, { count: 55, roadmap: roadmapWith(seq(55)) }, 'curriculum 55')
    const { status, result } = runSentinel(dir, base)
    assert.deepEqual(codes(result), [])
    assert.equal(status, 0)
    assert.equal(result.curriculum.expected_count, 55)
  })

  it('fails a tree whose imported sections differ from the roadmap headings it declares', () => {
    const dir = newRepo()
    const base = commitTree(dir, { count: 52, roadmap: roadmapWith(seq(52)) }, 'curriculum 52')
    commitTree(dir, { count: 52, roadmap: roadmapWith(seq(53)) }, 'roadmap says 53, tree has 52')
    const { status, result } = runSentinel(dir, base)
    assert.equal(status, 1)
    assert.ok(codes(result).includes('ACTIVE_SECTION_COUNT_NOT_ROADMAP'), codes(result).join(','))
    assert.equal(result.curriculum.expected_count, 53)
  })

  it('fails closed when the HEAD roadmap is missing, rather than comparing against a guessed count', () => {
    const dir = newRepo()
    const base = commitTree(dir, { count: 52, roadmap: roadmapWith(seq(52)) }, 'curriculum 52')
    commitTree(dir, { count: 52, roadmap: null }, 'roadmap deleted')
    const { status, result } = runSentinel(dir, base)
    assert.equal(status, 1)
    assert.ok(codes(result).includes('ROADMAP_UNREADABLE'), codes(result).join(','))
  })
})

function seq(n) {
  return Array.from({ length: n }, (_, i) => i + 1)
}

// ---------------------------------------------------------------------------------------------
// G-11 and G-15: scripts/preservation/renumber_meaning_guard.mjs
// ---------------------------------------------------------------------------------------------

const GUARD = join(ROOT, 'scripts/preservation/renumber_meaning_guard.mjs')
const SECTIONS = 'src/lib/course/sections'
const WINDOW = 'audit/safe-agent/curriculum55_window.json'
const EPOCH = 'audit/safe-agent/renumber_epoch.json'
const REQUIREMENTS = 'requirements-content.txt'
const BRANCH = 'curriculum/55'

const pad2 = (n) => String(n).padStart(2, '0')
/** Written out here, not derived from the module under test, so a bug there cannot hide in the fixture. */
const OLD_SUFFIXES = ['T1-A-E1', 'T1-A-E2']
const GRID_SUFFIXES = [1, 2, 3, 4].flatMap((t) => ['A', 'B'].flatMap((z) => [1, 2, 3].map((e) => `T${t}-${z}-E${e}`)))

function sectionFile({ slug, index, suffixes, title = `Sección ${index}` }) {
  const steps = suffixes.map((s) => `    { id: 'S${pad2(index)}-${s}', title: 'ejercicio ${s}' },`).join('\n')
  return `export const section = {\n  id: '${slug}',\n  index: ${index},\n  title: '${title}',\n  phase: 1,\n  weDo: {\n    steps: [\n${steps}\n    ],\n  },\n}\n`
}

function indexFile(stems) {
  return stems.map((stem, i) => `import { section${pad2(i + 1)} } from './sections/${stem}'`).join('\n') + '\n'
}

const sectionPath = (stem) => `${SECTIONS}/${stem}.ts`

/** The pre-renumber curriculum: old S19 and S33 are the sections the renumber moves. */
function preTree() {
  return new Map([
    ['src/lib/course/index.ts', indexFile(['s01-alpha', 's18-eighteen', 's19-oldnineteen', 's33-thirtythree'])],
    [sectionPath('s01-alpha'), sectionFile({ slug: 'alpha', index: 1, suffixes: OLD_SUFFIXES })],
    [sectionPath('s18-eighteen'), sectionFile({ slug: 'eighteen', index: 18, suffixes: OLD_SUFFIXES })],
    [sectionPath('s19-oldnineteen'), sectionFile({ slug: 'oldnineteen', index: 19, suffixes: OLD_SUFFIXES })],
    [sectionPath('s33-thirtythree'), sectionFile({ slug: 'thirtythree', index: 33, suffixes: OLD_SUFFIXES })],
    [ROADMAP_PATH, roadmapWith(seq(4))],
    [REQUIREMENTS, 'Requisito base\n'],
  ])
}

/**
 * The renumber by f, written out by hand: old 19 -> 21, old 33 -> 36, and new sections 19, 20 and 35
 * with the full grid. `roadmap` and `overrides` let one case break exactly one thing.
 */
function postTree({ roadmap = roadmapWith(seq(7)), overrides = new Map() } = {}) {
  const tree = new Map([
    ['src/lib/course/index.ts', indexFile(['s01-alpha', 's18-eighteen', 's21-oldnineteen', 's36-thirtythree', 's19-inference', 's20-design', 's35-regression'])],
    [sectionPath('s01-alpha'), sectionFile({ slug: 'alpha', index: 1, suffixes: OLD_SUFFIXES })],
    [sectionPath('s18-eighteen'), sectionFile({ slug: 'eighteen', index: 18, suffixes: OLD_SUFFIXES })],
    [sectionPath('s21-oldnineteen'), sectionFile({ slug: 'oldnineteen', index: 21, suffixes: OLD_SUFFIXES })],
    [sectionPath('s36-thirtythree'), sectionFile({ slug: 'thirtythree', index: 36, suffixes: OLD_SUFFIXES })],
    [sectionPath('s19-inference'), sectionFile({ slug: 'inference', index: 19, suffixes: GRID_SUFFIXES })],
    [sectionPath('s20-design'), sectionFile({ slug: 'design', index: 20, suffixes: GRID_SUFFIXES })],
    [sectionPath('s35-regression'), sectionFile({ slug: 'regression', index: 35, suffixes: GRID_SUFFIXES })],
    [ROADMAP_PATH, roadmap],
    [REQUIREMENTS, 'Requisito base\n'],
  ])
  for (const [path, text] of overrides) {
    if (text === null) tree.delete(path)
    else tree.set(path, text)
  }
  return tree
}

const DEFAULT_EPOCH = (sha) => ({
  schema: 'renumber_epoch/1',
  renumber_sha: sha,
  new_slugs: [{ slug: 'inference', index: 19 }, { slug: 'design', index: 20 }, { slug: 'regression', index: 35 }],
})

function applyEdits(dir, edits) {
  for (const [path, text] of edits) {
    if (text === null) rmSync(join(dir, path), { force: true })
    else {
      mkdirSync(dirname(join(dir, path)), { recursive: true })
      writeFileSync(join(dir, path), text)
    }
  }
}

/**
 * Make the curriculum hold exactly `tree`: every other tracked curriculum file is removed, then the
 * tree is written. The audit/ state (window, epoch) is not curriculum and survives a renumber.
 */
function writeTree(dir, tree) {
  const tracked = git(dir, 'ls-files').split('\n').filter(Boolean)
  const stale = tracked.filter((p) => !tree.has(p) && !p.startsWith('audit/'))
  applyEdits(dir, new Map(stale.map((p) => [p, null])))
  applyEdits(dir, tree)
}

const commitAll = (dir, message) => {
  git(dir, 'add', '-A')
  git(dir, 'commit', '-q', '--allow-empty', '-m', message)
  return git(dir, 'rev-parse', 'HEAD')
}

function windowJson(branchPoint, ledger = []) {
  return JSON.stringify({
    schema: 'curriculum55_window/1',
    status: 'open',
    branch: BRANCH,
    branch_point_sha: branchPoint,
    overrides: [],
    ledger,
  }, null, 2) + '\n'
}

/**
 * A history shaped like the real window: P on main, W adds the window file (branch point P),
 * the branch cut from W carries R (the renumber) and then E (the epoch, naming R). Options add
 * commits: `branchEdits` and `mainEdits` apply Maps of path -> text (null deletes), `post` replaces
 * the renumber's tree, `epoch` returns the epoch object for a sha (null means no epoch file),
 * `squashed` puts the renumber on a side branch that the branch never merges, and `mergeToMain`
 * lands the branch on main (the retirement case). Returns the shas and the directory.
 */
const SCENARIO_DEFAULTS = {
  post: null,
  epoch: DEFAULT_EPOCH,
  branchEdits: [],
  ledger: null,
  mainEdits: null,
  windowOn: true,
  squashed: false,
  mergeToMain: false,
}

/** Main's pre-renumber history, and the window file opened on it when `windowOn`. Returns the pre sha. */
function commitPreRenumber(dir, windowOn) {
  writeTree(dir, preTree())
  const pre = commitAll(dir, 'curriculum 52, pre-renumber')
  if (windowOn) {
    applyEdits(dir, new Map([[WINDOW, windowJson(pre)]]))
    commitAll(dir, 'open the window')
  }
  return pre
}

/** The renumber commit on the branch. `squashed` makes a side-branch commit the branch then re-makes. */
function commitRenumber(dir, pre, post, squashed) {
  if (!squashed) {
    writeTree(dir, post)
    return commitAll(dir, 'renumber by f')
  }
  git(dir, 'switch', '-q', '-c', 'side', pre)
  writeTree(dir, post)
  const sideSha = commitAll(dir, 'renumber by f, on a side branch')
  git(dir, 'switch', '-q', BRANCH)
  writeTree(dir, post)
  commitAll(dir, 'renumber by f, squashed onto the branch')
  return sideSha
}

/** Branch commits after the renumber: the epoch, the edits, and the ledger rows, in that order. */
function commitBranchSteps(dir, { epoch, renumber, branchEdits, ledger, pre }) {
  if (epoch !== null) {
    applyEdits(dir, new Map([[EPOCH, JSON.stringify(epoch(renumber), null, 2) + '\n']]))
    commitAll(dir, 'renumber epoch')
  }
  for (const edits of branchEdits) {
    applyEdits(dir, edits)
    commitAll(dir, 'branch edit')
  }
  if (ledger !== null) {
    applyEdits(dir, new Map([[WINDOW, windowJson(pre, ledger)]]))
    commitAll(dir, 'ledger rows')
  }
}

/** Main's own commit after the window opened, and optionally the branch landing on main. */
function landOnMain(dir, { mainEdits, mergeToMain }) {
  if (mainEdits !== null) {
    git(dir, 'switch', '-q', 'main')
    applyEdits(dir, mainEdits)
    commitAll(dir, 'main edit')
    git(dir, 'switch', '-q', BRANCH)
  }
  if (mergeToMain) {
    git(dir, 'switch', '-q', 'main')
    git(dir, 'merge', '-q', '--no-ff', '-m', 'land the renumber', BRANCH)
    git(dir, 'switch', '-q', BRANCH)
  }
}

/** The fixture the doc comment above describes. `post` defaults to the renumber by f. */
function scenario(options = {}) {
  const opts = { ...SCENARIO_DEFAULTS, ...options }
  const dir = newRepo()
  const pre = commitPreRenumber(dir, opts.windowOn)
  git(dir, 'switch', '-q', '-c', BRANCH)
  const renumber = commitRenumber(dir, pre, opts.post ?? postTree(), opts.squashed)
  commitBranchSteps(dir, { ...opts, renumber, pre })
  landOnMain(dir, opts)
  return { dir, pre, renumber }
}

function runGuard(dir) {
  const env = { ...process.env }
  for (const key of ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE']) delete env[key]
  const run = spawnSync(process.execPath, [GUARD], { cwd: dir, encoding: 'utf8', env })
  return { status: run.status, out: run.stdout, err: run.stderr }
}

const withFindingCode = (run, code) => new RegExp(`"code": "${code}"`).test(run.err)

describe('renumber guard: the pure rules', () => {
  it('maps every section by f: 1..18 stay, 19..32 move +2, 33..52 move +3', async () => {
    const { mapSectionNumber } = await import('../../scripts/preservation/curriculum_snapshot.mjs')
    assert.equal(mapSectionNumber(1), 1)
    assert.equal(mapSectionNumber(18), 18)
    assert.equal(mapSectionNumber(19), 21)
    assert.equal(mapSectionNumber(32), 34)
    assert.equal(mapSectionNumber(33), 36)
    assert.equal(mapSectionNumber(52), 55)
    assert.throws(() => mapSectionNumber(53), RangeError)
  })

  it('maps S-tokens in a line by f, and leaves words that only contain an S-number alone', async () => {
    const { mapTokens, hasTokenAtOrAbove } = await import('../../scripts/preservation/curriculum_snapshot.mjs')
    // S7 has one digit, so it is not a section token and stays as written.
    assert.equal(mapTokens('ver S19-T1-A-E1 y S33; PS19 y S7'), 'ver S21-T1-A-E1 y S36; PS19 y S7')
    assert.equal(hasTokenAtOrAbove('solo S18 aquí', 19), false)
    assert.equal(hasTokenAtOrAbove('desde S19 en adelante', 19), true)
  })

  it('builds the 24-id grid, each id once', async () => {
    const { gridFor } = await import('../../scripts/preservation/curriculum_snapshot.mjs')
    const grid = gridFor(19)
    assert.equal(grid.length, 24)
    assert.equal(new Set(grid).size, 24)
    assert.deepEqual(grid, GRID_SUFFIXES.map((s) => `S19-${s}`))
  })

  it('reads the added lines of a unified diff, and no removed line', async () => {
    const { parseAddedLines } = await import('../../scripts/preservation/history.mjs')
    const diff = 'diff --git a/c.md b/c.md\n--- a/c.md\n+++ b/c.md\n@@ -1 +1,2 @@\n-old\n+new S25\n+other\n'
    assert.deepEqual([...parseAddedLines(diff)], [['c.md', ['new S25', 'other']]])
  })
})

describe('renumber guard: dormant until the epoch exists', () => {
  it('prints DORMANT and passes on a history with no epoch file', () => {
    const { dir } = scenario({ epoch: null })
    const run = runGuard(dir)
    assert.equal(run.status, 0, run.err)
    assert.match(run.out, /DORMANT/)
  })
})

describe('renumber guard: the good renumber, and each bad state red', () => {
  it('passes the renumber by f, with its epoch and an empty window', () => {
    const run = runGuard(scenario().dir)
    assert.equal(run.status, 0, run.err)
    assert.match(run.out, /RENUMBER MEANING GUARD OK/)
  })

  it('fails HISTORY_MISSING on a depth-1 file:// clone, the way CI would read a shallow checkout', () => {
    const { dir } = scenario()
    const clone = mkdtempSync(join(tmpdir(), 'renumber-shallow-'))
    tempDirs.push(clone)
    execFileSync('git', ['clone', '-q', '--depth', '1', '--branch', BRANCH, `file://${dir}`, clone])
    const run = runGuard(clone)
    assert.equal(run.status, 1)
    assert.ok(withFindingCode(run, 'HISTORY_MISSING'), run.err)
    assert.match(run.err, /repository is shallow/)
  })

  it('fails RENUMBER_SHA_NOT_IN_HEAD when the recorded renumber was squashed into another commit', () => {
    const run = runGuard(scenario({ squashed: true }).dir)
    assert.equal(run.status, 1)
    assert.ok(withFindingCode(run, 'RENUMBER_SHA_NOT_IN_HEAD'), run.err)
  })

  it('fails ID_BOUND_OFF_MAP when old section 33 lands at index 37 instead of f(33)=36', () => {
    // The ids keep S36, so only the index is off: the index check must fire on its own.
    const text = sectionFile({ slug: 'thirtythree', index: 37, suffixes: OLD_SUFFIXES }).replaceAll('S37-', 'S36-')
    const run = runGuard(scenario({ post: postTree({ overrides: new Map([[sectionPath('s36-thirtythree'), text]]) }) }).dir)
    assert.equal(run.status, 1)
    assert.ok(withFindingCode(run, 'ID_BOUND_OFF_MAP'), run.err)
    assert.match(run.err, /"expected": 36,\s*"found": 37/)
  })

  it('fails PAIR_ADDED when the renumber gives an old section an exercise it did not have', () => {
    const extra = [...OLD_SUFFIXES, 'T1-A-E3']
    const post = postTree({ overrides: new Map([[sectionPath('s01-alpha'), sectionFile({ slug: 'alpha', index: 1, suffixes: extra })]]) })
    const run = runGuard(scenario({ post }).dir)
    assert.equal(run.status, 1)
    assert.ok(withFindingCode(run, 'PAIR_ADDED'), run.err)
  })

  it('fails NEW_SLUG_MISSING when the epoch declares a section the renumber never wrote', () => {
    const post = postTree({ overrides: new Map([[sectionPath('s35-regression'), null]]), roadmap: roadmapWith(seq(6)) })
    const stems = ['s01-alpha', 's18-eighteen', 's21-oldnineteen', 's36-thirtythree', 's19-inference', 's20-design']
    post.set('src/lib/course/index.ts', indexFile(stems))
    const run = runGuard(scenario({ post }).dir)
    assert.equal(run.status, 1)
    assert.ok(withFindingCode(run, 'NEW_SLUG_MISSING'), run.err)
  })

  it('fails EPOCH_INVALID for an epoch whose renumber_sha is not a commit sha', () => {
    const run = runGuard(scenario({ epoch: (sha) => ({ ...DEFAULT_EPOCH(sha), renumber_sha: 'main' }) }).dir)
    assert.equal(run.status, 1)
    assert.ok(withFindingCode(run, 'EPOCH_INVALID'), run.err)
  })

  it('fails LEDGER_ROW_INVALID for a row whose kind the window does not allow', () => {
    const run = runGuard(scenario({ ledger: [{ path: REQUIREMENTS, kind: 'banana', reason: 'x' }] }).dir)
    assert.equal(run.status, 1)
    assert.ok(withFindingCode(run, 'LEDGER_ROW_INVALID'), run.err)
  })

  it('fails ID_BOUND_OFF_MAP when an id keeps its old number after the section moved', () => {
    const stale = sectionFile({ slug: 'thirtythree', index: 36, suffixes: OLD_SUFFIXES }).replaceAll('S36-', 'S33-')
    const post = postTree({ overrides: new Map([[sectionPath('s36-thirtythree'), stale]]) })
    const run = runGuard(scenario({ post }).dir)
    assert.equal(run.status, 1)
    assert.ok(withFindingCode(run, 'ID_BOUND_OFF_MAP'), run.err)
  })

  it('fails PAIR_MISSING when a (slug, suffix) pair vanishes in the renumber', () => {
    const post = postTree({
      overrides: new Map([[sectionPath('s01-alpha'), sectionFile({ slug: 'alpha', index: 1, suffixes: ['T1-A-E1'] })]]),
    })
    const run = runGuard(scenario({ post }).dir)
    assert.equal(run.status, 1)
    assert.ok(withFindingCode(run, 'PAIR_MISSING'), run.err)
    assert.match(run.err, /T1-A-E2/)
  })

  it('fails GRID_INCOMPLETE when a new section has 23 of its 24 exercises', () => {
    const post = postTree({
      overrides: new Map([[sectionPath('s20-design'), sectionFile({ slug: 'design', index: 20, suffixes: GRID_SUFFIXES.slice(0, 23) })]]),
    })
    const run = runGuard(scenario({ post }).dir)
    assert.equal(run.status, 1)
    assert.ok(withFindingCode(run, 'GRID_INCOMPLETE'), run.err)
  })

  it('fails UNDECLARED_SLUG for a section the epoch does not name', () => {
    // Imported and counted, so the only finding is that the epoch never declared the slug.
    const stems = ['s01-alpha', 's18-eighteen', 's21-oldnineteen', 's36-thirtythree', 's19-inference', 's20-design', 's35-regression', 's40-extra']
    const post = postTree({
      overrides: new Map([
        ['src/lib/course/index.ts', indexFile(stems)],
        [sectionPath('s40-extra'), sectionFile({ slug: 'extra', index: 40, suffixes: GRID_SUFFIXES })],
      ]),
      roadmap: roadmapWith(seq(8)),
    })
    const run = runGuard(scenario({ post }).dir)
    assert.equal(run.status, 1)
    assert.ok(withFindingCode(run, 'UNDECLARED_SLUG'), run.err)
  })

  it('fails MOVED_FILE_UNLEDGERED when a moved section changes after the renumber with no ledger row', () => {
    const edit = new Map([[sectionPath('s36-thirtythree'), sectionFile({ slug: 'thirtythree', index: 36, suffixes: OLD_SUFFIXES, title: 'Sección 36 editada' })]])
    const run = runGuard(scenario({ branchEdits: [edit] }).dir)
    assert.equal(run.status, 1)
    assert.ok(withFindingCode(run, 'MOVED_FILE_UNLEDGERED'), run.err)
  })

  it('passes the same change once an authoring ledger row names it', () => {
    const path = sectionPath('s36-thirtythree')
    const edit = new Map([[path, sectionFile({ slug: 'thirtythree', index: 36, suffixes: OLD_SUFFIXES, title: 'Sección 36 editada' })]])
    const ledger = [{ path, kind: 'authoring', reason: 'edición de prueba' }]
    const run = runGuard(scenario({ branchEdits: [edit], ledger }).dir)
    assert.equal(run.status, 0, run.err)
  })

  it('fails LEDGER_ROW_WITHOUT_DIFF for a row that describes a file nobody changed', () => {
    const ledger = [{ path: sectionPath('s01-alpha'), kind: 'authoring', reason: 'sin cambio' }]
    const run = runGuard(scenario({ ledger }).dir)
    assert.equal(run.status, 1)
    assert.ok(withFindingCode(run, 'LEDGER_ROW_WITHOUT_DIFF'), run.err)
  })

  it('fails SECTION_COUNT_NOT_ROADMAP when the roadmap at the renumber declares six sections for seven', () => {
    const post = postTree({ roadmap: roadmapWith(seq(6)) })
    const run = runGuard(scenario({ post }).dir)
    assert.equal(run.status, 1)
    assert.ok(withFindingCode(run, 'SECTION_COUNT_NOT_ROADMAP'), run.err)
  })

  it('fails WINDOW_MISSING when the epoch exists but no window file was ever committed', () => {
    const run = runGuard(scenario({ windowOn: false }).dir)
    assert.equal(run.status, 1)
    assert.ok(withFindingCode(run, 'WINDOW_MISSING'), run.err)
  })

  it('fails CARRIED_TOKEN_UNMAPPED when main adds S25 and the branch does not carry it as S27', () => {
    const mainEdits = new Map([[REQUIREMENTS, 'Requisito base\n- Requisito de la sección S25 (ver S25-T1-A-E1)\n']])
    const run = runGuard(scenario({ mainEdits }).dir)
    assert.equal(run.status, 1)
    assert.ok(withFindingCode(run, 'CARRIED_TOKEN_UNMAPPED'), run.err)
  })

  it('passes when the branch carries the line mapped by f (S25 becomes S27)', () => {
    const mainEdits = new Map([[REQUIREMENTS, 'Requisito base\n- Requisito de la sección S25 (ver S25-T1-A-E1)\n']])
    const carried = new Map([[REQUIREMENTS, 'Requisito base\n- Requisito de la sección S27 (ver S27-T1-A-E1)\n']])
    const run = runGuard(scenario({ mainEdits, branchEdits: [carried] }).dir)
    assert.equal(run.status, 0, run.err)
  })

  it('passes a verbatim line when a carried_from_main row names it', () => {
    const line = '- Requisito de la sección S25 (ver S25-T1-A-E1)'
    const mainEdits = new Map([[REQUIREMENTS, `Requisito base\n${line}\n`]])
    const branchEdits = [new Map([[REQUIREMENTS, `Requisito base\n${line}\n`]])]
    const ledger = [{ path: REQUIREMENTS, kind: 'carried_from_main', line, reason: 'línea sin renumerar' }]
    const run = runGuard(scenario({ mainEdits, branchEdits, ledger }).dir)
    assert.equal(run.status, 0, run.err)
  })

  it('stands down (d) and G-15 once the renumber is on main, and reports that it did', () => {
    const edit = new Map([[sectionPath('s36-thirtythree'), sectionFile({ slug: 'thirtythree', index: 36, suffixes: OLD_SUFFIXES, title: 'Sección 36 editada' })]])
    const run = runGuard(scenario({ branchEdits: [edit], mergeToMain: true }).dir)
    assert.equal(run.status, 0, run.err)
    assert.match(run.out, /G-11\(d\)/)
  })
})

// ---------------------------------------------------------------------------------------------
// G-14: scripts/preservation/curriculum55_freeze_guard.mjs
// ---------------------------------------------------------------------------------------------

const FREEZE = join(ROOT, 'scripts/preservation/curriculum55_freeze_guard.mjs')
const BANK = 'course-state/s19_phase5_exam_bank.json'

function freezeWindow(branchPoint, { status = 'open', overrides = [], renumberSha } = {}) {
  const body = { schema: 'curriculum55_window/1', status, branch: BRANCH, branch_point_sha: branchPoint, overrides, ledger: [] }
  if (renumberSha !== undefined) body.renumber_sha = renumberSha
  return JSON.stringify(body, null, 2) + '\n'
}

/**
 * Main, with the window opened on it (branch point: the commit before the window), then `mainEdits`
 * committed on main. The guard runs at HEAD, which is main.
 */
function freezeScenario({ mainEdits = null, window = {}, windowOn = true } = {}) {
  const dir = newRepo()
  writeTree(dir, preTree())
  const pre = commitAll(dir, 'curriculum 52, pre-window')
  if (windowOn) {
    applyEdits(dir, new Map([[WINDOW, freezeWindow(pre, window)]]))
    commitAll(dir, 'open the window')
  }
  if (mainEdits !== null) {
    applyEdits(dir, mainEdits)
    commitAll(dir, 'main edit')
  }
  return { dir, pre }
}

const epochNaming = (sha) => ({ schema: 'renumber_epoch/1', renumber_sha: sha, new_slugs: [] })

/**
 * The shape of a pull request run: the window is open on main, the change under review sits on a
 * branch ahead of main, and HEAD is that branch (origin/main, here `main`, does not hold the change).
 * `edits(pre)` returns the branch's Map of path -> text; `epoch` also commits an epoch file on the
 * branch (the renumbered curriculum/55); `mainEdits` lands on main after the branch was cut.
 */
function pullRequestScenario({ edits, epoch = false, mainEdits = null }) {
  const { dir, pre } = freezeScenario()
  git(dir, 'switch', '-q', '-c', 'pr')
  const changes = edits(pre)
  if (epoch) changes.set(EPOCH, JSON.stringify(epochNaming(pre), null, 2) + '\n')
  applyEdits(dir, changes)
  commitAll(dir, 'the change under review')
  if (mainEdits !== null) {
    git(dir, 'switch', '-q', 'main')
    applyEdits(dir, mainEdits)
    commitAll(dir, 'main moves on')
    git(dir, 'switch', '-q', 'pr')
  }
  return { dir, pre }
}

/**
 * A repository whose window is closed. `renumber` is the commit the epoch records; with `onSide` it
 * sits on a side branch that HEAD never merges. `windowSha` and `epoch` take that sha and return what
 * the window names and what the epoch holds (null: no epoch file).
 */
function closedScenario({ epoch = epochNaming, windowSha = (sha) => sha, onSide = false } = {}) {
  const { dir, pre } = freezeScenario({ windowOn: false })
  let renumber
  if (onSide) {
    git(dir, 'switch', '-q', '-c', 'side', pre)
    applyEdits(dir, new Map([['docs/lado.md', 'renumber en otra rama\n']]))
    renumber = commitAll(dir, 'renumber on a side branch')
    git(dir, 'switch', '-q', 'main')
  } else {
    applyEdits(dir, new Map([['docs/renumber.md', 'renumber por f\n']]))
    renumber = commitAll(dir, 'renumber by f')
  }
  const edits = new Map([[WINDOW, freezeWindow(pre, { status: 'closed', renumberSha: windowSha(renumber) })]])
  const state = epoch(renumber)
  if (state !== null) edits.set(EPOCH, JSON.stringify(state, null, 2) + '\n')
  applyEdits(dir, edits)
  commitAll(dir, 'close the window')
  return { dir, renumber }
}

function runFreeze(dir) {
  const env = { ...process.env }
  for (const key of ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE']) delete env[key]
  const run = spawnSync(process.execPath, [FREEZE], { cwd: dir, encoding: 'utf8', env })
  return { status: run.status, out: run.stdout, err: run.stderr }
}

describe('freeze guard: the real tree and its pure rules', () => {
  it('names only frozen paths that exist, so the freeze cannot silently cover nothing', () => {
    for (const path of FROZEN_PATHS) assert.ok(existsSync(join(ROOT, path)), `missing frozen path ${path}`)
  })

  it('matches every real exam bank, and no other course-state file', () => {
    const banks = readdirSync(join(ROOT, 'course-state')).filter((f) => EXAM_BANK_PATTERN.test(`course-state/${f}`))
    assert.ok(banks.length >= 52, `expected at least 52 exam banks, found ${banks.length}`)
    assert.equal(EXAM_BANK_PATTERN.test('course-state/s19_phase5_exam_bank.json.bak'), false)
    assert.equal(EXAM_BANK_PATTERN.test('course-state/s1_phase5_exam_bank.json'), false)
  })

  it('reads the fields a section freezes: id, index, title, phase, exercise ids and figure ids', () => {
    const text = [
      'export const section = {',
      "  id: 'demo',",
      '  index: 19,',
      '  title: "Título con comillas",',
      '  phase: 1,',
      '  weDo: { steps: [ { id: \'S19-T1-A-E1\' }, { id: \'S19-T1-A-E1\' }, { id: \'S19-T2-B-E3\' } ] },',
      '  figure: { id: "S19-fig" },',
      '}',
    ].join('\n')
    assert.deepEqual(sectionFieldsOf(text), {
      id: 'demo',
      index: '19',
      title: 'Título con comillas',
      phase: '1',
      exerciseIds: ['S19-T1-A-E1', 'S19-T2-B-E3'],
      figureIds: ['S19-fig'],
    })
  })
})

describe('freeze guard: dormant, and the window cannot disappear quietly', () => {
  it('prints DORMANT when no window file has ever been committed', () => {
    const run = runFreeze(freezeScenario({ windowOn: false }).dir)
    assert.equal(run.status, 0, run.err)
    assert.match(run.out, /DORMANT/)
  })

  it('fails WINDOW_REMOVED when the window file was committed and is now gone', () => {
    const run = runFreeze(freezeScenario({ mainEdits: new Map([[WINDOW, null]]) }).dir)
    assert.equal(run.status, 1)
    assert.ok(withFindingCode(run, 'WINDOW_REMOVED'), run.err)
  })
})

describe('freeze guard: while open, main may not change what the renumber rewrites', () => {
  it('passes an open window with no change to a frozen item', () => {
    const run = runFreeze(freezeScenario({ mainEdits: new Map([['docs/nota.md', 'texto libre\n']]) }).dir)
    assert.equal(run.status, 0, run.err)
    assert.match(run.out, /FREEZE GUARD OK/)
  })

  it('fails FROZEN_CHANGED when a roadmap changes on main with no override', () => {
    const run = runFreeze(freezeScenario({ mainEdits: new Map([['learning_roadmap.md', 'cambio\n']]) }).dir)
    assert.equal(run.status, 1)
    assert.ok(withFindingCode(run, 'FROZEN_CHANGED'), run.err)
    assert.match(run.err, /learning_roadmap\.md/)
  })

  it('passes the same change once an owner override names its path, reason and approval', () => {
    const window = { overrides: [{ path: 'learning_roadmap.md', reason: 'erratum de la hoja', owner_approval: 'O17' }] }
    const run = runFreeze(freezeScenario({ mainEdits: new Map([['learning_roadmap.md', 'cambio\n']]), window }).dir)
    assert.equal(run.status, 0, run.err)
  })

  it('does not count an override that lacks its owner approval', () => {
    const window = { overrides: [{ path: 'learning_roadmap.md', reason: 'erratum de la hoja' }] }
    const run = runFreeze(freezeScenario({ mainEdits: new Map([['learning_roadmap.md', 'cambio\n']]), window }).dir)
    assert.equal(run.status, 1)
    assert.ok(withFindingCode(run, 'OVERRIDE_INVALID'), run.err)
    assert.ok(withFindingCode(run, 'FROZEN_CHANGED'), run.err)
  })

  it('fails FROZEN_SECTION_FIELD_CHANGED when section 19 changes its title on main', () => {
    const edit = sectionFile({ slug: 'oldnineteen', index: 19, suffixes: OLD_SUFFIXES, title: 'Título nuevo' })
    const run = runFreeze(freezeScenario({ mainEdits: new Map([[sectionPath('s19-oldnineteen'), edit]]) }).dir)
    assert.equal(run.status, 1)
    assert.ok(withFindingCode(run, 'FROZEN_SECTION_FIELD_CHANGED'), run.err)
    assert.match(run.err, /"title"/)
  })

  it('passes a prose-only edit to a frozen section (its fields are unchanged)', () => {
    const prose = sectionFile({ slug: 'oldnineteen', index: 19, suffixes: OLD_SUFFIXES }) + '// una nota de redacción\n'
    const run = runFreeze(freezeScenario({ mainEdits: new Map([[sectionPath('s19-oldnineteen'), prose]]) }).dir)
    assert.equal(run.status, 0, run.err)
  })

  it('passes a change to section 18, which is below the frozen range', () => {
    const edit = sectionFile({ slug: 'eighteen', index: 18, suffixes: OLD_SUFFIXES, title: 'Otro título' })
    const run = runFreeze(freezeScenario({ mainEdits: new Map([[sectionPath('s18-eighteen'), edit]]) }).dir)
    assert.equal(run.status, 0, run.err)
  })

  it('fails EXAM_BANK_SET_CHANGED when an exam bank file appears on main with no override', () => {
    const run = runFreeze(freezeScenario({ mainEdits: new Map([[BANK, '{}\n']]) }).dir)
    assert.equal(run.status, 1)
    assert.ok(withFindingCode(run, 'EXAM_BANK_SET_CHANGED'), run.err)
  })
})

describe('freeze guard: a pull request is held to the freeze before it merges', () => {
  const roadmapEdit = () => new Map([['learning_roadmap.md', 'cambio en la rama\n']])

  it('fails FROZEN_CHANGED for a branch ahead of main that edits a roadmap, which main does not hold yet', () => {
    const run = runFreeze(pullRequestScenario({ edits: roadmapEdit }).dir)
    assert.equal(run.status, 1)
    assert.ok(withFindingCode(run, 'FROZEN_CHANGED'), run.err)
    assert.match(run.err, /"against": "HEAD"/)
    assert.match(run.err, /learning_roadmap\.md/)
  })

  it('passes the same edit once the branch\'s window names an owner override for it', () => {
    const edits = (pre) => new Map([
      ...roadmapEdit(),
      [WINDOW, freezeWindow(pre, { overrides: [{ path: 'learning_roadmap.md', reason: 'erratum de la hoja', owner_approval: 'O17' }] })],
    ])
    const run = runFreeze(pullRequestScenario({ edits }).dir)
    assert.equal(run.status, 0, run.err)
  })

  it('fails FROZEN_SECTION_FIELD_CHANGED for a section title changed on the branch, and passes a prose-only edit', () => {
    const path = sectionPath('s19-oldnineteen')
    const retitled = sectionFile({ slug: 'oldnineteen', index: 19, suffixes: OLD_SUFFIXES, title: 'Título nuevo' })
    const run = runFreeze(pullRequestScenario({ edits: () => new Map([[path, retitled]]) }).dir)
    assert.equal(run.status, 1)
    assert.ok(withFindingCode(run, 'FROZEN_SECTION_FIELD_CHANGED'), run.err)
    const prose = sectionFile({ slug: 'oldnineteen', index: 19, suffixes: OLD_SUFFIXES }) + '// una nota de redacción\n'
    const calm = runFreeze(pullRequestScenario({ edits: () => new Map([[path, prose]]) }).dir)
    assert.equal(calm.status, 0, calm.err)
  })

  it('does not hold the tree to the branch point once the epoch exists: curriculum/55 differs by the renumber', () => {
    const run = runFreeze(pullRequestScenario({ edits: roadmapEdit, epoch: true }).dir)
    assert.equal(run.status, 0, run.err)
  })

  it('still holds main to the freeze when the tree has its epoch', () => {
    const mainEdits = new Map([['learning_roadmap_52_V3.md', 'cambio en main\n']])
    const run = runFreeze(pullRequestScenario({ edits: roadmapEdit, epoch: true, mainEdits }).dir)
    assert.equal(run.status, 1)
    assert.ok(withFindingCode(run, 'FROZEN_CHANGED'), run.err)
    assert.match(run.err, /"against": "main"/)
  })
})

describe('freeze guard: closing the window needs the renumber sha', () => {
  it('fails WINDOW_CLOSED_WITHOUT_RENUMBER for a closed window with no renumber_sha', () => {
    const run = runFreeze(freezeScenario({ window: { status: 'closed' } }).dir)
    assert.equal(run.status, 1)
    assert.ok(withFindingCode(run, 'WINDOW_CLOSED_WITHOUT_RENUMBER'), run.err)
  })

  it('passes a closed window whose renumber_sha the epoch records and HEAD contains', () => {
    const run = runFreeze(closedScenario().dir)
    assert.equal(run.status, 0, run.err)
    assert.match(run.out, /FREEZE GUARD OK/)
  })

  it('fails a closed window that names an old ancestor when no epoch file records a renumber', () => {
    const run = runFreeze(closedScenario({ epoch: () => null }).dir)
    assert.equal(run.status, 1)
    assert.ok(withFindingCode(run, 'WINDOW_CLOSED_WITHOUT_RENUMBER'), run.err)
    assert.match(run.err, /renumber_epoch\.json is absent/)
  })

  it('fails a closed window whose renumber_sha is not the one the epoch records', () => {
    const run = runFreeze(closedScenario({ epoch: () => epochNaming('e'.repeat(40)) }).dir)
    assert.equal(run.status, 1)
    assert.ok(withFindingCode(run, 'WINDOW_CLOSED_WITHOUT_RENUMBER'), run.err)
    assert.match(run.err, /not the one .* records/)
  })

  it('fails a closed window whose recorded renumber is on a side branch HEAD does not contain', () => {
    const run = runFreeze(closedScenario({ onSide: true }).dir)
    assert.equal(run.status, 1)
    assert.ok(withFindingCode(run, 'WINDOW_CLOSED_WITHOUT_RENUMBER'), run.err)
    assert.match(run.err, /not an ancestor of HEAD/)
  })

  it('fails a closed window whose recorded renumber_sha is no commit git can read', () => {
    const missing = 'f'.repeat(40)
    const run = runFreeze(closedScenario({ windowSha: () => missing, epoch: () => epochNaming(missing) }).dir)
    assert.equal(run.status, 1)
    assert.ok(withFindingCode(run, 'WINDOW_CLOSED_WITHOUT_RENUMBER'), run.err)
    assert.match(run.err, /not a commit git can read/)
  })

  it('fails HISTORY_MISSING on a shallow checkout rather than reporting DORMANT', () => {
    const { dir } = freezeScenario({ windowOn: false })
    const clone = mkdtempSync(join(tmpdir(), 'freeze-shallow-'))
    tempDirs.push(clone)
    execFileSync('git', ['clone', '-q', '--depth', '1', `file://${dir}`, clone])
    const run = runFreeze(clone)
    assert.equal(run.status, 1)
    assert.match(run.err, /shallow/)
  })

  it('fails HISTORY_MISSING when the window names a branch point git cannot read', () => {
    const dir = newRepo()
    writeTree(dir, preTree())
    commitAll(dir, 'curriculum 52')
    applyEdits(dir, new Map([[WINDOW, freezeWindow('f'.repeat(40))]]))
    commitAll(dir, 'open the window on a missing branch point')
    const run = runFreeze(dir)
    assert.equal(run.status, 1)
    assert.ok(withFindingCode(run, 'HISTORY_MISSING'), run.err)
    assert.match(run.err, /branch_point_sha is unreadable/)
  })
})

// ---------------------------------------------------------------------------------------------
// CI: the guards run in the preservation-sentinel job, which is the only job with full history
// ---------------------------------------------------------------------------------------------

describe('CI: the preservation-sentinel job runs both guards with full history', () => {
  const workflow = readFileSync(join(ROOT, '.github/workflows/tests.yml'), 'utf8')
  const start = workflow.indexOf('\n  preservation-sentinel:\n')
  const end = workflow.indexOf('\n  lint:\n', start)
  const job = workflow.slice(start, end)

  it('finds the job in the workflow, so the checks below read the right block', () => {
    assert.ok(start > 0 && end > start, 'preservation-sentinel job not found in tests.yml')
  })

  it('checks out with fetch-depth 0, because the guards read history', () => {
    assert.match(job, /fetch-depth: 0/)
  })

  it('runs the renumber meaning guard (G-11, G-15)', () => {
    assert.match(job, /node scripts\/preservation\/renumber_meaning_guard\.mjs/)
  })

  it('runs the curriculum/55 freeze guard (G-14)', () => {
    assert.match(job, /node scripts\/preservation\/curriculum55_freeze_guard\.mjs/)
  })
})
