/**
 * Public API for the PyArcana eligibility engine.
 *
 * Import surface:
 *
 *   import {
 *     EligibilityEngine,
 *     loadBadgeSpecs,
 *     EDITION_STATIC,
 *     EDITION_DYNAMIC,
 *     STATE_AWARDED,
 *     type EligibilityReport,
 *     type LearnerProgress,
 *   } from '@/lib/eligibility'
 *
 * Static-edition callers MUST use `EDITION_STATIC`; the engine will
 * return `eligible_pending_verification` (preview) instead of `awarded`
 * for competency badges, and will refuse to issue capstone credentials.
 *
 * Dynamic-edition (LMS) callers use `EDITION_DYNAMIC`; the engine models
 * the server-signed state by returning `awarded` once all gates pass.
 * The actual cryptographic signing happens in the LMS badge service
 * (`src/lib/badge/state_machine.ts`, future Phase) — this engine only
 * computes eligibility.
 *
 * Catalog versioning: the engine refuses to evaluate against a catalog
 * whose version doesn't match the engine's `catalogVersion`. Compare
 * `engine.catalogVersion` against the expected version before trusting
 * any report.
 */

export { EligibilityEngine } from './engine'
export {
  loadBadgeSpecs,
  parseBadgeSpec,
  getCatalogVersion,
} from './badge-specs'
export type { BadgeCatalog } from './badge-specs'

export * from './types'
