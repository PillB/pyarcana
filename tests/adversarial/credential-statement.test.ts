/**
 * Adversarial guard: the signed capability statement says exactly what the badge catalog says.
 *
 * Every verified credential signs a statement (the issue route signs it and the verify page shows
 * it under "Capacidad demostrada"). The route once signed "critical evidence, hidden validation,
 * and independent review", and no such claim is in the catalog. The statement is now built from
 * the catalog entry (src/lib/credential-statement.ts).
 *
 * A deny-list of the old phrases does not stop the next one. A clause appended to the template
 * ("with identity verification and a human reviewer") passed it. This guard is an allow-list in
 * both directions:
 *
 *   - the statement is cut into its clauses, and each clause must be one of RENDERINGS, whose
 *     Spanish side must be a clause of that badge's public_claim in the catalog;
 *   - the public_claim is cut the same way, and each of its clauses must be a RENDERINGS entry the
 *     statement makes, so a claim the catalog adds is a decision, not a silent omission.
 *
 * RENDERINGS is the one translation table. Each row is a claim a verified credential makes, so a
 * change to a row, or a new row, is a change to what a credential claims (AGENTS.md: ask first).
 * The file sits under /tests/, which CODEOWNERS protects; the template file does not.
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

/**
 * [English clause of the statement, Spanish clause of the catalog's public_claim it renders], in the
 * order the claim makes them.
 *
 * The fourth row is the one the owner changed twice (O25). The catalog used to say "evidencia a
 * prueba de manipulación", which reads as tamper-proof, while the server's HMAC signature only
 * shows a change after the fact (2026-10-13: "evidencia que revela cualquier alteración"). That
 * still read as if the learner's evidence showed the alteration, and the signature covers the
 * credential record (badge, version, class, statement, date, status, holder, issuer), not the exam
 * answers or the project behind it (2026-10-14). The clause now names the record. Each credential
 * whose claim text changed carries a higher version (credential-blockers.test.ts pins them).
 */
const RENDERINGS: ReadonlyArray<readonly [english: string, spanish: string]> = [
  ['The learner independently demonstrated', 'El aprendiz demostró independientemente'],
  ['through a major capstone', 'mediante capstone mayor'],
  ['in an assessment with a defense', 'evaluación con defensa'],
  ['with a signed credential record that reveals any changes to it', 'registro firmado de credencial cuya alteración queda revelada'],
  ['with public verification', 'verificación pública'],
  ['under PyArcana Specification', 'bajo la especificación PyArcana'],
]

const SEPARATOR = '\u0000'

/** The statement's clauses, with the badge name and the version taken out and the full stop dropped. */
function statementClauses(statement: string, name: string, version: string): string[] {
  return statement
    .split(name).join(SEPARATOR)
    .split(version).join(SEPARATOR)
    .replace(/\.$/, '')
    .split(new RegExp(`${SEPARATOR}|,`))
    .map((clause) => clause.trim())
    .filter(Boolean)
}

/** The public_claim's clauses, cut the same way: at the name, the version, a comma or " y ". */
function claimClauses(claim: string, name: string, version: string): string[] {
  return claim
    .split(name).join(SEPARATOR)
    .split(version).join(SEPARATOR)
    .replace(/\.$/, '')
    .split(new RegExp(`${SEPARATOR}|,| y `))
    .map((clause) => clause.trim())
    .filter(Boolean)
}

/**
 * What is wrong with `statement` against the catalog `claim` of the same badge. Empty when every
 * clause is allowed, in order, and backed by the claim, and the claim holds nothing the statement
 * leaves out.
 */
function problems(statement: string, claim: string, name: string, version: string): string[] {
  // The catalog's claim names the badge without the word "Integrated": find that span, not the name.
  const claimName = /independientemente (.+?) mediante/.exec(claim)?.[1] ?? name
  const found: string[] = []
  const english = statementClauses(statement, name, version)
  const spanish = claimClauses(claim, claimName, version)
  const allowed = RENDERINGS.map(([en]) => en)
  for (const clause of english) {
    if (!allowed.includes(clause)) found.push(`the statement makes a claim the catalog does not: "${clause}"`)
  }
  for (const [en, es] of RENDERINGS) {
    if (!english.includes(en)) found.push(`the statement leaves out "${en}"`)
    if (!spanish.includes(es)) found.push(`"${en}" has no source in the catalog claim: "${es}" is not a clause of it`)
  }
  for (const clause of spanish) {
    if (!RENDERINGS.some(([, es]) => es === clause)) found.push(`the catalog claims "${clause}" and the statement does not render it`)
  }
  if (new Set(english).size !== english.length) found.push(`the statement repeats a clause: ${english.join(' | ')}`)
  const known = english.filter((clause) => allowed.includes(clause))
  if (new Set(known).size === known.length && known.join('|') !== allowed.filter((en) => known.includes(en)).join('|')) {
    found.push(`the clauses are out of the catalog's order: ${known.join(' | ')}`)
  }
  return found
}

