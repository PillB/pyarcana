'use client'

import { CheckCircle2, LifeBuoy } from 'lucide-react'
import { useI18n, t } from '@/lib/i18n'
import type { SetupStep } from '@/lib/setup/types'
import { SETUP_SHOTS } from '@/lib/setup/content'
import { validShotRecord, type ShotRecord } from '@/lib/setup/screenshots'
import { SHOT_IMAGES } from '@/assets/setup'
import shotRecords from '@/assets/setup/shots.json'
import { InlineText } from '@/components/course/RichText'
import { CodeBlock } from '@/components/course/CodeBlock'
import { Screenshot } from './Screenshot'
import { SetupFigure } from './SetupFigure'

const RECORDS = new Map<string, ShotRecord>(
  (shotRecords as unknown[]).filter(validShotRecord).map((r) => [r.id, r]),
)

/** One action: what to do, what to type, what it looks like, what you should see, what if not. */
export function SetupStepView({
  step,
  number,
  done,
  onToggle,
}: {
  step: SetupStep
  number: string
  done: boolean
  onToggle: () => void
}) {
  const lang = useI18n((s) => s.lang)
  const tr = (key: string) => t(key, lang)
  const spec = step.shot ? SETUP_SHOTS.find((s) => s.id === step.shot) : undefined
  const checkId = `done-${step.id}`
  return (
    <li
      className={`rounded-lg border p-4 ${done ? 'border-green-500/40 bg-green-500/5' : 'border-border bg-card'}`}
      data-testid="setup-step"
      data-step-id={step.id}
      data-done={done ? '1' : '0'}
    >
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
      {step.command && <CodeBlock code={step.command} language="bash" title={tr('setup.type')} />}
      {spec && <Screenshot spec={spec} record={RECORDS.get(spec.id)} image={SHOT_IMAGES[spec.id]} />}
      {step.figure && <SetupFigure id={step.figure} />}
      {step.expect && (
        <div className="mt-3 rounded-md border border-green-500/30 bg-green-500/5 p-3 text-sm" data-testid="setup-expect">
          <p className="flex items-center gap-2 font-semibold text-green-900 dark:text-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden="true" />
            {tr('setup.expect')}
          </p>
          <p className="mt-1">
            <InlineText text={step.expect.text} />
          </p>
          {step.expect.output && (
            <pre className="mt-2 overflow-x-auto rounded bg-muted px-3 py-2 font-mono text-[13px]">{step.expect.output}</pre>
          )}
        </div>
      )}
      {step.fixes && step.fixes.length > 0 && (
        <details className="mt-3 rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-sm" data-testid="setup-fixes">
          <summary className="flex cursor-pointer items-center gap-2 font-semibold text-amber-900 dark:text-amber-200">
            <LifeBuoy className="h-4 w-4 text-amber-600" aria-hidden="true" />
            {tr('setup.fixes')}
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
      )}
      <div className="mt-3 flex items-center gap-2">
        <input
          id={checkId}
          type="checkbox"
          checked={done}
          onChange={onToggle}
          className="h-5 w-5 accent-green-600"
          data-testid="setup-step-done"
        />
        <label htmlFor={checkId} className="text-sm font-medium">
          {tr('setup.done')}
        </label>
      </div>
    </li>
  )
}
