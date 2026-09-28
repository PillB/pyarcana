'use client'

import { useEffect } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { buttonVariants } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { CLOUD_CONFIG, isGatingStage, type LaunchStage } from '@/lib/cloud/config'
import { useCloudStage } from '@/lib/cloud/hooks'
import { refreshMe, useCloudRuntime, useCloudSession } from '@/lib/cloud/session'
import { ensureGrandfatherSnapshot, stageForGate } from '@/lib/cloud/gate'
import { whenProgressHydrated } from '@/lib/cloud/progress-adapter'
import { useProgressStore } from '@/lib/progress-store'
import { shouldResumeTrial, takeIntent } from '@/lib/cloud/intent'
import { startTrial } from '@/lib/cloud/account-api'
import { safeSessionStorage, safeStorage } from '@/lib/cloud/storage'
import { applyMe, cloudApi, getMeasurement, getProgressSync, getSyncController, track, useSyncUi } from './runtime'
import { useText } from './text'

/** First load where the gate applies: remember every section this device touched (gate.ts). */
function takeGrandfatherSnapshot(stage: LaunchStage): () => void {
  if (!isGatingStage(stageForGate(stage, CLOUD_CONFIG.gate.since, Date.now()))) return () => {}
  return whenProgressHydrated(() => {
    ensureGrandfatherSnapshot(safeStorage(), useProgressStore.getState(), Date.now())
  })
}

function usePageLifecycle(stage: LaunchStage) {
  useEffect(() => {
    void refreshMe()
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
    const me = useCloudSession.getState().me
    if (!shouldResumeTrial(takeIntent(safeSessionStorage(), Date.now()), me)) return
    void startTrial(cloudApi()).then((r) => {
      if (!r.ok) return
      applyMe(r.me)
      toast({ title: tr('account.trial.started') })
    })
  }, [meStatus, accountId])
}

function OwnerChoiceDialog() {
  const { tr } = useText()
  const status = useSyncUi((s) => s.status)
  const choose = (choice: 'merge' | 'use_account') => void getProgressSync().resolveOwnerChoice(choice)
  return (
    <AlertDialog open={status === 'needs_choice'}>
      <AlertDialogContent data-testid="sync-owner-choice">
        <AlertDialogHeader>
          <AlertDialogTitle>{tr('sync.choice.title')}</AlertDialogTitle>
          <AlertDialogDescription>{tr('sync.choice.body')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction className={buttonVariants({ variant: 'outline' })} onClick={() => choose('use_account')}>
            {tr('sync.choice.account')}
          </AlertDialogAction>
          <AlertDialogAction onClick={() => choose('merge')}>{tr('sync.choice.merge')}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
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
