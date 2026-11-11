/**
 * Adversarial guard: the tour describes the lesson's fifth tab as the tab is, in every edition.
 *
 * The tour is mounted in every edition, and the fifth tab ("Autocheck") holds different things:
 *
 *   - static builds (GitHub Pages and pyarcana.dev): no NextAuth session exists, so SectionView
 *     mounts the self-check quiz: 70% to pass, retried as often as the learner likes;
 *   - the dynamic LMS, signed out: the same quiz;
 *   - the dynamic LMS, signed in: the section exam, 70% to pass and 3 attempts (MAX_EXAM_ATTEMPTS).
 *
 * The first draft told everyone "puedes repetir la autoevaluación cuantas veces quieras". That is
 * false for the third learner, who has 3 attempts; the draft before it ("el examen formal con
 * cuenta") promised an exam to the first two. The tab and the tour now choose through one function
 * (fifthTabFor in src/lib/cloud/ui-state.ts), and the tour step's body is a real component
 * (TourBodyText) that reads the session itself, so each case below renders the component the tour
 * shows, with the session that edition gives it:
 *
 *   - the static build and the dynamic signed-out learner are rendered through Providers, the
 *     component the app mounts, each in its own process (IS_STATIC_SITE is read from the
 *     environment when the module loads);
 *   - the dynamic signed-in learner is rendered under a SessionProvider that holds a session, which
 *     is what Providers gives once the session cookie has been read.
 *
 * Run: node --import tsx --test tests/adversarial/tour-autocheck-by-edition.test.ts
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { SessionProvider } from 'next-auth/react'
import { STEPS, TourBodyText } from '../../src/components/course/InteractiveTour.tsx'
import { fifthTabFor, tourAutocheckBodyKey } from '../../src/lib/cloud/ui-state.ts'
import { MAX_EXAM_ATTEMPTS, PASS_THRESHOLD } from '../../src/lib/exam-scoring.ts'
import { LANGUAGES, t, useI18n, type Language } from '../../src/lib/i18n.ts'
import { SELF_CHECK_PASS_PCT } from '../../src/lib/self-check.ts'

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..', '..')

function source(file: string): string {
  return readFileSync(join(ROOT, file), 'utf8')
}

/** The tour's step about the fifth tab, found by the title key it carries. */
const AUTOCHECK_STEP = STEPS.find((step) => step.titleKey === 'tour.autocheck.title')
assert.ok(AUTOCHECK_STEP, 'the tour has no Autocheck step, so this file guards nothing')

const SIGNED_IN = { user: { name: 'Ana', email: 'ana@example.test' }, expires: '2099-01-01T00:00:00.000Z' }

function text(html: string): string {
  return html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]*>/g, ' ').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/\s+/g, ' ').trim()
}

/**
 * A server render reads the store's INITIAL state (zustand's getInitialState), so setLang alone
 * leaves every render in es-PE. Set the initial state's language as well, or "en" and "es-ES" are
 * never rendered (credential-copy-stages.test.ts had that hole until the helper below was added).
 */
function setRenderLanguage(lang: Language): void {
  useI18n.getState().setLang(lang)
  ;(useI18n.getInitialState() as { lang: Language }).lang = lang
}

/** The step body for a signed-in learner, rendered in this process (the dynamic LMS). */
function signedInBody(lang: Language): string {
  setRenderLanguage(lang)
  const shown = text(renderToStaticMarkup(h(SessionProvider, { session: SIGNED_IN }, h(TourBodyText, { step: AUTOCHECK_STEP! }))))
  assert.equal(shown, t(tourAutocheckBodyKey(SIGNED_IN.user), lang), `the render is not the ${lang} text of the exam key`)
  return shown
}

const underProviders = new Map<boolean, Record<string, string>>()

/**
 * The step body in each language under the app's own Providers, rendered in its own process (one per
 * edition) with the static-site flag the build would set. Providers gives a static build
 * `session={null}` and a dynamic one no session yet, which is a signed-out learner.
 */
function bodyUnderProviders(staticSite: boolean, lang: Language): string {
  if (!underProviders.has(staticSite)) {
    const script = [
      "import { createElement as h } from 'react'",
      "import { renderToStaticMarkup } from 'react-dom/server'",
      "import { Providers } from './src/components/Providers.tsx'",
      "import { STEPS, TourBodyText } from './src/components/course/InteractiveTour.tsx'",
      "import { LANGUAGES, useI18n } from './src/lib/i18n.ts'",
      "const step = STEPS.find((s) => s.titleKey === 'tour.autocheck.title')",
      'const out = {}',
      'for (const { code } of LANGUAGES) {',
      '  useI18n.getState().setLang(code)',
      '  useI18n.getInitialState().lang = code',
      '  out[code] = renderToStaticMarkup(h(Providers, null, h(TourBodyText, { step })))',
      '}',
      'process.stdout.write(JSON.stringify(out))',
    ].join('\n')
    const run = spawnSync(process.execPath, ['--import', 'tsx', '--input-type=module', '-e', script], {
      cwd: ROOT,
      encoding: 'utf8',
      env: { ...process.env, NEXT_PUBLIC_STATIC_SITE: staticSite ? '1' : '' },
    })
    assert.equal(run.status, 0, run.stderr)
    underProviders.set(staticSite, Object.fromEntries(Object.entries(JSON.parse(run.stdout) as Record<string, string>).map(([code, html]) => [code, text(html)])))
  }
  const shown = underProviders.get(staticSite)![lang]
  assert.equal(shown, t(tourAutocheckBodyKey(null), lang), `the ${staticSite ? 'static' : 'dynamic'} render is not the ${lang} text of the quiz key`)
  return shown
}

