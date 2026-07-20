import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const startSchema = z.object({
  sectionId: z.string(),
})

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = startSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'sectionId requerido' }, { status: 400 })
    }

    const { sectionId } = parsed.data
    const userId = session.user.id

    // Get existing attempts for this section
    const existingAttempts = await db.examAttempt.findMany({
      where: { userId, sectionId },
      orderBy: { attemptNumber: 'asc' },
    })

    // Enforce max 3 attempts (2 retries)
    if (existingAttempts.length >= 3) {
      return NextResponse.json(
        {
          error: 'Has alcanzado el máximo de 3 intentos para esta sección',
          attempts: existingAttempts,
        },
        { status: 403 }
      )
    }

    const attemptNumber = existingAttempts.length + 1

    // Get all questions for this section from the bank
    const allQuestions = await db.questionBank.findMany({
      where: { sectionId },
    })

    if (allQuestions.length === 0) {
      return NextResponse.json(
        { error: 'No hay preguntas cargadas para esta sección aún' },
        { status: 404 }
      )
    }

    // Group questions by concept.
    // V3 exam model: N concepts × 1 variant per attempt (full sections: N=8).
    // Question count is dynamic — not hardcoded. Expanding the seed/bank to more
    // concepts automatically yields more questions without changing this sampler.
    const byConcept = new Map<string, typeof allQuestions>()
    for (const q of allQuestions) {
      if (!byConcept.has(q.concept)) byConcept.set(q.concept, [])
      byConcept.get(q.concept)!.push(q)
    }

    // For each concept, select ONE variant randomly, avoiding variants used in previous attempts
    const usedVariants = new Set<string>()
    for (const att of existingAttempts) {
      try {
        const seed = JSON.parse(att.variantSeed) as { concept: string; variant: number }[]
        for (const s of seed) usedVariants.add(`${s.concept}-${s.variant}`)
      } catch {}
    }

    const selectedQuestions: typeof allQuestions = []
    const variantSeed: { concept: string; variant: number; questionId: string }[] = []

    // One question per distinct concept present in the bank for this section
    for (const [concept, variants] of byConcept.entries()) {
      // Filter out already-used variants for this concept
      let available = variants.filter(
        (v) => !usedVariants.has(`${concept}-${v.variant}`)
      )

      // If all variants used (after 3 attempts), reset to allow reuse
      if (available.length === 0) {
        available = variants
      }

      // Random selection
      const selected = available[Math.floor(Math.random() * available.length)]
      selectedQuestions.push(selected)
      variantSeed.push({
        concept: selected.concept,
        variant: selected.variant,
        questionId: selected.id,
      })
    }

    // Shuffle question order (anti-cheating)
    for (let i = selectedQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[selectedQuestions[i], selectedQuestions[j]] = [selectedQuestions[j], selectedQuestions[i]]
    }

    // Create the attempt record (started, not completed)
    const attempt = await db.examAttempt.create({
      data: {
        userId,
        sectionId,
        attemptNumber,
        answers: '[]',
        score: 0,
        variantSeed: JSON.stringify(variantSeed),
      },
    })

    // Return questions (without answers) + attempt ID
    return NextResponse.json({
      attemptId: attempt.id,
      attemptNumber,
      questions: selectedQuestions.map((q) => ({
        id: q.id,
        concept: q.concept,
        question: q.question,
        options: JSON.parse(q.options),
      })),
      totalAttemptsAllowed: 3,
      attemptsUsed: existingAttempts.length,
    })
  } catch (error) {
    console.error('Exam start error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
