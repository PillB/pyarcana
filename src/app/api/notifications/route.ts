import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthContext, requireAuth } from '@/lib/permissions'

export async function GET(req: NextRequest) {
  try {
    const ctx = await getAuthContext()
    const userId = requireAuth(ctx)

    const { searchParams } = new URL(req.url)
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)

    const where = {
      recipientId: userId,
      ...(unreadOnly ? { isRead: false } : {}),
    }

    const notifications = await db.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    const unreadCount = await db.notification.count({
      where: { recipientId: userId, isRead: false, isDismissed: false },
    })

    return NextResponse.json({ notifications, unreadCount })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 401 })
  }
}
