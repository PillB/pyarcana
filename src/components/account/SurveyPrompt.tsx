'use client'

import { useEffect, useState } from 'react'
import { create } from 'zustand'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCloudStage } from '@/lib/cloud/hooks'
import { canPrompt, readSurveyCap, recordPrompt, type SurveyKind } from '@/lib/cloud/surveys'
import { buildSurveyBody, GATE_REASONS, surveyTrigger, type SurveyTriggerInput } from '@/lib/cloud/survey-ui'
import { readQaMode } from '@/lib/cloud/qa-mode'
import { readRaw, safeStorage } from '@/lib/cloud/storage'
import { CID_KEY } from '@/lib/cloud/experiments'
import { useProgressStore } from '@/lib/progress-store'
import { cloudApi, track } from './runtime'
import { useText, type Tr } from './text'

interface ActiveSurvey {
  kind: SurveyKind
  sectionIndex?: number
}

const useSurveyUi = create<{ active: ActiveSurvey | null }>()(() => ({ active: null }))
let shownThisSession = false

function firstVisitMs(): number | null {
  const start = useProgressStore.getState().startDate
  const ms = start ? Date.parse(start) : NaN
  return Number.isFinite(ms) ? ms : null
}

function sectionIndexOf(sectionId: string | undefined): number | undefined {
  if (!sectionId) return undefined
  const el = document.querySelector<HTMLElement>(`[data-section-id="${CSS.escape(sectionId)}"]`)
  const n = Number(el?.dataset.sectionIndex)
  return Number.isInteger(n) && n > 0 ? n : undefined
}

/** Apply the caps (QA mode, 1 per session, 1 per 7 days, sampling) and open the prompt. */
function offer(kind: SurveyKind, sectionIndex?: number): void {
  const storage = safeStorage()
  const allowed = canPrompt(kind, {
    cap: readSurveyCap(storage),
    sessionShown: shownThisSession,
    nowMs: Date.now(),
    qaMode: readQaMode(storage).testMode,
    random: Math.random,
    firstVisitAt: firstVisitMs(),
  })
  if (!allowed) return
  shownThisSession = true
  recordPrompt(storage, kind, Date.now())
  useSurveyUi.setState({ active: { kind, sectionIndex } })
}

/** Called by the gate's "back" button (a dismissal) and by the completion listener. */
export function requestSurvey(input: SurveyTriggerInput): void {
  const trigger = surveyTrigger(input)
  if (!trigger) return
  offer(trigger.kind, trigger.sectionIndex ?? sectionIndexOf(trigger.sectionId))
}

function useTriggers(active: boolean) {
  useEffect(() => {
    if (!active) return
    const unsubscribe = useProgressStore.subscribe((next, prev) => {
      if (next.completedSections === prev.completedSections) return
      const added = next.completedSections.find((id) => !prev.completedSections.includes(id))
      if (added) track({ name: 'section_complete', sectionIndex: sectionIndexOf(added) })
      requestSurvey({ kind: 'completed', prev: prev.completedSections, next: next.completedSections })
    })
    const nps = window.setTimeout(() => offer('nps'), 60_000)
    return () => {
      unsubscribe()
      window.clearTimeout(nps)
    }
  }, [active])
}

function ScoreScale({ kind, score, setScore, tr }: { kind: SurveyKind; score: number | null; setScore: (n: number) => void; tr: Tr }) {
  const values = kind === 'nps' ? Array.from({ length: 11 }, (_, i) => i) : [1, 2, 3, 4, 5]
  const ends = kind === 'nps' ? ['survey.nps.low', 'survey.nps.high'] : ['survey.csat.low', 'survey.csat.high']
  return (
    <div role="radiogroup" aria-label={tr(kind === 'nps' ? 'survey.nps.q' : 'survey.csat.q')} className="space-y-1">
      <div className="flex flex-wrap gap-1">
        {values.map((v) => (
          <Button key={v} type="button" size="sm" variant={score === v ? 'default' : 'outline'} role="radio" aria-checked={score === v} className="h-8 w-8 p-0" onClick={() => setScore(v)}>
            {v}
          </Button>
        ))}
      </div>
      <p className="flex justify-between text-xs text-muted-foreground">
        <span>{tr(ends[0])}</span>
        <span>{tr(ends[1])}</span>
      </p>
    </div>
  )
}

