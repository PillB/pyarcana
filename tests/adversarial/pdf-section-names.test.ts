/**
 * G-5: the number in each PDF section label is the section's index, derived at load time.
 *
 * PdfReport.tsx used to hand-type "NN. Label" for all 52 sections. A renumber moves each
 * section's index, and a typed number moves only if someone remembers it. Labels now carry the
 * name alone, and the number comes from the course binding.
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { SECTION_NAMES, sectionNamesFor } from '../../src/components/course/PdfReport.tsx'
import { COURSE_SECTIONS } from '../../src/lib/course/index.ts'

describe('PDF section labels take their number from the section (design G-5)', () => {
  it('every label on the real course begins with the index of the section it names', () => {
    for (const s of COURSE_SECTIONS) {
      assert.match(SECTION_NAMES[s.id] ?? '', new RegExp(`^${s.index}\\. `), s.id)
    }
  })

  it('the labels cover exactly the course sections, in course order', () => {
    assert.deepEqual(Object.keys(SECTION_NAMES), COURSE_SECTIONS.map((s) => s.id))
  })

  it('a renumbered section takes its new number from its index, not from the label', () => {
    // Two sections bound at 19 and 20 after an insertion: the labels carry no number of their own.
    const names = sectionNamesFor(
      [
        { id: 'alpha', index: 19 },
        { id: 'beta', index: 20 },
      ],
      { alpha: 'Alfa', beta: 'Beta' },
    )
    assert.deepEqual(names, { alpha: '19. Alfa', beta: '20. Beta' })
  })

  it('a section with no label fails closed instead of printing "undefined"', () => {
    assert.throws(() => sectionNamesFor([{ id: 'gamma', index: 21 }], {}), /gamma/)
  })
})
