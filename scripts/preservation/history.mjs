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
    /** Every tracked path at `rev`. Throws when git cannot list them. */
    listAt(rev) {
      const out = attempt(['ls-tree', '-r', '--name-only', rev])
      if (out === null) throw new Error(`git cannot list the files at ${rev}`)
      return out.split('\n').filter(Boolean)
    },
    /** The last commit reachable from `rev` that touched `path`, or null when none did. Throws when unreadable. */
    lastCommitTouching(rev, path) {
      const out = attempt(['log', '-n', '1', '--format=%H', rev, '--', path])
      if (out === null) throw new Error(`git cannot read the history of ${path} at ${rev}`)
      return out.trim() || null
    },
    /** `git diff --name-status -M -z a b` (NUL-separated, paths unquoted: see parseNameStatus), or null. */
    nameStatus(a, b) {
      return attempt(['diff', '--name-status', '-M', '-z', a, b])
    },
    /** `git diff --unified=0 --no-renames a b`, or null when git cannot produce it. */
    unifiedDiff(a, b) {
      return attempt(['diff', '--unified=0', '--no-renames', '--no-color', a, b])
    },
  }
}

const C_ESCAPES = { a: 7, b: 8, f: 12, n: 10, r: 13, t: 9, v: 11, '\\': 92, '"': 34 }
const OCTAL = /^[0-7]{3}/

/** One escape at `body[i]` (a backslash): its byte and how many characters it spans. */
function escapeAt(body, i, token) {
  const digits = body.slice(i + 1, i + 4)
  if (OCTAL.test(digits)) return { byte: parseInt(digits, 8), span: 4 }
  if (body[i + 1] in C_ESCAPES) return { byte: C_ESCAPES[body[i + 1]], span: 2 }
  throw new Error(`a diff header holds an escape this parser does not know: ${token}`)
}

/**
 * A path as git prints it in a diff header. A name with a space gets a trailing tab, and a name with a
 * quote, backslash, control character or (unless core.quotePath is false) non-ASCII byte is wrapped in
 * double quotes with C escapes, \ooo octal for raw bytes. This returns the real path in every case.
 */
export function unquoteGitPath(token) {
  const bare = token.endsWith('\t') ? token.slice(0, -1) : token
  if (bare.length < 2 || !bare.startsWith('"') || !bare.endsWith('"')) return bare
  const body = bare.slice(1, -1)
  const bytes = []
  for (let i = 0; i < body.length; ) {
    if (body[i] === '\\') {
      const { byte, span } = escapeAt(body, i, token)
      bytes.push(byte)
      i += span
    } else {
      const char = String.fromCodePoint(body.codePointAt(i))
      bytes.push(...Buffer.from(char))
      i += char.length
    }
  }
  return Buffer.from(bytes).toString('utf8')
}

/** The path of a `+++ ` header target, or null for /dev/null (a deleted file adds nothing). */
function headerPath(target) {
  const path = unquoteGitPath(target)
  return path === '/dev/null' ? null : path.replace(/^b\//, '')
}

/**
 * The added lines of a unified diff with --unified=0, as a map from path to lines (no `+`). A `+++ `
 * line is a file header only between a `diff --git` line and its first hunk; inside a hunk it is an
 * added line whose text starts with `++ `.
 */
export function parseAddedLines(diffText) {
  const added = new Map()
  let path = null
  let inHeader = false
  for (const line of diffText.split('\n')) {
    if (line.startsWith('diff --git ')) {
      path = null
      inHeader = true
    } else if (line.startsWith('@@')) {
      inHeader = false
    } else if (inHeader && line.startsWith('+++ ')) {
      path = headerPath(line.slice(4))
      if (path !== null && !added.has(path)) added.set(path, [])
    } else if (!inHeader && line.startsWith('+') && path !== null) {
      added.get(path).push(line.slice(1))
    }
  }
  return added
}

/**
 * The paths a `git diff --name-status -M -z` lists, one per entry: the last path of the entry, which is
 * the new path of a rename (R carries two). -z prints every path raw, so no quoting applies.
 */
export function parseNameStatus(text) {
  const parts = text.split('\0')
  if (parts.at(-1) === '') parts.pop()
  const paths = []
  for (let i = 0; i < parts.length; ) {
    const width = parts[i].startsWith('R') || parts[i].startsWith('C') ? 2 : 1
    if (i + width >= parts.length) throw new Error('git printed a name-status entry with a missing path')
    paths.push(parts[i + width])
    i += width + 1
  }
  return paths
}
