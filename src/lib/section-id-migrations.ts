/**
 * Section id renames, and the migration that carries a learner's saved progress across them.
 *
 * The section `id` slugs came from a pre-V3 curriculum and stopped describing what each section
 * teaches; `index` and `title` were always right. Renaming the slugs is safe for the app, but
 * every learner's progress lives in localStorage under `python-ds-progress` keyed by these exact
 * slugs (completedSections, completedSubSteps, quizScores, bookmarks, lastVisited), and
 * badge_catalog.json accepts those keys as evidence of section completion. Renaming without this
 * migration would silently mark completed sections incomplete for everyone who already started.
 *
 * No new id here is also an old id, so a single-pass lookup can never rename twice.
 * Later batches append to this map and bump SECTION_ID_SCHEMA_VERSION.
 */

/** old slug -> new slug. Batch A (S01-S13); S01 `setup` and S02 `basics` were already correct. */
export const SECTION_ID_RENAMES: Readonly<Record<string, string>> = {
  'data-structures': 'decisions-rules',
  'functions-modules': 'iteration-summaries',
  oop: 'functions-contracts',
  numpy: 'collections',
  'data-acquisition': 'text-unicode-regex',
  pandas: 'files-ingestion',
  visualization: 'exceptions-logging',
  sklearn: 'modules-packaging-cli',
  testing: 'oop-domain',
  performance: 'apis-sql-geo',
  'rpa-automation': 'evidence-dashboard',
}

export const SECTION_ID_SCHEMA_VERSION = 1

/**
 * The id the app reads for `id`. Own properties only: every API schema now runs request input
 * through this, and a bare lookup returned `Object.prototype` members for `constructor` or
 * `__proto__`, which Prisma then rejected as a 500 instead of the 400 the input deserves.
 */
export function renameSectionId(id: string): string {
  return Object.prototype.hasOwnProperty.call(SECTION_ID_RENAMES, id) ? SECTION_ID_RENAMES[id] : id
}

/**
 * Every slug a section has been stored under: its current id first, then each id it was renamed
 * from. A reader that asks only for the current id cannot see a row the database migration did
 * not reach — and exam/start then found no questions for S03-S13 at all.
 */
export function sectionIdAliases(id: string): string[] {
  const current = renameSectionId(id)
  return [current, ...Object.keys(SECTION_ID_RENAMES).filter((old) => SECTION_ID_RENAMES[old] === current)]
}

/**
 * Rows read from the database, with each section id as the app knows it today.
 *
 * The admin and cohort dashboards and the CSV export compare these ids against COURSE_SECTIONS;
 * a row still under a pre-rename slug - written by the old server between the database step and
 * the restart, or on a database the rename migration has not reached - fell out of every
 * per-section view and was counted twice in per-learner totals.
 */
export function withCanonicalSectionIds<T extends { sectionId: string }>(rows: T[]): T[] {
  return rows.map((r) => {
    const sectionId = renameSectionId(r.sectionId)
    return sectionId === r.sectionId ? r : { ...r, sectionId }
  })
}

type MigratableProgress = {
  completedSections?: string[]
  completedSubSteps?: Record<string, string[]>
  quizScores?: Record<string, number>
  bookmarks?: string[]
  lastVisited?: string | null
}

/**
 * Remap every section-id-keyed structure. Unknown ids pass through untouched, so running this
 * against already-migrated state is a no-op.
 */
export function migrateSectionIds<T extends MigratableProgress>(state: T): T {
  if (!state || typeof state !== 'object') return state

  // A blob can hold the same section under both keys — a tab opened before the deploy that
  // hydrated from the renamed server stores both key spaces — so a collision is the same
  // section twice, not two sections. Keeping only the first key read threw the other side's
  // completed steps away; merge instead: every step either side has, the better quiz score.
  const remapKeys = <V>(record: Record<string, V> | undefined,
                        merge: (a: V, b: V) => V): Record<string, V> | undefined => {
    if (!record) return record
    const out: Record<string, V> = {}
    for (const [id, value] of Object.entries(record)) {
      const next = renameSectionId(id)
      out[next] = Object.prototype.hasOwnProperty.call(out, next) ? merge(out[next], value) : value
    }
    return out
  }
  const unique = (ids: string[] | undefined) => ids && Array.from(new Set(ids.map(renameSectionId)))

  return {
    ...state,
    completedSections: unique(state.completedSections),
    completedSubSteps: remapKeys(state.completedSubSteps, (a, b) => Array.from(new Set([...a, ...b]))),
    quizScores: remapKeys(state.quizScores, (a, b) => Math.max(a, b)),
    bookmarks: unique(state.bookmarks),
    lastVisited: state.lastVisited ? renameSectionId(state.lastVisited) : state.lastVisited,
  }
}
