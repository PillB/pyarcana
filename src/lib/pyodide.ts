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
