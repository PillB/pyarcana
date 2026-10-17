/**
 * The section count the roadmap declares: its `### S<n> — ` headings.
 *
 * The preservation sentinel compares the imported section count against this number instead of
 * a literal 52, so the renumber to 55 (owner decision O17) needs no edit to the sentinel. The
 * headings must run 1..n in order with no gap or repeat: a roadmap that skips a number cannot
 * declare a count, and the caller fails closed on the error rather than guessing.
 */
export const ROADMAP_PATH = 'learning_roadmap_52_V3.md'

const HEADING = /^### S(\d+) — /gm

/** Throws when the headings are absent, repeated, or not numbered 1..n in order. */
export function roadmapSectionCount(markdown) {
  const numbers = [...markdown.matchAll(HEADING)].map((m) => Number(m[1]))
  if (numbers.length === 0) {
    throw new Error(`${ROADMAP_PATH} has no section headings (### S<n> — )`)
  }
  numbers.forEach((n, i) => {
    if (n !== i + 1) {
      throw new Error(`${ROADMAP_PATH} section headings must run S1..S${numbers.length} in order; found S${n} at position ${i + 1}`)
    }
  })
  return numbers.length
}
