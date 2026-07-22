/**
 * Public GitHub Pages builds are content-only. The full LMS remains available
 * when the application is deployed to a Node host with its API and database.
 *
 * NEXT_PUBLIC_* values are intentionally used here because this module is also
 * imported by client components and must be resolved at build time.
 */
export const IS_STATIC_SITE = process.env.NEXT_PUBLIC_STATIC_SITE === '1'

const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export const SITE_BASE_PATH = configuredBasePath
  ? `/${configuredBasePath.replace(/^\/+|\/+$/g, '')}`
  : ''

export function siteAsset(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${SITE_BASE_PATH}${normalizedPath}`
}
