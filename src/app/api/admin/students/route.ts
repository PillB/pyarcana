import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  // Get all students (not admins)
  const students = await db.user.findMany({
    where: { role: 'STUDENT' },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      _count: {
        select: {
          progress: true,
          examAttempts: true,
          exerciseAttempts: true,
        },
      },
    },
  })

  // For each student, compute detailed progress
  const studentsWithProgress = await Promise.all(
    students.map(async (s) => {
      const [progressItems, examAttempts] = await Promise.all([
        db.progress.findMany({
          where: { userId: s.id, completed: true },
        }),
        db.examAttempt.findMany({
          where: { userId: s.id, completedAt: { not: null } },
        }),
      ])

      // Count unique sections with at least one completed sub-step
      const sectionsStarted = new Set(progressItems.map((p) => p.sectionId))
      const sectionsCompleted = new Set<string>()

      // Group progress by section
      const progressBySection: Record<string, string[]> = {}
      for (const p of progressItems) {
        if (!progressBySection[p.sectionId]) progressBySection[p.sectionId] = []
        progressBySection[p.sectionId].push(p.subStep)
      }

      // A section is "completed" if all 5 sub-steps are done
      for (const [sectionId, steps] of Object.entries(progressBySection)) {
        if (steps.length >= 5) sectionsCompleted.add(sectionId)
      }

      const avgScore =
        examAttempts.length > 0
          ? examAttempts.reduce((acc, a) => acc + a.score, 0) / examAttempts.length
          : 0

      const lastActivity = progressItems.length > 0
        ? progressItems[progressItems.length - 1].completedAt
        : s.createdAt

      return {
        id: s.id,
        email: s.email,
        name: s.name,
        createdAt: s.createdAt,
        lastActivity,
        sectionsStarted: sectionsStarted.size,
        sectionsCompleted: sectionsCompleted.size,
        totalSections: 10,
        completionPct: Math.round((sectionsCompleted.size / 10) * 100),
        examAttemptsCount: examAttempts.length,
        avgExamScore: Math.round(avgScore),
        exercisesAttempted: s._count.exerciseAttempts,
      }
    })
  )

  return NextResponse.json({ students: studentsWithProgress })
}
