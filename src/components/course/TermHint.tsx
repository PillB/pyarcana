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
 * Uses popover surface (cream/ink) + olive title accent to match site design
 * and keep WCAG AA contrast vs the tooltip background.
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
            'inline cursor-help border-b border-dotted border-primary/70 bg-transparent p-0 font-inherit text-inherit',
            'decoration-primary/70 underline-offset-2',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
            className
          )}
          aria-label={`${term.term}: ${definition}`}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        sideOffset={6}
        className={cn(
          // Override default bg-primary chip → popover card (design language)
          '!bg-popover !text-popover-foreground border border-border shadow-md',
          'max-w-xs space-y-1.5 rounded-lg p-3 text-left text-balance',
          // Arrow matches popover
          '**:data-[slot=tooltip-arrow]:!bg-popover **:data-[slot=tooltip-arrow]:!fill-popover **:data-[slot=tooltip-arrow]:border-border'
        )}
        data-testid={`term-tooltip-${term.id}`}
      >
        <div
          className="border-l-2 border-primary pl-2 text-xs font-semibold text-foreground"
          data-term-hint-role="title"
        >
          <span className="text-primary">{term.term}</span>
        </div>
        <p
          className="text-xs leading-relaxed text-popover-foreground"
          data-term-hint-role="body"
        >
          {definition}
        </p>
        <p
          className="text-[11px] leading-snug text-muted-foreground"
          data-term-hint-role="meta"
        >
          {lang === 'en' ? 'Introduced in' : 'Introducido en'}: {introduced}
        </p>
      </TooltipContent>
    </Tooltip>
  )
}
