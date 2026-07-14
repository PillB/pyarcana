'use client'

import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { MuchaHalo, DividerVine } from '@/components/ornaments/Ornaments'
import {
  Sparkles,
  Target,
  TrendingUp,
  Award,
  BookOpen,
  Rocket,
  Users,
  PlayCircle,
  HelpCircle,
  ArrowRight,
  Clock,
  Flame,
  Trophy,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ProgressRing } from './ProgressRing'
import { useProgressStore } from '@/lib/progress-store'
import type { CourseSection, CourseMeta } from '@/lib/types'
import * as Icons from 'lucide-react'
import { cn } from '@/lib/utils'

interface DashboardProps {
  meta: CourseMeta
  sections: CourseSection[]
  onSelectSection: (id: string) => void
  onOpenAuth: (tab: 'login' | 'register') => void
}

export function Dashboard({ meta, sections, onSelectSection, onOpenAuth }: DashboardProps) {
  const { completedSections, completedSubSteps, quizScores, lastVisited, startDate, setStartDate } = useProgressStore()
  const { data: session } = useSession()
  const totalSubSteps = sections.length * 5
  const doneSubSteps = sections.reduce(
    (acc, s) => acc + (completedSubSteps[s.id]?.length || 0),
    0
  )
  const overallProgress = Math.round((doneSubSteps / totalSubSteps) * 100)
  const completedCount = completedSections.length

  // Find next section to do
  const nextSection = sections.find((s) => !completedSections.includes(s.id)) || sections[0]
  const isReturning = lastVisited !== null

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl gradient-mesh border border-border/60 p-6 sm:p-10"
      >
        {/* Mucha Halo background */}
        <div className="pointer-events-none absolute right-0 top-0 hidden h-[500px] w-[500px] opacity-60 lg:block">
          <MuchaHalo className="h-full w-full" opacity={0.4} />
        </div>
        {/* Circuit-Vine — AI × Art Nouveau */}
        <div className="circuit-vine-bg pointer-events-none absolute inset-0" />

        <div className="relative z-10">
          <Badge variant="outline" className="mb-4 gap-1.5 border-gold bg-background/70 backdrop-blur">
            <Sparkles className="h-3 w-3 text-gold" />
            Curso online · Español peruano
          </Badge>
          <h1 className="font-display max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl" style={{ fontFamily: 'var(--font-display)' }}>
            <span className="gradient-text">{meta.title}</span>
          </h1>
          <p className="font-subdisplay mt-4 max-w-2xl text-xl text-foreground/80 sm:text-2xl" style={{ fontFamily: 'var(--font-subdisplay)' }}>
            {meta.subtitle}
          </p>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {meta.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              onClick={() => {
                setStartDate()
                onSelectSection(nextSection.id)
              }}
              className="gap-2 shadow-glow"
            >
              <Rocket className="h-4 w-4" />
              {isReturning ? 'Continuar donde lo dejé' : 'Empezar ahora'}
              <ArrowRight className="h-4 w-4" />
            </Button>
            {!session?.user && (
              <Button
                size="lg"
                variant="outline"
                onClick={() => onOpenAuth('register')}
                className="gap-2 border-gold"
              >
                <Sparkles className="h-4 w-4 text-gold" />
                Crear cuenta gratis
              </Button>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {meta.totalHours}h · {meta.totalSections} secciones
            </div>
          </div>

          {!session?.user && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold bg-accent/5 px-3 py-1.5 text-xs text-foreground/80">
              <Sparkles className="h-3 w-3 text-gold" />
              Crea cuenta para guardar progreso, rendir exámenes con anti-plagio y ver tu dashboard
            </div>
          )}
        </div>
      </motion.section>

      {/* Stats row */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={TrendingUp}
          label="Progreso total"
          value={`${overallProgress}%`}
          sublabel={`${doneSubSteps} de ${totalSubSteps} etapas`}
          color="violet"
          delay={0.05}
        />
        <StatCard
          icon={Trophy}
          label="Secciones completadas"
          value={`${completedCount}/${sections.length}`}
          sublabel={completedCount > 0 ? 'Vas chevere, sigue así' : 'Aún no abres ninguna'}
          color="emerald"
          delay={0.1}
        />
        <StatCard
          icon={Flame}
          label="Quiz promedio"
          value={`${Math.round(
            Object.values(quizScores).reduce((a, b) => a + b, 0) /
              Math.max(Object.keys(quizScores).length, 1)
          )}%`}
          sublabel={`${Object.keys(quizScores).length} quizzes rendidos`}
          color="amber"
          delay={0.15}
        />
        <StatCard
          icon={Target}
          label="Tu meta"
          value={meta.targetRole}
          sublabel="Listo para aplicar en LATAM"
          color="sky"
          delay={0.2}
        />
      </div>

      {/* Continue learning */}
      {isReturning && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-8"
        >
          <Card className="overflow-hidden border-primary/30">
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs font-medium text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  CONTINÚA DONDE LO DEJASTE
                </div>
                <h3 className="mt-1 text-lg font-bold">{nextSection.title}</h3>
                <p className="text-sm text-muted-foreground">{nextSection.tagline}</p>
              </div>
              <Button onClick={() => onSelectSection(nextSection.id)} className="gap-2">
                Continuar
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Curriculum grid */}
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Currículum del curso</h2>
            <p className="text-sm text-muted-foreground">
              13 secciones · método I Do / We Do / You Do · proyectos de portafolio
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section, idx) => {
            const isCompleted = completedSections.includes(section.id)
            const subStepsDone = completedSubSteps[section.id] || []
            const sectionProgress = Math.round((subStepsDone.length / 5) * 100)
            const isNext = section.id === nextSection.id
            const Icon = (Icons as Record<string, React.ElementType>)[section.icon] || Icons.Circle

            return (
              <motion.button
                key={section.id}
                onClick={() => onSelectSection(section.id)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * idx }}
                whileHover={{ y: -2 }}
                className={cn(
                  'group relative overflow-hidden rounded-2xl border bg-card p-5 text-left transition-all',
                  isCompleted ? 'border-green-500/30' : isNext ? 'border-primary/40 shadow-glow' : 'border-border hover:border-primary/30'
                )}
              >
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md', section.accentColor)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  {isCompleted ? (
                    <Badge className="gap-1 bg-green-600 text-white">
                      <CheckCircle2 className="h-3 w-3" />
                      Hecho
                    </Badge>
                  ) : isNext ? (
                    <Badge variant="outline" className="gap-1 border-primary text-primary">
                      <Sparkles className="h-3 w-3" />
                      Siguiente
                    </Badge>
                  ) : null}
                </div>

                {/* Title */}
                <div className="mt-3">
                  <div className="text-xs font-medium text-muted-foreground">Sección {section.index}</div>
                  <h3 className="text-base font-bold leading-tight">{section.shortTitle}</h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{section.tagline}</p>
                </div>

                {/* Bottom */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {section.estimatedHours}h
                    <span className="mx-1">·</span>
                    <span>{section.level}</span>
                  </div>
                  {sectionProgress > 0 && !isCompleted && (
                    <span className="text-xs font-semibold text-primary">{sectionProgress}%</span>
                  )}
                </div>

                {/* Progress bar */}
                {sectionProgress > 0 && (
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full gradient-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${sectionProgress}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>
      </section>

      {/* Methodology section */}
      <section className="mt-12">
        <Card className="overflow-hidden border-border/60">
          <div className="grid gap-0 lg:grid-cols-2">
            <div className="p-6 sm:p-8">
              <Badge variant="outline" className="mb-3 gap-1.5 border-primary/30 text-primary">
                <Sparkles className="h-3 w-3" />
                Pedagogía
              </Badge>
              <h2 className="text-2xl font-bold tracking-tight">
                Método <span className="gradient-text">I Do / We Do / You Do</span>
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Gradual Release of Responsibility — el mismo marco que usan profesores top de Corwin y Brilliant. Cada sección sigue 4 fases para que no te quedes pegado en "tutorial hell".
              </p>

              <div className="mt-5 space-y-3">
                <MethodStep
                  icon={PlayCircle}
                  color="violet"
                  step="I Do"
                  title="Yo hago — Demostración"
                  desc="Te muestro paso a paso cómo se resuelve un problema real, explicando el porqué de cada línea."
                />
                <MethodStep
                  icon={Users}
                  color="amber"
                  step="We Do"
                  title="Hacemos juntos — Práctica guiada"
                  desc="Escribes código con mi guía. Te doy starter code, hints y solución para que compares."
                />
                <MethodStep
                  icon={Rocket}
                  color="emerald"
                  step="You Do"
                  title="Tú haces — Proyecto de portafolio"
                  desc="Construyes un mini-proyecto que va directo a tu GitHub. Esto es lo que muestras en entrevistas."
                />
                <MethodStep
                  icon={HelpCircle}
                  color="rose"
                  step="Autocheck"
                  title="Quiz con feedback inmediato"
                  desc="Active recall para fijar la memoria. Necesitas 70% para desbloquear la siguiente sección."
                />
              </div>
            </div>

            <div className="border-t bg-muted/30 p-6 sm:p-8 lg:border-l lg:border-t-0">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                ¿Por qué este curso es diferente?
              </h3>
              <div className="mt-4 space-y-4">
                <Feature
                  icon={Target}
                  title="Alineado al mercado peruano 2025-2026"
                  desc="Keywords reales de LinkedIn, rangos salariales de Lima y skills que piden empresas como Interbank, BBVA, Caja Arequipa."
                />
                <Feature
                  icon={Award}
                  title="Proyectos que pesan en entrevistas"
                  desc="Churn con SHAP, EDA de Netflix, pipeline sklearn con ColumnTransformer. Los mismos formatos que mandan empresas US."
                />
                <Feature
                  icon={BookOpen}
                  title="Basado en 4 libros + investigación"
                  desc="Python 101, Python Apprentice to Master, Python Awesome Job y python201, enriquecidos con artículos verificados de Medium."
                />
                <Feature
                  icon={TrendingUp}
                  title="100% autónomo"
                  desc="Sin profe, sin horario. Tú avanzas cuando puedas. El progreso se guarda en tu navegador."
                />
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Certifications */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight">Certificaciones gratuitas recomendadas</h2>
        <p className="text-sm text-muted-foreground">
          Hazlas en paralelo al curso. Complementan tu portafolio y suman en LinkedIn.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            { name: 'CS50P Harvard', desc: 'Python para no-programadores. Reconocido por reclutadores US.', url: 'https://cs50.harvard.edu/python' },
            { name: 'Google Python Certificate', desc: 'IT Automation with Python. Marca fuerte en LinkedIn.', url: 'https://www.coursera.org/professional-certificates/google-it-automation' },
            { name: 'Kaggle Learn', desc: 'Micro-cursos con badge visible en tu perfil Kaggle.', url: 'https://www.kaggle.com/learn' },
          ].map((c, i) => (
            <Card key={i} className="p-5">
              <Award className="h-6 w-6 text-primary" />
              <h4 className="mt-2 font-semibold">{c.name}</h4>
              <p className="mt-1 text-xs text-muted-foreground">{c.desc}</p>
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                Abrir <ArrowRight className="h-3 w-3" />
              </a>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
  color,
  delay,
}: {
  icon: React.ElementType
  label: string
  value: string
  sublabel: string
  color: 'violet' | 'emerald' | 'amber' | 'sky'
  delay: number
}) {
  const colorMap = {
    violet: 'from-violet-500/10 to-violet-500/5 text-violet-600',
    emerald: 'from-emerald-500/10 to-emerald-500/5 text-emerald-600',
    amber: 'from-amber-500/10 to-amber-500/5 text-amber-600',
    sky: 'from-sky-500/10 to-sky-500/5 text-sky-600',
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className={cn('bg-gradient-to-br p-5', colorMap[color])}>
        <Icon className="h-5 w-5" />
        <div className="mt-3 text-2xl font-bold">{value}</div>
        <div className="text-xs font-medium text-foreground/70">{label}</div>
        <div className="mt-1 text-xs text-muted-foreground">{sublabel}</div>
      </Card>
    </motion.div>
  )
}

function MethodStep({
  icon: Icon,
  color,
  step,
  title,
  desc,
}: {
  icon: React.ElementType
  color: 'violet' | 'amber' | 'emerald' | 'rose'
  step: string
  title: string
  desc: string
}) {
  const colorMap = {
    violet: 'bg-violet-500/10 text-violet-600 border-violet-500/30',
    amber: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
    rose: 'bg-rose-500/10 text-rose-600 border-rose-500/30',
  }
  return (
    <div className="flex gap-3">
      <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border', colorMap[color])}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{step}</div>
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  )
}

function Feature({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  )
}
