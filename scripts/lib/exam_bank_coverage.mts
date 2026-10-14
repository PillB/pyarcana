/**
 * What every course section's exam bank must contain, as a list of problems (empty when none).
 *
 * The rules are the course's, not the seed's: 8 concepts per section, 3 variants per concept, 4
 * options per question, a key that names one of them, no option repeated inside a question, a
 * non-empty explanation, and no bank keyed by a pre-rename slug. A learner is drawn from the bank
 * under the section's current id, so a bank under an old slug is never shown to anyone.
 *
 * Pure: it checks the banks it is given and reads nothing else. The banks come from
 * readSeedQuestionBank (scripts/lib/learner_text.mts), so this measures what the seed inserts.
 */
import type { Bank, BankQuestion } from './learner_text.mts'

export const CONCEPTS_PER_SECTION = 8
export const VARIANTS_PER_CONCEPT = 3
export const OPTIONS_PER_QUESTION = 4

const hasOwn = (o: object, k: string): boolean => Object.prototype.hasOwnProperty.call(o, k)

/** A question's problems, each naming the bank and the line the question starts on. */
function questionProblems(slug: string, q: BankQuestion): string[] {
  const where = `bank "${slug}" line ${q.line}`
  const found: string[] = []
  if (q.options.length !== OPTIONS_PER_QUESTION) {
    found.push(`${where} has ${q.options.length} options, want ${OPTIONS_PER_QUESTION}`)
  }
  if (new Set(q.options).size !== q.options.length) found.push(`${where} repeats an option`)
  if (q.correctIndex >= q.options.length) {
    found.push(`${where}: key ${q.correctIndex} is not one of its ${q.options.length} options`)
  }
  if (q.explanation.trim() === '') found.push(`${where}: empty explanation`)
  return found
}

/** Variants of one concept must be exactly 1..VARIANTS_PER_CONCEPT, each once. */
function conceptProblems(slug: string, concept: string, variants: number[]): string[] {
  const want = Array.from({ length: VARIANTS_PER_CONCEPT }, (_, i) => i + 1)
  const sorted = [...variants].sort((a, b) => a - b)
  if (sorted.length === want.length && sorted.every((v, i) => v === want[i])) return []
  return [`bank "${slug}" concept "${concept}" has variants [${sorted.join(', ')}], want ${want.join(', ')}`]
}

/** Everything wrong with one bank: its concept count, each concept's variants, each question. */
function bankProblems(bank: Bank): string[] {
  const slug = bank.slug
  const variantsOf = new Map<string, number[]>()
  for (const q of bank.questions) {
    variantsOf.set(q.concept, [...(variantsOf.get(q.concept) ?? []), q.variant])
  }
  const problems: string[] = []
  if (variantsOf.size !== CONCEPTS_PER_SECTION) {
    problems.push(`bank "${slug}" has ${variantsOf.size} concepts, want ${CONCEPTS_PER_SECTION}`)
  }
  for (const [concept, variants] of variantsOf) problems.push(...conceptProblems(slug, concept, variants))
  for (const q of bank.questions) problems.push(...questionProblems(slug, q))
  return problems
}

/** Banks keyed by an old slug, and banks that belong to no current section. */
function keyProblems(banks: readonly Bank[], sectionIds: ReadonlySet<string>, renamedFrom: Readonly<Record<string, string>>): string[] {
  const problems: string[] = []
  for (const { slug } of banks) {
    if (sectionIds.has(slug)) continue
    if (hasOwn(renamedFrom, slug)) {
      problems.push(`bank "${slug}" is keyed by a pre-rename slug; the section is "${renamedFrom[slug]}"`)
    } else {
      problems.push(`bank "${slug}" belongs to no section`)
    }
  }
  return problems
}

/**
 * Every way the banks fall short of the course: a section with no bank, a bank keyed by an old
 * slug or by no section, and each bank's problems. `renamedFrom` maps an old slug to its new one.
 */
export function coverageProblems(
  banks: readonly Bank[],
  sectionIds: readonly string[],
  renamedFrom: Readonly<Record<string, string>>,
): string[] {
  const ids = new Set(sectionIds)
  const keyed = new Set(banks.map((b) => b.slug))
  const missing = sectionIds.filter((id) => !keyed.has(id)).map((id) => `no bank for section "${id}"`)
  return [
    ...missing,
    ...keyProblems(banks, ids, renamedFrom),
    ...banks.flatMap(bankProblems),
  ]
}
