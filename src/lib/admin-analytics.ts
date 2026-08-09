/**
 * Pure aggregation helpers for admin learning analytics.
 * Pass-threshold matches product exam rule (70%).
 */

import { COURSE_META, COURSE_SECTIONS } from '@/lib/course'

export const PASS_THRESHOLD = 70
export const SUB_STEPS = ['theory', 'ido', 'wedo', 'youdo', 'quiz'] as const

export type ProgressRow = {
  userId: string
  sectionId: string
  subStep: string
  completed: boolean
  completedAt: Date | string | null
  bookmarked?: boolean
}

export type ExamRow = {
  userId: string
  sectionId: string
  score: number
  completedAt: Date | string | null
  startedAt?: Date | string
  timeSpentSec?: number
  answers?: string | unknown
}

export type UserRow = {
  id: string
  email: string
  name: string | null
  createdAt: Date | string
  role?: string
}

export type StudentMetrics = {
  id: string
  email: string
  name: string | null
  createdAt: string
  lastActivity: string
  sectionsStarted: number
  sectionsCompleted: number
  totalSections: number
  completionPct: number
  examAttemptsCount: number
  avgExamScore: number
  avgBestScore: number
  bestScoresBySection: Record<string, number>
  exercisesAttempted: number
  totalTimeSpentSec: number
  hasPassedExam: boolean
  risk: 'healthy' | 'at_risk' | 'inactive'
  riskReason: string | null
  phaseMax: 0 | 1 | 2 | 3
}

function toIso(d: Date | string | null | undefined): string | null {
  if (!d) return null
  return d instanceof Date ? d.toISOString() : new Date(d).toISOString()
}

function dayKey(d: Date | string): string {
  const x = d instanceof Date ? d : new Date(d)
  return x.toISOString().slice(0, 10)
}

export function sectionMeta() {
  return COURSE_SECTIONS.map((s) => ({
    id: s.id,
    index: s.index,
    title: s.shortTitle || s.title,
    phase: s.phase ?? (s.index <= 13 ? 1 : s.index <= 26 ? 1 : s.index <= 39 ? 2 : 3),
  }))
}

export function phaseForSectionIndex(index: number): 1 | 2 | 3 {
  if (index <= 13) return 1 // fundamentals treated as phase 1 band for UI
  if (index <= 26) return 1
  if (index <= 39) return 2
  return 3
}

