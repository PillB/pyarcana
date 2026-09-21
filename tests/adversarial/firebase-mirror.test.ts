/**
 * What the Firestore mirror is allowed to carry.
 *
 * Prisma is the source of truth; syncExamAttempt copies each attempt to Firestore, where
 * firestore.rules grant a learner owner access to their own `examAttempts` documents. D12 keeps the
 * answer key on the server, so the mirrored copy must not hold one. Today a learner's Firebase uid
 * is never their Prisma user id, so that rule cannot match, and this test is what keeps the key out
 * if the two id spaces ever meet.
 *
 * The real sync module runs; only the Firestore handle is replaced.
 *
 * Run: node --import tsx --test --experimental-test-module-mocks tests/adversarial/firebase-mirror.test.ts
 */
import { before, beforeEach, describe, it, mock } from 'node:test'
import assert from 'node:assert/strict'

type Doc = Record<string, unknown>

const written: { collection: string; id: string; data: Doc }[] = []

const firestore = {
  collection(collection: string) {
    return {
      doc(id: string) {
        return {
          async set(data: Doc) {
            written.push({ collection, id, data })
          },
        }
      },
    }
  },
}

function moduleExports(named: Record<string, unknown>) {
  const [major, minor] = process.versions.node.split('.').map(Number)
  return major > 25 || (major === 25 && minor >= 9) ? { exports: named } : { namedExports: named }
}

mock.module('@/lib/firebase/admin', moduleExports({
  isFirebaseSyncEnabled: () => true,
  getFirestoreDb: () => firestore,
}))

let syncExamAttempt: (row: Record<string, unknown>) => Promise<void>

before(async () => {
  ;({ syncExamAttempt } = (await import('../../src/lib/firebase/sync.ts')) as unknown as {
    syncExamAttempt: typeof syncExamAttempt
  })
})

/** A graded attempt as exam/submit stores it: the answers carry the key. */
const graded = (answers: unknown) => ({
  id: 'att-1',
  userId: 'learner',
  sectionId: 'setup',
  attemptNumber: 1,
  answers: JSON.stringify(answers),
  score: 75,
  completedAt: new Date('2026-09-19T10:00:00Z'),
  timeSpentSec: 300,
  variantSeed: JSON.stringify([{ concept: 'venv', variant: 1, questionId: 'q1' }]),
})

beforeEach(() => {
  written.length = 0
})

describe('the exam attempt mirror', () => {
  it('writes the attempt without the answer key or the explanations', async () => {
    await syncExamAttempt(graded([
      { questionId: 'q1', concept: 'venv', variant: 1, selectedIndex: 2, correctIndex: 0, correct: false, explanation: 'porque', question: '¿Q?', options: ['a', 'b'] },
    ]))

    assert.equal(written.length, 1)
    const { collection, id, data } = written[0]!
    assert.deepEqual([collection, id], ['examAttempts', 'att-1'])
    const mirrored = JSON.parse(data.answers as string)
    assert.equal(mirrored.length, 1)
    assert.equal('correctIndex' in mirrored[0], false)
    assert.equal('explanation' in mirrored[0], false)
    // What the mirror is for survives: the learner's own answers and the attempt's figures.
    assert.deepEqual(
      [mirrored[0].selectedIndex, mirrored[0].correct, mirrored[0].question],
      [2, false, '¿Q?']
    )
    assert.deepEqual([data.score, data.timeSpentSec, data.userId], [75, 300, 'learner'])
    assert.equal(typeof data.variantSeed, 'string')
  })

  it('carries no key whatever the stored answers hold', async () => {
    await syncExamAttempt(graded('not json'))
    await syncExamAttempt({ ...graded([]), answers: null })
    assert.deepEqual(written.map((w) => w.data.answers), ['[]', null])
  })
})
