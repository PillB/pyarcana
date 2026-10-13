'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle2, Laptop, Smartphone } from 'lucide-react'
import { useI18n, t } from '@/lib/i18n'
import { browserOsSignals, detectOs, FALLBACK_OS, type OsGuess, type SetupOs } from '@/lib/setup/os'
import {
  chooseOs,
  countDone,
  loadSetupProgress,
  saveSetupProgress,
  toggleStep,
  type SetupProgress,
} from '@/lib/setup/progress'
import { SETUP_INTRO, SETUP_PARTS, stepsFor, setupStepIds } from '@/lib/setup/content'
import { InlineText } from '@/components/course/RichText'
import { OsSwitch } from './OsSwitch'
import { SetupStepView } from './SetupStepView'
import { SetupFigure } from './SetupFigure'

function storage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    return null
  }
}

/**
 * Sesión 0 (/empezar): setting up the computer, one OS track at a time.
 *
 * The first render (also the prerendered HTML) shows the fallback track; after mount the page
 * reads the learner's stored choice, else guesses from the browser, and says which it did.
 */
export function SetupIntro() {
  const lang = useI18n((s) => s.lang)
  const tr = (key: string) => t(key, lang)
  const [guess, setGuess] = useState<OsGuess>({ os: FALLBACK_OS, detected: false, mobile: false })
  const [progress, setProgress] = useState<SetupProgress>({ os: null, done: [] })
  const [mounted, setMounted] = useState(false)
  const [saveFailed, setSaveFailed] = useState(false)

  useEffect(() => {
    // Reading the browser has to wait for mount: the prerendered HTML has no navigator.
    /* eslint-disable react-hooks/set-state-in-effect */
    setGuess(detectOs(browserOsSignals()))
    setProgress(loadSetupProgress(storage()))
    setMounted(true)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [])

  const os: SetupOs = progress.os ?? guess.os
  const update = (next: SetupProgress) => {
    setProgress(next)
    setSaveFailed(!saveSetupProgress(storage(), next))
  }

  const allIds = useMemo(() => setupStepIds(os), [os])
  const doneAll = countDone(progress, allIds)
  const origin = progress.os ? 'chosen' : guess.detected ? 'detected' : 'fallback'

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8" data-testid="setup-intro" data-os={os} data-ready={mounted ? '1' : '0'}>
      <Link href="/" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {tr('setup.back')}
      </Link>
      <p className="text-sm font-medium uppercase tracking-wide text-primary">{tr('setup.kicker')}</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">{SETUP_INTRO.title}</h1>
      <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-foreground/90">
        {SETUP_INTRO.lead.map((p) => (
          <p key={p}>
            <InlineText text={p} />
          </p>
        ))}
      </div>

      {guess.mobile && (
        <p className="mt-4 flex gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm" data-testid="setup-mobile-note">
          <Smartphone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {tr('setup.mobile')}
        </p>
      )}

      <section aria-labelledby="setup-needs" className="mt-6 rounded-lg border border-border bg-card p-4">
        <h2 id="setup-needs" className="flex items-center gap-2 text-base font-semibold">
          <Laptop className="h-4 w-4 text-primary" aria-hidden="true" />
          {SETUP_INTRO.needsTitle}
        </h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
          {SETUP_INTRO.needs.map((n) => (
            <li key={n}>
              <InlineText text={n} />
            </li>
          ))}
        </ul>
      </section>

      <OsSwitch value={os} origin={origin} onChange={(next) => update(chooseOs(progress, next))} />

      <p className="mt-3 text-sm text-muted-foreground" role="status" data-testid="setup-progress">
        {tr('setup.progress').replace('{done}', String(doneAll)).replace('{total}', String(allIds.length))}
      </p>
      {saveFailed && (
        <p className="mt-2 text-sm text-amber-700 dark:text-amber-300" data-testid="setup-save-failed">
          {tr('setup.saveFailed')}
        </p>
      )}

      <SetupFigure id="setup-map" />

      <nav aria-label={tr('setup.toc')} className="mt-6">
        <ol className="grid gap-1 text-sm sm:grid-cols-2">
          {SETUP_PARTS.map((part, i) => {
            const ids = stepsFor(part, os).map((s) => s.id)
            const done = countDone(progress, ids)
            return (
              <li key={part.id}>
                <a href={`#${part.id}`} className="flex items-center gap-2 rounded px-2 py-1 hover:bg-accent">
                  {done === ids.length && ids.length > 0 ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" aria-label={tr('setup.partDone')} />
                  ) : (
                    <span className="w-4 text-center text-muted-foreground">{i + 1}</span>
                  )}
                  <span>{part.title}</span>
                </a>
              </li>
            )
          })}
        </ol>
      </nav>

      {SETUP_PARTS.map((part, i) => {
        const steps = stepsFor(part, os)
        const ids = steps.map((s) => s.id)
        return (
          <section key={part.id} id={part.id} aria-labelledby={`${part.id}-h`} className="mt-10 scroll-mt-20" data-testid="setup-part">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {tr('setup.part').replace('{n}', String(i + 1))} ·{' '}
              {tr('setup.partCount').replace('{done}', String(countDone(progress, ids))).replace('{total}', String(ids.length))}
            </p>
            <h2 id={`${part.id}-h`} className="mt-1 text-2xl font-bold tracking-tight">
              {part.title}
            </h2>
            <p className="mt-2 text-[15px] font-medium">
              <InlineText text={part.goal} />
            </p>
            <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-foreground/90">
              {part.intro.map((p) => (
                <p key={p}>
                  <InlineText text={p} />
                </p>
              ))}
            </div>
            {part.figure && <SetupFigure id={part.figure} />}
            <ol className="mt-4 space-y-4">
              {steps.map((step, n) => (
                <SetupStepView
                  key={step.id}
                  step={step}
                  number={`${i + 1}.${n + 1}`}
                  done={progress.done.includes(step.id)}
                  onToggle={() => update(toggleStep(progress, step.id))}
                />
              ))}
            </ol>
          </section>
        )
      })}

      <section className="mt-12 rounded-lg border border-green-500/40 bg-green-500/5 p-5" aria-labelledby="setup-next">
        <h2 id="setup-next" className="text-xl font-bold">{SETUP_INTRO.nextTitle}</h2>
        <div className="mt-2 space-y-2 text-[15px] leading-relaxed">
          {SETUP_INTRO.next.map((p) => (
            <p key={p}>
              <InlineText text={p} />
            </p>
          ))}
        </div>
        <Link
          href="/#setup"
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          data-testid="setup-to-s01"
        >
          {tr('setup.toS01')}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>
    </main>
  )
}
