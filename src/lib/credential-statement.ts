/**
 * The statement a verified credential signs: the claim the badge's catalog entry makes, in English.
 *
 * The catalog's public_claim for a verified credential names four things: a major capstone, an
 * assessment with a defense, a signed credential record that reveals any change to it, and public
 * verification. The English template states those four and nothing else. {name} and {version} are
 * the catalog's own name and specification version for the badge, so nothing a client sends is
 * written into the statement.
 *
 * The third clause is about the RECORD. The HMAC signature the issue route puts on a credential
 * covers the credential's own fields (badge, version, class, statement, date, status, holder,
 * issuer); it does not cover the exam answers, scores or project work behind it, so the clause
 * must not say the evidence reveals alteration (owner decision O25, 2026-10-14).
 */
import type { BadgeSpec } from './eligibility/types'

const CAPABILITY_STATEMENT =
  'The learner independently demonstrated {name} through a major capstone, in an assessment with a defense, with a signed credential record that reveals any changes to it, with public verification, under PyArcana Specification {version}.'

export function capabilityStatement(spec: Pick<BadgeSpec, 'name' | 'version'>): string {
  return CAPABILITY_STATEMENT.replace('{name}', () => spec.name).replace('{version}', () => spec.version)
}
