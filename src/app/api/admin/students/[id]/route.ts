import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const { id: userId } = await params

  const [user, progress, examAttempts, exerciseAttempts] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    }),
    db.progress.findMany({ where: { userId } }),
    db.examAttempt.findMany({
      where: { userId },
      orderBy: { startedAt: 'asc' },
    }),
    db.exerciseAttempt.findMany({
      where: { userId },
      orderBy: { attemptedAt: 'desc' },
    }),
  ])

  if (!user) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
  }

  // Compute gap analysis: which sections have no attempts, which have low scores
  const sectionGaps: {
    sectionId: string
    bestScore: number | null
    attempts: number
    lastAttempt: Date | null
  }[] = []

  const sectionIds = [
    'setup', 'basics', 'data-structures', 'functions-modules', 'oop',
    'numpy', 'data-acquisition', 'pandas', 'visualization', 'sklearn',
    'testing', 'performance', 'rpa-automation',
    'security', 'stdlib-deep', 'wxpython-gui', 'packaging', 'data-engineering',
    'databases-orm', 'rag', 'fastapi', 'rapidfuzz-entity', 'computer-vision',
    'rpa-advanced', 'streamlit-dashboards', 'integrator-phase1',
    'async-concurrency', 'llm-agents', 'mlops', 'security-infra',
    'streaming-data', 'microservices', 'advanced-models', 'cv-ai-integration',
    'system-design', 'ai-apis-advanced', 'dbt-bigquery', 'performance-extreme',
    'integrator-phase2', 'agentic-architecture', 'llm-finetuning', 'graph-rag',
    'llmops', 'multimodal', 'iac', 'gpu-computing', 'opensource', 'ai-governance',
    'data-contracts', 'tech-leadership', 'integrator-final', 'career-strategy',
  ]

  for (const sectionId of sectionIds) {
    const sectionExams = examAttempts.filter((e) => e.sectionId === sectionId)
    const bestScore = sectionExams.length > 0
      ? Math.max(...sectionExams.map((e) => e.score))
      : null
    sectionGaps.push({
      sectionId,
      bestScore,
      attempts: sectionExams.length,
      lastAttempt: sectionExams.length > 0
        ? sectionExams[sectionExams.length - 1].completedAt
        : null,
    })
  }

  return NextResponse.json({
    user,
    progress,
    examAttempts: examAttempts.map((a) => ({
      ...a,
      answers: JSON.parse(a.answers),
      variantSeed: JSON.parse(a.variantSeed),
    })),
    exerciseAttempts,
    sectionGaps,
  })
}
