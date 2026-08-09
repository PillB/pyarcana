'use client'

/**
 * InteractiveTour — first-visit guided tour for PyArcana.
 *
 * Built with React state + shadcn Popover/Dialog (no external tour library).
 *
 * Behaviour:
 *  - 11 fixed steps (welcome, sidebar sections, capstones, resources, admin/supervisor [conditional],
 *    I Do/We Do/You Do tabs, Autocheck, theme toggle, language toggle, legal pages, done).
 *  - Desktop targeted step → Radix Popover anchored to a virtual box drawn over the target rect,
 *    with a 4-pane semi-transparent overlay that "cuts out" the highlighted element + a primary ring.
 *  - Mobile (any step) or step without a resolvable target → Dialog (bottom sheet on mobile, centered on desktop).
 *  - Conditional steps (e.g. Admin/Supervisor) are filtered out at runtime if their target isn't in the DOM.
 *  - Keyboard:
 *      • Tab — cycles through Skip / Prev / Next buttons (native focus order).
 *      • Enter — advances (auto-focused on Next, so native click fires; falls back to window handler otherwise).
 *      • Esc — skips (closes the tour and marks it complete in localStorage).
 *      • Arrow Left / Right — optional prev/next shortcuts.
 *  - On completion (finish or skip), writes `localStorage['pyarcana:tourCompleted'] = '1'`.
 *  - Dark-mode compatible: uses theme tokens (bg-popover, bg-background, border, muted-foreground, etc.).
 *  - Responsive: drawer-style bottom sheet on `< md` (useIsMobile), popover on `>= md`.
 */

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@/components/ui/popover'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useIsMobile } from '@/hooks/use-mobile'
import { t, useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  SkipForward,
} from 'lucide-react'

export const PYARCANA_TOUR_STORAGE_KEY = 'pyarcana:tourCompleted'

type Placement = 'top' | 'bottom' | 'left' | 'right' | 'center'

interface TourStep {
  /** CSS selector for the highlight target. Omit for full-screen center steps. */
  target?: string
  titleKey: string
  bodyKey: string
  placement?: Placement
  /** When true, the step is skipped entirely if `target` is not present in the DOM. */
  conditional?: boolean
}

const STEPS: TourStep[] = [
  {
    titleKey: 'tour.welcome.title',
    bodyKey: 'tour.welcome.body',
    placement: 'center',
  },
  {
    target: '[data-testid="sidebar-sections"]',
    titleKey: 'tour.sections.title',
    bodyKey: 'tour.sections.body',
    placement: 'right',
  },
  {
    target: '[data-testid="nav-capstones"]',
    titleKey: 'tour.capstones.title',
    bodyKey: 'tour.capstones.body',
    placement: 'bottom',
  },
  {
    target: '[data-testid="nav-resources"]',
    titleKey: 'tour.resources.title',
    bodyKey: 'tour.resources.body',
    placement: 'bottom',
  },
  {
    target: '[data-testid="nav-admin"], [data-testid="nav-supervisor"]',
    titleKey: 'tour.admin.title',
    bodyKey: 'tour.admin.body',
    placement: 'bottom',
    conditional: true,
  },
  {
    target: '[data-testid="tab-ido"]',
    titleKey: 'tour.tabs.title',
    bodyKey: 'tour.tabs.body',
    placement: 'bottom',
  },
  {
    target: '[data-testid="sc-submit"]',
    titleKey: 'tour.autocheck.title',
    bodyKey: 'tour.autocheck.body',
    placement: 'bottom',
  },
  {
    target: '[data-testid="theme-toggle"]',
    titleKey: 'tour.theme.title',
    bodyKey: 'tour.theme.body',
    placement: 'bottom',
  },
  {
    target: '[data-testid="language-toggle"]',
    titleKey: 'tour.language.title',
    bodyKey: 'tour.language.body',
    placement: 'bottom',
  },
  {
    target: '[data-testid="legal-links"]',
    titleKey: 'tour.legal.title',
    bodyKey: 'tour.legal.body',
    placement: 'top',
  },
  {
    titleKey: 'tour.done.title',
    bodyKey: 'tour.done.body',
    placement: 'center',
  },
]

interface Rect {
  top: number
  left: number
  width: number
  height: number
}

