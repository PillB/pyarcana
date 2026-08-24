'use client'

import { FIG, FigSvg, FigBox, FigText } from '../Figure'

/**
 * S07 — "José" written two ways.
 *
 * Removes the prose sentence "una versión guarda la é como un solo carácter y
 * la otra como una e seguida de una tilde suelta". That sentence asks the
 * reader to hold two invisible byte layouts in mind and compare them. The
 * figure shows both at once: identical on screen, different underneath, which
 * is the entire reason the comparison returns False.
 */
export function S07NfcNfd({ title }: { title: string }) {
  const cell = 46
  const gap = 6
  const rowY = [70, 168]

  const rows = [
    {
      label: 'NFC',
      chars: ['J', 'o', 's', 'é'],
      count: '4 code points',
      tint: 'var(--fig-2)',
    },
    {
      label: 'NFD',
      chars: ['J', 'o', 's', 'e', '◌́'],
      count: '5 code points',
      tint: 'var(--fig-4)',
    },
  ]

  return (
    <FigSvg title={title} viewBox={`0 0 ${FIG.width} 250`}>
      {/* What the eye sees — stated once, above both rows */}
      <FigText x={FIG.width / 2} y={22} size={FIG.labelSize} weight={600}>
        En pantalla las dos dicen «José»
      </FigText>

      {rows.map((row, r) => {
        const startX = 132
        return (
          <g key={row.label}>
            <FigText x={26} y={rowY[r] + 22} anchor="start" weight={600} fill={row.tint}>
              {row.label}
            </FigText>

            {row.chars.map((ch, i) => {
              const x = startX + i * (cell + gap)
              const isAccent = ch === '◌́'
              return (
                <g key={i}>
                  <FigBox
                    x={x}
                    y={rowY[r]}
                    w={cell}
                    h={cell}
                    fill={isAccent ? 'var(--fig-4)' : 'var(--muted)'}
                    stroke={isAccent ? row.tint : 'var(--muted-foreground)'}
                  />
                  <FigText
                    x={x + cell / 2}
                    y={rowY[r] + cell / 2}
                    size={18}
                    mono
                    fill={isAccent ? 'var(--card)' : 'var(--foreground)'}
                  >
                    {ch}
                  </FigText>
                </g>
              )
            })}

            <FigText
              x={startX + row.chars.length * (cell + gap) + 6}
              y={rowY[r] + cell / 2}
              anchor="start"
              size={FIG.microSize}
              fill="var(--muted-foreground)"
            >
              {row.count}
            </FigText>
          </g>
        )
      })}

      {/* The consequence — the thing the learner is actually there to learn */}
      <FigText
        x={FIG.width / 2}
        y={232}
        size={FIG.labelSize}
        mono
        fill="var(--muted-foreground)"
      >
        {'"José" == "José"  →  False'}
      </FigText>
    </FigSvg>
  )
}
