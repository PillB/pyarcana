/**
 * Notification helpers for the supervisor and cohort system.
 *
 * Solarized spec §16: Support notifications for supervisor requests,
 * invitations, badge events, digests, and more.
 *
 * Stephen Fry redaction: all learner-facing messages are newbie-friendly
 * with inline explanations.
 */

import { db } from '@/lib/db'

export type NotificationType =
  | 'supervisor_request_submitted'
  | 'supervisor_request_approved'
  | 'supervisor_request_rejected'
  | 'invitation_received'
  | 'invitation_accepted'
  | 'invitation_declined'
  | 'invitation_expiring'
  | 'cohort_membership_removed'
  | 'cohort_archived'
  | 'badge_earned'
  | 'badge_nearly_eligible'
  | 'badge_blocked'
  | 'learner_inactive'
  | 'weekly_cohort_digest'
  | 'report_ready'
  | 'subscription_expiring'

interface CreateNotificationParams {
  recipientId: string
  type: NotificationType
  title: string
  body: string
  actionRoute?: string
  deduplicationKey?: string
  expiresAt?: Date
}

/**
 * Create an in-app notification.
 * Deduplicates by deduplicationKey if provided.
 */
export async function createNotification({
  recipientId,
  type,
  title,
  body,
  actionRoute,
  deduplicationKey,
  expiresAt,
}: CreateNotificationParams): Promise<void> {
  // Check for duplicate if deduplication key is provided
  if (deduplicationKey) {
    const existing = await db.notification.findFirst({
      where: {
        recipientId,
        deduplicationKey,
        isDismissed: false,
      },
      select: { id: true },
    })
    if (existing) return // Don't create duplicate
  }

  await db.notification.create({
    data: {
      recipientId,
      type,
      title,
      body,
      actionRoute,
      deduplicationKey,
      expiresAt: expiresAt ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
    },
  })
}

/**
 * Send notification when a supervisor request is submitted.
 */
export async function notifySupervisorRequestSubmitted(
  userId: string,
): Promise<void> {
  await createNotification({
    recipientId: userId,
    type: 'supervisor_request_submitted',
    title: 'Solicitud de supervisor enviada',
    body: 'Tu solicitud para ser supervisor (esto es, una persona que puede gestionar grupos de aprendizaje) ha sido enviada. Recibirás una respuesta pronto.',
    deduplicationKey: `supervisor_request:${userId}`,
  })
}

/**
 * Send notification when a supervisor request is approved.
 */
export async function notifySupervisorRequestApproved(userId: string): Promise<void> {
  await createNotification({
    recipientId: userId,
    type: 'supervisor_request_approved',
    title: '¡Solicitud de supervisor aprobada!',
    body: 'Ya puedes crear cohortes (grupos de aprendizaje) e invitar learners. Ve a la sección de Cohortes para empezar.',
    actionRoute: '/cohorts',
    deduplicationKey: `supervisor_approved:${userId}`,
  })
}

/**
 * Send notification when a supervisor request is rejected.
 */
export async function notifySupervisorRequestRejected(
  userId: string,
  reason: string,
): Promise<void> {
  await createNotification({
    recipientId: userId,
    type: 'supervisor_request_rejected',
    title: 'Solicitud de supervisor rechazada',
    body: `Tu solicitud fue rechazada. Razón: ${reason}. Puedes volver a solicitar después de resolver el problema.`,
    deduplicationKey: `supervisor_rejected:${userId}`,
  })
}

/**
 * Send invitation notification to a learner.
 */
export async function sendInvitationNotification(
  recipientId: string,
  cohortName: string,
  supervisorName: string,
  invitationId: string,
): Promise<void> {
  await createNotification({
    recipientId,
    type: 'invitation_received',
    title: 'Invitación a cohorte recibida',
    body: `${supervisorName} te ha invitado a unirse al cohorte "${cohortName}". Un cohorte es un grupo de aprendizaje donde un supervisor puede ver tu progreso. Puedes aceptar o rechazar.`,
    actionRoute: `/invitations/${invitationId}`,
    deduplicationKey: `invitation:${invitationId}`,
  })
}

/**
 * Send notification to supervisor when a learner accepts.
 */
