'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { GraduationCap, ChevronLeft, ChevronRight, X, Check } from 'lucide-react'
import { QA_TOUR_STEPS, QA_TOUR_STORAGE_KEY, type QATourStep } from '@/lib/qa-tour-content'

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
  if (typeof document === 'undefined') return null

  const ex = step.exercise
  const chosen = ex && picked ? ex.options.find((o) => o.value === picked) : undefined
  const isRight = !!ex && picked === ex.correct

  return createPortal(
    <div
      // pointer-events restored explicitly: Radix sets `pointer-events: none`
      // on <body> while its dialog is open and re-enables it only on its own
      // content, so a portalled overlay renders correctly and swallows every
      // click. Playwright reported the harness subtree intercepting instead.
      style={{ pointerEvents: 'auto' }}
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Tutorial de QA"
      data-testid="qa-tour"
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="w-full max-w-xl rounded-xl border border-border bg-background p-5 shadow-xl outline-none"
      >
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

        <h2 className="text-lg font-semibold">{step.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>

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

        <div className="mt-5 flex items-center justify-between gap-3">
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
    </div>,
    document.body,
  )
}
