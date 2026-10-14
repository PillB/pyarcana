/**
 * SIM-11: an example's declared environment is load-bearing, and the course's own pins decide it.
 *
 * The browser runs Pyodide, which ships other versions of the libraries that requirements-content.txt
 * pins. An example that uses a pinned package prints a version-dependent result, so it must be
 * declared `local-python`. Two checks follow from that rule:
 * - the playground (SectionView's "Pruébalo tú mismo" demos) is two-sided: a pinned package the code
 *   uses is local-python, and a local-python example is one that uses a pinned package; an import the
 *   code never refers to changes no output and decides nothing (owner decision O25: the S11 demo
 *   imports numpy and never calls it, so it keeps its Run button). The component reads the declared
 *   environment, so a local-python example is never run in the browser;
 * - the I Do demos (`demoId` steps in the section files) are one-sided and stricter: any pinned
 *   import must be declared local-python, used or not, because a starter that imports the library
 *   the learner is about to call (s21-fastapi's jinja2 lab) has not used it yet. So a future block
 *   (S19, S20, S23) cannot print a pinned output in the browser.
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
  pinnedImportUsed,
  pinnedModules,
  playgroundMode,
  scanImports,
  withoutComments,
} from '../../src/lib/playground-environment.ts'
import { readBindings } from '../../scripts/course_bindings.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const PLAYGROUND_ENVIRONMENTS = new Set(['browser-pyodide', 'local-python'])

export interface Example {
  readonly name: string
  readonly code: string
  readonly environment: string | undefined
  /** What the example prints, as the course shows it. Playground examples only. */
  readonly expectedOutput?: string
  readonly hint?: string
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
        if (entry) {
          out.push({
            name: nameOf(p) ?? '?',
            code: textOf(entry.get('code')) ?? '',
            environment: textOf(entry.get('environment')),
            expectedOutput: textOf(entry.get('expectedOutput')),
            hint: textOf(entry.get('hint')),
          })
        }
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

