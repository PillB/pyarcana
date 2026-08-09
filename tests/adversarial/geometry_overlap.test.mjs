/**
 * Pure geometry overlap detector used by regression — unit-tested so we can
 * tighten skip rules without flaking CI on nested UI (tabs inside panels).
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

/**
 * Same algorithm as scripts/regression.spec.ts Geometric integrity,
 * with refined skips for sticky chrome and tiny area noise.
 */
export function countTextOverlaps(data, opts = {}) {
  const minIx = opts.minIx ?? 2
  const minIy = opts.minIy ?? 2
  const minArea = opts.minArea ?? 8
  let overlapCount = 0
  const overlaps = []
  for (let i = 0; i < data.length; i++) {
    for (let j = i + 1; j < data.length; j++) {
      const a = data[i]
      const b = data[j]
      if (a.text === b.text) continue
      // full containment
      if (a.x <= b.x && a.x + a.w >= b.x + b.w && a.y <= b.y && a.y + a.h >= b.y + b.h) continue
      if (b.x <= a.x && b.x + b.w >= a.x + a.w && b.y <= a.y && b.y + b.h >= a.y + a.h) continue
      // ancestor/descendant by depth
      if (Math.abs(a.depth - b.depth) <= 2) continue
      // sticky/fixed chrome vs content (false positives in header)
      if (a.position === 'fixed' || a.position === 'sticky') continue
      if (b.position === 'fixed' || b.position === 'sticky') continue
      const ix = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x))
      const iy = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y))
      const area = ix * iy
      if (ix >= minIx && iy >= minIy && area >= minArea) {
        overlapCount++
        overlaps.push({ a: a.text, b: b.text, area })
      }
    }
  }
  return { overlapCount, overlaps }
}

describe('geometry overlap detector', () => {
  it('ignores nested parent/child by containment', () => {
    const data = [
      { text: 'panel', x: 0, y: 0, w: 200, h: 200, depth: 3 },
      { text: 'title', x: 10, y: 10, w: 50, h: 20, depth: 4 },
    ]
    assert.equal(countTextOverlaps(data).overlapCount, 0)
  })

  it('ignores depth-adjacent siblings (depth diff <= 2)', () => {
    const data = [
      { text: 'A', x: 0, y: 0, w: 100, h: 40, depth: 5 },
      { text: 'B', x: 50, y: 10, w: 100, h: 40, depth: 6 },
    ]
    assert.equal(countTextOverlaps(data).overlapCount, 0)
  })

  it('flags real peer overlaps with different depth families', () => {
    const data = [
      { text: 'left', x: 0, y: 0, w: 100, h: 40, depth: 3 },
      { text: 'overlay', x: 50, y: 10, w: 100, h: 40, depth: 10 },
    ]
    const r = countTextOverlaps(data)
    assert.equal(r.overlapCount, 1)
  })

  it('skips sticky headers', () => {
    const data = [
      { text: 'nav', x: 0, y: 0, w: 800, h: 50, depth: 2, position: 'sticky' },
      { text: 'h1', x: 20, y: 20, w: 200, h: 40, depth: 8 },
    ]
    assert.equal(countTextOverlaps(data).overlapCount, 0)
  })

  it('ignores tiny intersection noise', () => {
    const data = [
      { text: 'a', x: 0, y: 0, w: 10, h: 10, depth: 3 },
      { text: 'b', x: 9, y: 9, w: 10, h: 10, depth: 8 },
    ]
    // 1x1 area < minArea 8
    assert.equal(countTextOverlaps(data).overlapCount, 0)
  })
})
