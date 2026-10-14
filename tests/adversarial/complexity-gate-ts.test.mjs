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
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
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
    'src/a.ts::build.<returned>.<arg 0 of rows.map>': 16,
    'src/a.ts::build.<returned>.<arg 0 of rows.map>#2': 17,
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
    `export const once = ((x: number) => {\n${big('  ')}\n  return -1\n})(1)`,
    '',
  ].join('\n')
  put(root, file)
  put(root, `export function Panel({ rows }: { rows: number[] }) {\n  return <button onClick={(x: number) => {\n${big('    ')}\n    return -1\n  }}>{rows.length}</button>\n}\n`, 'b.tsx')
  const done = gate(root, '--init')
  assert.equal(done.status, 0, output(done))
  assert.deepEqual(Object.keys(baseline(root).offenders).sort(), [
    'src/a.ts::<once = (…)()>',
    'src/a.ts::Box.<static block>',
    'src/a.ts::Box.field',
    'src/a.ts::Box.get v',
    'src/a.ts::Box.m',
    'src/a.ts::Box.pick.<initializer>',
    'src/a.ts::api.method',
    'src/a.ts::api.prop',
    'src/a.ts::default',
    'src/a.ts::outer.inner',
    'src/b.tsx::Panel.<button onClick>',
  ])
}))

/** `count` lines of `if`, each one decision, indented by `indent`. */
const ifs = (count, indent) => Array.from({ length: count }, (_, i) => `${indent}if (x === ${i}) return ${i}`).join('\n')

test('a test callback is keyed by its title, so an unrelated block added above it renumbers nothing', () => withScopes((root) => {
  // The shape of scripts/code_rendering.spec.ts. The draft keyed both test callbacks
  // `<arg 1 of test.describe>.<arg 1 of test>` and numbered them across the file.
  const spec = join(root, 'scripts', 'a.spec.ts')
  const fidelity = `test.describe('Code rendering fidelity', () => {\n  test('big one', async ({ page }) => {\n${ifs(23, '    ')}\n  })\n})\n`
  writeFileSync(spec, fidelity)
  assert.equal(gate(root, '--init').status, 0)
  writeFileSync(spec, `test.describe('A new, unrelated block', () => {\n  test('small new test', async () => {})\n})\n${fidelity}`)
  const done = gate(root)
  assert.equal(done.status, 0, output(done))
  assert.deepEqual(baseline(root).offenders, {
    'scripts/a.spec.ts::<arg 1 of test.describe "Code rendering fidelity">.<arg 1 of test "big one">': 24,
  })
}))

test('a callback whose call result is bound is keyed by the binding, so an unrelated useMemo above it renumbers nothing', () => withTree((root) => {
  // The shape of src/components/ui/chart.tsx, `const tooltipLabel = React.useMemo(() => {`.
  const label = `  const tooltipLabel = React.useMemo(() => {\n${ifs(17, '    ')}\n    return -1\n  }, [x])\n`
  const component = (extra) => `export function ChartTooltipContent({ x }: { x: number }) {\n${extra}${label}  return tooltipLabel\n}\n`
  put(root, component(''), 'c.tsx')
  assert.equal(gate(root, '--init').status, 0)
  put(root, component('  const unrelated = React.useMemo(() => x * 2, [x])\n'), 'c.tsx')
  const done = gate(root)
  assert.equal(done.status, 0, output(done))
  assert.deepEqual(baseline(root).offenders, { 'src/c.tsx::ChartTooltipContent.<arg 0 of tooltipLabel = React.useMemo>': 18 })
}))

test('a title need not come first: the first string a call is given before the callback names it', () => withTree((root) => {
  // `register(app, 'save', cb)`, `vi.spyOn`-style and `mock.patch.object(gate, "sh", fn)` shapes.
  const save = `  register(app, 'save', (x: number) => {\n${ifs(16, '    ')}\n    return -1\n  })\n`
  const routes = (extra) => `export function routes(app: object) {\n${extra}${save}}\n`
  put(root, routes(''))
  assert.equal(gate(root, '--init').status, 0)
  put(root, routes("  register(app, 'load', () => 0)\n"))
  const done = gate(root)
  assert.equal(done.status, 0, output(done))
  assert.deepEqual(baseline(root).offenders, { 'src/a.ts::routes.<arg 2 of register "save">': 17 })
}))