function ReasonChoice({ reason, setReason, tr }: { reason: string; setReason: (r: string) => void; tr: Tr }) {
  return (
    <div role="radiogroup" aria-label={tr('survey.gate.q')} className="flex flex-wrap gap-1">
      {GATE_REASONS.map((r) => (
        <Button key={r} type="button" size="sm" variant={reason === r ? 'default' : 'outline'} role="radio" aria-checked={reason === r} onClick={() => setReason(r)}>
          {tr(`survey.reason.${r}`)}
        </Button>
      ))}
    </div>
  )
}

const QUESTION: Partial<Record<SurveyKind, string>> = { section_csat: 'survey.csat.q', nps: 'survey.nps.q', gate_reason: 'survey.gate.q' }

function SurveyCard({ survey, onClose }: { survey: ActiveSurvey; onClose: () => void }) {
  const { tr } = useText()
  const [score, setScore] = useState<number | null>(null)
  const [reason, setReason] = useState('')
  const [text, setText] = useState('')
  const [sent, setSent] = useState(false)
  const isReason = survey.kind === 'gate_reason'
  const body = buildSurveyBody(survey.kind, {
    score: isReason ? undefined : score ?? -1,
    reasonCode: isReason ? reason : undefined,
    text,
    sectionIndex: survey.sectionIndex,
    cid: readRaw(safeStorage(), CID_KEY),
  })
  const send = () => {
    if (body) void cloudApi().post('/v1/surveys', body)
    setSent(true)
  }
  if (sent) {
    return (
      <div className="space-y-2">
        <p role="status" className="text-sm">{tr('survey.thanks')}</p>
        <Button size="sm" variant="ghost" onClick={onClose}>{tr('consent.close')}</Button>
      </div>
    )
  }
  return (
    <div className="space-y-3">
      <p className="font-medium">{tr(QUESTION[survey.kind] ?? 'survey.csat.q')}</p>
      {isReason ? <ReasonChoice reason={reason} setReason={setReason} tr={tr} /> : <ScoreScale kind={survey.kind} score={score} setScore={setScore} tr={tr} />}
      <Label htmlFor="survey-text" className="text-xs font-normal">{tr('survey.text')}</Label>
      <Textarea id="survey-text" maxLength={500} rows={2} value={text} onChange={(e) => setText(e.target.value)} />
      <div className="flex gap-2">
        <Button size="sm" onClick={send} disabled={!body}>{tr('survey.send')}</Button>
        <Button size="sm" variant="ghost" onClick={onClose}>{tr('survey.skip')}</Button>
      </div>
    </div>
  )
}

/**
 * Satisfaction prompts (DESIGN-v3 §G): section CSAT after a completion (1 in 3), NPS from day 14,
 * a one-tap reason when the learner leaves the gate. At most one per session and one per 7 days;
 * none in QA mode; never modal and never blocking. Nothing with the stage off.
 */
export function SurveyPrompt() {
  const { tr } = useText()
  const stage = useCloudStage()
  const active = useSurveyUi((s) => s.active)
  useTriggers(stage !== 'off')
  if (stage === 'off' || !active) return null
  const close = () => useSurveyUi.setState({ active: null })
  return (
    <section aria-label={tr('survey.region')} className="fixed bottom-4 right-4 z-40 w-[min(22rem,calc(100%-2rem))] rounded-xl border border-border bg-background p-4 text-sm shadow-lg" data-testid="survey-prompt">
      <SurveyCard key={active.kind} survey={active} onClose={close} />
    </section>
  )
}
