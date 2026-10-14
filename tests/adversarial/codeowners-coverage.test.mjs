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
import { existsSync, readFileSync, statSync } from 'node:fs'
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

/**
 * What GitHub accepts as an owner: `@user`, `@org/team` or an email address (docs.github.com,
 * "About code owners"). This checks the syntax. Whether the user or team exists and has write
 * access is GitHub's check: `gh api repos/OWNER/REPO/codeowners/errors` reports it for a pushed ref.
 */
const OWNER_SYNTAX = /^@[A-Za-z0-9](?:-?[A-Za-z0-9])*(?:\/[\w.-]+)?$|^[^@\s]+@[^@\s]+$/
/** The gitignore syntax the same page lists as not working in CODEOWNERS: `\#`, a leading `!`, `[ ]`. */
const UNSUPPORTED_PATTERN = /^\\#|^!|\[/

/**
 * One CODEOWNERS line as a rule, or null for a blank or comment line. A `#` after whitespace
 * starts an inline comment. `problems` lists why GitHub would skip the line: GitHub drops a line
 * with invalid syntax and keeps the rest, so a skipped line must not count as an owner here.
 */
function parseRule(raw, number) {
  const line = raw.replace(/\s+#.*$/, '').trim()
  if (!line || line.startsWith('#')) return null
  const [pattern, ...owners] = line.split(/\s+/)
  const problems = owners
    .filter((owner) => !OWNER_SYNTAX.test(owner))
    .map((owner) => `"${owner}" is not @user, @org/team or an email address`)
  if (UNSUPPORTED_PATTERN.test(pattern)) problems.push(`"${pattern}" uses gitignore syntax GitHub does not support`)
  return { number, pattern, owners, problems, re: patternRegExp(pattern) }
}

/** The rules GitHub keeps, and the lines it skips. */
function codeownersRules(text) {
  const parsed = text.split('\n').map((raw, index) => parseRule(raw, index + 1)).filter(Boolean)
  return {
    rules: parsed.filter((rule) => rule.problems.length === 0),
    skipped: parsed.filter((rule) => rule.problems.length > 0),
  }
}
const { rules: RULES, skipped: SKIPPED } = codeownersRules(CODEOWNERS)

/** The rule GitHub applies to a path: the last kept rule that matches it. */
function governingRule(path, rules = RULES) {
  return rules.filter((rule) => rule.re.test(path)).at(-1)
}

/** The owners GitHub requests for a path: those of its governing rule. */
function ownersOf(path, rules = RULES) {
  const hit = governingRule(path, rules)
  return hit ? hit.owners : []
}

describe('CODEOWNERS lines are ones GitHub keeps', () => {
  it('has no line with a malformed owner or an unsupported pattern', () => {
    const lines = SKIPPED.map((rule) => `line ${rule.number} (${rule.pattern}): ${rule.problems.join('; ')}`)
    assert.deepEqual(lines, [], 'GitHub skips these lines, so the paths they name lose their owner')
  })

  it('accepts @user, @org/team and an email, and refuses anything else', () => {
    for (const owner of ['@PillB', '@a', '@Pill-B', '@org/team-name', '@org/team_name', 'me@example.com']) {
      assert.ok(OWNER_SYNTAX.test(owner), `${owner} is a valid owner`)
    }
    for (const owner of ['PillB', '@', '@-PillB', '@PillB-', '@org/', '@/team', '@org/a/b', 'PillB@', '@@PillB']) {
      assert.ok(!OWNER_SYNTAX.test(owner), `${owner} is not a valid owner`)
    }
  })

  it('reads an inline comment as a comment, not as owners', () => {
    const { rules, skipped } = codeownersRules('/a/ @PillB # why\n  # an indented comment\n')
    assert.deepEqual(skipped, [])
    assert.deepEqual(rules.map((rule) => rule.owners), [['@PillB']])
  })

  it('skips a whole line with a malformed owner and falls back to the last line that matches', () => {
    const { rules, skipped } = codeownersRules('/src/ @A\n/src/x.ts B\n/src/y.ts @C\n')
    assert.equal(skipped.length, 1)
    assert.deepEqual(ownersOf('src/x.ts', rules), ['@A'])
    assert.deepEqual(ownersOf('src/y.ts', rules), ['@C'])
  })

  it('refuses the gitignore syntax GitHub says does not work', () => {
    for (const pattern of ['!/a', '\\#a', '/a[0-9]']) {
      assert.equal(codeownersRules(`${pattern} @PillB`).skipped.length, 1, `${pattern} is skipped`)
    }
    for (const pattern of ['/a', 'a/*.md', '**/logs', '/scripts/*regression*']) {
      assert.equal(codeownersRules(`${pattern} @PillB`).skipped.length, 0, `${pattern} is kept`)
    }
  })
})

/**
 * AGENTS.md's protected-path list: the backticked names before the legacy note (whose
 * `INACTIVE_PRESERVED` is a label, not a path), plus "this file", which is AGENTS.md itself.
 */
function agentsProtectedPaths() {
  const start = AGENTS.indexOf('## Protected paths')
  const legacy = AGENTS.indexOf('Inactive legacy files', start)
  if (start < 0 || legacy < 0) return []
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
  // Nothing in this describe body may throw: Node 24 reports a throw here as a failed suite and
  // still exits 0. The parser returns an empty list instead, and the floor test below fails on it.
  const entries = agentsProtectedPaths()

  it('reads the protected-path list, so a parser that found nothing cannot pass', () => {
    // A floor, not a ceiling: AGENTS.md lists 13 entries today, and removing one is itself ask-first.
    assert.ok(entries.length >= 13, `found ${entries.length} protected-path entries; is the "## Protected paths" heading still there?`)
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
 * The guard inputs the renumber design names for CODEOWNERS. The section manifest (the
 * badge-identity file, not the preservation manifest AGENTS.md also calls "manifest") lives at
 * src/lib/eligibility/section_manifest.json, and keeps a basename rule too, so a copy placed
 * elsewhere stays owned. The window, epoch, ledger and pending files have no fixed path yet and
 * are named by basename. Each probe is a path the input may take; each must have an owner.
 */
const GUARD_INPUTS = [
  {
    token: 'src/lib/eligibility/',
    probes: [
      'src/lib/eligibility/engine.ts',
      'src/lib/eligibility/section_manifest.json',
      'src/lib/eligibility/skill_node_terms.json',
      'src/lib/eligibility/claim_digests.json',
    ],
  },
  {
    token: 'section_manifest.json',
    probes: ['section_manifest.json', 'audit/renumber/section_manifest.json', 'src/lib/eligibility/section_manifest.json'],
  },
  { token: 'curriculum55_window.json', probes: ['curriculum55_window.json', 'audit/renumber/curriculum55_window.json'] },
  { token: 'renumber_epoch.json', probes: ['renumber_epoch.json', 'audit/renumber/renumber_epoch.json'] },
  { token: 'renumber_edit_ledger.json', probes: ['renumber_edit_ledger.json', 'audit/renumber/renumber_edit_ledger.json'] },
  { token: 'authoring_pending.json', probes: ['authoring_pending.json', 'audit/renumber/authoring_pending.json'] },
]

describe('CODEOWNERS covers the renumber guard inputs', () => {
  for (const input of GUARD_INPUTS) {
    it(`gives ${input.token} an owner wherever it is placed`, () => {
      for (const probe of input.probes) {
        assert.ok(ownersOf(probe).length > 0, `${probe} has no CODEOWNERS owner`)
      }
    })
  }
})

/**
 * The files the owner named by real path (answer of 2026-10-13, on top of O17: CODEOWNERS and an
 * ask-first line cover the new state files). Each arrives with a sibling PR and is not on main
 * yet, so on main today these are probes, as the B11 paths below are:
 *   - audit/fixer/numbering_epoch.json: the fixer's numbering epoch (0b-6)
 *   - src/lib/eligibility/section_manifest.json, skill_node_terms.json, claim_digests.json: the
 *     badge manifest, the skill-term lexicon and the claim digests (0b-4)
 *   - src/lib/credential-statement.ts: the signed statement template (the copy PR moved it there)
 * The directory rule and the basename rule above already reach the three eligibility files, and
 * a rule can be narrowed or removed in a diff nobody reads as an ownership change. So each file
 * needs a line of its own, and GitHub applies the LAST matching line: the line must sit after
 * the broader ones, or a later change to their owner would override it.
 */
const NAMED_PATHS = [
  'audit/fixer/numbering_epoch.json',
  'src/lib/eligibility/section_manifest.json',
  'src/lib/eligibility/skill_node_terms.json',
  'src/lib/eligibility/claim_digests.json',
  'src/lib/credential-statement.ts',
]

describe('CODEOWNERS gives each file the owner named by path a line of its own', () => {
  for (const path of NAMED_PATHS) {
    it(`has a line for ${path}, after the broader rules, with an owner`, () => {
      const rule = governingRule(path)
      assert.ok(rule, `${path} matches no CODEOWNERS rule`)
      assert.equal(rule.pattern, `/${path}`,
        `${path} is governed by "${rule.pattern}" (line ${rule.number}), not by a line of its own; GitHub applies the last match`)
      assert.ok(rule.owners.length > 0, `line ${rule.number} (${rule.pattern}) names no owner, which leaves the file unowned`)
    })
  }

  it('reads the governing rule as the last match, so a broader line placed after an explicit one wins', () => {
    const { rules } = codeownersRules('/src/a.ts @A\n/src/ @B\n')
    assert.equal(governingRule('src/a.ts', rules).pattern, '/src/')
    assert.deepEqual(ownersOf('src/a.ts', rules), ['@B'])
  })
})

/**
 * B11's tools (commit 4fd68c186 on claude/phase0b-history-guards-r2, not on main yet): the
 * fingerprint collector and the classifier that decide when an exercise id has changed meaning.
 * Editing either changes what the preservation sentinel lets through, so a reviewer must see it.
 * The ledger they write, audit/safe-agent/exercise-meaning-ledger.json, is already under
 * /audit/safe-agent/. The two explicit paths below are probes until B11 merges; the tracked-file
 * test after them then covers whatever the files are called when they land.
 */
const B11_TOOLS = [
  'scripts/exercise_meaning.mjs',
  'scripts/exercise_fingerprints.mts',
  'audit/safe-agent/exercise-meaning-ledger.json',
]

describe('CODEOWNERS covers the B11 exercise-meaning tools', () => {
  for (const tool of B11_TOOLS) {
    it(`gives ${tool} an owner`, () => {
      assert.ok(ownersOf(tool).length > 0, `${tool} has no CODEOWNERS owner`)
    })
  }

  it('gives every tracked scripts/exercise_* file an owner, so a rename cannot leave one unowned', () => {
    const unowned = TRACKED.filter((path) => /^scripts\/exercise_/.test(path) && ownersOf(path).length === 0)
    assert.deepEqual(unowned, [], `no CODEOWNERS owner for: ${unowned.join(', ')}`)
  })
})

/** The ask-first section's bullets, each starting at its `- ` marker. */
function askFirstBullets() {
  const start = AGENTS.indexOf('## Ask first')
  if (start < 0) throw new Error('AGENTS.md has no "## Ask first" section')
  const next = AGENTS.indexOf('\n## ', start + 1)
  return AGENTS.slice(start, next < 0 ? undefined : next).split(/\n(?=- )/)
}

describe('AGENTS.md ask-first names the renumber guard inputs', () => {
  it('has one ask-first bullet that names the section manifest and every guard input', () => {
    // "the section manifest", not "the manifest": the Always list uses "manifest" for the
    // preservation manifest, and a reader must not take the bullet to mean that file.
    // A directory token must stand as its own code span: every full path under it contains the
    // directory as a substring, so a bullet narrowed to two files would otherwise still match.
    const names = (b, token) => (token.endsWith('/') ? b.includes(`\`${token}\``) : b.includes(token))
    const bullet = askFirstBullets().find((b) =>
      /\bsection manifest\b/.test(b) && GUARD_INPUTS.every((input) => names(b, input.token)))
    assert.ok(bullet, `no ask-first bullet says "section manifest" and names all of: ${GUARD_INPUTS.map((i) => i.token).join(', ')}`)
  })

  for (const path of NAMED_PATHS) {
    it(`names ${path} in full, as a code span, in an ask-first bullet`, () => {
      // The full path, not the basename: `numbering_epoch.json` alone does not say which file, and
      // a longer path that merely contains this one must not satisfy the check.
      const named = askFirstBullets().some((bullet) => bullet.includes(`\`${path}\``))
      assert.ok(named, `no ask-first bullet names \`${path}\``)
    })
  }
})

/** The first bash block under an AGENTS.md heading: one command per line. */
function bashBlockUnder(heading) {
  const start = AGENTS.indexOf(heading)
  if (start < 0) throw new Error(`AGENTS.md has no "${heading}" section`)
  const block = AGENTS.slice(start).match(/```bash\n([\s\S]*?)```/)
  if (!block) throw new Error(`no bash block under "${heading}"`)
  return block[1].split('\n')
}

/** A command line with each run of spaces collapsed to one, so realigning a comment column is no edit. */
const squeeze = (line) => line.trim().replace(/\s+/g, ' ')

/**
 * The owner's line must be in the block, in the owner's words, wherever in the block it stands.
 * Its place is not pinned: the renumber PR and later edits add lines to these blocks, and a test
 * that fails on the next unrelated edit pushes the editor to weaken it.
 */
function assertLineIn(lines, expected) {
  const found = lines.some((line) => squeeze(line) === squeeze(expected))
  assert.ok(found, `the block has no line "${squeeze(expected)}"`)
}

describe('AGENTS.md carries the two commands the owner added', () => {
  it('lists test:python-strict in Done means, in the owner\'s words', () => {
    assertLineIn(bashBlockUnder('## Done means these pass'),
      'npm run test:python-strict       # every declared output line equals what the code prints')
  })

  it('lists run_spanish.sh in When fixing a section, in the owner\'s words', () => {
    assertLineIn(bashBlockUnder('## When fixing a section'),
      'tools/fixer/run_spanish.sh SXX              # English in the Spanish, decided word by word')
  })

  it('names only commands that exist: the npm script, and an executable runner', () => {
    const scripts = JSON.parse(read('package.json')).scripts
    assert.ok(scripts['test:python-strict'], 'package.json has no test:python-strict script')
    const runner = join(ROOT, 'tools/fixer/run_spanish.sh')
    assert.ok(existsSync(runner), 'tools/fixer/run_spanish.sh is missing')
    assert.ok((statSync(runner).mode & 0o111) !== 0, 'tools/fixer/run_spanish.sh is not executable')
  })
})
