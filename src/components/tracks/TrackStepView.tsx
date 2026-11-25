'use client'

import { CheckCircle2, LifeBuoy } from 'lucide-react'
import { useI18n, t } from '@/lib/i18n'
import type { TrackStep, TrackTable } from '@/lib/tracks/types'
import { InlineText } from '@/components/course/RichText'
import { CodeBlock } from '@/components/course/CodeBlock'
import { OfficialGuide } from '@/components/setup/OfficialGuide'
import { TrackPreviewFrame } from './TrackPreviewFrame'

function FactTable({ table }: { table: TrackTable }) {
  return (
    <div className="mt-3 overflow-x-auto" data-testid="track-table">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="pb-2 text-left font-semibold">{table.caption}</caption>
        <thead>
          <tr>
            {table.columns.map((c) => (
              <th key={c} scope="col" className="border-b border-border px-2 py-1.5 font-semibold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row.join('|')} className="align-top">
              {row.map((cell, i) => (
                <td key={`${i}-${cell}`} className="border-b border-border/60 px-2 py-1.5">
                  <InlineText text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Fixes({ step, label }: { step: TrackStep; label: string }) {
  if (!step.fixes?.length) return null
  return (
    <details className="mt-3 rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-sm" data-testid="track-fixes">
      <summary className="flex cursor-pointer items-center gap-2 font-semibold text-amber-900 dark:text-amber-200">
        <LifeBuoy className="h-4 w-4 text-amber-600" aria-hidden="true" />
        {label}
      </summary>
      <dl className="mt-2 space-y-3">
        {step.fixes.map((f) => (
          <div key={f.symptom}>
            <dt className="font-medium">
              <InlineText text={f.symptom} />
            </dt>
            <dd className="mt-1">
              <ol className="list-decimal space-y-1 pl-5">
                {f.steps.map((s) => (
                  <li key={s}>
                    <InlineText text={s} />
                  </li>
                ))}
              </ol>
            </dd>
          </div>
        ))}
      </dl>
    </details>
  )
}

/** The hint in plain sight, the solution behind a disclosure, so trying comes before reading. */
function Exercise({ exercise, hintLabel, solutionLabel }: { exercise: NonNullable<TrackStep['exercise']>; hintLabel: string; solutionLabel: string }) {
  const s = exercise.solution
  return (
    <div className="mt-3" data-testid="track-exercise">
      {exercise.hint && (
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{hintLabel}:</span> <InlineText text={exercise.hint} />
        </p>
      )}
      <details className="mt-2 rounded-md border border-border p-3 text-sm">
        <summary className="cursor-pointer font-semibold">{solutionLabel}</summary>
        <CodeBlock code={s.code} language={s.language} title={s.title} output={s.output} />
      </details>
    </div>
  )
}

/** One step: what to do and why, the code with what it prints, what the browser draws, the check. */
export function TrackStepView({ step, number, done, onToggle }: { step: TrackStep; number: string; done: boolean; onToggle: (checked: boolean) => void }) {
  const lang = useI18n((s) => s.lang)
  const tr = (key: string) => t(key, lang)
  const checkId = `track-done-${step.id}`
  return (
    <li
      className={`rounded-lg border p-4 ${done ? 'border-green-500/40 bg-green-500/5' : 'border-border bg-card'}`}
      data-testid="track-step"
      data-step-id={step.id}
      data-done={done ? '1' : '0'}
    >
      {step.exercise && <p className="text-xs font-semibold uppercase tracking-wide text-primary">{tr('track.exercise.kicker')}</p>}
      <h3 className="flex items-baseline gap-2 text-lg font-semibold">
        <span className="text-sm tabular-nums text-muted-foreground">{number}</span>
        <InlineText text={step.title} />
      </h3>
      <div className="mt-2 space-y-2 text-[15px] leading-relaxed text-foreground/90">
        {step.body.map((p) => (
          <p key={p}>
            <InlineText text={p} />
          </p>
        ))}
      </div>
      {step.table && <FactTable table={step.table} />}
      {step.code?.map((c) => <CodeBlock key={c.title} code={c.code} language={c.language} title={c.title} output={c.output} />)}
      {step.previews && step.previews.length > 0 && (
        <div className="mt-3" aria-label={tr('track.preview')} role="group">
          <p className="text-sm font-semibold">{tr('track.preview')}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {step.previews.map((p) => (
              <TrackPreviewFrame key={p.title} preview={p} />
            ))}
          </div>
        </div>
      )}
      {step.exercise && <Exercise exercise={step.exercise} hintLabel={tr('track.exercise.hint')} solutionLabel={tr('track.exercise.solution')} />}
      {step.guide && <OfficialGuide guide={step.guide} afterPicture={false} />}
      {step.expect && (
        <div className="mt-3 rounded-md border border-green-500/30 bg-green-500/5 p-3 text-sm" data-testid="track-expect">
          <p className="flex items-center gap-2 font-semibold text-green-900 dark:text-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden="true" />
            {tr('track.expect')}
          </p>
          <p className="mt-1">
            <InlineText text={step.expect} />
          </p>
        </div>
      )}
      <Fixes step={step} label={tr('track.fixes')} />
      <div className="mt-3 flex items-center gap-2">
        <input id={checkId} type="checkbox" checked={done} onChange={(e) => onToggle(e.target.checked)} className="h-5 w-5 accent-green-600" data-testid="track-step-done" />
        <label htmlFor={checkId} className="text-sm font-medium">
          {tr('track.done')}
        </label>
      </div>
    </li>
  )
}
