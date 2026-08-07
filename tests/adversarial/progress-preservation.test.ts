/**
 * Preservation + property tests for learner progress (Safe-Agent §9).
 * Uses the pure progress-sanitize module — the same code path the store imports.
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  EMPTY_PROGRESS,
  PROGRESS_FIELDS,
  PROGRESS_STORAGE_KEY,
  migrateProgressState,
  mergeServerProgress,
  parsePersistedEnvelope,
  roundTripProgress,
  sanitizePersisted,
  serializeProgressEnvelope,
} from '../../src/lib/progress-sanitize.ts'

describe('progress field contract', () => {
  it('exposes the stable storage key python-ds-progress', () => {
    assert.equal(PROGRESS_STORAGE_KEY, 'python-ds-progress')
  })

  it('retains every historical progress field name', () => {
    const required = [
      'completedSections',
      'completedSubSteps',
      'quizScores',
      'lastVisited',
      'bookmarks',
      'startDate',
      'isHydratedFromServer',
    ]
    for (const field of required) {
      assert.ok(PROGRESS_FIELDS.includes(field as (typeof PROGRESS_FIELDS)[number]), field)
    }
  })
})

describe('sanitizePersisted — invalid state fails safely', () => {
  it('returns empty partial for non-objects', () => {
    assert.deepEqual(sanitizePersisted(null), {})
    assert.deepEqual(sanitizePersisted(42), {})
    assert.deepEqual(sanitizePersisted('x'), {})
    assert.deepEqual(sanitizePersisted([]), {})
  })

  it('drops invalid completedSections without inventing values', () => {
    const out = sanitizePersisted({ completedSections: 42, bookmarks: ['setup'] })
    assert.equal(out.completedSections, undefined)
    assert.deepEqual(out.bookmarks, ['setup'])
  })

  it('drops invalid quizScores', () => {
    const out = sanitizePersisted({ quizScores: { setup: '100' } })
    assert.equal(out.quizScores, undefined)
  })

  it('accepts a valid full shape', () => {
    const valid = {
      completedSections: ['setup'],
      completedSubSteps: { setup: ['theory', 'ido'] },
      quizScores: { setup: 80 },
      lastVisited: 'setup',
      bookmarks: ['basics'],
      startDate: '2024-01-01T00:00:00.000Z',
      isHydratedFromServer: false,
    }
    assert.deepEqual(sanitizePersisted(valid), valid)
  })

  it('ignores unknown additive fields without throwing', () => {
    const out = sanitizePersisted({
      completedSections: ['setup'],
      futureMediaFlags: { setup: true },
      mediaVersion: 3,
    })
    assert.deepEqual(out.completedSections, ['setup'])
    assert.equal((out as { futureMediaFlags?: unknown }).futureMediaFlags, undefined)
  })
})

describe('serialization round-trip preserves valid progress', () => {
  it('round-trips completed work, bookmarks, and quiz scores', () => {
    const state = {
      completedSections: ['setup', 'basics'],
      completedSubSteps: { setup: ['theory', 'youdo'], basics: ['quiz'] },
      quizScores: { setup: 100, basics: 75 },
      lastVisited: 'basics',
      bookmarks: ['setup'],
      startDate: '2025-06-01T12:00:00.000Z',
      isHydratedFromServer: false,
    }
    const again = roundTripProgress(state, 0)
    assert.deepEqual(again, state)
  })

  it('parsePersistedEnvelope fails safely on corrupt JSON', () => {
    const bad = parsePersistedEnvelope('{not-json')
    assert.equal(bad.ok, false)
    assert.deepEqual(bad.state, {})
  })

  it('parsePersistedEnvelope accepts envelope with additive unknown state keys', () => {
    const raw = serializeProgressEnvelope(
      { completedSections: ['setup'], bookmarks: ['setup'] },
      0
    )
    const parsed = JSON.parse(raw)
    parsed.state.extraFuture = { x: 1 }
    const result = parsePersistedEnvelope(JSON.stringify(parsed))
    assert.equal(result.ok, true)
    assert.deepEqual(result.state.completedSections, ['setup'])
    assert.deepEqual(result.state.bookmarks, ['setup'])
  })
})

describe('migration preserves completed work and is idempotent', () => {
  it('migrate v0→v1 keeps completed sections and quiz scores', () => {
    const before = {
      completedSections: ['setup'],
      quizScores: { setup: 90 },
      bookmarks: ['setup'],
      completedSubSteps: { setup: ['theory'] },
    }
    const once = migrateProgressState(before, 0, 1)
    assert.deepEqual(once.state.completedSections, ['setup'])
    assert.deepEqual(once.state.quizScores, { setup: 90 })
    assert.deepEqual(once.state.bookmarks, ['setup'])
    assert.equal(once.version, 1)

    const twice = migrateProgressState(once.state, once.version, 1)
    assert.deepEqual(twice.state, once.state)
    assert.equal(twice.version, 1)
  })

  it('additive media flags in partial state do not alter completion', () => {
    const base = {
      completedSections: ['setup'],
      completedSubSteps: { setup: ['theory'] },
      quizScores: { setup: 100 },
    }
    const withMedia = { ...base, /* media not in contract */ }
    const rt = roundTripProgress(withMedia)
    assert.deepEqual(rt.completedSections, base.completedSections)
    assert.deepEqual(rt.completedSubSteps, base.completedSubSteps)
    assert.deepEqual(rt.quizScores, base.quizScores)
  })
})

