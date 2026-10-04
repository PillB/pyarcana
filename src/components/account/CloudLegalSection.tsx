'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { CLOUD_CONFIG, normalizeOrigin, type CloudConfig, type LaunchStage } from '@/lib/cloud/config'
import { supportContact } from '@/lib/cloud/billing-ui'
import { adNetwork, controllerOf, legalBlocks, processors, type LegalBlock, type LegalKind } from '@/lib/cloud/legal-content'
import { useCloudStage } from '@/lib/cloud/hooks'
import { CLOUD_SESSION_KEY } from '@/lib/cloud/session'
import { CONSENT_KEY, MEASUREMENT_ID_KEY } from '@/lib/cloud/consent'
import { QA_MODE_KEY } from '@/lib/cloud/qa-mode'
import { CHANGES_KEY } from '@/lib/cloud/progress-merge'
import { ARCHIVE_PREFIX } from '@/lib/cloud/progress-sync'
import { MS_PENDING_KEY } from '@/lib/cloud/oidc'
import { INTENT_KEY } from '@/lib/cloud/intent'
import { CONSENT_SENT_KEY } from '@/lib/cloud/consent-sync'
import { GRANDFATHER_KEY } from '@/lib/cloud/gate'
import { SURVEY_CAP_KEY } from '@/lib/cloud/surveys'
import { SEEN_KEY } from '@/lib/cloud/experiments'
import { ACCOUNT_ARMS_KEY, BOUND_KEY } from '@/lib/cloud/measurement'
import { ADSENSE_OPTIN_KEY } from '@/lib/cloud/ad-slot'
import { NUDGE_KEY, PERSIST_KEY } from '@/lib/cloud/storage-resilience'
import { TRIAL_CARD_DISMISSED_KEY } from './TrialSoftCard'
import { useText, type Tr } from './text'

export interface StorageItem {
  key: string
  text: string
  /** sessionStorage: this tab only, gone when it closes. */
  tabOnly?: boolean
}
export interface StorageGroup {
  group: 'necessary' | 'preferences' | 'measurement' | 'ads'
  items: StorageItem[]
}

/**
 * Everything the account edition keeps in this browser (names exactly as the code writes them),
 * grouped by why. review-r3.test.ts fails when a new exported *_KEY is not listed here. The AdSense
 * answer is listed only when AdSense can load.
 */
export function storageDisclosure(cfg: CloudConfig): StorageGroup[] {
  const groups: StorageGroup[] = [
    {
      group: 'necessary',
      items: [
        { key: CLOUD_SESSION_KEY, text: 'legalc.key.session' },
        { key: CHANGES_KEY, text: 'legalc.key.changes' },
        { key: `${ARCHIVE_PREFIX}*`, text: 'legalc.key.archive' },
        { key: MS_PENDING_KEY, text: 'legalc.key.msPending', tabOnly: true },
        { key: INTENT_KEY, text: 'legalc.key.intent', tabOnly: true },
        { key: CONSENT_KEY, text: 'legalc.key.consent' },
        { key: CONSENT_SENT_KEY, text: 'legalc.key.consentSent' },
        { key: GRANDFATHER_KEY, text: 'legalc.key.grandfather' },
        { key: QA_MODE_KEY, text: 'legalc.key.qa' },
        { key: PERSIST_KEY, text: 'legalc.key.persist' },
      ],
    },
    {
      group: 'preferences',
      items: [
        { key: TRIAL_CARD_DISMISSED_KEY, text: 'legalc.key.trialCard' },
        { key: SURVEY_CAP_KEY, text: 'legalc.key.surveyCap' },
        { key: NUDGE_KEY, text: 'legalc.key.signinNudge' },
      ],
    },
    {
      group: 'measurement',
      items: [
        { key: MEASUREMENT_ID_KEY, text: 'legalc.key.cid' },
        { key: SEEN_KEY, text: 'legalc.key.seen' },
        { key: BOUND_KEY, text: 'legalc.key.bound' },
        { key: ACCOUNT_ARMS_KEY, text: 'legalc.key.accountArms' },
      ],
    },
  ]
  if (adNetwork(cfg) !== 'adsense') return groups
  return [...groups, { group: 'ads', items: [{ key: ADSENSE_OPTIN_KEY, text: 'legalc.key.adsenseOptin' }] }]
}

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

function StorageKeys({ cfg, tr }: { cfg: CloudConfig; tr: Tr }) {
  return (
    <div className="space-y-2">
      {storageDisclosure(cfg).map((g) => (
        <div key={g.group}>
          <p className="font-medium">{tr(`legalc.keygroup.${g.group}`)}</p>
          <ul className="list-disc space-y-1 pl-5">
            {g.items.map((item) => (
              <li key={item.key}>
                <code>{item.key}</code>: {tr(item.text)}
                {item.tabOnly && ` (${tr('legalc.keygroup.session')})`}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function Body({ block, cfg, tr }: { block: LegalBlock; cfg: CloudConfig; tr: Tr }): ReactNode {
  if (block === 'controller') return <Controller cfg={cfg} tr={tr} />
  if (block === 'processors') return <Processors cfg={cfg} tr={tr} />
  if (block === 'storageKeys') return <StorageKeys cfg={cfg} tr={tr} />
  if (block === 'subscription') {
    return <p>{tr('legalc.subscription.body')} <Link href="/suscripcion" className="underline underline-offset-2">{tr('legalc.subscription.link')}</Link></p>
  }
  return <p>{tr(`legalc.${block}.body`, { email: supportContact() })}</p>
}

/**
 * The paragraphs accounts, ads and billing add to a legal page (DESIGN-v2 §8.12). Nothing while
 * accounts do not run here (stage off, and always in the prerendered HTML), so the published
 * pages read exactly as they did.
 */
export function CloudLegalSection({ kind, cfg = CLOUD_CONFIG }: { kind: LegalKind; cfg?: CloudConfig }) {
  const stage = useCloudStage()
  return <CloudLegalContent kind={kind} cfg={cfg} stage={stage} />
}

/**
 * The section for a known stage. id="cloud-legal" is the anchor the sign-in panel and the consent
 * card link to, so a learner lands on the paragraphs about this site's accounts rather than on the
 * top of a page that also describes other editions; the intro says this section is what applies.
 */
export function CloudLegalContent({ kind, cfg, stage }: { kind: LegalKind; cfg: CloudConfig; stage: LaunchStage }) {
  const { tr } = useText()
  const blocks = legalBlocks(cfg, kind, stage)
  if (!blocks.length) return null
  const host = (normalizeOrigin(cfg.canonicalOrigin) ?? '').replace(/^https?:\/\//, '')
  return (
    <section id="cloud-legal" className="scroll-mt-20 space-y-4 border-t border-border pt-6" data-testid={`cloud-legal-${kind}`} aria-labelledby={`cloud-legal-${kind}-h`}>
      <h2 id={`cloud-legal-${kind}-h`} className="text-lg font-semibold">{tr('legalc.heading')}</h2>
      <p>{tr('legalc.intro', { host })}</p>
      {blocks.map((block) => (
        <div key={block} className="space-y-1">
          <h3 className="font-semibold">{tr(`legalc.${block}.h`)}</h3>
          <Body block={block} cfg={cfg} tr={tr} />
        </div>
      ))}
    </section>
  )
}
