/**
 * The TypeScript complexity gate, run as a process the way CI runs it, in a temporary tree.
 *
 * Each test builds its own small tree under the OS temporary directory and passes it to the
 * gate with --root, so nothing here touches the repository (run_adversarial_node fails a run that
 * writes into it). The gate under test is the real entry point, not a copy of its functions.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const GATE = join(ROOT, 'scripts/complexity_gate.mjs')
const BASELINE = 'audit/fixer/complexity_baseline.json'

/** A function whose complexity is exactly `score`: one base point plus score - 1 ifs. */
function fnWith(name, score) {
  const body = Array.from({ length: score - 1 }, (_, i) => `  if (x === ${i}) return ${i}`).join('\n')
  return `export function ${name}(x: number): number {\n${body}\n  return -1\n}\n`
}

/** Runs `body` against a fresh tree with one src directory, then removes the tree. */
function withTree(body) {
  const root = mkdtempSync(join(tmpdir(), 'ts-complexity-gate-'))
  mkdirSync(join(root, 'src'))
  try {
    return body(root)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

/** Two methods named `m` in two classes: the first scores 16, the second 17. */
function classWith(name, score) {
  const body = Array.from({ length: score - 1 }, (_, i) => `    if (x === ${i}) return ${i}`).join('\n')
  return `class ${name} {\n  m(x: number): number {\n${body}\n    return -1\n  }\n}\n`
}

const put = (root, source, name = 'a.ts') => writeFileSync(join(root, 'src', name), source)
const gate = (root, ...args) => spawnSync(process.execPath, [GATE, '--root', root, ...args], { encoding: 'utf8' })
const baseline = (root) => JSON.parse(readFileSync(join(root, BASELINE), 'utf8'))
const output = (done) => `${done.stdout}${done.stderr}`

test('a missing baseline fails, says to run --init, and is not silently created', () => withTree((root) => {
  put(root, fnWith('f', 3))
  const done = gate(root)
  assert.equal(done.status, 1, output(done))
  assert.match(output(done), /--init/)
  assert.equal(existsSync(join(root, BASELINE)), false)
}))

test('--init writes a baseline, and a clean tree then passes against it', () => withTree((root) => {
  put(root, fnWith('f', 3))
  assert.equal(gate(root, '--init').status, 0)
  assert.deepEqual(baseline(root).offenders, {})
  assert.equal(gate(root).status, 0)
}))

test('--init refuses to overwrite an existing baseline', () => withTree((root) => {
  put(root, fnWith('f', 3))
  gate(root, '--init')
  assert.equal(gate(root, '--init').status, 1)
}))

test('a deleted baseline fails the gate', () => withTree((root) => {
  put(root, fnWith('f', 3))
  gate(root, '--init')
  rmSync(join(root, BASELINE))
  assert.equal(gate(root).status, 1)
}))

test('a new function at 15 passes and a new function at 16 fails, keyed by path and name', () => withTree((root) => {
  put(root, fnWith('f', 3))
  gate(root, '--init')
  put(root, fnWith('f', 3) + fnWith('g', 15))
  assert.equal(gate(root).status, 0, 'fifteen is at the ceiling and passes')
  put(root, fnWith('f', 3) + fnWith('g', 15) + fnWith('h', 16))
  const done = gate(root)
  assert.equal(done.status, 1, output(done))
  assert.match(output(done), /NEW OVER\s+16 src\/a\.ts::h/)
}))

test('a baselined 20 that becomes 21 fails though the worst is unchanged', () => withTree((root) => {
  put(root, fnWith('f', 20) + fnWith('g', 25))
  gate(root, '--init')
  put(root, fnWith('f', 21) + fnWith('g', 25))
  const done = gate(root)
  assert.equal(done.status, 1, output(done))
  assert.match(output(done), /GREW\s+20 ->\s+21 src\/a\.ts::f/)
}))

test('falling scores tighten the baseline on disk and the gate passes', () => withTree((root) => {
  put(root, fnWith('f', 20) + fnWith('g', 25))
  gate(root, '--init')
  put(root, fnWith('f', 10) + fnWith('g', 18))
  assert.equal(gate(root).status, 0)
  const tightened = baseline(root)
  assert.deepEqual(tightened.offenders, { 'src/a.ts::g': 18 })
  assert.deepEqual([tightened.over_ceiling, tightened.worst], [1, 18])
}))

test('a name repeated in one file is suffixed #2 in source order', () => withTree((root) => {
  put(root, classWith('A', 16) + classWith('B', 17))
  gate(root, '--init')
  assert.deepEqual(baseline(root).offenders, { 'src/a.ts::m': 16, 'src/a.ts::m#2': 17 })
}))

test('an unparseable file fails the gate and names path:line', () => withTree((root) => {
  put(root, 'export function f(:\n')
  const done = gate(root, '--init')
  assert.equal(done.status, 1, output(done))
  assert.match(output(done), /src\/a\.ts:1:/)
}))

/** The three roots the TypeScript gate measures, in one fresh tree, then removed. */
function withScopes(body) {
  const root = mkdtempSync(join(tmpdir(), 'ts-complexity-scope-'))
  for (const dir of ['src', 'scripts', join('tests', 'adversarial')]) mkdirSync(join(root, dir), { recursive: true })
  try {
    return body(root)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

/** fnWith in plain JavaScript, for a .mjs file, which takes no type annotations. */
function jsFnWith(name, score) {
  const body = Array.from({ length: score - 1 }, (_, i) => `  if (x === ${i}) return ${i}`).join('\n')
  return `export function ${name}(x) {\n${body}\n  return -1\n}\n`
}

test('the TypeScript scope reaches scripts/ and tests/, not only src/', () => withScopes((root) => {
  writeFileSync(join(root, 'scripts', 'probe.mts'), fnWith('g', 16))
  writeFileSync(join(root, 'tests', 'adversarial', 'probe.test.mjs'), jsFnWith('h', 16))
  assert.equal(gate(root, '--init').status, 0)
  assert.deepEqual(baseline(root).offenders, {
    'scripts/probe.mts::g': 16,
    'tests/adversarial/probe.test.mjs::h': 16,
  })
}))

test('a new function over 15 under scripts/ fails the ratchet', () => withScopes((root) => {
  writeFileSync(join(root, 'scripts', 'probe.mts'), fnWith('g', 3))
  assert.equal(gate(root, '--init').status, 0)
  writeFileSync(join(root, 'scripts', 'probe.mts'), fnWith('g', 3) + fnWith('k', 16))
  const done = gate(root)
  assert.equal(done.status, 1, output(done))
  assert.match(output(done), /NEW OVER\s+16 scripts\/probe\.mts::k/)
}))

test('a new function over 15 under tests/ fails the ratchet', () => withScopes((root) => {
  writeFileSync(join(root, 'tests', 'adversarial', 'probe.test.mjs'), jsFnWith('h', 3))
  assert.equal(gate(root, '--init').status, 0)
  writeFileSync(join(root, 'tests', 'adversarial', 'probe.test.mjs'), jsFnWith('h', 3) + jsFnWith('k', 16))
  const done = gate(root)
  assert.equal(done.status, 1, output(done))
  assert.match(output(done), /NEW OVER\s+16 tests\/adversarial\/probe\.test\.mjs::k/)
}))