export async function sendAcceptanceNotification(
  supervisorId: string,
  cohortId: string,
  learnerName: string,
): Promise<void> {
  await createNotification({
    recipientId: supervisorId,
    type: 'invitation_accepted',
    title: 'Invitación aceptada',
    body: `${learnerName} ha aceptado la invitación al cohorte. Ya puedes ver su progreso.`,
    actionRoute: `/cohorts/${cohortId}`,
    deduplicationKey: `invitation_accepted:${cohortId}:${supervisorId}`,
  })
}

/**
 * Send notification to supervisor when a learner declines.
 */
export async function sendDeclineNotification(
  supervisorId: string,
  learnerName: string,
): Promise<void> {
  await createNotification({
    recipientId: supervisorId,
    type: 'invitation_declined',
    title: 'Invitación rechazada',
    body: `${learnerName} ha rechazado la invitación al cohorte.`,
  })
}

/**
 * Send badge earned notification.
 */
export async function sendBadgeNotification(
  userId: string,
  badgeName: string,
): Promise<void> {
  await createNotification({
    recipientId: userId,
    type: 'badge_earned',
    title: '¡Insignia obtenida!',
    body: `Has obtenido la insignia "${badgeName}". Una insignia (esto es, un reconocimiento de una habilidad demostrada) es evidencia de tu progreso.`,
    deduplicationKey: `badge_earned:${userId}:${badgeName}`,
  })
}

/**
 * Send badge nearly eligible notification.
 */
export async function sendBadgeNearlyEligible(
  userId: string,
  badgeName: string,
  missingRequirements: string[],
): Promise<void> {
  await createNotification({
    recipientId: userId,
    type: 'badge_nearly_eligible',
    title: '¡Estás cerca de una insignia!',
    body: `Te falta poco para la insignia "${badgeName}". Requisitos pendientes: ${missingRequirements.join(', ')}.`,
    deduplicationKey: `badge_nearly:${userId}:${badgeName}`,
  })
}

/**
 * Send badge blocked notification.
 */
export async function sendBadgeBlocked(
  userId: string,
  badgeName: string,
  blockingReasons: string[],
): Promise<void> {
  await createNotification({
    recipientId: userId,
    type: 'badge_blocked',
    title: 'Insignia bloqueada',
    body: `La insignia "${badgeName}" está bloqueada. Razones: ${blockingReasons.join(', ')}.`,
    deduplicationKey: `badge_blocked:${userId}:${badgeName}`,
  })
}

/**
 * Send cohort archived notification.
 */
export async function sendCohortArchivedNotification(
  memberId: string,
  cohortName: string,
): Promise<void> {
  await createNotification({
    recipientId: memberId,
    type: 'cohort_archived',
    title: 'Cohorte archivado',
    body: `El cohorte "${cohortName}" ha sido archivado. Los datos históricos se conservan pero ya no se puede modificar.`,
  })
}

/**
 * Send membership removed notification.
 */
export async function sendMembershipRemovedNotification(
  memberId: string,
  cohortName: string,
  reason: string,
): Promise<void> {
  await createNotification({
    recipientId: memberId,
    type: 'cohort_membership_removed',
    title: 'Has sido removido de un cohorte',
    body: `Has sido removido del cohorte "${cohortName}". Razón: ${reason}. Tu progreso de aprendizaje no se ve afectado.`,
  })
}

/**
 * Send report ready notification.
 */
export async function sendReportReadyNotification(
  supervisorId: string,
  cohortName: string,
  reportType: string,
): Promise<void> {
  await createNotification({
    recipientId: supervisorId,
    type: 'report_ready',
    title: 'Reporte listo para descargar',
    body: `El reporte de tipo "${reportType}" para el cohorte "${cohortName}" está listo.`,
  })
}

/**
 * Send subscription expiring notification.
 */
export async function sendSubscriptionExpiringNotification(
  userId: string,
  daysRemaining: number,
): Promise<void> {
  await createNotification({
    recipientId: userId,
    type: 'subscription_expiring',
    title: 'Tu suscripción expira pronto',
    body: `Tu suscripción Pro expira en ${daysRemaining} días. Si no renuevas, perderás el acceso a funciones de supervisor.`,
    deduplicationKey: `sub_expiring:${userId}:${daysRemaining}`,
  })
}

/**
 * Get or create notification preferences for a user.
 */
export async function getOrCreateNotificationPreferences(
  userId: string,
) {
  let prefs = await db.notificationPreference.findUnique({
    where: { userId },
  })
  if (!prefs) {
    prefs = await db.notificationPreference.create({
      data: { userId },
    })
  }
  return prefs
}