const VERIFIED = [...loadBadgeSpecs().specs.values()].filter((spec) => spec.credential_type === 'verified_credential')

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
  it('there are verified credentials to check', () => {
    assert.ok(VERIFIED.length >= 5, `only ${VERIFIED.length} verified credentials found`)
  })

  for (const spec of VERIFIED) {
    it(`${spec.badge_id}: names its own catalog name and version, and every clause is backed by the catalog claim`, () => {
      const statement = capabilityStatement(spec)
      assert.ok(statement.includes(spec.name), `statement lacks the catalog name "${spec.name}"`)
      assert.ok(statement.includes(spec.version), `statement lacks the catalog version ${spec.version}`)
      assert.doesNotMatch(statement, /[{}]/, 'a placeholder was left unfilled')
      assert.deepEqual(problems(statement, publicClaim(spec.badge_id), spec.name, spec.version), [])
    })
  }

  // The HMAC signature covers the credential record, not the exam answers or the project behind it
  // (owner decision O25, 2026-10-14). The clause that promises detection must name the record. The
  // pairing above cannot see this: a clause and its rendering can agree and both say "evidence".
  for (const spec of VERIFIED) {
    it(`${spec.badge_id}: the clause that reveals an alteration names the credential record, not the learner's evidence`, () => {
      const claim = publicClaim(spec.badge_id)
      const claimName = /independientemente (.+?) mediante/.exec(claim)?.[1] ?? spec.name
      const spanish = claimClauses(claim, claimName, spec.version).filter((clause) => /alteraci/i.test(clause))
      assert.equal(spanish.length, 1, `the catalog claim has ${spanish.length} clauses about an alteration: ${spanish.join(' | ')}`)
      assert.match(spanish[0], /registro/i, `the claim's alteration clause does not name the record: "${spanish[0]}"`)
      assert.doesNotMatch(spanish[0], /evidencia|prueba/i, `the claim's alteration clause speaks of evidence: "${spanish[0]}"`)

      const english = statementClauses(capabilityStatement(spec), spec.name, spec.version).filter((clause) => /alteration|changes|tamper/i.test(clause))
      assert.equal(english.length, 1, `the statement has ${english.length} clauses about an alteration: ${english.join(' | ')}`)
      assert.match(english[0], /\brecord\b/i, `the statement's alteration clause does not name the record: "${english[0]}"`)
      assert.doesNotMatch(english[0], /\bevidence\b/i, `the statement's alteration clause speaks of evidence: "${english[0]}"`)
    })
  }

  // The guard has to be able to fail. Each case is a statement the defect could have written.
  describe('the guard reports what a bad statement does wrong', () => {
    const spec = VERIFIED[0]
    const claim = publicClaim(spec.badge_id)
    const good = capabilityStatement(spec)
    const check = (statement: string) => problems(statement, claim, spec.name, spec.version)

    it('accepts the statement the template makes', () => {
      assert.deepEqual(check(good), [])
    })

    it('reports a clause added to the end', () => {
      const bad = good.replace(', under', ', with identity verification and a human reviewer, under')
      assert.match(check(bad).join('\n'), /identity verification and a human reviewer/)
    })

    it('reports the three claims the route used to sign', () => {
      const old = `The holder independently demonstrated ${spec.badge_id} by completing the capstone assessment under PyArcana Assessment Specification ${spec.version}, including critical evidence, hidden validation, and independent review.`
      const found = check(old).join('\n')
      assert.match(found, /critical evidence/)
      assert.match(found, /hidden validation/)
      assert.match(found, /independent review/)
    })

    it('reports a clause left out', () => {
      assert.match(check(good.replace(', with public verification', '')).join('\n'), /leaves out "with public verification"/)
    })

    it('reports clauses out of the catalog order', () => {
      const bad = good.replace(
        'in an assessment with a defense, with a signed credential record that reveals any changes to it',
        'with a signed credential record that reveals any changes to it, in an assessment with a defense'
      )
      assert.notEqual(bad, good, 'the statement no longer has the clauses this case swaps')
      assert.match(check(bad).join('\n'), /out of the catalog's order/)
    })

    it('reports a clause the catalog does not make, even when the statement keeps the allowed ones', () => {
      const bad = good.replace('with public verification', 'with public verification, with revocation')
      assert.match(check(bad).join('\n'), /"with revocation"/)
    })

    it('reports a catalog claim the statement does not render', () => {
      const widened = claim.replace(' y verificación pública', ', verificación pública y revocación')
      assert.notEqual(widened, claim, 'the catalog claim no longer has the shape this case widens')
      assert.match(problems(good, widened, spec.name, spec.version).join('\n'), /the catalog claims "revocación"/)
    })

    it('reports a rendering whose Spanish is not in the catalog claim', () => {
      const narrowed = claim.replace('evaluación con defensa, ', '')
      assert.match(problems(good, narrowed, spec.name, spec.version).join('\n'), /"in an assessment with a defense" has no source/)
    })
  })

  it('a version or name containing "$" is inserted literally, not as a replacement pattern', () => {
    const statement = capabilityStatement({ name: 'Cost $& Tax', version: '1.0.0' })
    assert.ok(statement.includes('Cost $& Tax'), statement)
  })
})
