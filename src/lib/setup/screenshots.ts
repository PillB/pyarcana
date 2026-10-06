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

/**
 * Licences a reused screenshot may carry. Each allows commercial reuse with attribution, which
 * PyArcana needs because Pro is paid. NonCommercial licences (Missing Semester, The Odin Project,
 * Pro Git) are absent for that reason.
 *
 * CC BY-SA 4.0 is allowed for an **unmodified** picture only: no crop, no box drawn over it
 * (`validReuse`). Shown as-is beside our text, it is part of a collection, which share-alike does
 * not reach (Creative Commons FAQ, "adaptations"); a crop or an overlay could make it an
 * adaptation. Owner decision D6 in audit/session-0/PLAN.md.
 *
 * MIT and Apache-2.0 (added 6 Oct 2026, decision D19 in audit/fixer/decisions.md): some tools
 * publish their documentation pictures inside a code repository under its software licence,
 * not under Creative Commons (the Ruff extension's README, MIT; Playwright's docs, Apache-2.0).
 * Both allow commercial reuse and modification. Both make the copy carry a notice: MIT its
 * copyright and permission notice, Apache-2.0 a copy of the licence, the NOTICE attributions
 * and a statement of changes (§4). So a credit under either must link the source's own licence
 * file (`licenceUrl`), which holds the copyright line, and name the holder in `source`.
 * NonCommercial and NoDerivatives licences stay absent: Pro is paid, and a crop is a change.
 */
export const REUSE_LICENCES = {
  'CC BY 4.0': 'https://creativecommons.org/licenses/by/4.0/deed.es',
  'CC BY 3.0 US': 'https://creativecommons.org/licenses/by/3.0/us/deed.es',
  'CC BY-SA 4.0': 'https://creativecommons.org/licenses/by-sa/4.0/deed.es',
  'PSF License v2': 'https://docs.python.org/3/license.html',
  MIT: 'https://opensource.org/license/mit',
  'Apache-2.0': 'https://www.apache.org/licenses/LICENSE-2.0',
} as const

/** Licences under which the picture must be shown exactly as published. */
const UNMODIFIED_ONLY: readonly string[] = ['CC BY-SA 4.0']

/** Licences whose notice lives in the source's own licence file, which the credit must link. */
const NOTICE_IN_SOURCE: readonly string[] = ['MIT', 'Apache-2.0']

export type ReuseLicence = keyof typeof REUSE_LICENCES

/** Where a reused picture comes from, printed under it as its attribution. */
export interface ShotCredit {
  /** Who published it, as the attribution names them: "GitHub Docs". */
  source: string
  /** The page or file it was taken from. */
  url: string
  licence: ReuseLicence
  /**
   * The source's own licence file, linked instead of the generic text. Required for MIT and
   * Apache-2.0, whose copyright notice is in that file (NOTICE_IN_SOURCE).
   */
  licenceUrl?: string
  /** What we changed, if anything, in Spanish: "recortada". CC BY requires saying so. */
  changes?: string
}

/** Who drew an illustration, and what it was checked against. */
export interface ShotIllustration {
  by: string
  /** The sources its labels and layout were checked against, and any edits made to it. */
  basis: string
}

/** What a capture adds to its spec: written by the script, or by hand for an owner capture. */
export interface ShotRecord {
  id: string
  /**
   * ISO date. For our own capture: the day the screen was checked to still look like this.
   * For a reused picture: the day it was taken from its source and checked against it.
   */
  checkedOn: string
  width: number
  height: number
  /** The box around what to click; omitted when the picture only shows a result. */
  box?: ShotBox
  /** Set when the picture is someone else's, reused under an open licence. */
  credit?: ShotCredit
  /**
   * Set when the picture is a drawn recreation of the screen, not a capture of it (owner's pack,
   * 6 Oct 2026). The page labels it as such on top of the image, and the report keeps counting it
   * as due for a real capture.
   */
  illustration?: ShotIllustration
  /**
   * A reused picture rarely shows exactly what the spec asks for (another folder name, another
   * Python version), so it carries its own alt and caption, which say what it really shows.
   */
  alt?: string
  caption?: string
}

export function validShotCredit(c: unknown): c is ShotCredit {
  if (!c || typeof c !== 'object') return false
  const r = c as Record<string, unknown>
  return (
    typeof r.source === 'string' && r.source.length > 2 &&
    typeof r.url === 'string' && r.url.startsWith('https://') &&
    typeof r.licence === 'string' && r.licence in REUSE_LICENCES &&
    (r.changes === undefined || typeof r.changes === 'string') &&
    validLicenceUrl(r.licence, r.licenceUrl)
  )
}

function validLicenceUrl(licence: string, url: unknown): boolean {
  if (url === undefined) return !NOTICE_IN_SOURCE.includes(licence)
  return typeof url === 'string' && url.startsWith('https://')
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

function validCore(rec: Record<string, unknown>): boolean {
  if (typeof rec.id !== 'string' || typeof rec.checkedOn !== 'string' || !ISO_DATE.test(rec.checkedOn)) return false
  if (typeof rec.width !== 'number' || typeof rec.height !== 'number' || rec.width < 1 || rec.height < 1) return false
  return rec.box === undefined || validShotBox(rec.box)
}

/** A reused picture must say what it shows: the spec's alt describes the capture we wanted. */
function validReuse(rec: Record<string, unknown>): boolean {
  if (rec.credit === undefined) return true
  const ownWords = typeof rec.alt === 'string' && rec.alt.length > 40 && typeof rec.caption === 'string' && rec.caption.length > 15
  if (!validShotCredit(rec.credit) || !ownWords) return false
  return !UNMODIFIED_ONLY.includes(rec.credit.licence) || (rec.credit.changes === undefined && rec.box === undefined)
}

/**
 * An illustration says so in its own words: an alt that starts "Ilustración", its own caption,
 * and what it was checked against. It is never also a reused capture.
 */
function validIllustration(rec: Record<string, unknown>): boolean {
  if (rec.illustration === undefined) return true
  const ill = rec.illustration as Record<string, unknown>
  const said = typeof rec.alt === 'string' && rec.alt.startsWith('Ilustración') && typeof rec.caption === 'string' && rec.caption.length > 15
  return rec.credit === undefined && said && typeof ill.by === 'string' && ill.by.length > 2 && typeof ill.basis === 'string' && ill.basis.length > 10
}

export function validShotRecord(r: unknown): r is ShotRecord {
  if (!r || typeof r !== 'object') return false
  const rec = r as Record<string, unknown>
  return validCore(rec) && validReuse(rec) && validIllustration(rec)
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
