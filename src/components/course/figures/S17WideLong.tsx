'use client'

import { FIG, FigSvg, FigText, FigArrow, FigArrowDefs } from '../Figure'

/**
 * S17 — the same three numbers, in two shapes.
 *
 * The register calls this the highest-value unbuilt figure and it is easy to
 * see why: "wide" and "long" name layouts, and a layout is the one thing prose
 * cannot show. A learner who has only read the definitions can recite them and
 * still not recognise which one they are holding.
 *
 * The cells carry the same values in both panels on purpose. Nothing is added
 * or lost by reshaping — only where each number sits.
 */
export function S17WideLong({ title }: { title: string }) {
  const cell = { w: 66, h: 26 }
  const wideX = 26
  const longX = 330
  const top = 84

  const wideHead = ['region', 'ene', 'feb']
  const wideRows = [
    ['Lima', '60', '55'],
    ['Cusco', '10', '12'],
  ]
  const longHead = ['region', 'mes', 'monto']
  const longRows = [
    ['Lima', 'ene', '60'],
    ['Lima', 'feb', '55'],
    ['Cusco', 'ene', '10'],
    ['Cusco', 'feb', '12'],
  ]

  const table = (
    x: number,
    head: string[],
    rows: string[][],
    tint: string,
  ) => (
    <g>
      {head.map((hLabel, c) => (
        <g key={`h${c}`}>
          <rect x={x + c * cell.w} y={top} width={cell.w} height={cell.h}
                fill={tint} fillOpacity={0.7} stroke="var(--muted-foreground)" strokeWidth={FIG.stroke} />
          <FigText x={x + c * cell.w + cell.w / 2} y={top + cell.h / 2} size={FIG.microSize} weight={600} mono>
            {hLabel}
          </FigText>
        </g>
      ))}
      {rows.map((r, ri) =>
        r.map((v, c) => (
          <g key={`${ri}-${c}`}>
            <rect x={x + c * cell.w} y={top + (ri + 1) * cell.h} width={cell.w} height={cell.h}
                  fill="var(--card)" stroke="var(--muted-foreground)" strokeWidth={FIG.stroke} />
            <FigText x={x + c * cell.w + cell.w / 2} y={top + (ri + 1) * cell.h + cell.h / 2}
                     size={FIG.microSize} mono
                     fill={c === 2 ? 'var(--foreground)' : 'var(--muted-foreground)'}>
              {v}
            </FigText>
          </g>
        )),
      )}
    </g>
  )

  return (
    <FigSvg title={title} viewBox={`0 0 ${FIG.width} 250`}>
      <FigArrowDefs id="s17-arrow" />
      <FigText x={20} y={22} anchor="start" weight={600}>
        Los mismos cuatro números, en dos formas
      </FigText>
      <FigText x={20} y={44} anchor="start" size={FIG.microSize} fill="var(--muted-foreground)">
        Reshape no calcula nada: solo mueve dónde vive cada valor.
      </FigText>

      <FigText x={wideX} y={68} anchor="start" size={FIG.microSize} weight={600} fill="var(--fig-2)">
        wide — un mes por columna
      </FigText>
      {table(wideX, wideHead, wideRows, 'var(--fig-2)')}

      <FigText x={longX} y={68} anchor="start" size={FIG.microSize} weight={600} fill="var(--fig-4)">
        long — un valor por fila
      </FigText>
      {table(longX, longHead, longRows, 'var(--fig-4)')}

      <FigArrow x1={244} y1={150} x2={314} y2={150} markerId="s17-arrow" />
      <FigText x={279} y={136} size={FIG.microSize} mono fill="var(--muted-foreground)">
        melt
      </FigText>
      <FigText x={279} y={168} size={FIG.microSize} mono fill="var(--muted-foreground)">
        pivot
      </FigText>

      <FigText x={20} y={238} anchor="start" size={FIG.microSize} fill="var(--muted-foreground)">
        Long es la forma que agrupa y grafica; wide es la que se lee de un vistazo.
      </FigText>
    </FigSvg>
  )
}
