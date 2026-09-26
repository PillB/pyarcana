/**
 * What a name matcher gets wrong about concept mentions, in both directions.
 *
 * The event extractor decides that a text mentions a concept when one of the concept's names
 * appears in it. That misses a concept used through its syntax, and it counts a name inside a
 * proper noun. Both were found on S02's route-2 rounds (2026-09-26):
 *
 *  - A dict literal never says "dict". S02-T4-A-E3 built `{"types": {"edad": "str"}}` and the
 *    optional «Contrato de la sección» block printed one, and the concept map reported S02 at
 *    two surprising uses with both still in place. Before S06, which teaches dicts, 38 events
 *    used a literal the matcher could not see.
 *  - *Python for Everybody* is Charles Severance's book and course (py4e), linked 21 times from
 *    15 sections. Its `for` is an English preposition, and the matcher counted it as the loop
 *    keyword: a surprising use in S02 and S03, before either teaches loops, that no rewrite of
 *    the Spanish could remove.
 *
 * Kept out of the extractor, which runs on import, so both can be tested on synthetic text.
 */

/**
 * Proper names whose words are not the concepts they spell. Spanish is this course's canonical
 * language, so an English token in Spanish prose is almost always the concept; inside an English
 * title it is not. Add a name only with a test showing its words still count everywhere else.
 */
const PROPER_NAMES = /Python for Everybody/g

/** The text with proper names blanked to spaces, so every match offset still fits the original. */
export function blankProperNames(text: string): string {
  return text.replace(PROPER_NAMES, (m) => ' '.repeat(m.length))
}

/**
 * Concepts a text uses through their syntax rather than their name, by glossary id.
 *
 * `dict`: a brace, a quoted key, a colon. The colon may not be followed by `<`, `>`, `^`, `=` or
 * `,`, which cannot start a dict value but can start an f-string format spec - `{'total':>10}`.
 * Measured on the course before adding it: 4,739 literal-shaped matches and not one f-string.
 * An unquoted key (`{k: v}`) is left out on purpose: `{x}` in an f-string and `{a, b}` as a set
 * are far commoner in this course than a dict keyed by a name.
 */
const SYNTAX: ReadonlyArray<[string, RegExp]> = [
  ['dict', /\{\s*["'][^"'\n]{1,40}["']\s*:(?![<>^=,])/],
]

export function syntaxMentions(text: string): string[] {
  return SYNTAX.filter(([, re]) => re.test(text)).map(([id]) => id)
}
