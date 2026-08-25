'use client'

import { FIG, FigSvg, FigText } from '../Figure'

/**
 * S32 — the boundary, and the feature that reaches across it.
 *
 * Leakage is the section's central idea and the one prose describes worst,
 * because the failure is *geometric*: a window that extends past a line. Told
 * in words it sounds like a rule to memorise; drawn, it is obvious that the
 * rolling mean computed over the whole series has already read the test half.
 *
 * The bottom row is the same feature computed correctly. The only difference
 * is where the window stops, which is exactly the thing worth seeing.
 */
export function S32Leakage({ title }: { title: string }) {
  const x0 = 30
  const x1 = 530
  const cut = x0 + (x1 - x0) * 0.62

  const row = (y: number) => ({ y, h: 30 })
  const bad = row(96)
  const good = row(168)

  return (
    <FigSvg title={title} viewBox={`0 0 ${FIG.width} 244`}>
      <FigText x={20} y={22} anchor="start" weight={600}>
        La fuga no es una regla: es una ventana que cruza la línea
      </FigText>

      {/* the split boundary, drawn once, full height */}
      <line x1={cut} y1={44} x2={cut} y2={212} stroke="var(--fig-1)" strokeWidth={FIG.strokeBold} />
      <FigText x={cut - 6} y={58} anchor="end" size={FIG.microSize} fill="var(--muted-foreground)">
        train
      </FigText>
      <FigText x={cut + 6} y={58} anchor="start" size={FIG.microSize} fill="var(--muted-foreground)">
        test
      </FigText>
      <FigText x={cut} y={206} size={FIG.microSize} fill="var(--fig-1)" weight={600}>
        corte temporal
      </FigText>

      {/* leaking feature: the window spans the cut */}
      <rect x={x0} y={bad.y} width={x1 - x0} height={bad.h} rx={FIG.radius}
            fill="var(--fig-5)" fillOpacity={0.7} stroke="var(--fig-5)" strokeWidth={FIG.stroke} />
      <FigText x={20} y={bad.y - 16} anchor="start" size={FIG.microSize} fill="var(--fig-5)" weight={600}>
        media móvil sobre toda la serie
      </FigText>
      <FigText x={(cut + x1) / 2} y={bad.y + bad.h / 2} size={FIG.microSize} fill="var(--fig-5)">
        ya leyó el futuro
      </FigText>

      {/* correct feature: the window stops at the cut */}
      <rect x={x0} y={good.y} width={cut - x0} height={good.h} rx={FIG.radius}
            fill="var(--fig-2)" fillOpacity={0.7} stroke="var(--fig-2)" strokeWidth={FIG.stroke} />
      <FigText x={20} y={good.y - 16} anchor="start" size={FIG.microSize} fill="var(--fig-2)" weight={600}>
        media móvil calculada solo hasta el corte
      </FigText>

      <FigText x={20} y={228} anchor="start" size={FIG.microSize} fill="var(--muted-foreground)">
        Mismo feature, misma fórmula. Cambia dónde termina la ventana.
      </FigText>
    </FigSvg>
  )
}
