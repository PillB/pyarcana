import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { buildStudentMetrics } from '@/lib/admin-analytics'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const [users, progress, exams, exerciseGroups] = await Promise.all([
    db.user.findMany({
      where: { role: 'STUDENT' },
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, name: true, createdAt: true, role: true },
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
  ])

  const exerciseCountByUser: Record<string, number> = {}
  for (const g of exerciseGroups) {
    exerciseCountByUser[g.userId] = g._count.id
  }

  const students = buildStudentMetrics(users, progress, exams, exerciseCountByUser)
  return NextResponse.json({ students })
}
