'use client'

import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { CLOUD_CONFIG, isGatingStage, type LaunchStage } from '@/lib/cloud/config'
import { useAccess, useCloudStage } from '@/lib/cloud/hooks'
import { ensureGrandfatherSnapshot, stageForGate, type GrandfatherSnapshot } from '@/lib/cloud/gate'
import { whenProgressHydrated } from '@/lib/cloud/progress-adapter'
import { useProgressStore } from '@/lib/progress-store'
import { sectionGateState } from '@/lib/cloud/ui-state'
import { safeStorage } from '@/lib/cloud/storage'
import { UpgradeCard } from './UpgradeCard'
import { useText } from './text'

/** The first-load snapshot of sections this device touched; null until progress has loaded. */
function useGrandfather(stage: LaunchStage): GrandfatherSnapshot | null {
  const [snapshot, setSnapshot] = useState<GrandfatherSnapshot | null>(null)
  useEffect(() => {
    if (!isGatingStage(stageForGate(stage, CLOUD_CONFIG.gate.since, Date.now()))) return
    return whenProgressHydrated(() => {
      setSnapshot(ensureGrandfatherSnapshot(safeStorage(), useProgressStore.getState(), Date.now()))
    })
  }, [stage])
  return snapshot
}

function GateSkeleton() {
  const { tr } = useText()
  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-10 sm:px-6" aria-busy="true" data-testid="gate-pending">
      <span className="sr-only" role="status">{tr('gate.checking')}</span>
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-40 w-full" />
    </div>
  )
}

/** "S05" for 5: page.tsx resolves S## ids to the section with that index. */
export function sectionCode(n: number): string {
  return `S${String(n).padStart(2, '0')}`
}

export interface EntitlementGateProps {
  /** 1-based section number (S01 = 1). */
  sectionIndex: number
  sectionId: string
  onSelectSection: (id: string) => void
  children: React.ReactNode
}

/**
 * Packaging A (DESIGN-v3 §D): a whole section is open, pending (skeleton, never an upsell flash)
 * or locked (UpgradeCard). Packaging B's per-tab lock is not built, so B applies A here. Renders
 * the section untouched while prerendering and whenever the stage is off, sync, or before
 * gate.since.
 */
export function EntitlementGate({ sectionIndex, sectionId, onSelectSection, children }: EntitlementGateProps) {
  const stage = useCloudStage()
  const access = useAccess()
  const snapshot = useGrandfather(stage)
  const decision = sectionGateState({ cfg: CLOUD_CONFIG, stage, access, sectionIndex, sectionId, snapshot, nowMs: Date.now() })
  if (decision === 'open') return <>{children}</>
  if (decision === 'pending') return <GateSkeleton />
  const back = () => onSelectSection(sectionCode(CLOUD_CONFIG.gate.freeSections))
  return <UpgradeCard sectionIndex={sectionIndex} sectionId={sectionId} onBackToFree={back} />
}
