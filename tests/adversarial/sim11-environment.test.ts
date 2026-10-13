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
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { InteractivePlaygroundDemo } from '../../src/components/course/SectionView.tsx'
import {
  LOCAL_PYTHON_NOTE,
  LOCAL_RUN_COMMAND,
  importedModules,
  pinnedImport,
  pinnedModules,
  playgroundMode,
} from '../../src/lib/playground-environment.ts'
import { readBindings } from '../../scripts/course_bindings.mjs'

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

})

/** The block a learner sees under a lesson's "Pruébalo tú mismo", as markup. */
function playgroundMarkup(slug: string): string {
  return renderToStaticMarkup(createElement(InteractivePlaygroundDemo, { sectionId: slug, sectionTitle: slug }))
}
const runButton = (slug: string): string => `data-testid="demo-run-${slug}-run"`
/** What a reader sees: the tags gone and the entities React writes turned back into characters. */
const visibleText = (html: string): string =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
const htmlEscaped = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;')

describe('SIM-11 the rendered block follows the declared environment', () => {
  const { pinned, playground } = realInput()

  it('an example declared local-python renders no Run button and shows the notice', () => {
    const local = playground.filter((e) => e.environment === 'local-python')
    assert.ok(local.length > 0, 'no local-python example: the check would pass on nothing')
    for (const ex of local) {
      const html = playgroundMarkup(ex.name)
      assert.ok(html.includes(`data-testid="demo-playground-${ex.name}"`), `${ex.name}: the block did not render`)
      assert.ok(!html.includes(runButton(ex.name)), `${ex.name} is local-python but renders a Run button`)
      assert.ok(!html.includes(`data-testid="demo-run-${ex.name}"`), `${ex.name} is local-python but renders the playground`)
      assert.ok(html.includes(htmlEscaped(LOCAL_PYTHON_NOTE.title)), `${ex.name} shows no local-only notice`)
      assert.ok(html.includes(htmlEscaped(LOCAL_PYTHON_NOTE.body)), `${ex.name} shows no local-only notice body`)
    }
  })

  it('a local-only example shows the command that launches a saved script, and S01 taught that command', () => {
    const local = playground.filter((e) => e.environment === 'local-python')
    for (const ex of local) {
      assert.ok(visibleText(playgroundMarkup(ex.name)).includes(LOCAL_RUN_COMMAND), `${ex.name} shows no run command`)
    }
    const setup = readBindings(ROOT).find((b) => b.id === 'setup')
    assert.ok(setup, 'no bound section has the slug setup')
    const s01 = fs.readFileSync(path.join(ROOT, 'src/lib/course/sections', `${setup.stem}.ts`), 'utf-8')
    assert.ok(s01.includes(`\`${LOCAL_RUN_COMMAND}\``), `S01 never shows the learner ${LOCAL_RUN_COMMAND}, so the command is new here`)
  })

  it('no local-only example comments that the library loads by itself or that the browser runs it', () => {
    const claims = /se carga|carga autom|pyodide|navegador|browser/i
    const local = playground.filter((e) => e.environment === 'local-python')
    for (const ex of local) {
      const comments = ex.code.split('\n').filter((line) => line.trim().startsWith('#'))
      assert.ok(comments.length > 0, `${ex.name} has no comment line: the check would pass on nothing`)
      for (const line of comments) assert.ok(!claims.test(line), `${ex.name} comments: ${line}`)
    }
  })

  it('an example that imports a pinned package renders no Run button, whatever it declares', () => {
    const pinnedExamples = playground.filter((e) => pinnedImport(e.code, pinned) !== undefined)
    assert.ok(pinnedExamples.length > 0, 'no playground example imports a pinned package')
    for (const ex of pinnedExamples) {
      assert.ok(!playgroundMarkup(ex.name).includes(runButton(ex.name)), `${ex.name} imports a pinned package but renders a Run button`)
    }
  })

  it('an example declared browser-pyodide renders the Run button and no local-only notice', () => {
    const browser = playground.filter((e) => e.environment === 'browser-pyodide')
    assert.ok(browser.length > 0, 'no browser-pyodide example: the check would pass on nothing')
    for (const ex of browser) {
      const html = playgroundMarkup(ex.name)
      assert.ok(html.includes(runButton(ex.name)), `${ex.name} is browser-pyodide but renders no Run button`)
      assert.ok(!html.includes(htmlEscaped(LOCAL_PYTHON_NOTE.title)), `${ex.name} shows the local-only notice`)
    }
  })

  it('a section with no playground example renders nothing', () => {
    assert.equal(playgroundMarkup('no-such-section'), '')
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
