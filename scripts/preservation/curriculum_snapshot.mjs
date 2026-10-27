/**
 * The active curriculum at one commit, as the renumber guards read it.
 *
 * A section's slug is its `id:` (the progress key; slugs do not change in the renumber), and its
 * number is its `index:`. Exercise ids are `Sxx-Ty-Z-En`, the same pattern the sentinel reads.
 */

export const INDEX_PATH = 'src/lib/course/index.ts'
export const SECTIONS_DIR = 'src/lib/course/sections'

/** The renumber map f (design_ruled_final.md §1): n stays for n <= 18, n+2 for 19..32, n+3 for 33..52. */
export function mapSectionNumber(n) {
  if (!Number.isInteger(n) || n < 1 || n > 52) throw new RangeError(`f is defined for sections 1..52, not ${n}`)
  if (n <= 18) return n
  if (n <= 32) return n + 2
  return n + 3
}

const pad = (n) => String(n).padStart(2, '0')
const TOKEN = /\bS(\d{2})\b/g
const IMPORT = /import\s+\{\s*section\d{2}\s*\}\s+from\s+['"]\.\/sections\/([^'"]+)['"]/g
const EXERCISE_ID = /\bid:\s*['"](S\d{2}-T[1-4]-[AB]-E[1-3])['"]/g

/** Each S-token in `line` mapped by f. A token outside 1..52 is left as written. */
export function mapTokens(line) {
  return line.replace(TOKEN, (token, digits) => {
    const n = Number(digits)
    return n >= 1 && n <= 52 ? `S${pad(mapSectionNumber(n))}` : token
  })
}

/** Whether `line` carries an S-token whose number is at least `floor`. */
export function hasTokenAtOrAbove(line, floor) {
  return [...line.matchAll(TOKEN)].some((m) => Number(m[1]) >= floor)
}

/** The 24 exercise ids a section numbered `number` must carry: T1..T4 x A,B x E1..E3. */
export function gridFor(number) {
  const ids = []
  for (const t of [1, 2, 3, 4]) {
    for (const z of ['A', 'B']) {
      for (const e of [1, 2, 3]) ids.push(`S${pad(number)}-T${t}-${z}-E${e}`)
    }
  }
  return ids
}

/** The part of an exercise id after its section number: `T1-A-E1`. */
export const suffixOf = (id) => id.replace(/^S\d{2}-/, '')

function firstMatch(text, pattern, what) {
  const m = text.match(pattern)
  if (!m) throw new Error(`no ${what} found in a section file`)
  return m[1]
}

/**
 * Sections at `rev`, keyed by slug. Throws when the index or a section file cannot be read, or when
 * two sections share a slug: the caller reports that as CURRICULUM_UNREADABLE, never as an empty curriculum.
 */
export function readCurriculumAt(history, rev) {
  const index = history.show(rev, INDEX_PATH)
  if (index === null) throw new Error(`${INDEX_PATH} is unreadable at ${rev}`)
  const sections = new Map()
  for (const [, stem] of index.matchAll(IMPORT)) {
    const text = history.show(rev, `${SECTIONS_DIR}/${stem}.ts`)
    if (text === null) throw new Error(`section file ${stem}.ts is unreadable at ${rev}`)
    const slug = firstMatch(text, /\bid:\s*['"]([^'"]+)['"]/, 'section id')
    if (sections.has(slug)) throw new Error(`section slug ${slug} appears twice at ${rev}`)
    sections.set(slug, {
      slug,
      stem,
      index: Number(firstMatch(text, /\bindex:\s*(\d+)/, 'section index')),
      exerciseIds: [...text.matchAll(EXERCISE_ID)].map((m) => m[1]),
    })
  }
  return sections
}
