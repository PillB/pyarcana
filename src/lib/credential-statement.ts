/**
 * The statement a verified credential signs: the claim the badge's catalog entry makes, in English.
 *
 * The catalog's public_claim for a verified credential names four things: a major capstone, an
 * assessment with a defense, tamper-evident evidence and public verification. The English template
 * states those four and nothing else. {name} and {version} are the catalog's own name and
 * specification version for the badge, so nothing a client sends is written into the statement.
 */
import type { BadgeSpec } from './eligibility/types'

const CAPABILITY_STATEMENT =
  'The learner independently demonstrated {name} through a major capstone, in an assessment with a defense, with tamper-evident evidence, with public verification, under PyArcana Specification {version}.'

export function capabilityStatement(spec: Pick<BadgeSpec, 'name' | 'version'>): string {
  return CAPABILITY_STATEMENT.replace('{name}', () => spec.name).replace('{version}', () => spec.version)
}
