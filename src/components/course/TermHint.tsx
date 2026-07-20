'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { findGlossaryTerm, sectionTitle } from '@/lib/glossary'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface TermHintProps {
  termIdOrAlias: string
  children: React.ReactNode
  className?: string
}

/**
 * Accessible hover/focus definition chip for course jargon.
 */
export function TermHint({ termIdOrAlias, children, className }: TermHintProps) {
  const lang = useI18n((s) => s.lang)
  const term = findGlossaryTerm(termIdOrAlias)
  if (!term) {
    return <span className={className}>{children}</span>
  }

  const definition =
    lang === 'en' && term.definitionEn ? term.definitionEn : term.definition
  const introduced = sectionTitle(term.firstSectionId)

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <button
          type="button"
          data-testid={`term-hint-${term.id}`}
          className={cn(
            'inline cursor-help border-b border-dotted border-primary/50 bg-transparent p-0 font-inherit text-inherit',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
            className
          )}
          aria-label={`${term.term}: ${definition}`}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="max-w-xs space-y-1 p-3 text-left"
        data-testid={`term-tooltip-${term.id}`}
      >
        <div className="text-xs font-semibold text-primary">{term.term}</div>
        <p className="text-xs leading-relaxed text-popover-foreground">{definition}</p>
        <p className="text-[10px] text-muted-foreground">
          {lang === 'en' ? 'Introduced in' : 'Introducido en'}: {introduced}
        </p>
      </TooltipContent>
    </Tooltip>
  )
}
