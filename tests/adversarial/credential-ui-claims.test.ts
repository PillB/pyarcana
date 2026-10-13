/**
 * Adversarial guard: the credential copy states only what the product does today.
 *
 * The course dashboard, the badge notice and the credential policy described a local badge
 * preview, a supervisor who verifies badges, a "verified award" the learner could invite a
 * supervisor to confirm, independent review, identity checks, and revocation and versioning
 * procedures. Today no competence badge is computed or shown as earned, no supervisor verifies a
 * badge, the server issues no credential (the standing blocker CREDENTIAL_STORE_NOT_IMPLEMENTED
 * refuses every request), and no route revokes or supersedes one. A learner reading those pages
 * was promised a process that is not there.
 *
 * Each phrase below is a claim from that copy. The test reads the source of the three pages and
 * fails if any of the phrases is written back, lower case, with whitespace normalised.
 *
 * Run: node --import tsx --test tests/adversarial/credential-ui-claims.test.ts
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

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
  // A revocation and versioning procedure that no route implements.
  'puede revocarse',
  'pueden marcarse como',
  'la revocación incluye',
  'pueden requerir evidencia adicional',
]

function normalised(file: string): string {
  return readFileSync(join(ROOT, file), 'utf8').replace(/\s+/g, ' ').toLowerCase()
}

describe('credential copy states only what the product does', () => {
  for (const file of PAGES) {
    it(`${file} writes none of the unbacked claims`, () => {
      const source = normalised(file)
      const found = FALSE_CLAIMS.filter((claim) => source.includes(claim))
      assert.deepEqual(found, [], `unbacked claims in ${file}`)
    })
  }
})
