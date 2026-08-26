'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Crosshair, X } from 'lucide-react'
import { describeElement, meaningfulTarget } from '@/lib/element-selector'

/**
 * Point at the thing instead of describing it.
 *
 * The QA workspace steps aside while this is up, so the tester can scroll the
 * page, open a section and click the element they are reporting. What comes
 * back is a selector a reviewer can paste into devtools plus the text that was
 * on screen, which is what tells them they found the right node when the page
 * has moved on.
 *
 * Everything here is pointer-events:none except nothing at all -- the highlight
 * and the banner must never be what gets picked, and the click is caught in the
 * capture phase so a button under the pointer does not also fire.
 */
export function ElementPicker({
  onPick,
  onCancel,
}: {
  onPick: (hint: string) => void
  onCancel: () => void
}) {
  const [box, setBox] = useState<{ top: number; left: number; width: number; height: number } | null>(null)
  const [label, setLabel] = useState<string>('')
  // Even with the click passing through, a banner parked over the thing you are
  // trying to aim at is the wrong place for it. It moves to the other end when
  // the pointer comes near.
  const [bannerAtBottom, setBannerAtBottom] = useState(false)
  const targetRef = useRef<Element | null>(null)

  // Mounted only while picking, so there is no inactive state to reset -- which
  // also keeps the reset out of an effect, where the React Compiler rules
  // rightly reject it.
  useEffect(() => {
    /** The picker's own chrome must never be pickable. */
    const isOwnUi = (el: Element | null) => !!el?.closest('[data-qa-picker]')

    // elementsFromPoint, not elementFromPoint: the banner sits over the top of
    // the page, and with the singular call anything underneath it resolved to
    // the picker's own chrome and could not be picked at all. Walking the stack
    // skips our UI and finds the page beneath it.
    const resolve = (x: number, y: number): Element | null => {
      for (const candidate of document.elementsFromPoint(x, y)) {
        if (isOwnUi(candidate)) continue
        return meaningfulTarget(candidate)
      }
      return null
    }

    const onMove = (event: PointerEvent) => {
      const el = resolve(event.clientX, event.clientY)
      if (!el) return
      targetRef.current = el
      const r = el.getBoundingClientRect()
      setBox({ top: r.top, left: r.left, width: r.width, height: r.height })
      setBannerAtBottom(event.clientY < window.innerHeight * 0.28)
      setLabel(el.tagName.toLowerCase() + (el.getAttribute('data-testid') ? `[${el.getAttribute('data-testid')}]` : ''))
    }

    const onClick = (event: MouseEvent) => {
      if (isOwnUi(event.target as Element)) return
      // Capture phase + both stops: picking a "Guardar" button must not also
      // save anything, and picking a link must not navigate away from the page
      // the report is about.
      event.preventDefault()
      event.stopPropagation()
      const el = resolve(event.clientX, event.clientY) ?? targetRef.current
      if (el) onPick(describeElement(el))
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      event.stopPropagation()
      onCancel()
    }

    // Capture on all three: the page is full of its own handlers, and the
    // tester is aiming at them.
    document.addEventListener('pointermove', onMove, true)
    document.addEventListener('click', onClick, true)
    document.addEventListener('keydown', onKey, true)
    const previousCursor = document.body.style.cursor
    document.body.style.cursor = 'crosshair'
    return () => {
      document.removeEventListener('pointermove', onMove, true)
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('keydown', onKey, true)
      document.body.style.cursor = previousCursor
    }
  }, [onPick, onCancel])

  if (typeof document === 'undefined') return null

  return createPortal(
    <div data-qa-picker className="pointer-events-none fixed inset-0 z-[70]" data-testid="qa-element-picker">
      {box && (
        <div
          className="pointer-events-none absolute rounded-sm border-2 border-primary bg-primary/10"
          style={{ top: box.top, left: box.left, width: box.width, height: box.height }}
        />
      )}
      <div
        className={`pointer-events-none absolute inset-x-0 flex justify-center p-3 transition-[top,bottom] ${
          bannerAtBottom ? 'bottom-0' : 'top-0'
        }`}
      >
        <div className="flex max-w-[min(38rem,calc(100%-1rem))] items-center gap-3 rounded-lg border border-border bg-background/95 px-4 py-2 text-sm shadow-lg backdrop-blur">
          <Crosshair className="h-4 w-4 shrink-0 text-primary" />
          <span className="min-w-0 flex-1">
            Haz clic en el elemento del que trata el reporte.{' '}
            <span className="text-muted-foreground">
              Puedes desplazarte y navegar; el formulario te espera.
            </span>
            {label && <span className="ml-1 font-mono text-xs text-muted-foreground">{label}</span>}
          </span>
          <button
            type="button"
            onClick={onCancel}
            data-testid="qa-element-picker-cancel"
            className="pointer-events-auto flex h-9 shrink-0 items-center gap-1 rounded-md border border-border px-2 text-xs hover:bg-muted"
          >
            <X className="h-3.5 w-3.5" />
            Esc
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
