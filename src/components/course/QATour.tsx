'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'
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
import { boldParts, placeTourPanel, type TourBox, type TourPlacement } from '@/lib/qa-tour-layout'

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

/** Space between the highlighted control and the ring drawn around it. */
const SPOT_PAD = 4

/**
 * Where the highlighted control is, relative to the tutorial's overlay, and where the panel goes so
 * it never covers that control. Measured again whenever the control can move: its scroll area
 * scrolls, the window resizes, or either box changes size.
 *
 * The control is first scrolled only as far as needed to show it (`nearest`). When that leaves
 * neither side of it room for a usable panel, it is scrolled to the top of its scroll area once, so
 * the panel gets the space below. It used to be scrolled to the centre, under the centred panel.
 */
function useTourGeometry(open: boolean, target: string | undefined, overlayRef: RefObject<HTMLDivElement | null>) {
  const [geo, setGeo] = useState<{ target: string; spot: TourBox; placement: TourPlacement } | null>(null)

  useEffect(() => {
    const overlay = overlayRef.current
    const el = open && target ? document.querySelector<HTMLElement>(target) : null
    if (!overlay || !el || !target) return
    let frame = 0
    let scrolledToTop = false
    const measure = () => {
      frame = 0
      const o = overlay.getBoundingClientRect()
      const r = el.getBoundingClientRect()
      const box = { top: r.top - o.top, bottom: r.bottom - o.top, left: r.left - o.left, right: r.right - o.left }
      const { placement, fits } = placeTourPanel(o.height, box)
      if (!fits && !scrolledToTop) {
        scrolledToTop = true
        el.scrollIntoView({ block: 'start' })
        frame = requestAnimationFrame(measure)
        return
      }
      setGeo({ target, spot: box, placement })
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure) }
    el.scrollIntoView({ block: 'nearest' })
    schedule()
    const observer = new ResizeObserver(schedule)
    observer.observe(overlay)
    observer.observe(el)
    // Capture: scroll does not bubble, and the control's scroll area is not the window.
    document.addEventListener('scroll', schedule, true)
    window.addEventListener('resize', schedule)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      observer.disconnect()
      document.removeEventListener('scroll', schedule, true)
      window.removeEventListener('resize', schedule)
    }
  }, [open, target, overlayRef])

  // A measurement from an earlier step is stale the moment the step changes.
  return geo && geo.target === target ? geo : null
}

/**
 * The overlay's, slot's and panel's layout for a placement. Centred (no control, or not measured
 * yet): the overlay dims and centres the panel, as before. Otherwise the spotlight dims, and the
 * panel sits in a slot on one side of the control.
 */
function tourLayout(placement: TourPlacement | undefined): {
  overlay: string
  slotClass: string
  slot: CSSProperties | undefined
  panel: CSSProperties | undefined
} {
  if (!placement || placement.kind === 'center') {
    return { overlay: 'flex items-center justify-center bg-black/40 p-3 sm:p-4', slotClass: 'contents', slot: undefined, panel: undefined }
  }
  const side = placement.kind === 'below' ? { top: placement.top } : { bottom: placement.bottom }
  return { overlay: '', slotClass: 'absolute inset-x-0 flex justify-center px-3 sm:px-4', slot: side, panel: { maxHeight: placement.maxHeight } }
}

/** The step's geometry and layout, for QATour (kept out of it to hold its complexity at 15). */
function useTourStage(open: boolean, step: QATourStep | undefined, overlayRef: RefObject<HTMLDivElement | null>) {
  const geo = useTourGeometry(open, step?.target, overlayRef)
  return { spot: geo?.spot, layout: tourLayout(geo?.placement) }
}

/** The ring around the highlighted control; its shadow dims everything else in the workspace. */
function TourSpotlight({ spot }: { spot: TourBox | undefined }) {
  if (!spot) return null
  return (
    <div
      aria-hidden="true"
      data-testid="qa-tour-spotlight"
      className="pointer-events-none absolute rounded-md"
      style={{
        top: spot.top - SPOT_PAD,
        left: spot.left - SPOT_PAD,
        width: spot.right - spot.left + 2 * SPOT_PAD,
        height: spot.bottom - spot.top + 2 * SPOT_PAD,
        boxShadow: '0 0 0 3px var(--primary), 0 0 0 9999px rgb(0 0 0 / 0.4)',
      }}
    />
  )
}

/** Body copy with its **bold** spans rendered as bold, not as asterisks. */
function Rich({ text }: { text: string }) {
  return <>{boldParts(text).map((p, i) => (p.bold ? <strong key={i} className="font-semibold text-foreground">{p.text}</strong> : p.text))}</>
}

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
  const overlayRef = useRef<HTMLDivElement>(null)
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

  // Highlight the field the step is about, so the words attach to a control: a ring around it, the
  // rest of the workspace dimmed, and the panel beside it rather than over it.
  const { spot, layout } = useTourStage(open, step, overlayRef)

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
      //
      // With a control to point at, the dimming comes from the spotlight's shadow, which leaves a
      // hole over the control; overflow-hidden keeps that shadow inside the workspace.
      ref={overlayRef}
      className={`absolute inset-0 z-[60] overflow-hidden ${layout.overlay}`}
      role="dialog"
      aria-modal="true"
      aria-label="Tutorial de QA"
      data-testid="qa-tour"
      data-target={step.target}
    >
      <TourSpotlight spot={spot} />
      <div className={layout.slotClass} style={layout.slot}>
      <div
        ref={panelRef}
        tabIndex={-1}
        style={layout.panel}
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
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground"><Rich text={step.body} /></p>

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
    </div>
  )
}
