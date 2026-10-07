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
import { PreciosPage, PricingContent } from '@/components/account/PreciosPage'
import { SuscripcionPage, SubscriptionContent } from '@/components/account/SuscripcionPage'
import { QaSitePage, NotComplaintsNotice } from '@/components/account/QaSitePage'
import { AdminPage } from '@/components/account/admin/AdminPage'
import { CloudLegalSection } from '@/components/account/CloudLegalSection'
import { CloudRelatedLinks } from '@/components/account/CloudRelatedLinks'
import { ThirdPartyClaim } from '@/components/account/ThirdPartyClaim'
import { QaModeBadge, QaSendIssueSlot, QaSessionSlot } from '@/components/account/QaCloudSlots'
import { pricingView } from '@/lib/cloud/pricing-view'
import type { QAIssue } from '@/lib/qa-session'

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
  legal: { sellerName: 'Titular', ruc: '10000000001', address: 'Lima', complaintsBookUrl: 'https://pyarcana.example/libro', supportEmail: 'soporte@pyarcana.example', rnpd: 'RNPD-0001' },
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
  ['AdSlot rail', () => h(AdSlot, { placement: 'rail', sectionId: 'functions' })],
  ['TrialSoftCard at S05', () => h(TrialSoftCard, { sectionIndex: 5, sectionId: 'setup' })],
  ['DashboardTrialCard', () => h(DashboardTrialCard, { sections: [{ id: 'setup', index: 5 }] })],
  ['CloudLegalSection privacy', () => h(CloudLegalSection, { kind: 'privacy' })],
  ['CloudLegalSection cookies', () => h(CloudLegalSection, { kind: 'cookies' })],
  ['CloudLegalSection data-rights', () => h(CloudLegalSection, { kind: 'data-rights' })],
  ['CloudLegalSection terms', () => h(CloudLegalSection, { kind: 'terms' })],
  ['CloudRelatedLinks', () => h(CloudRelatedLinks, { className: 'x' })],
  ['QaModeBadge', () => h(QaModeBadge)],
  ['QaSendIssueSlot', () => h(QaSendIssueSlot, { issue: { id: 'qa_1', title: 't' } as QAIssue, tester: 'ana', onSent: () => {} })],
  ['QaSessionSlot', () => h(QaSessionSlot, { issues: [], tester: 'ana', onSent: () => {} })],
]

/** The four C3 pages: [name, element, the heading the frame prerenders]. */
const CLOUD_PAGES: Array<[string, () => ReturnType<typeof h>, RegExp]> = [
  ['/precios', () => h(PreciosPage), /<h1[^>]*>Precios de PyArcana Pro<\/h1>/],
  ['/suscripcion', () => h(SuscripcionPage), /<h1[^>]*>Cómo funciona la suscripción<\/h1>/],
  ['/qa', () => h(QaSitePage), /<h1[^>]*>Reportes de control de calidad \(QA\)<\/h1>/],
  ['/admin', () => h(AdminPage), /<h1[^>]*>Administración<\/h1>/],
]

/** Words that only exist once accounts run: none may reach the exported HTML of these pages. */
const ACCOUNT_ONLY = /cloud-page-off|no está disponible|pricing-content|subscription-content|price-table|S\/ 19|US\$|Mis reportes|Todos los reportes|Pro regalado|Libro de Reclamaciones|qa-not-complaints|Entrar|Suscribirme|role="status"|admin-grants/


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

for (const [label, config] of [['shipped config', {}], ['every stage and provider configured', EVERYTHING_ON]] as const) {
  test(`${label}: /precios, /suscripcion, /qa and /admin prerender only their heading and the way back`, () => {
    withConfig(config, () => {
      for (const [name, el, heading] of CLOUD_PAGES) {
        const html = render(el())
        assert.match(html, heading, name)
        assert.match(html, /Volver al curso/, name)
        assert.doesNotMatch(html, ACCOUNT_ONLY, name)
      }
    })
  })
}

test('every C3 page prerenders a real link back to the course root', () => {
  for (const [name, el] of CLOUD_PAGES) assert.match(render(el()), /<a [^>]*href="\/"[^>]*>Volver al curso<\/a>/, name)
})

