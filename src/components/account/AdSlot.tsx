'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { CLOUD_CONFIG, type LaunchStage } from '@/lib/cloud/config'
import { useAdEligibility, useCloudStage } from '@/lib/cloud/hooks'
import { useCloudSession } from '@/lib/cloud/session'
import { chooseAdapter, scriptUrl, type AdAdapter, type AdEligibility, type AdPlacement } from '@/lib/cloud/ads'
import { SLOT_HEIGHT_PX, railMediaQuery, ethicalAdsKeywords, houseArmShows, houseCreative, parseGeo, readAdsenseOptIn, slotView, writeAdsenseOptIn, type HouseCreative, type OptIn } from '@/lib/cloud/ad-slot'
import { safeStorage } from '@/lib/cloud/storage'
import { scriptLoader } from './GoogleButton'
import { cloudApi, getMeasurement, track, useAccountUi } from './runtime'
import { sitePath, useText, type Tr } from './text'
import { priceCtaTarget } from '@/lib/cloud/ui-state'
import { LEGAL_CHECKBOX_CLASS } from '@/components/account/a11y'

type Geo = { status: 'unknown' | 'ok' | 'failed'; country: string | null }

/** GET /v1/geo only when AdSense could be chosen; a failed lookup keeps house ads. */
function useGeo(needed: boolean): Geo {
  const [geo, setGeo] = useState<Geo>({ status: 'unknown', country: null })
  useEffect(() => {
    if (!needed) return
    let live = true
    void cloudApi().get('/v1/geo').then((r) => {
      if (live) setGeo(parseGeo(r))
    })
    return () => {
      live = false
    }
  }, [needed])
  return geo
}

function useDesktop(query: string): boolean {
  const [desktop, setDesktop] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const update = () => setDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [query])
  return desktop
}

/** ads_house_v1: undefined while the experiment list loads, then the arm (null = not running). */
function useHouseArm(enabled: boolean): string | null | undefined {
  const [arm, setArm] = useState<string | null | undefined>(undefined)
  useEffect(() => {
    if (!enabled) return
    let live = true
    void getMeasurement().arm('ads_house_v1').then((a) => {
      if (live) setArm(a)
    })
    return () => {
      live = false
    }
  }, [enabled])
  return arm
}

function HouseAd({ creative, sectionKey, tr }: { creative: HouseCreative; sectionKey: string; tr: Tr }) {
  const show = useAccountUi((s) => s.show)
  const signedIn = useCloudSession((s) => s.me !== null)
  const from = CLOUD_CONFIG.gate.freeSections + 1
  useEffect(() => track({ name: 'house_ad_view' }), [creative, sectionKey])
  const click = () => {
    track({ name: 'house_ad_click' })
    if (creative !== 'annual') return show('main')
    // "Ver precios": the prices themselves, never a sign-in form without them.
    if (priceCtaTarget(signedIn) === 'checkout') return show('checkout')
    window.location.assign(sitePath('/precios'))
  }
  return (
    <div className="flex h-full flex-col justify-center gap-1 p-4" data-testid="house-ad" data-creative={creative}>
      <p className="font-semibold">{tr(`ads.house.${creative}.title`)}</p>
      <p className="text-sm text-foreground/80">{tr(`ads.house.${creative}.body`, { from })}</p>
      <div>
        <Button size="sm" variant="outline" className="mt-1" onClick={click}>{tr(`ads.house.${creative}.cta`)}</Button>
      </div>
    </div>
  )
}

function TestAd({ placement, eligibility, tr }: { placement: AdPlacement; eligibility: AdEligibility; tr: Tr }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-1 border-2 border-dashed border-amber-500/60 p-4 text-center" data-testid="test-ad">
      <p className="font-semibold">{tr('ads.test.label')}</p>
      <p className="text-xs text-muted-foreground">{tr('ads.test.detail', { provider: CLOUD_CONFIG.ads.provider, placement, reason: eligibility })}</p>
    </div>
  )
}

