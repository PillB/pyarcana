/**
 * The base path of the static export. Unset keeps the GitHub Pages edition (/pyarcana); set but
 * empty (`NEXT_PUBLIC_BASE_PATH= bun run build:static`) builds for a site root such as the canonical
 * origin, the same way next.config.ts and src/lib/runtime-mode.ts read it. Anything else must be a
 * path Next accepts: leading slash, no trailing slash, plain segments.
 * @param {Record<string, string | undefined>} env Environment to read.
 * @returns {string} '' for the root, else '/segment[/segment...]'.
 */
export function resolveStaticBasePath(env) {
  const value = env.NEXT_PUBLIC_BASE_PATH
  if (value === undefined) return '/pyarcana'
  if (value === '') return ''
  const segments = value.split('/').slice(1)
  const valid = value.startsWith('/') && segments.every((s) => /^[A-Za-z0-9._-]+$/.test(s) && s !== '.' && s !== '..')
  if (!valid) {
    throw new Error(`NEXT_PUBLIC_BASE_PATH debe estar vacío o ser una ruta como /pyarcana (sin barra final); se recibió ${JSON.stringify(value)}`)
  }
  return value
}
