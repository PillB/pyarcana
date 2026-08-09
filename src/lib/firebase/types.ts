/**
 * Firestore collection types for the PyArcana client.
 *
 * These mirror the server-side collections (see `src/lib/firebase/sync.ts`)
 * but live here so client components can read/write typed documents without
 * importing the Admin SDK.
 *
 * Naming convention:
 *   - `*Doc`    — a Firestore document shape (snake_case + ISO dates, since
 *                  Firestore prefers primitives and JSON-serialisable values).
 *   - `*Input`  — the write payload (omits server-managed fields).
 *
 * Owner-scoped security rules (see `firestore.rules`) guarantee that a learner
 * can only read/write their own data; supervisors get cohort-scoped read access
 * via the `cohort` membership document.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Users — public profile only. Never store passwordHash here.
// ─────────────────────────────────────────────────────────────────────────────
export interface UserDoc {
  id: string
  email: string
  name: string | null
  role: 'STUDENT' | 'SUPERVISOR' | 'ADMIN'
  country: string | null
  cohortIds: string[]
  createdAt: string
  updatedAt: string
}

export interface UserInput {
  email: string
  name?: string | null
  role?: 'STUDENT' | 'SUPERVISOR' | 'ADMIN'
  country?: string | null
  cohortIds?: string[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Progress — one document per (user, section, subStep)
// ─────────────────────────────────────────────────────────────────────────────
export interface ProgressDoc {
  id: string // `${userId}__${sectionId}__${subStep}`
  userId: string
  sectionId: string
  subStep: string
  completed: boolean
  completedAt: string | null
  bookmarked: boolean
  syncedAt: string
}

export interface ProgressInput {
  userId: string
  sectionId: string
  subStep: string
  completed: boolean
  completedAt?: string | null
  bookmarked?: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// Exam attempts — one document per attempt
// ─────────────────────────────────────────────────────────────────────────────
export interface ExamAttemptDoc {
  id: string
  userId: string
  sectionId: string
  attemptNumber: number
  answers: string | null
  score: number | null
  startedAt: string
  completedAt: string | null
  timeSpentSec: number | null
  variantSeed: string | null
  syncedAt: string
}

export interface ExamAttemptInput {
  userId: string
  sectionId: string
  attemptNumber: number
  answers?: string | null
  score?: number | null
  startedAt?: string
  completedAt?: string | null
  timeSpentSec?: number
  variantSeed?: string | null
}

// ─────────────────────────────────────────────────────────────────────────────
// Exercise attempts — one document per (user, exercise) attempt
// ─────────────────────────────────────────────────────────────────────────────
export interface ExerciseAttemptDoc {
  id: string
  userId: string
  sectionId: string
  exerciseId: string
  usedHint: boolean
  correct: boolean
  attemptedAt: string
  syncedAt: string
}

export interface ExerciseAttemptInput {
  userId: string
  sectionId: string
  exerciseId: string
  usedHint: boolean
  correct: boolean
  attemptedAt?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Badges — awarded to a user after supervisor verification.
// Local preview badges (earned but not yet verified) live in browser
// localStorage only; only verified awards are written here.
// ─────────────────────────────────────────────────────────────────────────────
export type BadgeLevel = 'completion' | 'competency'
export type BadgeStatus = 'preview' | 'verified' | 'revoked'

export interface BadgeDoc {
  id: string
  userId: string
  sectionId: string
  badgeLevel: BadgeLevel
  status: BadgeStatus
  criteriaEvidence: string[]
  awardedAt: string
  verifiedBy: string | null // supervisor uid
  verifiedAt: string | null
  revokedAt: string | null
  revokeReason: string | null
}

export interface BadgeInput {
  userId: string
  sectionId: string
  badgeLevel: BadgeLevel
  criteriaEvidence?: string[]
  verifiedBy?: string | null
  verifiedAt?: string | null
}

// ─────────────────────────────────────────────────────────────────────────────
// Cohorts — supervisor groups. Membership lives in `cohortMembers`.
// ─────────────────────────────────────────────────────────────────────────────
export interface CohortDoc {
  id: string
  name: string
  supervisorId: string
  createdAt: string
  inviteCode: string | null
}

export interface CohortMemberDoc {
  id: string // `${cohortId}__${userId}`
  cohortId: string
  userId: string
  joinedAt: string
  role: 'member' | 'supervisor'
}

// ─────────────────────────────────────────────────────────────────────────────
// Feedback reports — submitted from the FeedbackFab.
// ─────────────────────────────────────────────────────────────────────────────
export interface FeedbackReportDoc {
  id: string
  type: string
  status: string
  title: string
  body: string
  sectionId: string | null
  pagePath: string | null
  userAgent: string | null
  email: string | null
  userId: string | null
  adminNote: string | null
  createdAt: string
  updatedAt: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Collection name constants — keep in sync with `firestore.rules`.
// ─────────────────────────────────────────────────────────────────────────────
export const FIRESTORE_COLLECTIONS = {
  users: 'users',
  progress: 'progress',
  examAttempts: 'examAttempts',
  exerciseAttempts: 'exerciseAttempts',
  badges: 'badges',
  cohorts: 'cohorts',
  cohortMembers: 'cohortMembers',
  feedbackReports: 'feedbackReports',
} as const

export type FirestoreCollectionName =
  (typeof FIRESTORE_COLLECTIONS)[keyof typeof FIRESTORE_COLLECTIONS]
