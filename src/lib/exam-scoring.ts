/**
 * Pure exam scoring + validation helpers (no DB / session).
 * Used by /api/exam/submit and adversarial unit tests.
 */

import { z } from 'zod'

export const PASS_THRESHOLD = 70

export const examSubmitSchema = z.object({
  attemptId: z.string().min(1).max(128),
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1).max(128),
        selectedIndex: z.number().int().min(0).max(50),
      })
    )
    .min(1, 'Se requiere al menos una respuesta')
    .max(100),
  timeSpentSec: z.number().int().min(0).max(3600),
})

export type ExamAnswerInput = z.infer<typeof examSubmitSchema>['answers'][number]

export type QuestionKey = {
  id: string
  concept?: string
  variant?: number
  correctIndex: number
  explanation?: string
  question?: string
  options?: string | string[]
}

export type GradedAnswer = {
  questionId: string
  concept: string
  variant: number
  selectedIndex: number
  correctIndex: number
  correct: boolean
  explanation?: string
  question?: string
  options?: string[]
}

function parseOptions(raw: string | string[] | undefined): string[] | undefined {
  if (raw == null) return undefined
  if (Array.isArray(raw)) return raw.map(String)
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.map(String) : undefined
  } catch {
    return undefined
  }
}

/**
 * Grade answers against a question bank map.
 * Missing questions count as incorrect (correctIndex -1).
 * Empty answers array yields score 0 (caller should reject via schema).
 */
export function gradeExamAnswers(
  answers: ExamAnswerInput[],
  questionsById: Map<string, QuestionKey> | Record<string, QuestionKey>
): {
  detailedAnswers: GradedAnswer[]
  correctCount: number
  totalQuestions: number
  score: number
  passed: boolean
} {
  const map =
    questionsById instanceof Map
      ? questionsById
      : new Map(Object.entries(questionsById))

  const detailedAnswers: GradedAnswer[] = answers.map((a) => {
    const q = map.get(a.questionId)
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
    const options = parseOptions(q.options)
    // Out-of-range selectedIndex is always wrong
    const inRange =
      options == null ||
      (a.selectedIndex >= 0 && a.selectedIndex < options.length)
    const correct =
      inRange &&
      Number.isFinite(q.correctIndex) &&
      a.selectedIndex === q.correctIndex
    return {
      questionId: q.id,
      concept: q.concept || 'unknown',
      variant: q.variant ?? 0,
      selectedIndex: a.selectedIndex,
      correctIndex: q.correctIndex,
      correct,
      explanation: q.explanation,
      question: q.question,
      options,
    }
  })

  const totalQuestions = detailedAnswers.length
  const correctCount = detailedAnswers.filter((a) => a.correct).length
  // Guard: never divide by zero; empty → score 0
  const score =
    totalQuestions === 0
      ? 0
      : Math.round((correctCount / totalQuestions) * 100)
  const clamped = Math.max(0, Math.min(100, Number.isFinite(score) ? score : 0))

  return {
    detailedAnswers,
    correctCount,
    totalQuestions,
    score: clamped,
    passed: clamped >= PASS_THRESHOLD,
  }
}

/** Best score per section from multiple attempts (invalid scores ignored). */
export function bestScoreBySection(
  attempts: Array<{ sectionId: string; score: number | null | undefined }>
): Record<string, number> {
  const out: Record<string, number> = {}
  for (const a of attempts) {
    if (!a.sectionId || typeof a.sectionId !== 'string') continue
    const s = Number(a.score)
    if (!Number.isFinite(s)) continue
    const clamped = Math.max(0, Math.min(100, s))
    if (out[a.sectionId] === undefined || clamped > out[a.sectionId]!) {
      out[a.sectionId] = clamped
    }
  }
  return out
}
