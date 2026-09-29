'use client'

import { useEffect, type ReactNode } from 'react'
import Link from 'next/link'
import { CLOUD_CONFIG, isGatingStage, type CloudConfig, type LaunchStage } from '@/lib/cloud/config'
import { sellerView, type OwnerIdentity } from '@/lib/cloud/pricing-view'
import { CloudPageFrame, TrademarkNotice } from './CloudPageFrame'
import { loadAuthMethods, useAuthMethods } from './runtime'
import { useText, type Tr } from './text'

function Part({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="space-y-2" aria-labelledby={id ? `${id}-h` : undefined}>
      <h2 id={id ? `${id}-h` : undefined} className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  )
}

function OwnerSeller({ owner, tr }: { owner: OwnerIdentity; tr: Tr }) {
  return (
    <>
      <p className="text-sm">{tr('billing.seller.legal', { name: owner.name, ruc: owner.ruc, address: owner.address })}</p>
      <p className="text-sm">{tr('susc.seller.contact', { email: owner.email })}</p>
      {owner.complaintsBookUrl && (
        <p className="text-sm">
          <a href={owner.complaintsBookUrl} className="underline underline-offset-2" rel="noopener">{tr('billing.links.complaints')}</a>
        </p>
      )}
    </>
  )
}

function Refunds({ email, tr }: { email: string; tr: Tr }) {
  return (
    <Part id="devoluciones" title={tr('susc.refunds.h')}>
      <p className="text-sm">{tr('susc.refunds.body')}</p>
      {email !== '' && <p className="text-sm">{tr('susc.refunds.contact', { email })}</p>}
    </Part>
  )
}

/**
 * How the subscription works, as facts the worker enforces (DESIGN-v2 §8.9, v3 §D): the trial,
 * renewal, cancelling where you subscribed, refunds as the law and Creem's terms provide (no
 * voluntary window is promised), gifted months, who sells. Pure given its inputs.
 */
export function SubscriptionContent({ stage, cfg, trialDays }: { stage: LaunchStage; cfg: CloudConfig; trialDays: number | null }) {
  const { tr } = useText()
  if (!isGatingStage(stage)) return <p className="text-sm">{tr('precios.notYet')}</p>
  const { owner } = sellerView(cfg)
  return (
    <div className="space-y-6" data-testid="subscription-content">
      <Part title={tr('susc.trial.h')}>
        <p className="text-sm">{trialDays === null ? tr('susc.trial.bodyNoDays') : tr('susc.trial.body', { days: trialDays })}</p>
      </Part>
      <Part title={tr('susc.renew.h')}>
        <p className="text-sm">{tr('susc.renew.body')}</p>
      </Part>
      <Part title={tr('susc.cancel.h')}>
        <p className="text-sm">{tr('susc.cancel.body')}</p>
      </Part>
      <Refunds email={cfg.legal.supportEmail.trim()} tr={tr} />
      <Part title={tr('susc.gift.h')}>
        <p className="text-sm">{tr('susc.gift.body')}</p>
      </Part>
      <Part id="vendedor" title={tr('susc.seller.h')}>
        {owner ? <OwnerSeller owner={owner} tr={tr} /> : <p className="text-sm">{tr('susc.seller.pending')}</p>}
        <p className="text-sm">{tr('susc.seller.world')}</p>
      </Part>
      <p className="text-sm">
        <Link href="/precios" className="underline underline-offset-2">{tr('susc.toPrices')}</Link>
      </p>
      <TrademarkNotice />
    </div>
  )
}

function SuscripcionActive({ stage }: { stage: LaunchStage }) {
  const trialDays = useAuthMethods((s) => s.trialDays)
  useEffect(() => {
    void loadAuthMethods()
  }, [])
  return <SubscriptionContent stage={stage} cfg={CLOUD_CONFIG} trialDays={trialDays} />
}

/** /suscripcion: the subscription terms the checkout links to (and its #devoluciones anchor). */
export function SuscripcionPage() {
  return <CloudPageFrame titleKey="susc.title">{(stage) => <SuscripcionActive stage={stage} />}</CloudPageFrame>
}
