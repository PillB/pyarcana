import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, existsSync, writeFileSync, rmSync, chmodSync, renameSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { section01 } from '../../src/lib/course/sections/s01-setup'

const steps = section01.weDo.steps
const getExercise = (id: string) => {
  const exercise = steps.find((s) => s.id === id)
  assert.ok(exercise, `Missing canonical exercise ${id}`)
  return exercise
}

test('S01 has exactly 24 uniquely identified exercises in an ordered E1/E2/E3 sequence', () => {
  const actual = steps.map((s) => s.id)
  const expected = ['T1-A', 'T1-B', 'T2-A', 'T2-B', 'T3-A', 'T3-B', 'T4-A', 'T4-B']
    .flatMap((topic) => [1, 2, 3].map((n) => `S01-${topic}-E${n}`))
  assert.deepEqual(actual, expected)

  // Negative control: duplication, deletion, or reordering must fail the oracle.
  assert.notDeepEqual([...actual.slice(1), actual[0]], expected)
})

test('PowerShell-native exit code teaching distinguishes shell failures from process exit codes', () => {
  const exercise = getExercise('S01-T1-B-E2')
  assert.match(exercise.instruction, /\$LASTEXITCODE.*puede no actualizar/)
  assert.match(exercise.instruction, /\$\?.*True.*False/)
  assert.match(exercise.tests, /sin inventar un código numérico en PowerShell/)
  // Former regression: the bad instruction applied LASTEXITCODE to every command.
  assert.doesNotMatch(exercise.instruction, /Después de cada uno, lee.*LASTEXITCODE/)
})

test('Git restore is graded as a destructive discard, not as guaranteed recovery', () => {
  const exercise = getExercise('S01-T3-B-E3')
  assert.match(exercise.tests, /restore pierde ediciones sin commit/)
  assert.match(exercise.solutionCode.code, /destruye las modificaciones sin commit/)
  assert.match(exercise.instruction, /Inspecciona.*status.*diff/)
  assert.doesNotMatch(exercise.preamble, /procedimiento correcto no destructivo/)
})

test('venv deletion code refuses to remove anything when preflight fails or confirmation is absent', () => {
  const exercise = getExercise('S01-T2-A-E2')
  const script = exercise.solutionCode.code
  const temp = mkdtempSync(join(tmpdir(), 'pyarcana-s01-venv-safety-'))
  const venvPath = join(temp, '.venv')
  const sentinel = join(venvPath, 'MUST_SURVIVE.txt')
  try {
    mkdirSync(venvPath)
    writeFileSync(sentinel, 'do not remove')
    // Negative control A: missing hello.py, even with a deletion confirmation.
    const noSource = spawnSync('bash', ['-c', script], {
      cwd: temp, input: 'BORRAR\n', encoding: 'utf8', timeout: 15_000,
    })
    assert.notEqual(noSource.status, 0, 'Missing source incorrectly returned success')
    assert.match(noSource.stderr, /ABORTADO/)
    assert.equal(existsSync(sentinel), true, 'Venv was deleted despite missing source preflight')

    // Negative control B: valid files but the user DID NOT confirm deletion.
    writeFileSync(join(temp, 'hello.py'), "print('hola')\n")
    const noConsent = spawnSync('bash', ['-c', script], {
      cwd: temp, input: 'NO\n', encoding: 'utf8', timeout: 15_000,
    })
    assert.notEqual(noConsent.status, 0, 'Declined confirmation incorrectly returned success')
    assert.equal(existsSync(sentinel), true, 'Venv was deleted without confirmation')

    // Negative control C: venv creation itself fails. Previous code continued
    // to a successful global-Python check and printed a false-green result.
    const mockBin = join(temp, 'mockbin')
    mkdirSync(mockBin)
    const brokenPython = join(mockBin, 'python3')
    writeFileSync(brokenPython, '#!/bin/sh\necho "SIMULATED VENV FAILURE" >&2\nexit 42\n')
    chmodSync(brokenPython, 0o755)
    const creationFails = spawnSync('bash', ['-c', script], {
      cwd: temp, input: 'BORRAR\n', encoding: 'utf8', timeout: 15_000,
      env: { ...process.env, PATH: `${mockBin}:${process.env.PATH}` },
    })
    assert.notEqual(creationFails.status, 0, 'Failed Python creation incorrectly reported success')
    assert.equal(existsSync(join(temp, '.venv_respaldo_s01', 'MUST_SURVIVE.txt')), true,
      'Original virtualenv was discarded even though recreation failed')

    // Reset the controlled fixture after the failed creation, preserving the
    // original material; the successful path below must delete the backup.
    if (!existsSync(venvPath)) {
      renameSync(join(temp, '.venv_respaldo_s01'), venvPath)
    }

    // Positive control: valid cwd and explicit confirmation recreate only .venv.
    const approved = spawnSync('bash', ['-c', script], {
      cwd: temp, input: 'BORRAR\n', encoding: 'utf8', timeout: 30_000,
    })
    assert.equal(approved.status, 0, approved.stderr)
    assert.equal(existsSync(sentinel), false, 'Old virtualenv was not replaced')
    assert.equal(existsSync(join(temp, '.venv_respaldo_s01')), false,
      'Successful rebuild left an old untracked virtualenv backup')
    assert.equal(existsSync(join(temp, '.venv', 'pyvenv.cfg')), true)
    assert.equal(existsSync(join(temp, 'hello.py')), true, 'Source code was removed')
    assert.match(approved.stdout, /Verificado: hello\.py sigue presente/)
  } finally {
    rmSync(temp, { recursive: true, force: true })
  }
})
