/**
 * Contrast and rendered-markup checks for the client review findings 2, 4, 5, 6, 21 and 23.
 * Ratios are computed from the site's tokens and the classes the components actually use
 * (contrast.ts); markup comes from renderToStaticMarkup, so effects do not run.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { SessionProvider } from 'next-auth/react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CLOUD_CONFIG, type CloudConfig } from '@/lib/cloud/config'
import { parseMe } from '@/lib/cloud/session'
import { ERROR_ALERT_CLASS, LEGAL_CHECKBOX_CLASS } from '@/components/account/a11y'
import { ErrorAlert } from '@/components/account/Alerts'
import { AdsenseOptIn, NetworkAdControls } from '@/components/account/AdSlot'
import { UpgradeCard } from '@/components/account/UpgradeCard'
import { AccountPanel } from '@/components/account/AccountPanel'
import { HeadingLevel } from '@/components/account/PlanSections'
import { TrialCardBody } from '@/components/account/TrialSoftCard'
import { ScoreScale } from '@/components/account/SurveyPrompt'
import { CloudLegalContent } from '@/components/account/CloudLegalSection'
import { classColour, over, ratio, tokenColour, type Theme } from './contrast'

const render = (el: ReturnType<typeof h>) => renderToStaticMarkup(h(SessionProvider, { session: null, children: el }))
const THEMES: Theme[] = ['light', 'dark']
/** Surfaces the account UI sits on: the dialog (bg-background) and the /cuenta card (bg-card). */
const SURFACES = ['background', 'card']

function textContrast(classes: string, theme: Theme, surface: string): number {
  const base = tokenColour(surface, theme)
  const bgSpec = classColour(classes, 'bg', theme)
  const fill = bgSpec ? over(tokenColour(bgSpec, theme), base) : base
  const fg = tokenColour(classColour(classes, 'text', theme) ?? 'foreground', theme)
  return ratio(fg, fill)
}

test('the resolver reproduces the finding: text-destructive on bg-destructive/5 is under 4.5:1 in light mode', () => {
  const old = 'border-destructive/40 bg-destructive/5 text-destructive'
  const r = textContrast(old, 'light', 'background')
  assert.ok(r < 4.5 && r > 3.5, `old error alert ${r.toFixed(2)}:1`)
})

test('5: account and billing errors meet WCAG 1.4.3 (4.5:1) in both themes on every surface', () => {
  for (const theme of THEMES) {
    for (const surface of SURFACES) {
      const r = textContrast(ERROR_ALERT_CLASS, theme, surface)
      assert.ok(r >= 4.5, `${theme} on ${surface}: ${r.toFixed(2)}:1`)
    }
  }
  const html = render(h(ErrorAlert, { error: { key: 'account.error.generic' } }))
  assert.ok(html.includes(`class="${ERROR_ALERT_CLASS}"`), 'ErrorAlert renders the checked classes')
  const files = ['src/components/account', 'src/components/account/admin'].flatMap((d) => readdirSync(d).filter((f) => f.endsWith('.tsx')).map((f) => `${d}/${f}`))
  const unchecked = files.filter((f) => /\btext-destructive\b/.test(readFileSync(f, 'utf8')))
  assert.deepEqual(unchecked, [], 'error text uses ERROR_ALERT_CLASS, whose contrast is computed here')
})

test('6: legally material checkboxes have a 3:1 boundary (WCAG 1.4.11) in both themes', () => {
  const old = tokenColour('input', 'light')
  assert.ok(ratio(old, tokenColour('background', 'light')) < 1.5, 'the finding reproduces with border-input')
  for (const theme of THEMES) {
    for (const surface of SURFACES) {
      const spec = classColour(LEGAL_CHECKBOX_CLASS, 'border', theme)
      assert.ok(spec, 'a border colour is set')
      const r = ratio(tokenColour(spec, theme), tokenColour(surface, theme))
      assert.ok(r >= 3, `${theme} on ${surface}: ${r.toFixed(2)}:1`)
    }
  }
  for (const [file, ids] of [
    ['CheckoutConfirmPanel.tsx', 1],
    ['SignInPanel.tsx', 1],
    ['AdSlot.tsx', 1],
  ] as const) {
    const src = readFileSync(`src/components/account/${file}`, 'utf8')
    const boxes = [...src.matchAll(/<Checkbox [^>]*>/g)].map((m) => m[0])
    assert.ok(boxes.length >= ids, file)
    for (const box of boxes) assert.match(box, /LEGAL_CHECKBOX_CLASS/, `${file}: ${box}`)
  }
})

