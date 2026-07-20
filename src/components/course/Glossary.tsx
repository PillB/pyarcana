'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, BookOpen, X, ChevronRight, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { GLOSSARY_TERMS, type GlossaryCategory } from '@/lib/glossary'

interface GlossaryEntry {
  term: string
  category: GlossaryCategory
  definition: string
  example?: string
  related?: string[]
}

const GLOSSARY: GlossaryEntry[] = GLOSSARY_TERMS.map((t) => ({
  term: t.term,
  category: t.category,
  definition: t.definition,
  example: t.example,
  related: t.related,
}))

const CATEGORIES: GlossaryEntry['category'][] = ['Python', 'Data Science', 'NumPy', 'Pandas', 'ML', 'Tooling']

const CATEGORY_COLORS: Record<GlossaryEntry['category'], string> = {
  Python: 'bg-violet-500/10 text-violet-600 border-violet-500/30',
  'Data Science': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
  NumPy: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
  Pandas: 'bg-green-500/10 text-green-600 border-green-500/30',
  ML: 'bg-rose-500/10 text-rose-600 border-rose-500/30',
  Tooling: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
}

interface GlossaryProps {
  open: boolean
  onClose: () => void
}

export function Glossary({ open, onClose }: GlossaryProps) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<GlossaryEntry['category'] | 'all'>('all')
  const [selectedTerm, setSelectedTerm] = useState<GlossaryEntry | null>(null)

  // Keyboard shortcut: Cmd/Ctrl+K to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (open) {
          const input = document.getElementById('glossary-search') as HTMLInputElement
          input?.focus()
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return GLOSSARY.filter((entry) => {
      const matchesQuery =
        !q ||
        entry.term.toLowerCase().includes(q) ||
        entry.definition.toLowerCase().includes(q) ||
        entry.category.toLowerCase().includes(q)
      const matchesCategory = activeCategory === 'all' || entry.category === activeCategory
      return matchesQuery && matchesCategory
    }).sort((a, b) => a.term.localeCompare(b.term))
  }, [query, activeCategory])

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-hidden p-0">
        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Glosario Python DS
            <Badge variant="secondary" className="ml-2 text-[10px]">
              {GLOSSARY.length} términos
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Search bar */}
        <div className="border-b border-border px-6 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="glossary-search"
              placeholder="Buscar término, definición o categoría... (Cmd+K)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category filters */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveCategory('all')}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                activeCategory === 'all'
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:bg-accent'
              )}
            >
              Todos
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  activeCategory === cat
                    ? CATEGORY_COLORS[cat]
                    : 'border-border hover:bg-accent'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[55vh] overflow-y-auto scroll-area-thin px-6 py-4">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No se encontraron términos para "{query}"
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {filtered.map((entry) => (
                  <motion.div
                    key={entry.term}
                    layout
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Card
                      className="cursor-pointer border-border/60 p-3 transition-all hover:border-primary/30 hover:shadow-card-hover"
                      onClick={() => setSelectedTerm(entry)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">{entry.term}</span>
                            <span
                              className={cn(
                                'rounded-full border px-2 py-0.5 text-[10px] font-medium',
                                CATEGORY_COLORS[entry.category]
                              )}
                            >
                              {entry.category}
                            </span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                            {entry.definition}
                          </p>
                        </div>
                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Detail dialog */}
        <AnimatePresence>
          {selectedTerm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 bg-background/95 backdrop-blur"
              onClick={() => setSelectedTerm(null)}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="mx-auto mt-20 max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold gradient-text">{selectedTerm.term}</h2>
                    <span
                      className={cn(
                        'mt-1 inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium',
                        CATEGORY_COLORS[selectedTerm.category]
                      )}
                    >
                      {selectedTerm.category}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedTerm(null)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-foreground/90">
                  {selectedTerm.definition}
                </p>

                {selectedTerm.example && (
                  <div className="mt-4">
                    <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                      <Lightbulb className="h-3.5 w-3.5" />
                      EJEMPLO
                    </div>
                    <pre className="code-block code-block-dark overflow-x-auto rounded-lg p-4 text-xs">
                      <code>{selectedTerm.example}</code>
                    </pre>
                  </div>
                )}

                {selectedTerm.related && selectedTerm.related.length > 0 && (
                  <div className="mt-4">
                    <div className="mb-2 text-xs font-semibold text-muted-foreground">
                      TÉRMINOS RELACIONADOS
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedTerm.related.map((r) => {
                        const related = GLOSSARY.find((g) => g.term === r)
                        if (!related) return null
                        return (
                          <button
                            key={r}
                            onClick={() => setSelectedTerm(related)}
                            className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs hover:border-primary/30 hover:bg-accent"
                          >
                            {r}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
