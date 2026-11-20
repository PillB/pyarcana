/**
 * Source-drift simulation for the lesson navigation (owner request, 19 Nov 2026).
 *
 * The lessons are rewritten every round: blocks are added, retitled, untagged, reordered. This
 * file applies those edits to the real 52 sections, with a seeded generator so a failure
 * reproduces, and checks what must survive each of them.
 *
 * Correct behaviour: every block still renders exactly once, a saved checkpoint still names a
 * part or is ignored, and edits that do not touch a tag do not rename any part.
 * Defects modelled: a block dropped or doubled; a retitle or an inserted lead-in silently
 * renaming a part (the learner's checkpoint vanishes); a tag in a new format whose checkpoint
 * button does nothing; a translation losing its placeholder; a layout constant changed in one
 * file and not the other.
 *
 * Run: node --import tsx --test src/lib/course/lesson-navigation-drift.test.ts
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { COURSE_SECTIONS } from '@/lib/course'
import { t, type Language } from '@/lib/i18n'
import type { TheoryBlock } from '@/lib/types'
import { countReadParts, theoryParts, tickCompletesTheory } from '@/lib/course/theory-parts'
import { sanitizeCheckpoints, togglePart } from '@/lib/theory-checkpoints'

/** mulberry32: small, seeded, good enough to pick edit positions reproducibly. */
function rng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let x = Math.imul(a ^ (a >>> 15), 1 | a)
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

const keysOf = (theory: readonly TheoryBlock[]) => theoryParts(theory).map((p) => p.key)
const untagged = (heading: string): TheoryBlock => ({ heading, paragraphs: ['x'] })

/** What must hold for ANY theory, however it was edited. */
function assertWellFormed(theory: readonly TheoryBlock[], where: string) {
  const parts = theoryParts(theory)
  if (parts.length === 0) {
    assert.ok(!theory.some((b) => b.subtopicId), `${where}: tagged blocks but no parts`)
    return
  }
  assert.deepEqual(parts.flatMap((p) => p.blocks), theory.map((_, i) => i), `${where}: a block was dropped, doubled or reordered`)
  const keys = parts.map((p) => p.key)
  assert.equal(new Set(keys).size, keys.length, `${where}: duplicate part key in ${keys.join(', ')}`)
  const kept = sanitizeCheckpoints({ x: keys }).x ?? []
  assert.deepEqual(kept, keys, `${where}: storage would drop ${keys.filter((k) => !kept.includes(k)).join(', ')}`)
  for (const p of parts) assert.ok(p.label.length > 0 && p.title.length > 0, `${where}: part ${p.key} has no label or title`)
}

const ROUNDS = 40

test('drift: inserting an untagged block anywhere never renames or removes a part', () => {
  const next = rng(20261119)
  for (const s of COURSE_SECTIONS) {
    const before = keysOf(s.theory)
    for (let r = 0; r < ROUNDS; r += 1) {
      const at = Math.floor(next() * (s.theory.length + 1))
      const heading = next() < 0.5 ? 'Contraejemplo: uno nuevo' : 'Antes de seguir'
      const edited = [...s.theory.slice(0, at), untagged(heading), ...s.theory.slice(at)]
      const where = `${s.id}: insert «${heading}» at ${at}`
      assertWellFormed(edited, where)
      const after = keysOf(edited)
      const lost = before.filter((k) => !after.includes(k))
      const gained = after.filter((k) => !before.includes(k))
      assert.deepEqual(lost, [], `${where}: checkpoints for ${lost.join(', ')} would vanish`)
      assert.deepEqual(gained.filter((k) => k !== 'intro'), [], `${where}: invented part ${gained.join(', ')}`)
    }
  }
})

test('drift: retitling blocks never changes part keys', () => {
  const next = rng(7)
  for (const s of COURSE_SECTIONS) {
    const before = keysOf(s.theory)
    for (let r = 0; r < ROUNDS; r += 1) {
      const at = Math.floor(next() * s.theory.length)
      // A tagged block gets any new title; an untagged one keeps its kind (counter-example or
      // not), because the kind, not the wording, decides which part it belongs to.
      const old = s.theory[at]
      const isCounter = /^\s*contraejemplo\b/i.test(old.heading)
      const heading = old.subtopicId ? 'Título nuevo' : isCounter ? 'Contraejemplo: reescrito' : 'Reescrito'
      const edited = s.theory.map((b, i) => (i === at ? { ...b, heading } : b))
      assert.deepEqual(keysOf(edited), before, `${s.id}: retitling block ${at} renamed a part`)
    }
  }
})

