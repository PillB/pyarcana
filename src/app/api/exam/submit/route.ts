import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { syncExamAttempt } from '@/lib/firebase/sync'
import {
  examSubmitSchema,
  gradeExamAnswers,
  type QuestionKey,
} from '@/lib/exam-scoring'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  try {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
    }
    const parsed = examSubmitSchema.safeParse(body)
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

    const byId = new Map<string, QuestionKey>()
    for (const q of questions) {
      byId.set(q.id, {
        id: q.id,
        concept: q.concept,
        variant: q.variant,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        question: q.question,
        options: q.options,
      })
    }

    const { detailedAnswers, correctCount, totalQuestions, score, passed } =
      gradeExamAnswers(answers, byId)

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
      totalQuestions,
      detailedAnswers,
      passed,
    })
  } catch (error) {
    console.error('Exam submit error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
