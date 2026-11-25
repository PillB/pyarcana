/**
 * The course page's hash router (hash-route.ts). Each test names the defect it guards.
 * 24 Nov 2026: every "/#..." route is answered by one document, so a direct entry on any of them
 * must reach the same view a click would; and an id no section has must not open a blank page.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { COURSE_SECTIONS } from '@/lib/course'
import { findCourseSection, parseCourseHash, resolveCourseSectionId, type RoutableSection } from '@/lib/course/hash-route'
import { SECTION_ID_RENAMES } from '@/lib/section-id-migrations'
import { SUB_STEPS } from '@/lib/progress-store'

const STATIC = true

test('every plain view hash opens its view; "" and #home open home', () => {
  for (const [hash, view] of [['', 'home'], ['#', 'home'], ['#home', 'home'], ['#resources', 'resources'], ['#capstones', 'capstones'], ['#familiarity', 'familiarity']] as const) {
    assert.deepEqual(parseCourseHash(hash, COURSE_SECTIONS, STATIC), { view }, `${hash || '(empty)'} must open ${view}`)
  }
})

test('server-only views are refused on the static site and open on the server edition', () => {
  for (const hash of ['#admin', '#pricing']) {
    assert.equal(parseCourseHash(hash, COURSE_SECTIONS, true), null, `${hash} must not open on the static site`)
    assert.deepEqual(parseCourseHash(hash, COURSE_SECTIONS, false), { view: hash.slice(1) })
  }
})

test('#setup (the link the setup page and checkout send) opens section 1, Teoría', () => {
  const s1 = COURSE_SECTIONS.find((s) => s.id === 'setup')
  assert.ok(s1, 'section "setup" exists: /empezar and checkout link to /#setup')
  assert.deepEqual(parseCourseHash('#setup', COURSE_SECTIONS, STATIC), { view: 'section', sectionId: 'setup', step: 'theory' })
})

test('every section opens by slug and by S##, on every tab; an unknown tab falls back to Teoría', () => {
  for (const s of COURSE_SECTIONS) {
    const sNN = `S${String(s.index).padStart(2, '0')}`
    for (const step of SUB_STEPS) {
      assert.deepEqual(parseCourseHash(`#${s.id}/${step}`, COURSE_SECTIONS, STATIC), { view: 'section', sectionId: s.id, step }, `#${s.id}/${step}`)
      assert.deepEqual(parseCourseHash(`#${sNN}/${step}`, COURSE_SECTIONS, STATIC), { view: 'section', sectionId: s.id, step }, `#${sNN}/${step}`)
    }
    assert.deepEqual(parseCourseHash(`#${s.id}/nope`, COURSE_SECTIONS, STATIC), { view: 'section', sectionId: s.id, step: 'theory' })
  }
})

test('a bookmarked pre-rename slug still opens the renamed section', () => {
  for (const [oldId, newId] of Object.entries(SECTION_ID_RENAMES)) {
    assert.deepEqual(parseCourseHash(`#${oldId}`, COURSE_SECTIONS, STATIC), { view: 'section', sectionId: newId, step: 'theory' }, `#${oldId}`)
  }
})

test('an unknown hash or section id names nothing (null), never a section view with no section', () => {
  for (const hash of ['#no-such-route', '#S99', '#S00', '#__proto__', '#constructor', '#toString', '#/ido']) {
    assert.equal(parseCourseHash(hash, COURSE_SECTIONS, STATIC), null, `${hash} must not resolve`)
  }
  assert.equal(findCourseSection('S99', COURSE_SECTIONS), null, 'handleSelectSection relies on null to refuse a blank page')
})

test('drift: a renamed section keeps old links working only through SECTION_ID_RENAMES; a removed one stops resolving', () => {
  const sections: RoutableSection[] = [{ id: 'basics', index: 2 }, { id: 'fresh-name', index: 3 }]
  assert.equal(resolveCourseSectionId('S03', sections), 'fresh-name', 'S## follows the index, whatever the slug becomes')
  assert.equal(parseCourseHash('#old-name', sections, STATIC), null, 'a rename without a SECTION_ID_RENAMES entry breaks old links: caught here, not by a blank page')
  assert.equal(parseCourseHash('#S04', sections, STATIC), null, 'a section index that no longer exists resolves to nothing')
})
