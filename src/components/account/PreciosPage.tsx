'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CLOUD_CONFIG } from '@/lib/cloud/config'
import { pricingView, type PriceRow, type PricingView } from '@/lib/cloud/pricing-view'
import { AccountDialog } from './AccountDialog'
import { CloudSync } from './CloudSync'
import { CloudPageFrame, TrademarkNotice, type OnStage } from './CloudPageFrame'
import { loadAuthMethods, useAccountUi, useAuthMethods } from './runtime'
import { useText, type Tr } from './text'

const TAX_KEYS: Record<PriceRow['market'], string> = { pe: 'billing.tax.pe', world: 'billing.tax.world' }

function PriceTable({ rows, tr }: { rows: PriceRow[]; tr: Tr }) {
  return (
    <table className="w-full text-left text-sm" data-testid="price-table">
      <caption className="sr-only">{tr('precios.caption')}</caption>
      <thead>
        <tr className="border-b border-border">
          <th scope="col" className="py-2 pr-3 font-medium">{tr('precios.col.where')}</th>
          <th scope="col" className="py-2 pr-3 font-medium">{tr('billing.cadence.monthly')}</th>
          <th scope="col" className="py-2 font-medium">{tr('precios.col.yearly')}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.market} className="border-b border-border align-top">
            <th scope="row" className="py-2 pr-3 font-medium">
              {tr(`precios.market.${r.market}`)}
              <span className="block text-xs font-normal text-muted-foreground">{tr(TAX_KEYS[r.market])}</span>
            </th>
            <td className="py-2 pr-3">{tr('billing.price.monthly', { price: r.monthly })}</td>
            <td className="py-2">
              {tr('billing.price.yearly', { price: r.yearly })}
              <span className="block text-xs text-muted-foreground">{tr('precios.saving', { pct: r.savingPct })}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/** The price page body for a stage where accounts run; pure given its inputs (tested on the server). */
export function PricingContent({ view, trialDays, onSubscribe }: { view: PricingView; trialDays: number | null; onSubscribe: () => void }) {
  const { tr } = useText()
  if (!view.available) return <p className="text-sm">{tr('precios.notYet')}</p>
  return (
    <div className="space-y-5" data-testid="pricing-content">
      <p className="text-sm">{tr('precios.intro', { n: view.freeSections, next: view.proFrom })}</p>
      {trialDays !== null && <p className="text-sm">{tr('precios.trial', { days: trialDays })}</p>}
      <PriceTable rows={view.rows} tr={tr} />
      {view.payOpen ? <Button onClick={onSubscribe}>{tr('precios.subscribe')}</Button> : <p className="text-sm">{tr('billing.notOpen')}</p>}
      <p className="text-sm">
        <Link href="/suscripcion" className="underline underline-offset-2">{tr('precios.howItWorks')}</Link>
      </p>
      <TrademarkNotice />
    </div>
  )
}

function PreciosActive({ stage }: { stage: OnStage }) {
  const trialDays = useAuthMethods((s) => s.trialDays)
  useEffect(() => {
    void loadAuthMethods()
  }, [])
  return (
    <>
      <PricingContent view={pricingView(stage, CLOUD_CONFIG)} trialDays={trialDays} onSubscribe={() => useAccountUi.getState().show('checkout')} />
      <CloudSync />
      <AccountDialog />
    </>
  )
}

/** /precios (DESIGN-v3 §I): prices from offer.ts only, so the page never shows a price checkout does not charge. */
export function PreciosPage() {
  return <CloudPageFrame titleKey="precios.title">{(stage) => <PreciosActive stage={stage} />}</CloudPageFrame>
}
