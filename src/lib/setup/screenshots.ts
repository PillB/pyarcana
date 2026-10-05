/**
 * The screenshots Sesión 0 uses, described as data.
 *
 * Owner's order (Pablo, 5 Oct 2026): Sesión 0 uses real screenshots, each annotated, captioned,
 * with alt text and a dated "checked on" line. Never a fake one. So each picture is first a
 * *specification* here (what it must show, where the box goes, who can take it) and becomes a
 * picture only when a real capture exists in src/assets/setup/ (see README there).
 *
 * Why the highlight is data and not drawn into the PNG: a retake then needs only the new image
 * and a re-measured box, the box can follow the page's theme and contrast tokens, and the alt
 * text and caption sit next to the thing they describe. The cost: the box must be re-measured on
 * every retake, which scripts/setup_screenshots.mjs does for the browser shots.
 */
import type { SetupOs } from './os'

/** A rectangle in percentages of the image, so it survives any rendered size. */
export interface ShotBox {
  x: number
  y: number
  w: number
  h: number
}

export type ShotSource =
  /** A public web page, captured by scripts/setup_screenshots.mjs with Playwright. */
  | 'browser-script'
  /** An installer or a desktop app on Windows or macOS: only the owner's machine can take it. */
  | 'owner-capture'

export interface ShotSpec {
  /** File name in src/assets/setup without `.png`. */
  id: string
  os: SetupOs | 'any'
  source: ShotSource
  /** For browser-script: the page to open. */
  url?: string
  /** For browser-script: the element the box is drawn around. */
  selector?: string
  /** For whoever takes it: what must be on screen. Not shown to learners. */
  brief: string
  /** Learner-facing, Spanish: what the picture shows, including the words on it. */
  alt: string
  /** Learner-facing, Spanish: one sentence under the picture. */
  caption: string
}

/** What a capture adds to its spec: written by the script, or by hand for an owner capture. */
export interface ShotRecord {
  id: string
  /** ISO date the screen was checked to still look like this. */
  checkedOn: string
  width: number
  height: number
  /** The box around what to click; omitted when the picture only shows a result. */
  box?: ShotBox
}

export function validShotBox(b: unknown): b is ShotBox {
  if (!b || typeof b !== 'object') return false
  const r = b as Record<string, unknown>
  const nums = [r.x, r.y, r.w, r.h]
  if (!nums.every((n) => typeof n === 'number' && Number.isFinite(n))) return false
  const [x, y, w, h] = nums as number[]
  return x >= 0 && y >= 0 && w > 0 && h > 0 && x + w <= 100.01 && y + h <= 100.01
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export function validShotRecord(r: unknown): r is ShotRecord {
  if (!r || typeof r !== 'object') return false
  const rec = r as Record<string, unknown>
  if (typeof rec.id !== 'string' || typeof rec.checkedOn !== 'string' || !ISO_DATE.test(rec.checkedOn)) return false
  if (typeof rec.width !== 'number' || typeof rec.height !== 'number' || rec.width < 1 || rec.height < 1) return false
  return rec.box === undefined || validShotBox(rec.box)
}

/** How old a capture may get before the retake routine flags it (DESIGN.md §7). */
export const SHOT_MAX_AGE_DAYS = 120

/** Days between a record's check date and `today` (ISO), for the staleness report. */
export function shotAgeDays(record: ShotRecord, today: string): number {
  const ms = Date.parse(`${today}T00:00:00Z`) - Date.parse(`${record.checkedOn}T00:00:00Z`)
  return Math.floor(ms / 86_400_000)
}

/** "5 oct 2026", the form the page prints under each picture. */
export function formatCheckedOn(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  return `${d} ${months[m - 1]} ${y}`
}
