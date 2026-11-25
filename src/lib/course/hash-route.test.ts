/**
 * The course page's hash router (hash-route.ts). Each test names the defect it guards.
 * 24 Nov 2026: every "/#..." route is answered by one document, so a direct entry on any of them
 * must reach the same view a click would; and an id no section has must not open a blank page.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { COURSE_SECTIONS } from '@/lib/course'
import {
  courseRootPath,
  coursePathFor,
  findCourseSection,
  isSessionZeroPath,
  parseCourseHash,
  parseCourseLocation,
  resolveCourseSectionId,
  type RoutableSection,
} from '@/lib/course/hash-route'
import { SETUP_PARTS } from '@/lib/setup/content'
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

// ---------------------------------------------------------------------------------------------
// Sesión 0 inside the course shell (25 Nov 2026). Until then /empezar rendered <SetupIntro /> on
// its own: no header, no menu, no theme or language switch (Pablo: "the format of section 0 is
// different from section 1 ... you lose the header and other navigation"). The shell now answers
// /empezar too, and the path decides that its first view is Sesión 0.

const SRC = (rel: string) => readFileSync(join(process.cwd(), rel), 'utf8')
/** Source without comments, so a line that only mentions a component in prose does not count. */
const code = (rel: string) => SRC(rel).replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

test('/empezar renders the course shell, not the setup guide alone', () => {
  const page = code('src/app/empezar/page.tsx')
  const imported = /import\s+(\w+)\s+from\s+'(?:\.\.\/page|@\/app\/page)'/.exec(page)
  assert.ok(
    imported,
    'src/app/empezar/page.tsx must import the course shell (the default export of src/app/page.tsx). ' +
      'Without it /empezar is a bare page with no header and no menu, the defect of 25 Nov 2026.',
  )
  assert.match(page, new RegExp(`<${imported[1]}\\s*/>`), `src/app/empezar/page.tsx imports ${imported[1]} but does not render it`)
  assert.doesNotMatch(
    page,
    /<SetupIntro\b/,
    'src/app/empezar/page.tsx renders <SetupIntro> directly: that is the shell-less page again. The shell renders it (view "session0").',
  )
  const shell = code('src/app/page.tsx')
  assert.match(shell, /view === 'session0' && <SetupIntro\b/, 'src/app/page.tsx must render <SetupIntro> for the session0 view')
  assert.match(shell, /isSessionZeroPath\(pathname\) \? 'session0'/, 'src/app/page.tsx must open on Sesión 0 when the path is /empezar, also in the prerendered HTML')
})

test('the setup guide leaves <main> to the shell, so the page has one main landmark', () => {
  const intro = code('src/components/setup/SetupIntro.tsx')
  assert.doesNotMatch(intro, /<main\b/, 'SetupIntro renders a <main> of its own; inside the shell that makes two main landmarks (WCAG 1.3.1, axe landmark-no-duplicate-main)')
  assert.match(code('src/app/page.tsx'), /<main\b/, 'the shell itself must keep its <main>')
})

test('the Sesión 0 path is recognised with and without a base path; nothing else is', () => {
  for (const p of ['/empezar', '/empezar/', '/empezar.html', '/pyarcana/empezar', '/pyarcana/empezar/']) {
    assert.equal(isSessionZeroPath(p), true, `${p} is Sesión 0's page`)
  }
  for (const p of ['/', '', '/pyarcana/', '/empezarx', '/x/empezar-ya', '/precios', '/empezar/otra']) {
    assert.equal(isSessionZeroPath(p), false, `${p} is not Sesión 0's page`)
  }
})

test('leaving /empezar for any other view goes back to the course root, keeping the base path', () => {
  const cases: Array<[string, string]> = [
    ['/empezar', '/'],
    ['/empezar/', '/'],
    ['/pyarcana/empezar', '/pyarcana/'],
    ['/pyarcana/', '/pyarcana/'],
    ['/', '/'],
  ]
  for (const [from, root] of cases) {
    assert.equal(courseRootPath(from), root, `root of ${from}`)
    for (const view of ['home', 'section', 'resources', 'capstones', 'familiarity'] as const) {
      // The defect: a section opened from /empezar kept the path, so the URL read /empezar#basics
      // and a reload opened Sesión 0 instead of the section.
      assert.equal(coursePathFor(view, from), root, `${view} from ${from} must live at ${root}, not under /empezar`)
    }
  }
})

test('opening Sesión 0 from anywhere gives the shareable /empezar path, under the base path', () => {
  for (const [from, want] of [['/', '/empezar'], ['/pyarcana/', '/pyarcana/empezar'], ['/pyarcana', '/pyarcana/empezar'], ['/empezar', '/empezar']]) {
    assert.equal(coursePathFor('session0', from), want, `Sesión 0 from ${from}`)
  }
})

test('on /empezar, "" and every part anchor stay on Sesión 0; a course hash still opens its view', () => {
  const parts = SETUP_PARTS.map((p) => p.id)
  for (const path of ['/empezar', '/pyarcana/empezar']) {
    assert.deepEqual(parseCourseLocation(path, '', COURSE_SECTIONS, STATIC, parts), { view: 'session0' }, `${path} opens Sesión 0`)
    for (const id of parts) {
      assert.deepEqual(parseCourseLocation(path, `#${id}`, COURSE_SECTIONS, STATIC, parts), { view: 'session0' }, `${path}#${id} is a part of Sesión 0`)
    }
    assert.deepEqual(parseCourseLocation(path, '#basics', COURSE_SECTIONS, STATIC, parts), { view: 'section', sectionId: 'basics', step: 'theory' })
    assert.deepEqual(parseCourseLocation(path, '#capstones', COURSE_SECTIONS, STATIC, parts), { view: 'capstones' })
  }
  // The root is unchanged: "" is still the dashboard, and an anchor there is not Sesión 0.
  assert.deepEqual(parseCourseLocation('/', '', COURSE_SECTIONS, STATIC, parts), { view: 'home' })
  assert.equal(parseCourseLocation('/', `#${parts[0]}`, COURSE_SECTIONS, STATIC, parts), null)
})

test('drift: a section that takes a Sesión 0 part slug opens from the root, never from a part link', () => {
  const part = SETUP_PARTS[0].id
  const clash: RoutableSection[] = [...COURSE_SECTIONS, { id: part, index: 99 }]
  const parts = SETUP_PARTS.map((p) => p.id)
  assert.deepEqual(parseCourseLocation('/empezar', `#${part}`, clash, STATIC, parts), { view: 'session0' }, 'the part link inside Sesión 0 must not open the new section')
  assert.deepEqual(parseCourseLocation('/', `#${part}`, clash, STATIC, parts), { view: 'section', sectionId: part, step: 'theory' })
})
