/**
 * G-6: every resource tag is the file stem of the section bound at the tag's number.
 *
 * A tag such as 's15-stdlib-deep' names its section by number (read by sectionIndexOfTag) and by
 * slug. The number is what filters a resource onto a section, so a tag whose slug belongs to a
 * different section, or to an inactive legacy file, puts the resource on the wrong page. A renumber
 * moves each section's number, so the tags must move with it, and this guard names any that did not.
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { RESOURCES, sectionIndexOfTag } from '../../src/components/course/ResourcesPage.tsx'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

/** The file stem each active section is bound to, keyed by its number. */
function boundStems(root: string): Map<number, string> {
  const index = fs.readFileSync(path.join(root, 'src/lib/course/index.ts'), 'utf-8')
  const stems = new Map<number, string>()
  for (const m of index.matchAll(/import \{ section(\d+) \} from '\.\/sections\/([^']+)'/g)) {
    stems.set(Number(m[1]), m[2]!)
  }
  return stems
}

/** One line per resource tag that does not name the section bound at its number. */
export function tagMismatches(
  resources: ReadonlyArray<{ readonly id: string; readonly sectionIds: readonly string[] }>,
  stemOf: (index: number) => string | undefined,
): string[] {
  return resources.flatMap((r) =>
    r.sectionIds
      .filter((tag) => {
        const index = sectionIndexOfTag(tag)
        return index === null || stemOf(index) !== tag
      })
      .map((tag) => `${r.id}: ${tag}`),
  )
}

const STEMS = boundStems(ROOT)

describe('resource tags name the section bound at their number (design G-6)', () => {
  it('every tag on the real catalogue is the file stem of the section at its number', () => {
    assert.deepEqual(tagMismatches(RESOURCES, (n) => STEMS.get(n)), [])
  })

  it('a tag whose slug belongs to a different section is named', () => {
    // s07-pandas: section 7 is text-unicode-regex; the pandas section is 15.
    const resources = [{ id: 'docs', sectionIds: ['s07-pandas'] }]
    assert.deepEqual(tagMismatches(resources, (n) => STEMS.get(n)), ['docs: s07-pandas'])
  })

  it('a tag left at the old number after a renumber is named', () => {
    // Fixture: the databases section moved from 19 to 21 with its file; the tag stayed at s19.
    const stems = new Map([[21, 's21-databases-orm']])
    const resources = [{ id: 'orm', sectionIds: ['s19-databases-orm'] }]
    assert.deepEqual(tagMismatches(resources, (n) => stems.get(n)), ['orm: s19-databases-orm'])
  })

  it('a tag that names no section number is named, not skipped', () => {
    const resources = [{ id: 'bad', sectionIds: ['pandas'] }]
    assert.deepEqual(tagMismatches(resources, () => 'x'), ['bad: pandas'])
  })
})