test('4: both owner-choice buttons are readable (the old mix painted primary-foreground on the outline background)', () => {
  const mixed = cn(buttonVariants(), buttonVariants({ variant: 'outline' }))
  assert.ok(textContrast(mixed, 'light', 'background') < 1.5, 'the finding reproduces')
  for (const variant of ['outline', 'default'] as const) {
    const classes = buttonVariants({ variant })
    for (const theme of THEMES) {
      const r = textContrast(classes, theme, 'background')
      assert.ok(r >= 4.5, `${variant} ${theme}: ${r.toFixed(2)}:1`)
    }
  }
})

test('21: the AdSense opt-in links to the cookies page, and a shown Google ad offers withdrawal', () => {
  const optIn = render(h(AdsenseOptIn, { onAnswer: () => {}, tr: (k: string) => k }))
  assert.match(optIn, /href="\/cookies#cloud-legal"/)
  assert.match(optIn, /ads\.optin\.privacy/)
  const shown = render(h(NetworkAdControls, { adapter: 'adsense', onWithdraw: () => {}, onNoAds: () => {}, tr: (k: string) => k }))
  assert.match(shown, /ads\.optin\.withdraw/)
  const ethical = render(h(NetworkAdControls, { adapter: 'ethicalads', onWithdraw: () => {}, onNoAds: () => {}, tr: (k: string) => k }))
  assert.doesNotMatch(ethical, /ads\.optin\.withdraw/, 'EthicalAds has no opt-in to withdraw')
})

const ME = parseMe({ account: { id: 'acct_1', email: 'ana@example.pe', trialAvailable: true }, access: { isPro: false, source: null, accessEnd: null, indefinite: false } })!

test('23: the locked section has an h1; /cuenta goes h1 -> h2; the trial aside is labelled; the radio group has one tab stop', () => {
  const locked = render(h(UpgradeCard, { sectionIndex: 6, sectionId: 'x', onBackToFree: () => {} }))
  assert.match(locked, /<h1[ >]/)
  const panel = render(h(HeadingLevel, { level: 2, children: h(AccountPanel, { me: ME }) }))
  assert.match(panel, /<h2[ >]/)
  assert.doesNotMatch(panel, /<h3[ >]/)
  const dialogPanel = render(h(AccountPanel, { me: ME }))
  assert.match(dialogPanel, /<h3[ >]/, 'inside the dialog (title is h2) sections stay h3')
  const card = render(h(TrialCardBody, { sectionId: 'x', onDismiss: () => {} }))
  const labelledBy = /<aside aria-labelledby="([^"]+)"/.exec(card)?.[1]
  assert.ok(labelledBy && card.includes(`id="${labelledBy}"`), card.slice(0, 200))
  const scale = render(h(ScoreScale, { kind: 'section_csat', score: null, setScore: () => {}, tr: (k: string) => k }))
  assert.equal((scale.match(/tabindex="0"/g) ?? []).length, 1)
  assert.equal((scale.match(/tabindex="-1"/g) ?? []).length, 4)
})

const ON: CloudConfig = { ...structuredClone(CLOUD_CONFIG), launchStage: 'sync' }

test('2: the account section is the anchor the sign-in links target, and it says it supersedes the edition text above', () => {
  const html = render(h(CloudLegalContent, { kind: 'privacy', cfg: ON, stage: 'sync' }))
  assert.match(html, /<section[^>]* id="cloud-legal"/)
  assert.match(html, /pyarcana\.dev|esta sección/)
  const cookies = render(h(CloudLegalContent, { kind: 'cookies', cfg: ON, stage: 'sync' }))
  assert.match(cookies, /Medición del uso/)
})
