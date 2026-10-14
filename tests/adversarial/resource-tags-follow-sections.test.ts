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
import { readBindings } from '../../scripts/course_bindings.mjs'

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

/**
 * A resource a section teaches. The section is named by its slug, so the check follows it through a
 * renumber; `evidence` is what the section's own text says about the resource's topic.
 */
export interface Teaching {
  readonly resource: string
  readonly section: string
  readonly evidence: RegExp
  readonly atLeast: number
}

/**
 * One line per teaching that does not hold. A tag can be consistent with its number and still put a
 * resource on a page that never teaches it (the pandas docs on the text section), which tagMismatches
 * cannot see. These checks read the section's text.
 */
export function teachingFailures(
  resources: ReadonlyArray<{ readonly id: string; readonly sectionIds: readonly string[] }>,
  teachings: readonly Teaching[],
  sectionOf: (slug: string) => { stem: string; text: string } | undefined,
): string[] {
  return teachings.flatMap((t) => {
    const resource = resources.find((r) => r.id === t.resource)
    const section = sectionOf(t.section)
    if (!resource) return [`${t.resource}: no such resource`]
    if (!section) return [`${t.resource}: no section has the slug ${t.section}`]
    if (!resource.sectionIds.includes(section.stem)) return [`${t.resource}: not tagged ${section.stem}`]
    const hits = (section.text.match(t.evidence) ?? []).length
    return hits >= t.atLeast ? [] : [`${t.resource}: ${section.stem} names its topic ${hits} times, needs ${t.atLeast}`]
  })
}

/**
 * The six resources G-6 re-homed from inactive legacy files, and the section that teaches each one's
 * topic, checked by reading the section (owner decision O25 asked for this check). The floors sit well
 * below what each section says; they catch a section that does not teach the topic at all.
 * - pandas-docs, kaggle-learn: the pandas section ("Pandas: ingesta, selección y tipos").
 * - matplotlib-tutorials, matplotlib-cheatsheets: the visualization section; it is the only active
 *   section that writes matplotlib code. seaborn-datasets: the same section, where seaborn is named
 *   as the optional styling layer, so its floor is low.
 * - opentelemetry-docs: the observability-in-concurrency section (logs, metrics, traces, correlation)
 *   and the observability section of the final level, whose own resource list cites this URL.
 */
export const REHOMED: readonly Teaching[] = [
  { resource: 'pandas-docs', section: 'stdlib-deep', evidence: /pandas|DataFrame/gi, atLeast: 50 },
  { resource: 'kaggle-learn', section: 'stdlib-deep', evidence: /pandas|DataFrame/gi, atLeast: 50 },
  { resource: 'matplotlib-tutorials', section: 'databases-orm', evidence: /matplotlib|plt\./gi, atLeast: 30 },
  { resource: 'matplotlib-cheatsheets', section: 'databases-orm', evidence: /matplotlib|plt\./gi, atLeast: 30 },
  { resource: 'seaborn-datasets', section: 'databases-orm', evidence: /seaborn|sns\./gi, atLeast: 3 },
  { resource: 'opentelemetry-docs', section: 'performance-extreme', evidence: /opentelemetry|spans?\b/gi, atLeast: 5 },
  { resource: 'opentelemetry-docs', section: 'integrator-final', evidence: /opentelemetry|trace_id|spans?\b/gi, atLeast: 20 },
]

function realSection(slug: string): { stem: string; text: string } | undefined {
  const bound = readBindings(ROOT).find((b) => b.id === slug)
  return bound ? { stem: bound.stem, text: fs.readFileSync(path.join(ROOT, 'src/lib/course/sections', `${bound.stem}.ts`), 'utf-8') } : undefined
}

describe('a re-homed resource sits on a section that teaches its topic (O25)', () => {
  it('each of the six resources G-6 moved is tagged on a section whose text teaches it', () => {
    assert.deepEqual(teachingFailures(RESOURCES, REHOMED, realSection), [])
  })

  it('every teaching names a resource and a section that exist: the check cannot pass on nothing', () => {
    assert.equal(new Set(REHOMED.map((t) => t.resource)).size, 6, 'the six re-homed resources')
    for (const t of REHOMED) {
      assert.ok(RESOURCES.some((r) => r.id === t.resource), `${t.resource} is not in the catalogue`)
      assert.ok(realSection(t.section), `no section has the slug ${t.section}`)
    }
  })

  it('a tag consistent with its number but on a section that never teaches the topic is named', () => {
    // s07-text-unicode-regex is the real stem at number 7, so tagMismatches passes it; the text does not.
    const resources = [{ id: 'pandas-docs', sectionIds: ['s07-text-unicode-regex'] }]
    const teaching: Teaching = { resource: 'pandas-docs', section: 'stdlib-deep', evidence: /pandas/gi, atLeast: 1 }
    assert.deepEqual(teachingFailures(resources, [teaching], realSection), ['pandas-docs: not tagged s15-stdlib-deep'])
    // The same tag claimed as the teaching: the section's text has no pandas in it.
    const misplaced: Teaching = { resource: 'pandas-docs', section: 'text-unicode-regex', evidence: /pandas|DataFrame/gi, atLeast: 1 }
    assert.deepEqual(teachingFailures(resources, [misplaced], realSection), [
      'pandas-docs: s07-text-unicode-regex names its topic 0 times, needs 1',
    ])
  })

  it('a missing resource or section is named, not skipped', () => {
    const t: Teaching = { resource: 'ghost', section: 'stdlib-deep', evidence: /x/g, atLeast: 1 }
    assert.deepEqual(teachingFailures([], [t], realSection), ['ghost: no such resource'])
    const u: Teaching = { resource: 'docs', section: 'no-such-slug', evidence: /x/g, atLeast: 1 }
    assert.deepEqual(teachingFailures([{ id: 'docs', sectionIds: [] }], [u], realSection), ['docs: no section has the slug no-such-slug'])
  })

  it('the check follows a renumber: it finds the section by slug, wherever its number is now', () => {
    const resources = [{ id: 'orm-docs', sectionIds: ['s21-databases-orm'] }]
    const t: Teaching = { resource: 'orm-docs', section: 'databases-orm', evidence: /sqlalchemy/gi, atLeast: 2 }
    const moved = (slug: string) => (slug === 'databases-orm' ? { stem: 's21-databases-orm', text: 'SQLAlchemy y sqlalchemy' } : undefined)
    assert.deepEqual(teachingFailures(resources, [t], moved), [])
  })
})
