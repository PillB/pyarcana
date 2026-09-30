'use client'

import { useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { CLOUD_CONFIG, isGatingStage, type LaunchStage } from '@/lib/cloud/config'
import { useCloudStage } from '@/lib/cloud/hooks'
import { refreshMe, useCloudRuntime, useCloudSession } from '@/lib/cloud/session'
import { stageForGate } from '@/lib/cloud/gate'
import { snapshotAfterHandoff } from '@/lib/cloud/handoff-import'
import { whenProgressHydrated } from '@/lib/cloud/progress-adapter'
import { useProgressStore } from '@/lib/progress-store'
import { claimTrialIntent } from '@/lib/cloud/intent'
import { sendConsentRecord } from '@/lib/cloud/consent-sync'
import { ownerChoiceOpen } from '@/lib/cloud/ui-state'
import { startTrial } from '@/lib/cloud/account-api'
import { safeSessionStorage, safeStorage } from '@/lib/cloud/storage'
import { applyMe, cloudApi, getHandoffImporter, getMeasurement, getProgressSync, getSyncController, inMicrosoftCallback, isLeavingPage, track, useAccountUi, useSyncUi } from './runtime'
import { useText } from './text'

/**
 * First load where the gate applies: remember every section this device touched (gate.ts), after
 * a pending #import= on this load was merged, so progress brought from the old origin counts.
 */
function takeGrandfatherSnapshot(stage: LaunchStage): () => void {
  if (!isGatingStage(stageForGate(stage, CLOUD_CONFIG.gate.since, Date.now()))) return () => {}
  getHandoffImporter().capture()
  return whenProgressHydrated(() => {
    snapshotAfterHandoff(getHandoffImporter(), safeStorage(), () => useProgressStore.getState(), Date.now())
  })
}

function usePageLifecycle(stage: LaunchStage) {
  useEffect(() => {
    if (!inMicrosoftCallback()) void refreshMe()
    const unmountSync = getSyncController().mount()
    const unsnapshot = takeGrandfatherSnapshot(stage)
    track({ name: 'session_start' })
    const flush = () => void getMeasurement().flush(true)
    const onHidden = () => {
      if (document.visibilityState === 'hidden') flush()
    }
    document.addEventListener('visibilitychange', onHidden)
    window.addEventListener('pagehide', flush)
    return () => {
      unmountSync()
      unsnapshot()
      document.removeEventListener('visibilitychange', onHidden)
      window.removeEventListener('pagehide', flush)
    }
  }, [stage])
}

/** Sync follows the live session; a trial the learner asked for before signing in starts now. */
function useSessionFollowers() {
  const { toast } = useToast()
  const { tr } = useText()
  const meStatus = useCloudRuntime((s) => s.meStatus)
  const accountId = useCloudSession((s) => s.me?.account.id ?? null)
  useEffect(() => {
    if (meStatus === 'signed_out') getSyncController().setAccount(null)
    if (meStatus !== 'ok' || !accountId) return
    getSyncController().setAccount(accountId)
    void getMeasurement().bind(accountId)
    void sendConsentRecord(cloudApi(), safeStorage(), accountId)
    const me = useCloudSession.getState().me
    if (!claimTrialIntent(safeSessionStorage(), me, Date.now(), isLeavingPage())) return
    void startTrial(cloudApi()).then((r) => {
      if (!r.ok) return
      applyMe(r.me)
      useAccountUi.getState().setOpen(false)
      toast({ title: tr('account.trial.started') })
    })
  }, [meStatus, accountId])
}

/**
 * Another account's progress is on this device. Dismissable (Esc, the close button, "Decidir
 * después"): the choice stays pending and sync stays paused until the learner picks one, from here
 * or from "Elegir ahora" in the account panel. Plain Buttons: mixing the default and outline
 * classes on one AlertDialogAction painted the "Usar solo mi cuenta" label on its own background.
 */
function OwnerChoiceDialog() {
  const { tr } = useText()
  const open = useSyncUi((s) => ownerChoiceOpen(s.status, s.choiceDeferred))
  const choose = (choice: 'merge' | 'use_account') => void getProgressSync().resolveOwnerChoice(choice)
  const defer = () => useSyncUi.setState({ choiceDeferred: true })
  return (
    <Dialog open={open} onOpenChange={(next) => !next && defer()}>
      <DialogContent size="md" data-testid="sync-owner-choice" closeLabel={tr('account.dialog.close')}>
        <DialogHeader>
          <DialogTitle>{tr('sync.choice.title')}</DialogTitle>
          <DialogDescription>{tr('sync.choice.body')}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-wrap gap-2">
          <Button variant="ghost" onClick={defer}>{tr('sync.choice.later')}</Button>
          <Button variant="outline" onClick={() => choose('use_account')}>{tr('sync.choice.account')}</Button>
          <Button onClick={() => choose('merge')}>{tr('sync.choice.merge')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CloudSyncActive({ stage }: { stage: LaunchStage }) {
  usePageLifecycle(stage)
  useSessionFollowers()
  return <OwnerChoiceDialog />
}

/**
 * Headless account runtime for the course page: GET /v1/me once per load, progress sync
 * (record, pull, debounced push, flush on hide), the grandfather snapshot on the first gated
 * load, the pending-trial resume, and the experiments/events flush on page hide. Renders only
 * the owner-choice dialog when a device holds another account's progress. Nothing at all with
 * the stage off.
 */
export function CloudSync() {
  const stage = useCloudStage()
  if (stage === 'off') return null
  return <CloudSyncActive stage={stage} />
}
