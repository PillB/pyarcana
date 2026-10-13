/**
 * G-8: each level's section span is the first and last section of its phase, read from the course.
 *
 * The span strings ('S14–S26' and so on) were typed into LEVELS. A renumber inserts sections, so
 * a typed span keeps the old numbers while the lessons move. The span is now derived.
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { LEVELS, phaseSpan } from '../../src/lib/capstones/catalog.ts'
import { COURSE_SECTIONS } from '../../src/lib/course/index.ts'

describe('level spans come from the course phases (design G-8)', () => {
  it('every level shows the span of the course sections in its phase', () => {
    for (const level of LEVELS) {
      const phase = level.id - 1
      const indices = COURSE_SECTIONS.filter((s) => s.phase === phase).map((s) => s.index)
      const first = Math.min(...indices)
      const last = Math.max(...indices)
      const pad = (n: number) => `S${String(n).padStart(2, '0')}`
      assert.equal(level.sections, `${pad(first)}–${pad(last)}`, level.stableId)
    }
  })

  it('a renumber that adds sections to a phase moves its span with the bindings', () => {
    // Phase 1 grows from 14–26 to 14–28 when two sections are inserted before phase 2. The typed
    // span 'S14–S26' would be stale; the derived span follows the course.
    const renumbered = [
      { index: 14, phase: 1 as const },
      { index: 26, phase: 1 as const },
      { index: 27, phase: 1 as const },
      { index: 28, phase: 1 as const },
      { index: 29, phase: 2 as const },
    ]
    assert.equal(phaseSpan(1, renumbered), 'S14–S28')
  })

  it('a phase with no sections fails closed rather than printing an empty span', () => {
    assert.throws(() => phaseSpan(3, []), /phase 3/)
  })
})
