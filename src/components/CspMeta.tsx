import { metaCsp } from '@/lib/cloud/csp'
import { CLOUD_CONFIG } from '@/lib/cloud/config'

/**
 * The static export's Content-Security-Policy as `<meta http-equiv>`, the only form a browser
 * enforces from markup (CSP3 §3.3). Next's `metadata.other` renders `<meta name=…>`, which
 * browsers ignore, so the policy used to ship inert on GitHub Pages. Rendered first in the root
 * layout's <head>. frame-ancestors, report-uri and sandbox are left out (metaCsp): a meta policy
 * ignores them and Chromium logs an error for each on every page. The Cloudflare build sends the
 * full policy, frame-ancestors included, as a header (_headers).
 */
export function CspMeta() {
  // `next dev` alone runs with NODE_ENV=development, and its runtime needs eval (metaCsp).
  const devServer = process.env.NODE_ENV === 'development'
  return <meta httpEquiv="Content-Security-Policy" content={metaCsp(CLOUD_CONFIG, { devServer })} />
}
