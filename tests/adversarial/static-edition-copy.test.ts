/**
 * Adversarial guard: the static edition promises no exam.
 *
 * The landing page footer renders in both editions. Its line said "Exámenes con anti-plagio",
 * but the static edition (GitHub Pages) has no session and runs no exam, so the line promised
 * what that edition cannot give. The anti-plagiarism claim may be read only where the static
 * edition never mounts it: the exam card (ExamView) is mounted only for a signed-in session, and
 * the pricing page with the plan features only outside the static build.
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

/** The claim that exams are anti-plagiarism. */
const ANTI_PLAGIARISM = /anti-?plagi/i

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

/** The files that name a translation key in quotes, excluding the table itself. */
function readers(key: string): string[] {
  return sourceFiles()
    .filter((file) => file !== I18N)
    .filter((file) => source(file).includes(`'${key}'`))
}

describe('static edition copy', () => {
  for (const { code } of LANGUAGES) {
    it(`the footer method line, shown in both editions, promises no exam (${code})`, () => {
      assert.doesNotMatch(t('footer.method', code), EXAM_PROMISE)
    })
  }

  it('every anti-plagiarism claim is read only by the exam card, the one component the static edition never mounts', () => {
    const claims = KEYS.filter((key) => LANGUAGES.some(({ code }) => ANTI_PLAGIARISM.test(t(key, code))))
    assert.ok(claims.includes('exam.antiPlagiarism'), 'the scan must see the exam card claim, or it proves nothing')
    for (const key of claims) {
      assert.ok(
        readers(key).every((file) => file === EXAM_CARD),
        `${key} is read by ${readers(key).join(', ')}`
      )
    }
  })

  it('the exam card is mounted only in the signed-in branch of the section view', () => {
    const sectionView = source('src/components/course/SectionView.tsx')
    // The static build has no session, so the quiz tab renders instead of the exam card.
    assert.match(sectionView, /session\?\.user\s*\?\s*\(\s*<ExamView/)
  })

  it('the plan features, which list the exam, are shown only outside the static build', () => {
    const page = source('src/app/page.tsx')
    assert.match(page, /!IS_STATIC_SITE && view === 'pricing'/)
    const consumers = sourceFiles()
      .filter((file) => !/\.test\.|__tests__/.test(file))
      .filter((file) => source(file).includes('SUBSCRIPTION_PLANS'))
    assert.deepEqual(consumers.sort(), ['src/components/course/PricingPage.tsx', 'src/lib/subscription-plans.ts'])
  })
})
