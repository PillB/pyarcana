'use client'

import { motion } from 'framer-motion'
import { FIG, FigSvg, FigText, FigStepButton, useFigureSteps } from '../../Figure'
import { INK, outsideFences, tintOf, type NumberLineData, type NumberLinePoint, wrapLines } from './types'

/**
 * Values on one number line, a span over them, and the lines they are judged against.
 *
 * Built for S16's quartiles and Tukey fences, which is the shape a boxplot draws. In prose
 * the learner has to hold three numbers (Q1, Q3, the IQR) and two derived from them (the
 * fences) before asking which values fall outside, and by then the values themselves have
 * scrolled away. Drawn, each value is a dot, the middle half is a band, and "outside" is
 * which side of a fence a dot sits on.
 *
 * Three states, each readable standing still: the values, then the band, then the fences
 * with every value beyond them ringed. The ring and the dashed fence carry the verdict in
 * shape, not colour, because the chart tints are not contrast-safe for an edge (INK).
 */
export function NumberLineFigure({ title, data }: { title: string; data: NumberLineData }) {
  const headLines = wrapLines(data.headline, FIG.width - 48, 8.2)
  const headBlock = (headLines.length - 1) * 20
  const noteLines = data.note ? wrapLines(data.note, FIG.width - 48) : []
  const fences = data.fences ?? []
  const stages = 1 + (data.band ? 1 : 0) + (fences.length ? 1 : 0)
  const { step, next, reset, transition, isLast } = useFigureSteps(stages)
  const bandShown = !!data.band && step >= 1
  const fencesShown = fences.length > 0 && step >= stages - 1 && step > 0

  // The axis starts after its own label, so a longer label never runs into the first dot.
  const x0 = 24 + Math.ceil(data.axisLabel.length * 7.4) + 16
  const x1 = FIG.width - 24
  const below = data.points.some((p) => p.at < data.from)
  const above = data.points.some((p) => p.at > data.to)
  // A broken axis: values off the scale sit in a 40px bay past a break mark.
  const xa = below ? x0 + 44 : x0
  const xb = above ? x1 - 44 : x1
  const sx = (v: number) => xa + ((v - data.from) / (data.to - data.from)) * (xb - xa)
  // Points beyond the domain get a bay past the axis break; a fence or a band edge has no
  // bay, and unclamped it lands off the canvas with nothing failing. Clamped it stays
  // visible at the end of the axis, and figure-geometry.test.ts fails the data that needs it.
  const sxOnAxis = (v: number) => sx(Math.min(Math.max(v, data.from), data.to))
  const xOf = (p: NumberLinePoint) => (p.at < data.from ? x0 + 14 : p.at > data.to ? x1 - 14 : sx(p.at))

  // Equal values stack upward; off-scale values stack in their bay.
  const stackKey = (p: NumberLinePoint) => (p.at < data.from ? 'low' : p.at > data.to ? 'high' : String(p.at))
  const depth = new Map<string, number>()
  const placed = data.points.map((p) => {
    const k = stackKey(p)
    const level = depth.get(k) ?? 0
    depth.set(k, level + 1)
    return { p, level, key: k }
  })
  const tallest = Math.max(1, ...depth.values())

  const bandLabelY = 70 + headBlock
  const valueY = bandLabelY + 26
  const axisY = valueY + 22 + (tallest - 1) * 12
  const edgeLabelY = axisY + 26
  const fenceLabelY = axisY + 50
  const height = fenceLabelY + 22 + (noteLines.length ? 12 + noteLines.length * 18 : 0)

  const outside = (p: NumberLinePoint) => outsideFences(p.at, fences)
  // One label over each stack, not one per dot. An off-scale bay can hold different values,
  // so its label names each of them.
  const labelled = [...depth.keys()].map((key) => {
    const members = placed.filter((q) => q.key === key)
    const text = [...new Set(members.map(({ p }) => p.display ?? String(p.at)))].join(' · ')
    return { key, p: members[0].p, text, out: members.some(({ p }) => outside(p)) }
  })

  const breakMark = (x: number) => (
    <g>
      <line x1={x - 5} y1={axisY + 7} x2={x + 1} y2={axisY - 7} stroke={INK.outline} strokeWidth={FIG.stroke} />
      <line x1={x + 1} y1={axisY + 7} x2={x + 7} y2={axisY - 7} stroke={INK.outline} strokeWidth={FIG.stroke} />
    </g>
  )

  return (
    <div>
      <FigSvg title={title} viewBox={`0 0 ${FIG.width} ${height}`}>
        {headLines.map((l, i) => (
          <FigText key={l} x={24} y={26 + i * 20} anchor="start" weight={600}>
            {l}
          </FigText>
        ))}

        {data.band ? (
          <motion.g initial={false} animate={{ opacity: bandShown ? 1 : 0.18 }} transition={transition}>
            <rect
              x={sxOnAxis(data.band.from)}
              y={valueY + 10}
              width={sxOnAxis(data.band.to) - sxOnAxis(data.band.from)}
              height={axisY - valueY + 2}
              fill={tintOf(data.band.tint ?? 2)}
              fillOpacity={INK.tintFillOpacity}
              stroke={INK.outline}
              strokeWidth={FIG.stroke}
            />
            <FigText x={(sxOnAxis(data.band.from) + sxOnAxis(data.band.to)) / 2} y={bandLabelY} size={FIG.microSize} weight={600} fill={INK.label}>
              {data.band.label}
            </FigText>
            {data.band.fromLabel ? (
              <FigText x={sxOnAxis(data.band.from) - 4} y={edgeLabelY} anchor="end" size={FIG.microSize} mono fill={INK.muted}>
                {data.band.fromLabel}
              </FigText>
            ) : null}
            {data.band.toLabel ? (
              <FigText x={sxOnAxis(data.band.to) + 4} y={edgeLabelY} anchor="start" size={FIG.microSize} mono fill={INK.muted}>
                {data.band.toLabel}
              </FigText>
            ) : null}
          </motion.g>
        ) : null}

        <line x1={x0} y1={axisY} x2={x1} y2={axisY} stroke={INK.outline} strokeWidth={FIG.stroke} />
        {below ? breakMark(x0 + 30) : null}
        {above ? breakMark(x1 - 34) : null}
        <FigText x={24} y={axisY} anchor="start" size={FIG.microSize} fill={INK.muted}>
          {data.axisLabel}
        </FigText>

        {fences.map((f) => (
          <motion.g key={`${f.label}-${f.at}`} initial={false} animate={{ opacity: fencesShown ? 1 : 0.18 }} transition={transition}>
            <line x1={sxOnAxis(f.at)} y1={valueY + 4} x2={sxOnAxis(f.at)} y2={fenceLabelY - 12} stroke={INK.label} strokeWidth={FIG.strokeBold} strokeDasharray="6 4" />
            <FigText x={sxOnAxis(f.at)} y={fenceLabelY} size={FIG.microSize} weight={600} fill={INK.label}>
              {f.label}
            </FigText>
          </motion.g>
        ))}

        {placed.map(({ p, level }, i) => {
          const cx = xOf(p)
          const cy = axisY - level * 12
          const ringed = fencesShown && outside(p)
          return (
            <g key={`${p.at}-${i}`}>
              <circle cx={cx} cy={cy} r={5} fill={tintOf(p.tint)} stroke={INK.label} strokeWidth={1} />
              {ringed ? <circle cx={cx} cy={cy} r={9.5} fill="none" stroke={INK.label} strokeWidth={FIG.strokeBold} /> : null}
            </g>
          )
        })}
        {labelled.map(({ key, p, text, out }) => (
          <FigText key={`v-${key}`} x={xOf(p)} y={valueY} size={FIG.microSize} mono weight={fencesShown && out ? 700 : 400} fill={INK.label}>
            {text}
          </FigText>
        ))}

        {noteLines.map((l, i) => (
          <FigText key={l} x={24} y={fenceLabelY + 34 + i * 18} anchor="start" size={FIG.microSize} fill={INK.muted}>
            {l}
          </FigText>
        ))}
      </FigSvg>

      <FigStepButton onClick={isLast ? reset : next}>{isLast ? 'Reiniciar' : 'Siguiente'}</FigStepButton>
    </div>
  )
}
