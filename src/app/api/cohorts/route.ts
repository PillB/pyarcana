import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthContext, requireAuth, requireSupervisorEnabled } from '@/lib/permissions'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const ctx = await getAuthContext()
    const userId = requireAuth(ctx)

    // Admin can bypass supervisor check
    if (ctx.role !== 'ADMIN') {
      await requireSupervisorEnabled(ctx)
    }

    const body = await req.json()
    const { name, description, maxMembers } = body

    if (!name || name.trim().length < 3 || name.trim().length > 100) {
      return NextResponse.json(
        { error: 'El nombre del cohorte debe tener entre 3 y 100 caracteres.' },
        { status: 400 },
      )
    }

    // Check cohort limit based on entitlement
    const profile = await db.supervisorProfile.findUnique({ where: { userId } })
    const maxCohorts = profile?.entitlement === 'TEAM' ? 5 : 1
    const existingCohorts = await db.cohort.count({
      where: { ownerId: userId, status: 'ACTIVE' },
    })
    if (ctx.role !== 'ADMIN' && existingCohorts >= maxCohorts) {
      return NextResponse.json(
        { error: `Has alcanzado el límite de ${maxCohorts} cohorte(s) para tu plan.` },
        { status: 403 },
      )
    }

    const cohort = await db.cohort.create({
      data: {
        ownerId: userId,
        name: name.trim(),
        description: description?.trim() || null,
        maxMembers: maxMembers || (profile?.entitlement === 'TEAM' ? 100 : 25),
      },
    })

    // Owner is automatically a member with COHORT_OWNER role
    await db.cohortMembership.create({
      data: {
        cohortId: cohort.id,
        userId,
        scopedRole: 'COHORT_OWNER',
        consentVersion: '1.0',
      },
    })

    // Audit event
    await db.cohortAuditEvent.create({
      data: {
        cohortId: cohort.id,
        actorId: userId,
        action: 'create_cohort',
        afterState: JSON.stringify({ name: cohort.name }),
      },
    })

    return NextResponse.json({ cohort })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 403 })
  }
}

export async function GET() {
  try {
    const ctx = await getAuthContext()
    const userId = requireAuth(ctx)

    // Get cohorts where user is a member
    const memberships = await db.cohortMembership.findMany({
      where: { userId, status: 'ACTIVE' },
      include: {
        cohort: {
          include: {
            _count: {
              select: {
                memberships: { where: { status: 'ACTIVE' } },
                invitations: { where: { status: 'PENDING' } },
              },
            },
          },
        },
      },
    })

    return NextResponse.json({
      cohorts: memberships.map((m) => ({
        ...m.cohort,
        scopedRole: m.scopedRole,
      })),
    })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 401 })
  }
}
