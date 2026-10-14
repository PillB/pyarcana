/**
 * Headless Pyodide check of the playground demos: the one measurement of what a learner's browser
 * runs.
 *
 * A demo that ships an `expectedOutput` is a promise about what the learner sees. The CPython audit
 * (scripts/playground_demo_audit.py) keeps it under the interpreter the lessons pin: Python 3.12 with
 * numpy 2.2.6 and pandas 3.0.5. The browser runs Pyodide 0.26.2: numpy 1.26.4, pandas 2.2.0,
 * scikit-learn 1.4.2, and no sqlite3, lzma or ssl until CodePlayground loads them. A demo can pass
 * the first and fail the second. This script runs the second.
 *
 * For each demo with an expectedOutput it does what CodePlayground does, in this order: load Pyodide,
 * run PLAYGROUND_PRELUDE, load the packages detectRequiredPackages finds in the code (the same map and
 * the same detector the component uses, both from src/lib/pyodide.ts), run the code in a fresh globals
 * dict, and compare the stdout lines joined with "\n" and trimmed with expectedOutput trimmed.
 *
 * Owed, not accepted: PYODIDE_OUTPUT_OWED names the demos that do not match today. It is held exact
 * in both directions, as PINNED_OUTPUT_OWED is in the CPython audit: a new mismatch fails, and so
 * does an owed demo that now passes or no longer exists.
 *
 *   node --import tsx scripts/playground_pyodide_audit.mts
 *
 * Exit codes: 0 every demo matches or is owed; 1 a mismatch that is not owed, or a stale owed entry;
 * 2 refused (the pyodide package is missing, or is not the version PYODIDE_VERSION names); 3 blocked
 * (a Pyodide package would not download: nothing after it was measured, and nothing is reported as
 * passed).
 *
 * The pyodide npm package comes from node_modules (a devDependency pinned to PYODIDE_VERSION).
 * PYARCANA_PYODIDE_DIR points at another install, for a checkout whose node_modules lacks it.
 * Packages other than the core (numpy, pandas, scikit-learn, sqlite3 ...) are downloaded from
 * cdn.jsdelivr.net/pyodide/v<version>/full/ and cached in the package folder.
 *
 * Limit: Python runs on this thread, so a demo that never returns blocks the run. The CPython audit
 * (30 s per demo) catches a runaway demo first.
 */
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { PLAYGROUND_DEMOS, type PlaygroundDemo } from '../src/lib/course/playground-demos.ts'
import { PLAYGROUND_PRELUDE, PYODIDE_VERSION, detectRequiredPackages } from '../src/lib/pyodide.ts'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

/** Milliseconds a package download may take before the run stops as blocked. */
const PACKAGE_LOAD_TIMEOUT_MS = 5 * 60 * 1000

/**
 * Demos whose stdout does not match their expectedOutput under Pyodide 0.26.2, measured 2026-10-14
 * (41 of the 43 demos with an expectedOutput match). Owed, not accepted: the set must shrink as
 * demos are replaced (owner decision O25) and cannot grow.
 *  - databases-orm: its own code is a SyntaxError (an unterminated string literal on line 31).
 *  - security: `hashlib.pbkdf2_hmac` raises AttributeError, because the playground does not load
 *    Pyodide's `hashlib` package (the OpenSSL part of hashlib). The next commit loads it.
 */
export const PYODIDE_OUTPUT_OWED: ReadonlySet<string> = new Set<string>(['databases-orm', 'security'])

/** The part of the Pyodide API this script uses. */
export interface PyodideLike {
  runPythonAsync(code: string, options?: { globals?: unknown }): Promise<unknown>
  loadPackage(
    names: string[],
    options?: { messageCallback?: (message: string) => void; errorCallback?: (message: string) => void },
  ): Promise<unknown>
  setStdout(options: { batched: (line: string) => void }): void
  setStderr(options: { batched: (line: string) => void }): void
  globals: { get(name: string): any }
}

export type Verdict = {
  id: string
  status: 'pass' | 'fail'
  reason: 'ok' | 'output_mismatch' | 'exception'
  detail?: string
  /** Lines the demo wrote to stderr: the learner sees them in red, whatever the verdict. */
  stderr: string[]
}

/** The pyodide package is absent or is not the version the playground loads. */
export class PyodideRefused extends Error {}

/** A Pyodide package would not load; the run stops, because nothing after it was measured. */
export class PackageLoadBlocked extends Error {
  constructor(
    readonly demoId: string,
    readonly packages: string[],
    cause: string,
  ) {
    super(`could not load ${packages.join(', ')} for demo ${demoId}: ${cause}`)
  }
}

