import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthContext, requireAuth } from '@/lib/permissions'
import { notifySupervisorRequestSubmitted } from '@/lib/notifications'

export async function POST(req: NextRequest) {
  try {
    const ctx = await getAuthContext()
    const userId = requireAuth(ctx)

    // Check if user already has a profile
    const existing = await db.supervisorProfile.findUnique({ where: { userId } })
    if (existing && (existing.status === 'PENDING' || existing.status === 'APPROVED')) {
      return NextResponse.json(
        { error: 'Ya tienes una solicitud de supervisor activa o aprobada.' },
        { status: 400 },
      )
    }

    // Check subscription - must be Pro or Team
    const subscription = await db.subscription.findFirst({
      where: { userId, status: 'ACTIVE' },
      include: { plan: true },
    })
    if (!subscription || (subscription.plan.code !== 'pro' && subscription.plan.code !== 'team')) {
      return NextResponse.json(
        { error: 'Necesitas una suscripción Pro o Team para solicitar acceso de supervisor.' },
        { status: 403 },
      )
    }

    const body = await req.json()
    const { useCase, organization, anticipatedSize } = body

    // Create or update supervisor profile
    const profile = await db.supervisorProfile.upsert({
      where: { userId },
      create: {
        userId,
        status: 'PENDING',
        entitlement: subscription.plan.code.toUpperCase(),
        useCase: useCase || null,
        organization: organization || null,
        anticipatedSize: anticipatedSize || 10,
        requestedAt: new Date(),
      },
      update: {
        status: 'PENDING',
        entitlement: subscription.plan.code.toUpperCase(),
        useCase: useCase || null,
        organization: organization || null,
        anticipatedSize: anticipatedSize || 10,
        requestedAt: new Date(),
        approvedAt: null,
        approvedBy: null,
      },
    })

    await notifySupervisorRequestSubmitted(userId)

    return NextResponse.json({ profile })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 401 })
  }
}

export async function GET() {
  try {
    const ctx = await getAuthContext()
    const userId = requireAuth(ctx)

    const profile = await db.supervisorProfile.findUnique({ where: { userId } })
    return NextResponse.json({ profile: profile || { status: 'NOT_REQUESTED' } })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 401 })
  }
}
