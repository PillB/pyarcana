/**
 * Lesson navigation from tester feedback (18 Nov 2026): theory checkpoints, the ← → buttons, and
 * Sesión 0 in the menu. Each test names the wrong behaviour it exists to catch; each was watched
 * failing against the code it guards before it passed (see the PR for the mutations used).
 *
 * Run: node --import tsx --test src/lib/course/lesson-navigation.test.ts
 */
import { test } from 'node:test'
import { readFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { COURSE_SECTIONS } from '@/lib/course'
import { SUB_STEPS } from '@/lib/progress-store'
import type { TheoryBlock } from '@/lib/types'
import {
  countReadParts,
  firstUnreadPart,
  theoryParts,
  tickCompletesTheory,
  type TheoryPart,
} from '@/lib/course/theory-parts'
import { neighbourStep } from '@/lib/course/step-nav'
import { sanitizeCheckpoints, togglePart } from '@/lib/theory-checkpoints'
import { StepNavButtons } from '@/components/course/StepNavButtons'
import { Sidebar } from '@/components/course/Sidebar'
import { TheoryOutline, theoryPartDomId } from '@/components/course/TheoryParts'

const block = (heading: string, subtopicId?: string): TheoryBlock => ({ heading, paragraphs: ['x'], subtopicId })

// --- theory parts ------------------------------------------------------------------------------

test('every section: each theory block lands in exactly one part, in order', () => {
  for (const s of COURSE_SECTIONS) {
    const parts = theoryParts(s.theory)
    if (parts.length === 0) continue
    const flat = parts.flatMap((p) => p.blocks)
    // Wrong: a block dropped (it would never render) or rendered twice.
    assert.deepEqual(flat, s.theory.map((_, i) => i), `${s.id}: blocks lost, repeated or reordered`)
    for (const p of parts) {
      assert.ok(p.blocks.length > 0, `${s.id}: empty part ${p.key}`)
      assert.equal(p.blocks[p.blocks.length - 1] - p.blocks[0], p.blocks.length - 1, `${s.id}: ${p.key} not contiguous`)
    }
    assert.equal(new Set(parts.map((p) => p.key)).size, parts.length, `${s.id}: duplicate part key`)
  }
})

test('every part key survives the storage sanitizer (else a checkpoint vanishes on reload)', () => {
  for (const s of COURSE_SECTIONS) {
    const keys = theoryParts(s.theory).map((p) => p.key)
    if (keys.length === 0) continue
    const kept = sanitizeCheckpoints({ [s.id]: keys })[s.id] ?? []
    assert.deepEqual(kept, keys, `${s.id}: the sanitizer drops ${keys.filter((k) => !kept.includes(k)).join(', ')}`)
    for (const k of keys) assert.match(theoryPartDomId(k), /^[A-Za-z0-9_-]+$/)
  }
})

test('Section 1 opens with an introduction, then T1-A «El intérprete…» (the tester example)', () => {
  const s1 = COURSE_SECTIONS.find((s) => s.index === 1)!
  const parts = theoryParts(s1.theory)
  assert.equal(parts[0].key, 'intro')
  assert.equal(parts[1].label, 'T1-A')
  assert.match(parts[1].title, /intérprete/i)
  // Wrong: one part per block (34 checkpoints) or one for the whole theory (the old state).
  assert.ok(parts.length >= 5 && parts.length <= 12, `S01 has ${parts.length} parts`)
})

test('grouping: lead-ins open the next part, counter-examples close the previous one', () => {
  const parts = theoryParts([
    block('Hola'), // intro
    block('Qué es X', 'S09-T1-A'),
    block('Contraejemplo: X roto'), // closes T1-A
    block('Antes de Y'), // lead-in of T1-B
    block('Y', 'S09-T1-B'),
    block('Cierre suelto'), // trailing: closes T1-B
  ])
  assert.deepEqual(
    parts.map((p) => [p.key, p.blocks]),
    [['intro', [0]], ['S09-T1-A', [1, 2]], ['S09-T1-B', [3, 4, 5]]]
  )
})

test('a subtopic that comes back after another one gets its own stable key', () => {
  const parts = theoryParts([block('a', 'S09-T1-A'), block('b', 'S09-T1-B'), block('c', 'S09-T1-A')])
  assert.deepEqual(parts.map((p) => p.key), ['S09-T1-A', 'S09-T1-B', 'S09-T1-A#2'])
  // …and storage keeps that key: no section repeats an id today, so the course-wide test above
  // cannot see a sanitizer that forgets the suffix.
  assert.deepEqual(sanitizeCheckpoints({ data: parts.map((p) => p.key) }).data, parts.map((p) => p.key))
})

test('a theory with no subtopic ids has no parts (the single theory button stays the checkpoint)', () => {
  assert.deepEqual(theoryParts([block('a'), block('b')]), [])
})

test('the outline does not claim to be the open section (QA reports read [data-section-id])', () => {
  const s1 = COURSE_SECTIONS.find((s) => s.index === 1)!
  const html = renderToStaticMarkup(
    createElement(TheoryOutline, { parts: theoryParts(s1.theory), read: [], theoryDone: false })
  )
  assert.match(html, /data-testid="theory-outline"/)
  assert.doesNotMatch(html, /data-section-id/)
})

const P = (keys: string[]): TheoryPart[] => keys.map((key) => ({ key, label: key, title: key, blocks: [0] }))

test('the last unread tick completes theory; nothing else does', () => {
  const parts = P(['intro', 'S01-T1-A', 'S01-T1-B'])
  assert.equal(tickCompletesTheory(parts, ['intro', 'S01-T1-A'], 'S01-T1-B', false), true)
  assert.equal(tickCompletesTheory(parts, ['intro'], 'S01-T1-A', false), false, 'not yet all read')
  assert.equal(tickCompletesTheory(parts, ['intro', 'S01-T1-A'], 'S01-T1-B', true), false, 'already done: toggling would UNDO it')
  assert.equal(tickCompletesTheory(parts, ['intro', 'S01-T1-A', 'S01-T1-B'], 'S01-T1-B', false), false, 'an untick never completes')
  // A stale key from an older version of the content must not count toward «all read».
  assert.equal(tickCompletesTheory(parts, ['intro', 'S01-T9-Z'], 'S01-T1-A', false), false)
  assert.equal(countReadParts(parts, ['S01-T9-Z']), 0)
  assert.equal(firstUnreadPart(parts, ['intro'])?.key, 'S01-T1-A')
})

// --- checkpoint storage ------------------------------------------------------------------------

test('damaged checkpoint storage reads as empty or loses entries; it never invents one', () => {
  for (const bad of [null, 1, 'x', [], [['setup', ['intro']]]]) assert.deepEqual(sanitizeCheckpoints(bad), {})
  assert.deepEqual(
    sanitizeCheckpoints({ setup: ['intro', 'intro', 7, '<img>', 'S01-T1-A'], 'BAD ID': ['intro'], basics: 'intro' }),
    { setup: ['intro', 'S01-T1-A'] }
  )
})

test('togglePart is pure, round-trips, and refuses malformed keys', () => {
  const a = {}
  const b = togglePart(a, 'setup', 'S01-T1-A')
  assert.deepEqual(a, {})
  assert.deepEqual(b, { setup: ['S01-T1-A'] })
  assert.deepEqual(togglePart(b, 'setup', 'S01-T1-A'), {})
  assert.equal(togglePart(b, 'setup', 'javascript:1'), b)
})

// --- ← → buttons -------------------------------------------------------------------------------

test('→ moves one tab inside a section (the reported bug: it jumped to the next section)', () => {
  assert.deepEqual(neighbourStep(52, 0, 'theory', 1), { section: 0, step: 'ido', crossesSection: false })
  assert.deepEqual(neighbourStep(52, 0, 'youdo', 1), { section: 0, step: 'quiz', crossesSection: false })
})

test('→ from the last tab opens the next section on its first tab; ← mirrors it', () => {
  assert.deepEqual(neighbourStep(52, 0, 'quiz', 1), { section: 1, step: 'theory', crossesSection: true })
  assert.deepEqual(neighbourStep(52, 1, 'theory', -1), { section: 0, step: 'quiz', crossesSection: true })
})

test('the ends of the course and nonsense input go nowhere', () => {
  assert.equal(neighbourStep(52, 0, 'theory', -1), null)
  assert.equal(neighbourStep(52, 51, 'quiz', 1), null)
  assert.equal(neighbourStep(52, -1, 'theory', 1), null)
  assert.equal(neighbourStep(52, 52, 'theory', 1), null)
  assert.equal(neighbourStep(52, 0, 'exam' as never, 1), null)
})

test('walking → from the first step visits every step of every section once, in order', () => {
  const n = COURSE_SECTIONS.length
  let at: { section: number; step: (typeof SUB_STEPS)[number] } | null = { section: 0, step: SUB_STEPS[0] }
  let visited = 0
  while (at) {
    visited += 1
    at = neighbourStep(n, at.section, at.step, 1)
  }
  assert.equal(visited, n * SUB_STEPS.length)
})

function renderButtons(position: number, step: (typeof SUB_STEPS)[number]): string {
  return renderToStaticMarkup(
    createElement(StepNavButtons, { animateEntrance: false, sections: COURSE_SECTIONS, position, activeStep: step, onGo: () => {} })
  )
}

test('the → button says where it goes, in its accessible name and on screen', () => {
  const html = renderButtons(0, 'theory')
  assert.match(html, /data-testid="section-next"[^>]*aria-label="Siguiente: Yo hago"/)
  assert.match(html, /data-testid="section-next-label"[^>]*>Yo hago</)
  assert.match(html, /<button[^>]*disabled=""[^>]*data-testid="section-prev"/)
  const last = renderButtons(0, 'quiz')
  assert.match(last, /aria-label="Siguiente: S2 · Teoría"/)
  assert.match(last, /data-crosses-section="true"/)
})

// --- Sesión 0 in the menu ----------------------------------------------------------------------

test('the menu links to Sesión 0, outside the list counted as the 52 sections', () => {
  const html = renderToStaticMarkup(
    createElement(Sidebar, { sections: COURSE_SECTIONS, activeSectionId: null, onSelectSection: () => {}, onHome: () => {}, view: 'home' })
  )
  const link = html.indexOf('data-testid="sidebar-session0"')
  const list = html.indexOf('data-testid="sidebar-sections"')
  assert.ok(link >= 0, 'no Sesión 0 entry in the menu')
  assert.match(html, /<a[^>]*href="\/empezar"[^>]*data-testid="sidebar-session0"|<a[^>]*data-testid="sidebar-session0"[^>]*href="\/empezar"/)
  assert.ok(list > link, 'Sesión 0 must sit before (and outside) the role="list" of sections')
  const listHtml = html.slice(list)
  assert.equal((listHtml.match(/role="listitem"/g) ?? []).length, COURSE_SECTIONS.length)
})

// --- the browser suite stays wired to CI --------------------------------------------------------

test('CI runs the lesson e2e, and the command it runs names the four specs', () => {
  // Defect modelled: scripts/e2e_max ran in no job for months, and 52 of its tests failed on a
  // first-visit modal without anyone seeing it. If the step or a spec leaves, this says which.
  const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts: Record<string, string> }
  const command = pkg.scripts['test:lesson-e2e'] ?? ''
  for (const spec of ['01_chrome_pages', '02_sections_tabs_52', '07_glossary_i18n_a11y', '13_mouse_keyboard_lesson_flow']) {
    assert.ok(command.includes(`scripts/e2e_max/${spec}.spec.ts`), `package.json test:lesson-e2e no longer runs ${spec}.spec.ts`)
  }
  assert.match(command, /test:e2e-max:catalog/, 'test:lesson-e2e no longer regenerates the interaction catalog first: the 52-section spec would walk a stale list')
  assert.match(command, /E2E_STATIC=1/, 'test:lesson-e2e no longer tells the specs it runs on the static edition')
  const workflow = readFileSync('.github/workflows/tests.yml', 'utf8')
  assert.match(workflow, /npm run test:lesson-e2e/, '.github/workflows/tests.yml no longer runs npm run test:lesson-e2e')
  const config = readFileSync('scripts/e2e_max/playwright.max.config.ts', 'utf8')
  assert.match(config, /pyarcana:tourCompleted/, 'the e2e_max config no longer dismisses the first-visit tour: every spec that clicks a lesson will time out')
})