test('the "sin cookies de terceros" and "no compartimos" claims render only while the build keeps them true', () => {
  const claim = (kind: 'cookies' | 'ads', cfg: CloudConfig) => render(h(ThirdPartyClaim, { kind, cfg, children: h('p', null, 'CLAIM') }))
  assert.equal(claim('cookies', SHIPPED), '<p>CLAIM</p>')
  assert.equal(claim('ads', SHIPPED), '<p>CLAIM</p>')
  const google = { ...SHIPPED, launchStage: 'sync' as const, googleClientId: 'x.apps.googleusercontent.com' }
  assert.equal(claim('cookies', google), '')
  assert.equal(claim('ads', google), '<p>CLAIM</p>')
  const adsense = { ...SHIPPED, ...EVERYTHING_ON } as CloudConfig
  assert.equal(claim('cookies', adsense), '')
  assert.equal(claim('ads', adsense), '')
})

const PAID = { ...structuredClone(CLOUD_CONFIG), ...EVERYTHING_ON } as CloudConfig

test('/suscripcion states the mechanics the worker enforces and promises no refund window', () => {
  const html = render(h(SubscriptionContent, { stage: 'paid', cfg: PAID, trialDays: 7 }))
  assert.match(html, /7 días/)
  assert.match(html, /sin tarjeta|No pedimos tarjeta/i)
  assert.match(html, /se renueva/i)
  assert.match(html, /mismo lugar/)
  assert.match(html, /id="devoluciones"/)
  assert.match(html, /según la ley aplicable y, en compras internacionales, los términos de Creem/)
  assert.match(html, /primera vez que entras/)
  assert.match(html, /puede retirar/)
  // writing_rules A3 (fix round 2026-09-29): the acronym is expanded where the number is shown.
  assert.match(html, /RUC \(Registro Único de Contribuyentes\) 10000000001/)
  assert.match(html, /href="https:\/\/pyarcana.example\/libro"/)
  assert.match(html, /Python®/)
  assert.match(html, /no está afiliado a la Python Software Foundation/)
  assert.doesNotMatch(html, /14 días|reembolso garantizado|devolvemos tu dinero/i)
  const noOwner = render(h(SubscriptionContent, { stage: 'beta', cfg: SHIPPED, trialDays: null }))
  assert.doesNotMatch(noOwner, /RUC \d|Contribuyentes\) \d|Libro de Reclamaciones|Vendedor:/)
  assert.match(noOwner, /no se abren hasta que/)
  assert.match(noOwner, /id="devoluciones"/)
  assert.match(render(h(SubscriptionContent, { stage: 'sync', cfg: PAID, trialDays: 7 })), /^<p[^>]*>[^<]+<\/p>$/)
})

test('/precios shows the checkout prices, a pay button only where payments are open', () => {
  const beta = render(h(PricingContent, { view: pricingView('beta', PAID), trialDays: 7, onSubscribe: () => {} }))
  assert.match(beta, /S\/ 19\.90 al mes/)
  assert.match(beta, /S\/ 119\.90 al año/)
  assert.match(beta, /US\$ 7\.99 al mes/)
  assert.match(beta, /IGV \(impuesto general a las ventas\) incluido/)
  assert.match(beta, /Todavía no se puede pagar en el sitio\./)
  assert.doesNotMatch(beta, /<button/)
  assert.match(beta, /Python®/)
  const paid = render(h(PricingContent, { view: pricingView('paid', PAID), trialDays: 7, onSubscribe: () => {} }))
  assert.match(paid, /<button[^>]*>Suscribirme<\/button>/)
  const sync = render(h(PricingContent, { view: pricingView('sync', PAID), trialDays: 7, onSubscribe: () => {} }))
  assert.doesNotMatch(sync, /S\/|US\$/)
})

test('/qa says it is not the Libro de Reclamaciones and links the book only when it is https', () => {
  const shipped = render(h(NotComplaintsNotice))
  assert.match(shipped, /no es el Libro de Reclamaciones/)
  assert.doesNotMatch(shipped, /<a /)
  withConfig(EVERYTHING_ON, () => {
    assert.match(render(h(NotComplaintsNotice)), /<a href="https:\/\/pyarcana.example\/libro"/)
  })
})

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
    const all = [...SILENT.map(([, el]) => render(el())), render(h(AccountPage)), ...CLOUD_PAGES.map(([, el]) => render(el()))].join('\n')
    for (const bad of ['Crear cuenta gratis', '>Planes<', '>Entrar<', 'Panel de Administración']) assert.ok(!all.includes(bad), bad)
  })
})