export function buildStudentMetrics(
  users: UserRow[],
  progress: ProgressRow[],
  exams: ExamRow[],
  exerciseCountByUser: Record<string, number> = {},
  now = new Date()
): StudentMetrics[] {
  const totalSections = COURSE_META.totalSections
  const sectionIndex = new Map(COURSE_SECTIONS.map((s) => [s.id, s.index]))
  const ms7 = 7 * 864e5
  const ms14 = 14 * 864e5
  const ms30 = 30 * 864e5
  const t = now.getTime()

  return users.map((u) => {
    const up = progress.filter((p) => p.userId === u.id && p.completed)
    const ue = exams.filter((e) => e.userId === u.id && e.completedAt)

    const bySection: Record<string, Set<string>> = {}
    for (const p of up) {
      if (!bySection[p.sectionId]) bySection[p.sectionId] = new Set()
      bySection[p.sectionId]!.add(p.subStep)
    }
    const sectionsStarted = Object.keys(bySection).length
    let sectionsCompleted = 0
    for (const steps of Object.values(bySection)) {
      if (SUB_STEPS.every((s) => steps.has(s)) || steps.size >= 5) sectionsCompleted++
    }

    const bestScoresBySection: Record<string, number> = {}
    for (const e of ue) {
      const prev = bestScoresBySection[e.sectionId]
      if (prev === undefined || e.score > prev) bestScoresBySection[e.sectionId] = e.score
    }
    const bestValues = Object.values(bestScoresBySection)
    const avgBestScore =
      bestValues.length > 0
        ? Math.round(bestValues.reduce((a, b) => a + b, 0) / bestValues.length)
        : 0
    const avgExamScore =
      ue.length > 0 ? Math.round(ue.reduce((a, e) => a + e.score, 0) / ue.length) : 0
    const totalTimeSpentSec = ue.reduce((a, e) => a + (e.timeSpentSec || 0), 0)
    const hasPassedExam = ue.some((e) => e.score >= PASS_THRESHOLD)

    const activityDates: number[] = [new Date(u.createdAt).getTime()]
    for (const p of up) {
      const iso = toIso(p.completedAt)
      if (iso) activityDates.push(new Date(iso).getTime())
    }
    for (const e of ue) {
      const iso = toIso(e.completedAt) || toIso(e.startedAt)
      if (iso) activityDates.push(new Date(iso).getTime())
    }
    const lastActivityMs = Math.max(...activityDates)
    const lastActivity = new Date(lastActivityMs).toISOString()
    const completionPct = Math.round((sectionsCompleted / totalSections) * 100)

    let phaseMax: 0 | 1 | 2 | 3 = 0
    for (const sid of Object.keys(bySection)) {
      const idx = sectionIndex.get(sid) || 0
      const ph = phaseForSectionIndex(idx)
      if (ph > phaseMax) phaseMax = ph
    }

    let risk: StudentMetrics['risk'] = 'healthy'
    let riskReason: string | null = null
    const inactive14 = t - lastActivityMs > ms14
    const inactive7 = t - lastActivityMs > ms7
    if (inactive14 && (sectionsStarted > 0 || ue.length > 0)) {
      risk = 'inactive'
      riskReason = 'Sin actividad en 14+ días'
    } else if (
      completionPct < 20 &&
      (avgExamScore < PASS_THRESHOLD || ue.length === 0) &&
      sectionsStarted > 0
    ) {
      risk = 'at_risk'
      riskReason = 'Bajo progreso y calificaciones'
    } else if (inactive7 && sectionsStarted === 0) {
      risk = 'at_risk'
      riskReason = 'Registrado sin comenzar'
    }

    return {
      id: u.id,
      email: u.email,
      name: u.name,
      createdAt: toIso(u.createdAt)!,
      lastActivity,
      sectionsStarted,
      sectionsCompleted,
      totalSections,
      completionPct,
      examAttemptsCount: ue.length,
      avgExamScore,
      avgBestScore,
      bestScoresBySection,
      exercisesAttempted: exerciseCountByUser[u.id] || 0,
      totalTimeSpentSec,
      hasPassedExam,
      risk,
      riskReason,
      phaseMax,
    }
  })
}

