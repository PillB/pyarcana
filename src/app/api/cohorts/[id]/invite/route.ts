import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthContext, requireAuth, requireCohortRole } from '@/lib/permissions'
import { sendInvitationNotification } from '@/lib/notifications'
import crypto from 'crypto'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const ctx = await getAuthContext()
    const userId = requireAuth(ctx)
    const { id: cohortId } = await params

    await requireCohortRole(ctx, cohortId, ['COHORT_OWNER', 'COHORT_SUPERVISOR'])

    const body = await req.json()
    const { email, intendedUserId } = body

    if (!email && !intendedUserId) {
      return NextResponse.json(
        { error: 'Debes proporcionar un email o un ID de usuario.' },
        { status: 400 },
      )
    }

    // Check cohort member limit
    const cohort = await db.cohort.findUnique({ where: { id: cohortId } })
    if (!cohort || cohort.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Cohorte no encontrado o archivado.' }, { status: 404 })
    }

    const activeCount = await db.cohortMembership.count({
      where: { cohortId, status: 'ACTIVE' },
    })
    if (activeCount >= cohort.maxMembers) {
      return NextResponse.json(
        { error: `El cohorte ha alcanzado el límite de ${cohort.maxMembers} miembros.` },
        { status: 403 },
      )
    }

    // Check for existing pending invitation
    const deduplicationKey = `${cohortId}:${email || intendedUserId}`
    const existing = await db.cohortInvitation.findFirst({
      where: { cohortId, status: 'PENDING', deduplicationKey },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'Ya existe una invitación pendiente para esta persona.' },
        { status: 409 },
      )
    }

    // Check if already a member
    if (intendedUserId) {
      const member = await db.cohortMembership.findUnique({
        where: { cohortId_userId: { cohortId, userId: intendedUserId } },
      })
      if (member && member.status === 'ACTIVE') {
        return NextResponse.json(
          { error: 'Este usuario ya es miembro del cohorte.' },
          { status: 409 },
        )
      }
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

    // Find intended user if email provided
    let resolvedUserId = intendedUserId
    if (email && !resolvedUserId) {
      const user = await db.user.findUnique({ where: { email: email.toLowerCase().trim() } })
      if (user) resolvedUserId = user.id
    }

    const invitation = await db.cohortInvitation.create({
      data: {
        cohortId,
        invitedBy: userId,
        intendedUserId: resolvedUserId || null,
        intendedEmail: email?.toLowerCase().trim() || null,
        tokenHash,
        status: 'PENDING',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        deduplicationKey,
      },
    })

    // Send in-app notification if user exists
    if (resolvedUserId) {
      const inviter = await db.user.findUnique({ where: { id: userId }, select: { name: true, email: true } })
      await sendInvitationNotification(
        resolvedUserId,
        cohort.name,
        inviter?.name || inviter?.email || 'Un supervisor',
        invitation.id,
      )
    }

    // Audit event
    await db.cohortAuditEvent.create({
      data: {
        cohortId,
        actorId: userId,
        action: 'invite_learner',
        targetType: 'invitation',
        targetId: invitation.id,
        afterState: JSON.stringify({ email, intendedUserId: resolvedUserId }),
      },
    })

    return NextResponse.json({ invitation: { id: invitation.id, status: invitation.status } })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 403 })
  }
}
