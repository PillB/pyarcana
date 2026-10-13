'use client'

import { useEffect, useState, type HTMLAttributes } from 'react'

/**
 * Make a horizontally scrolling box reachable from the keyboard, only while it actually scrolls.
 *
 * A code line wider than its column puts its tail behind a scrollbar that a keyboard user cannot
 * reach: axe `scrollable-region-focusable`, WCAG 2.1.1. Found by axe on /empezar (a long
 * `git config … user.email` command), but the cause is shared by every CodeBlock in the course.
 *
 * The fix follows Adrian Roselli, "Keyboard-Only Scrolling Areas": tabindex="0" so it takes focus,
 * plus role="region" and a name so a screen reader says what the stop is. It is applied only while
 * the content overflows, because a tab stop on every short code block is noise for the same
 * keyboard user it is meant to help.
 */
export function useScrollRegion<T extends HTMLElement>(
  what: string,
  title?: string,
): [attach: (el: T | null) => void, props: HTMLAttributes<T>] {
  // `attach` is a callback ref: the element lives in state, so the effect runs once it mounts.
  // It is not named "ref" because the React Compiler lint infers ref-ness from the name and would
  // then forbid spreading the returned object during render.
  const [el, setEl] = useState<T | null>(null)
  const [overflows, setOverflows] = useState(false)
  useEffect(() => {
    if (!el || typeof ResizeObserver === 'undefined') return
    const measure = () => setOverflows(el.scrollWidth > el.clientWidth + 1)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    if (el.firstElementChild) ro.observe(el.firstElementChild)
    return () => ro.disconnect()
  }, [el])
  const label = title ? `${what}: ${title}` : what
  const props: HTMLAttributes<T> = overflows ? { tabIndex: 0, role: 'region', 'aria-label': label } : {}
  return [setEl, props]
}
