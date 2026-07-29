/**
 * Permission helpers for cohort-scoped authorization.
 *
 * Solarized spec §3.5: A supervisor is not a system administrator.
 * Default deny for all permissions.
 */

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import type { Session } from 'next-auth'

export type GlobalRole = 'STUDENT' | 'ADMIN'
export type SupervisorStatus =
  | 'NOT_REQUESTED'
  | 'PENDING'
  | 'APPROVED'
  | 'SUSPENDED'
  | 'REJECTED'
  | 'REVOKED'
export type CohortScopedRole =
  | 'COHORT_OWNER'
  | 'COHORT_SUPERVISOR'
  | 'COHORT_REPORTER'
  | 'COHORT_LEARNER'

export interface AuthContext {
  session: Session | null
  userId: string | null
  role: string | null
  isStatic: boolean
}

/**
 * Get the current authenticated session and build an AuthContext.
 * This is the entry point for all permission checks.
 */
export async function getAuthContext(): Promise<AuthContext> {
  const session = await getServerSession(authOptions)
  const isStatic = process.env.NEXT_PUBLIC_STATIC_SITE === '1'

  return {
    session,
    userId: session?.user?.id ?? null,
    role: session?.user?.role ?? null,
    isStatic,
  }
}

/**
 * Require an authenticated session. Throws if not authenticated.
 */
export function requireAuth(ctx: AuthContext): string {
  if (!ctx.userId) {
    throw new Error('No autenticado. Inicia sesión para continuar.')
  }
  return ctx.userId
}

/**
 * Require ADMIN role. Throws if not admin.
 */
export function requireAdmin(ctx: AuthContext): string {
  const userId = requireAuth(ctx)
  if (ctx.role !== 'ADMIN') {
    throw new Error('Acceso denegado. Se requieren permisos de administrador.')
  }
  return userId
}

/**
 * Check if a user has supervisor privileges by querying SupervisorProfile.
 * Returns the profile if approved, null otherwise.
 */
export async function getSupervisorProfile(
  userId: string,
): Promise<{ status: string; entitlement: string } | null> {
  const profile = await db.supervisorProfile.findUnique({
    where: { userId },
    select: { status: true, entitlement: true },
  })
  if (!profile || profile.status !== 'APPROVED') {
    return null
  }
  return profile
}

/**
 * Require supervisor-enabled status. Throws if not an approved supervisor.
 */
export async function requireSupervisorEnabled(
  ctx: AuthContext,
): Promise<{ status: string; entitlement: string }> {
  const userId = requireAuth(ctx)
  const profile = await getSupervisorProfile(userId)
  if (!profile) {
    throw new Error(
      'No tienes permisos de supervisor. Solicita acceso de supervisor (requiere plan Pro).',
    )
  }
  return profile
}

/**
 * Require a specific cohort-scoped role. Throws if not authorized.
 * Returns the membership record.
 */
export async function requireCohortRole(
  ctx: AuthContext,
  cohortId: string,
  allowedRoles: CohortScopedRole[],
): Promise<{ scopedRole: string; status: string }> {
  const userId = requireAuth(ctx)

  // Admin can access any cohort
  if (ctx.role === 'ADMIN') {
    return { scopedRole: 'ADMIN', status: 'ACTIVE' }
  }

  const membership = await db.cohortMembership.findUnique({
    where: {
      cohortId_userId: { cohortId, userId },
    },
    select: { scopedRole: true, status: true },
  })

  if (!membership || membership.status !== 'ACTIVE') {
    throw new Error('No tienes acceso a este cohorte.')
  }

  if (!allowedRoles.includes(membership.scopedRole as CohortScopedRole)) {
    throw new Error('Tu rol en este cohorte no permite esta acción.')
  }

  return membership
}

/**
 * Check if user can view progress in a cohort.
 */
export async function canViewProgress(
  ctx: AuthContext,
  cohortId: string,
): Promise<boolean> {
  try {
    await requireCohortRole(ctx, cohortId, [
      'COHORT_OWNER',
      'COHORT_SUPERVISOR',
      'COHORT_REPORTER',
    ])
    return true
  } catch {
    return false
  }
}

