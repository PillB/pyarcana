import type { ReactNode } from 'react'
import { CLOUD_CONFIG, type CloudConfig } from '@/lib/cloud/config'
import { adSharingClaimHolds, thirdPartyCookieClaimHolds } from '@/lib/cloud/legal-content'

/**
 * Wraps a statement on a legal page that is true only while no third party can set a cookie
 * (`kind="cookies"`) or receive data for advertising (`kind="ads"`) through this site. Decided
 * from the build's config, not the page load, so the prerendered HTML and the hydrated page say
 * the same thing. A server component: it ships no JavaScript.
 */
export function ThirdPartyClaim({ kind = 'cookies', cfg = CLOUD_CONFIG, children }: { kind?: 'cookies' | 'ads'; cfg?: CloudConfig; children: ReactNode }) {
  const holds = kind === 'ads' ? adSharingClaimHolds(cfg) : thirdPartyCookieClaimHolds(cfg)
  return holds ? <>{children}</> : null
}
