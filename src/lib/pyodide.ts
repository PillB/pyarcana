/**
 * Where the in-browser Python runtime comes from. One source for the loader (CodePlayground) and the
 * Content-Security-Policy (csp.ts), which allows exactly this folder of jsDelivr and nothing else
 * on that host (D4 audit P4b): a bare cdn.jsdelivr.net would let any npm or GitHub file run here.
 */
export const PYODIDE_VERSION = '0.26.2'
export const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`