describe('server hydrate merge never loses local completed work (DEF-SA-001)', () => {
  it('empty server progress does not wipe local sub-steps or bookmarks', () => {
    const local = {
      completedSections: ['setup'],
      completedSubSteps: { setup: ['theory', 'ido'] },
      quizScores: { setup: 100 },
      bookmarks: ['setup', 'basics'],
    }
    const merged = mergeServerProgress(local, { progress: {}, bookmarks: [] })
    assert.deepEqual(merged.completedSubSteps.setup, ['theory', 'ido'])
    assert.deepEqual(merged.bookmarks.sort(), ['basics', 'setup'])
    assert.deepEqual(merged.completedSections, ['setup'])
    assert.deepEqual(merged.quizScores, { setup: 100 })
    assert.equal(merged.isHydratedFromServer, true)
  })

  it('merges server and local sub-steps as a set union', () => {
    const local = {
      completedSections: [],
      completedSubSteps: { setup: ['theory'] },
      quizScores: {},
      bookmarks: ['setup'],
    }
    const merged = mergeServerProgress(local, {
      progress: { setup: ['ido'], basics: ['theory'] },
      bookmarks: ['basics'],
    })
    assert.deepEqual(merged.completedSubSteps.setup.sort(), ['ido', 'theory'])
    assert.deepEqual(merged.completedSubSteps.basics, ['theory'])
    assert.deepEqual(merged.bookmarks.sort(), ['basics', 'setup'])
  })

  it('merge is idempotent', () => {
    const local = {
      completedSections: ['setup'],
      completedSubSteps: { setup: ['theory'] },
      quizScores: { setup: 50 },
      bookmarks: ['setup'],
    }
    const server = { progress: { setup: ['ido'] }, bookmarks: ['basics'] }
    const a = mergeServerProgress(local, server)
    const b = mergeServerProgress(
      {
        completedSections: a.completedSections,
        completedSubSteps: a.completedSubSteps,
        quizScores: a.quizScores,
        bookmarks: a.bookmarks,
      },
      server
    )
    assert.deepEqual(b.completedSubSteps, a.completedSubSteps)
    assert.deepEqual(b.bookmarks.sort(), a.bookmarks.sort())
  })

  it('nullish server payload fails closed to local data', () => {
    const local = {
      completedSections: ['setup'],
      completedSubSteps: { setup: ['quiz'] },
      quizScores: { setup: 80 },
      bookmarks: ['setup'],
    }
    const merged = mergeServerProgress(local, {
      progress: null,
      bookmarks: null,
    })
    assert.deepEqual(merged.completedSubSteps, local.completedSubSteps)
    assert.deepEqual(merged.bookmarks, local.bookmarks)
    assert.deepEqual(merged.quizScores, local.quizScores)
  })
})

describe('empty defaults', () => {
  it('EMPTY_PROGRESS has safe zero state', () => {
    assert.deepEqual(EMPTY_PROGRESS.completedSections, [])
    assert.deepEqual(EMPTY_PROGRESS.bookmarks, [])
    assert.equal(EMPTY_PROGRESS.lastVisited, null)
  })
})
