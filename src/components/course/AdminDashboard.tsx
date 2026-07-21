'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users, TrendingUp, Award, Download, Search, Loader2,
  ChevronRight, ArrowLeft, MessageSquare, LayoutDashboard,
  Layers, Grid3X3,
} from 'lucide-react'
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AdminFeedbackPanel } from './AdminFeedbackPanel'
import { AdminOverviewPanel, type AnalyticsPayload } from './admin/AdminOverviewPanel'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { COURSE_SECTIONS } from '@/lib/course'
import { PASS_THRESHOLD, SUB_STEPS } from '@/lib/admin-analytics'

interface StudentSummary {
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
  avgBestScore?: number
  exercisesAttempted: number
  risk?: 'healthy' | 'at_risk' | 'inactive'
  riskReason?: string | null
  phaseMax?: number
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
  bestScoresChart?: { sectionId: string; index: number; label: string; title: string; score: number | null }[]
  subStepMatrix?: {
    sectionId: string
    index: number
    title: string
    steps: Record<string, boolean>
    doneCount: number
  }[]
  conceptWeaknesses?: { concept: string; wrong: number; total: number; wrongRate: number }[]
  totalTimeSpentSec?: number
}

const SECTION_LABEL: Record<string, string> = Object.fromEntries(
  COURSE_SECTIONS.map((s) => [s.id, `S${s.index}. ${s.shortTitle}`])
)

