'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { GraduationCap, ChevronLeft, ChevronRight, X, Check } from 'lucide-react'
import {
  QA_TOUR_STEPS,
  QA_TOUR_STORAGE_KEY,
  QA_CATEGORY_DEFINITIONS,
  QA_CAUSE_DEFINITIONS,
  QA_SEVERITY_DEFINITIONS,
  type QATourStep,
} from '@/lib/qa-tour-content'
import { QA_CATEGORIES, QA_CAUSES, QA_SEVERITIES } from '@/lib/qa-session'

/**
 * The full option list for one field: label from the form, meaning and example
 * from the tour. Zipped at render time rather than duplicated, so a renamed
 * option shows up as a missing definition instead of a stale one.
 */
const DEFINITION_SETS = {
  category: { options: QA_CATEGORIES, defs: QA_CATEGORY_DEFINITIONS },
  cause: { options: QA_CAUSES, defs: QA_CAUSE_DEFINITIONS },
  severity: { options: QA_SEVERITIES, defs: QA_SEVERITY_DEFINITIONS },
} as const

/**
 * The QA tester tour. Deliberately independent of InteractiveTour.
 *
 * That component teaches the course to a learner across 17 steps and writes
 * `pyarcana:tourCompleted`. This teaches the taxonomy to a tester inside one
 * dialog and writes its own key, so finishing one never suppresses the other
 * and a tester who has used the platform for months still gets this the first
 * time they open the workspace.
 *
 * It teaches by asking rather than narrating: the tester classifies real
 * symptoms and every option carries its own explanation, because the useful
 * thing to learn is why "Alta" is wrong for something with no workaround, not
 * that it is.
 */
