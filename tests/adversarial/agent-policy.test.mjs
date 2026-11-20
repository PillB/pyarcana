/**
 * The agent policy stays in force (owner request, 19 Nov 2026).
 *
 * Correct behaviour: AGENTS.md carries every binding rule the owner asked for, CLAUDE.md points
 * to it, and the complexity gate really refuses a function one branch over its ceiling.
 * Defects this catches: a rule edited out of AGENTS.md in a broad rewrite; CLAUDE.md losing its
 * pointer; the gate's ceiling raised, or its ESLint override silently not applied, so that
 * `complexity_gate.mjs` keeps printing a pass while measuring nothing.
 *
 * Each failure names the missing rule and the file, so the fix needs no re-run to diagnose.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ESLint } from 'eslint'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8')

/** Rule, and a pattern that only matches while the rule is stated. */
const AGENTS_RULES = [
  ['expert standard: name the expert and the benchmark', /name the expert and the published benchmark/i],
  ['expert standard: a nameable objection means change the choice', /reject your choice, it is already wrong/i],
  ['every trade-off is stated', /State every trade-off/],
  ['tests must be able to fail, proven by breaking the guarded code', /A test must be able to fail\. Prove it/],
  ['tests model the correct behaviour and the defect', /Model both behaviours/],
  ['tautological tests are harmful', /Tautological tests are considered harmful/],
  ['a test for every task and every round', /Every task and every round ships with such a test/],
  ['chore(lint) complexity ceiling in the done list', /node scripts\/complexity_gate\.mjs\s+#\s*cyclomatic ceiling 15/],
  ['one failed hypothesis, then research', /One failed hypothesis, then research/],
  ['pre-execution round comparing routes', /Pre-execution round\.\*\* Before building, name at least two\s+routes/],
  ['red-team before shipping', /Red-team before shipping/],
  ['simulate drift for code that reads lesson content', /Simulate drift\.\*\* Code that reads lesson content/],
  ['static journeys in the done list', /npm run test:static-journeys/],
  ['fail loudly with a diagnosis', /## Fail loudly[\s\S]*expected against actual[\s\S]*REFUSED/],
]

test('AGENTS.md states every binding rule', () => {
  const agents = read('AGENTS.md')
  const missing = AGENTS_RULES.filter(([, re]) => !re.test(agents)).map(([name]) => name)
  assert.deepEqual(missing, [], `AGENTS.md no longer states: ${missing.join('; ')}`)
})

test('CLAUDE.md sends the reader to AGENTS.md by link and by path', () => {
  const claude = read('CLAUDE.md')
  assert.match(claude, /\[`AGENTS\.md`\]\(\.\/AGENTS\.md\)/, 'CLAUDE.md lost its link to ./AGENTS.md')
  assert.match(claude, /\/pyarcana\/AGENTS\.md`/, 'CLAUDE.md lost the absolute path of AGENTS.md')
  assert.match(claude, /complexity_gate\.mjs/, 'CLAUDE.md lost the chore(lint) complexity gate')
  assert.ok(existsSync(join(ROOT, 'AGENTS.md')), 'CLAUDE.md points to an AGENTS.md that does not exist')
})

/** A function whose cyclomatic complexity is exactly `n` (1 + n - 1 if-branches). */
function functionOfComplexity(n) {
  const branches = Array.from({ length: n - 1 }, (_, i) => `  if (x === ${i}) return ${i}`).join('\n')
  return `export function f(x) {\n${branches}\n  return -1\n}\n`
}

test('the complexity gate refuses one branch over its ceiling and accepts the ceiling', async () => {
  const gate = read('scripts/complexity_gate.mjs')
  const m = /const CEILING = (\d+)/.exec(gate)
  assert.ok(m, 'scripts/complexity_gate.mjs: no `const CEILING = N` to read')
  const ceiling = Number(m[1])
  assert.equal(ceiling, 15, `complexity ceiling is ${ceiling}; AGENTS.md and the owner set 15`)
  assert.match(gate, /complexity: \['error', CEILING\]/, 'the gate no longer applies CEILING to ESLint')

  // The same override the gate uses, so a config change that disables it shows up here.
  const eslint = new ESLint({
    cwd: ROOT,
    overrideConfig: { rules: { complexity: ['error', ceiling] } },
    overrideConfigFile: join(ROOT, 'eslint.config.mjs'),
  })
  const hits = async (code) => {
    const [r] = await eslint.lintText(code, { filePath: join(ROOT, 'src/lib/__complexity_probe__.ts') })
    return r.messages.filter((x) => x.ruleId === 'complexity').map((x) => x.message)
  }
  assert.deepEqual(await hits(functionOfComplexity(ceiling)), [], `a function AT the ceiling (${ceiling}) was refused`)
  const over = await hits(functionOfComplexity(ceiling + 1))
  assert.equal(over.length, 1, `a function at ${ceiling + 1} passed the gate's ESLint config: the gate measures nothing`)
  assert.match(over[0], new RegExp(`complexity of ${ceiling + 1}`))
})

test('the static-journeys command AGENTS.md names exists and refuses instead of guessing', () => {
  const pkg = JSON.parse(read('package.json'))
  assert.equal(pkg.scripts['test:static-journeys'], 'bash scripts/run_static_journeys.sh', 'package.json: test:static-journeys is gone or points elsewhere')
  const script = read('scripts/run_static_journeys.sh')
  for (const spec of ['static_public.spec.ts', 'safe_agent_journeys.spec.ts', 'static_first_paint.spec.ts']) {
    assert.ok(script.includes(spec), `run_static_journeys.sh no longer runs ${spec}, which CI does`)
    assert.ok(read('.github/workflows/tests.yml').includes(spec), `CI no longer runs ${spec}; align the script with tests.yml`)
  }
  assert.ok((script.match(/REFUSED:/g) ?? []).length >= 3, 'run_static_journeys.sh lost its REFUSED preconditions (missing build, wrong base path, busy port)')
  assert.match(read('playwright.config.ts'), /PW_CHROMIUM_PATH/, 'playwright.config.ts no longer honours PW_CHROMIUM_PATH')
})
