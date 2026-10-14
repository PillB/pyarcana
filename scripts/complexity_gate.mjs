#!/usr/bin/env node
/**
 * chore(lint): cyclomatic complexity ceiling for TypeScript, JavaScript and the test code, as a
 * per-function ratchet that fails closed. The Python half is scripts/complexity_gate_py.py, and
 * both gates share one policy and one scope file, audit/fixer/complexity_scope.json.
 *
 * This repository has debt above the ceiling, so the ceiling is real and the enforcement is
 * directional. A function new to the codebase must meet 15. A baselined function may not rise above
 * the score recorded for it, and a function that falls leaves the baseline or is lowered in it.
 * Keys are path::identity. A function is named by what it is, not by where it sits (see
 * complexity_gate.identity.mjs): `const f = () => {}` is `f`, a method is `Class.method`, a callback
 * is `outer.<arg 0 of items.map>`, or `<arg 0 of total = rows.reduce>` when the call's result is
 * bound, or `<arg 1 of test "title">` when the call is given a title. A number is the fallback for
 * what has no name: only units of one file that share a whole path are numbered, #2, #3, on the
 * segment where their paths part. So a number moves only when a unit with that same path is added
 * before it, such as a third unbound `rows.map` callback in the same JSX tree; a function added
 * with any other path, anywhere in the file, moves no key.
 *
 * Fail closed: a file ESLint cannot parse fails the gate and names path:line. A missing baseline
 * fails the gate, and --init creates one but refuses to overwrite it, so a re-baseline shows
 * in the diff. A scope that measures no function fails the gate rather than passing empty.
 *
 *   node scripts/complexity_gate.mjs              # check, and tighten the baseline if debt fell
 *   node scripts/complexity_gate.mjs --init       # create the baseline (refuses if one exists)
 *   node scripts/complexity_gate.mjs --root DIR   # measure another tree (used by the tests)
 *   node scripts/complexity_gate.mjs --scope FILE # read another scope file (used by the tests)
 *
 * Counting is ESLint 9.39.2's `complexity` rule, run with a threshold of 0 so that every function
 * reports its score, wrapped by scripts/complexity_gate.rule.mjs so each report carries the identity
 * above. Its configuration is scripts/complexity_gate.eslint.config.mjs.
 */
import { ESLint } from 'eslint'
import { createRequire } from 'node:module'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = resolve(HERE, '..')
const CEILING = 15
const BASELINE_NAME = 'audit/fixer/complexity_baseline.json'
const SCOPE_FILE = join(REPO, 'audit/fixer/complexity_scope.json')
const CONFIG = join(HERE, 'complexity_gate.eslint.config.mjs')
const CONVENTION = 'per function; the ESLint complexity rule, which counts a function the way NIST SP 500-235 4.1 does for these constructs; ceiling 15'
const { version: ESLINT_VERSION } = createRequire(import.meta.url)('eslint/package.json')
const COMPLEXITY = /^(.*) has a complexity of (\d+)\.$/s

/** Relative path to a rule-friendly key, using `/` on every platform. */
const posix = (path) => path.split(sep).join('/')

/** Orders by code unit, so the baseline is byte-identical wherever it is written. */
const byText = (a, b) => (a < b ? -1 : a > b ? 1 : 0)

/** `Panel.<prop onClick> has a complexity of 20.` -> { name: 'Panel.<prop onClick>', score: 20 }. */
export function parseComplexity(message) {
  const found = COMPLEXITY.exec(message)
  return found ? { name: found[1], score: Number(found[2]) } : null
}

export function excluded(rel, exclusions) {
  return exclusions.some(({ path }) => rel === path || (path.endsWith('/') && rel.startsWith(path)))
}

/** Every function in scope, measured. `problems` lists any file that cannot be measured. */
export async function measure(root, scopeFile = SCOPE_FILE) {
  const scope = JSON.parse(readFileSync(scopeFile, 'utf8'))
  const patterns = scope.typescript.flatMap(({ root: dir, suffixes }) => suffixes.map((s) => `${dir}/**/*${s}`))
  const eslint = new ESLint({ cwd: root, overrideConfigFile: CONFIG, errorOnUnmatchedPattern: false })
  const rows = []
  const problems = []
  for (const result of await eslint.lintFiles(patterns)) {
    const rel = posix(relative(root, result.filePath))
    if (excluded(rel, scope.GATE_EXCLUSIONS)) continue
    for (const m of result.messages) {
      if (m.fatal) {
        problems.push(`${rel}:${m.line ?? 1}: cannot parse (${m.message})`)
      } else if (m.ruleId === null && /^File ignored/.test(m.message)) {
        problems.push(`${rel}: ignored by ESLint, so it was not measured`)
      } else if (m.ruleId === 'gate/measure') {
        const found = parseComplexity(m.message)
        if (found) rows.push({ file: rel, function: found.name, line: m.line, column: m.column, score: found.score })
        else problems.push(`${rel}:${m.line}: unreadable complexity message: ${m.message}`)
      }
    }
  }
  return { rows, problems }
}

