/**
 * Where the floating ← → buttons go (tester feedback, 18 Nov 2026).
 *
 * They used to jump a whole section (S1 → S2) from any tab, while the row of five tabs right
 * above the content is the nearest sequence on screen. A tester pressed → on Teoría expecting
 * Yo hago and landed in the next section. Now the course reads as one line of steps:
 *
 *   S1·Teoría → S1·Yo hago → … → S1·Autocheck → S2·Teoría → …
 *
 * and ← walks the same line back. Jumping a whole section stays one click away in the sidebar.
 */
import { SUB_STEPS, type SubStep } from '@/lib/progress-store'

export interface StepTarget {
  /** Index into the section list. */
  section: number
  step: SubStep
  /** True when the target is in another section than the one shown. */
  crossesSection: boolean
}

/**
 * The step after (`+1`) or before (`-1`) `step` in section `section`, or null at either end of
 * the course. Returns null for an index outside `0 … sectionCount - 1` or an unknown step,
 * rather than guessing a place to send the learner.
 */
export function neighbourStep(
  sectionCount: number,
  section: number,
  step: SubStep,
  direction: 1 | -1
): StepTarget | null {
  const at = SUB_STEPS.indexOf(step)
  if (at < 0 || !Number.isInteger(section) || section < 0 || section >= sectionCount) return null
  const next = at + direction
  if (next >= 0 && next < SUB_STEPS.length) return { section, step: SUB_STEPS[next], crossesSection: false }
  const otherSection = section + direction
  if (otherSection < 0 || otherSection >= sectionCount) return null
  return {
    section: otherSection,
    step: direction === 1 ? SUB_STEPS[0] : SUB_STEPS[SUB_STEPS.length - 1],
    crossesSection: true,
  }
}
