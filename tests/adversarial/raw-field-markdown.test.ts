/**
 * A field the course pages interpolate raw must not contain markdown.
 *
 * `InlineText` was added when a crawl found 721 literal backticks and asterisks on the live
 * site, and the fields it was applied to stopped leaking. Two were missed: `jobRelevance` and
 * `learningOutcomes[].text` were still written as `{section.jobRelevance}` and `{lo.text}`, so
 * 32 outcomes across 17 sections rendered "(`isna` + mapa de campos)" with the backticks
 * showing. The browser gate walked the learning tabs only, and both of these sit behind a
 * popover and a sheet, so nothing saw them.
 *
 * Then this test repeated the same mistake one level up. It read `SectionView.tsx` and nothing
 * else, so it certified `tagline` as safe while `Dashboard.tsx` and `Sidebar.tsx` interpolated
 * the very same field raw — on the 52 dashboard cards, the "continue where you left off" card
 * and every sidebar row, which is the first thing a learner sees. Four taglines (S01-S04)
 * carry backticks, so "reglas `accept`/`reject`/`review`" was rendering with the backticks
 * showing on the busiest surface in the site while this file reported green.
 *
 * So it no longer names the file it reads. It finds every component that is handed real course
 * sections, and holds the contract there: whatever is rendered raw has to be plain text in
 * every section. Route a field through `InlineText` and its markdown is fine again; revert
 * that, or render the field on a new surface without it, and this fails with the sections that
 * leak. It still asserts nothing about which components use `InlineText` — that would only
 * restate the source.
 */
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

import { COURSE_SECTIONS } from '../../src/lib/course'

const MARKDOWN = /`[^`\n]{1,80}`|\*\*[^*\n]{1,80}\*\*/

function tsxFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name)
    if (e.isDirectory()) return tsxFiles(p)
    return e.isFile() && p.endsWith('.tsx') ? [p] : []
  })
}

/**
 * The components handed real `CourseSection`s, and so the ones whose raw interpolations are
 * about the sections below.
 *
 * The filter is what keeps the field patterns honest: `PricingPage.tsx` renders
 * `{plan.tagline}` for a pricing plan, an unrelated object, and matching it against course
 * taglines would fail this file for a string no learner sees on a section surface.
 */
const COMPONENTS = ['src/app', 'src/components/course']
  .flatMap(tsxFiles)
  .filter((f) => /\bCourseSection\b|\bCOURSE_SECTIONS\b/.test(readFileSync(f, 'utf8')))
  .sort()

/**
 * Each field, how a component interpolates it raw, and its value per section.
 *
 * The receiver is `\w+` rather than a fixed name because the same field arrives as `section`,
 * `nextSection` or `s` depending on the surface, and pinning one name is how the dashboard
 * went unchecked.
 *
 * The lookbehind is load-bearing: `text={section.tagline}` passed to InlineText contains the
 * raw form as a substring, so without it every field reads as raw and all of these fail even
 * on a page that renders correctly.
 */
const FIELDS: { name: string; raw: RegExp; values: () => { where: string; text: string }[] }[] = [
  {
    name: 'jobRelevance',
    raw: /(?<!text=)\{\w+\.jobRelevance\}/,
    values: () => COURSE_SECTIONS.map((s) => ({ where: `S${s.index} jobRelevance`, text: s.jobRelevance })),
  },
  {
    name: 'learningOutcomes[].text',
    raw: /(?<!text=)\{\w+\.text\}/,
    values: () =>
      COURSE_SECTIONS.flatMap((s) =>
        s.learningOutcomes.map((lo, i) => ({ where: `S${s.index} learningOutcomes[${i}]`, text: lo.text })),
      ),
  },
  {
    name: 'tagline',
    raw: /(?<!text=)\{\w+\.tagline\}/,
    values: () => COURSE_SECTIONS.map((s) => ({ where: `S${s.index} tagline`, text: s.tagline })),
  },
  {
    /**
     * `shortTitle` has never carried markdown, and this keeps it that way. It is the one field
     * here that cannot be fixed by wrapping it: two of its surfaces are `<option>` labels in
     * the feedback and resources pickers, and an `<option>` renders text and nothing else. If
     * this fails, the repair is in the section data, not in a component.
     */
    name: 'shortTitle',
    raw: /(?<!text=)\{\w+\.shortTitle\}/,
    values: () => COURSE_SECTIONS.map((s) => ({ where: `S${s.index} shortTitle`, text: s.shortTitle })),
  },
]

test('the scan covers the components that render sections', () => {
  // A rename or a move that empties this list would turn every test below into a pass.
  assert.ok(COMPONENTS.length >= 5, `only found ${COMPONENTS.length} course components to read`)
  for (const expected of [
    'src/components/course/Dashboard.tsx',
    'src/components/course/SectionView.tsx',
    'src/components/course/Sidebar.tsx',
  ]) {
    assert.ok(COMPONENTS.includes(expected), `${expected} must be among the scanned components`)
  }
})

for (const field of FIELDS) {
  test(`${field.name}: rendered raw means no markdown in it`, () => {
    const rawIn = COMPONENTS.filter((f) => field.raw.test(readFileSync(f, 'utf8')))
    if (rawIn.length === 0) return // every surface routes it through InlineText
    const leaks = field
      .values()
      .filter((v) => MARKDOWN.test(v.text))
      .map((v) => `${v.where}: ${v.text.slice(0, 90)}`)
    assert.deepEqual(
      leaks,
      [],
      `${field.name} is interpolated raw in ${rawIn.join(', ')}, so a learner reads these backticks`,
    )
  })
}
