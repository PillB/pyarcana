/**
 * Pure exam scoring + validation helpers (no DB / session).
 * Used by /api/exam/submit and adversarial unit tests.
 */

import { z } from 'zod'

export const PASS_THRESHOLD = 70

/** Counted attempts per learner and section; exam/start enforces it. */
export const MAX_EXAM_ATTEMPTS = 3

/** selectedIndex recorded for a drawn question the learner did not answer. */
export const UNANSWERED = -1

/**
 * Written to ExamAttempt.gradingVersion by exam/submit. 0 is every row graded before 2026-09-18,
 * when submit scored whatever question ids the client sent: those scores may be forged.
 */
export const GRADING_VERSION = 1

/** How long an attempt may stay open, from exam/start. The page counts down from this. */
export const EXAM_TIME_LIMIT_SEC = 60 * 60

/**
 * How late a submission may arrive and still be graded. The page submits at zero; this covers the
 * request's trip to the server, not extra time to answer.
 */
export const EXAM_SUBMIT_GRACE_SEC = 2 * 60

/** Past this moment an open attempt can no longer be submitted. */
export function submissionDeadline(startedAt: Date): Date {
  return new Date(startedAt.getTime() + (EXAM_TIME_LIMIT_SEC + EXAM_SUBMIT_GRACE_SEC) * 1000)
}

/**
 * The update that closes an attempt whose time ran out before anything was graded: nothing
 * answered, score 0, completed when its time ended. It stays one of the learner's counted
 * attempts, as it was while open; closing it makes the history say what happened.
 */
export function expiredAttemptClosure(startedAt: Date) {
  return {
    answers: '[]',
    score: 0,
    completedAt: new Date(startedAt.getTime() + EXAM_TIME_LIMIT_SEC * 1000),
    timeSpentSec: EXAM_TIME_LIMIT_SEC,
    gradingVersion: GRADING_VERSION,
  }
}

/**
 * An attempt graded before GRADING_VERSION existed. Its score is not evidence: it counts for no
 * credential, cohort figure or best score, and does not use up one of the learner's attempts.
 * An open attempt started before the fix is not legacy: it will be graded by the current code.
 */
export function isLegacyAttempt(a: { completedAt: Date | string | null; gradingVersion?: number | null }): boolean {
  return a.completedAt != null && (a.gradingVersion ?? 0) < GRADING_VERSION
}

/** The grading fields an evidence decision reads; a row missing them counts for nothing. */
export type GradingFields = {
  completedAt: Date | string | null
  gradingVersion?: number | null
  exposedItems?: number | null
}

/**
 * Whether an attempt's score is evidence: graded, by the current code, over questions whose key
 * the learner had not been shown. Credentials, cohort figures, reports, admin averages and the
 * learner's best score read only these. Fails closed: a caller that did not select the grading
 * fields gets no evidence rather than forged scores.
 */
export function isEvidence(a: GradingFields): boolean {
  return (
    a.completedAt != null &&
    (a.gradingVersion ?? 0) >= GRADING_VERSION &&
    a.exposedItems === 0
  )
}

/** Prisma filter for attempts whose score is evidence (isEvidence, less completedAt). */
export const GRADED_AS_EVIDENCE = { gradingVersion: { gte: GRADING_VERSION }, exposedItems: 0 } as const

/** The key a question is known by across sections: every concept slug belongs to one section. */
export function itemKey(concept: string, variant: number): string {
  return `${concept}\u0000${variant}`
}

/**
 * Every question whose answer key this learner was shown before the fix. Submit then returned the
 * key for each question id the client sent, from any section, and stored exactly those answers,
 * so a legacy row's stored answers name them. An entry for a question the bank did not have
 * (correctIndex -1) revealed nothing.
 */
export function keysSeenBeforeFix(legacyRows: ReadonlyArray<{ answers: string }>): Set<string> {
  const seen = new Set<string>()
  for (const row of legacyRows) {
    let answers: unknown
    try {
      answers = JSON.parse(row.answers)
    } catch {
      continue
    }
    if (!Array.isArray(answers)) continue
    for (const a of answers as Partial<GradedAnswer>[]) {
      if (!a || typeof a.concept !== 'string' || !Number.isInteger(a.variant)) continue
      if (!Number.isInteger(a.correctIndex) || (a.correctIndex as number) < 0) continue
      seen.add(itemKey(a.concept, a.variant as number))
    }
  }
  return seen
}

