'use client'

import { FIG, FigSvg, FigText } from '../Figure'

/**
 * S18 — the same estimate, with and without its uncertainty.
 *
 * The section's thesis is "un número sin su incertidumbre es media respuesta",
 * and prose cannot show why: a single number looks equally trustworthy either
 * way. Drawn on one axis, the two samples that report the same average clearly
 * do not support the same conclusion.
 */
export function S18Interval({ title }: { title: string }) {
  const axisY = 178
  const x0 = 60
  const x1 = 500
  // domain 0..40 soles mapped onto the axis
  const sx = (v: number) => x0 + (v / 40) * (x1 - x0)

  const rows = [
    { label: 'n = 400', mean: 24, lo: 22.6, hi: 25.4, y: 74, tint: 'var(--chart-2)' },
    { label: 'n = 12', mean: 24, lo: 14.8, hi: 33.2, y: 122, tint: 'var(--chart-4)' },
  ]

  return (
    <FigSvg title={title} viewBox={`0 0 ${FIG.width} 226`}>
      <FigText x={20} y={22} anchor="start" weight={600}>
        Las dos muestras informan el mismo promedio: 24 soles
      </FigText>
      <FigText x={20} y={44} anchor="start" size={FIG.microSize} fill="var(--muted-foreground)">
        Solo el intervalo dice cuánto puedes apoyarte en él.
      </FigText>

      {rows.map((r) => (
        <g key={r.label}>
          <FigText x={20} y={r.y + 8} anchor="start" size={FIG.microSize} mono fill={r.tint}>
            {r.label}
          </FigText>

          {/* the interval */}
          <line
            x1={sx(r.lo)}
            y1={r.y + 8}
            x2={sx(r.hi)}
            y2={r.y + 8}
            stroke={r.tint}
            strokeWidth={FIG.strokeBold}
          />
          {[r.lo, r.hi].map((v) => (
            <line
              key={v}
              x1={sx(v)}
              y1={r.y}
              x2={sx(v)}
              y2={r.y + 16}
              stroke={r.tint}
              strokeWidth={FIG.strokeBold}
            />
          ))}
          <circle cx={sx(r.mean)} cy={r.y + 8} r={5} fill={r.tint} />

          <FigText
            x={sx(r.hi) + 10}
            y={r.y + 8}
            anchor="start"
            size={FIG.microSize}
            fill="var(--muted-foreground)"
          >
            {`±${((r.hi - r.lo) / 2).toFixed(1)}`}
          </FigText>
        </g>
      ))}

      {/* axis */}
      <line x1={x0} y1={axisY} x2={x1} y2={axisY} stroke="var(--border)" strokeWidth={FIG.stroke} />
      {[0, 10, 20, 30, 40].map((v) => (
        <g key={v}>
          <line
            x1={sx(v)}
            y1={axisY}
            x2={sx(v)}
            y2={axisY + 6}
            stroke="var(--border)"
            strokeWidth={FIG.stroke}
          />
          <FigText x={sx(v)} y={axisY + 20} size={FIG.microSize} fill="var(--muted-foreground)">
            {v === 40 ? '40 soles' : v}
          </FigText>
        </g>
      ))}
      <FigText x={20} y={214} anchor="start" size={FIG.microSize} fill="var(--muted-foreground)">
        Con n = 12 el promedio real podría ser 15 o 33.
      </FigText>
    </FigSvg>
  )
}
