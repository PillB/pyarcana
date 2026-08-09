/**
 * Small presentational helpers for legal pages.
 *
 * Using these consistently keeps every page readable: a heading, a body, and
 * optional bullet lists. No prose-style plugin needed.
 */

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function LegalSection({
  title,
  children,
  className,
}: {
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn('space-y-2', className)}>
      <h2 className="font-display text-xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
        {title}
      </h2>
      <div className="space-y-2 text-sm leading-relaxed text-foreground/90">{children}</div>
    </section>
  )
}

export function LegalParagraph({ children }: { children: ReactNode }) {
  return <p className="leading-relaxed text-foreground/90">{children}</p>
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-1 pl-5 text-foreground/90">
      {items.map((it, i) => (
        <li key={i} className="leading-relaxed">
          {it}
        </li>
      ))}
    </ul>
  )
}

export function LegalCallout({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="rounded-lg border border-gold/40 bg-accent/5 p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-gold">
        {title}
      </div>
      <div className="mt-1 text-sm leading-relaxed text-foreground/90">{children}</div>
    </div>
  )
}
