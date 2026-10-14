/**
 * What the playground loads before the learner's code runs (src/lib/pyodide.ts).
 *
 * Named defect: Pyodide 0.26.2 does not include sqlite3, lzma or ssl, so a demo that imports one
 * fails in the browser with ModuleNotFoundError unless CodePlayground loads the package first.
 * CPython has all three, so every check that ran under CPython passed the demo. The import ->
 * package map moved out of CodePlayground into src/lib/pyodide.ts so the content gates read the
 * map the learner's browser uses. Each test below names the defect it guards.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { locatePyodide } from '../../scripts/playground_pyodide_audit.mts'
import { PYODIDE_UNVENDORED_STDLIB, PYODIDE_VERSION, REQUIRED_PACKAGES, detectRequiredPackages } from '@/lib/pyodide'

const ROOT = join(import.meta.dirname, '..', '..')
const PLAYGROUND = readFileSync(join(ROOT, 'src/components/course/CodePlayground.tsx'), 'utf8')

test('a demo that imports sqlite3, lzma or ssl makes the playground load that package', () => {
  // Defect: the map lacks the three unvendored standard-library modules, so the import fails in the browser.
  assert.deepEqual(detectRequiredPackages('import sqlite3\nconn = sqlite3.connect(":memory:")\n'), ['sqlite3'])
  assert.deepEqual(detectRequiredPackages('import lzma\n'), ['lzma'])
  assert.deepEqual(detectRequiredPackages('import ssl\n'), ['ssl'])
})

test('the detector still reads every import form the playground handled before the move', () => {
  // Defect: the move changes the regex. The follow-on characters are whitespace, a comma, the end
  // of the line, or a dot, and the match is at the start of a line.
  assert.deepEqual(detectRequiredPackages('import numpy as np\n'), ['numpy'])
  assert.deepEqual(detectRequiredPackages('import matplotlib.pyplot as plt\n'), ['matplotlib'])
  assert.deepEqual(detectRequiredPackages('from sklearn.linear_model import LogisticRegression\n'), ['scikit-learn'])
  assert.deepEqual(detectRequiredPackages('def f():\n    import pandas as pd\n'), ['pandas'])
  assert.deepEqual(detectRequiredPackages('# import numpy\nprint("import numpy")\n'), [])
  assert.deepEqual(detectRequiredPackages('import json\nfrom pathlib import Path\n'), [])
})

test('an import name that is only a prefix of another package does not load it', () => {
  // Defect (false positive): `import numpy_financial` loads numpy because the name starts with it.
  assert.deepEqual(detectRequiredPackages('import numpy_financial\n'), [])
})

test('every unvendored module the map loads is loaded under the package that provides it', () => {
  // Defect: REQUIRED_PACKAGES says `sqlite3: sqlite` (or similar), so loadPackage fetches nothing useful.
  for (const [importName, packageName] of Object.entries(REQUIRED_PACKAGES)) {
    const unvendored = PYODIDE_UNVENDORED_STDLIB[importName]
    if (unvendored !== undefined) assert.equal(packageName, unvendored, importName)
  }
  for (const importName of ['sqlite3', 'lzma', 'ssl']) {
    assert.ok(importName in REQUIRED_PACKAGES, `${importName} is unvendored and must be loaded`)
  }
})

// --- against the pinned Pyodide: its lock file lists every package, and says which are stdlib modules ---

type LockedPackage = { package_type: string; imports: string[] }
const canonical = (name: string) => name.toLowerCase().replace(/[-_.]+/g, '-')
const lockedPackages = (): Record<string, LockedPackage> =>
  JSON.parse(readFileSync(join(locatePyodide(), 'pyodide-lock.json'), 'utf8')).packages

test('PYODIDE_UNVENDORED_STDLIB is exactly what the lock file ships as separate stdlib modules', () => {
  // Defect: the hand-listed names drift from Pyodide (a typo, or a release that moves a module), and the
  // import-scope guard trusts a list that no longer matches the runtime the learner has.
  const expected: Record<string, string> = {}
  for (const [name, pkg] of Object.entries(lockedPackages())) {
    if (pkg.package_type !== 'cpython_module') continue
    for (const importName of pkg.imports) expected[importName] = name
  }
  assert.deepEqual(PYODIDE_UNVENDORED_STDLIB, expected)
})

test('every package REQUIRED_PACKAGES names is a package of the pinned Pyodide', () => {
  // Defect: `sqlite3: 'sqlite'`. loadPackage logs "No known package" and carries on, the import then
  // fails, and the learner sees ModuleNotFoundError after a download that loaded nothing.
  const known = new Set(Object.keys(lockedPackages()).map(canonical))
  for (const [importName, packageName] of Object.entries(REQUIRED_PACKAGES)) {
    assert.ok(known.has(canonical(packageName)), `${importName} -> ${packageName} is not a package of Pyodide ${PYODIDE_VERSION}`)
  }
})

test('the pyodide devDependency and the lock file are the version the playground loads from the CDN', () => {
  // Defect: PYODIDE_VERSION moves to a release the gate does not install, so the headless gate keeps
  // measuring the old Pyodide and reports green for a runtime no learner has any more.
  const manifest = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))
  assert.equal(manifest.devDependencies.pyodide, PYODIDE_VERSION)
  assert.ok(readFileSync(join(ROOT, 'bun.lock'), 'utf8').includes(`"pyodide@${PYODIDE_VERSION}"`), 'bun.lock lacks pyodide')
})

test('CI runs the headless Pyodide gate: the adversarial job runs an npm script that includes it', () => {
  // Defect: the gate exists and nothing runs it, so a demo that fails in the learner's browser ships.
  const { scripts } = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))
  assert.match(scripts['test:playground-pyodide'], /playground_pyodide_audit\.mts/)
  assert.ok(scripts['test:adversarial:node'].includes('npm run test:playground-pyodide'), 'test:adversarial:node skips the gate')
  assert.ok(scripts['test:adversarial'].includes('npm run test:adversarial:node'), 'test:adversarial skips the node half')
  const workflow = readFileSync(join(ROOT, '.github/workflows/tests.yml'), 'utf8')
  assert.ok(/^\s*run: npm run test:adversarial\s*$/m.test(workflow), 'the adversarial job no longer runs npm run test:adversarial')
})

test('CodePlayground loads packages through the map in src/lib/pyodide.ts and keeps no map of its own', () => {
  // Defect: the component keeps a private map again, so the gates measure a map the browser does not use.
  // (ok(regex.test(...)) and not assert.match: a failed match would print the whole component.)
  assert.ok(
    /import \{[^}]*\bdetectRequiredPackages\b[^}]*\} from '@\/lib\/pyodide'/.test(PLAYGROUND),
    'CodePlayground does not import detectRequiredPackages from @/lib/pyodide',
  )
  assert.ok(/detectRequiredPackages\(code\)/.test(PLAYGROUND), 'CodePlayground does not call detectRequiredPackages(code)')
  assert.ok(!/REQUIRED_PACKAGES\s*[:=]/.test(PLAYGROUND), 'CodePlayground defines a private REQUIRED_PACKAGES map')
  assert.ok(!/(?:const|function)\s+detectRequiredPackages/.test(PLAYGROUND), 'CodePlayground defines a private detector')
})
