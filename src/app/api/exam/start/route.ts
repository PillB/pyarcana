import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { syncExamAttempt } from '@/lib/firebase/sync'
import { z } from 'zod'
import { renameSectionId, sectionIdAliases } from '@/lib/section-id-migrations'
import {
  EXAM_TIME_LIMIT_SEC,
  GRADING_VERSION,
  MAX_EXAM_ATTEMPTS,
  countedAttempts,
  expiredAttemptClosure,
  itemKey,
  keysSeenBeforeFix,
  nextAttemptNumber,
  redactAttemptsForLearner,
  submissionDeadline,
  toFormItem,
} from '@/lib/exam-scoring'
import { drawOnePerConcept } from '@/lib/exam-draw'
import { secureRandomInt } from '@/lib/exam-rng'
import type { ExamAttempt, QuestionBank } from '@prisma/client'

const startSchema = z.object({
  sectionId: z.string().transform(renameSectionId),
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

    // Every slug this section was stored under: attempts and questions written before the id
    // rename belong to the same section, count toward the attempt cap, and must stay visible
    // even where the database migration has not reached them yet.
    const aliases = sectionIdAliases(sectionId)

    // Get existing attempts for this section; one left open past its time is closed first.
    const existingAttempts = await closeExpiredAttempts(
      await db.examAttempt.findMany({
        where: { userId, sectionId: { in: aliases } },
        orderBy: { attemptNumber: 'asc' },
      }),
      new Date()
    )
    // Attempts graded before the fix do not use up an attempt (isLegacyAttempt).
    const counted = countedAttempts(existingAttempts)

    // Enforce max 3 attempts (2 retries)
    if (counted.length >= MAX_EXAM_ATTEMPTS) {
      return NextResponse.json(
        {
          error: 'Has alcanzado el máximo de 3 intentos para esta sección',
          attempts: redactAttemptsForLearner(existingAttempts),
        },
        { status: 403 }
      )
    }

    const allQuestions = await loadSectionBank(sectionId, aliases)
    if (allQuestions.length === 0) {
      return NextResponse.json(
        { error: 'No hay preguntas cargadas para esta sección aún' },
        { status: 404 }
      )
    }

    // Questions whose key this learner was shown before the fix, in any section: their legacy
    // attempts' stored answers name them.
    const seenKeys = keysSeenBeforeFix(
      await db.examAttempt.findMany({
        where: { userId, completedAt: { not: null }, gradingVersion: { lt: GRADING_VERSION } },
        select: { answers: true },
      })
    )
    const { selectedQuestions, variantSeed } = drawOnePerConcept(
      allQuestions,
      existingAttempts,
      seenKeys,
      secureRandomInt
    )
    // An attempt that has to include one of them is taken and graded, but is not evidence.
    const exposedItems = selectedQuestions.filter((q) => seenKeys.has(itemKey(q.concept, q.variant))).length

    // Create the attempt record (started, not completed), with the questions exactly as shown
    // and their key, which submit grades against.
    const attempt = await db.examAttempt.create({
      data: {
        userId,
        sectionId,
        attemptNumber: nextAttemptNumber(existingAttempts),
        answers: '[]',
        score: 0,
        variantSeed: JSON.stringify(variantSeed),
        exposedItems,
        form: { create: { items: JSON.stringify(selectedQuestions.map(toFormItem)) } },
      },
    })

    void syncExamAttempt(attempt)

    // Return questions (without answers) + attempt ID
    return NextResponse.json({
      attemptId: attempt.id,
      // The position among counted attempts, which is what "Intento n de 3" means to the learner.
      attemptNumber: counted.length + 1,
      questions: selectedQuestions.map((q) => ({
        id: q.id,
        concept: q.concept,
        question: q.question,
        options: JSON.parse(q.options),
      })),
      totalAttemptsAllowed: MAX_EXAM_ATTEMPTS,
      attemptsUsed: counted.length,
      timeLimitSec: EXAM_TIME_LIMIT_SEC,
      exposedItems,
    })
  } catch (error) {
    console.error('Exam start error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

/**
 * Close every attempt in `attempts` that was left open past its deadline, and return the list as
 * it stands afterwards. Without this, an attempt abandoned in a closed tab stayed open forever:
 * counted, invisible in the learner's history, and submittable days later.
 */
async function closeExpiredAttempts(attempts: ExamAttempt[], now: Date): Promise<ExamAttempt[]> {
  const expired = attempts.filter((a) => !a.completedAt && now > submissionDeadline(a.startedAt))
  if (expired.length === 0) return attempts
  for (const a of expired) {
    // Conditional, so a submission that lands first is kept.
    await db.examAttempt.updateMany({
      where: { id: a.id, completedAt: null },
      data: expiredAttemptClosure(a.startedAt),
    })
  }
  const ids = new Set(expired.map((a) => a.id))
  const closed = await db.examAttempt.findMany({ where: { id: { in: [...ids] } } })
  for (const a of closed) void syncExamAttempt(a)
  return attempts.map((a) => closed.find((c) => c.id === a.id) ?? a)
}

/** The section's bank under all its ids, one copy of each (concept, variant). */
async function loadSectionBank(sectionId: string, aliases: string[]): Promise<QuestionBank[]> {
  // Get all questions for this section from the bank
  const bank = await db.questionBank.findMany({
    where: { sectionId: { in: aliases } },
  })
  // A reseed after the rename leaves the same (concept, variant) under both slugs; keep one
  // copy, the current slug's, so a twinned variant is not drawn twice as often.
  const byKey = new Map<string, QuestionBank>()
  for (const q of bank) {
    const key = `${q.concept}\u0000${q.variant}`
    if (!byKey.has(key) || q.sectionId === sectionId) byKey.set(key, q)
  }
  return Array.from(byKey.values())
}
