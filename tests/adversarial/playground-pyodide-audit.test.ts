/**
 * The headless Pyodide check of the playground demos (scripts/playground_pyodide_audit.mts).
 *
 * The CPython audit cannot see what a learner's browser does: Pyodide 0.26.2 has numpy 1.26.4 and
 * pandas 2.2.0, leaves out sqlite3, lzma and ssl, and needs the `hashlib` package for pbkdf2_hmac.
 * This gate runs the demos on the real Pyodide. Each test below names the defect it guards; the
 * commit that adds it records the mutation that turns it red.
 *
 * Needs the `pyodide` devDependency (node_modules/pyodide), or PYARCANA_PYODIDE_DIR. Some tests
 * download a Pyodide package from cdn.jsdelivr.net (sqlite3, lzma and ssl are small); the missing-
 * package test asks the CDN for a file it does not have, which fails with a 404 or with no network.
 * Either way Pyodide reports the download as failed.
 *
 * STAND-IN, test only: `blockedRuntime` below answers loadPackage the way Pyodide 0.26.2 answers a
 * failed download (errorCallback, then a resolve with no packages), so the exit-3 branch is reached
 * without a network. It runs no Python. The test "a package that will not download stops the gate"
 * reaches the same branch on a real Pyodide with no stand-in; the stand-in is an owner question.
 */
import test, { before, describe } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  PackageLoadBlocked,
  PyodideRefused,
  auditDemo,
  loadCore,
  locatePyodide,
  main,
  outputMatches,
  ownershipProblems,
  runAudit,
  startRuntime,
  type MainDeps,
  type PyodideLike,
} from '../../scripts/playground_pyodide_audit.mts'
import { PYODIDE_UNVENDORED_STDLIB } from '@/lib/pyodide'

type Demo = { title: string; code: string; expectedOutput?: string }
const demo = (code: string, expectedOutput?: string): Demo => ({ title: 'synthetic', code, expectedOutput })

/** The pandas 2.2.0 warning, as pandas passes it to warnings.warn() when pyarrow is not installed. */
const PANDAS_WARNING = 'Pyarrow will become a required dependency of pandas in the next major release'
const WARN = (message: string) => `import warnings\nwarnings.warn(${JSON.stringify(message)}, DeprecationWarning)\nprint("hecho")`

let bare: PyodideLike // Pyodide core, no prelude: what loads before CodePlayground's prelude runs
let ready: PyodideLike // core + PLAYGROUND_PRELUDE: what a learner's first run uses
let missing: PyodideLike // core, whose sqlite3 package cannot be downloaded (see loadWithMissingPackage)

/**
 * A real Pyodide 0.26.2 whose sqlite3 entry names a file that is not published, so the download
 * fails the way a dead CDN does. The failure is Pyodide's own: nothing here answers for it. The lock
 * file is a temporary copy with that one entry changed; the pinned install is not touched.
 */
async function loadWithMissingPackage(): Promise<PyodideLike> {
  const dir = locatePyodide(process.env)
  const lock = JSON.parse(readFileSync(join(dir, 'pyodide-lock.json'), 'utf8'))
  lock.packages.sqlite3.file_name = 'sqlite3-not-published-0.0.0.zip'
  const folder = mkdtempSync(join(tmpdir(), 'pyarcana-lock-'))
  try {
    const lockFileURL = join(folder, 'pyodide-lock.json')
    writeFileSync(lockFileURL, JSON.stringify(lock))
    const { loadPyodide } = await import(pathToFileURL(join(dir, 'pyodide.mjs')).href)
    return await loadPyodide({ indexURL: dir, lockFileURL })
  } finally {
    rmSync(folder, { recursive: true, force: true })
  }
}

before(async () => {
  ;[bare, ready, missing] = await Promise.all([loadCore(), startRuntime(), loadWithMissingPackage()])
})

/**
 * STAND-IN, test only: a runtime whose downloads all fail, answered the way Pyodide 0.26.2 answers a
 * failed download (pyodide.asm.js, functions Ge and downloadAndInstall): the failure goes to
 * errorCallback and loadPackage resolves with the packages it loaded, here none. It runs no Python.
 */