export function buildAnalyticsPayload(
  students: StudentMetrics[],
  progress: ProgressRow[],
  exams: ExamRow[],
  users: UserRow[],
  opts: { feedbackNew?: number; exerciseTotal?: number; now?: Date } = {}
) {
  const now = opts.now || new Date()
  const t = now.getTime()
  const ms7 = 7 * 864e5
  const ms30 = 30 * 864e5
  const meta = sectionMeta()

  const active7d = students.filter((s) => t - new Date(s.lastActivity).getTime() <= ms7).length
  const active30d = students.filter((s) => t - new Date(s.lastActivity).getTime() <= ms30).length
  const avgCompletionPct =
    students.length > 0
      ? Math.round(students.reduce((a, s) => a + s.completionPct, 0) / students.length)
      : 0
  const withBest = students.filter((s) => s.avgBestScore > 0)
  const avgBestScore =
    withBest.length > 0
      ? Math.round(withBest.reduce((a, s) => a + s.avgBestScore, 0) / withBest.length)
      : 0
  const passRate =
    students.length > 0
      ? Math.round((students.filter((s) => s.hasPassedExam).length / students.length) * 100)
      : 0
  const atRiskList = students.filter((s) => s.risk !== 'healthy')

  // Histograms
  const scoreBuckets = [
    '0-9',
    '10-19',
    '20-29',
    '30-39',
    '40-49',
    '50-59',
    '60-69',
    '70-79',
    '80-89',
    '90-100',
  ]
  const scoreHistogram = scoreBuckets.map((bucket) => ({ bucket, count: 0 }))
  for (const s of students) {
    if (s.avgBestScore <= 0 && s.examAttemptsCount === 0) continue
    const v = s.avgBestScore
    const idx = v >= 100 ? 9 : Math.min(9, Math.floor(v / 10))
    scoreHistogram[idx]!.count++
  }
  const completionHistogram = [
    { bucket: '0-24%', count: 0 },
    { bucket: '25-49%', count: 0 },
    { bucket: '50-74%', count: 0 },
    { bucket: '75-100%', count: 0 },
  ]
  for (const s of students) {
    if (s.completionPct < 25) completionHistogram[0]!.count++
    else if (s.completionPct < 50) completionHistogram[1]!.count++
    else if (s.completionPct < 75) completionHistogram[2]!.count++
    else completionHistogram[3]!.count++
  }

  // Timeseries last 30 days
  const days: string[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date(t - i * 864e5)
    days.push(d.toISOString().slice(0, 10))
  }
  const regMap: Record<string, number> = Object.fromEntries(days.map((d) => [d, 0]))
  const compMap: Record<string, number> = Object.fromEntries(days.map((d) => [d, 0]))
  const examMap: Record<string, number> = Object.fromEntries(days.map((d) => [d, 0]))
  for (const u of users) {
    const k = dayKey(u.createdAt)
    if (k in regMap) regMap[k]!++
  }
  for (const p of progress) {
    if (!p.completed || !p.completedAt) continue
    const k = dayKey(p.completedAt)
    if (k in compMap) compMap[k]!++
  }
  for (const e of exams) {
    if (!e.completedAt) continue
    const k = dayKey(e.completedAt)
    if (k in examMap) examMap[k]!++
  }
  const timeseries = days.map((day) => ({
    day,
    registrations: regMap[day] || 0,
    completions: compMap[day] || 0,
    exams: examMap[day] || 0,
  }))

  // Section health
  const completedProg = progress.filter((p) => p.completed)
  const sections = meta.map((m) => {
    const starters = new Set(
      completedProg.filter((p) => p.sectionId === m.id).map((p) => p.userId)
    )
    const completers = new Set<string>()
    const byUser: Record<string, Set<string>> = {}
    for (const p of completedProg.filter((x) => x.sectionId === m.id)) {
      if (!byUser[p.userId]) byUser[p.userId] = new Set()
      byUser[p.userId]!.add(p.subStep)
    }
    for (const [uid, steps] of Object.entries(byUser)) {
      if (steps.size >= 5) completers.add(uid)
    }
    const sectionExams = exams.filter((e) => e.sectionId === m.id && e.completedAt)
    const bestByUser: Record<string, number> = {}
    for (const e of sectionExams) {
      if (bestByUser[e.userId] === undefined || e.score > bestByUser[e.userId]!) {
        bestByUser[e.userId] = e.score
      }
    }
    const bests = Object.values(bestByUser)
    const avgBestScore =
      bests.length > 0 ? Math.round(bests.reduce((a, b) => a + b, 0) / bests.length) : null
    const fails = bests.filter((s) => s < PASS_THRESHOLD).length
    const failRate = bests.length > 0 ? Math.round((fails / bests.length) * 100) : null
    return {
      sectionId: m.id,
      index: m.index,
      title: m.title,
      phase: m.phase,
      started: starters.size,
      completed: completers.size,
      avgBestScore,
      failRate,
      attemptCount: sectionExams.length,
    }
  })

  // Cohorts
  const mk = (
    id: string,
    label: string,
    pred: (s: StudentMetrics) => boolean
  ) => {
    const list = students.filter(pred)
    const avgC =
      list.length > 0
        ? Math.round(list.reduce((a, s) => a + s.completionPct, 0) / list.length)
        : 0
    const withS = list.filter((s) => s.avgBestScore > 0)
    const avgS =
      withS.length > 0
        ? Math.round(withS.reduce((a, s) => a + s.avgBestScore, 0) / withS.length)
        : 0
    return { id, label, count: list.length, avgCompletion: avgC, avgScore: avgS }
  }

  const cohorts = [
    mk('all', 'Todos', () => true),
    mk('active_7d', 'Activos 7d', (s) => t - new Date(s.lastActivity).getTime() <= ms7),
    mk('inactive_14d', 'Inactivos 14d+', (s) => t - new Date(s.lastActivity).getTime() > 14 * 864e5),
    mk('at_risk', 'En riesgo', (s) => s.risk === 'at_risk' || s.risk === 'inactive'),
    mk('high_performers', 'Alto rendimiento', (s) => s.completionPct >= 50 && s.avgBestScore >= 80),
    mk('phase1', 'Fase 1', (s) => s.phaseMax === 1),
    mk('phase2', 'Fase 2+', (s) => s.phaseMax >= 2),
    mk('phase3', 'Fase 3', (s) => s.phaseMax === 3),
    mk('never_started', 'Sin comenzar', (s) => s.sectionsStarted === 0),
  ]

  const funnel = {
    registered: students.length,
    started: students.filter((s) => s.sectionsStarted > 0).length,
    completedOne: students.filter((s) => s.sectionsCompleted > 0).length,
    passedExam: students.filter((s) => s.hasPassedExam).length,
  }

  const phaseBreakdown = [1, 2, 3].map((phase) => {
    const secs = sections.filter((s) => s.phase === phase)
    return {
      phase,
      label: `Fase ${phase}`,
      started: secs.reduce((a, s) => a + s.started, 0),
      completed: secs.reduce((a, s) => a + s.completed, 0),
      avgScore: (() => {
        const vals = secs.map((s) => s.avgBestScore).filter((v): v is number => v != null)
        return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0
      })(),
    }
  })

  return {
    kpis: {
      totalStudents: students.length,
      active7d,
      active30d,
      avgCompletionPct,
      avgBestScore,
      passRate,
      atRiskCount: atRiskList.length,
      totalExamAttempts: exams.filter((e) => e.completedAt).length,
      totalExerciseAttempts: opts.exerciseTotal ?? 0,
      feedbackNew: opts.feedbackNew ?? 0,
    },
    timeseries,
    scoreHistogram,
    completionHistogram,
    sections,
    cohorts,
    funnel,
    phaseBreakdown,
    atRisk: atRiskList.slice(0, 25).map((s) => ({
      id: s.id,
      email: s.email,
      name: s.name,
      reason: s.riskReason,
      completionPct: s.completionPct,
      avgScore: s.avgBestScore || s.avgExamScore,
      lastActivity: s.lastActivity,
      risk: s.risk,
    })),
    students,
    generatedAt: now.toISOString(),
  }
}

