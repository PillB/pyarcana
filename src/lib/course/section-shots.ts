/**
 * Records for the screenshots inside course sections (decision D19).
 *
 * A section screenshot is a reused picture, so it is a Sesión 0 ShotRecord with a credit, and
 * the same validator decides whether it may be shown. It adds the product's own guide: the
 * picture will drift as the product changes, and the line under it sends the learner to the
 * current version.
 */
import { validShotRecord, type ShotRecord } from '@/lib/setup/screenshots'

export interface ShotGuide {
  /** Descriptive link text (WCAG 2.4.4), in Spanish, read after "consulta". */
  label: string
  url: string
}

export interface SectionShotRecord extends ShotRecord {
  credit: NonNullable<ShotRecord['credit']>
  alt: string
  caption: string
  guide: ShotGuide
}

/** Link text that says nothing about where it goes. */
const VAGUE_LINK = /^(aquí|aqui|este enlace|enlace|link|here|click|clic)$/i

export function validShotGuide(g: unknown): g is ShotGuide {
  if (!g || typeof g !== 'object') return false
  const r = g as Record<string, unknown>
  if (typeof r.label !== 'string' || typeof r.url !== 'string') return false
  return r.label.trim().length > 10 && !VAGUE_LINK.test(r.label.trim()) && r.url.startsWith('https://')
}

/**
 * Valid as a Sesión 0 record, reused rather than captured or drawn, with a guide, and with an
 * alt that is not the caption: the alt says what is on screen, the caption what to do with it.
 */
export function validSectionShotRecord(r: unknown): r is SectionShotRecord {
  if (!validShotRecord(r)) return false
  if (!r.credit || r.illustration || !r.alt || !r.caption) return false
  return r.alt.trim() !== r.caption.trim() && validShotGuide((r as unknown as Record<string, unknown>).guide)
}

/** A run of a block's prose, then the screenshots that follow it. */
export interface ProseSegment {
  /** Markdown for RichText: the heading (unless the block is optional) and paragraphs. */
  text: string
  /** The same block's prose already rendered above, so glossary hints are not repeated. */
  before: string
  shots: string[]
}

/**
 * Splits a theory block's prose after each paragraph a screenshot follows, so the picture sits
 * next to the sentence it shows (spatial contiguity) instead of after the whole block. With no
 * paragraph screenshot it returns the block's text in one piece, exactly as before.
 */
export function proseSegments(
  block: { heading: string; paragraphs: string[]; optional?: boolean; screenshots?: { id: string; after: number | string }[] },
): ProseSegment[] {
  const segments: ProseSegment[] = []
  const shown: string[] = []
  let current: string[] = block.optional ? [] : [block.heading]
  block.paragraphs.forEach((p, i) => {
    current.push(p)
    const shots = (block.screenshots ?? []).filter((s) => s.after === i).map((s) => s.id)
    if (shots.length === 0) return
    segments.push({ text: current.join('\n\n'), before: shown.join('\n\n'), shots })
    shown.push(...current)
    current = []
  })
  if (current.length > 0) segments.push({ text: current.join('\n\n'), before: shown.join('\n\n'), shots: [] })
  return segments
}

/** Ids of the screenshots that follow the block's code or its callout. */
export function shotsAfter(block: { screenshots?: { id: string; after: number | string }[] }, part: 'code' | 'callout'): string[] {
  return (block.screenshots ?? []).filter((s) => s.after === part).map((s) => s.id)
}
