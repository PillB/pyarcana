'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CLOUD_CONFIG } from '@/lib/cloud/config'
import { useCloudStage } from '@/lib/cloud/hooks'
import { parseMe, refreshMe, useCloudRuntime, useCloudSession } from '@/lib/cloud/session'
import { completeMicrosoftCallback, msFailureView, withoutEmailCode, type MsCallbackResult } from '@/lib/cloud/ms-callback'
import { pollCheckout, type PollState } from '@/lib/cloud/billing-ui'
import { refreshSubscription, uiError, type UiError } from '@/lib/cloud/account-api'
import { safeSessionStorage } from '@/lib/cloud/storage'
import { ErrorAlert, StatusNote } from './Alerts'
import { AccountPanel } from './AccountPanel'
import { HeadingLevel } from './PlanSections'
import { AccountDialog } from './AccountDialog'
import { CloudSync } from './CloudSync'
import { applyMe, cloudApi, inMicrosoftCallback, markLeavingPage, markMicrosoftCallback, useAccountUi, useLoadedAuthMethods } from './runtime'
import { useAfterMount, useText, type Tr } from './text'
import { ERROR_ALERT_CLASS } from '@/components/account/a11y'

/** A failed callback keeps message KEYS, so the wording can follow whether email codes run. */
export type Phase =
  | { kind: 'idle' }
  | { kind: 'ms_working' }
  | { kind: 'ms_failed'; detailKey: string; minutes?: string; offerOtherWays: boolean }
  | { kind: 'ms_linked' }

function msFailure(r: Exclude<MsCallbackResult, { ok: true }>): Phase {
  const view = msFailureView(r)
  if (r.reason !== 'api') return { kind: 'ms_failed', detailKey: view.key, offerOtherWays: view.offerOtherWays }
  const e: UiError = uiError(r.result)
  return { kind: 'ms_failed', detailKey: e.key, minutes: e.minutes === undefined ? undefined : String(e.minutes), offerOtherWays: view.offerOtherWays }
}

/**
 * The Microsoft callback (DESIGN-v3 §B): the fragment is read and stripped with replaceState
 * before anything else, then the code is redeemed and the id_token posted to the worker. A
 * sign-in returns the learner to where they started; a link stays here and says it worked.
 */
function useMicrosoftCallback(): Phase {
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' })
  useEffect(() => {
    if (!inMicrosoftCallback()) return
    const hash = window.location.hash
    markMicrosoftCallback(true)
    window.history.replaceState(null, '', window.location.pathname + window.location.search)
    setPhase({ kind: 'ms_working' }) // eslint-disable-line react-hooks/set-state-in-effect
    void completeMicrosoftCallback({ hash, session: safeSessionStorage(), nowMs: Date.now(), cfg: CLOUD_CONFIG, fetch: window.fetch.bind(window), api: cloudApi() }).then((r) => {
      markMicrosoftCallback(false)
      if (!r.ok) {
        void refreshMe()
        return setPhase(msFailure(r))
      }
      // A sign-in leaves this page: flag it BEFORE applyMe, so the session followers keep a pending
      // "Probar 7 días" intent for the return page instead of starting a POST the unload aborts.
      if (r.purpose !== 'link') markLeavingPage()
      applyMe(parseMe(r.data))
      if (r.purpose === 'link') return setPhase({ kind: 'ms_linked' })
      window.location.replace(r.returnTo)
    })
  }, [])
  return phase
}

/** ?billing=return: re-read the provider with backoff; never call a slow webhook a failure. */
function useBillingReturn(): [PollState | 'checking' | null, () => void] {
  const [state, setState] = useState<PollState | 'checking' | null>(null)
  const run = () => {
    setState('checking')
    void pollCheckout({
      refresh: () => refreshSubscription(cloudApi()),
      sleep: (ms) => new Promise((resolve) => window.setTimeout(resolve, ms)),
    }).then((r) => {
      applyMe(r.me)
      setState(r.state)
    })
  }
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('billing') === 'return') run() // eslint-disable-line react-hooks/set-state-in-effect
  }, [])
  return [state, run]
}

