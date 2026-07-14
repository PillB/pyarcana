'use client'

import { useState, useRef, useEffect } from 'react'
import { Globe, Check, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n, LANGUAGES } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function LanguageToggle() {
  const [open, setOpen] = useState(false)
  const { lang, setLang } = useI18n()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0]

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(!open)}
        className="gap-1.5"
        title="Cambiar idioma"
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="text-base leading-none">{current.flag}</span>
        <ChevronDown className={cn('h-3 w-3 transition-transform', open && 'rotate-180')} />
      </Button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-44 overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code)
                setOpen(false)
              }}
              className={cn(
                'flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-accent',
                lang === l.code && 'bg-accent/50'
              )}
            >
              <span className="text-base">{l.flag}</span>
              <span className="flex-1 text-left">{l.label}</span>
              {lang === l.code && <Check className="h-3.5 w-3.5 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
