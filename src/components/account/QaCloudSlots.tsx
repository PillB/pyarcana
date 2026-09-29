'use client'

/**
 * The QA harness's hooks into accounts (DESIGN-v3 §H). The harness lives in the root layout, so
 * this file stays thin: while the stage is off every slot renders nothing and QaCloud.tsx (the
 * account client, the image codec) is never even downloaded.
 */
import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useCloudStage, useQaMode } from '@/lib/cloud/hooks'
import { QA_OPEN_EVENT } from '@/lib/cloud/qa-links'
import type { QAIssue } from '@/lib/qa-session'
import { useText } from './text'

const SendIssue = dynamic(() => import('./QaCloud').then((m) => m.QaSendIssue), { ssr: false })
const SessionCloud = dynamic(() => import('./QaCloud').then((m) => m.QaSessionCloud), { ssr: false })

interface SlotProps {
  tester: string
  onSent: () => void
}

export function QaSendIssueSlot({ issue, ...rest }: SlotProps & { issue: QAIssue }) {
  const stage = useCloudStage()
  return stage === 'off' ? null : <SendIssue issue={issue} {...rest} />
}

export function QaSessionSlot({ issues, ...rest }: SlotProps & { issues: QAIssue[] }) {
  const stage = useCloudStage()
  return stage === 'off' ? null : <SessionCloud issues={issues} {...rest} />
}

/** A small, always-visible reminder that ads, experiments and surveys are in test mode. */
export function QaModeBadge() {
  const { tr } = useText()
  const stage = useCloudStage()
  const qa = useQaMode()
  if (stage === 'off' || !qa.testMode) return null
  return (
    <div className="pointer-events-none fixed bottom-2 left-2 z-50 rounded bg-amber-500 px-2 py-0.5 text-[10px] font-bold tracking-wide text-black" role="status" data-testid="qa-mode-badge">
      {tr('qa.mode.badge')}
    </div>
  )
}

/** The /qa page's "Abrir el workspace de QA" button asks the harness to open through a window event. */
export function useQaOpenRequest(open: () => void): void {
  useEffect(() => {
    const onRequest = () => open()
    window.addEventListener(QA_OPEN_EVENT, onRequest)
    return () => window.removeEventListener(QA_OPEN_EVENT, onRequest)
  }, [open])
}