export function AdsenseOptIn({ onAnswer, tr }: { onAnswer: (v: 'accepted' | 'declined', adult: boolean) => void; tr: Tr }) {
  const [adult, setAdult] = useState(false)
  useEffect(() => track({ name: 'ad_optin_shown' }), [])
  return (
    <div className="flex h-full flex-col justify-center gap-2 p-4 text-sm" data-testid="adsense-optin">
      <p>{tr('ads.optin.question')}</p>
      <div className="flex items-center gap-2">
        <Checkbox id="ads-adult" className={LEGAL_CHECKBOX_CLASS} checked={adult} onCheckedChange={(v) => setAdult(v === true)} />
        <Label htmlFor="ads-adult" className="font-normal">{tr('ads.optin.adult')}</Label>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" disabled={!adult} onClick={() => onAnswer('accepted', adult)}>{tr('ads.optin.accept')}</Button>
        <Button size="sm" variant="outline" onClick={() => onAnswer('declined', false)}>{tr('ads.optin.decline')}</Button>
        <Link href="/cookies#cloud-legal" className="self-center text-xs underline underline-offset-2">{tr('ads.optin.privacy')}</Link>
      </div>
    </div>
  )
}

/**
 * Under a network ad: "Sin anuncios con Pro" and, for Google, a way to take the opt-in back that is
 * as easy as giving it (one click, next to the ad). Withdrawing stores 'declined': the slot falls
 * back to a house promo and Google's script is not requested again on later loads.
 */
export function NetworkAdControls({ adapter, onWithdraw, onNoAds, tr }: { adapter: AdAdapter; onWithdraw: () => void; onNoAds: () => void; tr: Tr }) {
  if (adapter !== 'adsense' && adapter !== 'ethicalads') return null
  const link = 'h-auto p-0 text-xs'
  return (
    <p className="mt-1 flex flex-wrap justify-end gap-3">
      {adapter === 'adsense' && <Button variant="link" size="sm" className={link} onClick={onWithdraw}>{tr('ads.optin.withdraw')}</Button>}
      <Button variant="link" size="sm" className={link} onClick={onNoAds}>{tr('ads.noAdsLink')}</Button>
    </p>
  )
}