test('a callback added to an earlier block does not renumber a baselined callback in a later one', () => withTree((root) => {
  // Neither block has a title or a binding, so the blocks are told apart by order among themselves,
  // and each callback by order inside its own block, never by order across the whole file.
  const block = (body) => `describe(() => {\n${body}})\n`
  const small = '  it(() => {})\n'
  const big = `  it(() => {\n${ifs(19, '    ')}\n  })\n`
  put(root, block(small) + block(big))
  assert.equal(gate(root, '--init').status, 0)
  put(root, block(small + small) + block(big))
  const done = gate(root)
  assert.equal(done.status, 0, output(done))
  assert.deepEqual(baseline(root).offenders, { 'src/a.ts::<arg 0 of describe>#2.<arg 0 of it>': 20 })
}))

test('a callback is named by its binding, its title, or its JSX element and attribute', () => withTree((root) => {
  const fn = (indent) => `(x) => {\n${ifs(15, `${indent}  `)}\n${indent}  return -1\n${indent}}`
  put(root, [
    'export function Comp({ rows, page }) {',
    `  const total = rows.reduce(${fn('  ')}, 0)`,
    `  const [value, setValue] = useState(${fn('  ')})`,
    `  const { data } = useQuery(${fn('  ')})`,
    `  const evens = rows.filter(${fn('  ')}).length`,
    `  const config = { label: useMemo(${fn('  ')}) }`,
    `  emitter.on('ready', ${fn('  ')})`,
    `  emitter.on(\`tick \${total}\`, ${fn('  ')})`,
    `  return <List onPick={${fn('  ')}}>{${fn('  ')}}</List>`,
    '}',
    `export async function load(page) {\n  const found = await page.evaluate(${fn('  ')})\n  return found\n}`,
    `export const once = (${fn('')})(1)`,
    '',
  ].join('\n'), 'a.tsx')
  const done = gate(root, '--init')
  assert.equal(done.status, 0, output(done))
  assert.deepEqual(Object.keys(baseline(root).offenders).sort(), [
    'src/a.tsx::<once = (…)()>',
    'src/a.tsx::Comp.<List children>',
    'src/a.tsx::Comp.<List onPick>',
    'src/a.tsx::Comp.<arg 0 of [value, setValue] = useState>',
    'src/a.tsx::Comp.<arg 0 of evens = rows.filter>',
    'src/a.tsx::Comp.<arg 0 of total = rows.reduce>',
    'src/a.tsx::Comp.<arg 0 of { data } = useQuery>',
    'src/a.tsx::Comp.<arg 1 of emitter.on "ready">',
    'src/a.tsx::Comp.<arg 1 of emitter.on "tick ${…}">',
    'src/a.tsx::Comp.config.<arg 0 of label = useMemo>',
    'src/a.tsx::load.<arg 0 of found = page.evaluate>',
  ])
}))

test('a JSX handler is told apart by its element, so a handler on another element added above it renumbers nothing', () => withTree((root) => {
  const handler = `<button onClick={(x: number) => {\n${ifs(16, '    ')}\n    return -1\n  }} />`
  const panel = (extra) => `export function Panel() {\n  return <>${extra}${handler}</>\n}\n`
  put(root, panel(''), 'b.tsx')
  assert.equal(gate(root, '--init').status, 0)
  put(root, panel('<div onClick={() => 1} />'), 'b.tsx')
  const done = gate(root)
  assert.equal(done.status, 0, output(done))
  assert.deepEqual(baseline(root).offenders, { 'src/b.tsx::Panel.<button onClick>': 17 })
}))

