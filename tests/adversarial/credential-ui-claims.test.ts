/**
 * Adversarial guard: the credential copy states only what the product does, on every build.
 *
 * The course dashboard, the badge notice and the credential policy described a local badge
 * preview, a supervisor who verifies badges, a "verified award" the learner could invite a
 * supervisor to confirm, independent review, identity checks, and revocation and versioning
 * procedures. Today no competence badge is computed or shown as earned, no supervisor verifies a
 * badge, no credential is issued, and no route revokes or supersedes one. A learner reading those
 * pages was promised a process that is not there.
 *
 * Three kinds of check, because a deny-list of the old wording alone passes a reworded false claim:
 *
 *  1. DENY-LISTS. The old wording, and the claims that are false on some build: "no sign-in",
 *     "only in this browser" and "the account edition" are true on one build and false on another
 *     (the pyarcana.dev static build has cloud accounts; the GitHub Pages one has none), and these
 *     pages show the same words on both. A claim about storage or accounts belongs to
 *     ProgressWhere, which picks its sentence by stage (credential-copy-stages.test.ts).
 *  2. FAMILIES. A supervisor, a preview, a revocation or a version-supersession sentence may appear
 *     only as the statement that no such procedure exists.
 *  3. THE RENDERED DASHBOARD CARD. It is read as a learner reads it: no clause repeated between the
 *     introduction, the list and the boxes, the two pinned disclaimer phrases present once, and no
 *     mention of storage, accounts, exams or thresholds, which the card has no business stating.
 *
 * Run: node --import tsx --test tests/adversarial/credential-ui-claims.test.ts
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { BadgeExplainer } from '../../src/components/course/Dashboard.tsx'

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..', '..')

const PAGES = [
  'src/components/course/Dashboard.tsx',
  'src/app/badge-notice/page.tsx',
  'src/app/credential-policy/page.tsx',
]

/** Claims the product does not back, lower case, matched against whitespace-normalised source. */
const FALSE_CLAIMS = [
  // A local badge preview, computed in the browser and kept only there.
  'vista previa local',
  'local preview',
  'vista previa de tu elegibilidad',
  'se calcula en tu navegador',
  'convierte una vista previa',
  'turns a preview',
  // A supervisor who verifies badges, and a learner who invites one.
  'supervisor de tu cohorte puede verificar',
  'supervisor in your cohort can verify',
  'invitar a un supervisor a verificar',
  'invite a supervisor to verify',
  // A verified award that exists today.
  'insignia verificada',
  // Evidence, review and identity steps the server does not run.
  'registro de evidencia y revisión',
  'requiere revisión independiente',
  'identidad verificada',
  'evaluación independiente,',
  'comunicación técnica',
  'es la credencial más fuerte',
  'pasaste las puertas críticas',
  // Badges that show what was proven, though none is shown as earned.
  'lo que un badge sí prueba',
  'what a badge proves',
  'una insignia de pyarcana prueba que',
  'alcanzaste el umbral de la rúbrica',
  'you met the rubric threshold',
  'produciste la evidencia pedida',
  'badges muestran lo que practicaste',
  'badges show what you practised',
  'las credenciales verificadas muestran lo que demostraste',
  'verified credentials show what you demonstrated',
  'demuestra una capacidad acotada',
  'demuestra transferencia entre secciones',
  // Prevention, where the product only detects: the server's signature shows a changed credential
  // when it is checked and stops no one from editing it (owner decision O25, 2026-10-13).
  'a prueba de manipulación',
  'a prueba de alteración',
  'tamper-proof',
  'tamper proof',
  // A revocation and versioning procedure that no route implements.
  'puede revocarse',
  'pueden marcarse como',
  'la revocación incluye',
  'pueden requerir evidencia adicional',
]

/**
 * Claims about accounts, sign-in and storage that are true on one build and false on another.
 * Review finding (major): "La edición pública no tiene inicio de sesión ni servidor" was shown on
 * the pyarcana.dev build, where learners sign in and progress syncs to a server.
 */
const STAGE_DEPENDENT_CLAIMS = [
  'no tiene inicio de sesión',
  'no hay inicio de sesión',
  'sin inicio de sesión',
  'ni servidor',
  'no sign-in',
  'has no sign-in',
  'no accounts',
  'sin cuentas',
  'no tiene cuentas',
  'solo en este navegador',
  'sólo en este navegador',
  'only in this browser',
  'only in your browser',
  'edición con cuenta',
  'account edition',
  'guardada solo',
]

/** A sentence about these topics may appear only as the statement that no such procedure exists. */
const PROCEDURE_FAMILIES: ReadonlyArray<{ topic: RegExp; allowed: RegExp }> = [
  { topic: /revoc|revoque|revoked|revok/i, allowed: /^(?:revocación|verificación y revocación)$|no existe un procedimiento que revoque/i },
  { topic: /versión anterior|marque una credencial/i, allowed: /no existe un procedimiento que marque una credencial emitida/i },
  { topic: /supervisor/i, allowed: /^$/ },
  { topic: /vista previa|preview/i, allowed: /^$/ },
]

function normalised(file: string): string {
  return readFileSync(join(ROOT, file), 'utf8').replace(/\s+/g, ' ').toLowerCase()
}

