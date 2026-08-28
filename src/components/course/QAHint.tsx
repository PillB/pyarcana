'use client'

import { useCallback, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

/**
 * One short explanation per control, delivered the way the pointer allows.
 *
 * The obvious implementation is `title="..."`, and it is the wrong one. A
 * `title` is not announced consistently by screen readers, most browsers never
 * show it to a keyboard user, its delay cannot be controlled, it cannot be
 * dismissed, and on a touchscreen it does not exist at all. WCAG 2.2 SC 1.4.13
 * asks that content shown on hover be hoverable, dismissible and persistent;
 * `title` is none of the three.
 *
 * A tooltip alone is also not enough. Radix opens on hover and focus, which
 * covers mouse and keyboard and leaves every phone and tablet with no way to
 * read the hint -- the pointer never hovers.
 *
 * So the delivery follows the pointer:
 *
 *   fine pointer (mouse, trackpad)  hover, and focus for keyboard
 *   coarse pointer (touch)          tap opens the hint as a popover
 *
 * On touch the control's own click still runs. Swallowing the first tap to show
 * a hint would turn every button into a two-tap control, which trades a small
 * discoverability win for a cost paid on every single use.
 */

/** Does this pointer hover? Read as an external snapshot, not through an effect. */
const HOVER_QUERY = '(hover: hover) and (pointer: fine)'

function subscribeHover(onChange: () => void) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {}
  const mq = window.matchMedia(HOVER_QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

function hoverSnapshot() {
  if (typeof window === 'undefined' || !window.matchMedia) return true
  return window.matchMedia(HOVER_QUERY).matches
}

/**
 * The server cannot know the pointer, and guessing wrong costs different
 * amounts in each direction: assume hover and a touch user gets markup that
 * never opens; assume touch and a mouse user gets a popover that steals the
 * first click. Hover is the safe server answer because the client corrects it
 * before any interaction, and `useSyncExternalStore` allows the two snapshots
 * to differ without a hydration error.
 */
function hoverServerSnapshot() {
  return true
}

export function QAHint({
  label,
  children,
  side = 'top',
}: {
  /** One sentence. What this control does, and when you would want it. */
  label: string
  children: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
}) {
  const canHover = useSyncExternalStore(subscribeHover, hoverSnapshot, hoverServerSnapshot)
  const [open, setOpen] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Auto-dismiss on touch. A popover opened by a tap that also performed an
  // action has no natural close moment, and leaving it up covers the thing the
  // person just changed.
  const openBriefly = useCallback(() => {
    setOpen(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setOpen(false), 3200)
  }, [])

  if (canHover) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} sideOffset={6} className="max-w-[16rem] leading-snug">
          {label}
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* The trigger does not swallow the tap: Radix's own handler runs and the
          child's onClick runs with it, so one tap both acts and explains. */}
      <PopoverTrigger asChild onClick={openBriefly}>
        {children}
      </PopoverTrigger>
      <PopoverContent
        side={side}
        sideOffset={6}
        // Focus stays on the control that was tapped. Moving it into the bubble
        // would leave a screen-reader user somewhere they did not ask to be.
        onOpenAutoFocus={(event) => event.preventDefault()}
        className="w-auto max-w-[16rem] px-3 py-2 text-xs leading-snug"
      >
        {label}
      </PopoverContent>
    </Popover>
  )
}
