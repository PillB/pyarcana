import type { TrackPreview } from './types'

/** A minimal document around the learner's HTML: readable type, visible cell borders, no script. */
const FRAME_STYLE =
  'body{font:15px/1.5 system-ui,sans-serif;color:#111;background:#fff;margin:8px}' +
  'table{border-collapse:collapse}td,th{border:1px solid #888;padding:4px 8px;text-align:left}caption{font-weight:600;text-align:left;padding-bottom:4px}'

/**
 * The attributes of the preview frame. `sandbox` is the empty string, which turns every permission
 * off (HTML spec, the iframe sandbox attribute): the previewed HTML may contain `<Norte>` or any
 * other text a learner writes, and none of it may run or reach the course page.
 */
export function previewFrameProps(preview: TrackPreview): { title: string; sandbox: string; srcDoc: string; referrerPolicy: 'no-referrer' } {
  return {
    title: preview.title,
    sandbox: '',
    referrerPolicy: 'no-referrer',
    srcDoc: `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>${FRAME_STYLE}</style></head><body>${preview.html}</body></html>`,
  }
}