/**
 * Every function's score under its key. The identity already numbers units that share a path; this
 * only keeps two keys apart whose text happens to match, as `a.b = () => {}` and `const a = { b() {} }`
 * do, with #2 in source order.
 */
export function keyed(rows) {
  const ordered = [...rows].sort((a, b) => byText(a.file, b.file) || a.line - b.line || a.column - b.column)
  const seen = new Map()
  const out = {}
  for (const row of ordered) {
    const base = `${row.file}::${row.function}`
    const n = (seen.get(base) ?? 0) + 1
    seen.set(base, n)
    out[n === 1 ? base : `${base}#${n}`] = row.score
  }
  return out
}

export function overCeiling(scores) {
  return Object.fromEntries(Object.entries(scores).filter(([, s]) => s > CEILING).sort(([a], [b]) => byText(a, b)))
}

export function payload(over) {
  const scores = Object.values(over)
  return {
    ceiling: CEILING,
    convention: CONVENTION,
    eslint: ESLINT_VERSION,
    over_ceiling: scores.length,
    worst: Math.max(0, ...scores),
    offenders: over,
  }
}

const writeBaseline = (path, data) => {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, `${JSON.stringify(data, null, 1)}\n`)
}

const reportProblems = (problems) => {
  for (const p of problems) console.log(`  UNPARSEABLE ${p}`)
}

async function init(root, scopeFile) {
  const path = join(root, BASELINE_NAME)
  if (existsSync(path)) {
    console.log(`REFUSED ${BASELINE_NAME} exists; delete it first, so the re-baseline shows in the diff`)
    return 1
  }
  const { rows, problems } = await measure(root, scopeFile)
  if (problems.length) return reportProblems(problems), 1
  if (rows.length === 0) return console.log('FAIL the scope measured no functions; check audit/fixer/complexity_scope.json'), 1
  const fresh = payload(overCeiling(keyed(rows)))
  writeBaseline(path, fresh)
  console.log(`baseline written: ${fresh.over_ceiling} over ${CEILING}, worst ${fresh.worst}`)
  return 0
}

async function ratchet(root, scopeFile) {
  const path = join(root, BASELINE_NAME)
  const { rows, problems } = await measure(root, scopeFile)
  if (problems.length) return reportProblems(problems), 1
  if (rows.length === 0) return console.log('FAIL the scope measured no functions; check audit/fixer/complexity_scope.json'), 1
  if (!existsSync(path)) return console.log(`FAIL no baseline at ${BASELINE_NAME}; create it with --init and commit it`), 1
  const over = overCeiling(keyed(rows))
  const recorded = JSON.parse(readFileSync(path, 'utf8')).offenders
  const failures = []
  for (const [key, score] of Object.entries(over)) {
    if (!(key in recorded)) failures.push(`  NEW OVER ${String(score).padStart(3)} ${key}`)
    else if (score > recorded[key]) failures.push(`  GREW ${String(recorded[key]).padStart(3)} -> ${String(score).padStart(3)} ${key}`)
  }
  if (failures.length) {
    console.log('FAIL typescript complexity grew. Split the function, or reduce it before adding to it:')
    console.log(failures.join('\n'))
    return 1
  }
  const fresh = payload(over)
  if (JSON.stringify(fresh) !== JSON.stringify(JSON.parse(readFileSync(path, 'utf8')))) {
    writeBaseline(path, fresh)
    console.log('debt fell; baseline tightened. Commit the tightened baseline.')
  }
  console.log(`typescript complexity: ${fresh.over_ceiling} over ${CEILING}, worst ${fresh.worst}; baseline recorded ${Object.keys(recorded).length}`)
  return 0
}

/** The value after `flag`, or `fallback` when the flag is absent. A flag with no value is a usage error. */
function option(flag, fallback) {
  const at = process.argv.indexOf(flag)
  if (at === -1) return fallback
  if (at + 1 >= process.argv.length) {
    console.error(`FAIL ${flag} needs a value`)
    process.exit(2)
  }
  return resolve(process.argv[at + 1])
}

const root = option('--root', REPO)
const scopeFile = option('--scope', SCOPE_FILE)
process.exitCode = process.argv.includes('--init') ? await init(root, scopeFile) : await ratchet(root, scopeFile)
