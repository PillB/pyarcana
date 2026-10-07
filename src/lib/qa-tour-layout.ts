/**
 * Where the QA tutorial's panel goes so it never covers the control it is talking about.
 *
 * Root cause of the owner's report (5 Oct 2026, "the highlighted element is sometimes behind the
 * tour box"): the panel was always centred in the workspace, and the highlighted control was
 * scrolled to the centre of its scroll area (`scrollIntoView({ block: 'center' })`), which is the
 * same place. The fix places the panel on the side of the control with more room, as tour libraries
 * do (a popover beside its anchor, not over it), and asks the caller to scroll the control to the
 * top first when neither side has room for a usable panel.
 *
 * Coordinates are relative to the tutorial's overlay (the workspace's box), in CSS pixels.
 */

export interface TourBox {
  top: number
  bottom: number
  left: number
  right: number
}

/** Space between the control and the panel. */
export const TOUR_GAP = 12
/** Space between the panel and the workspace's edge. */
export const TOUR_MARGIN = 12
/** Below this height a panel is too cramped to read and answer in. */
export const TOUR_MIN_PANEL = 220

export type TourPlacement =
  | { kind: 'center' }
  | { kind: 'below'; top: number; maxHeight: number }
  | { kind: 'above'; bottom: number; maxHeight: number }

/**
 * The panel's place for a control at `target` in an overlay `height` pixels tall. `fits` is false
 * when neither side has TOUR_MIN_PANEL pixels: scroll the control to the top and ask again. The
 * placement returned is still the best available, so a caller that cannot scroll never covers it.
 */
export function placeTourPanel(height: number, target: TourBox | null): { placement: TourPlacement; fits: boolean } {
  if (!target) return { placement: { kind: 'center' }, fits: true }
  const below = height - target.bottom - TOUR_GAP - TOUR_MARGIN
  const above = target.top - TOUR_GAP - TOUR_MARGIN
  const fits = Math.max(below, above) >= TOUR_MIN_PANEL
  if (below >= above) {
    return { placement: { kind: 'below', top: target.bottom + TOUR_GAP, maxHeight: Math.max(0, below) }, fits }
  }
  return { placement: { kind: 'above', bottom: height - target.top + TOUR_GAP, maxHeight: Math.max(0, above) }, fits }
}

/**
 * Text with **bold** spans, as the tutorial's copy writes them, split into plain and bold parts.
 * The copy used `**…**` from the start but it was printed as is, asterisks included.
 */
export function boldParts(text: string): Array<{ text: string; bold: boolean }> {
  const parts: Array<{ text: string; bold: boolean }> = []
  const re = /\*\*([^*]+)\*\*/g
  let last = 0
  for (const m of text.matchAll(re)) {
    if (m.index > last) parts.push({ text: text.slice(last, m.index), bold: false })
    parts.push({ text: m[1], bold: true })
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push({ text: text.slice(last), bold: false })
  return parts
}