function AdsenseUnit({ placement }: { placement: AdPlacement }) {
  const ref = useRef<HTMLModElement>(null)
  useEffect(() => {
    const url = scriptUrl('adsense', CLOUD_CONFIG.ads)
    if (!url) return
    void scriptLoader().load(url).then(() => {
      const el = ref.current
      if (!el || el.getAttribute('data-adsbygoogle-status')) return
      const w = window as unknown as { adsbygoogle?: unknown[] }
      w.adsbygoogle = w.adsbygoogle ?? []
      w.adsbygoogle.push({})
    }).catch(() => {})
  }, [])
  return (
    <ins
      ref={ref}
      className="adsbygoogle"
      style={{ display: 'block', height: SLOT_HEIGHT_PX[placement] }}
      data-ad-client={CLOUD_CONFIG.ads.adsenseClient}
      data-ad-slot={CLOUD_CONFIG.ads.adsenseSlots[placement]}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}

function EthicalAdsUnit({ placement, sectionKey }: { placement: AdPlacement; sectionKey: string }) {
  useEffect(() => {
    const url = scriptUrl('ethicalads', CLOUD_CONFIG.ads)
    if (!url) return
    void scriptLoader().load(url).then(() => {
      const ea = (window as unknown as { ethicalads?: { load(): void } }).ethicalads
      ea?.load()
    }).catch(() => {})
  }, [])
  return (
    <div
      id={`ea-${placement}`}
      data-ea-publisher={CLOUD_CONFIG.ads.ethicaladsPublisher}
      data-ea-type="image"
      data-ea-manual="true"
      data-ea-keywords={ethicalAdsKeywords(sectionKey)}
      data-ea-dark-selector=".dark"
    />
  )
}

interface BodyProps {
  adapter: AdAdapter
  placement: AdPlacement
  eligibility: AdEligibility
  sectionKey: string
  creative: HouseCreative | null
  onOptIn: (v: 'accepted' | 'declined', adult: boolean) => void
  tr: Tr
}

function AdBody(p: BodyProps) {
  switch (p.adapter) {
    case 'test':
      return <TestAd placement={p.placement} eligibility={p.eligibility} tr={p.tr} />
    case 'house':
      return p.creative ? <HouseAd creative={p.creative} sectionKey={p.sectionKey} tr={p.tr} /> : null
    case 'adsense_optin':
      return <AdsenseOptIn onAnswer={p.onOptIn} tr={p.tr} />
    case 'adsense':
      return <AdsenseUnit placement={p.placement} />
    case 'ethicalads':
      return <EthicalAdsUnit placement={p.placement} sectionKey={p.sectionKey} />
    default:
      return null
  }
}

/** The house promo for this slot: null when none applies or the ads_house_v1 control arm says so; undefined while deciding. */
function useHouse(adapter: AdAdapter, sectionKey: string, stage: LaunchStage): HouseCreative | null | undefined {
  const trialOffered = useCloudSession((s) => (s.me ? s.me.account.trialAvailable : true))
  const creative = adapter === 'house' ? houseCreative({ sectionKey, stage, trialOffered }) : null
  const arm = useHouseArm(creative !== null)
  if (!creative) return null
  if (arm === undefined) return undefined
  return houseArmShows(arm) ? creative : null
}

/**
 * The desktop right rail: fixed beside the course column, above the fold, and hidden below the
 * width railMediaQuery() tests, so a hidden rail never loads a network script (chooseAdapter
 * gives 'none' there). The breakpoint literal must equal RAIL_MIN_WIDTH_PX.
 */
const RAIL_CLASS = 'fixed right-4 top-24 z-20 hidden w-[200px] min-[1600px]:block'

function ActiveSlot({ placement, sectionKey, eligibility, stage }: { placement: AdPlacement; sectionKey: string; eligibility: AdEligibility; stage: LaunchStage }) {
  const { tr } = useText()
  const signedIn = useCloudSession((s) => s.me !== null)
  const show = useAccountUi((s) => s.show)
  const [optIn, setOptIn] = useState<OptIn>(() => readAdsenseOptIn(safeStorage()))
  const geo = useGeo(eligibility === 'free' && CLOUD_CONFIG.ads.provider === 'adsense')
  const desktop = useDesktop(placement === 'rail' ? railMediaQuery() : '(min-width: 1024px)')
  const chosen = chooseAdapter({ eligibility, ads: CLOUD_CONFIG.ads, placement, signedIn, adultAttested: false, geo, adsenseOptIn: optIn, desktop })
  const creative = useHouse(chosen, sectionKey, stage)
  const adapter = slotView(chosen, creative, CLOUD_CONFIG.ads.provider)
  if (adapter === null) return null
  const onOptIn = (value: 'accepted' | 'declined', adult: boolean) => {
    if (value === 'accepted') track({ name: 'ad_optin_accept' })
    if (writeAdsenseOptIn(safeStorage(), value, adult, Date.now())) setOptIn(value)
  }
  const onWithdraw = () => {
    if (writeAdsenseOptIn(safeStorage(), 'declined', false, Date.now())) setOptIn('declined')
  }
  const labelled = adapter !== 'test' && adapter !== 'reserved'
  return (
    <div className={placement === 'rail' ? RAIL_CLASS : 'mx-auto my-6 max-w-3xl px-4 sm:px-6'}>
      <aside aria-label={tr('ads.label')} className="overflow-hidden rounded-xl border border-border bg-muted/20" style={{ minHeight: SLOT_HEIGHT_PX[placement] }} data-testid="ad-slot" data-placement={placement} data-adapter={adapter}>
        {labelled && <p className="px-4 pt-2 text-[11px] uppercase tracking-wide text-muted-foreground">{tr('ads.label')}</p>}
        <AdBody adapter={adapter} placement={placement} eligibility={eligibility} sectionKey={sectionKey} creative={creative ?? null} onOptIn={onOptIn} tr={tr} />
      </aside>
      <NetworkAdControls adapter={adapter} onWithdraw={onWithdraw} onNoAds={() => show('main')} tr={tr} />
    </div>
  )
}

/**
 * One ad slot (DESIGN-v3 §E). The box height is reserved before anything loads. Eligibility
 * comes from useAdEligibility: nothing with the stage off, off the course route, for Pro, admins
 * and testers; labelled local placeholders in QA test mode or ad preview (zero requests); house
 * promos for free learners by default. AdSense and EthicalAds exist but are off unless the owner
 * configures them. Keyed by the caller on sectionId, so it never refreshes on a sub-step change.
 */
export function AdSlot({ placement, sectionId }: { placement: AdPlacement; sectionId?: string }) {
  const stage = useCloudStage()
  const pathname = usePathname() ?? '/'
  const eligibility = useAdEligibility(pathname)
  if (stage === 'off' || eligibility === 'none') return null
  return <ActiveSlot placement={placement} sectionKey={sectionId ?? placement} eligibility={eligibility} stage={stage} />
}
