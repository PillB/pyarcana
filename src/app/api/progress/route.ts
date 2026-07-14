import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const [progress, examAttempts, exerciseAttempts] = await Promise.all([
    db.progress.findMany({
      where: { userId: session.user.id },
    }),
    db.examAttempt.findMany({
      where: { userId: session.user.id },
      orderBy: { startedAt: 'desc' },
    }),
    db.exerciseAttempt.findMany({
      where: { userId: session.user.id },
      orderBy: { attemptedAt: 'desc' },
    }),
  ])

  // Format progress as a map for easy frontend consumption
  const progressMap: Record<string, string[]> = {}
  const bookmarks: string[] = []
  for (const p of progress) {
    if (p.completed) {
      if (!progressMap[p.sectionId]) progressMap[p.sectionId] = []
      progressMap[p.sectionId].push(p.subStep)
    }
    if (p.bookmarked) bookmarks.push(p.sectionId)
  }

  const examAttemptsBySection: Record<string, typeof examAttempts> = {}
  for (const a of examAttempts) {
    if (!examAttemptsBySection[a.sectionId]) examAttemptsBySection[a.sectionId] = []
    examAttemptsBySection[a.sectionId].push(a)
  }

  return NextResponse.json({
    progress: progressMap,
    bookmarks,
    examAttempts: examAttemptsBySection,
    exerciseAttempts,
  })
}

const upsertSchema = z.object({
  sectionId: z.string(),
  subStep: z.string(),
  completed: z.boolean(),
})

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = upsertSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }

    const { sectionId, subStep, completed } = parsed.data

    await db.progress.upsert({
      where: {
        userId_sectionId_subStep: {
          userId: session.user.id,
          sectionId,
          subStep,
        },
      },
      create: {
        userId: session.user.id,
        sectionId,
        subStep,
        completed,
        completedAt: completed ? new Date() : null,
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Progress POST error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

const bookmarkSchema = z.object({
  sectionId: z.string(),
  bookmarked: z.boolean(),
})

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = bookmarkSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }

    const { sectionId, bookmarked } = parsed.data

    // Upsert a progress row with bookmark flag (use 'bookmark' as subStep placeholder)
    await db.progress.upsert({
      where: {
        userId_sectionId_subStep: {
          userId: session.user.id,
          sectionId,
          subStep: 'bookmark',
        },
      },
      create: {
        userId: session.user.id,
        sectionId,
        subStep: 'bookmark',
        completed: false,
        bookmarked,
      },
      update: { bookmarked },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Bookmark PATCH error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
