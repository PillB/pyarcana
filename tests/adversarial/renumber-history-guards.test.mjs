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
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PROGRESS_FIELDS } from '../../src/lib/progress-sanitize.ts'
import {
  ROADMAP_PATH,
  roadmapSectionCount,
} from '../../scripts/preservation/roadmap_section_count.mjs'

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
