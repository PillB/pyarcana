/**
 * Adversarial guard: each "today" sentence of the credential copy is tied to the code that makes it true.
 *
 * The credential policy and the badge notice now say what PyArcana does today: it issues no
 * credential, nothing revokes or supersedes one, /verify can check an identifier only in the
 * dynamic LMS, and the server grades the exams. Those sentences are true because of code. When the
 * code changes (a credential store ships, a revocation route is added), a sentence nobody opens
 * stays on the page and is false, and no test fails: the defect this PR fixes, one step later.
 *
 * Each case below states the sentence it protects, finds the sentence on the page (so rewording it
 * cannot silently turn the case off), and asserts the code fact. A case fails when the code moves
 * and the sentence still stands; the failure says which page to change.
 *
 * Run: node --experimental-test-module-mocks --import tsx --test tests/adversarial/credential-copy-coupling.test.ts
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { COURSE_SECTIONS } from '../../src/lib/course/index.ts'
import { issuanceBlockers } from '../../src/lib/credential-blockers.ts'
import { credentialSpec } from '../../src/lib/credential-gates.ts'
import { SERVER_VERIFIERS } from '../../src/lib/credential-verifiers.ts'
import { loadBadgeSpecs } from '../../src/lib/eligibility/badge-specs.ts'
import { EDITION_DYNAMIC } from '../../src/lib/eligibility/types.ts'
import { examSubmitSchema } from '../../src/lib/exam-scoring.ts'

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..', '..')
const POLICY = 'src/app/credential-policy/page.tsx'
const NOTICE = 'src/app/badge-notice/page.tsx'

function source(file: string): string {
  return readFileSync(join(ROOT, file), 'utf8')
}

function flat(file: string): string {
  return source(file).replace(/\s+/g, ' ')
}

/** Every .ts and .tsx file under `dir`, relative to the repository, tests and course content left out. */
function srcFiles(dir = 'src'): string[] {
  return readdirSync(join(ROOT, dir)).flatMap((name) => {
    const path = join(dir, name)
    if (path === 'src/lib/course' || /__tests__/.test(path)) return []
    if (statSync(join(ROOT, path)).isDirectory()) return srcFiles(path)
    return /\.tsx?$/.test(name) && !/\.test\./.test(name) ? [relative(ROOT, join(ROOT, path))] : []
  })
}

const VERIFIED = [...loadBadgeSpecs().specs.values()].filter((spec) => spec.credential_type === 'verified_credential')

