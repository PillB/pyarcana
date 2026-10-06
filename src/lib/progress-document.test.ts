/**
 * The progress document a learner downloads: which one their progress earns, what it may say,
 * and that the pricing copy and the i18n strings call it by the same name.
 *
 * It renders the real generator in PdfReport.tsx rather than a copy of its logic, so a wording
 * change on the document itself is what these assertions see.
 *
 * Run: npm run test:progress-document
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { generateCertificateHTML, SECTION_NAMES } from '@/components/course/PdfReport'
import { PricingPage } from '@/components/course/PricingPage'
import { CAPSTONES, TOTAL_CAPSTONES } from '@/lib/capstones/catalog'
import { COURSE_SECTIONS } from '@/lib/course'
import { t, type Language } from '@/lib/i18n'
import { SUB_STEPS } from '@/lib/progress-store'
import { SUBSCRIPTION_PLANS } from '@/lib/subscription-plans'
import {
  COMPLETION_CERTIFICATE_TITLE,
  MIN_SECTIONS_FOR_PROGRESS_RECORD,
  PROGRESS_RECORD_TITLE,
  countCompletedSections,
  progressDocumentKind,
} from '@/lib/progress-document'

const TOTAL = 52

function render(sectionsCompleted: number, userName = 'Ana Quispe'): string {
  return generateCertificateHTML({
    userName,
    sectionsCompleted,
    totalSections: TOTAL,
    date: '28 de septiembre de 2026',
  })
}

/** What a reader of the printed page sees: the stylesheet and the tags gone. */
function visibleText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
}

/** A whole word, with letter boundaries that understand accents (JS `\b` does not). */
const word = (src: string) => new RegExp(`(?<!\\p{L})(?:${src})(?!\\p{L})`, 'iu')

/** Terms reserved to universities, institutes and accreditation bodies, or read as such. */
const RESERVED_TERMS: Array<[string, RegExp]> = [
  ['diploma / diplomado', word('diploma(?:do)?s?')],
  ['certificación', word('certificaci[oó]n(?:es)?')],
  ['acreditado', word('acreditad[oa]s?|acreditaci[oó]n')],
  ['oficial / validez oficial', word('oficial(?:es)?')],
  ['título', word('t[ií]tulos?')],
  ['grado', word('grados?')],
  ['créditos', word('cr[eé]ditos?')],
  ['avalado por', word('avalad[oa]s?')],
]

function reservedTermsIn(text: string): string[] {
  return RESERVED_TERMS.filter(([, re]) => re.test(text)).map(([name]) => name)
}

/**
 * "Esto es solo X, no Y": the document states what the learner completed and stops there. It
 * does not hedge what it is. (The PSF line says whose trademark Python is; it hedges nothing.)
 */
const HEDGE = word('no (?:es|son|una?|equivalen?|constituyen?|reemplazan?|sustituyen?)|solo|únicamente|registro de progreso|curso libre')

// ── Which document ───────────────────────────────────────────────────────────

test('below the minimum there is no document to issue', () => {
  assert.equal(progressDocumentKind(MIN_SECTIONS_FOR_PROGRESS_RECORD - 1, TOTAL), null)
  assert.throws(() => render(MIN_SECTIONS_FOR_PROGRESS_RECORD - 1))
})

test('at 8 of 52 sections the document is a constancia de progreso', () => {
  assert.equal(MIN_SECTIONS_FOR_PROGRESS_RECORD, 8)
  const text = visibleText(render(8))
  assert.match(text, new RegExp(PROGRESS_RECORD_TITLE))
  assert.match(text, /Se deja constancia de que/)
  assert.match(text, /ha completado 8 de 52 secciones/)
  assert.doesNotMatch(text, /certificado de finalizaci[oó]n/i)
  assert.doesNotMatch(text, /se certifica/i)
})

