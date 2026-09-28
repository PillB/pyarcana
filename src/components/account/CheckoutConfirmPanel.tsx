'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CLOUD_CONFIG } from '@/lib/cloud/config'
import { useCloudStage } from '@/lib/cloud/hooks'
import type { MePayload } from '@/lib/cloud/session'
import { annualSavingPercent, defaultMarket, type Cadence, type Market } from '@/lib/cloud/offer'
import { checkoutBody, checkoutRedirect, checkoutView, type CheckoutView } from '@/lib/cloud/billing-ui'
import { uiError, type UiError } from '@/lib/cloud/account-api'
import { parseGeo } from '@/lib/cloud/ad-slot'
import { ErrorAlert } from './Alerts'
import { cloudApi, track, useAccountUi } from './runtime'
import { useText, type Tr } from './text'

function initialMarket(): Market {
  return defaultMarket({ timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, language: navigator.language })
}

/** One rail per country; a geo answer refines the guess until the buyer switches by hand. */
function useMarket(): [Market, (m: Market) => void, string | null] {
  const [market, setMarket] = useState<Market>(initialMarket)
  const manual = useRef(false)
  const [country, setCountry] = useState<string | null>(null)
  useEffect(() => {
    let live = true
    void cloudApi().get('/v1/geo').then((r) => {
      const geo = parseGeo(r)
      if (!live || geo.status !== 'ok') return
      setCountry(geo.country)
      if (!manual.current) setMarket(defaultMarket({ country: geo.country }))
    })
    return () => {
      live = false
    }
  }, [])
  const choose = (m: Market) => {
    manual.current = true
    setMarket(m)
  }
  return [market, choose, country]
}

function Disclosures({ view, cadence, tr }: { view: CheckoutView; cadence: Cadence; tr: Tr }) {
  const legal = CLOUD_CONFIG.legal
  const tax = view.currency === 'PEN' ? tr('billing.tax.pe') : tr('billing.tax.world')
  return (
    <ul className="list-disc space-y-1 pl-5 text-sm" data-testid="checkout-disclosures">
      <li>
        <strong>{tr(`billing.price.${cadence}`, { price: view.priceLabel })}</strong> · {tax}
      </li>
      <li>{tr(`billing.renews.${cadence}`)}</li>
      <li>{tr('billing.chargedToday')}</li>
      {view.creditDays !== null && <li>{tr('billing.credit', { days: view.creditDays })}</li>}
      <li>{tr('billing.cancelHow')}</li>
      <li>
        {view.sellerIsMoR ? tr('billing.seller.mor') : tr('billing.seller.legal', { name: legal.sellerName, ruc: legal.ruc, address: legal.address })}
      </li>
    </ul>
  )
}

function LegalLinks({ tr }: { tr: Tr }) {
  const link = 'underline underline-offset-2'
  return (
    <p className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
      <Link href="/suscripcion" target="_blank" rel="noopener" className={link}>{tr('billing.links.terms')}</Link>
      <Link href="/suscripcion#devoluciones" target="_blank" rel="noopener" className={link}>{tr('billing.links.refunds')}</Link>
      {CLOUD_CONFIG.legal.complaintsBookUrl && (
        <a href={CLOUD_CONFIG.legal.complaintsBookUrl} target="_blank" rel="noopener noreferrer" className={link}>{tr('billing.links.complaints')}</a>
      )}
    </p>
  )
}

function CadenceChoice({ market, cadence, onChange, tr }: { market: Market; cadence: Cadence; onChange: (c: Cadence) => void; tr: Tr }) {
  const options: Array<[Cadence, string]> = [
    ['monthly', tr('billing.cadence.monthly')],
    ['yearly', tr('billing.cadence.yearly', { pct: annualSavingPercent(market) })],
  ]
  return (
    <fieldset className="space-y-1">
      <legend className="text-sm font-medium">{tr('billing.cadence.legend')}</legend>
      {options.map(([value, label]) => (
        <label key={value} className="flex items-center gap-2 text-sm">
          <input type="radio" name="cadence" value={value} checked={cadence === value} onChange={() => onChange(value)} />
          {label}
        </label>
      ))}
    </fieldset>
  )
}

