/**
 * Theory parts: the checkpoints inside a section's Teoría tab (tester feedback, 18 Nov 2026).
 *
 * A section's theory is 10 to 36 blocks, and the only checkpoint used to be one button at the
 * very end. A learner who stops halfway had nothing to show for it and nothing to resume from.
 * The blocks already carry the unit the lessons talk in: the V3 `subtopicId` (S01-T1-A), which
 * the prose itself cites ("En T2-A…", "de T1"). A part is one subtopic with the blocks that
 * belong to it, so the outline uses the learner's own vocabulary and no number is invented.
 *
 * Grouping rule, by what each untagged block is in the curriculum:
 * - blocks before the first tagged block form the introduction (`intro`);
 * - a "Contraejemplo" block closes the part before it (it attacks what was just taught);
 * - any other untagged block is a lead-in: it opens the next tagged part;
 * - lead-ins left at the end, with no tagged block after them, close the last part.
 *
 * Part keys are the subtopic ids, so a checkpoint survives edits to headings and prose, and
 * blocks added inside or around a part. A subtopic id that appears again after a different
 * one takes a `#2` suffix: still stable, and a key never names two different parts.
 *
 * What an edit can do to a saved checkpoint (simulated in lesson-navigation-drift.test.ts):
 * retitle or insert blocks → nothing; remove a tag → that checkpoint is ignored; move a tag to
 * other content → the checkpoint follows the tag, which is what a stable id means.
 */
import type { TheoryBlock } from '@/lib/types'

export interface TheoryPart {
  /** Stable storage key: `intro`, `S01-T1-A`, or `S01-T1-B#2` for a repeated id. */
  key: string
  /** Short label shown on the outline: `Inicio`, `T1-A`. */
  label: string
  /** Heading of the block that names the part. */
  title: string
  /** Indexes into `section.theory`, ascending and contiguous. */
  blocks: number[]
}

export const INTRO_PART_KEY = 'intro'

const COUNTER_EXAMPLE = /^\s*contraejemplo\b/i

/** `S01-T1-A` → `T1-A`; anything else is returned as it is. */
export function subtopicLabel(id: string): string {
  const m = /^S\d{2}-(T\d+-[A-Z])$/.exec(id)
  return m ? m[1] : id
}

function uniqueKey(id: string, used: Set<string>): string {
  if (!used.has(id)) return id
  let n = 2
  while (used.has(`${id}#${n}`)) n += 1
  return `${id}#${n}`
}

/**
 * Split a section's theory into parts. Every block lands in exactly one part, in order.
 * Returns an empty list for a theory with no tagged block: one part would only repeat the
 * tab's own «Marcar teoría como leída».
 */
export function theoryParts(theory: readonly TheoryBlock[], introLabel = 'Inicio'): TheoryPart[] {
  if (!theory.some((b) => b.subtopicId)) return []
  const parts: TheoryPart[] = []
  const used = new Set<string>()
  let pending: number[] = []

  theory.forEach((block, i) => {
    const last = parts[parts.length - 1]
    if (block.subtopicId) {
      // The same subtopic continues, with or without lead-ins in between: one part. Requiring
      // no lead-in here made an inserted paragraph split the part and mint `…#2` (drift test).
      if (last && last.key.split('#')[0] === block.subtopicId) {
        last.blocks.push(...pending, i)
        pending = []
        return
      }
      const key = uniqueKey(block.subtopicId, used)
      used.add(key)
      parts.push({ key, label: subtopicLabel(block.subtopicId), title: block.heading, blocks: [...pending, i] })
      pending = []
      return
    }
    if (!last) {
      // Before any tagged block: the introduction.
      pending.push(i)
      if (!theory.slice(i + 1).some((b) => b.subtopicId)) return
      if (theory[i + 1]?.subtopicId) {
        used.add(INTRO_PART_KEY)
        parts.push({ key: INTRO_PART_KEY, label: introLabel, title: theory[pending[0]].heading, blocks: pending })
        pending = []
      }
      return
    }
    if (COUNTER_EXAMPLE.test(block.heading) && pending.length === 0) {
      last.blocks.push(i)
      return
    }
    pending.push(i)
  })
  if (pending.length > 0) parts[parts.length - 1].blocks.push(...pending)
  return parts
}

/** The first part not yet read, or null when every part is read (or there are none). */
export function firstUnreadPart(parts: readonly TheoryPart[], read: readonly string[]): TheoryPart | null {
  const done = new Set(read)
  return parts.find((p) => !done.has(p.key)) ?? null
}

/** How many of `parts` are read. Keys that no longer name a part (content changed) do not count. */
export function countReadParts(parts: readonly TheoryPart[], read: readonly string[]): number {
  const done = new Set(read)
  return parts.reduce((n, p) => n + (done.has(p.key) ? 1 : 0), 0)
}

/**
 * Whether ticking `key` should also complete the theory step: only when it is a new tick, the
 * step is not done yet, and with it every part is read. Unticking never completes or undoes.
 */
export function tickCompletesTheory(
  parts: readonly TheoryPart[],
  read: readonly string[],
  key: string,
  theoryDone: boolean
): boolean {
  if (theoryDone || read.includes(key) || !parts.some((p) => p.key === key)) return false
  return countReadParts(parts, [...read, key]) === parts.length
}
