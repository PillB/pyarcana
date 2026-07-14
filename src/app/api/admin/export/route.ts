import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'students'

  if (type === 'students') {
    const students = await db.user.findMany({
      where: { role: 'STUDENT' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    })

    const rows = await Promise.all(
      students.map(async (s) => {
        const [progressItems, examAttempts] = await Promise.all([
          db.progress.findMany({
            where: { userId: s.id, completed: true },
          }),
          db.examAttempt.findMany({
            where: { userId: s.id, completedAt: { not: null } },
          }),
        ])

        const sectionsCompleted = new Set(
          progressItems.map((p) => p.sectionId)
        ).size

        const avgScore = examAttempts.length > 0
          ? Math.round(
              examAttempts.reduce((acc, a) => acc + a.score, 0) / examAttempts.length
            )
          : 0

        return {
          id: s.id,
          email: s.email,
          name: s.name || '',
          createdAt: s.createdAt.toISOString().split('T')[0],
          sectionsCompleted,
          completionPct: Math.round((sectionsCompleted / 10) * 100),
          examAttempts: examAttempts.length,
          avgScore,
        }
      })
    )

    const headers = [
      'ID', 'Email', 'Nombre', 'Fecha Registro',
      'Secciones Completadas', '% Completado', 'Intentos Exam', 'Score Promedio'
    ]
    const csv = [
      headers.join(','),
      ...rows.map((r) => [
        r.id,
        `"${r.email}"`,
        `"${r.name}"`,
        r.createdAt,
        r.sectionsCompleted,
        `${r.completionPct}%`,
        r.examAttempts,
        r.avgScore,
      ].join(',')),
    ].join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="students_report.csv"',
      },
    })
  }

  if (type === 'attempts') {
    const attempts = await db.examAttempt.findMany({
      where: { completedAt: { not: null } },
      include: { user: true },
      orderBy: { completedAt: 'desc' },
    })

    const headers = [
      'Attempt ID', 'User Email', 'Section', 'Attempt #', 'Score',
      'Time (sec)', 'Completed At'
    ]
    const csv = [
      headers.join(','),
      ...attempts.map((a) => [
        a.id,
        `"${a.user.email}"`,
        a.sectionId,
        a.attemptNumber,
        a.score,
        a.timeSpentSec,
        a.completedAt?.toISOString() || '',
      ].join(',')),
    ].join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="exam_attempts_report.csv"',
      },
    })
  }

  return NextResponse.json({ error: 'Tipo de reporte inválido' }, { status: 400 })
}
