'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Lock, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { LaunchStage } from '@/lib/cloud/config'
import { useCloudStage } from '@/lib/cloud/hooks'
import { formatDate } from '@/lib/cloud/billing-ui'
import { useCloudSession } from '@/lib/cloud/session'
import { completedSteps, NUDGE_KEY, nudgeDismissedAt, requestPersistOnce, showSigninNudge, type PersistAnswer } from '@/lib/cloud/storage-resilience'
import { safeStorage } from '@/lib/cloud/storage'
import { storageHeadline, storageNoticeKeys } from '@/lib/cloud/ui-state'
import { useProgressStore } from '@/lib/progress-store'
import { IS_STATIC_SITE } from '@/lib/runtime-mode'
import { openCloudAccount, track, useSyncUi } from './runtime'
import { useText } from './text'

const LINK_CLASS = 'font-medium text-foreground underline-offset-2 hover:underline'

/** Ask the browser once, after the first completed step, to keep this site's storage (storage-resilience). */
function usePersistAnswer(steps: number): PersistAnswer | null {
  const [answer, setAnswer] = useState<PersistAnswer | null>(null)
  useEffect(() => {
    if (steps < 1 || typeof navigator === 'undefined') return
    let live = true
    void requestPersistOnce(navigator.storage, safeStorage()).then((a) => { if (live) setAnswer(a) })
    return () => { live = false }
  }, [steps])
  return answer
}

/** The sign-in nudge's state: shown, its one view event, and "Ahora no" (a week). */
function useSigninNudge(i: { signedIn: boolean; isStaticSite: boolean; stage: LaunchStage; steps: number }) {
  const [dismissedAt, setDismissedAt] = useState<number | null>(() => nudgeDismissedAt(safeStorage()))
  const [now] = useState(() => Date.now())
  const show = showSigninNudge({ ...i, dismissedAt, now })
  const viewed = useRef(false)
  useEffect(() => {
    if (show && !viewed.current) {
      viewed.current = true
      track({ name: 'signin_nudge_view' })
    }
  }, [show])
  const dismiss = () => {
    const now = Date.now()
    safeStorage()?.setItem(NUDGE_KEY, String(now))
    setDismissedAt(now)
  }
  return { show, dismiss }
}

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
  const steps = useProgressStore((s) => completedSteps(s))
  const persist = usePersistAnswer(steps)
  const nudge = useSigninNudge({ signedIn: isSignedIn, isStaticSite: IS_STATIC_SITE, stage, steps })
  if (headline) {
    return (
      <div className="mt-6 max-w-2xl rounded-xl border border-gold/50 bg-background/75 px-4 py-3 text-xs text-foreground/80 backdrop-blur" data-testid="progress-storage-notice" data-headline={headline.key}>
        <div className="flex items-start gap-2">
          <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
          <div className="space-y-1">
            <p>
              <strong>{tr('storage.where.title')}</strong> {tr(headline.key)}
              {persist === 'granted' && ` ${tr('storage.persist.granted')}`}
              {persist === 'denied' && ` ${tr('storage.persist.denied')}`}
            </p>
            {nudge.show && <p data-testid="signin-nudge">{tr('storage.nudge', { n: String(steps) })}</p>}
            {headline.offerSignIn && (
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant={nudge.show ? 'default' : 'outline'}
                  className="h-7 text-xs"
                  onClick={() => {
                    if (nudge.show) track({ name: 'signin_nudge_click' })
                    openCloudAccount()
                  }}
                  data-testid="storage-signin"
                >
                  {tr('storage.where.signIn')}
                </Button>
                {nudge.show && (
                  <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={nudge.dismiss} data-testid="signin-nudge-dismiss">
                    {tr('storage.nudge.later')}
                  </Button>
                )}
              </div>
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
