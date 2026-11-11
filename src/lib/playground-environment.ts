/**
 * Where a playground example runs (SIM-11).
 *
 * The browser runs Pyodide, which ships other versions of the scientific libraries than the course
 * pins in requirements-content.txt. An example that uses a pinned package prints a result that
 * depends on that version, so the browser can differ from the course's printed output. Such an
 * example is declared `local-python`: the learner sees the code read-only, with a notice, and runs
 * it in their own environment. Any value that is not `browser-pyodide` fails closed to local-only.
 * An import the code never uses changes no output, so it does not make an example local-only
 * (owner decision O25: the S11 demo imports numpy and never calls it, and keeps its Run button).
 */

export type PlaygroundEnvironment = 'browser-pyodide' | 'local-python'
export type PlaygroundMode = 'run-in-browser' | 'local-only'

export function playgroundMode(environment: PlaygroundEnvironment): PlaygroundMode {
  return environment === 'browser-pyodide' ? 'run-in-browser' : 'local-only'
}

/** The learner notice shown above a local-only example. Written by Codex (run sim11-note). */
export const LOCAL_PYTHON_NOTE = {
  title: 'Versiones diferentes',
  body: 'Este ejemplo usa una biblioteca cuya versión fija el curso, pero el navegador tiene otra; por eso, el resultado puede diferir del que aparece impreso en el curso. Para ejecutarlo como lo muestra el curso, guarda el código en un archivo y ejecútalo en tu propio entorno, con las bibliotecas en las versiones fijadas por el curso.',
} as const

/** The command shown under a local-only example, after the learner has saved the code in a file. Written by Codex (run sim11-demo). */
export const LOCAL_RUN_COMMAND = 'python archivo.py'

/**
 * The import names of each pinned package whose import name differs from the package name. One
 * package can be imported under more than one name: PyMuPDF 1.28 is imported as `pymupdf`, and
 * `fitz` is its older, deprecated alias, which still imports. Both count as the pinned package.
 */
const IMPORT_NAMES: Readonly<Record<string, readonly string[]>> = {
  'scikit-learn': ['sklearn'],
  pillow: ['PIL'],
  pymupdf: ['pymupdf', 'fitz'],
  'python-docx': ['docx'],
}

