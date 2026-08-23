'use client'

import { FIG, FigSvg, FigText } from '../Figure'

/**
 * S36 — why a shuffled split is the wrong instrument for a series.
 *
 * Rolling-origin validation is a procedure, and procedures described in prose
 * become lists of steps the reader follows without seeing the shape. The shape
 * is the point: the training window only ever grows backwards from the fold's
 * own origin, and no fold is ever asked to predict a day it has already seen.
 */
export function S36RollingOrigin({ title }: { title: string }) {
  const x0 = 108
  const x1 = 526
  const span = x1 - x0
  const folds = [
    { train: 0.36, test: 0.50, y: 78 },
    { train: 0.50, test: 0.64, y: 118 },
    { train: 0.64, test: 0.78, y: 158 },
  ]
  const h = 24

  return (
    <FigSvg title={title} viewBox={`0 0 ${FIG.width} 226`}>
      <FigText x={20} y={22} anchor="start" weight={600}>
        Cada pliegue entrena con su pasado y predice su futuro
      </FigText>
      <FigText x={20} y={44} anchor="start" size={FIG.microSize} fill="var(--muted-foreground)">
        Ningún pliegue ve un día que ya tuvo que predecir.
      </FigText>

      {folds.map((f, i) => (
        <g key={i}>
          <FigText x={20} y={f.y + h / 2} anchor="start" size={FIG.microSize} mono fill="var(--muted-foreground)">
            {`pliegue ${i + 1}`}
          </FigText>
          <rect x={x0} y={f.y} width={span * f.train} height={h} rx={FIG.radius}
                fill="var(--chart-2)" fillOpacity={0.22} stroke="var(--chart-2)" strokeWidth={FIG.stroke} />
          <rect x={x0 + span * f.train} y={f.y} width={span * (f.test - f.train)} height={h} rx={FIG.radius}
                fill="var(--chart-4)" fillOpacity={0.3} stroke="var(--chart-4)" strokeWidth={FIG.stroke} />
          {/* everything after this fold's test window is simply not available yet */}
          <rect x={x0 + span * f.test} y={f.y} width={span * (1 - f.test)} height={h} rx={FIG.radius}
                fill="none" stroke="var(--border)" strokeWidth={FIG.stroke} strokeDasharray="4 4" />
        </g>
      ))}

      <line x1={x0} y1={192} x2={x1} y2={192} stroke="var(--border)" strokeWidth={FIG.stroke} />
      <FigText x={20} y={192} anchor="start" size={FIG.microSize} fill="var(--muted-foreground)">
        tiempo
      </FigText>

      <g>
        <rect x={x0} y={206} width={16} height={11} rx={2} fill="var(--chart-2)" fillOpacity={0.22} stroke="var(--chart-2)" strokeWidth={FIG.stroke} />
        <FigText x={x0 + 22} y={212} anchor="start" size={FIG.microSize} fill="var(--muted-foreground)">entrena</FigText>
        <rect x={x0 + 96} y={206} width={16} height={11} rx={2} fill="var(--chart-4)" fillOpacity={0.3} stroke="var(--chart-4)" strokeWidth={FIG.stroke} />
        <FigText x={x0 + 118} y={212} anchor="start" size={FIG.microSize} fill="var(--muted-foreground)">valida</FigText>
        <rect x={x0 + 190} y={206} width={16} height={11} rx={2} fill="none" stroke="var(--border)" strokeWidth={FIG.stroke} strokeDasharray="3 3" />
        <FigText x={x0 + 212} y={212} anchor="start" size={FIG.microSize} fill="var(--muted-foreground)">aún no ocurrió</FigText>
      </g>
    </FigSvg>
  )
}
