import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { syncExamAttempt } from '@/lib/firebase/sync'
import { z } from 'zod'

const submitSchema = z.object({
  attemptId: z.string(),
  answers: z.array(
    z.object({
      questionId: z.string(),
      selectedIndex: z.number().int().min(0),
    })
  ),
  timeSpentSec: z.number().int().min(0).max(3600),
})

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = submitSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }

    const { attemptId, answers, timeSpentSec } = parsed.data
    const userId = session.user.id

    // Fetch the attempt (verify ownership)
    const attempt = await db.examAttempt.findUnique({
      where: { id: attemptId },
    })

    if (!attempt || attempt.userId !== userId) {
      return NextResponse.json({ error: 'Intento no encontrado' }, { status: 404 })
    }

    if (attempt.completedAt) {
      return NextResponse.json(
        { error: 'Este intento ya fue completado' },
        { status: 400 }
      )
    }

    // Fetch all questions referenced in the answers
    const questionIds = answers.map((a) => a.questionId)
    const questions = await db.questionBank.findMany({
      where: { id: { in: questionIds } },
    })

    // Compute score and detailed answers
    const detailedAnswers = answers.map((a) => {
      const q = questions.find((x) => x.id === a.questionId)
      if (!q) {
        return {
          questionId: a.questionId,
          concept: 'unknown',
          variant: 0,
          selectedIndex: a.selectedIndex,
          correctIndex: -1,
          correct: false,
        }
      }
      return {
        questionId: q.id,
        concept: q.concept,
        variant: q.variant,
        selectedIndex: a.selectedIndex,
        correctIndex: q.correctIndex,
        correct: a.selectedIndex === q.correctIndex,
        explanation: q.explanation,
        question: q.question,
        options: JSON.parse(q.options),
      }
    })

    const correctCount = detailedAnswers.filter((a) => a.correct).length
    const score = Math.round((correctCount / detailedAnswers.length) * 100)

    // Update the attempt with full detail
    const updated = await db.examAttempt.update({
      where: { id: attemptId },
      data: {
        answers: JSON.stringify(detailedAnswers),
        score,
        completedAt: new Date(),
        timeSpentSec,
      },
    })

    void syncExamAttempt(updated)

    return NextResponse.json({
      attemptId,
      score,
      correctCount,
      totalQuestions: detailedAnswers.length,
      detailedAnswers,
      passed: score >= 70,
    })
  } catch (error) {
    console.error('Exam submit error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