test('drift: untagging or deleting a block removes at most parts, never invents or breaks one', () => {
  const next = rng(99)
  for (const s of COURSE_SECTIONS) {
    const before = keysOf(s.theory)
    for (let r = 0; r < ROUNDS; r += 1) {
      const at = Math.floor(next() * s.theory.length)
      const del = next() < 0.5
      const edited = del
        ? s.theory.filter((_, i) => i !== at)
        : s.theory.map((b, i) => (i === at ? { ...b, subtopicId: undefined } : b))
      const where = `${s.id}: ${del ? 'delete' : 'untag'} block ${at}`
      assertWellFormed(edited, where)
      const gained = keysOf(edited).filter((k) => !before.includes(k) && k !== 'intro')
      assert.deepEqual(gained, [], `${where}: invented part ${gained.join(', ')}`)
    }
  }
})

test('drift: shuffled, truncated and emptied theories stay well-formed', () => {
  const next = rng(4242)
  for (const s of COURSE_SECTIONS) {
    for (let r = 0; r < ROUNDS; r += 1) {
      const shuffled = [...s.theory].sort(() => next() - 0.5).slice(0, Math.floor(next() * (s.theory.length + 1)))
      assertWellFormed(shuffled, `${s.id}: shuffle round ${r}`)
    }
  }
  // «Contraejemplo» is matched as the heading's first word, not anywhere in it.
  const leadIn = theoryParts([{ ...untagged('a'), subtopicId: 'S01-T1-A' }, untagged('Sin contraindicaciones'), { ...untagged('b'), subtopicId: 'S01-T1-B' }])
  assert.deepEqual(leadIn.map((p) => p.blocks), [[0], [1, 2]], 'a heading that merely contains «contra» was filed as a counter-example')
  assertWellFormed([], 'empty theory')
  assertWellFormed([untagged('a')], 'one untagged block')
  assertWellFormed([untagged('Contraejemplo: primero'), { ...untagged('b'), subtopicId: 'S01-T1-A' }], 'counter-example first')
})

test('drift: a tag in a format nobody planned still gets a working checkpoint', () => {
  // The first version accepted only S01-T1-A. A capstone tag or a tenth topic would have made
  // the checkpoint button a silent no-op: togglePart refused the key and returned the same map.
  for (const id of ['S01-T10-A', 'S100-T1-A', 'CP-N1-A', 'S07-T2-AB', 's07-t2-a', 'S07.T2.A']) {
    const [part] = theoryParts([{ ...untagged('x'), subtopicId: id }])
    const ticked = togglePart({}, 'setup', part.key)
    assert.deepEqual(ticked, { setup: [part.key] }, `tag ${id}: the checkpoint did not save`)
    assert.deepEqual(sanitizeCheckpoints(ticked), ticked, `tag ${id}: the checkpoint is dropped on reload`)
  }
  // Still refused: anything that is not a plain token.
  for (const bad of ['', ' ', 'a b', '<img>', 'x'.repeat(200), '__proto__']) {
    assert.deepEqual(togglePart({}, 'setup', bad), {}, `key ${JSON.stringify(bad)} was accepted`)
  }
  assert.deepEqual(sanitizeCheckpoints(JSON.parse('{"__proto__":["intro"],"A B":["intro"]}')), {})
})

