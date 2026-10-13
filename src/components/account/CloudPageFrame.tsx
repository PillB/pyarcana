'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import type { LaunchStage } from '@/lib/cloud/config'
import { useCloudStage } from '@/lib/cloud/hooks'
import { sitePath, useAfterMount, useText, type Tr } from './text'

export type OnStage = Exclude<LaunchStage, 'off'>

const LINK = 'inline-block text-sm underline underline-offset-2'

/**
 * The way back to the course. /qa and /admin use a plain <a> (a full page load), so the document
 * that held reports or account data is never reused for the course page, where ads may load.
 */
function BackLink({ plain, tr }: { plain: boolean; tr: Tr }) {
  if (plain) return <a href={sitePath('/')} className={LINK}>{tr('cuenta.back')}</a>
  return <Link href="/" className={LINK}>{tr('cuenta.back')}</Link>
}

/**
 * The shared frame of /precios, /suscripcion, /qa and /admin (DESIGN-v3 §H, §I). Prerendered, it
 * holds only the heading and the way back: the stage is unknown on the server, so the "not
 * available" line appears after mount where accounts do not run, and everything else only where
 * they do. Nothing account-related reaches the exported HTML.
 */
export function CloudPageFrame({ titleKey, plainLinks = false, wide = false, children }: {
  titleKey: string
  plainLinks?: boolean
  wide?: boolean
  children: (stage: OnStage) => ReactNode
}) {
  const { tr } = useText()
  const stage = useCloudStage()
  const mounted = useAfterMount(() => true, false)
  return (
    <main className={`mx-auto px-4 py-10 sm:px-6 ${wide ? 'max-w-6xl' : 'max-w-3xl'}`}>
      <Card className="space-y-5 p-6">
        <h1 className="text-2xl font-semibold">{tr(titleKey)}</h1>
        {mounted && stage === 'off' && <p className="text-sm" data-testid="cloud-page-off">{tr('cloudpage.off')}</p>}
        {stage !== 'off' && children(stage)}
        <BackLink plain={plainLinks} tr={tr} />
      </Card>
    </main>
  )
}

/**
 * The PSF asks for "Python®" at the first prominent mention and for no implied affiliation
 * (PSF Trademark Usage Policy, "How to Use the Trademarks" 1 and 4).
 */
export function TrademarkNotice() {
  const { tr } = useText()
  return (
    <p className="border-t border-border pt-4 text-xs text-muted-foreground" data-testid="trademark-notice">
      {tr('legalc.trademark')} {tr('legalc.independent')}
    </p>
  )
}