/** The modules each package a requirements file pins is imported as: `scikit-learn==1.6.1` gives `sklearn`. */
export function pinnedModules(requirements: string): string[] {
  return requirements
    .split('\n')
    .map((line) => line.replace(/#.*$/, '').trim())
    .filter((line) => /^[A-Za-z0-9_.-]+==/.test(line))
    .flatMap((line) => {
      const name = line.split('==')[0].toLowerCase()
      return IMPORT_NAMES[name] ?? [name.replace(/-/g, '_')]
    })
}

/**
 * One module a snippet imports and the names the import binds in the snippet. `names` is null for
 * `from m import *`, which binds names the text does not show.
 */
export interface ImportBinding {
  readonly module: string
  readonly names: readonly string[] | null
}

const topLevel = (module: string): string => module.split('.')[0]

/** What `import a.b as c, d` binds: `c` for the aliased one, the top-level module for the rest. */
function plainImport(list: string): ImportBinding[] {
  return list.split(',').map((part) => {
    const [module, , alias] = part.trim().split(/\s+/)
    return { module: topLevel(module), names: [alias ?? topLevel(module)] }
  })
}

/** What `from m import a as b, (c)` binds: the alias where there is one. */
function fromImport(module: string, list: string): ImportBinding[] {
  const body = list.replace(/[()]/g, ' ').trim()
  if (body === '*') return [{ module: topLevel(module), names: null }]
  const names = body
    .split(',')
    .map((part) => part.trim().split(/\s+as\s+/).pop() ?? '')
    .filter((name) => name !== '')
  return [{ module: topLevel(module), names }]
}

function parseImport(statement: string): ImportBinding[] {
  const from = /^from\s+([\w.]+)\s+import\b\s*([\s\S]*)$/.exec(statement)
  if (from) return fromImport(from[1], from[2])
  const plain = /^import\s+([\s\S]+)$/.exec(statement)
  return plain ? plainImport(plain[1]) : []
}

const IMPORT_START = /^\s*(?:import\s|from\s+[\w.]+\s+import\b)/

/** An import continues on the next line inside an open parenthesis or after a trailing backslash. */
function continues(statement: string): boolean {
  return /\\\s*$/.test(statement) || (statement.includes('(') && !statement.includes(')'))
}

const dropComment = (line: string): string => line.replace(/#.*$/, '')

/** Reads one import statement that starts at `lines[at]`, joined over its continuation lines. */
function readImport(first: string, lines: readonly string[], at: number): { statement: string; last: number } {
  let statement = dropComment(first)
  let last = at
  while (continues(statement) && last + 1 < lines.length) {
    last += 1
    statement = statement.replace(/\\\s*$/, ' ') + ' ' + dropComment(lines[last])
  }
  return { statement: statement.trim(), last }
}

export interface ScannedImports {
  /** Every import, in source order. */
  readonly bindings: readonly ImportBinding[]
  /** The code that is left once the import statements are taken out. */
  readonly rest: string
}

/** Splits a snippet into its imports and everything else. `a; import b` is two statements. */
export function scanImports(code: string): ScannedImports {
  const lines = code.split('\n')
  const bindings: ImportBinding[] = []
  const rest: string[] = []
  for (let at = 0; at < lines.length; at += 1) {
    const kept: string[] = []
    let line = at
    for (const part of lines[at].split(';')) {
      if (!IMPORT_START.test(part)) {
        kept.push(part)
        continue
      }
      const read = readImport(part, lines, at)
      bindings.push(...parseImport(read.statement))
      line = Math.max(line, read.last)
    }
    rest.push(kept.join(';'))
    at = line
  }
  return { bindings, rest: rest.join('\n') }
}

/** The top-level module of each import a snippet makes: `import numpy as np, json` gives numpy and json. */
export function importedModules(code: string): string[] {
  return scanImports(code).bindings.map((binding) => binding.module)
}

/** Where the scanner is in a Python snippet: the delimiter that closes the string it is inside, or '' in code. */
interface Step {
  readonly text: string
  readonly next: number
  readonly quote: string
}

function stringStep(code: string, at: number, quote: string): Step {
  const ch = code[at]
  if (ch === '\\') return { text: code.slice(at, at + 2), next: at + 2, quote }
  if (code.startsWith(quote, at)) return { text: quote, next: at + quote.length, quote: '' }
  // A one-quote string cannot span lines: an unclosed one is a syntax error, so read the next line as code.
  if (ch === '\n' && quote.length === 1) return { text: ch, next: at + 1, quote: '' }
  return { text: ch, next: at + 1, quote }
}

function codeStep(code: string, at: number): Step {
  const ch = code[at]
  if (ch === '#') {
    const end = code.indexOf('\n', at)
    return { text: '', next: end === -1 ? code.length : end, quote: '' }
  }
  const triple = code.slice(at, at + 3)
  if (triple === '"""' || triple === "'''") return { text: triple, next: at + 3, quote: triple }
  if (ch === '"' || ch === "'") return { text: ch, next: at + 1, quote: ch }
  return { text: ch, next: at + 1, quote: '' }
}

/**
 * The code without its `#` comments. A `#` inside a string starts no comment, and the string stays,
 * because it can run code: f"{np.mean(x)}" uses np.
 */
export function withoutComments(code: string): string {
  let out = ''
  let quote = ''
  for (let at = 0; at < code.length; ) {
    const step = quote === '' ? codeStep(code, at) : stringStep(code, at, quote)
    out += step.text
    at = step.next
    quote = step.quote
  }
  return out
}

/** Every identifier in a snippet's code, comments excluded. A word inside a string counts: the check errs toward "used". */
function identifiersUsed(code: string): Set<string> {
  return new Set(withoutComments(code).match(/[A-Za-z_]\w*/g) ?? [])
}

/**
 * The first pinned package a snippet imports, or undefined. This reads imports only; it does not ask
 * whether the code uses them.
 */
export function pinnedImport(code: string, pinned: readonly string[]): string | undefined {
  return importedModules(code).find((module) => pinned.includes(module))
}

/**
 * The first pinned package a snippet imports and uses, or undefined. A package the code calls prints
 * a result that depends on its version, so the example must be declared local-python. An import the
 * code never refers to changes no output and does not count. A star import binds names the text does
 * not show, so it counts; so does a bound name that appears inside a string (the check errs toward
 * local-python, which is the safe side).
 */
export function pinnedImportUsed(code: string, pinned: readonly string[]): string | undefined {
  const { bindings, rest } = scanImports(code)
  const used = identifiersUsed(rest)
  return bindings.find(
    (binding) => pinned.includes(binding.module) && (binding.names === null || binding.names.some((name) => used.has(name)))
  )?.module
}
