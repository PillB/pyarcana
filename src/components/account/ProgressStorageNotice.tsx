'use client'

import Link from 'next/link'
import { Lock, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCloudStage } from '@/lib/cloud/hooks'
import { formatDate } from '@/lib/cloud/billing-ui'
import { useCloudSession } from '@/lib/cloud/session'
import { storageHeadline, storageNoticeKeys } from '@/lib/cloud/ui-state'
import { IS_STATIC_SITE } from '@/lib/runtime-mode'
import { openCloudAccount, useSyncUi } from './runtime'
import { useText } from './text'

const LINK_CLASS = 'font-medium text-foreground underline-offset-2 hover:underline'

/**
 * "Where is your progress saved?" on the Dashboard. Every sentence is a key chosen by the stage and
 * the sign-in state (storageHeadline, storageNoticeKeys), so it never promises an account where
 * accounts are off nor says "only this browser" where they run (owner request, 4 Oct 2026). The
 * `english` prop is the Dashboard's; the language comes from useText like every account component.
 */
export function ProgressStorageNotice({ isSignedIn }: { isSignedIn: boolean; english?: boolean }) {
  const { tr, lang } = useText()
  const stage = useCloudStage()
  const syncStatus = useSyncUi((s) => s.status)
  const lastSyncAt = useCloudSession((s) => s.lastSyncAt)
  const [line] = storageNoticeKeys({ signedIn: isSignedIn, isStaticSite: IS_STATIC_SITE, stage, syncStatus })
  const headline = storageHeadline({ signedIn: isSignedIn, isStaticSite: IS_STATIC_SITE, stage })
  if (headline) {
    return (
      <div className="mt-6 max-w-2xl rounded-xl border border-gold/50 bg-background/75 px-4 py-3 text-xs text-foreground/80 backdrop-blur" data-testid="progress-storage-notice" data-headline={headline.key}>
        <div className="flex items-start gap-2">
          <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
          <div className="space-y-1">
            <p>
              <strong>{tr('storage.where.title')}</strong> {tr(headline.key)}
            </p>
            {headline.offerSignIn && (
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => openCloudAccount()} data-testid="storage-signin">
                {tr('storage.where.signIn')}
              </Button>
            )}
            <p>
              {line && `${tr(line)} `}
              {tr('storage.privacy')}{' '}
              <Link href="/privacy" className={LINK_CLASS}>{tr('storage.privacyLink')}</Link>{' · '}
              <Link href="/cookies" className={LINK_CLASS}>{tr('storage.localLink')}</Link>
            </p>
          </div>
        </div>
      </div>
    )
  }
  const when = syncStatus === 'synced' && lastSyncAt ? formatDate(Math.floor(lastSyncAt / 1000), lang) : null
  return (
    <div className="mt-6 max-w-2xl rounded-xl border border-emerald-500/40 bg-emerald-500/5 px-4 py-3 text-xs text-foreground/80" data-testid="progress-storage-notice">
      <div className="flex items-start gap-2">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-300" />
        <div className="space-y-1">
          <p>
            <strong>{tr('storage.signedInLabel')}</strong> {tr(line ?? 'storage.signedIn.notYet')}
            {when && ` ${tr('storage.signedIn.lastSync', { when })}`}
          </p>
          <p>
            {tr('storage.signedIn.detail')}{' '}
            <Link href="/data-rights" className={LINK_CLASS}>{tr('storage.manageLink')}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
