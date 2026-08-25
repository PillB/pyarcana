'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Moon, Sun, Github, ArrowLeft, ShieldCheck, BookOpen, FileText, Network, CreditCard, Boxes, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { useSession } from 'next-auth/react'
import { Sidebar } from '@/components/course/Sidebar'
import { Dashboard } from '@/components/course/Dashboard'
import { SectionView } from '@/components/course/SectionView'
import { ResourcesPage } from '@/components/course/ResourcesPage'
import { AdminDashboard } from '@/components/course/AdminDashboard'
import { AuthModal, UserMenu } from '@/components/course/AuthModal'
import { Glossary } from '@/components/course/Glossary'
import { FeedbackFab } from '@/components/course/FeedbackFab'
import { PdfReport } from '@/components/course/PdfReport'
import { LanguageToggle } from '@/components/course/LanguageToggle'
import { PricingPage } from '@/components/course/PricingPage'
import { FamiliarityDashboard } from '@/components/course/FamiliarityDashboard'
import { CapstonesPage } from '@/components/course/CapstonesPage'
import { InteractiveTour, PYARCANA_TOUR_STORAGE_KEY } from '@/components/course/InteractiveTour'
import { useServerProgressSync, SUB_STEPS, type SubStep } from '@/lib/progress-store'
import { COURSE_META, COURSE_SECTIONS } from '@/lib/course'
import { IS_STATIC_SITE } from '@/lib/runtime-mode'
import { t, useI18n } from '@/lib/i18n'

type View = 'home' | 'section' | 'resources' | 'admin' | 'familiarity' | 'pricing' | 'capstones'

function isSubStep(value: unknown): value is SubStep {
  return typeof value === 'string' && (SUB_STEPS as readonly string[]).includes(value)
}

function resolveCourseSectionId(id: string): string {
  const sMatch = /^S(\d{2})$/i.exec(id)
  if (!sMatch) return id
  const idx = parseInt(sMatch[1], 10)
  const found = COURSE_SECTIONS.find((s) => s.index === idx)
  return found ? found.id : id
}

