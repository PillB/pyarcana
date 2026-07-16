'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Moon, Sun, Github, ArrowLeft, ShieldCheck, BookOpen, FileText, Network, CreditCard } from 'lucide-react'
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
import { PdfReport } from '@/components/course/PdfReport'
import { LanguageToggle } from '@/components/course/LanguageToggle'
import { PricingPage } from '@/components/course/PricingPage'
import { FamiliarityDashboard } from '@/components/course/FamiliarityDashboard'
import { useServerProgressSync } from '@/lib/progress-store'
import { COURSE_META, COURSE_SECTIONS } from '@/lib/course'

type View = 'home' | 'section' | 'resources' | 'admin' | 'familiarity' | 'pricing'

export default function Home() {
  const [view, setView] = useState<View>('home')
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login')
  const [glossaryOpen, setGlossaryOpen] = useState(false)
  const [pdfReportOpen, setPdfReportOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)

  // Sync progress from server when user is logged in
  useServerProgressSync()

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
    // Sync with URL hash for shareable links
    const hash = window.location.hash.slice(1)
    if (hash === 'resources') {

      setView('resources')
    } else if (hash === 'admin') {

      setView('admin')
    } else if (hash === 'familiarity') {

      setView('familiarity')
    } else if (hash === 'pricing') {

      setView('pricing')
    } else if (hash === 'home' || hash === '') {

      setView('home')
    } else {
      const section = COURSE_SECTIONS.find((s) => s.id === hash)
      if (section) {

        setActiveSectionId(hash)

        setView('section')
      }
    }
  }, [])

  const updateUrl = (id: string | null, newView: View) => {
    if (typeof window === 'undefined') return
    const hash = newView === 'home' ? '' : newView === 'resources' ? 'resources' : newView === 'admin' ? 'admin' : newView === 'familiarity' ? 'familiarity' : id || ''
    const newUrl = hash ? `${window.location.pathname}#${hash}` : window.location.pathname
    window.history.replaceState(null, '', newUrl)
  }

  const handleSelectSection = (id: string) => {
    if (id === '__resources__') {
      setView('resources')
      updateUrl(null, 'resources')
    } else {
      setActiveSectionId(id)
      setView('section')
      updateUrl(id, 'section')
    }
    setSidebarOpen(false)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleHome = () => {
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
      <PdfReport open={pdfReportOpen} onClose={() => setPdfReportOpen(false)} />

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
            className="lg:hidden"
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <button onClick={handleHome} className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-primary text-xs font-bold text-white">
              Py
            </div>
            <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-display)' }}>El Arte de Python</span>
          </button>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setGlossaryOpen(true)}
              className="h-9 w-9"
              aria-label="Glosario"
            >
              <BookOpen className="h-4 w-4" />
            </Button>
            {session?.user && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPdfReportOpen(true)}
                className="h-9 w-9"
                aria-label="Reportes"
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
        <header className="sticky top-0 z-20 hidden items-center justify-between border-b border-border bg-background/70 px-6 py-3 backdrop-blur lg:flex">
          <div className="flex items-center gap-3">
            {view !== 'home' && (
              <Button variant="ghost" size="sm" onClick={handleHome} className="gap-1.5">
                <ArrowLeft className="h-4 w-4" />
                Inicio
              </Button>
            )}
            <div className="text-sm text-muted-foreground">
              {view === 'home' && 'Dashboard'}
              {view === 'resources' && 'Recursos'}
              {view === 'admin' && (
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  <span className="text-primary font-medium">Panel de Administración</span>
                </span>
              )}
              {view === 'section' && activeSection && (
                <span>
                  Sección {activeSection.index} · <span className="text-foreground">{activeSection.shortTitle}</span>
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
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
            {session?.user?.role === 'ADMIN' && view !== 'admin' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setView('admin'); updateUrl(null, 'admin') }}
                className="gap-1.5"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            )}
            {/* Pricing — always visible */}
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
            {/* Glossary — available to everyone */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setGlossaryOpen(true)}
              className="gap-1.5"
              title="Glosario (Cmd+K)"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Glosario</span>
            </Button>
            {/* PDF report — only for logged-in users */}
            {session?.user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPdfReportOpen(true)}
                className="gap-1.5"
                title="Reportes y certificados"
              >
                <FileText className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reportes</span>
              </Button>
            )}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">Repositorio</span>
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
              {view === 'admin' && <AdminDashboard />}
              {view === 'familiarity' && <FamiliarityDashboard />}
              {view === 'pricing' && (
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
              El Arte de Python · Curso online autónomo de Python para Data Analyst / Data Scientist
            </p>
            <p className="mt-1">
              Método I Do / We Do / You Do · 13 secciones · Exámenes con anti-plagio · Español peruano
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
      <Button variant="ghost" size="icon" className="h-9 w-9">
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
      aria-label="Cambiar tema"
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}
