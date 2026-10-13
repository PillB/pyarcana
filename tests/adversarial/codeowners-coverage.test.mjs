/**
 * Contract: CODEOWNERS covers every protected path AGENTS.md lists and every guard input the
 * renumber design names (owner decision O17; design_G_round4.md section 5, Gate A decision 3;
 * design_ruled_final.md section 4.1, step 0b-2).
 *
 * A changed path with no owner gets no review request, and a guard input is exactly the kind of
 * path a reviewer must see. GitHub applies the last CODEOWNERS pattern that matches a path, so
 * removing an entry, or placing one with no owner after it, leaves the path unreviewed and turns
 * these tests red.
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..')
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8')
const CODEOWNERS = read('.github/CODEOWNERS')
const AGENTS = read('AGENTS.md')

/** Every path git tracks, as the repository sees it (untracked files are not reviewed-by-policy). */
function trackedFiles() {
  const listing = spawnSync('git', ['ls-files', '-z'], {
    cwd: ROOT, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024,
  })
  if (listing.status !== 0) throw new Error(`git ls-files failed: ${listing.stderr}`)
  return listing.stdout.split('\0').filter(Boolean)
}
const TRACKED = trackedFiles()

/** A glob as a regular-expression source: `*` and `?` stay in one segment, `**\/` crosses any depth. */
function globSource(glob) {
  return glob
    .split('**/')
    .map((part) => part.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]*').replace(/\?/g, '[^/]'))
    .join('(?:.*/)?')
}

/**
 * A CODEOWNERS pattern as a regular expression, with gitignore anchoring: a slash at the start or
 * in the middle roots it at the repository, a bare name matches at any depth, and a trailing slash
 * covers everything beneath the directory.
 */
function patternRegExp(pattern) {
  const body = pattern.replace(/^\//, '').replace(/\/$/, '')
  const rooted = pattern.startsWith('/') || body.includes('/')
  const head = rooted ? '^' : '^(?:.*/)?'
  const tail = pattern.endsWith('/') ? '/.+$' : '$'
  return new RegExp(head + globSource(body) + tail)
}

function codeownersRules(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const [pattern, ...owners] = line.split(/\s+/)
      return { owners, re: patternRegExp(pattern) }
    })
}
const RULES = codeownersRules(CODEOWNERS)

/** The owners GitHub requests for a path: those of the last rule that matches it. */
function ownersOf(path) {
  const hit = RULES.filter((rule) => rule.re.test(path)).at(-1)
  return hit ? hit.owners : []
}

/**
 * AGENTS.md's protected-path list: the backticked names before the legacy note (whose
 * `INACTIVE_PRESERVED` is a label, not a path), plus "this file", which is AGENTS.md itself.
 */
function agentsProtectedPaths() {
  const start = AGENTS.indexOf('## Protected paths')
  const legacy = AGENTS.indexOf('Inactive legacy files', start)
  if (start < 0 || legacy < 0) throw new Error('AGENTS.md protected-path section not found')
  const section = AGENTS.slice(start, legacy)
  const names = [...section.matchAll(/`([^`]+)`/g)].map((m) => m[1])
  return /this file/.test(section) ? [...names, 'AGENTS.md'] : names
}

/** AGENTS.md writes `CODEOWNERS` for `.github/CODEOWNERS`; every other entry is a path from the root. */
const AGENTS_NAMES = { CODEOWNERS: '.github/CODEOWNERS' }
function agentsEntryRegExp(entry) {
  return patternRegExp(`/${AGENTS_NAMES[entry] ?? entry}`)
}

describe('CODEOWNERS covers AGENTS.md protected paths', () => {
  const entries = agentsProtectedPaths()

  it('reads the protected-path list, so a parser that found nothing cannot pass', () => {
    // A floor, not a ceiling: AGENTS.md lists 13 entries today, and removing one is itself ask-first.
    assert.ok(entries.length >= 13, `found ${entries.length} protected-path entries`)
  })

  for (const entry of entries) {
    it(`gives every tracked file under ${entry} an owner`, () => {
      const re = agentsEntryRegExp(entry)
      const files = TRACKED.filter((path) => re.test(path))
      assert.ok(files.length > 0, `${entry} matches no tracked file, so the check would be vacuous`)
      const unowned = files.filter((path) => ownersOf(path).length === 0)
      assert.deepEqual(unowned, [], `no CODEOWNERS owner for: ${unowned.join(', ')}`)
    })
  }
})

/**
 * The guard inputs the renumber design names for CODEOWNERS. The manifest sits under
 * src/lib/eligibility/ (its own path is not fixed by the design). The window, epoch, ledger and
 * pending files are named by basename, so each entry is a basename rule that holds wherever the
 * file is placed. Each probe is a path the input may take; each must have an owner.
 */
const GUARD_INPUTS = [
  { name: 'src/lib/eligibility/ (the manifest)', probes: ['src/lib/eligibility/engine.ts', 'src/lib/eligibility/manifest.json'] },
  { name: 'curriculum55_window.json', probes: ['curriculum55_window.json', 'audit/renumber/curriculum55_window.json'] },
  { name: 'renumber_epoch.json', probes: ['renumber_epoch.json', 'audit/renumber/renumber_epoch.json'] },
  { name: 'renumber_edit_ledger.json', probes: ['renumber_edit_ledger.json', 'audit/renumber/renumber_edit_ledger.json'] },
  { name: 'authoring_pending.json', probes: ['authoring_pending.json', 'audit/renumber/authoring_pending.json'] },
]

describe('CODEOWNERS covers the renumber guard inputs', () => {
  for (const input of GUARD_INPUTS) {
    it(`gives ${input.name} an owner wherever it is placed`, () => {
      for (const probe of input.probes) {
        assert.ok(ownersOf(probe).length > 0, `${probe} has no CODEOWNERS owner`)
      }
    })
  }
})
