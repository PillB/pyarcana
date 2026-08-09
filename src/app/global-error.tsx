'use client'

import { useEffect } from 'react'
import { isChunkLoadError } from '@/lib/chunk-error-detector'

/**
 * Root-level error boundary for the Next.js App Router.
 *
 * Catches errors thrown in the root layout/template AND any uncaught
 * route-segment error (PyArcana has no error.tsx files, so all uncaught
 * route errors propagate here).
 *
 * For ChunkLoadError specifically: auto-reloads the page ONCE via a
 * sessionStorage guard. The reload fetches fresh HTML (whose cache has
 * either expired or will be revalidated), which references current chunk
 * hashes, resolving the version-skew. If the reload still fails (CDN is
 * still serving stale HTML), falls through to a user-facing "Recargar
 * página" button.
 *
 * NOTE: global-error.tsx replaces the entire document including <html>/<body>.
 * It does NOT inherit layout.tsx's fonts, CSP, or Providers. We re-add a
 * minimal <html lang="es-PE"> + <body> with Tailwind classes inline.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const chunkError = isChunkLoadError(error)

  useEffect(() => {
    if (!chunkError || typeof window === 'undefined') return
    const KEY = 'pyarcana-chunk-load-retry'
    let alreadyRetried = false
    try {
      alreadyRetried = window.sessionStorage.getItem(KEY) === '1'
    } catch {
      // sessionStorage may be unavailable in private mode — proceed without guard
    }
    if (!alreadyRetried) {
      try {
        window.sessionStorage.setItem(KEY, '1')
      } catch {
        // ignore
      }
      // Hard reload to bypass bfcache and force a fresh HTML fetch.
      window.location.reload()
      return
    }
    // Already retried once — clear the flag so the next session can try again.
    try {
      window.sessionStorage.removeItem(KEY)
    } catch {
      // ignore
    }
  }, [chunkError])

  // Compute the home URL respecting the /pyarcana basePath.
  const homeHref =
    typeof window !== 'undefined'
      ? (() => {
          const path = window.location.pathname
          const segments = path.split('/').filter(Boolean)
          const base = segments[0] === 'pyarcana' ? '/pyarcana/' : '/'
          return window.location.origin + base
        })()
      : '/'

  return (
    <html lang="es-PE">
      <body className="antialiased min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
        <main className="mx-auto max-w-md text-center space-y-4">
          <div className="mb-2 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/40 bg-amber-500/5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7 text-amber-600"
                aria-hidden="true"
              >
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
          </div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {chunkError ? 'ChunkLoadError' : 'Error inesperado'}
          </p>
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            {chunkError ? 'La página se actualizó' : 'Algo salió mal'}
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {chunkError
              ? 'Hay una nueva versión del curso. Recarga la página para obtener los archivos actualizados. Si el problema persiste, espera 1 minuto e inténtalo de nuevo.'
              : 'Ocurrió un error inesperado. Puedes intentar de nuevo o volver al inicio del curso.'}
          </p>

          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-4 max-h-40 overflow-auto rounded border border-border bg-accent/10 p-3 text-left text-xs text-muted-foreground">
              {error.message}
              {error.digest ? `\nDigest: ${error.digest}` : ''}
            </pre>
          )}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => {
                if (chunkError) {
                  // Force a hard reload (bypass bfcache).
                  window.location.reload()
                } else {
                  reset()
                }
              }}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {chunkError ? 'Recargar página' : 'Reintentar'}
            </button>
            <a
              href={homeHref}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Volver al inicio
            </a>
          </div>
        </main>
      </body>
    </html>
  )
}
