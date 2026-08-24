'use client'

import { FIG, FigSvg, FigText } from '../Figure'
import { INK } from './archetypes/types'

/**
 * S46 — two clocks, and the gap between them.
 *
 * The section's worked timeline is the hardest paragraph in it, and this
 * campaign's independent review found a real defect there: the text labelled
 * events that were not in the stream and called an event late that had helped
 * establish the watermark. Both confusions come from the same source — prose
 * has to serialise two time axes that the reader needs to see at once.
 *
 * Drawn, the distinction is immediate. The horizontal axis is *event time*:
 * when the thing happened. The dots sit where each event happened; the arrows
 * show when it arrived. An event can arrive after the watermark has already
 * passed its timestamp, and that is the whole definition of late.
 */
export function S46EventTime({ title }: { title: string }) {
  const x0 = 74
  const x1 = 512
  // event-time domain 92..124
  const sx = (t: number) => x0 + ((t - 92) / 32) * (x1 - x0)
  const wm = 110
  const grace = 5

  const arrivals = [
    { t: 112, y: 96, label: 'ON_TIME', tint: 'var(--fig-2)' },
    { t: 105, y: 138, label: 'ALLOWED_LATE', tint: 'var(--fig-4)' },
    { t: 100, y: 180, label: 'LATE', tint: 'var(--fig-5)' },
  ]

  return (
    <FigSvg title={title} viewBox={`0 0 ${FIG.width} 250`}>
      <FigText x={20} y={22} anchor="start" weight={600}>
        El watermark no es una hora del reloj: es una promesa
      </FigText>
      <FigText x={20} y={44} anchor="start" size={FIG.microSize} fill="var(--muted-foreground)">
        El stream [100, 108, 115] con lag 5 lo fija en 110.
      </FigText>

      {/* the grace band sits behind everything it explains */}
      <rect
        x={sx(wm - grace)}
        y={64}
        width={sx(wm) - sx(wm - grace)}
        height={148}
        fill="var(--fig-4)"
        fillOpacity={0.55}
      />

      {/* watermark line */}
      <line x1={sx(wm)} y1={64} x2={sx(wm)} y2={212} stroke="var(--fig-1)" strokeWidth={FIG.strokeBold} />
      <FigText x={sx(wm)} y={226} size={FIG.microSize} fill="var(--fig-1)" weight={600}>
        watermark 110
      </FigText>
      <FigText x={sx(wm - grace) - 4} y={226} size={FIG.microSize} anchor="end" fill="var(--muted-foreground)">
        gracia 5
      </FigText>

      {/* event-time axis */}
      <line x1={x0} y1={212} x2={x1} y2={212} stroke="var(--muted-foreground)" strokeWidth={FIG.stroke} />
      <FigText x={20} y={200} anchor="start" size={FIG.microSize} fill="var(--muted-foreground)">
        event time
      </FigText>

      {arrivals.map((a) => (
        <g key={a.label}>
          <circle cx={sx(a.t)} cy={a.y} r={5} fill={a.tint} />
          {/* arrival: every one of these lands after the watermark was set */}
          <line
            x1={sx(a.t)}
            y1={a.y}
            x2={x1 - 6}
            y2={a.y}
            stroke={INK.outline}
            strokeWidth={FIG.stroke}
            strokeDasharray="4 4"
          />
          <FigText x={sx(a.t)} y={a.y - 18} size={FIG.microSize} mono fill={a.tint}>
            {a.t}
          </FigText>
          {/* Labels live in the left margin: at the right edge "ALLOWED_LATE"
              ran past the 560 canvas and was clipped at every viewport. */}
          <FigText x={20} y={a.y} anchor="start" size={FIG.microSize} fill={a.tint} weight={600}>
            {a.label}
          </FigText>
        </g>
      ))}
    </FigSvg>
  )
}