test('one section short of the end it is still a constancia', () => {
  assert.equal(progressDocumentKind(TOTAL - 1, TOTAL), 'constancia')
  const text = visibleText(render(TOTAL - 1))
  assert.match(text, new RegExp(PROGRESS_RECORD_TITLE))
  assert.doesNotMatch(text, /certificado de finalizaci[oó]n/i)
})

test('only at 52 of 52 is it a certificado de finalización', () => {
  assert.equal(progressDocumentKind(TOTAL, TOTAL), 'certificado')
  const text = visibleText(render(TOTAL))
  assert.match(text, new RegExp(COMPLETION_CERTIFICATE_TITLE))
  assert.match(text, /ha completado las 52 secciones/)
  assert.doesNotMatch(text, new RegExp(PROGRESS_RECORD_TITLE))
})

test('an empty course never reads as completed', () => {
  assert.equal(progressDocumentKind(8, 0), null)
})

// ── What it says ─────────────────────────────────────────────────────────────

test('every figure on the document is the learner’s own, with no fixed course-wide totals', () => {
  for (const n of [8, 30, TOTAL]) {
    const html = render(n)
    const figures = [...html.matchAll(/class="stat-value">([^<]*)</g)].map((m) => m[1])
    assert.deepEqual(figures, [`${n}/${TOTAL}`], `n=${n}`)
    const text = visibleText(html)
    assert.doesNotMatch(text, /1040/)
    assert.doesNotMatch(text, /contenido total/i)
    assert.doesNotMatch(text, /proyectos integradores/i)
  }
})

test('the document uses no reserved term, not even to deny it', () => {
  for (const n of [8, TOTAL]) {
    assert.deepEqual(reservedTermsIn(visibleText(render(n))), [], `n=${n}`)
  }
})

test('the document carries no "only X, not Y" disclaimer', () => {
  for (const n of [8, TOTAL]) {
    assert.doesNotMatch(visibleText(render(n)), HEDGE, `n=${n}`)
  }
})

