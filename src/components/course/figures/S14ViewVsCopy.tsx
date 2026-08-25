'use client'

import { motion } from 'framer-motion'
import {
  FIG,
  FigSvg,
  FigBox,
  FigText,
  FigArrow,
  FigArrowDefs,
  FigStepButton,
  useFigureSteps,
} from '../Figure'

/**
 * S14 — a view shares memory, a copy does not.
 *
 * A static picture can only *assert* that writing through a view changes the
 * original. Here the learner performs the write and watches the shared cell
 * change in place while the copy stays put — the claim becomes an observation.
 *
 * Two states only, each readable while still: before the write, and after.
 */
export function S14ViewVsCopy({ title }: { title: string }) {
  const { step, next, reset, transition, reduced } = useFigureSteps(2)
  const written = step === 1

  const cell = 40
  const baseX = 190
  const baseY = 66
  const copyY = 214
  // index 2 is the cell the view writes through
  const base = ['10', '20', written ? '99' : '30', '40']
  const copy = ['10', '20', '30', '40']

  return (
    <div>
      <FigSvg title={title} viewBox={`0 0 ${FIG.width} 268`}>
        <FigArrowDefs id="s14-arrow" />

        <FigText x={baseX + (cell * 4) / 2} y={26} weight={600}>
          Un solo bloque en memoria
        </FigText>

        {base.map((v, i) => {
          const active = i === 2 && written
          return (
            <g key={i}>
              <motion.rect
                x={baseX + i * cell}
                y={baseY}
                width={cell}
                height={cell}
                rx={FIG.radius}
                fill={active ? 'var(--fig-4)' : 'var(--muted)'}
                stroke="var(--muted-foreground)"
                strokeWidth={FIG.stroke}
                animate={{ scale: active ? 1.06 : 1 }}
                style={{ transformOrigin: `${baseX + i * cell + cell / 2}px ${baseY + cell / 2}px` }}
                transition={transition}
              />
              <FigText
                x={baseX + i * cell + cell / 2}
                y={baseY + cell / 2}
                mono
                fill={active ? 'var(--card)' : 'var(--foreground)'}
              >
                {v}
              </FigText>
            </g>
          )
        })}

        {/* the original name */}
        <FigText x={30} y={baseY + cell / 2} anchor="start" mono weight={600}>
          arr
        </FigText>
        <FigArrow
          x1={72}
          y1={baseY + cell / 2}
          x2={baseX - 8}
          y2={baseY + cell / 2}
          markerId="s14-arrow"
        />

        {/* the view */}
        <FigText x={30} y={150} anchor="start" mono weight={600} fill="var(--fig-2)">
          vista
        </FigText>
        <FigText x={30} y={168} anchor="start" size={FIG.microSize} fill="var(--muted-foreground)">
          arr[1:3]
        </FigText>
        <FigArrow
          x1={92}
          y1={150}
          x2={baseX + cell + 20}
          y2={baseY + cell + 6}
          markerId="s14-arrow"
          stroke="var(--fig-2)"
        />
        <FigText
          x={364}
          y={baseY + cell / 2}
          anchor="start"
          size={FIG.microSize}
          fill="var(--fig-2)"
        >
          {written ? 'el original cambió' : 'escribir en la vista'}
        </FigText>
        <FigText
          x={364}
          y={baseY + cell / 2 + 17}
          anchor="start"
          size={FIG.microSize}
          fill="var(--fig-2)"
        >
          {written ? 'sin tocar arr' : 'cambia el original'}
        </FigText>

        {/* the copy — unchanged, on purpose */}
        <FigText x={baseX + (cell * 4) / 2} y={196} weight={600} fill="var(--fig-1)">
          Copia: otro bloque distinto
        </FigText>
        {copy.map((v, i) => (
          <g key={`c${i}`}>
            <FigBox
              x={baseX + i * cell}
              y={copyY}
              w={cell}
              h={cell}
              fill="var(--card)"
              stroke="var(--fig-1)"
              dashed
            />
            <FigText x={baseX + i * cell + cell / 2} y={copyY + cell / 2} mono>
              {v}
            </FigText>
          </g>
        ))}
        <FigText x={30} y={234} anchor="start" mono weight={600} fill="var(--fig-1)">
          copia
        </FigText>
        <FigText x={30} y={252} anchor="start" size={FIG.microSize} fill="var(--muted-foreground)">
          .copy()
        </FigText>
        <FigArrow
          x1={96}
          y1={234}
          x2={baseX - 8}
          y2={234}
          markerId="s14-arrow"
          stroke="var(--fig-1)"
          dashed
        />
      </FigSvg>

      <FigStepButton onClick={written ? reset : next} data-testid="s14-step">
        {written ? 'Reiniciar' : 'Ejecutar  vista[1] = 99'}
      </FigStepButton>
      <span className="ml-3 text-[13px] text-muted-foreground">
        {written
          ? 'La copia sigue en 30: nunca compartió memoria.'
          : reduced
            ? 'Pulsa para escribir a través de la vista.'
            : 'Escribe a través de la vista y observa el bloque de arriba.'}
      </span>
    </div>
  )
}