/**
 * Tracks the bounding rect of the element matching `target`. Updates on scroll,
 * resize and ResizeObserver. Returns null when target is empty or not found.
 *
 * When multiple elements match the selector (e.g. the same `data-testid` exists
 * in both the mobile and desktop headers), the first VISIBLE one (non-zero rect)
 * is used. This keeps the tour pointing at the element the user actually sees
 * across responsive breakpoints.
 *
 * The hook always runs (no conditional calls) and resets rect to null when the
 * target changes so the consumer can fall back to dialog mode briefly between
 * steps.
 */
function useElementRect(target: string | undefined, enabled: boolean): Rect | null {
  const [rect, setRect] = useState<Rect | null>(null)

  // Reset on target change so we don't show a stale rect from the previous step.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRect(null)
  }, [target])

  useLayoutEffect(() => {
    if (!enabled || !target) return

    const pickVisible = (): HTMLElement | null => {
      const els = document.querySelectorAll<HTMLElement>(target)
      for (let i = 0; i < els.length; i++) {
        const candidate = els[i]
        const r = candidate.getBoundingClientRect()
        if (r.width > 0 && r.height > 0) {
          return candidate
        }
      }
      // Fallback: if none are visible (e.g. still mounting), return the first.
      return (els[0] as HTMLElement) || null
    }

    const el = pickVisible()
    if (!el) return

    const update = () => {
      const visible = pickVisible()
      const targetEl = visible || el
      const r = targetEl.getBoundingClientRect()
      // Guard against zero-size elements (e.g. display: none ancestors).
      if (r.width === 0 && r.height === 0) {
        setRect(null)
        return
      }
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height })
    }
    update()
    const ro = new ResizeObserver(update)
    // Observe all matching elements so a responsive swap (mobile ↔ desktop)
    // triggers an update.
    const allEls = document.querySelectorAll<HTMLElement>(target)
    allEls.forEach((e) => ro.observe(e))
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [target, enabled])

  return rect
}

function fillTemplate(
  template: string,
  vars: Record<string, string | number>,
): string {
  return Object.entries(vars).reduce(
    (s, [k, v]) => s.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v)),
    template,
  )
}

interface InteractiveTourProps {
  /** Controlled open state. */
  open: boolean
  /** Called when the tour finishes (either by completion or skip). */
  onClose: () => void
}

