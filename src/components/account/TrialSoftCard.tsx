'use client'

import { useEffect, useId, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CLOUD_CONFIG, isGatingStage } from '@/lib/cloud/config'
import { useAccess, useCloudStage } from '@/lib/cloud/hooks'
import { useCloudSession } from '@/lib/cloud/session'
import { saveIntent } from '@/lib/cloud/intent'
import { readRaw, safeSessionStorage, safeStorage, writeRaw } from '@/lib/cloud/storage'
import { useProgressStore } from '@/lib/progress-store'
import { track, useAccountUi } from './runtime'
import { useText } from './text'

export const TRIAL_CARD_DISMISSED_KEY = 'pyarcana-trialcard-dismissed-v1'

/** Shown only where a trial can actually start: gated stage, free access, trial still available. */
function useTrialOffer(): boolean {
  const stage = useCloudStage()
  const access = useAccess()
  const trialAvailable = useCloudSession((s) => (s.me ? s.me.account.trialAvailable : true))
  const [dismissed, setDismissed] = useState(true)
  useEffect(() => {
    // Read after mount: the prerendered HTML never contains the card.
    setDismissed(readRaw(safeStorage(), TRIAL_CARD_DISMISSED_KEY) === '1') // eslint-disable-line react-hooks/set-state-in-effect
  }, [])
  return isGatingStage(stage) && access === 'free' && trialAvailable && !dismissed
}

export function TrialCardBody({ sectionId, onDismiss }: { sectionId: string | null; onDismiss: () => void }) {
  const { tr } = useText()
  const signedIn = useCloudSession((s) => s.me !== null)
  const show = useAccountUi((s) => s.show)
  const next = CLOUD_CONFIG.gate.freeSections + 1
  const titleId = useId()
  useEffect(() => track({ name: 'trial_card_view' }), [])
  const start = () => {
    if (!signedIn) saveIntent(safeSessionStorage(), { kind: 'trial', sectionId }, Date.now())
    show('main')
  }
  return (
    <aside aria-labelledby={titleId} className="mx-auto my-6 max-w-3xl rounded-xl border border-gold/50 bg-background/80 p-5" data-testid="trial-soft-card">
      <div className="flex items-center gap-2 font-semibold">
        <Sparkles className="h-4 w-4 text-gold" aria-hidden="true" />
        <h2 id={titleId}>{tr('trialcard.title', { next })}</h2>
      </div>
      <p className="mt-2 text-sm text-foreground/80">{tr('trialcard.body', { next })}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" onClick={start}>{tr('trialcard.cta')}</Button>
        <Button size="sm" variant="ghost" onClick={onDismiss}>{tr('trialcard.dismiss')}</Button>
      </div>
    </aside>
  )
}

function useDismiss(): [boolean, () => void] {
  const [hidden, setHidden] = useState(false)
  const dismiss = () => {
    writeRaw(safeStorage(), TRIAL_CARD_DISMISSED_KEY, '1')
    setHidden(true)
  }
  return [hidden, dismiss]
}

/** End of the last free section (S05): a soft, dismissible trial offer. Never starts anything by itself. */
export function TrialSoftCard({ sectionIndex, sectionId }: { sectionIndex: number; sectionId: string }) {
  const offer = useTrialOffer()
  const [hidden, dismiss] = useDismiss()
  if (!offer || hidden || sectionIndex !== CLOUD_CONFIG.gate.freeSections) return null
  return <TrialCardBody sectionId={sectionId} onDismiss={dismiss} />
}

/** Dashboard variant: once the last free section is complete. Sections come from the caller (no course import). */
export function DashboardTrialCard({ sections }: { sections: ReadonlyArray<{ id: string; index: number }> }) {
  const offer = useTrialOffer()
  const [hidden, dismiss] = useDismiss()
  const completed = useProgressStore((s) => s.completedSections)
  const last = sections.find((s) => s.index === CLOUD_CONFIG.gate.freeSections)
  if (!offer || hidden || !last || !completed.includes(last.id)) return null
  return <TrialCardBody sectionId={null} onDismiss={dismiss} />
}
