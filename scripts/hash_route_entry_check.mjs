#!/usr/bin/env node
/**
 * Every hash route of the course page, entered DIRECTLY (a fresh tab on BASE/#route), must hydrate:
 * no CSP violation, no page error, the account button rendered (cloud stage), the theme toggle
 * working, the language menu opening, and the view the hash names on screen.
 *
 * Regression for 24 Nov 2026: https://pyarcana.dev/#setup showed the prerendered landing with no
 * Entrar button and dead toggles, because two CSPs reached "/" and blocked its inline scripts. The
 * same HTML answers every "/#..." route, so they all broke; /empezar -> "Volver al curso" worked
 * because a client-side navigation never loads a new document (no new CSP header).
 *
 *   BASE=http://localhost:8788 node scripts/hash_route_entry_check.mjs     # local, prod rule order
 *   BASE=https://pyarcana.dev node scripts/hash_route_entry_check.mjs      # live
 *
 * Exit 1 on any failure, printing route, check, expected and actual. Set NO_ACCOUNT=1 off the
 * canonical origin (localhost, GitHub Pages): config.ts currentStage is 'off' there, so no account
 * button exists by design. CHROMIUM_PATH points at a preinstalled browser if needed.
 */
import { chromium } from 'playwright'

const BASE = (process.env.BASE || 'http://localhost:8788').replace(/\/+$/, '')
const EXPECT_ACCOUNT = process.env.NO_ACCOUNT !== '1'
/** [hash, what the desktop header crumb must contain] */
const ROUTES = [
  ['', 'Dashboard'],
  ['#home', 'Dashboard'],
  ['#setup', 'Sección 1'],
  ['#setup/ido', 'Sección 1'],
  ['#S05', 'Sección 5'],
  ['#resources', 'Recursos'],
  ['#capstones', 'Proyectos'],
  ['#familiarity', 'Familiarity'],
  ['#no-such-route', 'Dashboard'],
]
const failures = []
const fail = (route, check, expected, actual) => {
  failures.push({ route, check, expected, actual })
  console.log(`FAIL  ${route || '/'}  ${check}\n      expected: ${expected}\n      actual:   ${String(actual).slice(0, 300)}`)
}

async function checkRoute(browser, hash, crumb) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' })
  await ctx.addInitScript(() => {
    try { localStorage.setItem('pyarcana:tourCompleted', '1') } catch { /* no storage: the tour may open */ }
    window.__cspViolations = []
    document.addEventListener('securitypolicyviolation', (e) => window.__cspViolations.push(`${e.violatedDirective} ${e.blockedURI || 'inline'}`))
  })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  const res = await page.goto(`${BASE}/${hash}`, { waitUntil: 'networkidle', timeout: 60_000 })
  const cspHeaders = (await res.headersArray()).filter((h) => h.name.toLowerCase() === 'content-security-policy').length
  // Two policies on "/" are expected where the platform applies "/" before "/*" (both enforced;
  // the /* one has no hashes, so it allows what the page policy allows). Zero is a failure.
  if (cspHeaders < 1) fail(hash, 'Content-Security-Policy headers on the document', 'at least 1', cspHeaders)
  const hydrated = await page.waitForSelector('header.lg\\:flex [data-testid="theme-toggle"][title]', { timeout: 15_000 }).then(() => true, () => false)
  const violations = await page.evaluate(() => window.__cspViolations)
  if (violations.length) fail(hash, 'CSP violations', 0, violations.join(' | '))
  if (errors.length) fail(hash, 'page errors', 0, errors.join(' | '))
  if (!hydrated) {
    fail(hash, 'hydrated (theme toggle mounted)', true, false)
    await ctx.close()
    return
  }
  if (EXPECT_ACCOUNT && !(await page.locator('header.lg\\:flex [data-testid="account-button"]').count())) fail(hash, 'account button in the desktop header', 'present', 'absent')
  const header = (await page.locator('header.lg\\:flex > div').first().innerText()).replace(/\s+/g, ' ').trim()
  if (crumb && !header.includes(crumb)) fail(hash, 'view named by the hash (header crumb)', crumb, header)
  const before = await page.evaluate(() => document.documentElement.classList.contains('dark'))
  await page.locator('header.lg\\:flex [data-testid="theme-toggle"]').click()
  const after = await page.waitForFunction((b) => document.documentElement.classList.contains('dark') !== b, before, { timeout: 3000 }).then(() => true, () => false)
  if (!after) fail(hash, 'theme toggle flips the theme', !before ? 'dark' : 'light', before ? 'dark' : 'light')
  const toggle = page.locator('header.lg\\:flex [data-testid="language-toggle"] > button')
  await toggle.click()
  const expanded = await toggle.getAttribute('aria-expanded')
  const options = await page.locator('header.lg\\:flex [data-testid="language-toggle"] > div button').count()
  if (expanded !== 'true' || options < 3) fail(hash, 'language toggle opens its menu (aria-expanded, 3 languages)', 'true, 3', `${expanded}, ${options}`)
  console.log(`ok    ${hash || '/'}  csp=${cspHeaders} hydrated account=${EXPECT_ACCOUNT ? 'checked' : 'skipped'} crumb="${header}"`)
  await ctx.close()
}

// CHROMIUM_PATH: a preinstalled browser when the repo's Playwright has not downloaded its own.
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {})
for (const [hash, crumb] of ROUTES) await checkRoute(browser, hash, crumb)
await browser.close()
if (failures.length) {
  console.log(`\nhash_route_entry_check: ${failures.length} failure(s) on ${BASE}. Next step: if "CSP violations" or "hydrated" failed, compare the CSP headers of ${BASE}/ (curl -sI) with the page's inline scripts (src/lib/cloud/headers.ts verifyHeadersFile).`)
  process.exit(1)
}
console.log(`\nhash_route_entry_check: all ${ROUTES.length} routes hydrate on ${BASE}`)
