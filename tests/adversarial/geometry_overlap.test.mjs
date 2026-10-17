/**
 * Pure geometry overlap detector used by regression — unit-tested so we can
 * tighten skip rules without flaking CI on nested UI (tabs inside panels).
 *
 * The rule is imported from scripts/lib/text_overlaps.ts, the module the Playwright spec
 * runs. This file used to define its own copy, which had drifted to a depth gap of 2, a 2px
 * minimum overlap and an 8px² minimum area while the spec used 3, 3 and 24 - so these cases
 * checked rules CI never applied. The boundary cases below pin the real thresholds.
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { countTextOverlaps, OVERLAP_RULES } from '../../scripts/lib/text_overlaps.ts'

const count = (data) => countTextOverlaps(data).length

describe('geometry overlap detector', () => {
  it('ignores nested parent/child by containment', () => {
    const data = [
      { text: 'panel', x: 0, y: 0, w: 200, h: 200, depth: 3 },
      { text: 'title', x: 10, y: 10, w: 50, h: 20, depth: 4 },
    ]
    assert.equal(count(data), 0)
  })

  it('ignores depth-adjacent boxes, up to the depth gap', () => {
    const at = (gap) => [
      { text: 'A', x: 0, y: 0, w: 100, h: 40, depth: 5 },
      { text: 'B', x: 50, y: 10, w: 100, h: 40, depth: 5 + gap },
    ]
    assert.equal(OVERLAP_RULES.depthGap, 3)
    assert.equal(count(at(3)), 0, 'a gap of 3 is still nesting')
    assert.equal(count(at(4)), 1, 'a gap of 4 is a real overlap')
  })

  it('flags real peer overlaps with different depth families', () => {
    const data = [
      { text: 'left', x: 0, y: 0, w: 100, h: 40, depth: 3 },
      { text: 'overlay', x: 50, y: 10, w: 100, h: 40, depth: 10 },
    ]
    const [hit] = countTextOverlaps(data)
    assert.equal(count(data), 1)
    assert.equal(hit.area, 50 * 30)
  })

  it('skips sticky headers', () => {
    const data = [
      { text: 'nav', x: 0, y: 0, w: 800, h: 50, depth: 2, position: 'sticky' },
      { text: 'h1', x: 20, y: 20, w: 200, h: 40, depth: 8 },
    ]
    assert.equal(count(data), 0)
  })

  it('ignores intersection noise below the minimum area, and not at it', () => {
    const square = (side) => [
      { text: 'a', x: 0, y: 0, w: 10, h: 10, depth: 3 },
      { text: 'b', x: 10 - side, y: 10 - side, w: 10, h: 10, depth: 8 },
    ]
    assert.equal(OVERLAP_RULES.minArea, 24)
    assert.equal(count(square(4)), 0, '4x4 = 16 is below the 24 minimum')
    assert.equal(count(square(5)), 1, '5x5 = 25 is at or above it')
  })

  it('ignores a sliver thinner than the minimum on one axis', () => {
    const data = [
      { text: 'a', x: 0, y: 0, w: 100, h: 100, depth: 3 },
      { text: 'b', x: 98, y: 0, w: 100, h: 100, depth: 8 },
    ]
    assert.equal(count(data), 0, 'a 2px-wide overlap is a border touching, not text over text')
  })
})
