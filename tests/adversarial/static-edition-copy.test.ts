/**
 * Adversarial guard: the static edition promises no exam.
 *
 * The landing page footer renders in both editions. Its line said "Exámenes con anti-plagio",
 * but the static edition (GitHub Pages, and the pyarcana.dev build where accounts run) has no
 * session and runs no exam, so the line promised what that edition cannot give. Every wording in
 * the translation table that tells a learner an exam exists may be read only where the static
 * edition never mounts it: the exam card (ExamView) is mounted only for a signed-in session, and
 * the pricing page with the plan features only outside the static build.
 *
 * The first version of this guard looked only at keys that said "anti-plagio". The review found
 * 'tour.autocheck.body' ("el examen formal con cuenta"), read by the tour the static build mounts,
 * and 'auth.demoDesc' ("rendir exámenes"), which nothing reads. The scan now covers every key whose
 * text names an exam, in any quote style, and the plan scan covers every importer of the plan table.
 * The owner deleted 'auth.demoDesc' and 'progress.createAccountDesc' (O25); the last describe block
 * keeps both from coming back.
 *
 * Run: node --import tsx --test tests/adversarial/static-edition-copy.test.ts
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { LANGUAGES, t } from '../../src/lib/i18n.ts'

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..', '..')
const I18N = 'src/lib/i18n.ts'
const EXAM_CARD = 'src/components/course/ExamView.tsx'

/** Any wording that tells a learner an exam exists, in Spanish or English. */
const EXAM_PROMISE = /ex[aá]men|anti-?plagi|\bexams?\b/i

/**
 * The files that may read a wording that names an exam, each with why the static edition never
 * mounts it. A file added here is a decision that the static edition cannot show that wording.
 */
const DYNAMIC_ONLY_READERS: ReadonlyMap<string, string> = new Map([
  [EXAM_CARD, 'mounted only when a server session exists (SectionView), which the static build never has'],
])

/**
 * Wordings that name an exam and are read by a file the static build does mount, because that file
 * picks the wording by session and the static build never has one. Each entry is a decision: key,
 * the reading file, and why the static build never gets the wording. The cases that prove the reason
 * are in tour-autocheck-by-edition.test.ts (the static build and a signed-out learner render the
 * quiz text; only a NextAuth session renders the exam text; Providers gives a static build no session).
 */
const SESSION_PICKED_READERS: ReadonlyMap<string, ReadonlyMap<string, string>> = new Map([
  [
    'tour.autocheck.bodyExam',
    new Map([['src/lib/cloud/ui-state.ts', 'tourAutocheckBodyKey returns it only for a NextAuth user, which a static build never has']]),
  ],
])

/** Importers of the plan table that the static build mounts, with what each reads from it. */
const PLAN_IMPORTERS: ReadonlyMap<string, string> = new Map([
  ['src/components/course/PricingPage.tsx', 'lists the plan features; mounted only outside the static build'],
  ['src/lib/cloud/config.ts', 'reads the free plan maxSections and nothing else'],
  ['src/lib/subscription-plans.ts', 'the plan table itself'],
])

function source(file: string): string {
  return readFileSync(join(ROOT, file), 'utf8')
}

/** Every .ts, .tsx and .mjs file under src/, relative to the repository. */
function sourceFiles(dir = join(ROOT, 'src')): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) return sourceFiles(full)
    return /\.(tsx?|mjs)$/.test(name) ? [relative(ROOT, full)] : []
  })
}

