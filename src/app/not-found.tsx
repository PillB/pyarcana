import Link from 'next/link'
import { ArrowLeft, Home, Compass } from 'lucide-react'

/**
 * Custom 404 page.
 *
 * The default Next.js 404 has no navigation, so users landing on a missing
 * route under /pyarcana/<anything> had no in-page way back. This page gives
 * them clear paths home and to the main legal/resources pages.
 *
 * Rendered for both the static export (out/_not-found.html, out/404.html) and
 * any dynamic deployment. Uses next/link so basePath is applied automatically.
 */
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-gold/40 bg-accent/5">
        <Compass className="h-10 w-10 text-gold" />
      </div>

      <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
        Error 404
      </p>
      <h1
        className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Esta página se perdió en la arcana
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
        La ruta que buscas no existe, fue movida, o nunca existió. Puedes volver
        al inicio del curso o consultar los documentos legales y de recursos.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Home className="h-4 w-4" />
          Volver al inicio
        </Link>
        <Link
          href="/external-resources"
          className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Recursos externos
        </Link>
      </div>

      <nav
        aria-label="Enlaces a documentos legales"
        className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-muted-foreground"
      >
        <Link href="/privacy" className="underline-offset-2 hover:underline">Privacidad</Link>
        <span aria-hidden>·</span>
        <Link href="/terms" className="underline-offset-2 hover:underline">Términos</Link>
        <span aria-hidden>·</span>
        <Link href="/cookies" className="underline-offset-2 hover:underline">Cookies</Link>
        <span aria-hidden>·</span>
        <Link href="/credential-policy" className="underline-offset-2 hover:underline">Credenciales</Link>
        <span aria-hidden>·</span>
        <Link href="/verify" className="underline-offset-2 hover:underline">Verificar credencial</Link>
        <span aria-hidden>·</span>
        <Link href="/security" className="underline-offset-2 hover:underline">Seguridad</Link>
      </nav>
    </main>
  )
}
