import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthContext, requireAuth } from '@/lib/permissions'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const ctx = await getAuthContext()
    const userId = requireAuth(ctx)
    const { id } = await params
    const body = await req.json()

    const notification = await db.notification.findUnique({ where: { id } })
    if (!notification || notification.recipientId !== userId) {
      return NextResponse.json({ error: 'Notificación no encontrada.' }, { status: 404 })
    }

    const updated = await db.notification.update({
      where: { id },
      data: {
        ...(body.isRead !== undefined && { isRead: body.isRead, readAt: body.isRead ? new Date() : null }),
        ...(body.isDismissed !== undefined && { isDismissed: body.isDismissed, dismissedAt: body.isDismissed ? new Date() : null }),
      },
    })

    return NextResponse.json({ notification: updated })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 })
  }
}
