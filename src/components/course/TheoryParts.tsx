'use client'

import type { ReactNode } from 'react'
import { CheckCircle2, Circle, Flag, PlayCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { countReadParts, firstUnreadPart, type TheoryPart } from '@/lib/course/theory-parts'
import { t, useI18n } from '@/lib/i18n'

/** DOM id of a part: keys may hold `#` (S01-T1-B#2), which an id selector would misread. */
export function theoryPartDomId(key: string): string {
  return `theory-part-${key.replace(/[^A-Za-z0-9_-]/g, '-')}`
}

function fill(template: string, vars: Record<string, string | number>): string {
  return Object.entries(vars).reduce((s, [k, v]) => s.split(`{${k}}`).join(String(v)), template)
}

/** Scroll a part's top under the sticky bars and hand it keyboard focus, so Tab continues there. */
function goToPart(key: string) {
  const el = document.getElementById(theoryPartDomId(key))
  if (!el) return
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' })
  el.focus({ preventScroll: true })
}

/**
 * The map at the top of Teoría: how many parts are read, one chip per part, and a way back to
 * the first part not yet read. It is where a learner who left halfway starts again.
 *
 * It must not carry `data-section-id`: QAFooterBridge and SurveyPrompt take the first element with
 * that attribute as the open section (static_first_paint caught a second one here).
 */
export function TheoryOutline({
  parts,
  read,
  theoryDone,
}: {
  parts: readonly TheoryPart[]
  read: readonly string[]
  theoryDone: boolean
}) {
  const lang = useI18n((s) => s.lang)
  if (parts.length === 0) return null
  const done = countReadParts(parts, read)
  const resume = firstUnreadPart(parts, read)
  const readSet = new Set(read)

  return (
    <nav
      aria-label={t('theory.parts.nav', lang)}
      className="rounded-lg border border-sky-500/25 bg-sky-500/5 p-3"
      data-testid="theory-outline"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Flag className="h-4 w-4 shrink-0 text-sky-600" aria-hidden="true" />
        <p className="min-w-0 flex-1 text-sm font-medium" role="status" data-testid="theory-outline-count">
          {fill(t('theory.parts.count', lang), { done, total: parts.length })}
        </p>
        {resume && done > 0 && !theoryDone && (
          <button
            type="button"
            onClick={() => goToPart(resume.key)}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-sky-500/40 bg-background px-3 text-sm font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            data-testid="theory-resume"
          >
            <PlayCircle className="h-4 w-4 text-sky-600" aria-hidden="true" />
            {fill(t('theory.parts.resume', lang), { part: resume.label })}
          </button>
        )}
      </div>
      <ol className="mt-2 flex flex-wrap gap-1.5">
        {parts.map((part) => {
          const isRead = readSet.has(part.key)
          return (
            <li key={part.key}>
              <button
                type="button"
                onClick={() => goToPart(part.key)}
                title={part.title}
                aria-label={`${part.label}: ${part.title}${isRead ? ` (${t('theory.parts.readShort', lang)})` : ''}`}
                data-testid={`theory-chip-${part.key}`}
                data-read={isRead ? 'true' : 'false'}
                className={cn(
                  'inline-flex h-8 items-center gap-1 rounded-full border px-2.5 text-xs font-semibold transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isRead
                    ? 'border-green-600/40 bg-green-600/10 text-green-700 dark:text-green-400'
                    : 'border-border bg-background text-muted-foreground hover:text-foreground'
                )}
              >
                {isRead ? (
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Circle className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {part.label}
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/** One part's blocks, closed by its checkpoint. */
export function TheoryPartView({
  part,
  read,
  onToggle,
  children,
}: {
  part: TheoryPart
  read: boolean
  onToggle: () => void
  children: ReactNode
}) {
  const lang = useI18n((s) => s.lang)
  return (
    <div
      id={theoryPartDomId(part.key)}
      tabIndex={-1}
      role="group"
      aria-label={`${part.label}: ${part.title}`}
      className="scroll-mt-40 space-y-6 focus-visible:outline-none"
      data-testid={`theory-part-${part.key}`}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-400">{part.label}</p>
      {children}
      <div
        className={cn(
          'flex flex-wrap items-center justify-between gap-2 rounded-md border border-dashed px-3 py-2',
          read ? 'border-green-600/40 bg-green-600/5' : 'border-sky-500/40'
        )}
        data-testid={`theory-checkpoint-${part.key}`}
      >
        {read ? (
          <>
            <span className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400" role="status">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              {fill(t('theory.parts.saved', lang), { part: part.label })}
            </span>
            <button
              type="button"
              onClick={onToggle}
              className="min-h-11 rounded-md px-3 text-sm underline underline-offset-2 hover:bg-accent"
              data-testid={`theory-checkpoint-undo-${part.key}`}
            >
              {t('theory.parts.undo', lang)}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onToggle}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-sky-700 px-4 text-sm font-medium text-white hover:bg-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto"
            data-testid={`theory-checkpoint-mark-${part.key}`}
          >
            <Flag className="h-4 w-4" aria-hidden="true" />
            {fill(t('theory.parts.mark', lang), { part: part.label })}
          </button>
        )}
      </div>
    </div>
  )
}
