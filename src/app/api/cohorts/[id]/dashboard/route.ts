import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthContext, requireAuth, requireCohortRole } from '@/lib/permissions'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const ctx = await getAuthContext()
    const userId = requireAuth(ctx)
    const { id: cohortId } = await params

    await requireCohortRole(ctx, cohortId, [
      'COHORT_OWNER',
      'COHORT_SUPERVISOR',
      'COHORT_REPORTER',
    ])

    // Get all active members with their progress
    const memberships = await db.cohortMembership.findMany({
      where: { cohortId, status: 'ACTIVE', scopedRole: 'COHORT_LEARNER' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            progress: {
              select: { sectionId: true, subStep: true, completed: true },
            },
            examAttempts: {
              select: { sectionId: true, score: true, completedAt: true },
              orderBy: { completedAt: 'desc' },
            },
          },
        },
      },
    })

    // Calculate summary statistics
    const totalLearners = memberships.length
    const learnerSummaries = memberships.map((m) => {
      const progress = m.user.progress
      const sectionsCompleted = new Set(
        progress.filter((p) => p.subStep === 'youdo' && p.completed).map((p) => p.sectionId),
      ).size
      const examsPassed = m.user.examAttempts.filter((e) => e.score >= 70).length
      const lastExamDate = m.user.examAttempts[0]?.completedAt
      const sectionsStarted = new Set(progress.filter((p) => p.completed).map((p) => p.sectionId)).size

      return {
        userId: m.user.id,
        name: m.user.name || m.user.email,
        sectionsStarted,
        sectionsCompleted,
        examsPassed,
        lastExamDate,
        joinedAt: m.joinedAt,
      }
    })

    // Pending invitations
    const pendingInvitations = await db.cohortInvitation.count({
      where: { cohortId, status: 'PENDING' },
    })

    // Recent activity
    const recentAuditEvents = await db.cohortAuditEvent.findMany({
      where: { cohortId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    return NextResponse.json({
      cohortId,
      totalLearners,
      pendingInvitations,
      learners: learnerSummaries,
      recentActivity: recentAuditEvents,
      generatedAt: new Date().toISOString(),
    })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 403 })
  }
}
