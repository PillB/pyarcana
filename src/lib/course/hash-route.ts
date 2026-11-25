/**
 * The course page's URL-hash router as a pure function (it was inline in src/app/page.tsx).
 *
 * One HTML document (/) answers every "/#..." route, so the hash alone decides the first view.
 * Keeping the decision pure lets a test walk every route, including the ones a future round will
 * add or rename, without a browser. page.tsx applies the result; it never decides on its own.
 *
 * States: home | section(id, step) | resources | capstones | familiarity | session0 | admin* | pricing*
 * (* server edition only). An unknown hash returns null: the caller keeps the current view instead
 * of guessing, and says so in the console.
 *
 * Sesión 0 is the one view with a path of its own, /empezar, not a hash: it was a standalone page
 * there before it joined the course shell (25 Nov 2026), and links to /empezar are already out in
 * the world. The same document shell answers both paths; the path picks the first view.
 */
import { SUB_STEPS, type SubStep } from '@/lib/progress-store'
import { renameSectionId } from '@/lib/section-id-migrations'

export type CourseView = 'home' | 'section' | 'resources' | 'admin' | 'familiarity' | 'pricing' | 'capstones' | 'session0'
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

/** The path segment of Sesión 0 (src/app/empezar). */
export const SESSION_ZERO_SEGMENT = 'empezar'
const SESSION_ZERO_TAIL = /\/empezar(?:\.html)?\/?$/

/** True when a pathname (with or without a base path such as /pyarcana) is Sesión 0's page. */
export function isSessionZeroPath(pathname: string): boolean {
  return SESSION_ZERO_TAIL.test(pathname)
}

/**
 * The course's root path for a pathname: "/" for "/" and "/empezar", "/pyarcana/" for
 * "/pyarcana/empezar". Every view but Sesión 0 lives at this path plus a hash.
 */
export function courseRootPath(pathname: string): string {
  if (isSessionZeroPath(pathname)) return pathname.replace(SESSION_ZERO_TAIL, '/')
  return pathname || '/'
}

/** The path a view belongs at, keeping the base path: /empezar for Sesión 0, the root otherwise. */
export function coursePathFor(view: CourseView, pathname: string): string {
  const root = courseRootPath(pathname)
  return view === 'session0' ? `${root.replace(/\/?$/, '/')}${SESSION_ZERO_SEGMENT}` : root
}

/**
 * The first view for a whole location, path and hash. On /empezar the hash belongs to Sesión 0:
 * "" is the page itself and "#python" one of its parts (`partIds`), which stays on Sesión 0 even
 * if a section one day takes the same slug. Any other hash there is read as a course route, so
 * /empezar#basics still opens Section 2. Elsewhere this is parseCourseHash.
 */
export function parseCourseLocation(
  pathname: string,
  rawHash: string,
  sections: readonly RoutableSection[],
  isStaticSite: boolean,
  partIds: readonly string[],
): HashRoute | null {
  return sessionZeroRoute(pathname, rawHash, partIds) ?? parseCourseHash(rawHash, sections, isStaticSite)
}

/** Sesión 0 when the path is /empezar and the hash is empty or one of its parts; else null. */
export function sessionZeroRoute(pathname: string, rawHash: string, partIds: readonly string[]): HashRoute | null {
  if (!isSessionZeroPath(pathname)) return null
  const hash = rawHash.replace(/^#/, '')
  return hash === '' || partIds.includes(hash) ? { view: 'session0' } : null
}
