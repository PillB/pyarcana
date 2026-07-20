'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users, TrendingUp, Award, Download, Search, Loader2,
  ChevronRight, ArrowLeft, AlertCircle, FileText, Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface StudentSummary {
  id: string
  email: string
  name: string
  createdAt: string
  lastActivity: string
  sectionsStarted: number
  sectionsCompleted: number
  totalSections: number
  completionPct: number
  examAttemptsCount: number
  avgExamScore: number
  exercisesAttempted: number
}

interface StudentDetail {
  user: {
    id: string
    email: string
    name: string | null
    role: string
    createdAt: string
  }
  progress: {
    userId: string
    sectionId: string
    subStep: string
    completed: boolean
    completedAt: string | null
    bookmarked: boolean
  }[]
  examAttempts: {
    id: string
    sectionId: string
    attemptNumber: number
    score: number
    startedAt: string
    completedAt: string | null
    timeSpentSec: number
    answers: {
      concept: string
      question: string
      selectedIndex: number
      correctIndex: number
      correct: boolean
      explanation: string
      options: string[]
    }[]
    variantSeed: { concept: string; variant: number; questionId: string }[]
  }[]
  sectionGaps: {
    sectionId: string
    bestScore: number | null
    attempts: number
    lastAttempt: string | null
  }[]
}

const SECTION_NAMES: Record<string, string> = {
  setup: '1. Setup',
  basics: '2. Basics',
  "data-structures": '3. Data Struct',
  "functions-modules": '4. Functions',
  oop: '5. OOP',
  numpy: '6. NumPy',
  "data-acquisition": '7. Data Acq',
  pandas: '8. Pandas',
  visualization: '9. Viz',
  sklearn: '10. sklearn',
  testing: '11. Testing',
  performance: '12. Perf',
  "rpa-automation": '13. RPA',
  security: '14. Security',
  "stdlib-deep": '15. stdlib',
  "wxpython-gui": '16. GUI',
  packaging: '17. Packaging',
  "data-engineering": '18. Data Eng',
  "databases-orm": '19. DB/ORM',
  rag: '20. RAG',
  fastapi: '21. FastAPI',
  "rapidfuzz-entity": '22. RapidFuzz',
  "computer-vision": '23. CV',
  "rpa-advanced": '24. RPA+',
  "streamlit-dashboards": '25. Streamlit',
  "integrator-phase1": '26. Capstone P1',
  "async-concurrency": '27. Async',
  "llm-agents": '28. LLM Agents',
  mlops: '29. MLOps',
  "security-infra": '30. Sec/Infra',
  "streaming-data": '31. Streaming',
  microservices: '32. Microsvc',
  "advanced-models": '33. ML+',
  "cv-ai-integration": '34. CV+AI',
  "system-design": '35. SysDesign',
  "ai-apis-advanced": '36. AI APIs',
  "dbt-bigquery": '37. dbt/BQ',
  "performance-extreme": '38. Perf+',
  "integrator-phase2": '39. Capstone P2',
  "agentic-architecture": '40. Agentic',
  "llm-finetuning": '41. FineTune',
  "graph-rag": '42. GraphRAG',
  llmops: '43. LLMOps',
  multimodal: '44. Multi-Modal',
  iac: '45. IaC',
  "gpu-computing": '46. GPU',
  opensource: '47. OSS',
  "ai-governance": '48. Governance',
  "data-contracts": '49. Contracts',
  "tech-leadership": '50. Leadership',
  "integrator-final": '51. Capstone F',
  "career-strategy": '52. Career',

}

