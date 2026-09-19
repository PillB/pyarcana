/**
 * Pure exam scoring + validation helpers (no DB / session).
 * Used by /api/exam/submit and adversarial unit tests.
 */

import { z } from 'zod'
import { renameSectionId } from './section-id-migrations'

export const PASS_THRESHOLD = 70

/** Attempts per learner and section. exam/start enforces it; the answer-key release reads it. */
export const MAX_EXAM_ATTEMPTS = 3

/** selectedIndex recorded for a drawn question the learner did not answer. */
export const UNANSWERED = -1

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

/** One question exam/start drew for an attempt, as recorded in ExamAttempt.variantSeed. */
export type DrawnQuestion = { concept: string; variant: number; questionId: string }

/**
 * The questions an attempt drew, or null when the stored seed cannot say. Null means the
 * attempt cannot be graded: the caller refuses rather than falling back to whatever ids the
 * client sends, which is how scores were forged.
 */
export function parseVariantSeed(raw: unknown): DrawnQuestion[] | null {
  let seed: unknown
  try {
    seed = typeof raw === 'string' ? JSON.parse(raw) : raw
  } catch {
    return null
  }
  if (!Array.isArray(seed) || seed.length === 0) return null
  const drawn = seed.filter(
    (s): s is DrawnQuestion =>
      !!s && typeof s === 'object' && typeof s.questionId === 'string' && s.questionId !== ''
  )
  const ids = new Set(drawn.map((d) => d.questionId))
  // A seed with an unusable or repeated entry is not a draw we can grade against.
  return drawn.length === seed.length && ids.size === drawn.length ? drawn : null
}

export type DrawCheck =
  | { ok: true }
  | { ok: false; reason: 'not-drawn' | 'duplicate'; questionId: string }

/**
 * Whether a submission answers only questions this attempt drew, each at most once. Leaving a
 * drawn question unanswered is allowed; it is graded wrong.
 */
export function checkAnswersAgainstDraw(
  answers: ExamAnswerInput[],
  drawnQuestionIds: readonly string[]
): DrawCheck {
  const drawn = new Set(drawnQuestionIds)
  const seen = new Set<string>()
  for (const { questionId } of answers) {
    if (!drawn.has(questionId)) return { ok: false, reason: 'not-drawn', questionId }
    if (seen.has(questionId)) return { ok: false, reason: 'duplicate', questionId }
    seen.add(questionId)
  }
  return { ok: true }
}

function gradeOne(
  questionId: string,
  selectedIndex: number,
  q: QuestionKey | undefined
): GradedAnswer {
  if (!q) {
    return {
      questionId,
      concept: 'unknown',
      variant: 0,
      selectedIndex,
      correctIndex: -1,
      correct: false,
    }
  }
  const options = parseOptions(q.options)
  // Out-of-range selectedIndex is always wrong; so is UNANSWERED.
  const inRange =
    selectedIndex >= 0 && (options == null || selectedIndex < options.length)
  const correct =
    inRange &&
    Number.isFinite(q.correctIndex) &&
    selectedIndex === q.correctIndex
  return {
    questionId: q.id,
    concept: q.concept || 'unknown',
    variant: q.variant ?? 0,
    selectedIndex,
    correctIndex: q.correctIndex,
    correct,
    explanation: q.explanation,
    question: q.question,
    options,
  }
}

/**
 * Grade one attempt against the questions drawn for it.
 *
 * The score is over the drawn questions, never over the answers sent: an unanswered drawn
 * question counts wrong. An answer to a question that was not drawn, and a second answer to
 * one that was, are not graded. exam/submit rejects both before it gets here
 * (checkAnswersAgainstDraw); ignoring them here as well means a caller that forgets the check
 * still cannot raise a score.
 *
 * Answered questions come first, in the order sent (the order the learner saw them), then the
 * unanswered ones in draw order. A drawn question missing from the bank counts as incorrect
 * (correctIndex -1).
 */
export function gradeExamAnswers(
  answers: ExamAnswerInput[],
  questionsById: Map<string, QuestionKey> | Record<string, QuestionKey>,
  drawnQuestionIds: readonly string[]
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

  const drawn = Array.from(new Set(drawnQuestionIds))
  const drawnSet = new Set(drawn)
  const selected = new Map<string, number>()
  for (const a of answers) {
    if (drawnSet.has(a.questionId) && !selected.has(a.questionId)) {
      selected.set(a.questionId, a.selectedIndex)
    }
  }
  const order = [...selected.keys(), ...drawn.filter((id) => !selected.has(id))]
  const detailedAnswers = order.map((id) =>
    gradeOne(id, selected.get(id) ?? UNANSWERED, map.get(id))
  )

  const totalQuestions = drawn.length
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

/** A graded answer as a learner may see it: the key and explanation only once released. */
export type LearnerGradedAnswer = Omit<GradedAnswer, 'correctIndex' | 'explanation'> &
  Partial<Pick<GradedAnswer, 'correctIndex' | 'explanation'>>

/**
 * Whether a learner may see the answer key for a section: once every allowed attempt has been
 * started and graded, so no attempt remains in which a key could be used. The key stays on the
 * server until then; the learner still sees their score and which answers were right.
 *
 * `sectionAttempts` is every attempt the learner holds for the section, under all its ids.
 * An attempt started and never submitted keeps the key closed, because it could still be
 * submitted.
 */
export function answerKeyReleased(
  sectionAttempts: ReadonlyArray<{ completedAt: Date | string | null }>
): boolean {
  return (
    sectionAttempts.length >= MAX_EXAM_ATTEMPTS &&
    sectionAttempts.every((a) => a.completedAt != null)
  )
}

export function withoutAnswerKey(answer: GradedAnswer): LearnerGradedAnswer {
  const { correctIndex: _correctIndex, explanation: _explanation, ...rest } = answer
  return rest
}

function redactStoredAnswers(stored: string): string {
  let answers: unknown
  try {
    answers = JSON.parse(stored)
  } catch {
    return '[]'
  }
  if (!Array.isArray(answers)) return '[]'
  return JSON.stringify(
    answers.map((a) => (a && typeof a === 'object' ? withoutAnswerKey(a as GradedAnswer) : a))
  )
}

/**
 * Stored attempts as a learner-facing endpoint may return them. Each row's `answers` JSON keeps
 * what the learner chose and whether it was right, and loses the key and explanations unless
 * answerKeyReleased holds for that row's section. Rows are grouped by the section id the app
 * reads today, so attempts stored under a pre-rename slug count toward the same section.
 */
export function redactAttemptsForLearner<
  T extends { sectionId: string; answers: string; completedAt: Date | string | null },
>(rows: T[]): T[] {
  const bySection = new Map<string, T[]>()
  for (const r of rows) {
    const id = renameSectionId(r.sectionId)
    bySection.set(id, [...(bySection.get(id) ?? []), r])
  }
  const released = new Set(
    [...bySection].filter(([, attempts]) => answerKeyReleased(attempts)).map(([id]) => id)
  )
  return rows.map((r) =>
    released.has(renameSectionId(r.sectionId))
      ? r
      : { ...r, answers: redactStoredAnswers(r.answers) }
  )
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
