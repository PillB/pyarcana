'use client'

import {
  Users, TrendingUp, Award, Activity, AlertTriangle, FileText, Target, MessageSquare,
} from 'lucide-react'
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type AnalyticsPayload = {
  kpis: {
    totalStudents: number
    active7d: number
    active30d: number
    avgCompletionPct: number
    avgBestScore: number
    passRate: number
    atRiskCount: number
    totalExamAttempts: number
    totalExerciseAttempts: number
    feedbackNew: number
  }
  timeseries: { day: string; registrations: number; completions: number; exams: number }[]
  scoreHistogram: { bucket: string; count: number }[]
  completionHistogram: { bucket: string; count: number }[]
  funnel: { registered: number; started: number; completedOne: number; passedExam: number }
  phaseBreakdown: { phase: number; label: string; started: number; completed: number; avgScore: number }[]
  sections: {
    sectionId: string
    index: number
    title: string
    phase?: number
    avgBestScore: number | null
    attemptCount: number
    started: number
    completed: number
    failRate: number | null
  }[]
  cohorts: {
    id: string
    label: string
    count: number
    avgCompletion: number
    avgScore: number
  }[]
  atRisk: {
    id: string
    email: string
    name: string | null
    reason: string | null
    completionPct: number
    avgScore: number
    lastActivity: string
    risk: string
  }[]
  students?: unknown[]
}

function Kpi({
  icon: Icon,
  label,
  value,
  sub,
  color,
  testId,
}: {
  icon: React.ElementType
  label: string
  value: string
  sub?: string
  color: string
  testId?: string
}) {
  return (
    <Card className={cn('p-4 bg-gradient-to-br', color)} data-testid={testId}>
      <Icon className="h-4 w-4 opacity-80" />
      <div className="mt-2 text-2xl font-bold tracking-tight">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
      {sub && <div className="mt-0.5 text-[10px] text-muted-foreground/80">{sub}</div>}
    </Card>
  )
}

export function AdminOverviewPanel({
  data,
  onSelectStudent,
}: {
  data: AnalyticsPayload
  onSelectStudent: (id: string) => void
}) {
  const { kpis } = data
  const hardSections = [...data.sections]
    .filter((s) => s.avgBestScore != null)
    .sort((a, b) => (a.avgBestScore ?? 100) - (b.avgBestScore ?? 100))
    .slice(0, 12)

  const funnelData = [
    { name: 'Registrados', value: data.funnel.registered },
    { name: 'Iniciaron', value: data.funnel.started },
    { name: '≥1 sección', value: data.funnel.completedOne },
    { name: 'Aprobaron exam', value: data.funnel.passedExam },
  ]

  return (
    <div className="space-y-6" data-testid="admin-overview">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={Users} label="Estudiantes" value={String(kpis.totalStudents)} color="from-violet-500/10 to-violet-500/5" testId="admin-kpi-students" />
        <Kpi icon={Activity} label="Activos 7d" value={String(kpis.active7d)} sub={`${kpis.active30d} en 30d`} color="from-emerald-500/10 to-emerald-500/5" testId="admin-kpi-active" />
        <Kpi icon={TrendingUp} label="Completado prom." value={`${kpis.avgCompletionPct}%`} color="from-sky-500/10 to-sky-500/5" testId="admin-kpi-completion" />
        <Kpi icon={Award} label="Score mejor (prom.)" value={`${kpis.avgBestScore}%`} color="from-amber-500/10 to-amber-500/5" testId="admin-kpi-score" />
        <Kpi icon={Target} label="Tasa de aprobación" value={`${kpis.passRate}%`} sub="≥1 exam ≥70%" color="from-green-500/10 to-green-500/5" />
        <Kpi icon={AlertTriangle} label="En riesgo / inactivos" value={String(kpis.atRiskCount)} color="from-rose-500/10 to-rose-500/5" testId="admin-kpi-risk" />
        <Kpi icon={FileText} label="Exámenes enviados" value={String(kpis.totalExamAttempts)} sub={`${kpis.totalExerciseAttempts} ejercicios`} color="from-indigo-500/10 to-indigo-500/5" />
        <Kpi icon={MessageSquare} label="Feedback NEW" value={String(kpis.feedbackNew)} color="from-orange-500/10 to-orange-500/5" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4" data-testid="admin-chart-timeseries">
          <h3 className="mb-3 text-sm font-semibold">Actividad (30 días)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.timeseries}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} tickFormatter={(v) => String(v).slice(5)} />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip />
                <Area type="monotone" dataKey="registrations" name="Registros" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.25)" />
                <Area type="monotone" dataKey="exams" name="Exámenes" stackId="2" stroke="#f59e0b" fill="#f59e0b40" />
                <Area type="monotone" dataKey="completions" name="Sub-pasos" stackId="3" stroke="#10b981" fill="#10b98140" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4" data-testid="admin-chart-scores">
          <h3 className="mb-3 text-sm font-semibold">Distribución de scores (mejor promedio)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.scoreHistogram}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="bucket" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" name="Estudiantes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4" data-testid="admin-chart-completion">
          <h3 className="mb-3 text-sm font-semibold">Distribución de completado</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.completionHistogram}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="bucket" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" name="Estudiantes" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4" data-testid="admin-chart-funnel">
          <h3 className="mb-3 text-sm font-semibold">Embudo de engagement</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" name="Estudiantes" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4" data-testid="admin-chart-hard-sections">
          <h3 className="mb-3 text-sm font-semibold">Secciones más difíciles (menor score)</h3>
          <div className="h-64">
            {hardSections.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Sin datos de exámenes aún.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hardSections} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="title" width={100} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="avgBestScore" name="Score prom." fill="#f43f5e" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card className="p-4" data-testid="admin-at-risk-list">
          <h3 className="mb-3 text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            Estudiantes en riesgo
          </h3>
          {data.atRisk.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">Nadie en riesgo por ahora.</p>
          ) : (
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {data.atRisk.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSelectStudent(s.id)}
                  className="flex w-full items-center justify-between rounded-lg border border-border/60 p-2.5 text-left transition-colors hover:bg-accent/40"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{s.name || s.email}</div>
                    <div className="truncate text-[11px] text-muted-foreground">{s.reason || s.email}</div>
                  </div>
                  <div className="ml-2 flex shrink-0 flex-col items-end gap-0.5">
                    <Badge variant={s.risk === 'inactive' ? 'secondary' : 'destructive'} className="text-[10px]">
                      {s.risk === 'inactive' ? 'Inactivo' : 'Riesgo'}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {s.completionPct}% · {s.avgScore || '—'}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="mb-3 text-sm font-semibold">Progreso por fase</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {data.phaseBreakdown.map((p) => (
            <div key={p.phase} className="rounded-lg border border-border/60 p-3">
              <div className="text-xs font-medium text-muted-foreground">{p.label}</div>
              <div className="mt-1 text-lg font-bold">{p.completed} <span className="text-sm font-normal text-muted-foreground">completados</span></div>
              <div className="text-xs text-muted-foreground">{p.started} iniciados · score {p.avgScore}%</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
