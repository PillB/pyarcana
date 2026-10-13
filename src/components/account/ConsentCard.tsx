'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { create } from 'zustand'
import { Button } from '@/components/ui/button'
import { CLOUD_CONFIG, type LaunchStage } from '@/lib/cloud/config'
import { useCloudStage } from '@/lib/cloud/hooks'
import { readConsent, readPrivacySignals, recordConsent, withdrawConsent, type ConsentRecord } from '@/lib/cloud/consent'
import { consentCardMode } from '@/lib/cloud/ui-state'
import { safeStorage } from '@/lib/cloud/storage'
import { sendConsentRecord } from '@/lib/cloud/consent-sync'
import { useCloudSession } from '@/lib/cloud/session'
import { cloudApi, getMeasurement } from './runtime'
import { useText, type Tr } from './text'
import { useBottomReserve } from './useBottomReserve'

/**
 * reopened: opened from the footer link. deferred: "Ahora no" or Esc on this page view (stored
 * nowhere, so it asks again on the next load). showing: the card is on screen, so no survey opens
 * over it (SurveyPrompt reads this).
 */
export const useConsentUi = create<{ reopened: boolean; deferred: boolean; showing: boolean }>()(() => ({ reopened: false, deferred: false, showing: false }))

/** Some enabled experiment would measure: the only reason to ask at all. */
function useMeasurementWanted(stage: LaunchStage): boolean {
  const [wanted, setWanted] = useState(false)
  useEffect(() => {
    if (stage === 'off') return
    let live = true
    void getMeasurement().experiments().then((list) => {
      if (live) setWanted(list.length > 0)
    })
    return () => {
      live = false
    }
  }, [stage])
  return wanted
}

/** Close without answering: the stored choice (or its absence) stays as it is. */
function putOff(): void {
  useConsentUi.setState({ reopened: false, deferred: true })
}

function useCardShowing(showing: boolean): void {
  useEffect(() => {
    useConsentUi.setState({ showing })
    return () => useConsentUi.setState({ showing: false })
  }, [showing])
}

function currentLine(record: ConsentRecord | null, signal: boolean, tr: Tr): string {
  if (signal) return tr('consent.now.signal')
  if (!record) return tr('consent.now.none')
  return record.value === 'granted' ? tr('consent.now.granted') : tr('consent.now.denied')
}

/**
 * The consent card (DESIGN-v3 §F): small, non-blocking, "Sí" and "No" with equal weight, one
 * sentence and a link. It asks only when an experiment is enabled and no choice is stored;
 * GPC/DNT count as "no". The footer link reopens it on the same surface to change the answer;
 * "No" also forgets the measurement id. Nothing with the stage off. "Ahora no" (or Esc) puts it
 * off for this page view without answering, and while it is up the page keeps room below the
 * focus for it (WCAG 2.4.11).
 */
export function ConsentCard() {
  const { tr } = useText()
  const stage = useCloudStage()
  const reopened = useConsentUi((s) => s.reopened)
  const deferred = useConsentUi((s) => s.deferred)
  const card = useRef<HTMLElement>(null)
  const wanted = useMeasurementWanted(stage)
  const [record, setRecord] = useState<ConsentRecord | null>(() => readConsent(safeStorage()))
  const signals = readPrivacySignals(typeof navigator === 'undefined' ? undefined : navigator)
  const mode = consentCardMode({ stage, mode: CLOUD_CONFIG.consent.mode, record, signals, country: null, measurementWanted: wanted, reopened, deferred })
  useCardShowing(mode !== 'hidden')
  useBottomReserve('consent', card, mode !== 'hidden')
  if (mode === 'hidden') return null
  const answer = (value: 'granted' | 'denied') => {
    const storage = safeStorage()
    setRecord(value === 'granted' ? recordConsent(storage, 'granted', Date.now()) : withdrawConsent(storage, Date.now()))
    useConsentUi.setState({ reopened: false })
    const accountId = useCloudSession.getState().me?.account.id
    if (accountId) void sendConsentRecord(cloudApi(), storage, accountId)
  }
  return (
    <section
      ref={card}
      aria-labelledby="consent-title"
      className="fixed inset-x-4 bottom-4 z-40 max-w-md rounded-xl border border-border bg-background p-4 text-sm shadow-lg sm:left-4 sm:right-auto"
      data-testid="consent-card"
      onKeyDown={(e) => {
        if (e.key === 'Escape') putOff()
      }}
    >
      <h2 id="consent-title" className="font-semibold">{tr('consent.title')}</h2>
      <p className="mt-1">{tr('consent.text')}</p>
      {mode === 'manage' && <p className="mt-1 text-muted-foreground">{currentLine(record, signals.gpc || signals.dnt, tr)}</p>}
      <p className="mt-1 text-xs text-muted-foreground">{tr('consent.ads')}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => answer('granted')}>{tr('consent.yes')}</Button>
        <Button size="sm" variant="outline" onClick={() => answer('denied')}>{tr('consent.no')}</Button>
        <Link href="/cookies#cloud-legal" className="text-xs underline underline-offset-2">{tr('consent.more')}</Link>
        <Button size="sm" variant="ghost" onClick={putOff}>{tr(mode === 'manage' ? 'consent.close' : 'consent.later')}</Button>
      </div>
    </section>
  )
}

/** Footer link "Medición y anuncios": withdrawal as easy as giving, on the same card. */
export function ConsentFooterLink() {
  const { tr } = useText()
  const stage = useCloudStage()
  if (stage === 'off') return null
  return (
    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground" onClick={() => useConsentUi.setState({ reopened: true })} data-testid="consent-footer-link">
      {tr('consent.footer')}
    </Button>
  )
}
