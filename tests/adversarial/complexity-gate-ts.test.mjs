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
import { ESLint } from 'eslint'
import tseslint from 'typescript-eslint'

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

/** A class `name` with one method `m` that scores exactly `score`. */
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

test('the same method name in two classes is told apart by the class, not by order', () => withTree((root) => {
  put(root, classWith('A', 16) + classWith('B', 17))
  gate(root, '--init')
  assert.deepEqual(baseline(root).offenders, { 'src/a.ts::A.m': 16, 'src/a.ts::B.m': 17 })
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

/** An arrow function bound to a const, scoring exactly `score`. */
function arrowWith(name, score) {
  const body = Array.from({ length: score - 1 }, (_, i) => `  if (x === ${i}) return ${i}`).join('\n')
  return `export const ${name} = (x: number): number => {\n${body}\n  return -1\n}\n`
}

/** A function that returns `callee(callback)`, the callback scoring exactly `score`. */
function callbackWith(name, callee, score) {
  const body = Array.from({ length: score - 1 }, (_, i) => `      if (x === ${i}) return ${i}`).join('\n')
  return `export function ${name}(rows: number[]) {\n  return ${callee}((x) => {\n${body}\n    return -1\n  })\n}\n`
}

test('an unrelated arrow function added earlier does not turn a baselined offender into NEW OVER', () => withTree((root) => {
  put(root, 'export const a = () => 1\n' + arrowWith('b', 20))
  assert.equal(gate(root, '--init').status, 0)
  put(root, 'export const z = () => 2\n' + 'export const a = () => 1\n' + arrowWith('b', 20))
  const done = gate(root)
  assert.equal(done.status, 0, output(done))
  assert.deepEqual(baseline(root).offenders, { 'src/a.ts::b': 20 }, 'nothing grew, so nothing was rewritten')
}))

test('a baselined callback keeps its key when other callbacks are added before it, in its function and in others', () => withTree((root) => {
  const original = callbackWith('build', 'rows.map', 20)
  put(root, original)
  assert.equal(gate(root, '--init').status, 0)
  const key = 'src/a.ts::build.<arg 0 of rows.map>'
  put(root, 'export const early = () => 3\n' + callbackWith('first', 'rows.map', 2) + original)
  const done = gate(root)
  assert.equal(done.status, 0, output(done))
  assert.deepEqual(baseline(root).offenders, { [key]: 20 })
}))

test('a baselined anonymous function that grows still fails, under the same key', () => withTree((root) => {
  put(root, callbackWith('build', 'rows.map', 20))
  gate(root, '--init')
  put(root, 'export const early = () => 3\n' + callbackWith('build', 'rows.map', 21))
  const done = gate(root)
  assert.equal(done.status, 1, output(done))
  assert.match(output(done), /GREW\s+20 ->\s+21 src\/a\.ts::build\.<arg 0 of rows\.map>/)
}))

test('two callbacks to the same call in one function are told apart by order, and only by order', () => withTree((root) => {
  const callback = (score) => Array.from({ length: score - 1 }, (_, i) => `if (x === ${i}) return ${i}`).join('; ')
  put(root, `export function build(rows: number[]) {\n  return [rows.map((x) => { ${callback(16)}; return -1 }), rows.map((x) => { ${callback(17)}; return -1 })]\n}\n`)
  gate(root, '--init')
  assert.deepEqual(baseline(root).offenders, {
    'src/a.ts::build.<arg 0 of rows.map>': 16,
    'src/a.ts::build.<arg 0 of rows.map>#2': 17,
  })
}))

test('keys name what a function is bound to, and the path of what encloses it', () => withTree((root) => {
  const big = (indent) => Array.from({ length: 15 }, (_, i) => `${indent}if (x === ${i}) return ${i}`).join('\n')
  const file = [
    'export class Box {',
    `  m(x: number) {\n${big('    ')}\n    return -1\n  }`,
    `  get v() {\n    const x = 1\n${big('    ')}\n    return -1\n  }`,
    `  field = (x: number) => {\n${big('    ')}\n    return -1\n  }`,
    `  pick = ${Array.from({ length: 16 }, (_, i) => `1 === ${i} ? ${i} : `).join('')}-1`,
    `  static {\n    const x = 1\n${big('    ')}\n  }`,
    '}',
    'export const api = {',
    `  method(x: number) {\n${big('    ')}\n    return -1\n  },`,
    `  prop: (x: number) => {\n${big('    ')}\n    return -1\n  },`,
    '}',
    `export default (x: number) => {\n${big('  ')}\n  return -1\n}`,
    `export function outer() {\n  const inner = (x: number) => {\n${big('    ')}\n    return -1\n  }\n  return inner\n}`,
    '',
  ].join('\n')
  put(root, file)
  put(root, `export function Panel({ rows }: { rows: number[] }) {\n  return <button onClick={(x: number) => {\n${big('    ')}\n    return -1\n  }}>{rows.length}</button>\n}\n`, 'b.tsx')
  const done = gate(root, '--init')
  assert.equal(done.status, 0, output(done))
  assert.deepEqual(Object.keys(baseline(root).offenders).sort(), [
    'src/a.ts::Box.<static block>',
    'src/a.ts::Box.field',
    'src/a.ts::Box.get v',
    'src/a.ts::Box.m',
    'src/a.ts::Box.pick.<initializer>',
    'src/a.ts::api.method',
    'src/a.ts::api.prop',
    'src/a.ts::default',
    'src/a.ts::outer.inner',
    'src/b.tsx::Panel.<prop onClick>',
  ])
}))

const SAMPLE = `
export function plain(a: number, b = 1) { if (a && b) return a ?? b; return a?.toFixed() }
export function ov(a: string): void
export function ov(a: number): void
export function ov(a: any) { if (a) return }
export abstract class Shape {
  abstract area(): number
  label(x: number) { return x ? 'a' : 'b' }
}
export class Box {
  a = (x: number) => (x ? 1 : 2)
  b = Math.random() > 0.5 ? 1 : 2
  static { if (Math.random()) Box.prototype.toString() }
  constructor(private v: number) { if (v) this.v = 1 }
  get g() { return this.v || 0 }
  m(xs: number[]) { return xs.map((x) => (x > 1 ? x : -x)) }
}
export const o = { p() { return 1 }, q: async function* () { yield 1 } }
export default async () => { switch (Math.random()) { case 1: return 1; case 2: return 2; default: return 0 } }
`

/** "line:column:score" for every message of an ESLint run over the sample, in a stable order. */
async function scoresOf(eslint) {
  const [result] = await eslint.lintFiles(['src/sample.ts'])
  assert.deepEqual(result.messages.filter((m) => m.fatal), [])
  return result.messages.map((m) => `${m.line}:${m.column}:${/complexity of (\d+)/.exec(m.message)[1]}`).sort()
}

test("the gate's rule reports exactly the units and scores of ESLint's own complexity rule", async () => {
  const root = mkdtempSync(join(tmpdir(), 'ts-complexity-parity-'))
  try {
    mkdirSync(join(root, 'src'))
    put(root, SAMPLE, 'sample.ts')
    const core = new ESLint({
      cwd: root,
      overrideConfigFile: true,
      overrideConfig: [{ files: ['**/*.ts'], languageOptions: { parser: tseslint.parser }, rules: { complexity: ['error', 0] } }],
    })
    const ours = new ESLint({ cwd: root, overrideConfigFile: join(ROOT, 'scripts/complexity_gate.eslint.config.mjs') })
    const expected = await scoresOf(core)
    assert.ok(expected.length >= 12, `the sample should hold a dozen units, found ${expected.length}`)
    assert.deepEqual(await scoresOf(ours), expected)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