const blockedRuntime: PyodideLike = {
  runPythonAsync: async () => assert.fail('no Python should run when the package would not load'),
  loadPackage: async (names, options) => {
    options?.messageCallback?.(`Failed to load ${names.join(', ')}`)
    for (const name of names) {
      options?.errorCallback?.(`The following error occurred while loading ${name}:`)
      options?.errorCallback?.(`Failed to load '${name}': request failed.`)
    }
    return []
  },
  setStdout: () => {},
  setStderr: () => {},
  globals: { get: () => assert.fail('no globals should be made when the package would not load') },
}

describe('one demo, run the way CodePlayground runs it', () => {
  test('a wrong expectedOutput is reported', async () => {
    // Defect: a demo whose expectedOutput no longer matches what Pyodide prints passes the gate.
    const verdict = await auditDemo(ready, 'zz', demo('print("hola")', 'adios'))
    assert.equal(verdict?.status, 'fail')
    assert.equal(verdict?.reason, 'output_mismatch')
    assert.match(verdict?.detail ?? '', /adios/)
  })

  test('output and expectedOutput are compared trimmed, as the playground compares them', async () => {
    // Defect (both sides): a blank line the demo prints, or a newline in expectedOutput, fails a demo
    // the playground marks passed. CodePlayground trims both.
    assert.equal((await auditDemo(ready, 'zz', demo('print("hola")\nprint()', 'hola')))?.status, 'pass')
    assert.equal((await auditDemo(ready, 'zz', demo('print("hola")', '\nhola\n')))?.status, 'pass')
    assert.equal(outputMatches(['', 'hola', ''], 'hola'), true)
    assert.equal(outputMatches(['hola'], ' hola '), true)
    assert.equal(outputMatches(['hola', 'adios'], 'hola'), false)
  })

  test('a demo with no expectedOutput pins nothing and is not run', async () => {
    // Defect: a demo without a promise is run and judged against nothing.
    assert.equal(await auditDemo(blockedRuntime, 'zz', demo('raise SystemExit(1)')), null)
  })

  test('a demo that raises is reported even when its output matches', async () => {
    // Defect: only stdout is compared, so a demo that prints the right text and then fails passes.
    // The playground marks that demo failed.
    const verdict = await auditDemo(ready, 'zz', demo('print("hola")\nraise ValueError("falla")', 'hola'))
    assert.equal(verdict?.status, 'fail')
    assert.equal(verdict?.reason, 'exception')
    assert.match(verdict?.detail ?? '', /ValueError: falla/)
  })

  test('each demo runs in fresh globals, which carry the name __main__', async () => {
    // Defect: demos share one namespace, so a demo passes only because an earlier one defined a name,
    // and a warning raised in it is shown (or hidden) differently from the playground's `__main__`.
    const first = await auditDemo(ready, 'zz-antes', demo('visto_antes = "si"', ''))
    assert.equal(first?.status, 'pass', 'the first demo must run, or the next one proves nothing')
    const clean = await auditDemo(ready, 'zz', demo('print("visto_antes" in globals(), __name__)', 'False __main__'))
    assert.equal(clean?.status, 'pass', JSON.stringify(clean))
  })
})

