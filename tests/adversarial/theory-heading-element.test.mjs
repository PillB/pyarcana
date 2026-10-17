/**
 * A theory block's heading is a heading.
 *
 * TheoryTab joined `block.heading` onto the paragraphs and handed the lot to RichText, which
 * renders plain lines as paragraphs. Measured on the public site on 2026-09-26: S02's
 * «Literales y tipos básicos» was a <p> at 15px / weight 400, the same as the prose below it,
 * and the whole page had two <h3> elements. That was every theory heading in all 52 sections.
 * A learner could not see where a block began, and a screen reader had no heading to
 * navigate by (WCAG 1.3.1, Info and Relationships).
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const src = readFileSync(fileURLToPath(new URL('../../src/components/course/SectionView.tsx', import.meta.url)), 'utf8')
const theoryTab = src.slice(src.indexOf('function TheoryTab('), src.indexOf('\nfunction ', src.indexOf('function TheoryTab(') + 1))

test('the heading renders as an h3, not as the first line of the prose', () => {
  assert.ok(theoryTab.length > 0, 'TheoryTab not found')
  assert.match(theoryTab, /<h3[^>]*>\s*<InlineText text=\{block\.heading\} \/>\s*<\/h3>/)
  assert.doesNotMatch(theoryTab, /block\.heading\s*\+\s*'\\n\\n'/, 'the heading is joined onto the prose again')
})

test('an optional block keeps its heading in the trigger, not twice', () => {
  assert.match(theoryTab, /\{!block\.optional && \(\s*<h3/)
})
