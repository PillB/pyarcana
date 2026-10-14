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
 * `sqlite3`, `lzma` and `ssl` are standard-library modules, not third-party packages: Pyodide
 * 0.26.2 ships them separately (see PYODIDE_UNVENDORED_STDLIB). Loading one costs a download, so
 * the three listed are the ones a lesson can reasonably need. `test`, `pydoc_data` and the private
 * `_*` modules are left out on purpose, so a demo that imports one is refused.
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
}

/**
 * Standard-library modules that Pyodide 0.26.2 does not include in its base distribution: its
 * pyodide-lock.json lists them with package_type "cpython_module", and `import <name>` raises
 * ModuleNotFoundError until `pyodide.loadPackage(<package>)` has run. Import name -> package name.
 * Measured on 0.26.2: `import hashlib` and `import decimal` work without loading anything (the
 * lock file's `hashlib` and `pydecimal` packages provide only the private `_hashlib` and
 * `_pydecimal`), so they are not listed. tests/adversarial/pyodide-packages.test.ts holds this
 * equal to the lock file of the pinned `pyodide` devDependency.
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
 * The Pyodide packages a piece of learner code needs, by the imports REQUIRED_PACKAGES knows. An
 * import matches at the start of a line: `import <name>` or `from <name> import ...`, where <name>
 * is followed by whitespace, a comma, the end of the line, or a dot (`import matplotlib.pyplot`,
 * `from sklearn.linear_model import ...`). A module that is not the first name on its `import`
 * line (`import json, sqlite3`) is not seen.
 */
export function detectRequiredPackages(src: string): string[] {
  const needed = new Set<string>()
  for (const [importName, packageName] of Object.entries(REQUIRED_PACKAGES)) {
    const importRegex = new RegExp(
      `^\\s*(?:from\\s+${importName}(?:\\.|\\s|,|$)|import\\s+${importName}(?:\\.|\\s|,|$))`,
      'm',
    )
    if (importRegex.test(src)) {
      needed.add(packageName)
    }
  }
  return Array.from(needed)
}
