'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  Circle,
  Lock,
  BookOpen,
  PlayCircle,
  Users,
  Rocket,
  HelpCircle,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react'
import * as Icons from 'lucide-react'
import { cn } from '@/lib/utils'
import { useProgressStore, SUB_STEPS, type SubStep } from '@/lib/progress-store'
import type { CourseSection } from '@/lib/types'

interface SidebarProps {
  sections: CourseSection[]
  activeSectionId: string | null
  onSelectSection: (id: string) => void
  onHome: () => void
  view: 'home' | 'section' | 'resources' | 'dashboard'
}

const SUB_STEP_ICONS: Record<SubStep, React.ElementType> = {
  theory: BookOpen,
  ido: PlayCircle,
  wedo: Users,
  youdo: Rocket,
  quiz: HelpCircle,
}

const SUB_STEP_COLORS: Record<SubStep, string> = {
  theory: 'text-sky-600 bg-sky-500/10',
  ido: 'text-violet-600 bg-violet-500/10',
  wedo: 'text-amber-600 bg-amber-500/10',
  youdo: 'text-emerald-600 bg-emerald-500/10',
  quiz: 'text-rose-600 bg-rose-500/10',
}

export function Sidebar({ sections, activeSectionId, onSelectSection, onHome, view }: SidebarProps) {
  const { completedSections, completedSubSteps, toggleBookmark, bookmarks, setLastVisited } = useProgressStore()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch: render with empty state on SSR,
  // then hydrate from localStorage on client
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  // Use empty state during SSR and first client render
  const safeCompletedSections = mounted ? completedSections : []
  const safeCompletedSubSteps = mounted ? completedSubSteps : {}
  const safeBookmarks = mounted ? bookmarks : []

  const completedCount = safeCompletedSections.length
  const totalProgress = Math.round((completedCount / sections.length) * 100)

  return (
    <nav className="flex h-full flex-col bg-sidebar">
      {/* Brand */}
      <button
        onClick={onHome}
        className="flex items-center gap-3 border-b border-sidebar-border px-5 py-4 text-left transition-colors hover:bg-sidebar-accent/50"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-primary shadow-glow">
          <span className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Py</span>
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-bold tracking-tight text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
            El Arte de Python
          </div>
          <div className="truncate text-xs text-muted-foreground">De cero a Data Scientist</div>
        </div>
      </button>

      {/* Progress summary */}
      <div className="border-b border-sidebar-border px-5 py-4">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium text-muted-foreground">Tu progreso</span>
          <span className="font-bold text-primary">{totalProgress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full gradient-primary"
            initial={{ width: 0 }}
            animate={{ width: `${totalProgress}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          {completedCount} de {sections.length} secciones completadas
        </div>
      </div>

      {/* Sections list */}
      <div className="flex-1 overflow-y-auto scroll-area-thin px-3 py-3">
        <div className="space-y-1">
          {sections.map((section, idx) => {
            const isCompleted = safeCompletedSections.includes(section.id)
            const isActive = activeSectionId === section.id
            const subStepsDone = safeCompletedSubSteps[section.id] || []
            const isBookmarked = safeBookmarks.includes(section.id)
            const Icon = (Icons as Record<string, React.ElementType>)[section.icon] || Icons.Circle

            return (
              <div key={section.id}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    onSelectSection(section.id)
                    setLastVisited(section.id)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onSelectSection(section.id)
                      setLastVisited(section.id)
                    }
                  }}
                  className={cn(
                    'group relative flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all',
                    isActive
                      ? 'bg-sidebar-accent shadow-sm'
                      : 'hover:bg-sidebar-accent/50'
                  )}
                >
                  {/* Status indicator */}
                  <div
                    className={cn(
                      'relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors',
                      isCompleted
                        ? 'gradient-primary text-white'
                        : isActive
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <span>{section.index}</span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div
                      className={cn(
                        'truncate text-sm font-medium',
                        isActive ? 'text-foreground' : 'text-foreground/80'
                      )}
                    >
                      {section.shortTitle}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {section.tagline}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleBookmark(section.id)
                    }}
                    className="shrink-0 p-1 text-muted-foreground/40 opacity-0 transition-opacity hover:text-primary group-hover:opacity-100"
                    aria-label="Marcar como favorito"
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <Bookmark className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>

                {/* Sub-steps when active */}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-4 mt-1 space-y-0.5 border-l border-sidebar-border pl-3"
                  >
                    {SUB_STEPS.map((step) => {
                      const StepIcon = SUB_STEP_ICONS[step]
                      const stepDone = subStepsDone.includes(step)
                      return (
                        <div
                          key={step}
                          className="flex items-center gap-2 rounded-md px-2 py-1 text-xs"
                        >
                          <div
                            className={cn(
                              'flex h-5 w-5 items-center justify-center rounded',
                              SUB_STEP_COLORS[step]
                            )}
                          >
                            <StepIcon className="h-3 w-3" />
                          </div>
                          <span
                            className={cn(
                              'flex-1 capitalize',
                              stepDone ? 'text-foreground' : 'text-muted-foreground'
                            )}
                          >
                            {step === 'ido' ? 'Yo hago' :
                             step === 'wedo' ? 'Hacemos juntos' :
                             step === 'youdo' ? 'Tú haces' :
                             step === 'theory' ? 'Teoría' : 'Autocheck'}
                          </span>
                          {stepDone && (
                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                          )}
                        </div>
                      )
                    })}
                  </motion.div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer nav */}
      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={onHome}
          className={cn(
            'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            view === 'home' || view === 'dashboard'
              ? 'bg-sidebar-accent text-foreground'
              : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground'
          )}
        >
          <Icons.LayoutDashboard className="h-4 w-4" />
          Dashboard
          <ChevronRight className="ml-auto h-4 w-4" />
        </button>
        <button
          onClick={() => onSelectSection('__resources__')}
          className={cn(
            'mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            view === 'resources'
              ? 'bg-sidebar-accent text-foreground'
              : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground'
          )}
        >
          <Icons.Library className="h-4 w-4" />
          Recursos
          <ChevronRight className="ml-auto h-4 w-4" />
        </button>
      </div>
    </nav>
  )
}
