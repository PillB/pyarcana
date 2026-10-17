import { IS_STATIC_SITE } from '@/lib/runtime-mode'

/**
 * One paragraph for the badge notice, shown only in the dynamic LMS: it is the one edition that has
 * section exams, so the static builds (GitHub Pages and the pyarcana.dev build with accounts) show
 * nothing. `isStaticSite` defaults to the build's own value; the prop is there so a test can ask
 * both editions.
 */
export function ExamGradingNote({ isStaticSite = IS_STATIC_SITE }: { isStaticSite?: boolean }) {
  if (isStaticSite) return null
  return (
    <p data-testid="exam-grading-note">
      A diferencia de «Hecho», el servidor califica cada examen de sección y genera tu puntuación. Tu navegador no calcula ni puede cambiar esa puntuación.
    </p>
  )
}
