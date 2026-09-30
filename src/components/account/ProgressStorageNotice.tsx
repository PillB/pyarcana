'use client'

import Link from 'next/link'
import { Lock, ShieldCheck } from 'lucide-react'
import { useCloudStage } from '@/lib/cloud/hooks'
import { storageNoticeKeys } from '@/lib/cloud/ui-state'
import { IS_STATIC_SITE } from '@/lib/runtime-mode'
import { useSyncUi } from './runtime'
import { useText } from './text'

/**
 * "Where is your progress stored?" on the Dashboard, moved out of Dashboard() verbatim so the
 * signed-in source (useIsSignedIn: NextAuth or the cloud account) adds no branch to a function
 * already far over the complexity ceiling.
 */
export function ProgressStorageNotice({ isSignedIn, english }: { isSignedIn: boolean; english: boolean }) {
  const { tr } = useText()
  const stage = useCloudStage()
  const syncStatus = useSyncUi((s) => s.status)
  // Only what is true here (storageNoticeKeys): no account promise where the stage-off notice
  // says there are none, and "saved in your account" only after a sync succeeded.
  const [line] = storageNoticeKeys({ signedIn: isSignedIn, isStaticSite: IS_STATIC_SITE, stage, syncStatus })
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
              {line && `${tr(line)} `}
              {english ? 'We do not sell or share your data.' : 'No vendemos ni compartimos tus datos.'}{' '}
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
              {tr(line ?? 'storage.signedIn.notYet')}
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
