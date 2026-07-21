import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { buildAnalyticsPayload, buildStudentMetrics } from '@/lib/admin-analytics'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  try {
    const [users, progress, exams, exerciseGroups, feedbackNew] = await Promise.all([
      db.user.findMany({
        where: { role: 'STUDENT' },
        select: { id: true, email: true, name: true, createdAt: true, role: true },
        orderBy: { createdAt: 'desc' },
      }),
      db.progress.findMany({
        select: {
          userId: true,
          sectionId: true,
          subStep: true,
          completed: true,
          completedAt: true,
          bookmarked: true,
        },
      }),
      db.examAttempt.findMany({
        select: {
          userId: true,
          sectionId: true,
          score: true,
          completedAt: true,
          startedAt: true,
          timeSpentSec: true,
        },
      }),
      db.exerciseAttempt.groupBy({
        by: ['userId'],
        _count: { id: true },
      }),
      db.feedbackReport.count({ where: { status: 'NEW' } }).catch(() => 0),
    ])

    const exerciseCountByUser: Record<string, number> = {}
    let exerciseTotal = 0
    for (const g of exerciseGroups) {
      exerciseCountByUser[g.userId] = g._count.id
      exerciseTotal += g._count.id
    }

    const students = buildStudentMetrics(users, progress, exams, exerciseCountByUser)
    const payload = buildAnalyticsPayload(students, progress, exams, users, {
      feedbackNew,
      exerciseTotal,
    })

    return NextResponse.json(payload)
  } catch (e) {
    console.error('admin analytics', e)
    return NextResponse.json({ error: 'Error al calcular analytics' }, { status: 500 })
  }
}
