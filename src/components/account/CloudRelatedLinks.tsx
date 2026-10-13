'use client'

import Link from 'next/link'
import { useCloudStage } from '@/lib/cloud/hooks'
import { useText } from './text'

const PAGES = [
  ['/suscripcion', 'susc.title'],
  ['/precios', 'precios.title'],
] as const

/**
 * The subscription pages join the legal pages' "Otros documentos legales" list only where
 * accounts run; the prerendered list stays as it was.
 */
export function CloudRelatedLinks({ className }: { className: string }) {
  const { tr } = useText()
  const stage = useCloudStage()
  if (stage === 'off') return null
  return (
    <>
      {PAGES.map(([href, key]) => (
        <li key={href}>
          <Link href={href} className={className}>{tr(key)}</Link>
        </li>
      ))}
    </>
  )
}
