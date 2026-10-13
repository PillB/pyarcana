import type { Metadata } from 'next'
import { SetupIntro } from '@/components/setup/SetupIntro'

export const metadata: Metadata = {
  title: 'Sesión 0: prepara tu computadora · PyArcana',
  description:
    'Antes de la Sección 1: abre la terminal, instala Python 3.12, Git y VS Code, crea tu cuenta de GitHub y comprueba que todo responde. Paso a paso, para Windows, macOS y Linux.',
}

/**
 * Sesión 0, outside the 52 sections on purpose (audit/session-0/DESIGN.md §1): free, open
 * without signing in, and invisible to every count, gate and badge that assumes sections 1–52.
 */
export default function Page() {
  return <SetupIntro />
}