export function AdminDashboard() {
  const { toast } = useToast()
  const [tab, setTab] = useState('overview')
  const [students, setStudents] = useState<StudentSummary[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activityFilter, setActivityFilter] = useState('all')
  const [riskFilter, setRiskFilter] = useState('all')
  const [sortBy, setSortBy] = useState('completion')
  const [selectedStudent, setSelectedStudent] = useState<StudentDetail | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [sRes, aRes] = await Promise.all([
        fetch('/api/admin/students'),
        fetch('/api/admin/analytics'),
      ])
      if (!sRes.ok || !aRes.ok) throw new Error('No autorizado')
      const sData = await sRes.json()
      const aData = await aRes.json()
      setStudents(sData.students || aData.students || [])
      setAnalytics(aData)
    } catch {
      toast({
        title: 'No autorizado',
        description: 'Solo admins pueden ver esto',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    load()
  }, [load])

  const loadStudentDetail = async (id: string) => {
    setLoadingDetail(true)
    try {
      const res = await fetch(`/api/admin/students/${id}`)
      if (!res.ok) throw new Error()
      setSelectedStudent(await res.json())
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

  const filteredStudents = useMemo(() => {
    const now = Date.now()
    let list = [...students]
    const q = search.toLowerCase().trim()
    if (q) {
      list = list.filter(
        (s) =>
          s.email.toLowerCase().includes(q) ||
          (s.name || '').toLowerCase().includes(q)
      )
    }
    if (activityFilter === '7d') {
      list = list.filter((s) => now - new Date(s.lastActivity).getTime() <= 7 * 864e5)
    } else if (activityFilter === '30d') {
      list = list.filter((s) => now - new Date(s.lastActivity).getTime() <= 30 * 864e5)
    } else if (activityFilter === 'inactive14') {
      list = list.filter((s) => now - new Date(s.lastActivity).getTime() > 14 * 864e5)
    }
    if (riskFilter === 'at_risk') {
      list = list.filter((s) => s.risk === 'at_risk' || s.risk === 'inactive')
    } else if (riskFilter === 'healthy') {
      list = list.filter((s) => !s.risk || s.risk === 'healthy')
    }
    list.sort((a, b) => {
      if (sortBy === 'score') return (b.avgBestScore ?? b.avgExamScore) - (a.avgBestScore ?? a.avgExamScore)
      if (sortBy === 'activity') return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
      if (sortBy === 'exams') return b.examAttemptsCount - a.examAttemptsCount
      if (sortBy === 'name') return (a.name || a.email).localeCompare(b.name || b.email)
      return b.completionPct - a.completionPct
    })
    return list
  }, [students, search, activityFilter, riskFilter, sortBy])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (loadingDetail) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (selectedStudent) {
    return (
      <StudentDetailView
        detail={selectedStudent}
        onBack={() => setSelectedStudent(null)}
      />
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8" data-testid="admin-students">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Badge variant="outline" className="mb-3 gap-1.5 border-primary/30 text-primary">
          <Users className="h-3 w-3" />
          Panel de Administración
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="gradient-text">Dashboard del Maestro</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Analytics de progreso, calificaciones, cohortes y gaps — todos los estudiantes.
        </p>
      </motion.div>

      <Tabs value={tab} onValueChange={setTab} className="mt-6">
        <TabsList className="flex h-auto flex-wrap gap-1">
          <TabsTrigger value="overview" className="gap-1.5" data-testid="admin-tab-overview">
            <LayoutDashboard className="h-3.5 w-3.5" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="students" className="gap-1.5" data-testid="admin-tab-students">
            <Users className="h-3.5 w-3.5" />
            Estudiantes
          </TabsTrigger>
          <TabsTrigger value="cohorts" className="gap-1.5" data-testid="admin-tab-cohorts">
            <Layers className="h-3.5 w-3.5" />
            Cohortes
          </TabsTrigger>
          <TabsTrigger value="sections" className="gap-1.5" data-testid="admin-tab-sections">
            <Grid3X3 className="h-3.5 w-3.5" />
            Secciones
          </TabsTrigger>
          <TabsTrigger value="feedback" className="gap-1.5" data-testid="admin-tab-feedback">
            <MessageSquare className="h-3.5 w-3.5" />
            Feedback
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          {analytics ? (
            <AdminOverviewPanel
              data={analytics}
              onSelectStudent={(id) => loadStudentDetail(id)}
            />
          ) : (
            <p className="text-sm text-muted-foreground">Sin datos de analytics.</p>
          )}
        </TabsContent>

        <TabsContent value="students" className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => exportCSV('students')} className="gap-2" data-testid="admin-export">
              <Download className="h-4 w-4" />
              Exportar estudiantes
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportCSV('attempts')} className="gap-2" data-testid="admin-export-attempts">
              <Download className="h-4 w-4" />
              Exportar exámenes
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="relative min-w-[200px] flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por email o nombre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                data-testid="admin-filter-search"
              />
            </div>
            <Select value={activityFilter} onValueChange={setActivityFilter}>
              <SelectTrigger className="w-[150px]" data-testid="admin-filter-activity">
                <SelectValue placeholder="Actividad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toda actividad</SelectItem>
                <SelectItem value="7d">Activos 7d</SelectItem>
                <SelectItem value="30d">Activos 30d</SelectItem>
                <SelectItem value="inactive14">Inactivos 14d+</SelectItem>
              </SelectContent>
            </Select>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-[140px]" data-testid="admin-filter-risk">
                <SelectValue placeholder="Riesgo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="at_risk">En riesgo</SelectItem>
                <SelectItem value="healthy">Saludables</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]" data-testid="admin-filter-sort">
                <SelectValue placeholder="Orden" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completion">Completado</SelectItem>
                <SelectItem value="score">Score</SelectItem>
                <SelectItem value="activity">Última actividad</SelectItem>
                <SelectItem value="exams">Exámenes</SelectItem>
                <SelectItem value="name">Nombre</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="secondary" className="self-center">
              {filteredStudents.length} resultados
            </Badge>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Estudiante</th>
                    <th className="px-4 py-3 text-left font-medium">Actividad</th>
                    <th className="px-4 py-3 text-center font-medium">Completado</th>
                    <th className="px-4 py-3 text-center font-medium">Exámenes</th>
                    <th className="px-4 py-3 text-center font-medium">Score</th>
                    <th className="px-4 py-3 text-center font-medium">Riesgo</th>
                    <th className="px-4 py-3 text-right font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                        No hay estudiantes con estos filtros.
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
                        {new Date(s.lastActivity).toLocaleDateString('es-PE')}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
                            <div className="h-full gradient-primary" style={{ width: `${s.completionPct}%` }} />
                          </div>
                          <span className="text-xs">{s.completionPct}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-xs">{s.examAttemptsCount}</td>
                      <td className="px-4 py-3 text-center">
                        {(s.avgBestScore ?? s.avgExamScore) > 0 ? (
                          <Badge variant={(s.avgBestScore ?? s.avgExamScore) >= PASS_THRESHOLD ? 'default' : 'secondary'}>
                            {s.avgBestScore ?? s.avgExamScore}%
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {s.risk && s.risk !== 'healthy' ? (
                          <Badge variant={s.risk === 'inactive' ? 'secondary' : 'destructive'} className="text-[10px]">
                            {s.risk === 'inactive' ? 'Inactivo' : 'Riesgo'}
                          </Badge>
                        ) : (
                          <span className="text-[10px] text-muted-foreground">OK</span>
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
        </TabsContent>

        <TabsContent value="cohorts" className="mt-4 space-y-4" data-testid="admin-cohorts">
          <p className="text-sm text-muted-foreground">
            Segmentos virtuales calculados en tiempo real (sin grupos fijos en DB).
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(analytics?.cohorts || []).map((c) => (
              <Card
                key={c.id}
                className="cursor-pointer p-4 transition-colors hover:bg-accent/30"
                data-testid={`admin-cohort-${c.id}`}
                onClick={() => {
                  if (c.id === 'at_risk' || c.id === 'inactive_14d') setRiskFilter('at_risk')
                  else setRiskFilter('all')
                  if (c.id === 'active_7d') setActivityFilter('7d')
                  else if (c.id === 'inactive_14d') setActivityFilter('inactive14')
                  else setActivityFilter('all')
                  setTab('students')
                }}
              >
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{c.label}</div>
                <div className="mt-1 text-2xl font-bold">{c.count}</div>
                <div className="mt-2 flex gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> {c.avgCompletion}%</span>
                  <span className="flex items-center gap-1"><Award className="h-3 w-3" /> {c.avgScore}%</span>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sections" className="mt-4 space-y-4" data-testid="admin-sections">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto max-h-[70vh]">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-muted/90 backdrop-blur">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">#</th>
                    <th className="px-3 py-2 text-left font-medium">Sección</th>
                    <th className="px-3 py-2 text-center font-medium">Iniciaron</th>
                    <th className="px-3 py-2 text-center font-medium">Completaron</th>
                    <th className="px-3 py-2 text-center font-medium">Score</th>
                    <th className="px-3 py-2 text-center font-medium">Fail %</th>
                    <th className="px-3 py-2 text-center font-medium">Intentos</th>
                    <th className="px-3 py-2 text-left font-medium min-w-[120px]">Heat</th>
                  </tr>
                </thead>
                <tbody>
                  {(analytics?.sections || []).map((s) => {
                    const heat = s.avgBestScore ?? 0
                    return (
                      <tr key={s.sectionId} className="border-t border-border/50">
                        <td className="px-3 py-2 text-xs text-muted-foreground">{s.index}</td>
                        <td className="px-3 py-2 font-medium">{s.title}</td>
                        <td className="px-3 py-2 text-center text-xs">{s.started}</td>
                        <td className="px-3 py-2 text-center text-xs">{s.completed}</td>
                        <td className="px-3 py-2 text-center text-xs">
                          {s.avgBestScore != null ? `${s.avgBestScore}%` : '—'}
                        </td>
                        <td className="px-3 py-2 text-center text-xs">
                          {s.failRate != null ? `${s.failRate}%` : '—'}
                        </td>
                        <td className="px-3 py-2 text-center text-xs">{s.attemptCount}</td>
                        <td className="px-3 py-2">
                          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className={cn(
                                'h-full rounded-full',
                                heat >= 70 ? 'bg-emerald-500' : heat >= 50 ? 'bg-amber-500' : heat > 0 ? 'bg-rose-500' : 'bg-muted'
                              )}
                              style={{ width: `${heat}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="mt-4">
          <AdminFeedbackPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StudentDetailView({
  detail,
  onBack,
}: {
  detail: StudentDetail
  onBack: () => void
}) {
  const chartData = (detail.bestScoresChart || []).map((x) => ({
    label: x.label,
    score: x.score ?? 0,
    title: x.title,
  }))

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8" data-testid="admin-student-detail">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-4 gap-1.5">
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">{detail.user.name || detail.user.email}</h1>
        <p className="text-sm text-muted-foreground">{detail.user.email}</p>
        <p className="text-xs text-muted-foreground">
          Registrado: {new Date(detail.user.createdAt).toLocaleDateString('es-PE')}
          {detail.totalTimeSpentSec != null && (
            <> · Tiempo en exámenes: {Math.round(detail.totalTimeSpentSec / 60)} min</>
          )}
        </p>
      </div>

      {chartData.length > 0 && (
        <Card className="mb-6 p-4">
          <h2 className="mb-3 text-sm font-semibold">Mejores scores por sección</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="label" tick={{ fontSize: 9 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="score" name="Score" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {detail.subStepMatrix && (
        <Card className="mb-6 p-4 overflow-x-auto">
          <h2 className="mb-3 text-sm font-semibold">Matriz de progreso (52 × sub-pasos)</h2>
          <table className="w-full text-[10px]">
            <thead>
              <tr>
                <th className="p-1 text-left">Sección</th>
                {SUB_STEPS.map((st) => (
                  <th key={st} className="p-1 text-center capitalize">{st}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {detail.subStepMatrix.map((row) => (
                <tr key={row.sectionId} className="border-t border-border/40">
                  <td className="p-1 font-medium whitespace-nowrap">S{row.index}</td>
                  {SUB_STEPS.map((st) => (
                    <td key={st} className="p-1 text-center">
                      <span
                        className={cn(
                          'inline-block h-3 w-3 rounded-sm',
                          row.steps[st] ? 'bg-emerald-500' : 'bg-muted'
                        )}
                        title={st}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {detail.conceptWeaknesses && detail.conceptWeaknesses.length > 0 && (
        <Card className="mb-6 p-4">
          <h2 className="mb-3 text-sm font-semibold">Conceptos débiles</h2>
          <div className="flex flex-wrap gap-2">
            {detail.conceptWeaknesses.map((c) => (
              <Badge key={c.concept} variant="outline" className="text-xs">
                {c.concept}: {c.wrong}/{c.total} ({c.wrongRate}% err)
              </Badge>
            ))}
          </div>
        </Card>
      )}

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Gaps por sección
      </h2>
      <div className="mb-6 grid gap-2 sm:grid-cols-2">
        {detail.sectionGaps.map((gap) => {
          const isCompleted = (gap.bestScore ?? 0) >= PASS_THRESHOLD
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
                <div className="text-sm font-medium">{SECTION_LABEL[gap.sectionId] || gap.sectionId}</div>
                <div className="text-xs text-muted-foreground">
                  {gap.attempts > 0
                    ? `${gap.attempts} intento(s)`
                    : 'Sin intentos'}
                </div>
              </div>
              {gap.bestScore !== null ? (
                <Badge variant={gap.bestScore >= PASS_THRESHOLD ? 'default' : 'secondary'}>
                  {gap.bestScore}%
                </Badge>
              ) : (
                <Badge variant="outline">N/A</Badge>
              )}
            </Card>
          )
        })}
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Historial de exámenes
      </h2>
      <div className="space-y-3">
        {detail.examAttempts.length === 0 && (
          <p className="text-sm text-muted-foreground">Sin intentos de examen todavía.</p>
        )}
        {detail.examAttempts.map((att) => (
          <Card key={att.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{SECTION_LABEL[att.sectionId] || att.sectionId}</div>
                <div className="text-xs text-muted-foreground">
                  Intento {att.attemptNumber} · {Math.floor(att.timeSpentSec / 60)}m
                  {att.completedAt && ` · ${new Date(att.completedAt).toLocaleString('es-PE')}`}
                </div>
              </div>
              <Badge variant={att.score >= PASS_THRESHOLD ? 'default' : 'secondary'}>{att.score}%</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