test('drift: checkpoints saved before an edit never over-count or complete theory by themselves', () => {
  const s1 = COURSE_SECTIONS.find((s) => s.index === 1)!
  const parts = theoryParts(s1.theory)
  const allRead = parts.map((p) => p.key)
  // A round adds a new subtopic: 9 saved checkpoints, 10 parts now.
  const grown = theoryParts([...s1.theory, { ...untagged('Nuevo'), subtopicId: 'S01-T5-A' }])
  assert.equal(countReadParts(grown, allRead), parts.length)
  assert.equal(tickCompletesTheory(grown, allRead, 'S01-T5-A', false), true, 'the new part is the last one unread')
  assert.equal(tickCompletesTheory(grown, allRead.slice(1), 'S01-T5-A', false), false)
  // A key left over from deleted content must not stand in for a part that is still unread.
  assert.equal(tickCompletesTheory(grown, [...allRead.slice(1), 'S01-T9-Z'], 'S01-T5-A', false), false, 'a stale key completed the theory')
  // A round removes every tag: saved keys name nothing and count for nothing.
  assert.equal(countReadParts(theoryParts(s1.theory.map((b) => ({ ...b, subtopicId: undefined }))), allRead), 0)
})

// --- words and layout that live in two places --------------------------------------------------

const PLACEHOLDERS: Record<string, string[]> = {
  'course.nextStep': ['{step}'],
  'course.previousStep': ['{step}'],
  'theory.parts.count': ['{done}', '{total}'],
  'theory.parts.resume': ['{part}'],
  'theory.parts.mark': ['{part}'],
  'theory.parts.saved': ['{part}'],
  'sidebar.session0.progress': ['{done}', '{total}'],
}
const PLAIN = ['theory.parts.nav', 'theory.parts.readShort', 'theory.parts.undo', 'sidebar.session0.title', 'sidebar.session0.tagline']

test('drift: every language keeps the navigation strings and their placeholders', () => {
  for (const lang of ['es-PE', 'es-ES', 'en'] as Language[]) {
    for (const key of [...Object.keys(PLACEHOLDERS), ...PLAIN]) {
      const text = t(key, lang)
      assert.notEqual(text, key, `${lang}: «${key}» is missing, so the page would show the key itself`)
      assert.ok(text.trim().length > 0, `${lang}: «${key}» is empty`)
      for (const ph of PLACEHOLDERS[key] ?? []) {
        assert.ok(text.includes(ph), `${lang}: «${key}» = «${text}» lost ${ph}; the destination or count would not show`)
      }
      assert.equal((text.match(/\{[a-z]+\}/g) ?? []).length, (PLACEHOLDERS[key] ?? []).length, `${lang}: «${key}» = «${text}» has a placeholder nothing fills`)
    }
  }
})

const src = (rel: string) => readFileSync(fileURLToPath(new URL(`../../../${rel}`, import.meta.url)), 'utf8')

test('drift: the ← button clears the sidebar at the width the sidebar really has', () => {
  // Tailwind w-N is N/4 rem. The button sits 1rem past it. If either file changes alone, the
  // button lands on the sidebar's last row again (it covered «Recursos» before this PR).
  const page = src('src/app/page.tsx')
  const aside = /<aside className="[^"]*\bw-(\d+)\b[^"]*lg:block/.exec(page)
  assert.ok(aside, 'src/app/page.tsx: the desktop sidebar <aside … w-N … lg:block> was not found; update this test with its new shape')
  const sidebarRem = Number(aside[1]) / 4
  const buttons = src('src/components/course/StepNavButtons.tsx')
  const left = /lg:left-\[(\d+(?:\.\d+)?)rem\]/.exec(buttons)
  assert.ok(left, 'StepNavButtons.tsx: no lg:left-[Nrem] on the ← button')
  assert.equal(Number(left[1]), sidebarRem + 1, `sidebar is ${sidebarRem}rem wide but the ← button sits at ${left[1]}rem; expected ${sidebarRem + 1}rem`)
})

test('drift: only the section root is read as «the open section»', () => {
  // QA reports and surveys take the section from [data-section-id]. A second element with that
  // attribute (the theory outline had one for an hour) made the report context ambiguous.
  const bridge = src('src/components/course/QAFooterBridge.tsx')
  assert.match(bridge, /querySelector<HTMLElement>\('\[data-testid="section-root"\]\[data-section-id\]'\)/, 'QAFooterBridge reads any [data-section-id] again, not the section root')
  for (const file of ['src/components/course/TheoryParts.tsx', 'src/components/course/StepNavButtons.tsx', 'src/components/course/Sidebar.tsx']) {
    assert.doesNotMatch(src(file), /data-section-id=/, `${file} carries data-section-id; only SectionView's root may`)
  }
})
