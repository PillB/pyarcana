import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { buildStudentDetailExtras } from '@/lib/admin-analytics'
import { COURSE_SECTIONS } from '@/lib/course'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const { id: userId } = await params

  const [user, progress, examAttempts, exerciseAttempts] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    }),
    db.progress.findMany({ where: { userId } }),
    db.examAttempt.findMany({
      where: { userId },
      orderBy: { startedAt: 'asc' },
    }),
    db.exerciseAttempt.findMany({
      where: { userId },
      orderBy: { attemptedAt: 'desc' },
    }),
  ])

  if (!user) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
  }

  // Compute gap analysis: which sections have no attempts, which have low scores
  const sectionGaps: {
    sectionId: string
    bestScore: number | null
    attempts: number
    lastAttempt: Date | null
  }[] = []

  const sectionIds = COURSE_SECTIONS.map((s) => s.id)

  for (const sectionId of sectionIds) {
    const sectionExams = examAttempts.filter((e) => e.sectionId === sectionId)
    const bestScore = sectionExams.length > 0
      ? Math.max(...sectionExams.map((e) => e.score))
      : null
    sectionGaps.push({
      sectionId,
      bestScore,
      attempts: sectionExams.length,
      lastAttempt: sectionExams.length > 0
        ? sectionExams[sectionExams.length - 1].completedAt
        : null,
    })
  }

  const extras = buildStudentDetailExtras(
    progress.map((p) => ({
      userId: p.userId,
      sectionId: p.sectionId,
      subStep: p.subStep,
      completed: p.completed,
      completedAt: p.completedAt,
      bookmarked: p.bookmarked,
    })),
    examAttempts.map((a) => ({
      userId: a.userId,
      sectionId: a.sectionId,
      score: a.score,
      completedAt: a.completedAt,
      startedAt: a.startedAt,
      timeSpentSec: a.timeSpentSec,
      answers: a.answers,
    }))
  )

  return NextResponse.json({
    user,
    progress,
    examAttempts: examAttempts.map((a) => ({
      ...a,
      answers: JSON.parse(a.answers),
      variantSeed: JSON.parse(a.variantSeed),
    })),
    exerciseAttempts,
    sectionGaps,
    ...extras,
  })
}
