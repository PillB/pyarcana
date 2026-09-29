/**
 * What the static export prerenders. The build runs these components with no window, the way
 * `next build` does, so the account, gate, ad, consent and survey UI must render NOTHING into the
 * HTML (the static-export guard forbids '>Entrar<', '>Planes<', 'Crear cuenta gratis' and
 * 'Panel de Administración' in out/index.html), even when the owner's config turns every stage on.
 * The section itself must still prerender through the gate.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement as h, type ComponentType } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { SessionProvider } from 'next-auth/react'
import { CLOUD_CONFIG, type CloudConfig } from '@/lib/cloud/config'
import { AccountButton } from '@/components/account/AccountButton'
import { AccountDialog } from '@/components/account/AccountDialog'
import { CloudSync } from '@/components/account/CloudSync'
import { MovedBanner } from '@/components/account/MovedBanner'
import { ConsentCard, ConsentFooterLink } from '@/components/account/ConsentCard'
import { SurveyPrompt } from '@/components/account/SurveyPrompt'
import { AdSlot } from '@/components/account/AdSlot'
import { TrialSoftCard, DashboardTrialCard } from '@/components/account/TrialSoftCard'
import { EntitlementGate } from '@/components/account/EntitlementGate'
import { StaticSiteNoticeText } from '@/components/account/StaticSiteNoticeText'
import { ProgressStorageNotice } from '@/components/account/ProgressStorageNotice'
import { AccountPage } from '@/components/account/AccountPage'

const render = (el: ReturnType<typeof h>) => renderToStaticMarkup(h(SessionProvider, { session: null, children: el }))

const SHIPPED: CloudConfig = structuredClone(CLOUD_CONFIG)
const EVERYTHING_ON: Partial<CloudConfig> = {
  launchStage: 'paid',
  canonicalOrigin: 'https://pyarcana.example',
  movedToCanonical: true,
  googleClientId: 'x.apps.googleusercontent.com',
  microsoftClientId: '11111111-2222-3333-4444-555555555555',
  termsVersion: '1.0',
  rails: { peru: 'mercadopago', international: 'creem' },
  legal: { sellerName: 'Titular', ruc: '10000000001', address: 'Lima', complaintsBookUrl: 'https://pyarcana.example/libro', supportEmail: 'soporte@pyarcana.example' },
  ads: { provider: 'adsense', adsenseClient: 'ca-pub-1', adsenseSlots: { section_end: '1' }, ethicaladsPublisher: '' },
}

function withConfig(patch: Partial<CloudConfig>, fn: () => void) {
  Object.assign(CLOUD_CONFIG, patch)
  try {
    fn()
  } finally {
    Object.assign(CLOUD_CONFIG, structuredClone(SHIPPED))
  }
}

const SILENT: Array<[string, () => ReturnType<typeof h>]> = [
  ['AccountButton', () => h(AccountButton)],
  ['AccountDialog', () => h(AccountDialog)],
  ['CloudSync', () => h(CloudSync)],
  ['MovedBanner', () => h(MovedBanner)],
  ['ConsentCard', () => h(ConsentCard)],
  ['ConsentFooterLink', () => h(ConsentFooterLink)],
  ['SurveyPrompt', () => h(SurveyPrompt)],
  ['AdSlot section_end', () => h(AdSlot, { placement: 'section_end', sectionId: 'functions' })],
  ['AdSlot resources_end', () => h(AdSlot, { placement: 'resources_end' })],
  ['TrialSoftCard at S05', () => h(TrialSoftCard, { sectionIndex: 5, sectionId: 'setup' })],
  ['DashboardTrialCard', () => h(DashboardTrialCard, { sections: [{ id: 'setup', index: 5 }] })],
]

for (const [label, config] of [['shipped config', {}], ['every stage and provider configured', EVERYTHING_ON]] as const) {
  test(`${label}: account, consent, survey, ad and trial UI prerender nothing`, () => {
    withConfig(config, () => {
      for (const [name, el] of SILENT) assert.equal(render(el()), '', name)
    })
  })

  test(`${label}: the gate prerenders the section itself, never a lock or a skeleton`, () => {
    withConfig(config, () => {
      const section = h('article', { 'data-testid': 'section-body' }, 'Contenido de la sección 6')
      const html = render(h(EntitlementGate, { sectionIndex: 6, sectionId: 'functions', onSelectSection: () => {}, children: section }))
      assert.equal(html, '<article data-testid="section-body">Contenido de la sección 6</article>')
    })
  })
}

test('the /cuenta page prerenders only its heading and the way back', () => {
  withConfig(EVERYTHING_ON, () => {
    const html = render(h(AccountPage))
    assert.match(html, /Tu cuenta de PyArcana/)
    assert.match(html, /Volver al curso/)
    assert.doesNotMatch(html, /Entrar|Cerrar sesión|Suscripción|no están disponibles/)
  })
})

test('the static notice prerenders the stage-off truth, and the storage notice keeps its words', () => {
  const notice = render(h(StaticSiteNoticeText as ComponentType<{ lang: 'es-PE' }>, { lang: 'es-PE' }))
  assert.match(notice, /solo en este navegador/)
  assert.doesNotMatch(notice, /Firebase|solo lectura/)
  const out = render(h(ProgressStorageNotice, { isSignedIn: false, english: false }))
  assert.match(out, /data-testid="progress-storage-notice"/)
  assert.match(out, /¿Dónde se guarda tu progreso\?/)
  const signedIn = render(h(ProgressStorageNotice, { isSignedIn: true, english: false }))
  assert.match(signedIn, /Sesión iniciada/)
  assert.match(signedIn, /href="\/data-rights"/)
})

test('nothing prerendered here contains the strings the static-export guard forbids', () => {
  withConfig(EVERYTHING_ON, () => {
    const all = [...SILENT.map(([, el]) => render(el())), render(h(AccountPage))].join('\n')
    for (const bad of ['Crear cuenta gratis', '>Planes<', '>Entrar<', 'Panel de Administración']) assert.ok(!all.includes(bad), bad)
  })
})
