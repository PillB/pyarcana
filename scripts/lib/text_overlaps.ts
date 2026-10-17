/**
 * Which visible text boxes overlap: the rule behind regression.spec.ts's "Geometric integrity".
 *
 * It lived inline in that Playwright test, so the unit test kept its own copy - and by
 * 2026-10-03 the copy had drifted: depth gap 2 against the spec's 3, a 2px minimum overlap
 * against 3, an 8px² minimum area against 24. The unit test passed against rules CI never
 * used. Both now import this.
 */
export interface TextBox {
  text: string
  x: number
  y: number
  w: number
  h: number
  depth: number
  position?: string
  tag?: string
}

export interface Overlap<T extends TextBox = TextBox> {
  a: T
  b: T
  area: number
}

/** Nested UI often differs by a few depth levels; overlaps smaller than this are noise. */
export const OVERLAP_RULES = { depthGap: 3, minAxis: 3, minArea: 24 }

function contains(a: TextBox, b: TextBox): boolean {
  return a.x <= b.x && a.x + a.w >= b.x + b.w && a.y <= b.y && a.y + a.h >= b.y + b.h
}

function pinned(box: TextBox): boolean {
  return box.position === 'fixed' || box.position === 'sticky'
}

/** Every pair of boxes that overlap visibly - same text, containment, depth-adjacent and
 * fixed or sticky chrome excluded. The spec already drops fixed and sticky boxes when it
 * collects them; the check is repeated here so the rule is whole wherever it is used. */
export function countTextOverlaps<T extends TextBox>(data: T[], rules = OVERLAP_RULES): Overlap<T>[] {
  const overlaps: Overlap<T>[] = []
  for (let i = 0; i < data.length; i++) {
    for (let j = i + 1; j < data.length; j++) {
      const a = data[i]
      const b = data[j]
      if (a.text === b.text || contains(a, b) || contains(b, a) || pinned(a) || pinned(b)) continue
      if (Math.abs(a.depth - b.depth) <= rules.depthGap) continue
      const ix = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x))
      const iy = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y))
      if (ix >= rules.minAxis && iy >= rules.minAxis && ix * iy >= rules.minArea) {
        overlaps.push({ a, b, area: ix * iy })
      }
    }
  }
  return overlaps
}