test('a row of a list is keyed by its title and a returned function by being returned, so unrelated arrows above renumber nothing', () => withTree((root) => {
  // The shape of the worker's tables, `["role", (q) => ...]`, and of a cleanup, `return () => ...`.
  // The draft called both `<arrow function>` and numbered them across the file.
  const rows = (extra) => `export const ROWS = [\n${extra}  ['role', (x: number) => {\n${ifs(16, '    ')}\n    return -1\n  }],\n]\n`
  const subscribe = (extra) => `export function subscribe() {\n${extra}  return (x: number) => {\n${ifs(17, '    ')}\n    return -1\n  }\n}\n`
  put(root, rows('') + subscribe(''))
  assert.equal(gate(root, '--init').status, 0)
  put(root, `void (() => 0)\n${rows("  ['state', (x: number) => x],\n")}${subscribe('  void (() => 0)\n')}`)
  const done = gate(root)
  assert.equal(done.status, 0, output(done))
  assert.deepEqual(baseline(root).offenders, { 'src/a.ts::ROWS.<item 1 "role">': 17, 'src/a.ts::subscribe.<returned>': 18 })
}))

test('a list item without a title is keyed by its place in its own list, and a default by its parameter', () => withTree((root) => {
  const fn = `(x: number) => {\n${ifs(15, '    ')}\n    return -1\n  }`
  put(root, `export const CHECKS = [\n  (x: number) => x,\n  ${fn},\n]\nexport function run(cb = ${fn}) {\n  return cb\n}\n`)
  const done = gate(root, '--init')
  assert.equal(done.status, 0, output(done))
  assert.deepEqual(Object.keys(baseline(root).offenders), ['src/a.ts::CHECKS.<item 1>', 'src/a.ts::run.<default of cb>'])
}))

test('a name further in already tells two callbacks apart, so no number is added and an unrelated callback above moves nothing', () => withTree((root) => {
  // The shape of ResourcesPage.tsx: two effects, the second holding `handler`. Its path is already
  // unique, so neither effect is numbered, and a third effect added first does not move it. Numbering
  // every segment among its siblings would key it `<arg 0 of useEffect>#2.handler`, then `#3`.
  const effect = (body) => `  useEffect(() => {\n${body}  }, [])\n`
  const handler = `    const handler = (x: number) => {\n${ifs(16, '      ')}\n      return -1\n    }\n    window.addEventListener('keydown', handler)\n`
  const page = (extra) => `export function ResourcesPage() {\n${extra}${effect('    reset()\n')}${effect(handler)}  return null\n}\n`
  put(root, page(''), 'r.tsx')
  assert.equal(gate(root, '--init').status, 0)
  assert.deepEqual(baseline(root).offenders, { 'src/r.tsx::ResourcesPage.<arg 0 of useEffect>.handler': 17 })
  put(root, page(effect('    other()\n')), 'r.tsx')
  const done = gate(root)
  assert.equal(done.status, 0, output(done))
}))

const FUNCTIONS = new Set(['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression'])

/** Where a statement can go before everything else in a body or a file: after its directives. */
function headOf(block) {
  const first = block.body.find((statement) => !statement.directive)
  if (first) return first.range[0]
  return block.type === 'Program' ? block.range[1] : block.range[1] - 1
}

/** A callee to copy: one whose text holds no decision (`?.`, `??`, `? :`, `&&`, `||`), so a copy adds none. */
const DECIDES = /\?|&&|\|\|/

/** Each function, and the file, with the calls it makes itself (not through a nested function) that take a function. */
function callsByScope(ast, keys, code) {
  const scopes = new Map([[ast, new Map()]])
  const visit = (node, scope) => {
    if (FUNCTIONS.has(node.type)) scopes.set(node, new Map())
    const inner = FUNCTIONS.has(node.type) ? node : scope
    for (const [place, arg] of (node.arguments ?? []).entries()) {
      const callee = `${node.type === 'NewExpression' ? 'new ' : ''}${code.slice(...node.callee.range)}`
      if (FUNCTIONS.has(arg.type) && !DECIDES.test(callee)) scopes.get(scope).set(`${place} ${callee}`, { callee, place })
    }
    for (const key of keys[node.type] ?? []) for (const child of [node[key]].flat()) if (child?.type) visit(child, inner)
  }
  visit(ast, ast)
  return scopes
}

/**
 * Statements that add unrelated functions to a scope: an anonymous arrow, and for each call the scope
 * already hands a function to, a callback to the same callee at the same place whose call is bound to a
 * fresh name, and one under a fresh title. Each adds nothing to the score of what is around it.
 */
