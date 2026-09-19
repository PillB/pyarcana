import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { syncProgress } from '@/lib/firebase/sync'
import { z } from 'zod'
import { renameSectionId } from '@/lib/section-id-migrations'
import { redactAttemptsForLearner } from '@/lib/exam-scoring'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const [progress, examAttempts, exerciseAttempts] = await Promise.all([
    db.progress.findMany({
      where: { userId: session.user.id },
    }),
    // The stored answers carry the key, which a learner never gets (redactAttemptsForLearner).
    db.examAttempt.findMany({
      where: { userId: session.user.id },
      orderBy: { startedAt: 'desc' },
    }).then(redactAttemptsForLearner),
    db.exerciseAttempt.findMany({
      where: { userId: session.user.id },
      orderBy: { attemptedAt: 'desc' },
    }),
  ])

  // Format progress as a map for easy frontend consumption
  const progressMap: Record<string, string[]> = {}
  const bookmarks: string[] = []
  // Rows written under a slug from before the rename are reported under the id the app reads,
  // so a learner on a new browser does not see completed work vanish. The database migration
  // 20260918030000_rename_section_ids_batch_a moves the rows themselves; this covers anything
  // written between that deploy and the migration running.
  // One row per (section, step). Where a learner holds rows under both the old and the current
  // slug, the current one wins: it was written after the rename, so it carries their latest
  // choice. OR-ing the two brought back a step they un-ticked or a bookmark they removed.
  const latest = new Map<string, (typeof progress)[number]>()
  for (const p of progress) {
    const sectionId = renameSectionId(p.sectionId)
    const key = `${sectionId}\u0000${p.subStep}`
    if (!latest.has(key) || p.sectionId === sectionId) latest.set(key, { ...p, sectionId })
  }
  for (const p of latest.values()) {
    if (p.completed) {
      if (!progressMap[p.sectionId]) progressMap[p.sectionId] = []
      progressMap[p.sectionId].push(p.subStep)
    }
    if (p.bookmarked && !bookmarks.includes(p.sectionId)) bookmarks.push(p.sectionId)
  }

  const examAttemptsBySection: Record<string, typeof examAttempts> = {}
  for (const a of examAttempts) {
    const sectionId = renameSectionId(a.sectionId)
    if (!examAttemptsBySection[sectionId]) examAttemptsBySection[sectionId] = []
    examAttemptsBySection[sectionId].push({ ...a, sectionId })
  }

  return NextResponse.json({
    progress: progressMap,
    bookmarks,
    examAttempts: examAttemptsBySection,
    exerciseAttempts,
  })
}

// Section ids were renamed (src/lib/section-id-migrations.ts). A tab opened before that deploy
// still sends the old slug; canonicalise it here so the row lands under the id the app reads.
const upsertSchema = z.object({
  sectionId: z.string().transform(renameSectionId),
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

    const row = await db.progress.upsert({
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

    void syncProgress(row)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Progress POST error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

const bookmarkSchema = z.object({
  sectionId: z.string().transform(renameSectionId),
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
    const row = await db.progress.upsert({
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

    void syncProgress(row)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Bookmark PATCH error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
