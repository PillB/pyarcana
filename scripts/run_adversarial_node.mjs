#!/usr/bin/env node
/**
 * Run the Node adversarial suite so that a test that did not run cannot read as one that passed.
 *
 * `node --test` exits 0 with skipped and todo tests, and does not notice a test that writes into
 * the repository. The Python half had all three problems hiding real gaps (2026-10-03); this half
 * had none, and this keeps it that way: any skip, any todo, any test file with no test in it, or
 * any file the run writes into the tree fails it. Same files, order and flags as before.
 *
 *   node scripts/run_adversarial_node.mjs
 */
import { spawnSync } from 'node:child_process'
import { lstatSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIR = 'tests/adversarial'

/** Size and mtime of every tracked file and every untracked, unignored one. */
function treeState() {
  const listing = spawnSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], {
    cwd: ROOT, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024,
  })
  if (listing.status !== 0) throw new Error(`git ls-files failed: ${listing.stderr}`)
  const state = new Map()
  for (const rel of listing.stdout.split('\0').filter(Boolean)) {
    try {
      const st = lstatSync(join(ROOT, rel), { bigint: true })
      state.set(rel, `${st.size}:${st.mtimeNs}`)
    } catch {
      state.set(rel, 'missing')
    }
  }
  return state
}

function written(before, after) {
  const keys = new Set([...before.keys(), ...after.keys()])
  return [...keys].filter((k) => before.get(k) !== after.get(k)).sort()
}

/** `*.test.ts` then `*.test.mjs`, each sorted: the order the npm script's shell globs gave. */
function testFiles() {
  const names = readdirSync(join(ROOT, DIR))
  const pick = (ext) => names.filter((n) => n.endsWith(ext)).sort().map((n) => `${DIR}/${n}`)
  return [...pick('.test.ts'), ...pick('.test.mjs')]
}

/** The `# name N` counters the TAP reporter ends with. */
function tapCounts(tap) {
  const counts = {}
  for (const m of tap.matchAll(/^# (tests|pass|fail|cancelled|skipped|todo) (\d+)$/gm)) {
    counts[m[1]] = Number(m[2])
  }
  return counts
}

function main() {
  const files = testFiles()
  const problems = files
    .filter((f) => !/\b(?:test|it)\s*\(/.test(readFileSync(join(ROOT, f), 'utf8')))
    .map((f) => `has no test in it: ${f}`)
  const scratch = mkdtempSync(join(tmpdir(), 'pyarcana-node-tap-'))
  const tapPath = join(scratch, 'report.tap')
  const before = treeState()
  const run = spawnSync(process.execPath, [
    '--experimental-test-module-mocks', '--import', 'tsx', '--test',
    '--test-reporter=spec', '--test-reporter-destination=stdout',
    '--test-reporter=tap', `--test-reporter-destination=${tapPath}`,
    ...files,
  ], { cwd: ROOT, stdio: 'inherit' })
  const after = treeState()
  const counts = tapCounts(readFileSync(tapPath, 'utf8'))
  rmSync(scratch, { recursive: true, force: true })
  if (!counts.tests) problems.push('the TAP report counted no tests, so nothing was checked')
  if (counts.skipped) problems.push(`${counts.skipped} skipped: a skip here hides a test that did not run`)
  if (counts.todo) problems.push(`${counts.todo} todo: a todo here is a test that does not count`)
  for (const rel of written(before, after)) problems.push(`the run wrote into the tree: ${rel}`)
  for (const p of problems) console.error(`FAIL ${p}`)
  console.error(`\nnode: ${counts.tests ?? 0} tests, ${counts.fail ?? 0} failed; ${problems.length} runner problems`)
  return run.status === 0 && problems.length === 0 ? 0 : 1
}

process.exit(main())