export function AdminDashboard() {
  const { toast } = useToast()
  const [students, setStudents] = useState<StudentSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<StudentDetail | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  useEffect(() => {
    fetch('/api/admin/students')
      .then((r) => {
        if (!r.ok) throw new Error('No autorizado')
        return r.json()
      })
      .then((data) => setStudents(data.students || []))
      .catch(() => {
        toast({ title: 'No autorizado', description: 'Solo admins pueden ver esto', variant: 'destructive' })
      })
      .finally(() => setLoading(false))
  }, [toast])

  const loadStudentDetail = async (id: string) => {
    setLoadingDetail(true)
    try {
      const res = await fetch(`/api/admin/students/${id}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setSelectedStudent(data)
    } catch {
      toast({ title: 'Error al cargar detalle', variant: 'destructive' })
    } finally {
      setLoadingDetail(false)
    }
  }

  const exportCSV = (type: 'students' | 'attempts') => {
    window.open(`/api/admin/export?type=${type}`, '_blank')
    toast({ title: `Exportando ${type} a CSV...` })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  // Student detail view
  if (selectedStudent) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedStudent(null)}
          className="mb-4 gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al listado
        </Button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold">{selectedStudent.user.name || selectedStudent.user.email}</h1>
          <p className="text-sm text-muted-foreground">{selectedStudent.user.email}</p>
          <p className="text-xs text-muted-foreground">
            Registrado: {new Date(selectedStudent.user.createdAt).toLocaleDateString('es-PE')}
          </p>
        </div>

        {/* Gap analysis */}
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Análisis de gaps por sección
        </h2>
        <div className="mb-6 grid gap-2 sm:grid-cols-2">
          {selectedStudent.sectionGaps.map((gap) => {
            const isCompleted = (gap.bestScore ?? 0) >= 70
            const isStarted = gap.attempts > 0
            return (
              <Card
                key={gap.sectionId}
                className={cn(
                  'flex items-center justify-between p-3',
                  isCompleted ? 'border-green-500/30' : isStarted ? 'border-amber-500/30' : 'border-border'
                )}
              >
                <div>
                  <div className="text-sm font-medium">{SECTION_NAMES[gap.sectionId] || gap.sectionId}</div>
                  <div className="text-xs text-muted-foreground">
                    {gap.attempts > 0
                      ? `${gap.attempts} intento(s) · último: ${gap.lastAttempt ? new Date(gap.lastAttempt).toLocaleDateString('es-PE') : '-'}`
                      : 'Sin intentos'}
                  </div>
                </div>
                <div className="text-right">
                  {gap.bestScore !== null ? (
                    <Badge variant={gap.bestScore >= 70 ? 'default' : 'secondary'}>
                      {gap.bestScore}%
                    </Badge>
                  ) : (
                    <Badge variant="outline">N/A</Badge>
                  )}
                </div>
              </Card>
            )
          })}
        </div>

        {/* Exam attempts history */}
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Historial de intentos de examen
        </h2>
        <div className="space-y-3">
          {selectedStudent.examAttempts.length === 0 && (
            <p className="text-sm text-muted-foreground">Sin intentos de examen todavía.</p>
          )}
          {selectedStudent.examAttempts.map((att) => (
            <Card key={att.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white',
                      att.score >= 70 ? 'bg-green-500' : att.score >= 50 ? 'bg-amber-500' : 'bg-red-500'
                    )}
                  >
                    {att.attemptNumber}
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      {SECTION_NAMES[att.sectionId] || att.sectionId}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Intento {att.attemptNumber} · {Math.floor(att.timeSpentSec / 60)}m {att.timeSpentSec % 60}s
                      {' · '}
                      {att.completedAt ? new Date(att.completedAt).toLocaleString('es-PE') : 'En progreso'}
                    </div>
                  </div>
                </div>
                <Badge variant={att.score >= 70 ? 'default' : 'secondary'}>{att.score}%</Badge>
              </div>
              {att.answers.length > 0 && (
                <div className="mt-3 border-t border-border pt-3">
                  <div className="text-xs text-muted-foreground mb-2">
                    Variantes usadas (anti-plagio audit trail):
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {att.variantSeed.map((v, i) => (
                      <Badge key={i} variant="outline" className="text-[10px]">
                        {v.concept}: v{v.variant}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-1 sm:grid-cols-3">
                    {att.answers.map((a, i) => (
                      <div
                        key={i}
                        className={cn(
                          'flex items-center gap-1.5 text-[10px]',
                          a.correct ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                        )}
                      >
                        <span>{a.correct ? '✓' : '✗'}</span>
                        <span className="truncate">{a.concept}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // List view
  const filteredStudents = students.filter(
    (s) =>
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.name || '').toLowerCase().includes(search.toLowerCase())
  )

  const avgCompletion = students.length > 0
    ? Math.round(students.reduce((acc, s) => acc + s.completionPct, 0) / students.length)
    : 0
  const avgScore = students.length > 0
    ? Math.round(students.reduce((acc, s) => acc + s.avgExamScore, 0) / students.length)
    : 0

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8" data-testid="admin-students">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Badge variant="outline" className="mb-3 gap-1.5 border-primary/30 text-primary">
          <Users className="h-3 w-3" />
          Panel de Administración
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="gradient-text">Dashboard del Maestro</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Monitorea el progreso, performance y gaps de todos los estudiantes.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Estudiantes" value={String(students.length)} color="violet" />
        <StatCard icon={TrendingUp} label="Completado promedio" value={`${avgCompletion}%`} color="emerald" />
        <StatCard icon={Award} label="Score promedio" value={`${avgScore}%`} color="amber" />
        <StatCard icon={FileText} label="Total exámenes" value={String(students.reduce((acc, s) => acc + s.examAttemptsCount, 0))} color="sky" />
      </div>

      {/* Export buttons */}
      <div className="mt-6 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportCSV('students')}
          className="gap-2"
          data-testid="admin-export"
        >
          <Download className="h-4 w-4" />
          Exportar estudiantes (CSV)
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportCSV('attempts')}
          className="gap-2"
          data-testid="admin-export-attempts"
        >
          <Download className="h-4 w-4" />
          Exportar intentos de examen (CSV)
        </Button>
      </div>

      {/* Search */}
      <div className="mt-6 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por email o nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Students table */}
      <Card className="mt-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Estudiante</th>
                <th className="px-4 py-3 text-left font-medium">Registro</th>
                <th className="px-4 py-3 text-center font-medium">Completado</th>
                <th className="px-4 py-3 text-center font-medium">Exámenes</th>
                <th className="px-4 py-3 text-center font-medium">Score</th>
                <th className="px-4 py-3 text-right font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No hay estudiantes registrados todavía.
                  </td>
                </tr>
              )}
              {filteredStudents.map((s) => (
                <tr
                  key={s.id}
                  className="cursor-pointer border-t border-border/60 transition-colors hover:bg-accent/30"
                  onClick={() => loadStudentDetail(s.id)}
                  data-testid={`admin-student-row-${s.id}`}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">{s.name || s.email.split('@')[0]}</div>
                    <div className="text-xs text-muted-foreground">{s.email}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(s.createdAt).toLocaleDateString('es-PE')}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full gradient-primary"
                          style={{ width: `${s.completionPct}%` }}
                        />
                      </div>
                      <span className="text-xs">{s.completionPct}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-xs">{s.examAttemptsCount}</td>
                  <td className="px-4 py-3 text-center">
                    {s.avgExamScore > 0 ? (
                      <Badge variant={s.avgExamScore >= 70 ? 'default' : 'secondary'}>
                        {s.avgExamScore}%
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType
  label: string
  value: string
  color: 'violet' | 'emerald' | 'amber' | 'sky'
}) {
  const colorMap = {
    violet: 'from-violet-500/10 to-violet-500/5 text-violet-600',
    emerald: 'from-emerald-500/10 to-emerald-500/5 text-emerald-600',
    amber: 'from-amber-500/10 to-amber-500/5 text-amber-600',
    sky: 'from-sky-500/10 to-sky-500/5 text-sky-600',
  }
  return (
    <Card className={cn('bg-gradient-to-br p-4', colorMap[color])}>
      <Icon className="h-5 w-5" />
      <div className="mt-2 text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </Card>
  )
}
