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

export function renameSectionId(id: string): string {
  return SECTION_ID_RENAMES[id] ?? id
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

  const remapKeys = <V>(record: Record<string, V> | undefined): Record<string, V> | undefined => {
    if (!record) return record
    const out: Record<string, V> = {}
    for (const [id, value] of Object.entries(record)) {
      const next = renameSectionId(id)
      // A collision would mean two sections merged; keep the existing entry rather than
      // silently dropping a learner's work.
      out[next] = next in out ? out[next] : value
    }
    return out
  }

  return {
    ...state,
    completedSections: state.completedSections?.map(renameSectionId),
    completedSubSteps: remapKeys(state.completedSubSteps),
    quizScores: remapKeys(state.quizScores),
    bookmarks: state.bookmarks?.map(renameSectionId),
    lastVisited: state.lastVisited ? renameSectionId(state.lastVisited) : state.lastVisited,
  }
}