export function buildStudentDetailExtras(
  progress: ProgressRow[],
  exams: ExamRow[]
) {
  const bestScoresBySection: Record<string, number> = {}
  let totalTimeSpentSec = 0
  const conceptWrong: Record<string, number> = {}
  const conceptTotal: Record<string, number> = {}

  for (const e of exams) {
    if (!e.completedAt) continue
    totalTimeSpentSec += e.timeSpentSec || 0
    if (bestScoresBySection[e.sectionId] === undefined || e.score > bestScoresBySection[e.sectionId]!) {
      bestScoresBySection[e.sectionId] = e.score
    }
    let answers: { concept?: string; correct?: boolean }[] = []
    try {
      answers =
        typeof e.answers === 'string' ? JSON.parse(e.answers) : (e.answers as typeof answers) || []
    } catch {
      answers = []
    }
    for (const a of answers) {
      if (!a.concept) continue
      conceptTotal[a.concept] = (conceptTotal[a.concept] || 0) + 1
      if (!a.correct) conceptWrong[a.concept] = (conceptWrong[a.concept] || 0) + 1
    }
  }

  const subStepMatrix = COURSE_SECTIONS.map((s) => {
    const steps = progress.filter((p) => p.sectionId === s.id && p.completed)
    const done = new Set(steps.map((p) => p.subStep))
    return {
      sectionId: s.id,
      index: s.index,
      title: s.shortTitle,
      steps: Object.fromEntries(SUB_STEPS.map((st) => [st, done.has(st)])),
      doneCount: SUB_STEPS.filter((st) => done.has(st)).length,
    }
  })

  const conceptWeaknesses = Object.keys(conceptTotal)
    .map((concept) => ({
      concept,
      wrong: conceptWrong[concept] || 0,
      total: conceptTotal[concept] || 0,
      wrongRate: Math.round(((conceptWrong[concept] || 0) / (conceptTotal[concept] || 1)) * 100),
    }))
    .filter((c) => c.wrong > 0)
    .sort((a, b) => b.wrongRate - a.wrongRate || b.wrong - a.wrong)
    .slice(0, 12)

  const bestScoresChart = COURSE_SECTIONS.map((s) => ({
    sectionId: s.id,
    index: s.index,
    label: `S${s.index}`,
    title: s.shortTitle,
    score: bestScoresBySection[s.id] ?? null,
  })).filter((x) => x.score !== null)

  return {
    bestScoresBySection,
    bestScoresChart,
    subStepMatrix,
    conceptWeaknesses,
    totalTimeSpentSec,
  }
}
