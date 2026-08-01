/**
 * Canonical ChunkLoadError detector.
 *
 * Used by global-error.tsx and public/chunk-guard.js (the latter inlines the
 * same patterns because vanilla JS can't import TypeScript).
 *
 * A ChunkLoadError occurs when webpack's `__webpack_require__.e(chunkId)`
 * fails to fetch a JS/CSS chunk. On a static export (GitHub Pages) this is
 * almost always version skew: the user's cached HTML references chunks from
 * a previous deploy, but a new deploy renamed those chunks (content hashing),
 * so the old URL 404s.
 *
 * Matches across webpack 5, Turbopack, and Vite/React.lazy error shapes.
 */
export const CHUNK_ERROR_PATTERNS: readonly string[] = [
  'ChunkLoadError',
  'Loading chunk',
  'Loading CSS chunk',
  'Failed to fetch dynamically imported module',
  'module factory is not available',
] as const

export function isChunkLoadError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const name = String((error as { name?: unknown }).name ?? '')
  const message = String((error as { message?: unknown }).message ?? '')
  if (name === 'ChunkLoadError') return true
  return CHUNK_ERROR_PATTERNS.some((p) => message.includes(p))
}