function unrelatedFunctions(calls, fresh) {
  const out = ['void (() => 0);']
  for (const { callee, place } of calls.values()) {
    out.push(`const ${fresh()} = ${callee}(${'0, '.repeat(place)}() => 0);`)
    if (place > 0) out.push(`${callee}('an unrelated title ${fresh()}', ${'0, '.repeat(place - 1)}() => 0);`)
  }
  return `${out.join(' ')} `
}

/** `code` with unrelated functions put first in the file and first in every function with a block body. */
function withUnrelatedFunctions(code, file) {
  const jsx = !/\.[cm]?ts$/.test(file)
  const { ast, visitorKeys } = tseslint.parser.parseForESLint(code, { range: true, loc: true, sourceType: 'module', ecmaVersion: 'latest', ecmaFeatures: { jsx } })
  let count = 0
  const fresh = () => `__unrelated${++count}`
  const edits = [...callsByScope(ast, visitorKeys, code)]
    .filter(([scope]) => scope === ast || scope.body.type === 'BlockStatement')
    .map(([scope, calls]) => ({ at: headOf(scope === ast ? ast : scope.body), text: unrelatedFunctions(calls, fresh) }))
    .sort((a, b) => b.at - a.at)
  return { code: edits.reduce((text, { at, text: add }) => text.slice(0, at) + add + text.slice(at), code), scopes: edits.length }
}

test('unrelated functions added first in every scope of the baselined files change no key of the real baseline', () => withTree((root) => {
  // The owner's test of the fix: every file the repository's baseline names, copied as it is, measures
  // to the same keys; then an unrelated function is put before everything else in the file and in
  // every function with a block body, beside each callback already there. Not one key may move.
  const recorded = JSON.parse(readFileSync(join(ROOT, BASELINE), 'utf8')).offenders
  const files = [...new Set(Object.keys(recorded).map((key) => key.split('::')[0]))]
  for (const rel of files) {
    mkdirSync(dirname(join(root, rel)), { recursive: true })
    copyFileSync(join(ROOT, rel), join(root, rel))
  }
  assert.equal(gate(root, '--init').status, 0)
  assert.deepEqual(Object.keys(baseline(root).offenders), Object.keys(recorded), 'the copies measure to the baselined keys')
  const before = readFileSync(join(root, BASELINE), 'utf8')
  let scopes = 0
  for (const rel of files) {
    const changed = withUnrelatedFunctions(readFileSync(join(root, rel), 'utf8'), rel)
    writeFileSync(join(root, rel), changed.code)
    scopes += changed.scopes
  }
  assert.ok(scopes > files.length * 5, `unrelated functions went into only ${scopes} scopes`)
  const done = gate(root)
  assert.equal(done.status, 0, output(done))
  assert.equal(readFileSync(join(root, BASELINE), 'utf8'), before, 'nothing grew or fell, so nothing was rewritten')
}))

test('an exclusion inside a root takes that file out of the measure, and the control proves it', () => withTree((root) => {
  // No exclusion in the real scope lies inside a root, so the filter has no work to do on the real
  // tree and a test there cannot tell whether it works. This scope excludes src/skip/, which holds a 30.
  mkdirSync(join(root, 'src', 'skip'))
  put(root, fnWith('small', 3), 'keep.ts')
  writeFileSync(join(root, 'src', 'skip', 'big.ts'), fnWith('huge', 30))
  const baselined = (exclusions) => {
    const scope = join(root, 'scope.json')
    writeFileSync(scope, JSON.stringify({ typescript: [{ root: 'src', suffixes: ['.ts'] }], GATE_EXCLUSIONS: exclusions }))
    rmSync(join(root, BASELINE), { force: true })
    const done = gate(root, '--scope', scope, '--init')
    assert.equal(done.status, 0, output(done))
    return baseline(root).offenders
  }
  assert.deepEqual(baselined([]), { 'src/skip/big.ts::huge': 30 }, 'control: it is measured')
  assert.deepEqual(baselined([{ path: 'src/skip/', reason: 'an exclusion inside a root' }]), {}, 'excluded: it is not')
}))

