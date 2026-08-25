'use client'

import { FIG, FigSvg, FigBox, FigText, FigArrow, FigArrowDefs } from '../Figure'

/**
 * S01 — cwd and PATH answer two different questions.
 *
 * The prose asks the beginner to hold both at once: "«¿en qué habitación
 * estoy?» y «¿dónde busca el sistema los programas?»". They are constantly
 * confused because both are "paths". Drawn apart, with one arrow pointing at a
 * place and the other at a search order, they stop being the same thing.
 */
export function S01CwdPath({ title }: { title: string }) {
  const colW = 250
  const leftX = 20
  const rightX = 290
  const topY = 66

  return (
    <FigSvg title={title} viewBox={`0 0 ${FIG.width} 244`}>
      <FigArrowDefs id="s01-arrow" />

      {/* left: cwd — a place */}
      <FigText x={leftX} y={24} anchor="start" mono weight={600} fill="var(--fig-1)">
        cwd
      </FigText>
      <FigText x={leftX} y={44} anchor="start" size={FIG.microSize}>
        ¿En qué carpeta estoy parado?
      </FigText>
      <FigBox x={leftX} y={topY} w={colW} h={132} fill="var(--card)" stroke="var(--fig-1)" />
      {['proyectos/', '  informe/', '    datos.csv'].map((line, i) => (
        <FigText
          key={i}
          x={leftX + 16}
          y={topY + 26 + i * 26}
          anchor="start"
          size={FIG.microSize}
          mono
          fill={i === 1 ? 'var(--fig-1)' : 'var(--muted-foreground)'}
          weight={i === 1 ? 600 : 400}
        >
          {line}
        </FigText>
      ))}
      <FigArrow
        x1={leftX + 200}
        y1={topY + 92}
        x2={leftX + 132}
        y2={topY + 56}
        markerId="s01-arrow"
        stroke="var(--fig-1)"
      />
      <FigText
        x={leftX + 208}
        y={topY + 98}
        anchor="start"
        size={FIG.microSize}
        fill="var(--fig-1)"
      >
        aquí
      </FigText>

      {/* right: PATH — an order of search */}
      <FigText x={rightX} y={24} anchor="start" mono weight={600} fill="var(--fig-2)">
        PATH
      </FigText>
      <FigText x={rightX} y={44} anchor="start" size={FIG.microSize}>
        ¿Dónde busca el sistema `python`?
      </FigText>
      {['/usr/local/bin', '/usr/bin', '.venv/bin'].map((p, i) => (
        <g key={p}>
          <FigBox
            x={rightX}
            y={topY + i * 44}
            w={colW}
            h={34}
            fill="var(--card)"
            stroke={i === 2 ? 'var(--fig-2)' : 'var(--muted-foreground)'}
          />
          <FigText
            x={rightX + 12}
            y={topY + i * 44 + 17}
            anchor="start"
            size={FIG.microSize}
            mono
            fill={i === 2 ? 'var(--fig-2)' : 'var(--muted-foreground)'}
          >
            {`${i + 1}. ${p}`}
          </FigText>
        </g>
      ))}

      <FigText x={FIG.width / 2} y={230} size={FIG.microSize} fill="var(--muted-foreground)">
        Uno es un lugar. El otro es un orden de búsqueda.
      </FigText>
    </FigSvg>
  )
}