/** Distinct sections, by the id the app reads today, with an evidence attempt at or above the pass mark. */
export function passedSectionCount(
  attempts: ReadonlyArray<GradingFields & { sectionId: string; score: number }>,
  canonicalId: (id: string) => string
): number {
  return new Set(
    attempts.filter((a) => a.score >= PASS_THRESHOLD && isEvidence(a)).map((a) => canonicalId(a.sectionId))
  ).size
}

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

/**
 * A graded answer as a learner sees it. The correct option and the explanation never leave the
 * server: the V3 roadmap (line 93) says the server "nunca expone claves". Each question has three
 * parallel versions shared by every learner, and a key that circulates stops them measuring
 * anything. The learner still sees the option they chose and whether it was right.
 */
export type LearnerGradedAnswer = Omit<GradedAnswer, 'correctIndex' | 'explanation'>

export function withoutAnswerKey(answer: GradedAnswer): LearnerGradedAnswer {
  const { correctIndex: _correctIndex, explanation: _explanation, ...rest } = answer
  return rest
}

/**
 * A stored answers JSON with the key and explanations taken out. Anything that leaves the server
 * with a graded attempt on it — a learner-facing route, the Firestore mirror — passes through here.
 */
export function redactStoredAnswers(stored: string): string {
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
 * Stored attempts as a learner-facing endpoint returns them: the graded answers without the key,
 * `legacy` on an attempt graded before GRADING_VERSION, which the page lists but does not count
 * toward the 3, and `evidence` (isEvidence), which says whether its score counts.
 */
export function redactAttemptsForLearner<T extends GradingFields & { answers: string }>(
  rows: T[]
): Array<T & { legacy: boolean; evidence: boolean }> {
  return rows.map((r) => ({
    ...r,
    answers: redactStoredAnswers(r.answers),
    legacy: isLegacyAttempt(r),
    evidence: isEvidence(r),
  }))
}

/** Attempts that use up one of the learner's MAX_EXAM_ATTEMPTS: all but the legacy ones. */
export function countedAttempts<
  T extends { completedAt: Date | string | null; gradingVersion?: number | null },
>(attempts: T[]): T[] {
  return attempts.filter((a) => !isLegacyAttempt(a))
}

/**
 * The attemptNumber for a new attempt. It follows every attempt the learner holds for the section,
 * legacy ones included, because (userId, sectionId, attemptNumber) is unique; the number the page
 * shows is the position among counted attempts instead.
 */
export function nextAttemptNumber(attempts: ReadonlyArray<{ attemptNumber: number }>): number {
  return attempts.reduce((max, a) => Math.max(max, a.attemptNumber), 0) + 1
}

/** One question as exam/start showed it, with its key: an entry of ExamAttemptForm.items. */
export type FormItem = {
  questionId: string
  concept: string
  variant: number
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export function toFormItem(q: {
  id: string
  concept: string
  variant: number
  question: string
  options: string
  correctIndex: number
  explanation: string
}): FormItem {
  return {
    questionId: q.id,
    concept: q.concept,
    variant: q.variant,
    question: q.question,
    options: parseOptions(q.options) ?? [],
    correctIndex: q.correctIndex,
    explanation: q.explanation,
  }
}

/**
 * The key an attempt's form holds, by question id, or null when the form cannot be read. Null is
 * a refusal, not a cue to grade against the live bank: the form is what the learner saw.
 */
export function parseFormItems(raw: string): Map<string, QuestionKey> | null {
  let items: unknown
  try {
    items = JSON.parse(raw)
  } catch {
    return null
  }
  if (!Array.isArray(items) || items.length === 0) return null
  const byId = new Map<string, QuestionKey>()
  for (const it of items as Partial<FormItem>[]) {
    if (!it || typeof it.questionId !== 'string' || !Number.isInteger(it.correctIndex)) return null
    byId.set(it.questionId, {
      id: it.questionId,
      concept: it.concept,
      variant: it.variant,
      correctIndex: it.correctIndex as number,
      explanation: it.explanation,
      question: it.question,
      options: it.options,
    })
  }
  return byId
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