test('the document carries the PSF trademark notice, a non-affiliation line and no Python logo', () => {
  for (const n of [8, TOTAL]) {
    const html = render(n)
    const text = visibleText(html)
    assert.match(text, /«Python» y los logotipos de Python son marcas de la Python Software Foundation\./)
    assert.match(text, /PyArcana no está afiliado a la Python Software Foundation/)
    assert.doesNotMatch(html, /<img|<svg|data:image|url\(/i)
  }
})

test('the learner’s name is printed as text, not markup', () => {
  const html = render(8, '<img src=x onerror=alert(1)>')
  assert.doesNotMatch(html, /<img src=x/)
  assert.match(html, /&lt;img src=x onerror=alert\(1\)&gt;/)
})

// ── What counts as completed ─────────────────────────────────────────────────

test('completion counts only the course’s own sections with all of their sub-steps', () => {
  const ids = Object.keys(SECTION_NAMES)
  const all = Object.fromEntries(ids.map((id) => [id, [...SUB_STEPS]]))
  assert.equal(countCompletedSections(all, ids, SUB_STEPS), TOTAL)

  const madeUp = Object.fromEntries(Array.from({ length: 60 }, (_, i) => [`not-a-section-${i}`, [...SUB_STEPS]]))
  assert.equal(countCompletedSections(madeUp, ids, SUB_STEPS), 0, 'unknown section ids')

  const fiveOfAnything = Object.fromEntries(ids.map((id) => [id, ['a', 'b', 'c', 'd', 'e']]))
  assert.equal(countCompletedSections(fiveOfAnything, ids, SUB_STEPS), 0, 'five unknown sub-steps')

  const oneShort = Object.fromEntries(ids.map((id) => [id, SUB_STEPS.slice(1)]))
  assert.equal(countCompletedSections(oneShort, ids, SUB_STEPS), 0, 'a sub-step missing')

  const joined = Object.fromEntries(ids.map((id) => [id, SUB_STEPS.join('') as unknown as string[]]))
  assert.equal(countCompletedSections(joined, ids, SUB_STEPS), 0, 'a string is not a list of sub-steps')

  assert.equal(countCompletedSections(all, ids, []), 0, 'no sub-steps to check')
})

test('the section list the document counts against is the course’s', () => {
  assert.deepEqual(Object.keys(SECTION_NAMES), COURSE_SECTIONS.map((s) => s.id))
})

// ── The same name everywhere ─────────────────────────────────────────────────

const PRICING_MARKUP = renderToStaticMarkup(
  createElement(PricingPage, { onSelectPlan: () => {}, onOpenAuth: () => {}, isAuthenticated: false }),
)
/** The pricing page as a visitor reads it, plan cards and FAQ included. */
const PRICING_PAGE = visibleText(PRICING_MARKUP)
const SPANISH: Language[] = ['es-PE', 'es-ES']

test('the i18n strings name both documents with the document’s own titles', () => {
  for (const lang of SPANISH) {
    assert.equal(t('reports.progressRecord', lang), PROGRESS_RECORD_TITLE, lang)
    assert.equal(t('reports.certificate', lang), COMPLETION_CERTIFICATE_TITLE, lang)
    assert.match(t('reports.progressRecordLocked', lang), new RegExp(`${MIN_SECTIONS_FOR_PROGRESS_RECORD} secciones`), lang)
    for (const key of ['reports.title', 'reports.desc', 'reports.progressRecordReady', 'reports.certificateReady']) {
      assert.doesNotMatch(t(key, lang), /completitud/i, `${lang} ${key}`)
      assert.deepEqual(reservedTermsIn(t(key, lang)), [], `${lang} ${key}`)
    }
  }
})

test('the pricing copy names the documents the same way and claims nothing reserved', () => {
  const pro = SUBSCRIPTION_PLANS.find((p) => p.code === 'pro')
  assert.ok(pro)
  const feature = pro.features.find((f) => /constancia|certificado/i.test(f))
  assert.ok(feature, 'the Pro plan lists the progress document')
  assert.match(feature, new RegExp(PROGRESS_RECORD_TITLE, 'i'))
  assert.match(feature, new RegExp(COMPLETION_CERTIFICATE_TITLE, 'i'))

  const planCopy = SUBSCRIPTION_PLANS.flatMap((p) => [p.description, p.tagline, ...p.features]).join(' | ')
  for (const copy of [planCopy, PRICING_PAGE]) {
    assert.doesNotMatch(copy, /completitud/i)
    assert.deepEqual(reservedTermsIn(copy), [])
  }
  assert.match(PRICING_PAGE, new RegExp(PROGRESS_RECORD_TITLE, 'i'))
  assert.match(PRICING_PAGE, new RegExp(COMPLETION_CERTIFICATE_TITLE, 'i'))
})

test('the pricing FAQ describes the documents without an "only X, not Y" disclaimer', () => {
  const answers = [...PRICING_MARKUP.matchAll(/<dd[^>]*>([^<]*)<\/dd>/g)]
    .map((m) => m[1])
    .filter((a) => /constancia|certificado/i.test(a))
  assert.ok(answers.length > 0, 'the FAQ answers what document a learner gets')
  for (const a of answers) assert.doesNotMatch(a, HEDGE, a)
})

test('the pricing copy claims as many capstone projects as the catalog holds', () => {
  assert.equal(CAPSTONES.length, TOTAL_CAPSTONES)
  const planCopy = SUBSCRIPTION_PLANS.flatMap((p) => p.features).join(' | ')
  const claims = [...`${planCopy} ${PRICING_PAGE}`.matchAll(/(\d+)\s+(?:proyectos\s+)?capstones?/gi)]
  assert.ok(claims.length > 0, 'the pricing copy states a capstone count')
  for (const [claim, count] of claims) assert.equal(Number(count), TOTAL_CAPSTONES, claim)
})