export function pyodideDir(env: NodeJS.ProcessEnv = process.env): string {
  return env.PYARCANA_PYODIDE_DIR || join(ROOT, 'node_modules', 'pyodide')
}

/** The install folder, after checking it is the Pyodide the playground loads from the CDN. */
export function locatePyodide(env: NodeJS.ProcessEnv = process.env): string {
  const dir = pyodideDir(env)
  const manifest = join(dir, 'package.json')
  if (!existsSync(manifest) || !existsSync(join(dir, 'pyodide.mjs'))) {
    throw new PyodideRefused(
      `no pyodide package at ${dir}. Install the devDependency (bun install), or point PYARCANA_PYODIDE_DIR at an install of pyodide@${PYODIDE_VERSION}`,
    )
  }
  const version = JSON.parse(readFileSync(manifest, 'utf8')).version
  if (version !== PYODIDE_VERSION) {
    throw new PyodideRefused(
      `${dir} is pyodide ${version}, but the playground loads ${PYODIDE_VERSION} (PYODIDE_VERSION in src/lib/pyodide.ts); a verdict from another version measures nothing the learner runs`,
    )
  }
  return dir
}

/** Pyodide with its core only: no prelude, no package. */
export async function loadCore(env: NodeJS.ProcessEnv = process.env): Promise<PyodideLike> {
  const dir = locatePyodide(env)
  const { loadPyodide } = await import(pathToFileURL(join(dir, 'pyodide.mjs')).href)
  return loadPyodide({ indexURL: dir })
}

/** What CodePlayground does after Pyodide loads and before it accepts code. */
export async function applyPrelude(pyodide: PyodideLike): Promise<void> {
  await pyodide.runPythonAsync(PLAYGROUND_PRELUDE)
}

export async function startRuntime(env: NodeJS.ProcessEnv = process.env): Promise<PyodideLike> {
  const pyodide = await loadCore(env)
  await applyPrelude(pyodide)
  return pyodide
}

/** The same comparison CodePlayground makes: stdout lines joined with a newline, both sides trimmed. */
export function outputMatches(stdoutLines: string[], expectedOutput: string): boolean {
  return stdoutLines.join('\n').trim() === expectedOutput.trim()
}

