/**
 * The web track placed in the live course. Resolved once, at import: if an anchor slug stops
 * naming a section, this throws with the slug and the fix, and the build and the test fail
 * instead of a link quietly landing on the wrong lesson.
 */
import { COURSE_SECTIONS } from '@/lib/course'
import { resolveTrackPlacement, type TrackPlacement } from '../placement'
import { WEB_TRACK, WEB_TRACK_ANCHORS } from './content'

export const WEB_TRACK_PLACEMENT: TrackPlacement = resolveTrackPlacement(COURSE_SECTIONS, WEB_TRACK_ANCHORS)

export const WEB_TRACK_STEP_IDS: readonly string[] = WEB_TRACK.modules.flatMap((m) => m.steps.map((s) => s.id))

/** "S08 · Archivos, CSV, JSON y contratos de ingesta" for a slug, or the slug itself if unknown. */
export function sectionLabel(slug: string): string {
  const s = COURSE_SECTIONS.find((x) => x.id === slug)
  return s ? `S${String(s.index).padStart(2, '0')} · ${s.title}` : slug
}

/** The module a `#ruta-web/<module>` hash names, or null for the bare hash or an unknown module. */
export function trackModuleFromHash(rawHash: string): string | null {
  const [head, part] = rawHash.replace(/^#/, '').split('/')
  if (head !== WEB_TRACK.id || !part) return null
  return WEB_TRACK.modules.some((m) => m.id === part) ? part : null
}
