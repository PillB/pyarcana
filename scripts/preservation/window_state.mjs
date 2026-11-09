/**
 * The two state files that open and close the curriculum/55 renumber window.
 *
 * `renumber_epoch.json` exists from the renumber commit onward: its absence is what makes G-11 and
 * G-15 dormant. `curriculum55_window.json` exists from the moment the window opens on main: its
 * absence is what makes G-14 dormant. Both are read from the working tree (CI checks out HEAD).
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

export const EPOCH_PATH = 'audit/safe-agent/renumber_epoch.json'
export const WINDOW_PATH = 'audit/safe-agent/curriculum55_window.json'

/** The kinds a ledger row may have. `carried_from_main` is a line main added, carried verbatim. */
export const LEDGER_KINDS = new Set(['authoring', 'bridge', 'carried_from_main'])

/** The parsed state file, or null while it is absent. A file that is present but not JSON throws. */
export function readState(root, relPath) {
  const full = join(root, relPath)
  if (!existsSync(full)) return null
  try {
    return JSON.parse(readFileSync(full, 'utf8'))
  } catch (e) {
    throw new Error(`${relPath} is present but is not valid JSON: ${e.message}`)
  }
}