describe('packages come from the map in src/lib/pyodide.ts', () => {
  for (const [module, code, expected] of [
    ['sqlite3', 'import sqlite3\nprint(sqlite3.sqlite_version_info[0])', '3'],
    ['lzma', 'import lzma\nprint(lzma.decompress(lzma.compress(b"hola")))', "b'hola'"],
    ['ssl', 'import ssl\nprint(ssl.OPENSSL_VERSION_INFO[0])', '1'],
  ] as const) {
    test(`a demo that imports ${module} runs, because the gate loads it as the playground does`, async () => {
      // Defect: the gate runs the code without loading the package the way CodePlayground does, so the
      // import fails here (and a learner's browser fails the same way if the map lacks the module).
      const verdict = await auditDemo(ready, 'zz', demo(code, expected))
      assert.equal(verdict?.status, 'pass', JSON.stringify(verdict))
    })
  }

  test('every name in PYODIDE_UNVENDORED_STDLIB fails to import on a bare Pyodide', async () => {
    // Defect: a module is listed as unvendored that Pyodide imports without any package, so the
    // import-scope guard refuses a demo that works. Measured, not read from the lock file.
    for (const name of Object.keys(PYODIDE_UNVENDORED_STDLIB)) {
      const outcome = await bare.runPythonAsync(
        `import importlib\ntry:\n    importlib.import_module(${JSON.stringify(name)})\n    r = "imported"\nexcept ModuleNotFoundError:\n    r = "missing"\nr`,
      )
      assert.equal(outcome, 'missing', `${name} imports on a bare Pyodide, so it is not unvendored`)
    }
  })

  test('hashlib and decimal import on a bare Pyodide, so they are not listed as unvendored', async () => {
    // Defect (the other side): the list is copied from package names, and the lock file's `hashlib` and
    // `pydecimal` packages hold only the private _hashlib and _pydecimal.
    for (const name of ['hashlib', 'decimal']) {
      assert.equal(await bare.runPythonAsync(`import ${name}\n"ok"`), 'ok', name)
      assert.ok(!(name in PYODIDE_UNVENDORED_STDLIB), `${name} imports without a package`)
    }
  })
})

describe('the prelude does what it is for, on the real Pyodide', () => {
  test('without the prelude the pandas warning reaches stderr, with it stderr stays empty', async () => {
    // Defect: the prelude does not silence pandas 2.2.0's pyarrow warning in Pyodide (it was only ever
    // checked under CPython). Liveness first: the same code on a runtime that has not run the prelude
    // must show the warning, or silence proves nothing.
    const noisy = await auditDemo(bare, 'zz', demo(WARN(PANDAS_WARNING), 'hecho'))
    assert.match((noisy?.stderr ?? []).join('\n'), /Pyarrow will become a required dependency/, 'the warning must fire first')
    const after = await auditDemo(ready, 'zz', demo(WARN(PANDAS_WARNING), 'hecho'))
    assert.deepEqual(after?.stderr, [])
  })

  test('the prelude does not hide other deprecation warnings', async () => {
    // Defect: a blanket filter hides every DeprecationWarning, including the learner's own.
    const verdict = await auditDemo(ready, 'zz', demo(WARN('otro aviso'), 'hecho'))
    assert.match((verdict?.stderr ?? []).join('\n'), /DeprecationWarning: otro aviso/)
  })
})

describe('the owed set is an exact ratchet', () => {
  test('a new mismatch is a problem, and so is an owed demo that now matches', () => {
    // Defect: the owed list grows silently, or never shrinks.
    assert.equal(ownershipProblems(new Set(['nuevo']), new Set()).length, 1)
    assert.equal(ownershipProblems(new Set(), new Set(['viejo'])).length, 1)
    assert.deepEqual(ownershipProblems(new Set(['a']), new Set(['a'])), [])
  })

  test('runAudit exits 1 for a wrong demo that is not owed, and 0 for the same demo when owed', async () => {
    // Defect: the exit code ignores the verdicts, or ignores the owed set.
    const wrong = { zz: demo('print("hola")', 'adios') }
    const fresh = await runAudit(ready, wrong, new Set())
    assert.equal(fresh.code, 1)
    assert.deepEqual(fresh.report.failing, ['zz'])
    const owed = await runAudit(ready, wrong, new Set(['zz']))
    assert.equal(owed.code, 0)
    assert.equal(owed.report.ok, true)
  })

  test('runAudit exits 1 for an owed demo that now matches', async () => {
    // Defect: a fixed demo stays on the owed list for ever.
    const stale = await runAudit(ready, { zz: demo('print("hola")', 'hola') }, new Set(['zz']))
    assert.equal(stale.code, 1)
    assert.match(stale.problems.join('\n'), /remove them from PYODIDE_OUTPUT_OWED/)
  })
})