/** Every key of the translation table, read from its source. */
const KEYS = [...new Set([...source(I18N).matchAll(/^\s+'([^']+)':/gm)].map((m) => m[1]))]

/** The files that name a translation key in single quotes, double quotes or backticks, excluding the table itself. */
function readers(key: string): string[] {
  const quoted = new RegExp(`['"\`]${key.replace(/\./g, '\\.')}['"\`]`)
  return sourceFiles()
    .filter((file) => file !== I18N)
    .filter((file) => quoted.test(source(file)))
}

describe('static edition copy', () => {
  for (const { code } of LANGUAGES) {
    it(`the footer method line, shown in both editions, promises no exam (${code})`, () => {
      assert.doesNotMatch(t('footer.method', code), EXAM_PROMISE)
    })
  }

  it('every wording that names an exam is read only by a component the static edition never mounts', () => {
    const claims = KEYS.filter((key) => LANGUAGES.some(({ code }) => EXAM_PROMISE.test(t(key, code))))
    assert.ok(claims.includes('exam.antiPlagiarism'), 'the scan must see the exam card claim, or it proves nothing')
    assert.ok(claims.length >= 10, `the scan found ${claims.length} exam wordings; it is meant to see them all`)
    const offenders = claims.flatMap((key) =>
      readers(key)
        .filter((file) => !DYNAMIC_ONLY_READERS.has(file) && !SESSION_PICKED_READERS.get(key)?.has(file))
        .map((file) => `${key} is read by ${file}`)
    )
    assert.deepEqual(offenders, [])
  })

  it('a session-picked exam wording is read only by the reviewed file, and the scan sees the exam key', () => {
    const claims = KEYS.filter((key) => LANGUAGES.some(({ code }) => EXAM_PROMISE.test(t(key, code))))
    assert.ok(claims.includes('tour.autocheck.bodyExam'), 'the tour exam wording no longer names an exam, or the key moved')
    for (const [key, files] of SESSION_PICKED_READERS) {
      assert.deepEqual(readers(key).sort(), [...files.keys()].sort(), `${key} is read by files other than the reviewed ones`)
    }
  })

  it('the exam card is mounted only in the signed-in branch of the section view', () => {
    const sectionView = source('src/components/course/SectionView.tsx')
    // The static build has no session, so the quiz tab renders instead of the exam card. The tab and
    // the tour choose through fifthTabFor, so the tour describes the tab the learner sees.
    assert.match(sectionView, /fifthTabFor\(session\?\.user\)\s*===\s*'exam'\s*\?\s*\(\s*<ExamView/)
  })

  it('the plan features, which list the exam, are shown only outside the static build', () => {
    const page = source('src/app/page.tsx')
    assert.match(page, /!IS_STATIC_SITE && view === 'pricing'/)
    // Any importer counts, whichever export it takes (SUBSCRIPTION_PLANS, getPlanByCode, ...): the
    // first version looked for one name and would have missed `getPlanByCode('pro').features`.
    const importers = sourceFiles()
      .filter((file) => !/\.test\.|__tests__/.test(file))
      .filter((file) => /from\s+['"](?:@\/lib\/|\.\/|\.\.\/)(?:lib\/)?subscription-plans['"]/.test(source(file)))
    const unreviewed = importers.filter((file) => !PLAN_IMPORTERS.has(file))
    assert.deepEqual(unreviewed, [], 'a file that reads the plan table is mounted by the static build unreviewed')
    assert.ok(importers.includes('src/components/course/PricingPage.tsx'), 'the scan must see the pricing page, or it proves nothing')
  })

  it('the one static-build importer of the plan table reads no plan copy', () => {
    const config = source('src/lib/cloud/config.ts')
    assert.match(config, /getPlanByCode\('free'\)\?\.maxSections/)
    assert.doesNotMatch(config, /\.features|\.description|\.tagline|\.hasExams/)
  })
})

/**
 * Wordings the owner had deleted (O25, 2026-10-13). Each promised an exam ("exámenes con
 * anti-plagio", "rendir exámenes") that the site does not give outside the dynamic LMS, and nothing
 * rendered either one. The scan above proved no file mounted by the static build reads them; it
 * cannot stop a later change from writing them back. This case does: a key in this list is defined
 * in no dictionary and named by no file.
 */
const DELETED_WORDINGS = ['progress.createAccountDesc', 'auth.demoDesc']

describe('wordings the owner deleted stay deleted', () => {
  for (const key of DELETED_WORDINGS) {
    it(`${key} is defined in no dictionary and named by no file`, () => {
      const defined = source(I18N).split('\n').filter((line) => line.trim().startsWith(`'${key}':`))
      assert.deepEqual(defined, [], `${key} is back in the translation table`)
      for (const { code } of LANGUAGES) assert.equal(t(key, code), key, `${key} resolves to text in ${code}`)
      assert.deepEqual(readers(key), [], `${key} is named by a file`)
    })
  }

  it('the neighbours of the deleted keys are still there, so the case is reading the real table', () => {
    for (const key of ['progress.createAccount', 'auth.loginTab', 'auth.or']) {
      assert.ok(KEYS.includes(key), `${key} is missing from the table the case reads`)
    }
  })
})
