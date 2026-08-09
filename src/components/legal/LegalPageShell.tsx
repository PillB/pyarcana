/**
 * LegalPageShell — shared layout for legal/trust pages.
 *
 * Solarized copy principles (Stephen Fry redaction):
 *   - Every page starts with a plain-language summary, then expands into the
 *     legal detail. Jargon is unpacked inline with "esto es, …".
 *   - Each page declares its version and effective date so a reader can tell
 *     which revision they are looking at.
 *   - Pages link back to the main app and to related legal pages so a learner
 *     can navigate without losing context.
 *   - Semantic HTML: a single <h1>, then <h2> sections. The container is
 *     accessible by keyboard and screen-reader friendly.
 */

import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowLeft, FileWarning, ScrollText } from 'lucide-react'

export interface LegalPageMeta {
  /** URL slug, e.g. "privacy" */
  slug: string
  /** Page title shown in <h1> and document metadata */
  title: string
  /** Short subtitle under the title */
  subtitle: string
  /** Semantic version string, e.g. "1.0.0" */
  version: string
  /** ISO date when this revision became effective */
  effectiveDate: string
  /** Optional English summary for bilingual readers */
  englishSummary?: string
}

const RELATED_PAGES: { slug: string; label: string }[] = [
  { slug: 'privacy', label: 'Privacidad' },
  { slug: 'terms', label: 'Términos de uso' },
  { slug: 'cookies', label: 'Cookies y almacenamiento local' },
  { slug: 'disclaimer', label: 'Aviso educativo y laboral' },
  { slug: 'badge-notice', label: 'Aviso de badges' },
  { slug: 'external-resources', label: 'Recursos externos' },
  { slug: 'acceptable-use', label: 'Uso aceptable' },
  { slug: 'data-rights', label: 'Derechos ARCO' },
  { slug: 'security', label: 'Seguridad' },
]

export function LegalPageShell({
  meta,
  children,
}: {
  meta: LegalPageMeta
  children: ReactNode
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8" data-testid={`legal-page-${meta.slug}`}>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al curso
      </Link>

      <header className="mt-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-accent/5 px-3 py-1 text-xs text-foreground/80">
          <FileWarning className="h-3 w-3 text-gold" />
          Documento legal · v{meta.version} · vigente desde {meta.effectiveDate}
        </div>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
          <span className="gradient-text">{meta.title}</span>
        </h1>
        <p className="font-subdisplay mt-2 text-lg text-foreground/80" style={{ fontFamily: 'var(--font-subdisplay)' }}>
          {meta.subtitle}
        </p>
        {meta.englishSummary && (
          <p className="mt-3 rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
            <strong>English summary:</strong> {meta.englishSummary}
          </p>
        )}
      </header>

      <ScrollText className="mt-8 h-6 w-6 text-muted-foreground" aria-hidden />

      <article className="mt-4 space-y-6 text-sm leading-relaxed text-foreground/90">
        {children}
      </article>

      {/* Related legal pages */}
      <nav className="mt-12 rounded-xl border border-border bg-muted/30 p-5" aria-label="Otros documentos legales">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Otros documentos legales
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {RELATED_PAGES.filter((p) => p.slug !== meta.slug).map((p) => (
            <li key={p.slug}>
              <Link
                href={`/${p.slug}`}
                className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground/80 hover:border-primary/40 hover:text-foreground"
              >
                {p.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <footer className="mt-8 text-center text-xs text-muted-foreground">
        <p>
          PyArcana · v{meta.version} · {meta.effectiveDate} · Este documento es material educativo y
          no constituye asesoría legal. Para tu caso particular, consulta con un profesional acreditado.
        </p>
      </footer>
    </main>
  )
}
