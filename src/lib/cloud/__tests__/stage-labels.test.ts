import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { planLine } from '@/components/account/PlanSections'
import { PricingContent } from '@/components/account/PreciosPage'
import { CLOUD_CONFIG, LAUNCH_STAGES, type LaunchStage } from '@/lib/cloud/config'
import { gateDecision } from '@/lib/cloud/gate'
import { pricingView } from '@/lib/cloud/pricing-view'
import { parseMe, type MePayload } from '@/lib/cloud/session'
import { staticNoticeText } from '@/lib/cloud/ui-state'
import { t, type Language } from '@/lib/i18n'

// Handback 5 Oct 2026, item 4: in stage sync every section is open, but the account panel said
// "Gratuito: secciones 1 a 5". The gate was right; the label ignored the stage. Every place that
// prints "sections 1 to n" must follow the gate's stage.

const NOW = Date.parse('2026-10-05T12:00:00Z')
const N = CLOUD_CONFIG.gate.freeSections
const me = (access: Record<string, unknown>): MePayload => parseMe({ account: { id: 'acct_1', email: 'a@b.pe', trialAvailable: true }, access })!
const trFor = (lang: Language) => (k: string, v?: Record<string, string | number>) => t(k, lang).replace(/\{(\w+)\}/g, (_, n) => String(v?.[n] ?? ''))
const LIMITED = /secciones 1 a|sections 1 to/i

test('the plan line without Pro, per stage: all open in sync, "1 to n" only where the gate closes the rest', () => {
  const free = me({ isPro: false })
  for (const lang of ['es-PE', 'es-ES', 'en'] as const) {
    const tr = trFor(lang)
    assert.equal(planLine(free, tr, lang, 'sync', NOW), t('account.plan.allOpen', lang))
    assert.doesNotMatch(planLine(free, tr, lang, 'sync', NOW), LIMITED)
    for (const stage of ['beta', 'paid'] as const) assert.equal(planLine(free, tr, lang, stage, NOW), tr('account.plan.free', { n: N }), `${lang} ${stage}`)
  }
  assert.equal(planLine(free, trFor('es-PE'), 'es-PE', 'beta', NOW), `Gratuito: secciones 1 a ${N}.`)
})

test('a Pro account still reads its source in every stage', () => {
  const gift = me({ isPro: true, source: 'gift', accessEnd: null, indefinite: true })
  const tr = trFor('es-PE')
  for (const stage of LAUNCH_STAGES) assert.match(planLine(gift, tr, 'es-PE', stage, NOW), new RegExp(t('account.plan.source.gift', 'es-PE')))
})

test('sweep: nothing a learner can see in sync says "sections 1 to n", and nothing is locked', () => {
  const stage: LaunchStage = 'sync'
  for (const lang of ['es-PE', 'es-ES', 'en'] as const) {
    assert.doesNotMatch(staticNoticeText(stage, false, lang, N), LIMITED, `${lang} static notice`)
    assert.doesNotMatch(planLine(me({ isPro: false }), trFor(lang), lang, stage, NOW), LIMITED, `${lang} plan line`)
  }
  // /precios in sync: "not yet", not the "sections 1 to n are free" intro.
  const precios = renderToStaticMarkup(h(PricingContent, { view: pricingView(stage, CLOUD_CONFIG), trialDays: 7, onSubscribe: () => {} }))
  assert.doesNotMatch(precios, LIMITED)
  // The upgrade card (gate.body) shows only on a locked section, and sync locks none.
  for (let i = 1; i <= 52; i++) assert.equal(gateDecision({ stage, sectionIndex: i, freeSections: N, grandfathered: false, packaging: 'A', subStep: null, access: 'free' }), 'open')
})
