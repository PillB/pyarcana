import type { Metadata } from 'next'
import CourseShell from '../page'

export const metadata: Metadata = {
  title: 'Sesión 0: prepara tu computadora · PyArcana',
  description:
    'Antes de la Sección 1: abre la terminal, instala Python 3.12, Git y VS Code, crea tu cuenta de GitHub y comprueba que todo responde. Paso a paso, para Windows, macOS y Linux.',
}

/**
 * Sesión 0, outside the 52 sections on purpose (audit/session-0/DESIGN.md §1): free, open
 * without signing in, and invisible to every count, gate and badge that assumes sections 1–52.
 *
 * Outside the sections is not outside the course: until 25 Nov 2026 this page rendered
 * <SetupIntro /> alone, so /empezar had no header, no menu, no theme or language switch, and
 * looked like another site (Pablo: "you lose the header and other navigation"). It now renders the
 * course shell, which reads this path and opens on Sesión 0 (src/app/page.tsx).
 */
export default function Page() {
  return <CourseShell />
}
