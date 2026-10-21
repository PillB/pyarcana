'use client'

/**
 * The way to the product's own, current guide. After a picture it says why: the screen may have
 * changed since the picture was made. The link text names the guide (WCAG 2.4.4) and says it
 * opens elsewhere, because it leaves PyArcana.
 */
export function OfficialGuide({ guide, afterPicture }: { guide: { label: string; url: string }; afterPicture: boolean }) {
  const link = (
    <a href={guide.url} target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-2 hover:text-foreground" data-testid="setup-guide-link">
      {guide.label}
      <span className="sr-only"> (se abre en otra pestaña)</span>
    </a>
  )
  return (
    <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground" data-testid="setup-guide">
      {afterPicture ? 'La pantalla puede haber cambiado un poco con el tiempo. Para ver la versión más reciente, consulta ' : 'Si quieres más detalles, consulta '}
      {link}.
    </p>
  )
}
