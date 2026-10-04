/**
 * Which document a learner's progress earns, and what it is called.
 *
 * Below full completion the learner gets a constancia de progreso; only a learner who completed
 * every section gets the certificado de finalización. The distinction is a legal one before it
 * is a design one: in Peru a "certificado" of a course reads as a statement that the course was
 * finished (Ley 29571 arts. 18-19, idoneidad — from secondary sources, 2026-09-28), so a
 * document issued at 8 of 52 sections under that name promised more than it recorded. The document, the pricing copy and the i18n strings
 * all name the two documents with the titles below; `progress-document.test.ts` holds them to it.
 *
 * This module is server-safe on purpose (no client store imports), so pricing copy can use it.
 */

/** Sections a learner completes before any progress document can be downloaded. */
export const MIN_SECTIONS_FOR_PROGRESS_RECORD = 8

export const PROGRESS_RECORD_TITLE = 'Constancia de progreso'
export const COMPLETION_CERTIFICATE_TITLE = 'Certificado de finalización'

export type ProgressDocumentKind = 'constancia' | 'certificado'

/**
 * The document `completed` of `total` sections earns, or null while it earns none.
 * A total of zero or less earns nothing: an empty section list must never read as "all done".
 */
export function progressDocumentKind(completed: number, total: number): ProgressDocumentKind | null {
  if (total <= 0 || completed < MIN_SECTIONS_FOR_PROGRESS_RECORD) return null
  return completed >= total ? 'certificado' : 'constancia'
}

export function progressDocumentTitle(kind: ProgressDocumentKind): string {
  return kind === 'certificado' ? COMPLETION_CERTIFICATE_TITLE : PROGRESS_RECORD_TITLE
}

/**
 * Sections whose every sub-step is ticked, counting only the course's own section ids and
 * sub-step names. The progress API accepts any string for both, so counting keys or list
 * lengths would let a stray row — or a crafted one — raise the count on an issued document.
 * With no sub-steps to check nothing counts: `every` on an empty list would pass them all.
 */
export function countCompletedSections(
  progress: Record<string, readonly string[]>,
  sectionIds: readonly string[],
  subSteps: readonly string[],
): number {
  if (subSteps.length === 0) return 0
  return sectionIds.filter((id) => {
    const done = Object.prototype.hasOwnProperty.call(progress, id) ? progress[id] : null
    return Array.isArray(done) && subSteps.every((step) => done.includes(step))
  }).length
}