test('a flag without its value is a usage error, not a run on the default', () => withTree((root) => {
  put(root, fnWith('f', 3))
  for (const flag of ['--root', '--scope']) {
    const done = spawnSync(process.execPath, [GATE, ...(flag === '--scope' ? ['--root', root] : []), flag], { encoding: 'utf8' })
    assert.notEqual(done.status, 0, `${flag}: ${output(done)}`)
    assert.match(output(done), new RegExp(`${flag} needs a value`))
  }
}))

/** A fresh tree with workers/billing/src, where the billing worker keeps its code. */
function withWorker(body) {
  const root = mkdtempSync(join(tmpdir(), 'ts-complexity-worker-'))
  mkdirSync(join(root, 'workers', 'billing', 'src'), { recursive: true })
  try {
    return body(root, join(root, 'workers', 'billing', 'src', 'probe.mjs'))
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

test('the TypeScript scope reaches workers/billing, so the worker is baselined and ratcheted', () => withWorker((root, probe) => {
  writeFileSync(probe, jsFnWith('legacy', 20))
  assert.equal(gate(root, '--init').status, 0)
  assert.deepEqual(baseline(root).offenders, { 'workers/billing/src/probe.mjs::legacy': 20 })
}))

test('a new function over 15 in workers/billing fails the ratchet, and the baselined one may not grow', () => withWorker((root, probe) => {
  writeFileSync(probe, jsFnWith('legacy', 20))
  gate(root, '--init')
  writeFileSync(probe, jsFnWith('legacy', 21))
  const grew = gate(root)
  assert.equal(grew.status, 1, output(grew))
  assert.match(output(grew), /GREW\s+20 ->\s+21 workers\/billing\/src\/probe\.mjs::legacy/)
  writeFileSync(probe, jsFnWith('legacy', 20) + jsFnWith('fresh', 16))
  const added = gate(root)
  assert.equal(added.status, 1, output(added))
  assert.match(output(added), /NEW OVER\s+16 workers\/billing\/src\/probe\.mjs::fresh/)
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

/** An arrow function that scores 17, sixteen `if`s on its `x`, its closing brace indented by `indent`. */
const offender = (indent = '') => `(x: number) => {\n${ifs(16, `${indent}  `)}\n${indent}  return -1\n${indent}}`

/**
 * One case per form a function, or an object or a list that holds one, takes. `code('')` is a file
 * whose one offender, scoring 17, sits in that form under the name `key`; `code(extra)` adds an
 * unrelated function before it, in the same function and the same kind of place, that differs from
 * it in a name the code gives (a callee, a binding, a title, a property, an element). The offender
 * must keep its key. Keyed by order alone, the two would differ only by order, and the offender
 * would turn NEW OVER.
 */
const FORM_CASES = [
  {
    form: 'function in LogicalExpression.right',
    key: 'send.doFetch',
    extra: '  const other = options.other ?? ((x: number) => x)\n',
    code: (extra) => `export function send(options: { fetch?: unknown; other?: unknown }) {\n${extra}  const doFetch = options.fetch ?? (${offender('  ')})\n  return doFetch\n}\n`,
  },
  {
    form: 'array in ArrowFunctionExpression.body',
    key: 'rows.<returned>.<item 1 "role">',
    extra: ", b = [['role', () => 0]]",
    code: (extra) => `export const rows = (a: number${extra}) => [['role', ${offender()}]]\n`,
  },
  {
    form: 'array in CallExpression.arguments[]',
    key: 'setup.<arg 0 of register>.<item 1 "role">',
    extra: "  other([['role', (x: number) => x]])\n",
    code: (extra) => `export function setup() {\n${extra}  register([['role', ${offender('  ')}]])\n}\n`,
  },
  {
    form: 'array in NewExpression.arguments[]',
    key: 'table.<arg 0 of Map>.<item 1 "role">',
    extra: "  void new Set([['role', (x: number) => x]])\n",
    code: (extra) => `export function table() {\n${extra}  return new Map([['role', ${offender('  ')}]])\n}\n`,
  },
  {
    form: 'array in ReturnStatement.argument',
    key: 'rows.<returned>.<item 1 "role">',
    extra: "  register([['role', (x: number) => x]])\n",
    code: (extra) => `export function rows() {\n${extra}  return [['role', ${offender('  ')}]]\n}\n`,
  },
  {
    form: 'object in ArrayExpression.elements[]',
    key: 'MODALS.<item "auth">.open',
    extra: "  { id: 'glossary', open: (x: number) => x },\n",
    code: (extra) => `export const MODALS = [\n${extra}  { id: 'auth', open: ${offender('  ')} },\n]\n`,
  },
  {
    form: 'object in ArrowFunctionExpression.body',
    key: 'make.<returned>.big',
    extra: ', opts = { big: () => 0 }',
    code: (extra) => `export const make = (a: number${extra}) => ({ big: ${offender()} })\n`,
  },
  {
    form: 'object in CallExpression.arguments[]',
    key: 'outer.<arg 0 of m = configure>.big',
    extra: '  const n = other({ big: (x: number) => x })\n',
    code: (extra) => `export function outer() {\n${extra}  const m = configure({ big: ${offender('  ')} })\n  return m\n}\n`,
  },
  {
    form: 'object in ConditionalExpression.consequent',
    key: 'outer.api.big',
    extra: '  const other = flag ? { big: (x: number) => x } : null\n',
    code: (extra) => `export function outer(flag: boolean) {\n${extra}  const api = flag ? { big: ${offender('  ')} } : null\n  return api\n}\n`,
  },
  {
    form: 'object in JSXExpressionContainer.expression/JSXAttribute',
    jsx: true,
    key: 'Calendar.<Picker formatters>.big',
    extra: '<Picker components={{ big: () => 0 }} />',
    code: (extra) => `export function Calendar() {\n  return <>${extra}<Picker formatters={{ big: ${offender('    ')} }} /></>\n}\n`,
  },
  {
    form: 'object in NewExpression.arguments[]',
    key: 'outer.<arg 0 of m = Measurement>.big',
    extra: '  const n = new Measurement({ big: (x: number) => x })\n',
    code: (extra) => `export function outer() {\n${extra}  const m = new Measurement({ big: ${offender('  ')} })\n  return m\n}\n`,
  },
  {
    form: 'object in ReturnStatement.argument',
    key: 'useThing.<returned>.big',
    extra: '  const big = (x: number) => x\n  void big\n',
    code: (extra) => `export function useThing() {\n${extra}  return { big: ${offender('  ')} }\n}\n`,
  },
]

const caseFile = (c, i) => `src/forms/f${String(i).padStart(2, '0')}.${c.jsx ? 'tsx' : 'ts'}`

let formRun = null

/** Every case in one tree: baselined as written, measured with its unrelated function, then baselined again. */
function runFormCases() {
  if (formRun) return formRun
  const root = mkdtempSync(join(tmpdir(), 'ts-complexity-forms-'))
  const offenders = () => (existsSync(join(root, BASELINE)) ? baseline(root).offenders : {})
  const write = (withExtra) => FORM_CASES.forEach((c, i) => writeFileSync(join(root, caseFile(c, i)), c.code(withExtra ? c.extra : '')))
  try {
    mkdirSync(join(root, 'src', 'forms'), { recursive: true })
    write(false)
    const init = gate(root, '--init')
    const before = offenders()
    write(true)
    const after = gate(root)
    rmSync(join(root, BASELINE), { force: true })
    const again = gate(root, '--init')
    formRun = { init, before, after, again, reread: offenders() }
    return formRun
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

/** The entries of `offenders` for one file. */
const entriesOf = (offenders, file) => Object.fromEntries(Object.entries(offenders).filter(([key]) => key.startsWith(`${file}::`)))

FORM_CASES.forEach((c, i) => test(`${c.form}: an unrelated function added before a baselined offender moves no key`, () => {
  const { init, before, after, again, reread } = runFormCases()
  const file = caseFile(c, i)
  const key = `${file}::${c.key}`
  assert.equal(init.status, 0, output(init))
  assert.deepEqual(output(after).split('\n').filter((line) => line.includes(`${file}::`)), [], 'the ratchet still knows it')
  assert.deepEqual(entriesOf(before, file), { [key]: 17 }, 'baselined under its name')
  assert.equal(again.status, 0, output(again))
  assert.deepEqual(entriesOf(reread, file), { [key]: 17 }, 'measured again under the same key')
}))