describe('main() decides the exit code the npm script returns', () => {
  const capture = (overrides: Partial<MainDeps>) => {
    const out: string[] = []
    const err: string[] = []
    const deps: MainDeps = {
      start: async () => ready,
      demos: { zz: demo('print("hola")', 'hola') },
      owed: new Set(),
      out: (t) => out.push(t),
      err: (t) => err.push(t),
      ...overrides,
    }
    return { deps, out, err }
  }

  test('exits 0 when every demo matches', async () => {
    const { deps, out } = capture({})
    assert.equal(await main(deps), 0)
    assert.match(out.join('\n'), /"ok": true/)
  })

  test('exits 1 and names the demo when one mismatches and is not owed', async () => {
    const { deps, err } = capture({ demos: { zz: demo('print("hola")', 'adios') } })
    assert.equal(await main(deps), 1)
    assert.match(err.join('\n'), /zz/)
  })

  test('exits 2 and prints no verdict when the pyodide package is refused', async () => {
    // Defect: a run that could not load the right Pyodide reports a verdict anyway.
    const { deps, out, err } = capture({
      start: async () => {
        throw new PyodideRefused('wrong version')
      },
    })
    assert.equal(await main(deps), 2)
    assert.deepEqual(out, [])
    assert.match(err.join('\n'), /refusing a verdict: wrong version/)
  })

  test('exits 3 and prints no verdict when a package would not download', async () => {
    // Defect: a blocked download is reported as a failed demo, or as a pass. It is a stop.
    const { deps, out, err } = capture({
      start: async () => blockedRuntime,
      demos: { zz: demo('import numpy\nprint("hola")', 'hola') },
    })
    assert.equal(await main(deps), 3)
    assert.deepEqual(out, [])
    assert.match(err.join('\n'), /BLOCKED.*numpy.*demo zz/s)
  })

  test('a package that will not download stops the gate with exit 3, on the real Pyodide', async () => {
    // Defect: Pyodide 0.26.2 reports a failed download through errorCallback and then resolves, so a
    // gate that only catches a rejection reads the demo as failed (exit 1) instead of blocked (exit 3).
    // No stand-in: this runtime is Pyodide's own, with an unpublished sqlite3 entry.
    const { deps, out, err } = capture({
      start: async () => missing,
      demos: { zz: demo('import sqlite3\nprint("hola")', 'hola') },
    })
    assert.equal(await main(deps), 3)
    assert.deepEqual(out, [])
    assert.match(err.join('\n'), /BLOCKED.*sqlite3.*demo zz/s)
    assert.match(err.join('\n'), /The following error occurred while loading sqlite3/)
  })

  test('a package that will not download throws, naming the demo and the packages', async () => {
    await assert.rejects(
      auditDemo(blockedRuntime, 'zz', demo('import pandas\nprint(1)', '1')),
      (error: unknown) => error instanceof PackageLoadBlocked && error.demoId === 'zz' && error.packages.includes('pandas'),
    )
  })
})

describe('the gate refuses a Pyodide that is not the one the playground loads', () => {
  const withManifest = (version: string | null, run: (dir: string) => void) => {
    const dir = mkdtempSync(join(tmpdir(), 'pyarcana-pyodide-'))
    try {
      if (version !== null) {
        writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'pyodide', version }))
        writeFileSync(join(dir, 'pyodide.mjs'), '')
      }
      run(dir)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  }

  test('a different version is refused, naming both versions', () => {
    // Defect: the gate measures another Pyodide (numpy, pandas and the stdlib split differ between releases).
    withManifest('0.25.0', (dir) => {
      assert.throws(() => locatePyodide({ PYARCANA_PYODIDE_DIR: dir }), (e: unknown) => e instanceof PyodideRefused && /0\.25\.0/.test(e.message) && /0\.26\.2/.test(e.message))
    })
  })

  test('a missing install is refused, with the way to fix it', () => {
    // Defect: a missing package reads as a gate that passed.
    withManifest(null, (dir) => {
      assert.throws(() => locatePyodide({ PYARCANA_PYODIDE_DIR: dir }), (e: unknown) => e instanceof PyodideRefused && /no pyodide package/.test(e.message))
    })
  })

  test('the pinned install is accepted', () => {
    assert.ok(locatePyodide(process.env).length > 0)
  })
})
