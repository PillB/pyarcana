/**
 * A field the section page interpolates raw must not contain markdown.
 *
 * `InlineText` was added when a crawl found 721 literal backticks and asterisks on the live
 * site, and the fields it was applied to stopped leaking. Two were missed: `jobRelevance` and
 * `learningOutcomes[].text` were still written as `{section.jobRelevance}` and `{lo.text}`, so
 * 32 outcomes across 17 sections rendered "(`isna` + mapa de campos)" with the backticks
 * showing. The browser gate walked the learning tabs only, and both of these sit behind a
 * popover and a sheet, so nothing saw them.
 *
 * This test does not assert that any particular field uses `InlineText` — that would only
 * restate the source. It reads SectionView to find which of these fields are still
 * interpolated raw, and holds the real contract: whatever is rendered raw has to be plain
 * text in every section. Route a field through `InlineText` and its markdown is fine again;
 * revert that and this fails with the sections that leak.
 */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { COURSE_SECTIONS } from '../../src/lib/course'

const VIEW = readFileSync('src/components/course/SectionView.tsx', 'utf8')
const MARKDOWN = /`[^`\n]{1,80}`|\*\*[^*\n]{1,80}\*\*/

/**
 * Each field, how SectionView interpolates it raw, and its value per section.
 *
 * The lookbehind is load-bearing: `text={section.tagline}` passed to InlineText contains the
 * raw form as a substring, so without it every field reads as raw and all three tests fail
 * even on a page that renders correctly.
 */
const FIELDS: { name: string; raw: RegExp; values: () => { where: string; text: string }[] }[] = [
  {
    name: 'jobRelevance',
    raw: /(?<!text=)\{section\.jobRelevance\}/,
    values: () => COURSE_SECTIONS.map((s) => ({ where: `S${s.index} jobRelevance`, text: s.jobRelevance })),
  },
  {
    name: 'learningOutcomes[].text',
    raw: /(?<!text=)\{lo\.text\}/,
    values: () =>
      COURSE_SECTIONS.flatMap((s) =>
        s.learningOutcomes.map((lo, i) => ({ where: `S${s.index} learningOutcomes[${i}]`, text: lo.text })),
      ),
  },
  {
    name: 'tagline',
    raw: /(?<!text=)\{section\.tagline\}/,
    values: () => COURSE_SECTIONS.map((s) => ({ where: `S${s.index} tagline`, text: s.tagline })),
  },
]

for (const field of FIELDS) {
  test(`${field.name}: rendered raw means no markdown in it`, () => {
    if (!field.raw.test(VIEW)) return // routed through InlineText: markdown renders as code
    const leaks = field
      .values()
      .filter((v) => MARKDOWN.test(v.text))
      .map((v) => `${v.where}: ${v.text.slice(0, 90)}`)
    assert.deepEqual(
      leaks,
      [],
      `${field.name} is interpolated raw in SectionView, so a learner reads these backticks`,
    )
  })
}
