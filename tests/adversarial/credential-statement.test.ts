/**
 * Adversarial guard: the signed capability statement says only what the badge catalog says.
 *
 * Every verified credential signs a statement (route issue, and the verify page shows it). The
 * route signed "critical evidence, hidden validation, and independent review", and no such claim
 * is in the catalog. The statement is now built from the catalog entry: each verified credential
 * names its own catalog name and specification version, and each claim phrase it makes must be
 * the English of a phrase in that badge's Spanish public_claim.
 *
 * Run: node --import tsx --test tests/adversarial/credential-statement.test.ts
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { capabilityStatement } from '../../src/lib/credential-statement.ts'
import { loadBadgeSpecs } from '../../src/lib/eligibility/badge-specs.ts'

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..', '..')

/** Phrases the defect signed. None is in the catalog. */
const UNBACKED = ['critical evidence', 'hidden validation', 'independent review']

/**
 * Each English claim phrase a statement may make, with the Spanish phrase of the catalog's
 * public_claim it renders. A phrase is accepted only if both halves hold.
 */
const CLAIM_PHRASES: Record<string, string> = {
  'independently demonstrated': 'demostró independientemente',
  'major capstone': 'capstone mayor',
  'with a defense': 'evaluación con defensa',
  'tamper-evident evidence': 'evidencia a prueba de manipulación',
  'public verification': 'verificación pública',
}

const VERIFIED = [...loadBadgeSpecs().specs.values()].filter(
  (spec) => spec.credential_type === 'verified_credential'
)

/** The catalog's own public_claim, read from the catalog file rather than through the loader. */
const CATALOG_CLAIMS: Map<string, string> = new Map(
  (JSON.parse(readFileSync(join(ROOT, 'src/lib/eligibility/badge_catalog.json'), 'utf8')).badges as {
    badge_id: string
    public_claim: string
  }[]).map((b) => [b.badge_id, b.public_claim])
)

function publicClaim(badgeId: string): string {
  const claim = CATALOG_CLAIMS.get(badgeId)
  if (!claim) throw new Error(`${badgeId} has no public_claim in the catalog`)
  return claim
}

describe('capabilityStatement', () => {
  it('there are five verified credentials to check', () => {
    assert.equal(VERIFIED.length, 5)
  })

  for (const spec of VERIFIED) {
    it(`${spec.badge_id} names the catalog's own name and version, and makes only catalog claims`, () => {
      const statement = capabilityStatement(spec)

      assert.ok(statement.includes(spec.name), `statement lacks the catalog name "${spec.name}"`)
      assert.ok(statement.includes(spec.version), `statement lacks the catalog version ${spec.version}`)
      assert.doesNotMatch(statement, /[{}]/, 'a placeholder was left unfilled')
      for (const phrase of UNBACKED) {
        assert.doesNotMatch(statement, new RegExp(phrase, 'i'), `statement signs "${phrase}"`)
      }
      for (const [english, spanish] of Object.entries(CLAIM_PHRASES)) {
        assert.ok(statement.includes(english), `statement lacks the claim "${english}"`)
        assert.ok(
          publicClaim(spec.badge_id).includes(spanish),
          `"${english}" has no source in the catalog claim of ${spec.badge_id}`
        )
      }
    })
  }

  it('a version or name containing "$" is inserted literally, not as a replacement pattern', () => {
    const statement = capabilityStatement({ name: 'Cost $& Tax', version: '1.0.0' })
    assert.ok(statement.includes('Cost $& Tax'), statement)
  })
})
