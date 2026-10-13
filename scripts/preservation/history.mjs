/**
 * Read-only git history for the renumber guards.
 *
 * Every read runs in the repository it is given. A read that fails returns null, and the caller
 * reports HISTORY_MISSING: no guard reads a failed command as an empty history. A question git
 * cannot answer (is A an ancestor of B?) throws, for the same reason.
 */
import { execFileSync, spawnSync } from 'node:child_process'

const MAX_BUFFER = 512 * 1024 * 1024

export function openHistory(cwd) {
  const attempt = (args) => {
    try {
      return execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: MAX_BUFFER, stdio: ['ignore', 'pipe', 'ignore'] })
    } catch {
      return null
    }
  }
  return {
    /** True unless git plainly says the repository is complete. An unknown answer counts as shallow. */
    isShallow() {
      return attempt(['rev-parse', '--is-shallow-repository'])?.trim() !== 'false'
    },
    /** The full sha of a commit, or null when `rev` is not a readable commit. */
    commit(rev) {
      return attempt(['rev-parse', '--verify', '--quiet', `${rev}^{commit}`])?.trim() ?? null
    },
    /** The text of `path` at `rev`, or null when it is absent or unreadable. */
    show(rev, path) {
      return attempt(['show', `${rev}:${path}`])
    },
    /** Whether `ancestor` is reachable from `descendant`. Throws when git cannot say. */
    isAncestor(ancestor, descendant) {
      const run = spawnSync('git', ['merge-base', '--is-ancestor', ancestor, descendant], { cwd, stdio: 'ignore' })
      if (run.status === 0) return true
      if (run.status === 1) return false
      throw new Error(`git cannot say whether ${ancestor} is an ancestor of ${descendant}`)
    },
    /** `git diff --name-status -M a b`, or null when git cannot produce it. */
    nameStatus(a, b) {
      return attempt(['diff', '--name-status', '-M', a, b])
    },
    /** `git diff --unified=0 --no-renames a b`, or null when git cannot produce it. */
    unifiedDiff(a, b) {
      return attempt(['diff', '--unified=0', '--no-renames', '--no-color', a, b])
    },
  }
}

/** The added lines of a unified diff with --unified=0, as a map from path to lines (no `+`). */
export function parseAddedLines(diffText) {
  const added = new Map()
  let path = null
  for (const line of diffText.split('\n')) {
    if (line.startsWith('+++ ')) {
      const target = line.slice(4)
      path = target === '/dev/null' ? null : target.replace(/^b\//, '')
      if (path !== null && !added.has(path)) added.set(path, [])
    } else if (line.startsWith('diff --git ')) {
      path = null
    } else if (line.startsWith('+') && path !== null) {
      added.get(path).push(line.slice(1))
    }
  }
  return added
}
