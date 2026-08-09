'use client'

import { Fragment } from 'react'
import { TermHint } from './TermHint'

/**
 * Renders HTML from RichText with [[TERM:id]] markers as TermHint tooltips.
 */
export function InlineAnnotated({ html }: { html: string }) {
  const parts = html.split(/(⟦TERM:[^⟧]+⟧[\s\S]*?⟦\/TERM⟧)/g)
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^⟦TERM:([^⟧]+)⟧([\s\S]*?)⟦\/TERM⟧$/)
        if (m) {
          return (
            <TermHint key={i} termIdOrAlias={m[1]}>
              <span dangerouslySetInnerHTML={{ __html: m[2] }} />
            </TermHint>
          )
        }
        if (!part) return <Fragment key={i} />
        return <span key={i} dangerouslySetInnerHTML={{ __html: part }} />
      })}
    </>
  )
}
