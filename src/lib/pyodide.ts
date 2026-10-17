/**
 * Where the in-browser Python runtime comes from. One source for the loader (CodePlayground) and the
 * Content-Security-Policy (csp.ts), which allows exactly this folder of jsDelivr and nothing else
 * on that host (D4 audit P4b): a bare cdn.jsdelivr.net would let any npm or GitHub file run here.
 */
export const PYODIDE_VERSION = '0.26.2'
export const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`

/**
 * Python the playground runs once, after Pyodide loads and before the learner's code. Pyodide
 * 0.26.2 ships pandas 2.2.0 without pyarrow, so `import pandas` issues a DeprecationWarning that
 * CodePlayground would show in red. The filter matches that one warning by the start of its
 * message and nothing else (see tests/adversarial/test_playground_prelude.py).
 */
export const PLAYGROUND_PRELUDE = `import warnings
warnings.filterwarnings(
    "ignore",
    message=r"\\s*Pyarrow will become a required dependency of pandas",
    category=DeprecationWarning,
)
del warnings
`

/**
 * Python import name -> the Pyodide package that provides it. CodePlayground loads these before the
 * learner's code runs, because Pyodide imports none of them on its own and the import fails with
 * ModuleNotFoundError. A demo may import only what this map loads (scripts/playground_import_scope.py
 * and scripts/playground_pyodide_audit.mts both read it).
 *
 * `sqlite3`, `lzma`, `ssl` and `hashlib` are standard-library modules, not third-party packages:
 * Pyodide 0.26.2 ships them separately (see PYODIDE_UNVENDORED_STDLIB). Loading one costs a
 * download, so the four listed are the ones a lesson can reasonably need. `import hashlib` itself
 * works without the package, but `hashlib.pbkdf2_hmac` and `hashlib.scrypt` raise AttributeError
 * until it is loaded (S14's demo calls pbkdf2_hmac). `test`, `pydoc_data` and the private `_*`
 * modules are left out on purpose, so a demo that imports one is refused.
 */
export const REQUIRED_PACKAGES: Record<string, string> = {
  numpy: 'numpy',
  pandas: 'pandas',
  matplotlib: 'matplotlib',
  sklearn: 'scikit-learn',
  scipy: 'scipy',
  sympy: 'sympy',
  networkx: 'networkx',
  PIL: 'Pillow',
  pillow: 'Pillow',
  yaml: 'pyyaml',
  requests: 'requests',
  beautifulsoup4: 'beautifulsoup4',
  bs4: 'beautifulsoup4',
  sqlite3: 'sqlite3',
  lzma: 'lzma',
  ssl: 'ssl',
  hashlib: 'hashlib',
}

/**
 * Standard-library modules that Pyodide 0.26.2 does not include in its base distribution: its
 * pyodide-lock.json lists them with package_type "cpython_module", and `import <name>` raises
 * ModuleNotFoundError until `pyodide.loadPackage(<package>)` has run. Import name -> package name.
 * Measured on 0.26.2: `import hashlib` and `import decimal` succeed without loading anything (the
 * lock file's `hashlib` and `pydecimal` packages provide only the private `_hashlib` and
 * `_pydecimal`), so they are not listed here, though REQUIRED_PACKAGES loads `hashlib` for the
 * functions that need `_hashlib`. tests/adversarial/pyodide-packages.test.ts holds this list
 * equal to the lock file of the pinned `pyodide` devDependency, and
 * tests/adversarial/playground-pyodide-audit.test.ts measures it on a bare Pyodide.
 */
export const PYODIDE_UNVENDORED_STDLIB: Record<string, string> = {
  _hashlib: 'hashlib',
  _lzma: 'lzma',
  lzma: 'lzma',
  _pydecimal: 'pydecimal',
  pydoc_data: 'pydoc-data',
  _sqlite3: 'sqlite3',
  sqlite3: 'sqlite3',
  _ssl: 'ssl',
  ssl: 'ssl',
  test: 'test',
}

/**
 * The top-level module of every import statement that starts a line: `import a.b as c, d` gives
 * `a` and `d`, `from e.f import g` gives `e`. Every name on an `import` line counts, not only the
 * first: `import csv, hashlib` imports hashlib, and a module imported before its package is loaded
 * stays broken for the rest of the page session (Python keeps it in sys.modules).
 */
function importedModules(src: string): string[] {
  const modules: string[] = []
  for (const [, list] of src.matchAll(/^[ \t]*import[ \t]+([^#\n]+)/gm)) {
    for (const item of list.split(',')) {
      const name = /^[A-Za-z_]\w*/.exec(item.trim())
      if (name) modules.push(name[0])
    }
  }
  for (const [, module] of src.matchAll(/^[ \t]*from[ \t]+([A-Za-z_]\w*)/gm)) modules.push(module)
  return modules
}

/** The Pyodide packages a piece of learner code needs, by the imports REQUIRED_PACKAGES knows. */
export function detectRequiredPackages(src: string): string[] {
  const needed = new Set<string>()
  for (const name of importedModules(src)) {
    // hasOwnProperty, not `in`: `import constructor` must not look up Object.prototype.constructor.
    if (Object.prototype.hasOwnProperty.call(REQUIRED_PACKAGES, name)) needed.add(REQUIRED_PACKAGES[name])
  }
  return Array.from(needed)
}