/**
 * Check if user can download reports in a cohort.
 */
export async function canDownloadReport(
  ctx: AuthContext,
  cohortId: string,
): Promise<boolean> {
  try {
    await requireCohortRole(ctx, cohortId, [
      'COHORT_OWNER',
      'COHORT_SUPERVISOR',
      'COHORT_REPORTER',
    ])
    return true
  } catch {
    return false
  }
}

/**
 * Check if user can invite learners to a cohort.
 */
export async function canInviteLearner(
  ctx: AuthContext,
  cohortId: string,
): Promise<boolean> {
  try {
    await requireCohortRole(ctx, cohortId, ['COHORT_OWNER', 'COHORT_SUPERVISOR'])
    return true
  } catch {
    return false
  }
}

/**
 * Check if user can manage cohort membership (remove learners, cancel invitations).
 */
export async function canManageMembership(
  ctx: AuthContext,
  cohortId: string,
): Promise<boolean> {
  try {
    await requireCohortRole(ctx, cohortId, ['COHORT_OWNER', 'COHORT_SUPERVISOR'])
    return true
  } catch {
    return false
  }
}

/**
 * Permission matrix — defines what each role can do.
 * This is the single source of truth for permission checks.
 */
export const PERMISSION_MATRIX = {
  // Cohort management
  createCohort: ['SUPERVISOR_ENABLED'] as const,
  renameCohort: ['COHORT_OWNER'] as const,
  archiveCohort: ['COHORT_OWNER'] as const,

  // Membership management
  inviteLearner: ['COHORT_OWNER', 'COHORT_SUPERVISOR'] as const,
  cancelInvitation: ['COHORT_OWNER', 'COHORT_SUPERVISOR'] as const,
  resendInvitation: ['COHORT_OWNER', 'COHORT_SUPERVISOR'] as const,
  removeLearner: ['COHORT_OWNER', 'COHORT_SUPERVISOR'] as const,
  addCoSupervisor: ['COHORT_OWNER'] as const,
  transferOwnership: ['COHORT_OWNER'] as const,

  // Viewing
  viewProgress: ['COHORT_OWNER', 'COHORT_SUPERVISOR', 'COHORT_REPORTER'] as const,
  viewAssessmentSummary: [
    'COHORT_OWNER',
    'COHORT_SUPERVISOR',
    'COHORT_REPORTER',
  ] as const,
  viewBadgeEligibility: [
    'COHORT_OWNER',
    'COHORT_SUPERVISOR',
    'COHORT_REPORTER',
  ] as const,
  downloadBadge: ['COHORT_OWNER', 'COHORT_SUPERVISOR'] as const,
  downloadCohortReport: [
    'COHORT_OWNER',
    'COHORT_SUPERVISOR',
    'COHORT_REPORTER',
  ] as const,

  // Communication
  sendNudge: ['COHORT_OWNER', 'COHORT_SUPERVISOR'] as const,
  scheduleDigest: ['COHORT_OWNER', 'COHORT_SUPERVISOR'] as const,

  // Always denied for supervisors (admin only)
  viewRawAnswers: ['ADMIN'] as const,
  accessPrivateFeedback: ['ADMIN'] as const,
  alterBadgeCriteria: ['ADMIN'] as const,
  awardBadge: ['ADMIN'] as const,
  revokeBadge: ['ADMIN'] as const,
  accessAnotherCohort: ['ADMIN'] as const,
  viewBilling: ['ADMIN', 'COHORT_OWNER'] as const,
} as const

/**
 * Get all permissions for a given role in a cohort context.
 */
export function getPermissionsForRole(
  role: CohortScopedRole | 'ADMIN' | 'STUDENT',
): string[] {
  const permissions: string[] = []
  for (const [perm, roles] of Object.entries(PERMISSION_MATRIX)) {
    if ((roles as readonly string[]).includes(role)) {
      permissions.push(perm)
    }
  }
  return permissions
}