export default function Home() {
  const [view, setView] = useState<View>('home')
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const [activeSubStep, setActiveSubStep] = useState<SubStep>('theory')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login')
  const [glossaryOpen, setGlossaryOpen] = useState(false)
  const [pdfReportOpen, setPdfReportOpen] = useState(false)
  const [tourOpen, setTourOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)
  const lang = useI18n((state) => state.lang)
  const tr = (key: string) => t(key, lang)

  // Sync progress from server when user is logged in
  useServerProgressSync()

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)

    // Show the first-visit interactive tour for new users.
    let tourTimer: number | undefined
    try {
      if (localStorage.getItem(PYARCANA_TOUR_STORAGE_KEY) !== '1') {
        // Defer slightly so layout settles and tour targets are present.
        tourTimer = window.setTimeout(() => setTourOpen(true), 400)
      }
    } catch {
      // localStorage unavailable — skip the tour.
    }

    // Sync with URL hash for shareable links (also on hashchange for SPA navigations)
    const syncFromHash = () => {
      const hash = window.location.hash.slice(1)
      if (hash === 'resources') {
        setView('resources')
        setActiveSectionId(null)
      } else if (hash === 'admin' && !IS_STATIC_SITE) {
        setView('admin')
        setActiveSectionId(null)
      } else if (hash === 'familiarity') {
        setView('familiarity')
        setActiveSectionId(null)
      } else if (hash === 'capstones') {
        setView('capstones')
        setActiveSectionId(null)
      } else if (hash === 'pricing' && !IS_STATIC_SITE) {
        setView('pricing')
        setActiveSectionId(null)
      } else if (hash === 'home' || hash === '') {
        setView('home')
        setActiveSectionId(null)
      } else {
        const [rawId, rawStep] = hash.split('/')
        const resolvedId = resolveCourseSectionId(rawId)
        const section = COURSE_SECTIONS.find((s) => s.id === resolvedId)
        if (section) {
          setActiveSectionId(section.id)
          setActiveSubStep(isSubStep(rawStep) ? rawStep : 'theory')
          setView('section')
        }
      }
    }

    syncFromHash()
    window.addEventListener('hashchange', syncFromHash)
    return () => {
      if (tourTimer !== undefined) window.clearTimeout(tourTimer)
      window.removeEventListener('hashchange', syncFromHash)
    }
  }, [])

  const updateUrl = (id: string | null, newView: View) => {
    if (typeof window === 'undefined') return
    const hash = newView === 'home' ? '' : newView === 'resources' ? 'resources' : newView === 'admin' ? 'admin' : newView === 'familiarity' ? 'familiarity' : newView === 'capstones' ? 'capstones' : id || ''
    const newUrl = hash ? `${window.location.pathname}#${hash}` : window.location.pathname
    window.history.replaceState(null, '', newUrl)
  }

  const handleSelectSection = (id: string, subStep?: SubStep) => {
    // Snapshot scroll of the section we are leaving so return can resume.
    if (
      typeof window !== 'undefined' &&
      activeSectionId &&
      activeSectionId !== id
    ) {
      sessionStorage.setItem(
        `pyarcana:sectionScroll:${activeSectionId}`,
        String(window.scrollY || 0),
      )
    }
    if (id === '__resources__') {
      setActiveSectionId(null)
      setView('resources')
      updateUrl(null, 'resources')
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } else {
      // Accept both slug IDs ("setup") and S## IDs ("S04") from the capstones
      // catalog gateSection field. Map S## to the section with matching index.
      const resolvedId = resolveCourseSectionId(id)
      const nextStep: SubStep = isSubStep(subStep) ? subStep : 'theory'
      setActiveSectionId(resolvedId)
      setActiveSubStep(nextStep)
      setView('section')
      updateUrl(resolvedId, 'section')
      // Scroll restore/top is handled by SectionView on section.id change.
      // Force top only when opening a section with no registered offset.
      if (typeof window !== 'undefined') {
        const saved = sessionStorage.getItem(`pyarcana:sectionScroll:${resolvedId}`)
        if (saved == null || Number(saved) <= 0) {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }
    }
    setSidebarOpen(false)
  }

  const handleHome = () => {
    if (typeof window !== 'undefined' && activeSectionId) {
      sessionStorage.setItem(
        `pyarcana:sectionScroll:${activeSectionId}`,
        String(window.scrollY || 0),
      )
    }
    setView('home')
    setActiveSectionId(null)
    updateUrl(null, 'home')
    setSidebarOpen(false)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleOpenAuth = (tab: 'login' | 'register' = 'login') => {
    setAuthTab(tab)
    setAuthOpen(true)
  }

  const handleRepeatTour = () => {
    try {
      localStorage.removeItem(PYARCANA_TOUR_STORAGE_KEY)
    } catch {
      // ignore
    }
    setTourOpen(true)
  }

  const activeSection = useMemo(
    () => COURSE_SECTIONS.find((s) => s.id === activeSectionId) || null,
    [activeSectionId]
  )

  const activeIndex = activeSection
    ? COURSE_SECTIONS.findIndex((s) => s.id === activeSection.id)
    : -1

  return (
    <div className="flex min-h-screen bg-background">
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} defaultTab={authTab} />
      <Glossary open={glossaryOpen} onClose={() => setGlossaryOpen(false)} />
      {!IS_STATIC_SITE && <FeedbackFab sectionId={activeSectionId} />}
      {!IS_STATIC_SITE && <PdfReport open={pdfReportOpen} onClose={() => setPdfReportOpen(false)} />}
      <InteractiveTour
        open={tourOpen}
        onClose={() => setTourOpen(false)}
        onNavigate={(target, sectionId, subStep) => {
          if (target === 'capstones') {
            setView('capstones')
            updateUrl(null, 'capstones')
          } else if (target === 'resources') {
            setView('resources')
            updateUrl(null, 'resources')
          } else if (target === 'home') {
            setView('home')
            updateUrl(null, 'home')
          } else if (target === 'section' && sectionId) {
            handleSelectSection(sectionId, subStep)
          }
        }}
      />

      {/* Sidebar — desktop */}
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-sidebar-border lg:block">
        <Sidebar
          sections={COURSE_SECTIONS}
          activeSectionId={activeSectionId}
          onSelectSection={handleSelectSection}
          onHome={handleHome}
          view={view}
        />
      </aside>

      {/* Sidebar — mobile drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-sidebar-border bg-sidebar lg:hidden"
            >
              <Sidebar
                sections={COURSE_SECTIONS}
                activeSectionId={activeSectionId}
                onSelectSection={handleSelectSection}
                onHome={handleHome}
                view={view}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="shrink-0 lg:hidden"
            aria-label={tr('nav.menu')}
          >
            <Menu className="h-5 w-5" />
          </Button>
          {/* min-w-0 + truncate: at 320px the brand must give way rather than
              push the control cluster past the edge of the viewport. */}
          <button onClick={handleHome} className="flex min-w-0 items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg gradient-primary text-xs font-bold text-white">
              Py
            </div>
            <span className="truncate text-sm font-bold" style={{ fontFamily: 'var(--font-display)' }}>PyArcana</span>
          </button>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => { setView('capstones'); updateUrl(null, 'capstones') }}
              className="h-9 w-9"
              aria-label={tr('nav.capstones')}
              data-testid="nav-capstones"
              title={tr('nav.capstones')}
            >
              <Boxes className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setGlossaryOpen(true)}
              className="h-9 w-9"
              aria-label={tr('nav.glossary')}
              data-testid="nav-glossary"
            >
              <BookOpen className="h-4 w-4" />
            </Button>
            {!IS_STATIC_SITE && session?.user && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPdfReportOpen(true)}
                className="h-9 w-9"
                aria-label={tr('nav.reports')}
              >
                <FileText className="h-4 w-4" />
              </Button>
            )}
            <ThemeToggle mounted={mounted} theme={theme} setTheme={setTheme} />
            <LanguageToggle />
            <UserMenu onOpenAuth={() => handleOpenAuth('login')} />
          </div>
        </header>

        {/* Desktop top bar */}
        {/*
          gap-2 and min-w-0: at exactly 1024px -- the lg breakpoint, so this bar
          appears at its tightest -- the section title on the left and the
          control cluster on the right came to 1067px and pushed the whole page
          into a horizontal scroll. Neither side could shrink, because a flex
          child defaults to min-width:auto. The title gives way now; the
          controls do not.
        */}
        <header className="sticky top-0 z-20 hidden items-center justify-between gap-2 border-b border-border bg-background/70 px-6 py-3 backdrop-blur lg:flex">
          <div className="flex min-w-0 items-center gap-3">
            {view !== 'home' && (
              <Button variant="ghost" size="sm" onClick={handleHome} className="gap-1.5">
                <ArrowLeft className="h-4 w-4" />
                {tr('nav.back')}
              </Button>
            )}
            <div className="min-w-0 truncate text-sm text-muted-foreground">
              {view === 'home' && tr('nav.home')}
              {view === 'resources' && tr('nav.resources')}
              {view === 'capstones' && (
                <span className="flex items-center gap-1">
                  <Boxes className="h-3.5 w-3.5 text-primary" />
                  <span className="text-primary font-medium">{tr('nav.capstones')}</span>
                </span>
              )}
              {view === 'admin' && (
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  <span className="text-primary font-medium">{tr('admin.title')}</span>
                </span>
              )}
              {view === 'section' && activeSection && (
                <span>
                  {lang === 'en' ? 'Section' : 'Sección'} {activeSection.index} · <span className="text-foreground">{activeSection.shortTitle}</span>
                </span>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {/* Capstones / Projects view */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setView('capstones'); updateUrl(null, 'capstones') }}
              className="gap-1.5"
              data-testid="nav-capstones"
              title={tr('nav.capstones')}
            >
              <Boxes className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{tr('nav.capstones')}</span>
            </Button>
            {/* Familiarity Dashboard — VP feature */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setView('familiarity'); updateUrl(null, 'familiarity') }}
              className="gap-1.5"
              title="Familiarity Score Dashboard"
            >
              <Network className="h-3.5 w-3.5 text-gold" />
              <span className="hidden sm:inline">Familiarity</span>
            </Button>
            {/* Admin link — only for admins */}
            {!IS_STATIC_SITE && session?.user?.role === 'ADMIN' && view !== 'admin' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setView('admin'); updateUrl(null, 'admin') }}
                className="gap-1.5"
                data-testid="nav-admin"
                title={tr('nav.admin')}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{tr('nav.admin')}</span>
              </Button>
            )}
            {/* Pricing — always visible */}
            {!IS_STATIC_SITE && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setView('pricing'); updateUrl(null, 'pricing') }}
                className="gap-1.5"
                title="Planes y precios"
              >
                <CreditCard className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Planes</span>
              </Button>
            )}
            {/* Glossary — available to everyone */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setGlossaryOpen(true)}
              className="gap-1.5"
              data-testid="glossary-open"
              title="Glosario (Cmd+K)"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{tr('nav.glossary')}</span>
            </Button>
            {/* PDF report — only for logged-in users */}
            {!IS_STATIC_SITE && session?.user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPdfReportOpen(true)}
                className="gap-1.5"
                title="Reportes y certificados"
              >
                <FileText className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{tr('nav.reports')}</span>
              </Button>
            )}
            <a
              href="https://github.com/PillB/pyarcana"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">{tr('nav.repository')}</span>
            </a>
            <ThemeToggle mounted={mounted} theme={theme} setTheme={setTheme} />
            <LanguageToggle />
            <UserMenu onOpenAuth={() => handleOpenAuth('login')} />
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={view + (activeSectionId || '')}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {view === 'home' && (
                <Dashboard
                  meta={COURSE_META}
                  sections={COURSE_SECTIONS}
                  onSelectSection={handleSelectSection}
                  onOpenAuth={handleOpenAuth}
                />
              )}
              {view === 'resources' && (
                <ResourcesPage
                  sections={COURSE_SECTIONS.map((s) => ({
                    id: s.id,
                    title: s.title,
                    shortTitle: s.shortTitle,
                    resources: s.resources,
                  }))}
                />
              )}
              {!IS_STATIC_SITE && view === 'admin' && <AdminDashboard />}
              {view === 'familiarity' && <FamiliarityDashboard />}
              {view === 'capstones' && (
                <CapstonesPage onOpenSection={handleSelectSection} />
              )}
              {!IS_STATIC_SITE && view === 'pricing' && (
                <PricingPage
                  isAuthenticated={!!session?.user}
                  onOpenAuth={() => handleOpenAuth('login')}
                  onSelectPlan={async (planCode, cycle, country) => {
                    try {
                      const res = await fetch('/api/subscription/checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ planCode, billingCycle: cycle, country }),
                      })
                      const data = await res.json()
                      if (data.redirectUrl) {
                        window.location.hash = data.redirectUrl.replace('/#', '')
                        setView('section')
                      }
                    } catch {
                      // silent fail in test mode
                    }
                  }}
                />
              )}
              {view === 'section' && activeSection && (
                <SectionView
                  section={activeSection}
                  activeSubStep={activeSubStep}
                  onActiveSubStepChange={setActiveSubStep}
                  hasPrev={activeIndex > 0}
                  hasNext={activeIndex < COURSE_SECTIONS.length - 1}
                  onPrev={() => activeIndex > 0 && handleSelectSection(COURSE_SECTIONS[activeIndex - 1].id)}
                  onNext={() =>
                    activeIndex < COURSE_SECTIONS.length - 1 &&
                    handleSelectSection(COURSE_SECTIONS[activeIndex + 1].id)
                  }
                  onOpenAuth={() => handleOpenAuth('login')}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-border bg-muted/30 py-6">
          <div className="mx-auto max-w-6xl px-4 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
            <p>
              {tr('footer.tagline')}
            </p>
            <p className="mt-1">
              {tr('footer.method')} · interfaz es-PE, es-ES y English · lecciones en español peruano / lessons in Peruvian Spanish
            </p>
            <p className="mt-3 flex items-center justify-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRepeatTour}
                className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
                data-testid="tour-restart"
                title={tr('tour.restart')}
              >
                <RotateCcw className="h-3 w-3" />
                {tr('tour.restart')}
              </Button>
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

function ThemeToggle({
  mounted,
  theme,
  setTheme,
}: {
  mounted: boolean
  theme: string | undefined
  setTheme: (t: string) => void
}) {
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        data-testid="theme-toggle"
        aria-label="Cambiar tema"
      >
        <Sun className="h-4 w-4" />
      </Button>
    )
  }
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="h-9 w-9"
      data-testid="theme-toggle"
      aria-label="Cambiar tema"
      title="Cambiar tema"
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}
