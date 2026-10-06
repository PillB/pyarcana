'use client'

import { Screenshot } from '@/components/setup/Screenshot'
import { OfficialGuide } from '@/components/setup/OfficialGuide'
import { SECTION_SHOT_IMAGES } from '@/assets/sections'
import shotRecords from '@/assets/sections/shots.json'
import { validSectionShotRecord, type SectionShotRecord } from '@/lib/course/section-shots'

const RECORDS = new Map<string, SectionShotRecord>(
  (shotRecords as unknown[]).filter(validSectionShotRecord).map((r) => [r.id, r]),
)

/**
 * One approved screenshot inside a section (decision D19): Sesión 0's picture, caption and
 * credit, then the same line Sesión 0 prints after a picture, pointing to the product's guide.
 *
 * A record that fails validation renders nothing, as in Sesión 0: the prose around it already
 * carries the instruction, and an uncredited picture is not shown. The section test fails first.
 */
export function SectionScreenshot({ id }: { id: string }) {
  const record = RECORDS.get(id)
  const image = SECTION_SHOT_IMAGES[id]
  if (!record || !image) return null
  return (
    <div data-testid="section-shot" data-shot-id={id}>
      {/* Never wider than the capture: a 520 px crop stretched to the column blurs its text. */}
      <div style={{ maxWidth: record.width }}>
        <Screenshot spec={{ id, alt: record.alt, caption: record.caption }} record={record} image={image} />
      </div>
      <OfficialGuide guide={record.guide} afterPicture />
    </div>
  )
}
