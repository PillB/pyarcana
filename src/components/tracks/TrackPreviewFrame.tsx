'use client'

import { previewFrameProps } from '@/lib/tracks/preview'
import type { TrackPreview } from '@/lib/tracks/types'

/**
 * HTML drawn by the browser itself, so the learner sees what their Python produced. The frame is
 * sandboxed with no permissions: scripts, forms, popups and same-origin access are all off, so the
 * HTML can only be drawn (src/lib/tracks/preview.ts, tested).
 */
export function TrackPreviewFrame({ preview }: { preview: TrackPreview }) {
  const props = previewFrameProps(preview)
  return (
    <figure className="mt-3" data-testid="track-preview">
      <iframe {...props} className="h-40 w-full rounded-md border border-border bg-white" />
      <figcaption className="mt-1 text-[13px] text-muted-foreground">{preview.title}</figcaption>
    </figure>
  )
}
