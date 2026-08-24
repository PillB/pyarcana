'use client'

import { FIG, FigSvg, FigBox, FigText, FigArrow, FigArrowDefs } from '../Figure'

/**
 * S05 — the function as a window: what it demands, what it guarantees.
 *
 * The prose says "una ventanilla: recibe algo, realiza una tarea acotada y
 * entrega un comprobante", then teaches pre- and postconditions separately.
 * The figure puts the promise on the outside of the box and the rule inside,
 * which is the distinction the section keeps asking about: what the caller can
 * rely on without reading the body.
 *
 * Widths are worked out so the row ends at 540 of a 560 canvas:
 *   16 + 140  = 156   demands
 *   176 + 176 = 352   body
 *   400 + 140 = 540   guarantees
 */
export function S05ContractWindow({ title }: { title: string }) {
  const bodyX = 176
  const bodyW = 176
  const boxY = 78
  const bodyH = 84
  const sideW = 140
  const sideY = boxY + 6
  const sideH = 70
  const rightX = 400
  const midY = boxY + bodyH / 2

  return (
    <FigSvg title={title} viewBox={`0 0 ${FIG.width} 236`}>
      <FigArrowDefs id="s05-arrow" />

      <FigText x={FIG.width / 2} y={24} weight={600}>
        Quien llama solo necesita leer los bordes
      </FigText>

      {/* what it demands */}
      <FigBox x={16} y={sideY} w={sideW} h={sideH} fill="var(--card)" stroke="var(--fig-1)" />
      <FigText x={86} y={sideY + 18} size={FIG.microSize} weight={600} fill="var(--fig-1)">
        Exige
      </FigText>
      <FigText x={86} y={sideY + 38} size={FIG.microSize} mono>
        texto no vacío
      </FigText>
      <FigText x={86} y={sideY + 56} size={FIG.microSize} fill="var(--muted-foreground)">
        precondición
      </FigText>
      <FigArrow x1={160} y1={midY} x2={bodyX - 6} y2={midY} markerId="s05-arrow" />

      {/* the body — deliberately opaque */}
      <FigBox x={bodyX} y={boxY} w={bodyW} h={bodyH} fill="var(--muted)" stroke="var(--muted-foreground)" />
      <FigText x={bodyX + bodyW / 2} y={boxY + 30} mono weight={600}>
        normalize_email
      </FigText>
      <FigText
        x={bodyX + bodyW / 2}
        y={boxY + 58}
        size={FIG.microSize}
        fill="var(--muted-foreground)"
      >
        la regla vive aquí dentro
      </FigText>

      {/* what it guarantees */}
      <FigArrow x1={bodyX + bodyW + 6} y1={midY} x2={rightX - 6} y2={midY} markerId="s05-arrow" />
      <FigBox x={rightX} y={sideY} w={sideW} h={sideH} fill="var(--card)" stroke="var(--fig-2)" />
      <FigText
        x={rightX + sideW / 2}
        y={sideY + 18}
        size={FIG.microSize}
        weight={600}
        fill="var(--fig-2)"
      >
        Garantiza
      </FigText>
      <FigText x={rightX + sideW / 2} y={sideY + 38} size={FIG.microSize} mono>
        minúsculas
      </FigText>
      <FigText x={rightX + sideW / 2} y={sideY + 56} size={FIG.microSize} mono>
        o ValueError
      </FigText>

      <FigText x={FIG.width / 2} y={196} size={FIG.microSize} fill="var(--muted-foreground)">
        Si la promesa cambia, cambia el contrato — no solo el cuerpo.
      </FigText>
      <FigText x={FIG.width / 2} y={220} size={FIG.microSize} mono fill="var(--muted-foreground)">
        f(f(x)) == f(x)
      </FigText>
    </FigSvg>
  )
}
