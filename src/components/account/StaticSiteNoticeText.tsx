'use client'

import { CLOUD_CONFIG } from '@/lib/cloud/config'
import { useCloudStage } from '@/lib/cloud/hooks'
import { staticNoticeText } from '@/lib/cloud/ui-state'
import { isFirebaseClientConfigured } from '@/lib/firebase/config'
import type { Language } from '@/lib/i18n'

/**
 * The text after "Edición pública / Public edition:" on the Dashboard: what is true for the stage
 * this page load runs at (prerendered as stage off; the real stage after mount). Replaces the old
 * claim that the site is read-only and syncs "when Firebase is configured".
 */
export function StaticSiteNoticeText({ lang }: { lang: Language }) {
  const stage = useCloudStage()
  return <>{staticNoticeText(stage, isFirebaseClientConfigured(), lang, CLOUD_CONFIG.gate.freeSections)}</>
}