function withTimeout<T>(work: Promise<T>, ms: number, what: string): Promise<T> {
  let timer: NodeJS.Timeout
  const limit = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${what} took longer than ${ms / 1000} s`)), ms)
  })
  return Promise.race([work, limit]).finally(() => clearTimeout(timer))
}

/** Load what the code needs the way CodePlayground does. A failure here is a stop, not a mismatch. */
async function loadPackagesFor(pyodide: PyodideLike, id: string, code: string): Promise<void> {
  const packages = detectRequiredPackages(code)
  if (packages.length === 0) return
  const complaints: string[] = []
  try {
    await withTimeout(
      pyodide.loadPackage(packages, { messageCallback: () => {}, errorCallback: (m) => complaints.push(m) }),
      PACKAGE_LOAD_TIMEOUT_MS,
      `loading ${packages.join(', ')}`,
    )
  } catch (error) {
    throw new PackageLoadBlocked(id, packages, (error as Error).message ?? String(error))
  }
}

/** A dict that behaves like the playground's `__main__`: `__name__` is "__main__", so warnings show as they do there. */
function freshGlobals(pyodide: PyodideLike): { set(key: string, value: unknown): void; destroy(): void } {
  const globals = pyodide.globals.get('dict')()
  globals.set('__name__', '__main__')
  return globals
}

/** The last non-empty line of a Python error, as CodePlayground shows it. */
function lastLine(error: unknown): string {
  const message = (error as Error)?.message ?? String(error)
  const lines = message.split('\n').filter((line) => line.trim())
  return lines[lines.length - 1] || message
}

async function execute(
  pyodide: PyodideLike,
  code: string,
): Promise<{ stdout: string[]; stderr: string[]; error?: string }> {
  const stdout: string[] = []
  const stderr: string[] = []
  pyodide.setStdout({ batched: (line) => stdout.push(line) })
  pyodide.setStderr({ batched: (line) => stderr.push(line) })
  const globals = freshGlobals(pyodide)
  try {
    await pyodide.runPythonAsync(code, { globals })
    return { stdout, stderr }
  } catch (error) {
    return { stdout, stderr, error: lastLine(error) }
  } finally {
    globals.destroy()
  }
}

/** Run one demo that has an expectedOutput. Throws PackageLoadBlocked when its packages will not load. */
export async function auditDemo(pyodide: PyodideLike, id: string, demo: PlaygroundDemo): Promise<Verdict | null> {
  if (demo.expectedOutput === undefined) return null
  await loadPackagesFor(pyodide, id, demo.code)
  const run = await execute(pyodide, demo.code)
  if (run.error !== undefined) return { id, status: 'fail', reason: 'exception', detail: run.error, stderr: run.stderr }
  if (!outputMatches(run.stdout, demo.expectedOutput)) {
    const got = run.stdout.join('\n').trim().slice(0, 200)
    return { id, status: 'fail', reason: 'output_mismatch', detail: `expected ${JSON.stringify(demo.expectedOutput.trim().slice(0, 200))}, got ${JSON.stringify(got)}`, stderr: run.stderr }
  }
  return { id, status: 'pass', reason: 'ok', stderr: run.stderr }
}

/** Every verdict, in the order of the demos, one at a time (they share one Pyodide). */
export async function auditDemos(pyodide: PyodideLike, demos: Record<string, PlaygroundDemo>): Promise<Verdict[]> {
  const verdicts: Verdict[] = []
  for (const [id, demo] of Object.entries(demos)) {
    const verdict = await auditDemo(pyodide, id, demo)
    if (verdict !== null) verdicts.push(verdict)
  }
  return verdicts
}

/** Two-sided ratchet: a new failure and a stale owed entry are both problems. */
export function ownershipProblems(failing: ReadonlySet<string>, owed: ReadonlySet<string>): string[] {
  const problems: string[] = []
  const fresh = [...failing].filter((id) => !owed.has(id)).sort()
  if (fresh.length > 0) {
    problems.push(`${fresh.length} demo(s) fail their pinned output in Pyodide and are not owed: ${fresh.join(', ')}`)
  }
  const gone = [...owed].filter((id) => !failing.has(id)).sort()
  if (gone.length > 0) {
    problems.push(
      `${gone.length} owed demo(s) now match in Pyodide or no longer exist; remove them from PYODIDE_OUTPUT_OWED so the set shrinks: ${gone.join(', ')}`,
    )
  }
  return problems
}

export type Audit = { code: number; report: Record<string, unknown>; problems: string[]; failures: Verdict[] }

/** Run the demos and decide the exit code: 0 ok, 1 a problem with the owed set. */
export async function runAudit(
  pyodide: PyodideLike,
  demos: Record<string, PlaygroundDemo>,
  owed: ReadonlySet<string>,
): Promise<Audit> {
  const verdicts = await auditDemos(pyodide, demos)
  const failures = verdicts.filter((v) => v.status === 'fail')
  const problems = ownershipProblems(new Set(failures.map((v) => v.id)), owed)
  const report = {
    pyodide: PYODIDE_VERSION,
    demos: Object.keys(demos).length,
    checked: verdicts.length,
    failing: failures.map((v) => v.id).sort(),
    owed: owed.size,
    writingToStderr: verdicts.filter((v) => v.stderr.length > 0).map((v) => v.id),
    ok: problems.length === 0,
  }
  return { code: problems.length === 0 ? 0 : 1, report, problems, failures }
}

export type MainDeps = {
  start: () => Promise<PyodideLike>
  demos: Record<string, PlaygroundDemo>
  owed: ReadonlySet<string>
  out: (text: string) => void
  err: (text: string) => void
}

const REAL_DEPS: MainDeps = {
  start: startRuntime,
  demos: PLAYGROUND_DEMOS,
  owed: PYODIDE_OUTPUT_OWED,
  out: (text) => console.log(text),
  err: (text) => console.error(text),
}

/** The function the npm script runs: the exit code is the gate. */
export async function main(deps: MainDeps = REAL_DEPS): Promise<number> {
  let pyodide: PyodideLike
  try {
    pyodide = await deps.start()
  } catch (error) {
    if (!(error instanceof PyodideRefused)) throw error
    deps.err(`refusing a verdict: ${error.message}`)
    return 2
  }
  try {
    const audit = await runAudit(pyodide, deps.demos, deps.owed)
    deps.out(JSON.stringify(audit.report, null, 2))
    for (const problem of audit.problems) deps.err(`PYODIDE DEMO: ${problem}`)
    for (const v of audit.failures) deps.err(`PYODIDE DEMO ${v.id}: ${v.reason} ${v.detail ?? ''}`)
    return audit.code
  } catch (error) {
    if (!(error instanceof PackageLoadBlocked)) throw error
    deps.err(`BLOCKED, nothing after this demo was measured and nothing is reported as passed: ${error.message}`)
    return 3
  }
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  main().then(
    (code) => {
      process.exitCode = code
    },
    (error) => {
      console.error(error)
      process.exitCode = 4
    },
  )
}
