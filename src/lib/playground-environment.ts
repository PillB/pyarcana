/**
 * Where a playground example runs (SIM-11).
 *
 * The browser runs Pyodide, which ships other versions of the scientific libraries than the course
 * pins in requirements-content.txt. An example that imports a pinned package prints a result that
 * depends on that version, so the browser can differ from the course's printed output. Such an
 * example is declared `local-python`: the learner sees the code read-only, with a notice, and runs
 * it in their own environment. Any value that is not `browser-pyodide` fails closed to local-only.
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

/** The import name of each pinned package whose import name differs from the package name. */
const IMPORT_NAME: Readonly<Record<string, string>> = {
  'scikit-learn': 'sklearn',
  pillow: 'PIL',
  pymupdf: 'fitz',
  'python-docx': 'docx',
}

/** The module each package a requirements file pins is imported as: `scikit-learn==1.6.1` gives `sklearn`. */
export function pinnedModules(requirements: string): string[] {
  return requirements
    .split('\n')
    .map((line) => line.replace(/#.*$/, '').trim())
    .filter((line) => /^[A-Za-z0-9_.-]+==/.test(line))
    .map((line) => {
      const name = line.split('==')[0].toLowerCase()
      return IMPORT_NAME[name] ?? name.replace(/-/g, '_')
    })
}

/** The top-level module of each import a snippet makes, one per line: `import numpy as np, json` gives numpy and json. */
export function importedModules(code: string): string[] {
  return code
    .split('\n')
    .flatMap((raw) => {
      const line = raw.trim()
      const from = /^from\s+([\w.]+)\s+import\b/.exec(line)
      if (from) return [from[1]]
      const plain = /^import\s+(.+)$/.exec(line)
      if (!plain) return []
      return plain[1].split(',').map((part) => part.trim().split(/\s+/)[0])
    })
    .map((module) => module.split('.')[0])
}

/**
 * The first pinned package a snippet imports, or undefined. A pinned import means the printed output
 * depends on that version, so the example must be declared local-python.
 */
export function pinnedImport(code: string, pinned: readonly string[]): string | undefined {
  return importedModules(code).find((module) => pinned.includes(module))
}
