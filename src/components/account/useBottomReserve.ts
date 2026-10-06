'use client'

import { useEffect, type RefObject } from 'react'
import { bottomReserve } from './a11y'

/** Heights of the fixed bottom cards open right now, by id. */
const open = new Map<string, number>()

function apply(): void {
  document.documentElement.style.scrollPaddingBottom = bottomReserve([...open.values()])
}

/**
 * While a fixed bottom card is shown, keep that much room at the bottom of the page for the
 * keyboard focus (scroll-padding-bottom), so scrolling a focused element into view never leaves
 * it under the card (WCAG 2.4.11). Several cards: the tallest one counts.
 */
export function useBottomReserve(id: string, ref: RefObject<HTMLElement | null>, shown: boolean): void {
  useEffect(() => {
    const el = ref.current
    if (!shown || !el) return
    const measure = () => {
      open.set(id, el.getBoundingClientRect().height)
      apply()
    }
    measure()
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure)
    observer?.observe(el)
    return () => {
      observer?.disconnect()
      open.delete(id)
      apply()
    }
  }, [id, ref, shown])
}
