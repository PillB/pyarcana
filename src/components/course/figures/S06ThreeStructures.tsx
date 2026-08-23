'use client'

import { FIG, FigSvg, FigBox, FigText } from '../Figure'

/**
 * S06 — three structures, three different questions.
 *
 * The prose opens with exactly this: "«¿en qué orden llegaron?», «¿dónde está
 * la ficha C002?» y «¿ya vimos este ID?»". Written out, the three answers
 * arrive one after another and read as three tools to memorise. Side by side,
 * they read as one decision — which question am I asking?
 */
export function S06ThreeStructures({ title }: { title: string }) {
  const cards = [
    {
      q: '¿en qué orden\nllegaron?',
      name: 'list',
      shape: 'seq' as const,
      tint: 'var(--chart-1)',
    },
    {
      q: '¿dónde está\nC002?',
      name: 'dict',
      shape: 'map' as const,
      tint: 'var(--chart-2)',
    },
    {
      q: '¿ya vimos\neste ID?',
      name: 'set',
      shape: 'set' as const,
      tint: 'var(--chart-3)',
    },
  ]
  const cardW = 164
  const gap = 18
  const startX = 12
  const cardY = 54
  const cardH = 168

  return (
    <FigSvg title={title} viewBox={`0 0 ${FIG.width} 240`}>
      <FigText x={FIG.width / 2} y={24} weight={600}>
        No compiten: cada una contesta una pregunta distinta
      </FigText>

      {cards.map((c, i) => {
        const x = startX + i * (cardW + gap)
        const cx = x + cardW / 2
        return (
          <g key={c.name}>
            <FigBox x={x} y={cardY} w={cardW} h={cardH} fill="var(--card)" stroke={c.tint} />

            {c.q.split('\n').map((line, li) => (
              <FigText key={li} x={cx} y={cardY + 22 + li * 17} size={FIG.microSize}>
                {line}
              </FigText>
            ))}

            {/* the shape that answers it */}
            {c.shape === 'seq' &&
              [0, 1, 2].map((k) => (
                <g key={k}>
                  <FigBox x={cx - 60 + k * 40} y={cardY + 74} w={34} h={30} fill="var(--muted)" />
                  <FigText x={cx - 60 + k * 40 + 17} y={cardY + 89} size={FIG.microSize} mono>
                    {k}
                  </FigText>
                </g>
              ))}

            {c.shape === 'map' &&
              ['C001', 'C002'].map((k, r) => (
                <g key={k}>
                  <FigBox x={cx - 64} y={cardY + 68 + r * 34} w={56} h={28} fill="var(--muted)" />
                  <FigText x={cx - 36} y={cardY + 82 + r * 34} size={FIG.microSize} mono>
                    {k}
                  </FigText>
                  <FigBox
                    x={cx + 6}
                    y={cardY + 68 + r * 34}
                    w={58}
                    h={28}
                    fill="var(--card)"
                    stroke={r === 1 ? c.tint : 'var(--border)'}
                  />
                  <FigText
                    x={cx + 35}
                    y={cardY + 82 + r * 34}
                    size={FIG.microSize}
                    mono
                    fill="var(--muted-foreground)"
                  >
                    ficha
                  </FigText>
                </g>
              ))}

            {c.shape === 'set' && (
              <>
                <circle
                  cx={cx}
                  cy={cardY + 92}
                  r={38}
                  fill="var(--muted)"
                  stroke={c.tint}
                  strokeWidth={FIG.stroke}
                />
                <FigText x={cx} y={cardY + 86} size={FIG.microSize} mono>
                  C001
                </FigText>
                <FigText x={cx} y={cardY + 103} size={FIG.microSize} mono>
                  C002
                </FigText>
              </>
            )}

            <FigText x={cx} y={cardY + cardH - 20} mono weight={600} fill={c.tint}>
              {c.name}
            </FigText>
          </g>
        )
      })}

      <FigText x={FIG.width / 2} y={234} size={FIG.microSize} fill="var(--muted-foreground)">
        Orden · acceso por clave · pertenencia
      </FigText>
    </FigSvg>
  )
}
