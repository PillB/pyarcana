/**
 * Badge specifications loader.
 *
 * Loads `industry_alignment/badge_catalog.json` and produces versioned
 * in-memory `BadgeSpec` objects. The loader is deterministic: the same
 * catalog file always produces the same specs. Specs are immutable
 * once loaded.
 *
 * Catalog versioning: the engine refuses to evaluate against a catalog
 * whose version doesn't match the version the engine was constructed
 * with. This prevents silent spec changes from invalidating a learner's
 * eligibility report.
 */

import type { BadgeSpec, ComponentSpec } from './types'
import { GAP_AFFECTED_COMPETENCIES } from './types'

// Inline the catalog type so this file doesn't need a separate JSON
// schema file. The actual catalog is imported as JSON via
// `resolveJsonModule: true` in tsconfig.json.
import badgeCatalog from '../../../industry_alignment/badge_catalog.json'

export interface BadgeCatalog {
  version: string
  generated_at: string
  badges: Array<Record<string, unknown>>
}

function asArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map((v) => String(v))
}

function asNumber(value: unknown, fallback = 0): number {
  const n = typeof value === 'string' ? parseFloat(value) : Number(value)
  return Number.isFinite(n) ? n : fallback
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

/**
 * Convert a raw badge catalog entry into a `BadgeSpec`.
 * Pure function; no I/O.
 */
export function parseBadgeSpec(raw: Record<string, unknown>): BadgeSpec {
  const components: ComponentSpec[] = []
  const blueprint = raw.assessment_blueprint as
    | { components?: Array<Record<string, unknown>> }
    | undefined
  for (const c of blueprint?.components ?? []) {
    components.push({
      component_id: asString(c.component_id),
      required_score_pct: asNumber(c.required_score_pct),
      weight: asNumber(c.weight),
      critical_competency: Boolean(c.critical_competency ?? false),
      evidence_source: asString(c.evidence_source),
    })
  }

  const scoring = raw.scoring_rules as { minimum_overall_score?: number } | undefined
  const criticalCompetencies = asArray(raw.critical_competencies)
  const gapAffected = criticalCompetencies.filter(
    (cid) => GAP_AFFECTED_COMPETENCIES[cid] === true,
  )

  return {
    badge_id: asString(raw.badge_id),
    version: asString(raw.version),
    name: asString(raw.name),
    credential_type: asString(raw.credential_type) as BadgeSpec['credential_type'],
    family: asString(raw.family),
    status: asString(raw.status, 'active') as BadgeSpec['status'],
    verification_mode: asString(raw.verification_mode, 'local_only') as
      BadgeSpec['verification_mode'],
    prerequisite_badges: asArray(raw.prerequisite_badges),
    required_sections: asArray(raw.required_sections),
    required_activities: asArray(raw.required_activities),
    required_projects: asArray(raw.required_projects),
    critical_competencies: criticalCompetencies,
    components,
    minimum_overall_score: asNumber(
      scoring?.minimum_overall_score,
      85,
    ),
    gap_affected_competencies: gapAffected,
    newbie_friendly_description: asString(raw.newbie_friendly_description),
  }
}

/**
 * Load all badge specs from the catalog file.
 *
 * Returns a Map keyed by `badge_id`. The Map is a fresh copy on each
 * call; mutating the caller's copy does not affect subsequent calls.
 */
export function loadBadgeSpecs(): {
  specs: Map<string, BadgeSpec>
  catalogVersion: string
} {
  const catalog = badgeCatalog as unknown as BadgeCatalog
  const specs = new Map<string, BadgeSpec>()
  for (const raw of catalog.badges) {
    const spec = parseBadgeSpec(raw)
    specs.set(spec.badge_id, spec)
  }
  return { specs, catalogVersion: catalog.version }
}

/**
 * Statically get the catalog version (without loading all specs).
 * Useful for version checks at engine construction time.
 */
export function getCatalogVersion(): string {
  const catalog = badgeCatalog as unknown as BadgeCatalog
  return catalog.version
}
