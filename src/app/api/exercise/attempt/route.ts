import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { syncExerciseAttempt } from '@/lib/firebase/sync'
import { z } from 'zod'

const attemptSchema = z.object({
  sectionId: z.string(),
  exerciseId: z.string(),
  usedHint: z.boolean().default(false),
  correct: z.boolean(),
})

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = attemptSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }

    const { sectionId, exerciseId, usedHint, correct } = parsed.data

    const attempt = await db.exerciseAttempt.create({
      data: {
        userId: session.user.id,
        sectionId,
        exerciseId,
        usedHint,
        correct,
      },
    })

    void syncExerciseAttempt(attempt)

    return NextResponse.json({ success: true, id: attempt.id })
  } catch (error) {
    console.error('Exercise attempt error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
