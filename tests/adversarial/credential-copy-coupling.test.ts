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
