/**
 * Dual-write helpers: mirror server mutations to Firestore (Firebase Spark).
 * Failures are logged and never throw — Prisma remains source of truth for the app.
 */

import { getFirestoreDb, isFirebaseSyncEnabled } from './admin'

const COLLECTIONS = {
  users: 'users',
  progress: 'progress',
  examAttempts: 'examAttempts',
  exerciseAttempts: 'exerciseAttempts',
  feedbackReports: 'feedbackReports',
} as const

function stripUndefined<T extends Record<string, unknown>>(obj: T): T {
  const out = { ...obj }
  for (const k of Object.keys(out)) {
    if (out[k] === undefined) delete out[k]
  }
  return out
}

/** Serialize dates for Firestore / JSON. */
function serialize(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString()
  if (Array.isArray(value)) return value.map(serialize)
  if (value && typeof value === 'object') {
    const o: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v === undefined) continue
      o[k] = serialize(v)
    }
    return o
  }
  return value
}

async function upsertDoc(
  collection: string,
  id: string,
  data: Record<string, unknown>
): Promise<boolean> {
  if (!isFirebaseSyncEnabled()) return false
  const firestore = getFirestoreDb()
  if (!firestore) return false
  try {
    const payload = stripUndefined({
      ...(serialize(data) as Record<string, unknown>),
      _syncedAt: new Date().toISOString(),
      _source: 'pyarcana-api',
    })
    await firestore.collection(collection).doc(id).set(payload, { merge: true })
    return true
  } catch (e) {
    console.error(`[firebase] upsert ${collection}/${id}`, e)
    return false
  }
}

/** Public profile only — never write passwordHash to Firestore. */
export async function syncUser(user: {
  id: string
  email: string
  name?: string | null
  role?: string
  country?: string | null
  createdAt?: Date | string
  updatedAt?: Date | string
}): Promise<void> {
  await upsertDoc(COLLECTIONS.users, user.id, {
    id: user.id,
    email: user.email,
    name: user.name ?? null,
    role: user.role ?? 'STUDENT',
    country: user.country ?? null,
    createdAt: user.createdAt ?? new Date().toISOString(),
    updatedAt: user.updatedAt ?? new Date().toISOString(),
  })
}

export async function syncProgress(row: {
  userId: string
  sectionId: string
  subStep: string
  completed: boolean
  completedAt?: Date | string | null
  bookmarked?: boolean
}): Promise<void> {
  const id = `${row.userId}__${row.sectionId}__${row.subStep}`
  await upsertDoc(COLLECTIONS.progress, id, {
    ...row,
    id,
  })
}

export async function syncExamAttempt(row: {
  id: string
  userId: string
  sectionId: string
  attemptNumber: number
  answers?: string | null
  score?: number | null
  startedAt?: Date | string
  completedAt?: Date | string | null
  timeSpentSec?: number
  variantSeed?: string | null
}): Promise<void> {
  await upsertDoc(COLLECTIONS.examAttempts, row.id, row)
}

export async function syncExerciseAttempt(row: {
  id: string
  userId: string
  sectionId: string
  exerciseId: string
  usedHint: boolean
  correct: boolean
  attemptedAt?: Date | string
}): Promise<void> {
  await upsertDoc(COLLECTIONS.exerciseAttempts, row.id, row)
}

export async function syncFeedbackReport(row: {
  id: string
  type: string
  status: string
  title: string
  body: string
  sectionId?: string | null
  pagePath?: string | null
  userAgent?: string | null
  email?: string | null
  userId?: string | null
  adminNote?: string | null
  createdAt?: Date | string
  updatedAt?: Date | string
}): Promise<void> {
  await upsertDoc(COLLECTIONS.feedbackReports, row.id, row)
}

export { COLLECTIONS as FIREBASE_COLLECTIONS }