function Box({ id, checked, onChange, label }: { id: string; checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div className="flex items-start gap-2">
      <Checkbox id={id} checked={checked} onCheckedChange={(v) => onChange(v === true)} className="mt-0.5" />
      <Label htmlFor={id} className="text-sm font-normal leading-snug">{label}</Label>
    </div>
  )
}

/**
 * The review step before any redirect (DESIGN-v2 §8.8): final price with its tax note, cadence
 * and automatic renewal, first charge today, credit for remaining free days, how to cancel,
 * links to the subscription terms, refunds and the Libro de Reclamaciones, the seller (or Creem as
 * merchant of record), the Mercado Pago payer email, and two unticked boxes. Pay buttons render
 * only in stage 'paid' on a configured rail; the redirect happens only when the worker charges
 * exactly the price shown here.
 */
export function CheckoutConfirmPanel({ me }: { me: MePayload }) {
  const { tr } = useText()
  const stage = useCloudStage()
  const show = useAccountUi((s) => s.show)
  const [market, setMarket, country] = useMarket()
  const [cadence, setCadence] = useState<Cadence>('monthly')
  const [payerEmail, setPayerEmail] = useState(me.account.email ?? '')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [adult, setAdult] = useState(false)
  const [error, setError] = useState<UiError | null>(null)
  const [busy, setBusy] = useState(false)
  const view = checkoutView({ stage, rails: CLOUD_CONFIG.rails, market, cadence, me, nowS: Math.floor(Date.now() / 1000) })

  useEffect(() => track({ name: 'checkout_open' }), [])

  const pay = async () => {
    if (!view.rail) return
    const declared = market === 'pe' ? 'PE' : country && country !== 'PE' ? country : null
    const b = checkoutBody({ rail: view.rail, cadence, payerEmail, country: declared, acceptTerms, adultOrAuthorized: adult })
    if (!b.ok) return setError({ key: b.key })
    setBusy(true)
    setError(null)
    const r = await cloudApi().post('/v1/checkout', b.body)
    const next = r.ok ? checkoutRedirect(r.data, { amountMinor: view.amountMinor, currency: view.currency }) : null
    if (next?.ok) return window.location.assign(next.url)
    setBusy(false)
    setError(next ? { key: next.key } : uiError(r))
  }

  return (
    <div className="space-y-4" data-testid="checkout-confirm">
      <CadenceChoice market={market} cadence={cadence} onChange={setCadence} tr={tr} />
      <Disclosures view={view} cadence={cadence} tr={tr} />
      <LegalLinks tr={tr} />
      <Button variant="link" size="sm" className="h-auto p-0" onClick={() => setMarket(market === 'pe' ? 'world' : 'pe')}>
        {market === 'pe' ? tr('billing.market.notPeru') : tr('billing.market.inPeru')}
      </Button>
      {view.needsPayerEmail && (
        <div className="space-y-1">
          <Label htmlFor="checkout-payer">{tr('billing.payerEmail')}</Label>
          <Input id="checkout-payer" type="email" autoComplete="email" value={payerEmail} onChange={(e) => setPayerEmail(e.target.value)} />
          <p className="text-xs text-muted-foreground">{tr('billing.payerEmailHint')}</p>
        </div>
      )}
      <Box id="checkout-terms" checked={acceptTerms} onChange={setAcceptTerms} label={tr('billing.box.terms')} />
      <Box id="checkout-adult" checked={adult} onChange={setAdult} label={tr('billing.box.adult')} />
      <PayArea view={view} busy={busy} onPay={() => void pay()} tr={tr} />
      <ErrorAlert error={error} />
      <Button variant="ghost" size="sm" onClick={() => show('main')}>{tr('billing.back')}</Button>
    </div>
  )
}

function PayArea({ view, busy, onPay, tr }: { view: CheckoutView; busy: boolean; onPay: () => void; tr: Tr }) {
  if (!view.showPay || !view.rail) {
    return <p role="status" className="text-sm text-muted-foreground">{view.rail ? tr('billing.notOpen') : tr('billing.railMissing')}</p>
  }
  return (
    <Button className="w-full" onClick={onPay} disabled={busy} data-testid="checkout-pay">
      {busy ? tr('billing.redirecting') : tr(`billing.pay.${view.rail}`)}
    </Button>
  )
}
