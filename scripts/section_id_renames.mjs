/**
 * Section id renames, as the preservation sentinel reads them.
 *
 * SECTION_ID_RENAMES lives in src/lib/section-id-migrations.ts, beside `migrateSectionIds`,
 * which carries learner progress from each old id to its new one. The sentinel parses that
 * map instead of importing it, for two reasons: it must read the map from the commit under
 * test (`git show <sha>:path`), not from the working tree, and its CI job runs on bare
 * Node 22 before `npm ci`, with no TypeScript loader.
 *
 * The parser accepts one `key: 'value',` entry per line, plus `//` comments, and throws on
 * anything else. A map it cannot read fails the gate; it never reads as empty.
 */

export const SECTION_ID_RENAMES_PATH = 'src/lib/section-id-migrations.ts'

const DECLARATION = /export const SECTION_ID_RENAMES\b[^=]*=\s*\{([^}]*)\}/
const ENTRY = /^(?:'([^']+)'|"([^"]+)"|([A-Za-z_$][\w$]*))\s*:\s*(?:'([^']+)'|"([^"]+)")\s*,?$/

/**
 * @param {string} source text of src/lib/section-id-migrations.ts
 * @returns {Map<string, string>} old id -> new id, in source order
 */
export function parseSectionIdRenames(source) {
  const declaration = DECLARATION.exec(source)
  if (!declaration) {
    throw new Error(`no SECTION_ID_RENAMES object literal in ${SECTION_ID_RENAMES_PATH}`)
  }
  const renames = new Map()
  for (const raw of declaration[1].split('\n')) {
    const line = raw.replace(/\/\/.*$/, '').trim()
    if (!line) continue
    const entry = ENTRY.exec(line)
    if (!entry) throw new Error(`unreadable SECTION_ID_RENAMES entry: ${line}`)
    const from = entry[1] ?? entry[2] ?? entry[3]
    if (renames.has(from)) throw new Error(`duplicate SECTION_ID_RENAMES key: ${from}`)
    renames.set(from, entry[4] ?? entry[5])
  }
  return renames
}

/**
 * Why an id that left the active curriculum is not a rename, or null when it is one.
 *
 * A rename is one to one and stays in place: the map carries the id to a target that is
 * active now, was not active before, belongs to the same numbered section, and no other old
 * id maps to. A target that already existed, or that two ids share, collides inside
 * `migrateSectionIds`, which keeps one entry and drops the other learner's data. A target in
 * another section hands one lesson's completions and quiz scores to a different lesson.
 * Either is a deletion, whatever the map says.
 */
function renameRejection(id, before, after, renames) {
  if (!renames.has(id)) return 'no SECTION_ID_RENAMES entry'
  const target = renames.get(id)
  const via = `SECTION_ID_RENAMES maps it to ${target}`
  if (!after.has(target)) return `${via}, which is not an active section id`
  if (before.has(target)) return `${via}, which was already an active section id`
  // An unknown section number fails too: equal `undefined`s must not pass as the same section.
  if (before.get(id) === undefined || after.get(target) !== before.get(id)) {
    return `${via}, which is section ${after.get(target)}, not section ${before.get(id)}`
  }
  const sharers = [...renames].filter(([from, to]) => to === target && from !== id)
  if (sharers.length > 0) return `${via}, which ${sharers.map(([from]) => from).join(', ')} also maps to`
  return null
}

/**
 * Split the section ids active before a change, and missing after it, into renames and removals.
 *
 * @param {Map<string, string>} before section id -> section number, before the change
 * @param {Map<string, string>} after section id -> section number, after the change
 * @param {Map<string, string>} renames
 * @returns {{ renamed: { from: string, to: string }[], removed: { id: string, reason: string }[] }}
 */
export function classifyMissingSectionIds(before, after, renames) {
  const renamed = []
  const removed = []
  for (const id of before.keys()) {
    if (after.has(id)) continue
    const reason = renameRejection(id, before, after, renames)
    if (reason === null) renamed.push({ from: id, to: renames.get(id) })
    else removed.push({ id, reason })
  }
  return { renamed, removed }
}
