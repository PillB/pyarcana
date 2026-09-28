'use client'

import Link from 'next/link'
import { Lock, ShieldCheck } from 'lucide-react'

/**
 * "Where is your progress stored?" on the Dashboard, moved out of Dashboard() verbatim so the
 * signed-in source (useIsSignedIn: NextAuth or the cloud account) adds no branch to a function
 * already far over the complexity ceiling.
 */
export function ProgressStorageNotice({ isSignedIn, english }: { isSignedIn: boolean; english: boolean }) {
  if (!isSignedIn) {
    return (
      <div
        className="mt-6 max-w-2xl rounded-xl border border-gold/50 bg-background/75 px-4 py-3 text-xs text-foreground/80 backdrop-blur"
        data-testid="progress-storage-notice"
      >
        <div className="flex items-start gap-2">
          <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
          <div className="space-y-1">
            <p>
              <strong>{english ? 'Where is your progress stored?' : '¿Dónde se guarda tu progreso?'}</strong>{' '}
              {english
                ? 'Right now, only in this browser (localStorage — esto es, una base de datos interna del navegador que tú controlas).'
                : 'Por ahora, solo en este navegador (localStorage — esto es, una base de datos interna del navegador que tú controlas).'}
            </p>
            <p>
              {english
                ? 'If you create an account, your progress also syncs to our servers so you can resume on another device. We do not sell or share your data.'
                : 'Si creas una cuenta, tu progreso también se sincroniza con nuestros servidores para que puedas retomarlo en otro dispositivo. No vendemos ni compartimos tus datos.'}{' '}
              <Link
                href="/privacy"
                className="font-medium text-foreground underline-offset-2 hover:underline"
              >
                {english ? 'Read the Privacy Notice' : 'Lee el Aviso de Privacidad'}
              </Link>{' '}
              ·{' '}
              <Link
                href="/cookies"
                className="font-medium text-foreground underline-offset-2 hover:underline"
              >
                {english ? 'Local-storage notice' : 'Aviso de almacenamiento local'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }
  return (
      <div
        className="mt-6 max-w-2xl rounded-xl border border-emerald-500/40 bg-emerald-500/5 px-4 py-3 text-xs text-foreground/80"
        data-testid="progress-storage-notice"
      >
        <div className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-300" />
          <div className="space-y-1">
            <p>
              <strong>{english ? 'Signed in' : 'Sesión iniciada'}</strong>{' '}
              {english
                ? '— your progress is syncing to your cloud account, so it follows you across devices.'
                : '— tu progreso se está sincronizando con tu cuenta en la nube, así te sigue entre dispositivos.'}
            </p>
            <p>
              {english
                ? 'Browser-local progress remains the fast first read; the cloud copy is the source of truth when you switch devices.'
                : 'El progreso del navegador sigue siendo la lectura rápida inicial; la copia en la nube es la fuente de verdad cuando cambias de dispositivo.'}{' '}
              <Link
                href="/data-rights"
                className="font-medium text-foreground underline-offset-2 hover:underline"
              >
                {english ? 'Manage your data' : 'Gestiona tus datos'}
              </Link>
            </p>
          </div>
        </div>
      </div>
  )
}