export function InteractiveTour({ open, onClose }: InteractiveTourProps) {
  const lang = useI18n((s) => s.lang)
  const tr = useCallback((k: string) => t(k, lang), [lang])
  const isMobile = useIsMobile()

  const [visible, setVisible] = useState(false)
  const [stepIdx, setStepIdx] = useState(0)
  const [effectiveSteps, setEffectiveSteps] = useState<TourStep[]>(STEPS)
  const nextRef = useRef<HTMLButtonElement>(null)
  const completedRef = useRef(false)

  // Resolve conditional steps whenever the tour opens. Conditional steps whose
  // target isn't currently in the DOM (e.g. Admin link when not signed in as
  // admin) are filtered out so the user isn't shown a step pointing at nothing.
  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(false)
      return
    }
    completedRef.current = false
    const filtered = STEPS.filter((s) => {
      if (!s.conditional) return true
      if (!s.target) return true
      try {
        return !!document.querySelector(s.target)
      } catch {
        return false
      }
    })
    setEffectiveSteps(filtered.length > 0 ? filtered : STEPS)
    setStepIdx(0)
    // Defer to next frame so effectiveSteps is committed before we render.
    const id = window.setTimeout(() => {
      setVisible(true)
    }, 0)
    return () => window.clearTimeout(id)
  }, [open])

  const complete = useCallback(() => {
    if (completedRef.current) return
    completedRef.current = true
    try {
      localStorage.setItem(PYARCANA_TOUR_STORAGE_KEY, '1')
    } catch {
      // localStorage may be unavailable (private mode / SSR) — fail silently.
    }
    setVisible(false)
    window.setTimeout(() => onClose(), 0)
  }, [onClose])

  const next = useCallback(() => {
    setStepIdx((i) => {
      if (i + 1 >= effectiveSteps.length) {
        complete()
        return i
      }
      return i + 1
    })
  }, [effectiveSteps.length, complete])

  const prev = useCallback(() => {
    setStepIdx((i) => Math.max(0, i - 1))
  }, [])

  const skip = useCallback(() => {
    complete()
  }, [complete])

  // Auto-focus the Next/Finish button whenever the step changes so Enter
  // natively advances the tour.
  useEffect(() => {
    if (!visible) return
    const id = window.setTimeout(() => {
      nextRef.current?.focus()
    }, 100)
    return () => window.clearTimeout(id)
  }, [visible, stepIdx])

  // Global keyboard handler. Esc always skips; Enter advances only when no
  // button is currently focused (so native button activation takes over for
  // Skip/Prev). Arrow Left/Right are bonus shortcuts.
  useEffect(() => {
    if (!visible) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        skip()
        return
      }
      if (e.key === 'Enter') {
        const active = document.activeElement as HTMLElement | null
        if (
          active &&
          (active.tagName === 'BUTTON' ||
            active.getAttribute('role') === 'button')
        ) {
          // Let the focused button's native activation fire (Next/Skip/Prev).
          return
        }
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prev()
      }
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [visible, next, prev, skip])

  // Always call the rect hook (no conditional hooks). When the current step
  // has no target or the tour isn't visible, we pass `undefined` so it returns
  // null cheaply.
  const currentStep = effectiveSteps[stepIdx]
  const rectTarget = visible ? currentStep?.target : undefined
  const rect = useElementRect(rectTarget, visible)

  const isLast = stepIdx === effectiveSteps.length - 1

  // Decide whether to render as a Dialog (center / mobile / no-target) or as
  // an anchored Popover (desktop with a resolved target).
  const useDialogMode =
    !visible ||
    effectiveSteps.length === 0 ||
    isMobile ||
    !currentStep ||
    !currentStep.target ||
    currentStep.placement === 'center' ||
    rect === null

  // Card body shared by both Dialog and Popover.
  const card = useMemo(() => {
    if (!currentStep) return null
    const stepNumber = stepIdx + 1
    const total = effectiveSteps.length
    return (
      <div className="space-y-3" data-testid="tour-card">
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant="secondary"
            className="gap-1 text-[10px] font-medium uppercase tracking-wide"
          >
            <Compass className="h-3 w-3" />
            {fillTemplate(tr('tour.step'), { n: stepNumber, total })}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={skip}
            className="h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
            aria-label={tr('tour.skip')}
            data-testid="tour-skip"
          >
            <SkipForward className="h-3.5 w-3.5" />
            {tr('tour.skip')}
          </Button>
        </div>

        <div className="space-y-1.5">
          <h3
            className="text-base font-semibold leading-tight tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {tr(currentStep.titleKey)}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {tr(currentStep.bodyKey)}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex">
            {stepIdx > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={prev}
                className="h-8 gap-1 px-2"
                aria-label={tr('tour.prev')}
                data-testid="tour-prev"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                {tr('tour.prev')}
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span
              className="hidden text-[10px] text-muted-foreground sm:inline"
              aria-hidden
            >
              {tr('tour.kbdHint')}
            </span>
            <Button
              ref={nextRef}
              size="sm"
              onClick={next}
              className="h-8 gap-1"
              data-testid="tour-next"
            >
              {isLast ? tr('tour.finish') : tr('tour.next')}
              {!isLast && <ChevronRight className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>
      </div>
    )
  }, [currentStep, stepIdx, effectiveSteps.length, isLast, tr, next, prev, skip])

  if (!visible || effectiveSteps.length === 0 || !currentStep) {
    return null
  }

  // === Dialog mode (welcome, done, mobile, or steps whose target isn't visible) ===
  if (useDialogMode) {
    return (
      <Dialog
        open={visible}
        onOpenChange={(o) => {
          if (!o) skip()
        }}
      >
        <DialogContent
          showCloseButton={false}
          onEscapeKeyDown={(e) => {
            // Prevent double-handling — our global handler already calls skip().
            e.preventDefault()
            skip()
          }}
          onInteractOutside={(e) => {
            // Don't dismiss on outside click; users must explicitly Skip or Next.
            e.preventDefault()
          }}
          onOpenAutoFocus={(e) => {
            e.preventDefault()
            nextRef.current?.focus()
          }}
          className={cn(
            'gap-0 p-5 sm:max-w-md',
            // Mobile: bottom-sheet style. Desktop: keep default centered.
            isMobile &&
              'top-auto bottom-0 left-0 right-0 max-w-none translate-x-0 translate-y-0 rounded-t-xl rounded-b-none sm:left-1/2 sm:right-auto sm:max-w-md sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-lg',
          )}
        >
          {/* Visually-hidden accessible title/desc — Radix Dialog requires them. */}
          <DialogHeader className="sr-only">
            <DialogTitle>{tr(currentStep.titleKey)}</DialogTitle>
            <DialogDescription>{tr(currentStep.bodyKey)}</DialogDescription>
          </DialogHeader>
          {card}
        </DialogContent>
      </Dialog>
    )
  }

  // === Popover mode (desktop, target resolved) ===
  const r = rect
  const side: 'top' | 'bottom' | 'left' | 'right' =
    currentStep.placement === 'top'
      ? 'top'
      : currentStep.placement === 'left'
        ? 'left'
        : currentStep.placement === 'right'
          ? 'right'
          : 'bottom'

  return (
    <>
      {/* Semi-transparent overlay with a spotlight cut-out around the target.
          Four panes (top / bottom / left / right) leave the target visible. */}
      <div
        className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[1px]"
        aria-hidden
      >
        {/* Top pane */}
        <div
          className="absolute left-0 right-0 top-0 bg-black/55"
          style={{ height: Math.max(0, r.top) }}
        />
        {/* Bottom pane */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-black/55"
          style={{ top: r.top + r.height }}
        />
        {/* Left pane */}
        <div
          className="absolute bg-black/55"
          style={{
            top: r.top,
            left: 0,
            width: Math.max(0, r.left),
            height: r.height,
          }}
        />
        {/* Right pane */}
        <div
          className="absolute bg-black/55"
          style={{
            top: r.top,
            left: r.left + r.width,
            right: 0,
            height: r.height,
          }}
        />
      </div>

      {/* Highlight ring around the target */}
      <div
        aria-hidden
        className="pointer-events-none fixed z-40 rounded-md ring-2 ring-primary ring-offset-2 ring-offset-background transition-all"
        style={{
          top: r.top - 3,
          left: r.left - 3,
          width: r.width + 6,
          height: r.height + 6,
        }}
      />

      <Popover open={visible} onOpenChange={(o) => { if (!o) skip() }}>
        {/* Virtual anchor positioned over the target rect so PopoverContent
            aligns to the highlighted element. */}
        <PopoverAnchor
          asChild
          // aria-hidden — anchor is purely a positioning affordance.
        >
          <span
            aria-hidden
            style={{
              position: 'fixed',
              top: r.top,
              left: r.left,
              width: r.width,
              height: r.height,
              pointerEvents: 'none',
            }}
          />
        </PopoverAnchor>
        <PopoverContent
          side={side}
          align="center"
          sideOffset={12}
          collisionPadding={16}
          avoidCollisions
          onOpenAutoFocus={(e) => {
            e.preventDefault()
            nextRef.current?.focus()
          }}
          onEscapeKeyDown={(e) => {
            e.preventDefault()
            skip()
          }}
          onInteractOutside={(e) => {
            // Don't dismiss on outside click — explicit Skip/Next only.
            e.preventDefault()
          }}
          className="w-80 max-w-[calc(100vw-2rem)] gap-0 p-4"
          data-testid="tour-popover"
        >
          {/* Radix Popover.Content does not require a Title/Description like
              Dialog does, but we add visually-hidden labels for screen readers
              so the popover is announced coherently. */}
          <div className="sr-only" role="heading" aria-level={2}>
            {tr(currentStep.titleKey)}
          </div>
          {card}
        </PopoverContent>
      </Popover>
    </>
  )
}

/**
 * Convenience helper: returns true if the user has already completed the tour.
 * Safe to call from client components after mount.
 */
export function hasCompletedTour(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return localStorage.getItem(PYARCANA_TOUR_STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

/**
 * Convenience helper: marks the tour as completed (without showing it).
 * Useful when the user explicitly dismisses the prompt.
 */
export function markTourCompleted(): void {
  try {
    localStorage.setItem(PYARCANA_TOUR_STORAGE_KEY, '1')
  } catch {
    // ignore
  }
}

/**
 * Convenience helper: clears the tour completion flag (used by "Repeat tour").
 */
export function resetTourCompletion(): void {
  try {
    localStorage.removeItem(PYARCANA_TOUR_STORAGE_KEY)
  } catch {
    // ignore
  }
}
