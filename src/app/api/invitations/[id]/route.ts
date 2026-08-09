import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthContext, requireAuth } from '@/lib/permissions'
import { sendAcceptanceNotification, sendDeclineNotification } from '@/lib/notifications'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const ctx = await getAuthContext()
    const userId = requireAuth(ctx)
    const { id } = await params

    const invitations = await db.cohortInvitation.findUnique({
      where: { id },
      include: { cohort: { select: { name: true, id: true } } },
    })

    if (!invitations) {
      return NextResponse.json({ error: 'Invitación no encontrada.' }, { status: 404 })
    }

    // Only show to intended recipient
    if (invitations.intendedUserId !== userId) {
      return NextResponse.json({ error: 'Esta invitación no es para ti.' }, { status: 403 })
    }

    return NextResponse.json({ invitation: invitations })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 401 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const ctx = await getAuthContext()
    const userId = requireAuth(ctx)
    const { id } = await params
    const body = await req.json()
    const action = body.action // 'accept' | 'decline'

    const invitation = await db.cohortInvitation.findUnique({
      where: { id },
      include: { cohort: true },
    })

    if (!invitation) {
      return NextResponse.json({ error: 'Invitación no encontrada.' }, { status: 404 })
    }

    if (invitation.status !== 'PENDING') {
      return NextResponse.json(
        { error: `La invitación ya fue ${invitation.status.toLowerCase()}.` },
        { status: 400 },
      )
    }

    if (invitation.expiresAt < new Date()) {
      await db.cohortInvitation.update({
        where: { id },
        data: { status: 'EXPIRED' },
      })
      return NextResponse.json({ error: 'La invitación ha expirado.' }, { status: 410 })
    }

    // Verify intended recipient
    if (invitation.intendedUserId !== userId) {
      return NextResponse.json({ error: 'Esta invitación no es para ti.' }, { status: 403 })
    }

    if (action === 'accept') {
      // Use transaction for atomic accept + membership creation
      const [updatedInvitation, membership] = await db.$transaction([
        db.cohortInvitation.update({
          where: { id },
          data: { status: 'ACCEPTED', acceptedAt: new Date() },
        }),
        db.cohortMembership.create({
          data: {
            cohortId: invitation.cohortId,
            userId,
            scopedRole: 'COHORT_LEARNER',
            consentVersion: '1.0',
            invitedBy: invitation.invitedBy,
          },
        }),
      ])

      // Notify supervisor
      const learner = await db.user.findUnique({ where: { id: userId }, select: { name: true, email: true } })
      await sendAcceptanceNotification(
        invitation.invitedBy,
        invitation.cohortId,
        learner?.name || learner?.email || 'Un learner',
      )

      // Audit
      await db.cohortAuditEvent.create({
        data: {
          cohortId: invitation.cohortId,
          actorId: userId,
          action: 'accept_invitation',
          targetType: 'invitation',
          targetId: invitation.id,
        },
      })

      return NextResponse.json({ membership })
    } else if (action === 'decline') {
      await db.cohortInvitation.update({
        where: { id },
        data: { status: 'DECLINED', declinedAt: new Date() },
      })

      const learner = await db.user.findUnique({ where: { id: userId }, select: { name: true, email: true } })
      await sendDeclineNotification(invitation.invitedBy, learner?.name || learner?.email || 'Un learner')

      return NextResponse.json({ status: 'DECLINED' })
    }

    return NextResponse.json({ error: 'Acción no válida.' }, { status: 400 })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 })
  }
}
