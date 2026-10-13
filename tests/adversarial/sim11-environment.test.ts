/**
 * SIM-11: an example's declared environment is load-bearing, and the course's own pins decide it.
 *
 * The browser runs Pyodide, which ships other versions of the libraries that requirements-content.txt
 * pins. An example that imports a pinned package prints a version-dependent result, so it must be
 * declared `local-python`. Two checks follow from that rule:
 * - the playground (SectionView's "Pruébalo tú mismo" demos) is two-sided: a pinned import is
 *   local-python, and a local-python example is one that imports a pinned package; the component
 *   reads the declared environment, so a local-python example is never run in the browser;
 * - the I Do demos (`demoId` steps in the section files) are one-sided: a pinned import must be
 *   declared local-python, so a future block (S19, S20, S23) cannot print a pinned output in the browser.
 * Each rule is recreated on fixture examples, and the real tree must satisfy both.
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import {
  LOCAL_PYTHON_NOTE,
  importedModules,
  pinnedImport,
  pinnedModules,
  playgroundMode,
} from '../../src/lib/playground-environment.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const PLAYGROUND_ENVIRONMENTS = new Set(['browser-pyodide', 'local-python'])

export interface Example {
  readonly name: string
  readonly code: string
  readonly environment: string | undefined
}

const nameOf = (p: ts.ObjectLiteralElementLike): string | undefined =>
  p.name && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)) ? p.name.text : undefined

function textOf(node: ts.Expression | undefined): string | undefined {
  if (!node) return undefined
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text
  if (ts.isTemplateExpression(node)) return node.getText().slice(1, -1)
  return undefined
}

function propertiesOf(node: ts.ObjectLiteralExpression): Map<string, ts.Expression> {
  const out = new Map<string, ts.Expression>()
  for (const p of node.properties) {
    const name = nameOf(p)
    if (name !== undefined && ts.isPropertyAssignment(p)) out.set(name, p.initializer)
  }
  return out
}

function parse(file: string, source: string): ts.SourceFile {
  return ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
}

/** Every entry of the `demos` object in SectionView.tsx, keyed by its section slug. */
export function playgroundExamples(sectionView: string): Example[] {
  const out: Example[] = []
  const visit = (node: ts.Node): void => {
    if (ts.isVariableDeclaration(node) && node.name.getText() === 'demos' && node.initializer && ts.isObjectLiteralExpression(node.initializer)) {
      for (const p of node.initializer.properties) {
        const entry = ts.isPropertyAssignment(p) && ts.isObjectLiteralExpression(p.initializer) ? propertiesOf(p.initializer) : undefined
        if (entry) out.push({ name: nameOf(p) ?? '?', code: textOf(entry.get('code')) ?? '', environment: textOf(entry.get('environment')) })
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(parse('SectionView.tsx', sectionView))
  return out
}

/** Every I Do demo step in one section file: an object with a `demoId` and a `code` object. */
export function iDoExamples(file: string, source: string): Example[] {
  const out: Example[] = []
  const visit = (node: ts.Node): void => {
    if (ts.isObjectLiteralExpression(node)) {
      const props = propertiesOf(node)
      const code = props.get('code')
      if (props.has('demoId') && code && ts.isObjectLiteralExpression(code)) {
        out.push({
          name: `${file} ${textOf(props.get('demoId')) ?? '?'}`,
          code: textOf(propertiesOf(code).get('code')) ?? '',
          environment: textOf(props.get('environment')),
        })
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(parse(file, source))
  return out
}

/** Two-sided: a pinned import is local-python, and local-python is only for a pinned import. */
export function playgroundFailures(examples: readonly Example[], pinned: readonly string[]): string[] {
  return examples.flatMap((ex) => {
    const pkg = pinnedImport(ex.code, pinned)
    if (ex.environment === undefined || !PLAYGROUND_ENVIRONMENTS.has(ex.environment)) {
      return [`${ex.name} declares environment '${ex.environment}': not browser-pyodide or local-python`]
    }
    if (pkg !== undefined && ex.environment !== 'local-python') {
      return [`${ex.name} imports ${pkg}, which the course pins: its environment must be local-python`]
    }
    if (pkg === undefined && ex.environment === 'local-python') {
      return [`${ex.name} imports no pinned package: its environment must be browser-pyodide`]
    }
    return []
  })
}

/** One-sided: a pinned import must be declared local-python. Other declared values are not checked here. */
export function iDoFailures(examples: readonly Example[], pinned: readonly string[]): string[] {
  return examples.flatMap((ex) => {
    const pkg = pinnedImport(ex.code, pinned)
    return pkg !== undefined && ex.environment !== 'local-python'
      ? [`${ex.name} imports ${pkg}, which the course pins: its environment must be local-python`]
      : []
  })
}

function realInput(): { pinned: string[]; playground: Example[]; iDo: Example[] } {
  const pinned = pinnedModules(fs.readFileSync(path.join(ROOT, 'requirements-content.txt'), 'utf-8'))
  const sectionView = fs.readFileSync(path.join(ROOT, 'src/components/course/SectionView.tsx'), 'utf-8')
  const dir = path.join(ROOT, 'src/lib/course/sections')
  const iDo = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.ts'))
    .sort()
    .flatMap((f) => iDoExamples(f, fs.readFileSync(path.join(dir, f), 'utf-8')))
  return { pinned, playground: playgroundExamples(sectionView), iDo }
}

describe('SIM-11 environments on the real tree', () => {
  it('every playground example declares the environment its imports require', () => {
    const { pinned, playground } = realInput()
    assert.deepEqual(playgroundFailures(playground, pinned), [])
  })

  it('the playground uses both environments, so the rule is exercised on both sides', () => {
    const { playground } = realInput()
    assert.ok(playground.some((e) => e.environment === 'local-python'), 'no local-python example')
    assert.ok(playground.some((e) => e.environment === 'browser-pyodide'), 'no browser-pyodide example')
  })

  it('every I Do demo that imports a pinned package is declared local-python', () => {
    const { pinned, iDo } = realInput()
    assert.ok(iDo.length > 0, 'no I Do demos were read: the check would pass on nothing')
    assert.deepEqual(iDoFailures(iDo, pinned), [])
  })

  it('the learner notice does not claim the browser runs the example', () => {
    assert.ok(LOCAL_PYTHON_NOTE.title.length > 0)
    assert.ok(!/No necesitas instalar nada/.test(LOCAL_PYTHON_NOTE.body), LOCAL_PYTHON_NOTE.body)
  })

  it('SectionView reads the declared environment and shows the notice for a local-only example', () => {
    const source = fs.readFileSync(path.join(ROOT, 'src/components/course/SectionView.tsx'), 'utf-8')
    assert.ok(source.includes('playgroundMode(demo.environment)'), 'the environment is not read')
    assert.ok(source.includes('LOCAL_PYTHON_NOTE.body'), 'the local notice is not shown')
  })
})

describe('SIM-11 rules on fixture examples', () => {
  const pinned = ['numpy', 'sklearn']

  it('a playground example that imports a pinned package but is declared browser-pyodide is named', () => {
    const ex = [{ name: 'demo-x', code: 'import numpy as np\n', environment: 'browser-pyodide' }]
    assert.deepEqual(playgroundFailures(ex, pinned), [
      'demo-x imports numpy, which the course pins: its environment must be local-python',
    ])
  })

  it('a playground example declared local-python with no pinned import is named', () => {
    const ex = [{ name: 'demo-y', code: 'import json\n', environment: 'local-python' }]
    assert.deepEqual(playgroundFailures(ex, pinned), [
      'demo-y imports no pinned package: its environment must be browser-pyodide',
    ])
  })

  it('an environment the playground does not run is named, not guessed at', () => {
    const ex = [{ name: 'demo-z', code: 'import json\n', environment: 'local' }]
    assert.deepEqual(playgroundFailures(ex, pinned), [
      "demo-z declares environment 'local': not browser-pyodide or local-python",
    ])
  })

  it('an I Do demo with a pinned import must be local-python, whatever else it declares', () => {
    const ex = [
      { name: 'S19-T1-A-DEMO', code: 'from scipy import stats\n', environment: 'browser-pyodide' },
      { name: 'S20-T1-A-DEMO', code: 'from scipy import stats\n', environment: 'local/cloud aprobado' },
      { name: 'S23-T1-A-DEMO', code: 'from scipy import stats\n', environment: 'local-python' },
    ]
    assert.deepEqual(iDoFailures(ex, ['scipy']), [
      'S19-T1-A-DEMO imports scipy, which the course pins: its environment must be local-python',
      'S20-T1-A-DEMO imports scipy, which the course pins: its environment must be local-python',
    ])
  })

  it('an I Do demo with no pinned import is not constrained', () => {
    const ex = [{ name: 'S02-T1-A-DEMO', code: 'import json\n', environment: 'browser-pyodide' }]
    assert.deepEqual(iDoFailures(ex, pinned), [])
  })

  it('the requirements pins map to the modules a snippet imports', () => {
    const requirements = 'numpy==2.2.6\n# comment\nscikit-learn==1.6.1\nPillow==12.3.0\npython-docx==1.2.0\npymupdf==1.28.2\n'
    assert.deepEqual(pinnedModules(requirements), ['numpy', 'sklearn', 'PIL', 'docx', 'pymupdf', 'fitz'])
  })

  it('a package imported under two names counts under both: pymupdf and its alias fitz', () => {
    // Recreation: the course pins pymupdf==1.28.2, which is imported as `pymupdf`. Mapping the
    // package only to its old alias let an S21-style block with `import pymupdf` pass as browser-pyodide.
    const pins = pinnedModules('pymupdf==1.28.2\n')
    assert.equal(pinnedImport('import pymupdf\n', pins), 'pymupdf')
    assert.equal(pinnedImport('import fitz\n', pins), 'fitz')
    assert.deepEqual(
      playgroundFailures([{ name: 'demo-pdf', code: 'import pymupdf\n', environment: 'browser-pyodide' }], pins),
      ['demo-pdf imports pymupdf, which the course pins: its environment must be local-python']
    )
  })

  it('the imports a snippet makes are its top-level modules, one per line', () => {
    assert.deepEqual(importedModules('from sklearn.linear_model import X\nimport numpy as np, json\n  import os.path\n'), [
      'sklearn',
      'numpy',
      'json',
      'os',
    ])
  })

  it('a snippet reports the pinned package it imports, and none when it imports only standard modules', () => {
    assert.equal(pinnedImport('import numpy as np', pinned), 'numpy')
    assert.equal(pinnedImport('from sklearn.cluster import KMeans', pinned), 'sklearn')
    assert.equal(pinnedImport('import json', pinned), undefined)
  })

  it('the mode fails closed: only browser-pyodide runs in the browser', () => {
    assert.equal(playgroundMode('browser-pyodide'), 'run-in-browser')
    assert.equal(playgroundMode('local-python'), 'local-only')
    assert.equal(playgroundMode('anything-else' as 'local-python'), 'local-only')
  })
})
