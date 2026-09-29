'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { CLOUD_CONFIG, type CloudConfig } from '@/lib/cloud/config'
import { controllerOf, legalBlocks, processors, type LegalBlock, type LegalKind } from '@/lib/cloud/legal-content'
import { useCloudStage } from '@/lib/cloud/hooks'
import { CLOUD_SESSION_KEY } from '@/lib/cloud/session'
import { CONSENT_KEY, MEASUREMENT_ID_KEY } from '@/lib/cloud/consent'
import { QA_MODE_KEY } from '@/lib/cloud/qa-mode'
import { useText, type Tr } from './text'

/** What this site keeps in the browser when accounts run (names as the code writes them). */
const STORAGE_KEYS: ReadonlyArray<[string, string]> = [
  [CLOUD_SESSION_KEY, 'legalc.key.session'],
  [CONSENT_KEY, 'legalc.key.consent'],
  [MEASUREMENT_ID_KEY, 'legalc.key.cid'],
  [QA_MODE_KEY, 'legalc.key.qa'],
]

function Controller({ cfg, tr }: { cfg: CloudConfig; tr: Tr }) {
  const c = controllerOf(cfg)
  if (!c) return <p>{tr('legalc.controller.pending', { email: cfg.legal.supportEmail || '—' })}</p>
  return <p>{tr('legalc.controller.body', { name: c.name, ruc: c.ruc ?? '—', address: c.address ?? '—', email: c.email ?? '—' })}</p>
}

function Processors({ cfg, tr }: { cfg: CloudConfig; tr: Tr }) {
  return (
    <ul className="list-disc space-y-1 pl-5">
      {processors(cfg).map((p) => (
        <li key={p.key}>
          {tr(`legalc.proc.${p.key}`)}
          {p.country && ` (${tr(`legalc.country.${p.country}`)})`}
        </li>
      ))}
    </ul>
  )
}

function StorageKeys({ tr }: { tr: Tr }) {
  return (
    <ul className="list-disc space-y-1 pl-5">
      {STORAGE_KEYS.map(([key, text]) => (
        <li key={key}>
          <code>{key}</code>: {tr(text)}
        </li>
      ))}
    </ul>
  )
}

function Body({ block, cfg, tr }: { block: LegalBlock; cfg: CloudConfig; tr: Tr }): ReactNode {
  if (block === 'controller') return <Controller cfg={cfg} tr={tr} />
  if (block === 'processors') return <Processors cfg={cfg} tr={tr} />
  if (block === 'storageKeys') return <StorageKeys tr={tr} />
  if (block === 'subscription') {
    return <p>{tr('legalc.subscription.body')} <Link href="/suscripcion" className="underline underline-offset-2">{tr('legalc.subscription.link')}</Link></p>
  }
  return <p>{tr(`legalc.${block}.body`)}</p>
}

/**
 * The paragraphs accounts, ads and billing add to a legal page (DESIGN-v2 §8.12). Nothing while
 * accounts do not run here (stage off, and always in the prerendered HTML), so the published
 * pages read exactly as they did.
 */
export function CloudLegalSection({ kind, cfg = CLOUD_CONFIG }: { kind: LegalKind; cfg?: CloudConfig }) {
  const { tr } = useText()
  const stage = useCloudStage()
  const blocks = legalBlocks(cfg, kind, stage)
  if (!blocks.length) return null
  return (
    <section className="space-y-4 border-t border-border pt-6" data-testid={`cloud-legal-${kind}`} aria-labelledby={`cloud-legal-${kind}-h`}>
      <h2 id={`cloud-legal-${kind}-h`} className="text-lg font-semibold">{tr('legalc.heading')}</h2>
      {blocks.map((block) => (
        <div key={block} className="space-y-1">
          <h3 className="font-semibold">{tr(`legalc.${block}.h`)}</h3>
          <Body block={block} cfg={cfg} tr={tr} />
        </div>
      ))}
    </section>
  )
}
