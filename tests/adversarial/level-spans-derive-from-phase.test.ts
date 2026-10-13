/**
 * G-8: each level's section span is the first and last section of its phase, read from the course.
 *
 * The span strings ('S14–S26' and so on) were typed into LEVELS. A renumber inserts sections, so
 * a typed span keeps the old numbers while the lessons move. The span is now derived.
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { LEVELS } from '../../src/lib/capstones/catalog.ts'
import { COURSE_SECTIONS } from '../../src/lib/course/index.ts'

/**
 * The span a phase covers, e.g. 'S14–S26': its first and last section by index. The guard lives
 * here, not in catalog.ts: the catalogue is reachable from cloud code, and the course chunk must
 * not be (src/lib/cloud/__tests__/import-boundary.test.ts). So the catalogue keeps typed spans and
 * this test holds each one to the course.
 */
export function phaseSpan(
  phase: 0 | 1 | 2 | 3,
  sections: ReadonlyArray<{ readonly index: number; readonly phase?: 0 | 1 | 2 | 3 }> = COURSE_SECTIONS,
): string {
  const indices = sections.filter((s) => s.phase === phase).map((s) => s.index)
  if (indices.length === 0) throw new Error(`no section in phase ${phase}`)
  const label = (n: number) => `S${String(n).padStart(2, '0')}`
  return `${label(Math.min(...indices))}–${label(Math.max(...indices))}`
}

describe('level spans match the course phases (design G-8)', () => {
  it('every level shows the span of the course sections in its phase', () => {
    for (const level of LEVELS) {
      assert.equal(level.sections, phaseSpan((level.id - 1) as 0 | 1 | 2 | 3), level.stableId)
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