/** The JSX text of a page (from its `return (`): tags and expressions out, one string per element, trimmed. */
function textNodes(source: string): string[] {
  return source
    .slice(source.indexOf('return ('))
    .replace(/\{[^{}]*\}/g, '\u0000')
    .split(/<[^>]*>/)
    .flatMap((chunk) => chunk.split('\u0000'))
    .map((chunk) => chunk.replace(/\s+/g, ' ').trim())
    .filter((chunk) => chunk.length > 0)
}

/** Sentences of `nodes` that name `topic` and are not `allowed`. */
function stray(nodes: string[], family: { topic: RegExp; allowed: RegExp }): string[] {
  return nodes
    .flatMap((node) => node.split(/(?<=[.!?])\s+/))
    .filter((sentence) => family.topic.test(sentence) && !family.allowed.test(sentence))
}

describe('credential copy states only what the product does', () => {
  for (const file of PAGES) {
    it(`${file} writes none of the unbacked claims`, () => {
      const source = normalised(file)
      assert.deepEqual(FALSE_CLAIMS.filter((claim) => source.includes(claim)), [], `unbacked claims in ${file}`)
    })

    it(`${file} writes no claim about sign-in, accounts or storage that is false on some build`, () => {
      const source = normalised(file)
      assert.deepEqual(STAGE_DEPENDENT_CLAIMS.filter((claim) => source.includes(claim)), [], `stage-dependent claims in ${file}`)
    })
  }

  for (const file of ['src/app/badge-notice/page.tsx', 'src/app/credential-policy/page.tsx']) {
    it(`${file}: supervisor, preview, revocation and version-supersession sentences only say no such procedure exists`, () => {
      const nodes = textNodes(readFileSync(join(ROOT, file), 'utf8'))
      assert.ok(nodes.length > 5, 'the text scan found almost no text, so it proves nothing')
      for (const family of PROCEDURE_FAMILIES) assert.deepEqual(stray(nodes, family), [], `${family.topic} in ${file}`)
    })
  }

  it('the family scan can fail: a reworded revocation promise is reported', () => {
    const family = PROCEDURE_FAMILIES[0]
    assert.deepEqual(stray(['Si hay fraude, PyArcana revocará la credencial. No existe un procedimiento que revoque una credencial emitida.'], family), [
      'Si hay fraude, PyArcana revocará la credencial.',
    ])
    assert.deepEqual(stray(['Un supervisor puede verificar tu insignia.'], PROCEDURE_FAMILIES[2]), ['Un supervisor puede verificar tu insignia.'])
  })
})

/** Every 4-word run (lower case, no punctuation) that two different strings share. */
function sharedFourGrams(nodes: string[]): string[] {
  const stringsWith = new Map<string, number>()
  for (const node of nodes) {
    const words = node.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean)
    const grams = new Set(words.slice(0, -3).map((_, i) => words.slice(i, i + 4).join(' ')))
    for (const gram of grams) stringsWith.set(gram, (stringsWith.get(gram) ?? 0) + 1)
  }
  return [...stringsWith].filter(([, count]) => count > 1).map(([gram]) => gram)
}

function renderedText(english: boolean): string[] {
  return renderToStaticMarkup(h(BadgeExplainer, { english }))
    .split(/<[^>]*>/)
    .map((chunk) => chunk.replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim())
    .filter(Boolean)
}

describe('the dashboard badge card, as a learner reads it', () => {
  for (const english of [false, true]) {
    const language = english ? 'en' : 'es'

    it(`says nothing twice (${language})`, () => {
      const nodes = renderedText(english)
      assert.ok(nodes.length >= 8, `the card rendered only ${nodes.length} strings`)
      assert.deepEqual(sharedFourGrams(nodes), [])
    })

    it(`keeps the pinned disclaimer exactly once (${language})`, () => {
      const phrase = english ? 'it is not a professional certification' : 'no es una certificación profesional'
      const text = renderedText(english).join(' ').toLowerCase()
      assert.equal(text.split(phrase).length - 1, 1, `"${phrase}" must appear once in the card`)
    })

    it(`states nothing about storage, accounts, exams, supervisors or thresholds (${language})`, () => {
      const text = renderedText(english).join(' ')
      assert.doesNotMatch(
        text,
        /navegador|sesión|servidor|cuenta|supervisor|70\s*%|examen|vista previa|browser|sign.?in|server|account|exam|preview/i
      )
    })

    it(`names the two labels the section cards carry (${language})`, () => {
      const text = renderedText(english).join(' ')
      assert.match(text, english ? /“Done”[\s\S]*“Next”/ : /«Hecho»[\s\S]*«Siguiente»/)
    })
  }

  it('the repeat scan can fail: the sentence the draft wrote twice is reported', () => {
    const draft = [
      '«Hecho» indica que terminaste los pasos de una sección. Nadie lo comprueba, no mide tu dominio y no se te otorga una insignia de competencia; no es una certificación profesional.',
      '«Hecho» indica que terminaste los pasos de una sección.',
      '«Siguiente» indica la sección que sigue en tu progreso.',
      'Estas etiquetas no miden tu dominio y nadie comprueba «Hecho».',
    ]
    assert.ok(sharedFourGrams(draft).includes('hecho indica que terminaste'), String(sharedFourGrams(draft)))
  })
})
