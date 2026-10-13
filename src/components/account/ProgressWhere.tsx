'use client'

import type { LaunchStage } from '@/lib/cloud/config'
import { useCloudStage } from '@/lib/cloud/hooks'
import { progressWhereKey } from '@/lib/cloud/ui-state'
import { IS_STATIC_SITE } from '@/lib/runtime-mode'
import { useText } from './text'

/**
 * "Where is your progress saved?" for a given edition and stage: the heading and the sentence the
 * Dashboard notice already uses (progressWhereKey), so a legal page repeats nothing the notice
 * does not say and never says "only this browser" where accounts run.
 */
export function ProgressWhereFor({ stage, isStaticSite }: { stage: LaunchStage; isStaticSite: boolean }) {
  const { tr } = useText()
  const key = progressWhereKey({ isStaticSite, stage })
  return (
    <>
      <h2 className="text-lg font-semibold">{tr('storage.where.title')}</h2>
      <p data-testid="progress-where" data-key={key}>{tr(key)}</p>
    </>
  )
}

/**
 * The same, for the stage this page load runs at: prerendered as stage off, the real stage after
 * mount (useCloudStage), exactly as the Dashboard notice behaves.
 */
export function ProgressWhere() {
  const stage = useCloudStage()
  return <ProgressWhereFor stage={stage} isStaticSite={IS_STATIC_SITE} />
}
