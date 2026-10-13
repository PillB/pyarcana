/**
 * Contract: GitHub Pages deploys only a commit the Tests workflow passed on main, and only that
 * commit (owner decision O17).
 *
 * deploy.yml ran on every push to main, in parallel with the tests rather than after them, so a
 * red commit reached learners; and `workflow_dispatch` could deploy any ref by hand. The fix is a
 * `workflow_run` trigger, which has a trap of its own: under it `github.sha` is the default
 * branch's current tip, not the commit the tests ran on. Reverting any of these properties leaves a
 * valid workflow that deploys untested code, and no run of the workflow would show it.
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..')
const DEPLOY = readFileSync(join(ROOT, '.github/workflows/deploy.yml'), 'utf8')
const TESTS = readFileSync(join(ROOT, '.github/workflows/tests.yml'), 'utf8')
/** The workflow without its comments, so prose about a trigger cannot satisfy or trip a check. */
const CODE = DEPLOY.split('\n').map((line) => line.replace(/(^|\s)#.*$/, '')).join('\n')

describe('deploy gate', () => {
  it('runs after the Tests workflow completes on main, and on nothing else', () => {
    const name = /^name:\s*(.+)$/m.exec(TESTS)?.[1].trim()
    assert.equal(name, 'Tests', 'the workflow the deploy waits for must keep its name')
    assert.match(CODE, /^on:\n {2}workflow_run:\n {4}workflows: \[Tests\]\n {4}types: \[completed\]\n {4}branches: \[main\]\n\n/m)
    assert.doesNotMatch(CODE, /^ {2}(push|pull_request|workflow_dispatch|schedule|repository_dispatch):/m)
  })

  it('builds only a successful push run on main', () => {
    // Blank lines allowed between `build:` and `if:`: CODE keeps a stripped comment as one.
    const condition = /^ {2}build:\n(?:[ \t]*\n)* {4}if: >-\n((?: {6}.+\n)+)/m.exec(CODE)?.[1] ?? ''
    assert.ok(condition, 'build has no `if: >-` condition block')
    for (const clause of [
      "github.event.workflow_run.conclusion == 'success'",
      "github.event.workflow_run.event == 'push'",
      "github.event.workflow_run.head_branch == 'main'",
      'github.event.workflow_run.head_repository.full_name == github.repository',
    ]) {
      assert.ok(condition.includes(clause), `build condition lacks ${clause}`)
    }
    assert.doesNotMatch(condition, /\|\|/, 'an `or` would let one clause bypass the others')
  })

  it('never cancels a deployment in progress, and a skipping run cannot either', () => {
    // Every Tests completion on main starts this workflow, including runs that will skip.
    // Workflow-level concurrency applies before the jobs' `if`, so `cancel-in-progress: true`
    // there let such a run cancel a good deployment midway (docs check, 2026-10-07).
    assert.doesNotMatch(CODE, /^concurrency:/m, 'concurrency belongs on the deploy job, not the workflow')
    assert.match(CODE, /^ {2}deploy:\n(?: {4}.+\n)*? {4}concurrency:\n {6}group: pages\n {6}cancel-in-progress: false\n/m)
  })

  it('checks out, stamps and deploys the tested commit, never github.sha', () => {
    assert.match(CODE, /- uses: actions\/checkout@v4\n {8}with:\n {10}ref: \$\{\{ github\.event\.workflow_run\.head_sha \}\}/)
    assert.match(CODE, /PYARCANA_DEPLOY_SHA: \$\{\{ github\.event\.workflow_run\.head_sha \}\}/)
    assert.doesNotMatch(CODE, /github\.sha\b/)
  })

  it('skips a tested commit that is no longer main\'s tip, through every later step', () => {
    assert.match(CODE, /if \[ "\$tip" = "\$TESTED_SHA" \]; then\n\s+echo "current=true"/)
    const build = /^ {2}build:\n([\s\S]*?)^ {2}deploy:/m.exec(CODE)?.[1] ?? ''
    const steps = build.split(/\n {6}- /).slice(1)
    const afterTip = steps.slice(steps.findIndex((s) => s.includes('id: tip')) + 1)
    assert.ok(afterTip.length >= 4, 'the build steps after the tip check went missing')
    for (const step of afterTip) {
      assert.match(step, /if: steps\.tip\.outputs\.current == 'true'/, `ungated step: ${step.split('\n')[0]}`)
    }
    assert.match(CODE, /^ {2}deploy:\n {4}needs: build\n {4}if: needs\.build\.outputs\.current == 'true'/m)
  })
})

describe('the curriculum/55 integration branch', () => {
  it('gets CI on its pushes and on the PRs that target it', () => {
    assert.match(TESTS, /^ {2}push:\n {4}branches: \[main, develop, curriculum\/55\]$/m)
    assert.match(TESTS, /^ {2}pull_request:\n {4}branches: \[main, curriculum\/55\]$/m)
  })
})