describe('"PyArcana issues no credential today"', () => {
  it('the policy still says so for classes B, C and D (so this case still guards a sentence)', () => {
    const page = flat(POLICY)
    for (const sentence of [
      'Hoy, PyArcana no emite insignias de competencia de clase B.',
      'Hoy, PyArcana no emite insignias integradas de clase C.',
      'Hoy, PyArcana no emite ninguna credencial verificada de clase D.',
    ]) {
      assert.ok(page.includes(sentence), `the credential policy no longer says "${sentence}"; update this case with the new wording`)
    }
  })

  it('class D: the code refuses every verified credential, even to a learner who passed every exam', () => {
    const evidence = {
      examAttempts: COURSE_SECTIONS.map((s) => ({ sectionId: s.id, score: 100, completedAt: new Date('2026-09-01T12:00:00Z') })),
      edition: EDITION_DYNAMIC,
    }
    assert.ok(VERIFIED.length >= 5, `only ${VERIFIED.length} verified credentials found`)
    for (const spec of VERIFIED) {
      const blockers = issuanceBlockers(spec, evidence, SERVER_VERIFIERS)
      assert.ok(
        blockers.length > 0,
        `${spec.badge_id} can be issued now: the credential policy and the badge notice still say PyArcana issues none. Change both pages.`
      )
    }
  })

  it('classes B and C: no route can issue a competency or integrated badge', () => {
    const others = [...loadBadgeSpecs().specs.values()].filter((spec) => spec.credential_type !== 'verified_credential')
    assert.ok(others.length >= 20, `only ${others.length} other badges found`)
    for (const spec of others) assert.equal(credentialSpec(spec.badge_id), undefined, `${spec.badge_id} is issuable`)
    const routes = srcFiles('src/app/api').filter((file) => /\/(?:credentials|badges?|awards?)\//.test(file))
    assert.deepEqual(routes, ['src/app/api/credentials/issue/route.ts', 'src/app/api/credentials/verify/route.ts'])
  })
})

describe('"No procedure revokes a credential or marks it as an older version"', () => {
  it('both pages still say so', () => {
    assert.ok(flat(POLICY).includes('No existe un procedimiento que revoque una credencial emitida'), 'the policy no longer says it')
    assert.ok(flat(POLICY).includes('No existe un procedimiento que marque una credencial emitida como perteneciente a una versión anterior'))
    assert.ok(flat(NOTICE).includes('No existe un procedimiento que revoque una credencial emitida'), 'the notice no longer says it')
    assert.ok(flat(NOTICE).includes('No existe un procedimiento que marque una credencial emitida como perteneciente a una versión anterior'))
  })

  it('no code in src/ sets a credential to any status but "active", or sets a superseding version', () => {
    const writers = srcFiles()
      .filter((file) => /\brevocationStatus\s*[:=]\s*['"`](?!active\b)|\bsupersedingVersion\s*[:=]/.test(source(file)))
    assert.deepEqual(writers, [], 'a revocation or supersession is now written; the policy and notice say none exists. Change both pages.')
  })

  it('the issue route records every credential as active, and the credential API has no other routes', () => {
    assert.match(source('src/app/api/credentials/issue/route.ts'), /revocationStatus: 'active'/)
    const dirs = readdirSync(join(ROOT, 'src/app/api/credentials')).sort()
    assert.deepEqual(dirs, ['issue', 'verify'])
  })

  it('the catalog carries version numbers like the 1.0.0 and 1.1.0 the pages cite', () => {
    const versions = new Set([...loadBadgeSpecs().specs.values()].map((spec) => spec.version))
    assert.ok(versions.has('1.0.0') && versions.has('1.1.0'), [...versions].join(', '))
  })
})

describe('"/verify checks an identifier only in the dynamic LMS"', () => {
  it('the policy names the LMS and the label the verify page shows', () => {
    const page = flat(POLICY)
    assert.match(page, /En el LMS dinámico \([^)]+\), puedes comprobar una credencial verificada en \/verify/, 'the policy no longer names the LMS')
    assert.ok(page.includes('«Capacidad demostrada»'))
  })

  it('the verify page shows that label, and tells a static build that verification is unavailable', () => {
    const verify = flat('src/app/verify/page.tsx')
    assert.ok(verify.includes('Capacidad demostrada:'))
    assert.ok(verify.includes('no está disponible en la edición pública'))
    assert.match(verify, /IS_STATIC_SITE/)
  })
})

/**
 * What a check of a verified credential shows: each fact the policy lists, with the field the verify
 * route returns for it and the label the verify page prints. The policy once said a recruiter "can
 * inspect a concise evidence summary"; no route or page shows any evidence, so a learner or a
 * recruiter was promised a view that does not exist (review of #97, minor 2).
 */
const SHOWN_BY_A_CHECK: ReadonlyArray<{ policy: string; field: string; label: string }> = [
  { policy: 'clase', field: 'credentialClass', label: 'Clase {result.credentialClass}' },
  { policy: 'nombre de la insignia', field: 'badgeName', label: 'Insignia:' },
  { policy: 'especificación', field: 'specificationVersion', label: 'Especificación:' },
  { policy: 'emisor', field: 'issuer', label: 'Emisor:' },
  { policy: 'fecha de emisión', field: 'issuedAt', label: 'Emitida:' },
  { policy: 'estado', field: 'revocationStatus', label: 'Estado:' },
  { policy: 'referencia al titular', field: 'holderReference', label: 'Titular:' },
  { policy: 'declaración firmada', field: 'capabilityStatement', label: 'Capacidad demostrada:' },
]

/** The sentence of the policy that lists what a check shows. */
function checkSentence(): string {
  const found = flat(POLICY).match(/Comprobar una credencial verificada muestra [^.]*\./)
  assert.ok(found, 'the credential policy no longer has the sentence that lists what a check shows; update this case with the new wording')
  return found[0]
}

describe('"A check of a verified credential shows the record and the signed statement, and no evidence"', () => {
  it('the policy lists what a check shows, and promises no evidence summary and no recruiter view', () => {
    const page = flat(POLICY).toLowerCase()
    for (const promise of ['resumen conciso de evidencia', 'reclutador puede inspeccionar', 'con qué evidencia']) {
      assert.ok(!page.includes(promise), `the credential policy promises "${promise}"`)
    }
    const sentence = checkSentence()
    for (const { policy } of SHOWN_BY_A_CHECK.filter((fact) => fact.policy !== 'declaración firmada')) {
      assert.ok(sentence.includes(policy), `the sentence no longer lists "${policy}"`)
    }
    assert.ok(flat(POLICY).includes('La declaración firmada nombra'), 'the policy no longer describes the signed statement')
  })

  it('the verify route returns each listed fact, and the verify page prints its label', () => {
    const route = source('src/app/api/credentials/verify/route.ts')
    const page = flat('src/app/verify/page.tsx')
    for (const { policy, field, label } of SHOWN_BY_A_CHECK) {
      assert.match(route, new RegExp(`\\b${field}: credential\\.${field}`), `the verify route no longer returns ${field}, which the policy lists as "${policy}"`)
      assert.ok(page.includes(label), `the verify page no longer prints "${label}", which the policy lists as "${policy}"`)
    }
  })

  it('no route, page or module in src/ shows or reads credential evidence, so the policy has none to promise', () => {
    const route = source('src/app/api/credentials/verify/route.ts')
    const page = source('src/app/verify/page.tsx')
    assert.doesNotMatch(route, /evidence/i, 'the verify route now returns evidence; the policy must say so')
    assert.doesNotMatch(page, /evidenc/i, 'the verify page now shows evidence; the policy must say so')
    const readers = srcFiles().filter((file) => /credentialEvidence|evidenceSummary/.test(source(file)))
    assert.deepEqual(readers, [], 'something reads the credential evidence table; the policy must say what it shows')
  })
})

/**
 * The policy's "Política de IA" once said AI tools are allowed "sujeto a declaración, ejecución
 * independiente, explicación de decisiones importantes y defensa frente a requisitos modificados".
 * The server records no declaration of AI use and no defense, oral or written: the only evidence it
 * holds is ExamAttempt rows (credential-verifiers.ts), and no page, route or table asks for either.
 * The section now says so; this case keeps it true.
 */
describe('"PyArcana records no declaration of AI use and no defense"', () => {
  it('the policy says so, and no longer promises a declaration, an explanation of decisions or a defense', () => {
    const page = flat(POLICY)
    assert.ok(page.includes('no registra ninguna declaración ni defensa'), 'the policy no longer says nothing records a declaration or a defense')
    for (const promise of ['sujeto a declaración', 'explicación de decisiones importantes', 'defensa frente a requisitos modificados']) {
      assert.ok(!page.includes(promise), `the credential policy promises "${promise}"`)
    }
  })

  it('the server has a verifier for the exams and for nothing else, so it holds no defense or declaration', () => {
    assert.deepEqual(Object.keys(SERVER_VERIFIERS), ['section_exams'], 'a verifier was added; the policy says no declaration or defense is recorded. Change it.')
  })

  it('no table, route or page of the app has a field or a path for a defense or an AI declaration', () => {
    const schema = source('prisma/schema.prisma')
    assert.doesNotMatch(schema, /defens[ae]|aiDeclaration|ai_declaration|declaration/i, 'the schema now has a defense or a declaration; the policy says none is recorded')
    const routes = srcFiles('src/app/api').filter((file) => /defens|declaration|ai-use|aiuse/i.test(file))
    assert.deepEqual(routes, [], 'a route for a defense or a declaration exists; the policy says none is recorded')
    const asking = srcFiles('src/components').filter((file) => /Defens|AiDeclaration|AIDeclaration/.test(file))
    assert.deepEqual(asking, [], 'a component for a defense or a declaration exists; the policy says no page asks for one')
  })
})

describe('"The server grades each exam; the browser does not"', () => {
  it('the notice still says so, in the paragraph only the dynamic LMS shows', () => {
    assert.ok(flat('src/components/legal/ExamGradingNote.tsx').includes('el servidor califica cada examen de sección'))
    assert.ok(source(NOTICE).includes('<ExamGradingNote />'))
  })

  it('the submit route grades from the stored key, and the request has no field that carries a score', () => {
    const route = source('src/app/api/exam/submit/route.ts')
    assert.match(route, /gradeExamAnswers\(/)
    const parsed = examSubmitSchema.safeParse({
      attemptId: 'a',
      answers: [{ questionId: 'q', selectedIndex: 0, correct: true, isCorrect: true }],
      timeSpentSec: 1,
      score: 100,
      passed: true,
    })
    assert.ok(parsed.success)
    assert.deepEqual(Object.keys(parsed.data).sort(), ['answers', 'attemptId', 'timeSpentSec'])
    assert.deepEqual(Object.keys(parsed.data.answers[0]).sort(), ['questionId', 'selectedIndex'])
  })
})
