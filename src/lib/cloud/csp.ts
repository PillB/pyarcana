/**
 * The Content-Security-Policy <meta> of the static export, built from the public config
 * (DESIGN-v2 §8.13, v3 §E). The shipped config (stage off) yields exactly the policy the site
 * shipped before accounts existed; a host is added only when the stage is on AND the feature that
 * needs it is configured. House ads, same-origin '/api' and the QA placeholders need nothing.
 */
import { normalizeOrigin, type CloudConfig } from '@/lib/cloud/config'

const BASE: ReadonlyArray<[string, string[]]> = [
  ['default-src', ["'self'"]],
  ['script-src', ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://cdn.jsdelivr.net']],
  ['style-src', ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com']],
  ['img-src', ["'self'", 'data:', 'https:']],
  ['font-src', ["'self'", 'data:']],
  ['connect-src', ["'self'", 'https://firestore.googleapis.com', 'https://identitytoolkit.googleapis.com', 'https://securetoken.googleapis.com', 'https://cdn.jsdelivr.net']],
  ['frame-src', []],
  ['object-src', ["'none'"]],
  ['base-uri', ["'self'"]],
  ['form-action', ["'self'"]],
  ['frame-ancestors', ["'none'"]],
  ['upgrade-insecure-requests', []],
]

type Additions = Partial<Record<'script-src' | 'style-src' | 'connect-src' | 'frame-src', string[]>>

function additions(cfg: CloudConfig): Additions[] {
  const out: Additions[] = []
  if (cfg.googleClientId) {
    out.push({
      'script-src': ['https://accounts.google.com/gsi/client'],
      'style-src': ['https://accounts.google.com/gsi/style'],
      'connect-src': ['https://accounts.google.com/gsi/'],
      'frame-src': ['https://accounts.google.com/gsi/'],
    })
  }
  if (cfg.microsoftClientId) out.push({ 'connect-src': ['https://login.microsoftonline.com'] })
  const api = /^https?:\/\//.test(cfg.apiBaseUrl) ? normalizeOrigin(new URL(cfg.apiBaseUrl).origin) : null
  if (api) out.push({ 'connect-src': [api] })
  if (cfg.ads.provider === 'adsense' && cfg.ads.adsenseClient) {
    out.push({
      'script-src': ['https://pagead2.googlesyndication.com'],
      'connect-src': ['https://pagead2.googlesyndication.com'],
      'frame-src': ['https://googleads.g.doubleclick.net', 'https://tpc.googlesyndication.com'],
    })
  }
  if (cfg.ads.provider === 'ethicalads' && cfg.ads.ethicaladsPublisher) {
    out.push({ 'script-src': ['https://media.ethicalads.io'], 'connect-src': ['https://server.ethicalads.io'] })
  }
  return out
}

export function buildCsp(cfg: CloudConfig): string {
  const extra = cfg.launchStage === 'off' ? [] : additions(cfg)
  return BASE.map(([name, values]) => {
    const added = extra.flatMap((a) => a[name as keyof Additions] ?? [])
    if (name === 'frame-src') return added.length ? `frame-src 'self' ${[...new Set(added)].join(' ')}` : ''
    return [name, ...values, ...new Set(added)].join(' ')
  })
    .filter((d) => d !== '')
    .join('; ')
}

/** The policy shipped before accounts existed; the default config must reproduce it byte for byte. */
export const LEGACY_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://cdn.jsdelivr.net",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join('; ')
