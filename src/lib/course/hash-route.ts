/**
 * The course page's URL-hash router as a pure function (it was inline in src/app/page.tsx).
 *
 * One HTML document (/) answers every "/#..." route, so the hash alone decides the first view.
 * Keeping the decision pure lets a test walk every route, including the ones a future round will
 * add or rename, without a browser. page.tsx applies the result; it never decides on its own.
 *
 * States: home | section(id, step) | resources | capstones | familiarity | admin* | pricing*
 * (* server edition only). An unknown hash returns null: the caller keeps the current view instead
 * of guessing, and says so in the console.
 */
import { SUB_STEPS, type SubStep } from '@/lib/progress-store'
import { renameSectionId } from '@/lib/section-id-migrations'

export type CourseView = 'home' | 'section' | 'resources' | 'admin' | 'familiarity' | 'pricing' | 'capstones'
export type HashRoute = { view: Exclude<CourseView, 'section'> } | { view: 'section'; sectionId: string; step: SubStep }

/** The part of a course section this router needs. */
export interface RoutableSection {
  id: string
  index: number
}

export function isSubStep(value: unknown): value is SubStep {
  return typeof value === 'string' && (SUB_STEPS as readonly string[]).includes(value)
}

/** "S05" -> the slug of section index 5; an old slug -> its renamed slug; anything else as given. */
export function resolveCourseSectionId(id: string, sections: readonly RoutableSection[]): string {
  const sMatch = /^S(\d{2})$/i.exec(id)
  if (!sMatch) return renameSectionId(id)
  const found = sections.find((s) => s.index === parseInt(sMatch[1], 10))
  return found ? found.id : id
}

/** The section an id names (slug, S##, or a pre-rename slug), or null when none does. */
export function findCourseSection<T extends RoutableSection>(id: string, sections: readonly T[]): T | null {
  const resolved = resolveCourseSectionId(id, sections)
  return sections.find((s) => s.id === resolved) ?? null
}

const PLAIN_VIEWS: Readonly<Record<string, { view: Exclude<CourseView, 'section'>; serverOnly: boolean }>> = {
  '': { view: 'home', serverOnly: false },
  home: { view: 'home', serverOnly: false },
  resources: { view: 'resources', serverOnly: false },
  familiarity: { view: 'familiarity', serverOnly: false },
  capstones: { view: 'capstones', serverOnly: false },
  admin: { view: 'admin', serverOnly: true },
  pricing: { view: 'pricing', serverOnly: true },
}

/**
 * The view a hash (with or without its leading "#") names, or null for a hash that names none.
 * `#basics` opens Teoría; `#basics/ido` opens that tab; an unknown tab falls back to Teoría.
 */
export function parseCourseHash(rawHash: string, sections: readonly RoutableSection[], isStaticSite: boolean): HashRoute | null {
  const hash = rawHash.replace(/^#/, '')
  const plain = Object.prototype.hasOwnProperty.call(PLAIN_VIEWS, hash) ? PLAIN_VIEWS[hash] : undefined
  if (plain) return plain.serverOnly && isStaticSite ? null : { view: plain.view }
  const [rawId, rawStep] = hash.split('/')
  const section = findCourseSection(rawId, sections)
  if (!section) return null
  return { view: 'section', sectionId: section.id, step: isSubStep(rawStep) ? rawStep : 'theory' }
}
