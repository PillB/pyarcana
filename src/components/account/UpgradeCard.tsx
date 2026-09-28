'use client'

import { useEffect, useState } from 'react'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CLOUD_CONFIG } from '@/lib/cloud/config'
import { useCloudStage } from '@/lib/cloud/hooks'
import { useCloudRuntime, useCloudSession } from '@/lib/cloud/session'
import { startTrial, type UiError } from '@/lib/cloud/account-api'
import { saveIntent } from '@/lib/cloud/intent'
import { safeSessionStorage } from '@/lib/cloud/storage'
import { ErrorAlert } from './Alerts'
import { requestSurvey } from './SurveyPrompt'
import { applyMe, cloudApi, getMeasurement, loadAuthMethods, track, useAccountUi, useAuthMethods } from './runtime'
import { useText, type Tr } from './text'

function TrialButton({ sectionId, sectionIndex, tr }: { sectionId: string; sectionIndex: number; tr: Tr }) {
  const me = useCloudSession((s) => s.me)
  const days = useAuthMethods((s) => s.trialDays)
  const show = useAccountUi((s) => s.show)
  const [error, setError] = useState<UiError | null>(null)
  const [busy, setBusy] = useState(false)
  if (me && !me.account.trialAvailable) return <p className="text-sm text-muted-foreground">{tr('gate.trialUsed')}</p>
  const start = async () => {
    track({ name: 'gate_trial_click', sectionIndex })
    if (!me) {
      saveIntent(safeSessionStorage(), { kind: 'trial', sectionId }, Date.now())
      return show('main')
    }
    setBusy(true)
    const r = await startTrial(cloudApi())
    setBusy(false)
    if (r.ok) applyMe(r.me)
    else setError(r.error)
  }
  return (
    <div className="space-y-1">
      <Button onClick={() => void start()} disabled={busy} data-testid="gate-trial">
        {days ? tr('gate.trialDays', { days }) : tr('gate.trial')}
      </Button>
      <p className="text-xs text-muted-foreground">{tr('gate.trialNote')}</p>
      <ErrorAlert error={error} />
    </div>
  )
}

function PayOption({ tr }: { tr: Tr }) {
  const stage = useCloudStage()
  const signedIn = useCloudSession((s) => s.me !== null)
  const show = useAccountUi((s) => s.show)
  if (stage !== 'paid') return <p className="text-sm text-muted-foreground">{tr('account.upgrade.notOpen')}</p>
  return (
    <Button variant="outline" onClick={() => show(signedIn ? 'checkout' : 'main')} data-testid="gate-upgrade">
      {tr('gate.upgrade')}
    </Button>
  )
}

export interface UpgradeCardProps {
  sectionIndex: number
  sectionId: string
  /** Opens the last free section (the locked section has no prev/next controls). */
  onBackToFree: () => void
}

/**
 * What a free learner sees on a Pro section: what is free, the trial (kept through sign-in), the
 * way back to the last free section, and pay options only in stage 'paid'. If this load could not
 * reach the account service, it says so instead of implying the learner has no Pro.
 */
export function UpgradeCard({ sectionIndex, sectionId, onBackToFree }: UpgradeCardProps) {
  const { tr } = useText()
  const unavailable = useCloudRuntime((s) => s.meStatus === 'unavailable')
  const n = CLOUD_CONFIG.gate.freeSections
  useEffect(() => {
    void loadAuthMethods()
    track({ name: 'gate_view', sectionIndex })
    void getMeasurement().arm('aa_2026_q4')
  }, [sectionIndex])
  const back = () => {
    requestSurvey({ kind: 'gate_dismissed', sectionIndex })
    onBackToFree()
  }
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6" data-testid="upgrade-card">
      <Card className="space-y-4 p-6">
        <div className="flex items-center gap-2 text-primary">
          <Lock className="h-5 w-5" aria-hidden="true" />
          <h2 className="text-xl font-semibold">{tr('gate.title', { index: sectionIndex })}</h2>
        </div>
        <p className="text-sm">{tr('gate.body', { n, next: n + 1 })}</p>
        {unavailable && <p role="status" className="text-sm text-muted-foreground">{tr('gate.checkFailed')}</p>}
        <TrialButton sectionId={sectionId} sectionIndex={sectionIndex} tr={tr} />
        <PayOption tr={tr} />
        <Button variant="ghost" onClick={back} data-testid="gate-back">
          {tr('gate.back', { n })}
        </Button>
      </Card>
    </div>
  )
}
