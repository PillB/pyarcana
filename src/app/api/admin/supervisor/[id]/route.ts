import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthContext, requireAdmin } from '@/lib/permissions'
import { notifySupervisorRequestApproved, notifySupervisorRequestRejected } from '@/lib/notifications'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const ctx = await getAuthContext()
    const adminId = requireAdmin(ctx)
    const { id } = await params
    const body = await req.json()
    const action = body.action // 'approve' | 'reject' | 'suspend' | 'reinstate'

    const profile = await db.supervisorProfile.findUnique({ where: { id } })
    if (!profile) {
      return NextResponse.json({ error: 'Perfil no encontrado.' }, { status: 404 })
    }

    if (action === 'approve') {
      const updated = await db.supervisorProfile.update({
        where: { id },
        data: {
          status: 'APPROVED',
          approvedAt: new Date(),
          approvedBy: adminId,
        },
      })
      await notifySupervisorRequestApproved(profile.userId)
      return NextResponse.json({ profile: updated })
    } else if (action === 'reject') {
      const updated = await db.supervisorProfile.update({
        where: { id },
        data: {
          status: 'REJECTED',
          suspendReason: body.reason || 'No especificada',
        },
      })
      await notifySupervisorRequestRejected(profile.userId, body.reason || 'No especificada')
      return NextResponse.json({ profile: updated })
    } else if (action === 'suspend') {
      const updated = await db.supervisorProfile.update({
        where: { id },
        data: {
          status: 'SUSPENDED',
          suspendedAt: new Date(),
          suspendReason: body.reason || 'No especificada',
        },
      })
      return NextResponse.json({ profile: updated })
    } else if (action === 'reinstate') {
      const updated = await db.supervisorProfile.update({
        where: { id },
        data: {
          status: 'APPROVED',
          suspendedAt: null,
          suspendReason: null,
        },
      })
      return NextResponse.json({ profile: updated })
    }

    return NextResponse.json({ error: 'Acción no válida.' }, { status: 400 })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 401 })
  }
}