/** The self-check quiz: its pass mark, retry without limit, and nothing about an exam or attempts. */
function assertDescribesTheQuiz(shown: string, where: string): void {
  assert.match(shown, new RegExp(`${SELF_CHECK_PASS_PCT}%`), `${where}: the pass mark of the quiz is missing`)
  assert.match(shown, /cuantas veces quieras|whenever you like/, `${where}: it no longer says the quiz can be retried freely`)
  assert.doesNotMatch(shown, /ex[aá]men|\bexams?\b|intentos|attempts/i, `${where}: it speaks of an exam or of attempts, which the quiz does not have`)
}

/** The section exam: the exam's pass mark, its attempt limit and no promise of unlimited retries. */
function assertDescribesTheExam(shown: string, where: string): void {
  assert.match(shown, /ex[aá]men|\bexam\b/i, `${where}: it does not name the exam the tab holds`)
  assert.match(shown, new RegExp(`${PASS_THRESHOLD}%`), `${where}: the exam's pass mark is missing`)
  assert.match(shown, new RegExp(`${MAX_EXAM_ATTEMPTS} (?:intentos|attempts)`), `${where}: the exam's ${MAX_EXAM_ATTEMPTS} attempts are missing`)
  assert.doesNotMatch(shown, /cuantas veces|whenever you like|sin l[ií]mite|unlimited/i, `${where}: it promises retries without limit`)
}

describe('the numbers the two descriptions state are the numbers the code enforces', () => {
  it('the quiz and the exam both pass at 70%, and the exam allows 3 attempts', () => {
    assert.equal(SELF_CHECK_PASS_PCT, 70)
    assert.equal(PASS_THRESHOLD, 70)
    assert.equal(MAX_EXAM_ATTEMPTS, 3)
  })
})

describe('the tour step about the fifth tab, by edition', () => {
  for (const { code } of LANGUAGES) {
    it(`static build (GitHub Pages and pyarcana.dev), any stage: no session exists, so it describes the quiz (${code})`, () => {
      assertDescribesTheQuiz(bodyUnderProviders(true, code), `static build / ${code}`)
    })

    it(`dynamic LMS, signed out: it describes the quiz (${code})`, () => {
      assertDescribesTheQuiz(bodyUnderProviders(false, code), `dynamic LMS signed out / ${code}`)
    })

    it(`dynamic LMS, signed in: the tab holds the section exam, so it describes the exam (${code})`, () => {
      assertDescribesTheExam(signedInBody(code), `dynamic LMS signed in / ${code}`)
    })
  }

  it('the three descriptions differ in the same way in every language: two quiz texts, one exam text', () => {
    for (const { code } of LANGUAGES) {
      const staticBuild = bodyUnderProviders(true, code)
      const signedOut = bodyUnderProviders(false, code)
      assert.equal(staticBuild, signedOut, `${code}: a signed-out learner reads another text on the dynamic LMS than on a static build`)
      assert.notEqual(signedInBody(code), signedOut, `${code}: a signed-in learner reads the quiz text`)
    }
  })
})

describe('the tab and the tour choose together', () => {
  it('fifthTabFor gives the exam to a session and the quiz to nobody', () => {
    for (const nobody of [null, undefined, false, 0, '']) assert.equal(fifthTabFor(nobody), 'selfCheck')
    assert.equal(fifthTabFor({ name: 'Ana' }), 'exam')
  })

  it('the tour key follows the tab: the exam key exactly when the tab is the exam', () => {
    for (const user of [null, undefined, { name: 'Ana' }]) {
      const tab = fifthTabFor(user)
      assert.equal(tourAutocheckBodyKey(user), tab === 'exam' ? 'tour.autocheck.bodyExam' : 'tour.autocheck.body')
    }
  })

  it('SectionView mounts the exam through fifthTabFor, from the NextAuth session, not the cloud account', () => {
    const view = source('src/components/course/SectionView.tsx')
    assert.match(view, /fifthTabFor\(session\?\.user\)\s*===\s*'exam'\s*\?\s*\(\s*<ExamView/)
    assert.doesNotMatch(view, /useIsSignedIn/, 'the tab would follow the cloud account, which the tour does not')
  })

  it('the tour reads the same session and shows its step body through TourBodyText only', () => {
    const tour = source('src/components/course/InteractiveTour.tsx')
    assert.match(tour, /const \{ data: session \} = useSession\(\)/)
    assert.match(tour, /tourBodyKey\(step, session\?\.user\)/)
    assert.doesNotMatch(tour, /tr\(currentStep\.bodyKey\)/, 'a step body is read without the session again')
    assert.equal(tour.split('<TourBodyText step={currentStep} />').length - 1, 2, 'the card and the dialog description both show the body through TourBodyText')
  })

  it('a static build never has a NextAuth session', () => {
    assert.match(source('src/components/Providers.tsx'), /session=\{IS_STATIC_SITE \? null : undefined\}/)
  })
})
