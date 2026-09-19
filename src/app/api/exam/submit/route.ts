import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { syncExamAttempt } from '@/lib/firebase/sync'
import {
  answerKeyReleased,
  checkAnswersAgainstDraw,
  examSubmitSchema,
  gradeExamAnswers,
  parseVariantSeed,
  withoutAnswerKey,
  type ExamAnswerInput,
  type QuestionKey,
} from '@/lib/exam-scoring'
import { sectionIdAliases } from '@/lib/section-id-migrations'

const DRAW_REJECTION = {
  'not-drawn': 'La respuesta incluye una pregunta que no pertenece a este intento',
  duplicate: 'La respuesta incluye la misma pregunta más de una vez',
} as const

/**
 * Grade a submission against the questions exam/start drew for the attempt, never against the
 * ids the client sends: those were how a single known answer, from any section, scored 100%.
 * Refuses, without grading, an attempt whose draw is unreadable and a submission that answers
 * a question outside the draw or answers one twice.
 */
async function gradeAgainstDraw(
  variantSeed: string,
  answers: ExamAnswerInput[]
): Promise<ReturnType<typeof gradeExamAnswers> | { error: string; status: number }> {
  const drawn = parseVariantSeed(variantSeed)
  if (!drawn) return { error: 'Este intento no tiene preguntas registradas', status: 409 }
  const drawnIds = drawn.map((d) => d.questionId)
  const check = checkAnswersAgainstDraw(answers, drawnIds)
  if (!check.ok) return { error: DRAW_REJECTION[check.reason], status: 400 }

  const questions = await db.questionBank.findMany({
    where: { id: { in: drawnIds } },
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
  return gradeExamAnswers(answers, byId, drawnIds)
}

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

    const grading = await gradeAgainstDraw(attempt.variantSeed, answers)
    if ('error' in grading) {
      return NextResponse.json({ error: grading.error }, { status: grading.status })
    }
    const { detailedAnswers, correctCount, totalQuestions, score, passed } = grading

    // Complete the attempt only if it is still open: two submissions racing past the check
    // above would otherwise both be graded, and the second would overwrite the first.
    const { count } = await db.examAttempt.updateMany({
      where: { id: attemptId, userId, completedAt: null },
      data: {
        answers: JSON.stringify(detailedAnswers),
        score,
        completedAt: new Date(),
        timeSpentSec,
      },
    })
    if (count === 0) {
      return NextResponse.json(
        { error: 'Este intento ya fue completado' },
        { status: 400 }
      )
    }

    const sectionAttempts = await db.examAttempt.findMany({
      where: { userId, sectionId: { in: sectionIdAliases(attempt.sectionId) } },
    })
    const updated = sectionAttempts.find((a) => a.id === attemptId)
    if (updated) void syncExamAttempt(updated)

    const keyReleased = answerKeyReleased(sectionAttempts)

    return NextResponse.json({
      attemptId,
      score,
      correctCount,
      totalQuestions,
      detailedAnswers: keyReleased ? detailedAnswers : detailedAnswers.map(withoutAnswerKey),
      answerKeyReleased: keyReleased,
      passed,
    })
  } catch (error) {
    console.error('Exam submit error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
