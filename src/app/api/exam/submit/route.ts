import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { syncExamAttempt } from '@/lib/firebase/sync'
import {
  GRADING_VERSION,
  checkAnswersAgainstDraw,
  examSubmitSchema,
  expiredAttemptClosure,
  gradeExamAnswers,
  parseFormItems,
  parseVariantSeed,
  submissionDeadline,
  withoutAnswerKey,
  type ExamAnswerInput,
  type QuestionKey,
} from '@/lib/exam-scoring'

// Shown to the learner as a toast. A learner using the page never sees the first two: only a
// request altered by hand reaches them.
const REFUSAL = {
  'not-drawn': 'No pudimos calificar: una pregunta no pertenece a este intento.',
  duplicate: 'No pudimos calificar: una pregunta fue respondida más de una vez.',
  'no-draw':
    'No pudimos calificar porque este intento no tiene preguntas registradas. Repórtalo con el botón para enviar comentarios de esta página.',
  late: 'El tiempo se agotó antes de que llegaran tus respuestas; el intento se cerró con una puntuación de 0.',
} as const

/**
 * The key to grade an attempt against: the form exam/start saved, which holds the questions as the
 * learner saw them. An attempt started before forms existed has none and falls back to the bank.
 * A form that exists but cannot be read is a refusal, not a fallback.
 */
async function answerKeyFor(attemptId: string, drawnIds: string[]): Promise<Map<string, QuestionKey> | null> {
  const form = await db.examAttemptForm.findUnique({ where: { attemptId } })
  if (form) return parseFormItems(form.items)

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
  return byId
}

/**
 * Grade a submission against the questions exam/start drew for the attempt, never against the
 * ids the client sends: those were how a single known answer, from any section, scored 100%.
 * Refuses, without grading, an attempt whose draw or form is unreadable and a submission that
 * answers a question outside the draw or answers one twice.
 */
async function gradeAgainstDraw(
  attempt: { id: string; variantSeed: string },
  answers: ExamAnswerInput[]
): Promise<ReturnType<typeof gradeExamAnswers> | { error: string; status: number }> {
  const drawn = parseVariantSeed(attempt.variantSeed)
  if (!drawn) return { error: REFUSAL['no-draw'], status: 409 }
  const drawnIds = drawn.map((d) => d.questionId)
  const check = checkAnswersAgainstDraw(answers, drawnIds)
  if (!check.ok) return { error: REFUSAL[check.reason], status: 400 }

  const key = await answerKeyFor(attempt.id, drawnIds)
  if (!key) return { error: REFUSAL['no-draw'], status: 409 }
  return gradeExamAnswers(answers, key, drawnIds)
}

/**
 * Close an attempt whose time ran out, if a submission has not already closed it, and mirror it as
 * exam/start does when it closes one; otherwise Firestore keeps it open for good.
 */
async function closeExpired(attempt: { id: string; startedAt: Date }): Promise<void> {
  const { count } = await db.examAttempt.updateMany({
    where: { id: attempt.id, completedAt: null },
    data: expiredAttemptClosure(attempt.startedAt),
  })
  if (count === 0) return
  const closed = await db.examAttempt.findUnique({ where: { id: attempt.id } })
  if (closed) void syncExamAttempt(closed)
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

    // The page submits when its countdown reaches zero; anything later is not graded.
    if (new Date() > submissionDeadline(attempt.startedAt)) {
      await closeExpired(attempt)
      return NextResponse.json({ error: REFUSAL.late }, { status: 409 })
    }

    const grading = await gradeAgainstDraw(attempt, answers)
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
        gradingVersion: GRADING_VERSION,
      },
    })
    if (count === 0) {
      return NextResponse.json(
        { error: 'Este intento ya fue completado' },
        { status: 400 }
      )
    }

    const updated = await db.examAttempt.findUnique({ where: { id: attemptId } })
    if (updated) void syncExamAttempt(updated)

    // The stored record keeps the key for the admin views; the learner never gets it.
    return NextResponse.json({
      attemptId,
      score,
      correctCount,
      totalQuestions,
      detailedAnswers: detailedAnswers.map(withoutAnswerKey),
      passed,
    })
  } catch (error) {
    console.error('Exam submit error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