/** Two-sided: a pinned package the code uses is local-python, and local-python is only for a used pinned package. */
export function playgroundFailures(examples: readonly Example[], pinned: readonly string[]): string[] {
  return examples.flatMap((ex) => {
    const pkg = pinnedImportUsed(ex.code, pinned)
    if (ex.environment === undefined || !PLAYGROUND_ENVIRONMENTS.has(ex.environment)) {
      return [`${ex.name} declares environment '${ex.environment}': not browser-pyodide or local-python`]
    }
    if (pkg !== undefined && ex.environment !== 'local-python') {
      return [`${ex.name} uses ${pkg}, which the course pins: its environment must be local-python`]
    }
    if (pkg === undefined && ex.environment === 'local-python') {
      return [`${ex.name} uses no pinned package: its environment must be browser-pyodide`]
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

  it('a local-only example shows the output the course prints for it, so the learner can compare', () => {
    // The notice says the result may differ from the one printed in the course; the block must print it.
    const local = playground.filter((e) => e.environment === 'local-python')
    const withOutput = local.filter((e) => e.expectedOutput !== undefined)
    assert.ok(withOutput.length > 0, 'no local-python example declares an expected output: the check would pass on nothing')
    for (const ex of withOutput) {
      const text = visibleText(playgroundMarkup(ex.name))
      for (const line of ex.expectedOutput!.trim().split('\n').filter((l) => l.trim() !== '')) {
        assert.ok(text.includes(line.trim()), `${ex.name} does not show its expected output line: ${line}`)
      }
    }
  })

  it('a local-only example keeps its hint, under the "Ver pista" label the playground already uses', () => {
    const local = playground.filter((e) => e.environment === 'local-python' && e.hint !== undefined)
    assert.ok(local.length > 0, 'no local-python example has a hint: the check would pass on nothing')
    for (const ex of local) {
      const html = playgroundMarkup(ex.name)
      assert.ok(html.includes('Ver pista'), `${ex.name} shows no hint label`)
      assert.ok(visibleText(html).includes(ex.hint!), `${ex.name} does not show its hint: ${ex.hint}`)
    }
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

  it('an example that uses a pinned package renders no Run button, whatever it declares', () => {
    const pinnedExamples = playground.filter((e) => pinnedImportUsed(e.code, pinned) !== undefined)
    assert.ok(pinnedExamples.length > 0, 'no playground example uses a pinned package')
    for (const ex of pinnedExamples) {
      assert.ok(!playgroundMarkup(ex.name).includes(runButton(ex.name)), `${ex.name} uses a pinned package but renders a Run button`)
    }
  })

  it('an example that imports a pinned package and never uses it keeps its Run button (S11, O25)', () => {
    const dead = playground.filter((e) => pinnedImport(e.code, pinned) !== undefined && pinnedImportUsed(e.code, pinned) === undefined)
    assert.ok(dead.length > 0, 'no playground example has a dead pinned import: the check would pass on nothing')
    for (const ex of dead) {
      assert.equal(ex.environment, 'browser-pyodide', `${ex.name} imports a pinned package it never uses, so it cannot drift`)
      assert.ok(playgroundMarkup(ex.name).includes(runButton(ex.name)), `${ex.name} lost its Run button over an unused import`)
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

  it('a playground example that uses a pinned package but is declared browser-pyodide is named', () => {
    const ex = [{ name: 'demo-x', code: 'import numpy as np\nprint(np.zeros(3))\n', environment: 'browser-pyodide' }]
    assert.deepEqual(playgroundFailures(ex, pinned), [
      'demo-x uses numpy, which the course pins: its environment must be local-python',
    ])
  })

  it('a playground example declared local-python with no pinned import is named', () => {
    const ex = [{ name: 'demo-y', code: 'import json\n', environment: 'local-python' }]
    assert.deepEqual(playgroundFailures(ex, pinned), [
      'demo-y uses no pinned package: its environment must be browser-pyodide',
    ])
  })

  it('a pinned import the code never uses decides nothing: browser-pyodide passes, local-python is named (S11)', () => {
    // Recreation of the S11 demo: `import numpy as np`, then plain assert tests that never call np.
    const code = 'import numpy as np\n\ndef f(x):\n    return x\nassert f(1) == 1\nprint("ok")\n'
    assert.deepEqual(playgroundFailures([{ name: 'demo-s11', code, environment: 'browser-pyodide' }], pinned), [])
    assert.deepEqual(playgroundFailures([{ name: 'demo-s11', code, environment: 'local-python' }], pinned), [
      'demo-s11 uses no pinned package: its environment must be browser-pyodide',
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

  it('an I Do starter is held to the import, not the use: a starter that imports the library it will call is named', () => {
    // s21-fastapi's jinja2 lab imports Template and prints a fixed line; the learner's solution calls it.
    const ex = [{ name: 'S21-lab', code: 'from jinja2 import Template\nprint("fixed")\n', environment: 'browser-pyodide' }]
    assert.deepEqual(iDoFailures(ex, ['jinja2']), [
      'S21-lab imports jinja2, which the course pins: its environment must be local-python',
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
    const code = 'import pymupdf\ndoc = pymupdf.open("a.pdf")\n'
    assert.deepEqual(
      playgroundFailures([{ name: 'demo-pdf', code, environment: 'browser-pyodide' }], pins),
      ['demo-pdf uses pymupdf, which the course pins: its environment must be local-python']
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

  describe('a pinned import counts as used only when the code refers to a name it binds', () => {
    const used = (code: string): string | undefined => pinnedImportUsed(code, pinned)

    it('an alias that is called is a use; an alias nothing refers to is not', () => {
      assert.equal(used('import numpy as np\nx = np.zeros(3)\n'), 'numpy')
      assert.equal(used('import numpy as np\nx = 1\n'), undefined)
    })

    it('a plain import binds the module name, and a dotted one binds its first part', () => {
      assert.equal(used('import numpy\nnumpy.zeros(3)\n'), 'numpy')
      assert.equal(used('import sklearn.linear_model\nsklearn.linear_model.LogisticRegression()\n'), 'sklearn')
      assert.equal(used('import sklearn.linear_model\nx = 1\n'), undefined)
    })

    it('a from-import binds the names it lists, under their aliases', () => {
      assert.equal(used('from sklearn.cluster import KMeans as KM\nKM(3)\n'), 'sklearn')
      assert.equal(used('from sklearn.cluster import KMeans as KM\nKMeans = 1\n'), undefined)
      assert.equal(used('from sklearn.cluster import KMeans\nx = 1\n'), undefined)
    })

    it('a parenthesised import over several lines is read whole, and its names are found', () => {
      const code = 'from sklearn.metrics import (\n    accuracy_score,  # exactitud\n    f1_score,\n)\nprint(f1_score([0], [0]))\n'
      assert.equal(used(code), 'sklearn')
      assert.equal(used('from sklearn.metrics import (\n    accuracy_score,\n    f1_score,\n)\nx = 1\n'), undefined)
    })

    it('a backslash-continued import and a statement after a semicolon are read', () => {
      assert.equal(used('from numpy import zeros, \\\n    ones\nones(2)\n'), 'numpy')
      assert.equal(used('x = 1; import numpy as np\nnp.zeros(2)\n'), 'numpy')
      assert.equal(used('import numpy as np; y = 2\nprint(y)\n'), undefined)
    })

    it('a star import counts, because the names it binds are not in the text', () => {
      assert.equal(used('from numpy import *\nx = 1\n'), 'numpy')
    })

    it('a name used only inside a string counts: f"{np.mean(x)}" runs np', () => {
      assert.equal(used('import numpy as np\nx = [1]\nprint(f"media {np.mean(x)}")\n'), 'numpy')
    })

    it('a name that appears only in a comment does not count, and a # inside a string hides nothing', () => {
      assert.equal(used('import numpy as np\n# np.zeros(3) queda para el ejercicio\nx = 1\n'), undefined)
      assert.equal(used('import numpy as np\nprint("#1", np.zeros(2))\n'), 'numpy')
      assert.equal(used("import numpy as np\nlabel = '#'; v = np.ones(2)\n"), 'numpy')
    })

    it('one used import is enough when a module is imported twice', () => {
      assert.equal(used('import numpy as np\nimport numpy\nnumpy.zeros(1)\n'), 'numpy')
    })

    it('a package outside the pins is never reported, used or not', () => {
      assert.equal(used('import json\njson.dumps({})\n'), undefined)
    })
  })

  it('comments come out of the code and strings stay, including triple-quoted ones and escaped quotes', () => {
    assert.equal(withoutComments('a = 1  # nota\nb = 2\n'), 'a = 1  \nb = 2\n')
    assert.equal(withoutComments('s = "a # b"  # c\n'), 's = "a # b"  \n')
    assert.equal(withoutComments("s = '''x # y\nz'''  # c\n"), "s = '''x # y\nz'''  \n")
    assert.equal(withoutComments('s = "a\\" # b"  # c\n'), 's = "a\\" # b"  \n')
  })

  it('the scanner returns the imports and the code that is left once they are taken out', () => {
    const scanned = scanImports('import numpy as np\nx = np.zeros(2)\nfrom os import path as p\n')
    assert.deepEqual(scanned.bindings, [
      { module: 'numpy', names: ['np'] },
      { module: 'os', names: ['p'] },
    ])
    assert.equal(scanned.rest, '\nx = np.zeros(2)\n\n')
  })

  it('the mode fails closed: only browser-pyodide runs in the browser', () => {
    assert.equal(playgroundMode('browser-pyodide'), 'run-in-browser')
    assert.equal(playgroundMode('local-python'), 'local-only')
    assert.equal(playgroundMode('anything-else' as 'local-python'), 'local-only')
  })
})