const BILLING_KEYS: Record<string, string> = {
  checking: 'cuenta.billing.checking',
  confirmed: 'cuenta.billing.confirmed',
  pending: 'cuenta.billing.pending',
  signed_out: 'cuenta.signedOut',
}

function BillingStatus({ state, retry, tr }: { state: PollState | 'checking' | null; retry: () => void; tr: Tr }) {
  if (!state) return null
  return (
    <div className="space-y-2">
      <p role="status" className="text-sm">{tr(BILLING_KEYS[state])}</p>
      {state === 'pending' && <Button variant="outline" size="sm" onClick={retry}>{tr('cuenta.billing.checkNow')}</Button>}
    </div>
  )
}

/** The callback's outcome on /cuenta; exported for the rendered-markup test. */
export function PhaseNote({ phase, tr, emailOn = true }: { phase: Phase; tr: Tr; emailOn?: boolean }) {
  if (phase.kind === 'ms_working') return <p role="status" className="text-sm">{tr('cuenta.ms.working')}</p>
  if (phase.kind === 'ms_failed') {
    const detail = tr(withoutEmailCode(phase.detailKey, emailOn), { minutes: phase.minutes ?? '' })
    return (
      <div className="space-y-2">
        <p role="alert" className={ERROR_ALERT_CLASS}>{`${tr('cuenta.ms.failed')} ${detail}`}</p>
        {phase.offerOtherWays && (
          <Button variant="outline" size="sm" onClick={() => useAccountUi.getState().show('main')}>{tr(withoutEmailCode('cuenta.ms.otherWays', emailOn))}</Button>
        )}
      </div>
    )
  }
  return <StatusNote text={phase.kind === 'ms_linked' ? tr('cuenta.ms.linked') : null} />
}

function AccountPageActive() {
  const { tr, lang } = useText()
  const phase = useMicrosoftCallback()
  const emailOn = useLoadedAuthMethods((m) => m.email)
  const [billing, retry] = useBillingReturn()
  const me = useCloudSession((s) => s.me)
  const meStatus = useCloudRuntime((s) => s.meStatus)
  const signedOut = !me && meStatus === 'signed_out' && phase.kind !== 'ms_working'
  // Signing in from this page's Entrar button: once it succeeds, close the dialog, because this
  // page already shows the account panel and the open dialog would cover it.
  const signingInHere = useRef(false)
  useEffect(() => {
    if (me && signingInHere.current) {
      signingInHere.current = false
      useAccountUi.getState().setOpen(false)
    }
  }, [me])
  const openSignIn = () => {
    signingInHere.current = true
    useAccountUi.getState().show('main')
  }
  return (
    <div className="space-y-4" lang={lang}>
      <PhaseNote phase={phase} tr={tr} emailOn={emailOn} />
      <BillingStatus state={billing} retry={retry} tr={tr} />
      {me && (
        <HeadingLevel level={2}>
          <AccountPanel me={me} />
        </HeadingLevel>
      )}
      {signedOut && (
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm">{tr('cuenta.signedOut')}</p>
          <Button size="sm" onClick={openSignIn} data-testid="cuenta-signin">{tr('cuenta.signInCta')}</Button>
        </div>
      )}
      <ErrorAlert error={meStatus === 'unavailable' ? { key: 'account.error.unavailable' } : null} />
      <CloudSync />
      <AccountDialog />
    </div>
  )
}

/**
 * /cuenta: the Microsoft redirect target and the checkout return page. No third-party script
 * loads here (the Google button refuses this route). Where accounts do not run, it says so.
 */
export function AccountPage() {
  const { tr } = useText()
  const stage = useCloudStage()
  const mounted = useAfterMount(() => true, false)
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Card className="space-y-4 p-6">
        <h1 className="text-2xl font-semibold">{tr('cuenta.title')}</h1>
        {mounted && stage === 'off' && <p className="text-sm">{tr('cuenta.off')}</p>}
        {stage !== 'off' && <AccountPageActive />}
        <Link href="/" className="inline-block text-sm underline underline-offset-2">{tr('cuenta.back')}</Link>
      </Card>
    </main>
  )
}
