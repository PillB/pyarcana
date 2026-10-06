'use client'

import type { StaticImageData } from 'next/image'
import { REUSE_LICENCES, formatCheckedOn, type ShotRecord, type ShotSpec } from '@/lib/setup/screenshots'

/**
 * One annotated, captioned, dated screenshot.
 *
 * Accessibility (WCAG 2.2 1.1.1, W3C WAI images tutorial): the alt says what is on screen,
 * including the words the learner must find, and the step's own text says the same thing, so a
 * reader who cannot see the picture loses no instruction. The box is drawn in SVG over the image
 * rather than baked in, and is decorative (aria-hidden): the alt already names what it marks.
 *
 * A reused picture (record.credit) prints its attribution: source, licence, changes and the day it
 * was taken (CC BY 4.0 §3(a)); it also brings its own alt and caption, because it shows someone
 * else's folder or version, not exactly the screen the spec describes.
 *
 * An illustration (record.illustration) is a drawn recreation of the screen. It says so in a band
 * above the picture and in its alt, so nobody mistakes it for the real thing.
 *
 * With no capture yet the component renders nothing. A picture that does not exist is not
 * replaced by a drawing that looks like one (owner's order: never fake a screenshot); the step
 * text carries the instruction alone until the capture lands.
 */
export function Screenshot({ spec, record, image }: { spec: Pick<ShotSpec, 'id' | 'alt' | 'caption'>; record?: ShotRecord; image?: StaticImageData }) {
  if (!record || !image) return null
  const b = record.box
  return (
    <figure data-testid="setup-shot" data-shot-id={spec.id} data-kind={kindOf(record)} className="my-3 overflow-hidden rounded-lg border border-border bg-card">
      {record.illustration && (
        // Above the picture, not only in the caption: it must be read before the picture is trusted.
        <p className="border-b border-border bg-muted px-3 py-1.5 text-xs font-medium text-foreground" data-testid="setup-shot-illustration">
          Ilustración aproximada, no es una captura real: tu pantalla puede verse algo distinta.
        </p>
      )}
      <div className="relative">
        {/* A plain <img>: the static export serves files as built (images.unoptimized), and
            next/image would add nothing here but a wrapper. */}
        <img
          src={image.src}
          width={record.width}
          height={record.height}
          alt={record.alt ?? spec.alt}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full"
        />
        {b && (
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Two strokes, dark under light, so the box reads on any screenshot background. */}
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="0.8" fill="none" stroke="#000" strokeOpacity="0.55" strokeWidth="5" vectorEffect="non-scaling-stroke" />
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="0.8" fill="none" stroke="#f59e0b" strokeWidth="3" vectorEffect="non-scaling-stroke" />
          </svg>
        )}
      </div>
      <figcaption className="border-t border-border px-3 py-2 text-[13px] leading-relaxed text-muted-foreground">
        {record.caption ?? spec.caption}{' '}
        <Provenance record={record} />
      </figcaption>
    </figure>
  )
}

function kindOf(record: ShotRecord): 'capture' | 'reused' | 'illustration' {
  if (record.illustration) return 'illustration'
  return record.credit ? 'reused' : 'capture'
}

/** The line after the caption: who made the picture and when it was checked. */
function Provenance({ record }: { record: ShotRecord }) {
  if (record.credit) return <Credit record={record} />
  const when = formatCheckedOn(record.checkedOn)
  if (record.illustration) return <span>Ilustración revisada el {when}.</span>
  return <span className="whitespace-nowrap">Comprobado el {when}.</span>
}

function Credit({ record }: { record: ShotRecord }) {
  const c = record.credit!
  const link = 'underline underline-offset-2 hover:text-foreground'
  return (
    <span data-testid="setup-shot-credit">
      Imagen:{' '}
      <a href={c.url} className={link} target="_blank" rel="noopener noreferrer">
        {c.source}
      </a>
      ,{' '}
      <a href={c.licenceUrl ?? REUSE_LICENCES[c.licence]} className={link} target="_blank" rel="noopener noreferrer license">
        {c.licence}
      </a>
      {c.changes ? `, ${c.changes}` : ''}. Consultada el {formatCheckedOn(record.checkedOn)}.
    </span>
  )
}