export function QATour({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const step: QATourStep | undefined = QA_TOUR_STEPS[index]
  const isLast = index === QA_TOUR_STEPS.length - 1

  const finish = useCallback(() => {
    try {
      localStorage.setItem(QA_TOUR_STORAGE_KEY, '1')
    } catch {
      // A tester in private mode still gets the tour; it simply reappears.
    }
    // Rewind on the way out, not on the way in. The component stays mounted
    // inside the workspace, so without this the Tutorial button reopened a
    // finished tour on "Listo" -- the one screen with nothing left to teach.
    // Resetting here also keeps it out of an effect, which the React Compiler
    // rules reject for good reason.
    setIndex(0)
    setPicked(null)
    onClose()
  }, [onClose])

  const go = useCallback((delta: number) => {
    setPicked(null)
    setIndex((i) => Math.min(QA_TOUR_STEPS.length - 1, Math.max(0, i + delta)))
  }, [])

  // Keyboard: the same shortcuts the platform tour uses, so a tester who has
  // seen that one already knows these.
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.stopPropagation(); finish() }
      else if (event.key === 'ArrowRight') go(1)
      else if (event.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [open, finish, go])

  useEffect(() => {
    if (open) panelRef.current?.focus()
  }, [open, index])

  // Highlight the field the step is about, so the words attach to a control.
  useEffect(() => {
    if (!open || !step?.target) return
    const el = document.querySelector<HTMLElement>(step.target)
    if (!el) return
    const previous = el.style.boxShadow
    el.style.boxShadow = '0 0 0 3px var(--primary)'
    el.scrollIntoView({ block: 'center', behavior: 'smooth' })
    return () => { el.style.boxShadow = previous }
  }, [open, step?.target])

  if (!open || !step) return null

  const ex = step.exercise
  const chosen = ex && picked ? ex.options.find((o) => o.value === picked) : undefined
  const isRight = !!ex && picked === ex.correct

  return (
    <div
      // Absolute, not fixed, and not portalled: this renders inside the QA
      // DialogContent, which is a transformed containing block. Staying in that
      // subtree is what puts the tour inside Radix's focus scope, so the
      // exercise options are reachable by Tab and not only by mouse.
      className="absolute inset-0 z-[60] flex items-center justify-center bg-black/40 p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Tutorial de QA"
      data-testid="qa-tour"
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        // Three rows: header, a body that scrolls, and a footer pinned to the
        // bottom. Letting the whole panel scroll was not enough -- on step 2 a
        // correct answer adds both the feedback and the rule, and the Siguiente
        // button was pushed past the bottom edge with the scroll lock making it
        // unreachable. Only the middle row can grow now, so the controls are
        // always on screen at any height.
        //
        // Width tracks the workspace it overlays rather than sitting at a fixed
        // 36rem: the tour points at fields in that workspace, so a panel much
        // narrower than it wastes the space and re-wraps every label.
        className="grid max-h-full w-full max-w-[min(46rem,100%)] grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-xl border border-border bg-background shadow-xl outline-none"
      >
        <div className="p-5 pb-0">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <GraduationCap className="h-4 w-4 text-primary" />
            Tutorial de QA · paso {index + 1} de {QA_TOUR_STEPS.length}
          </div>
          <button
            type="button"
            onClick={finish}
            aria-label="Cerrar el tutorial"
            data-testid="qa-tour-skip"
            className="-m-2 flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        </div>

        <div className="overflow-y-auto px-5 pb-1">
        <h2 className="text-lg font-semibold">{step.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>

        {step.definitions && (
          <dl className="mt-4 space-y-2" data-testid="qa-tour-definitions">
            {DEFINITION_SETS[step.definitions].options.map((opt) => {
              const def = DEFINITION_SETS[step.definitions!].defs.find((d) => d.value === opt.value)
              if (!def) return null
              return (
                <div
                  key={opt.value}
                  data-testid={`qa-tour-def-${opt.value}`}
                  className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm leading-relaxed"
                >
                  <dt className="inline font-medium">{opt.label}</dt>
                  <dd className="inline text-muted-foreground">
                    {' '}significa {def.means}.{' '}
                    <span className="text-foreground/80">Por ejemplo: {def.example}</span>
                  </dd>
                </div>
              )
            })}
          </dl>
        )}

        {ex && (
          <div className="mt-4 rounded-lg border border-border bg-muted/40 p-4">
            <p className="text-sm"><span className="font-medium">Caso:</span> {ex.symptom}</p>
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              ¿Qué {ex.fieldLabel.toLowerCase()} corresponde?
            </p>
            <div className="mt-2 grid gap-2">
              {ex.options.map((opt) => {
                const isPicked = picked === opt.value
                const showRight = isPicked && opt.value === ex.correct
                const showWrong = isPicked && opt.value !== ex.correct
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPicked(opt.value)}
                    data-testid={`qa-tour-option-${opt.value}`}
                    className={`min-h-11 rounded-md border px-3 py-2 text-left text-sm transition ${
                      showRight ? 'border-primary bg-primary/10'
                      : showWrong ? 'border-destructive/60 bg-destructive/5'
                      : 'border-border hover:bg-muted'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {showRight && <Check className="h-4 w-4 shrink-0 text-primary" />}
                      {opt.label}
                    </span>
                  </button>
                )
              })}
            </div>
            {chosen && (
              <p
                className="mt-3 text-sm leading-relaxed"
                role="status"
                data-testid="qa-tour-feedback"
              >
                {chosen.feedback}
              </p>
            )}
            {isRight && (
              <p className="mt-3 rounded-md border border-border bg-background p-3 text-sm leading-relaxed">
                <span className="font-medium">Regla: </span>{ex.rule}
              </p>
            )}
          </div>
        )}

        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border p-5 pt-4">
          <button
            type="button"
            onClick={finish}
            className="min-h-11 rounded-md px-3 text-sm text-muted-foreground hover:bg-muted"
          >
            {isLast ? 'Cerrar' : 'Saltar tutorial'}
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={index === 0}
              aria-label="Paso anterior"
              data-testid="qa-tour-prev"
              className="flex h-11 w-11 items-center justify-center rounded-md border border-border disabled:opacity-40 hover:bg-muted"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => (isLast ? finish() : go(1))}
              data-testid="qa-tour-next"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              {isLast ? 'Terminar' : 'Siguiente'}
              {!isLast && <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
