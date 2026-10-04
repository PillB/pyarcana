import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { CLOUD_CONFIG, effectiveStage, normalizeOrigin, currentStage, type CloudConfig } from '@/lib/cloud/config'
import { getPlanByCode } from '@/lib/subscription-plans'

const CANON = 'https://pyarcana.example'
const onCanonical = { origin: CANON, isStaticSite: true }

function cfg(patch: Partial<CloudConfig> = {}): CloudConfig {
  return { ...CLOUD_CONFIG, canonicalOrigin: CANON, ...patch }
}

const LEGAL_COMPLETE = {
  sellerName: 'Titular de prueba',
  ruc: '10000000001',
  address: 'Av. Ejemplo 123, Lima',
  complaintsBookUrl: 'https://pyarcana.example/reclamaciones',
  supportEmail: 'soporte@pyarcana.example',
}

test('shipped defaults keep the live site unchanged: stage off, nothing configured', () => {
  assert.equal(CLOUD_CONFIG.launchStage, 'off')
  // DESIGN-v3 §K/§L prefill: public values, inert while the stage is off and movedToCanonical false.
  assert.equal(CLOUD_CONFIG.canonicalOrigin, 'https://pyarcana.dev')
  assert.equal(CLOUD_CONFIG.movedToCanonical, false)
  assert.equal(CLOUD_CONFIG.legal.supportEmail, 'soporte@pyarcana.dev')
  assert.equal(CLOUD_CONFIG.apiBaseUrl, '/api')
  // The registered Google OAuth web client (setup thread, 1 Oct 2026): public, inert while the stage is off.
  assert.equal(CLOUD_CONFIG.googleClientId, '432743649609-a450e9saoe4akd98dt3gsnous80vblj4.apps.googleusercontent.com')
  // The registered Entra app (setup thread, 1 Oct 2026): a public id, inert while the stage is off.
  assert.equal(CLOUD_CONFIG.microsoftClientId, '171fb4ff-f112-46b2-9043-92ecb97f56fe')
  assert.equal(CLOUD_CONFIG.microsoftAuthority, 'common')
  // Deploy day, 4 Oct 2026: the k1 public key setup.sh printed (the worker's /api/v1/jwks serves the same).
  assert.deepEqual(CLOUD_CONFIG.licence.publicKeys.map((k) => [k.kid, k.kty, k.crv, k.alg]), [['k1', 'EC', 'P-256', 'ES256']])
  assert.equal(CLOUD_CONFIG.licence.publicKeys[0].x, 'QlsNt0JdgF6krSYFxH8RyDVJIrw-fCpw6zN1zsaUuqo')
  assert.ok(CLOUD_CONFIG.licence.publicKeys.every((k) => !('d' in k)), 'never a private key in the site')
  assert.equal(CLOUD_CONFIG.termsVersion, '2026-10-04')
  assert.equal(CLOUD_CONFIG.gate.packaging, 'A')
  assert.equal(CLOUD_CONFIG.ads.provider, 'house')
  assert.equal(CLOUD_CONFIG.consent.mode, 'everywhere')
  assert.equal(CLOUD_CONFIG.experiments.allowAutomation, false)
  assert.equal(effectiveStage(CLOUD_CONFIG, { origin: 'https://pillb.github.io', isStaticSite: true }), 'off')
  assert.equal(effectiveStage(CLOUD_CONFIG, { origin: CANON, isStaticSite: true }), 'off')
  assert.equal(effectiveStage(CLOUD_CONFIG, { origin: 'https://pyarcana.dev', isStaticSite: true }), 'off')
  // Paid still needs every other legal field: the support address alone does not open payments.
  assert.equal(effectiveStage({ ...CLOUD_CONFIG, launchStage: 'paid', rails: { peru: 'mercadopago', international: '' } }, { origin: 'https://pyarcana.dev', isStaticSite: true }), 'beta')
})

test('free sections come from the free plan (5 today), not a second copy of the number', () => {
  assert.equal(CLOUD_CONFIG.gate.freeSections, getPlanByCode('free')!.maxSections)
  assert.equal(CLOUD_CONFIG.gate.freeSections, 5)
})

test('stage is off unless the origin is exactly the canonical origin', () => {
  const c = cfg({ launchStage: 'sync' })
  assert.equal(effectiveStage(c, onCanonical), 'sync')
  assert.equal(effectiveStage(c, { origin: 'https://pillb.github.io', isStaticSite: true }), 'off')
  assert.equal(effectiveStage(c, { origin: 'https://pyarcana.example.evil.test', isStaticSite: true }), 'off')
  assert.equal(effectiveStage(c, { origin: 'http://pyarcana.example', isStaticSite: true }), 'off')
  assert.equal(effectiveStage(c, { origin: null, isStaticSite: true }), 'off')
})

test('a canonical origin with a trailing slash still matches; one with a path or query does not', () => {
  assert.equal(effectiveStage(cfg({ launchStage: 'sync', canonicalOrigin: CANON + '/' }), onCanonical), 'sync')
  assert.equal(effectiveStage(cfg({ launchStage: 'sync', canonicalOrigin: CANON + '/pyarcana' }), onCanonical), 'off')
  assert.equal(effectiveStage(cfg({ launchStage: 'sync', canonicalOrigin: CANON + '/?x=1' }), onCanonical), 'off')
  assert.equal(effectiveStage(cfg({ launchStage: 'sync', canonicalOrigin: 'not a url' }), onCanonical), 'off')
})

test('http is accepted only for localhost (local E2E), never for a public host', () => {
  assert.equal(normalizeOrigin('http://localhost:3000'), 'http://localhost:3000')
  assert.equal(normalizeOrigin('http://127.0.0.1:8787/'), 'http://127.0.0.1:8787')
  assert.equal(normalizeOrigin('http://pyarcana.example'), null)
  assert.equal(normalizeOrigin('https://user:pw@pyarcana.example'), null)
  assert.equal(normalizeOrigin('javascript:alert(1)'), null)
})

test('stage is off in the dynamic LMS build and when the API base is empty', () => {
  assert.equal(effectiveStage(cfg({ launchStage: 'beta' }), { origin: CANON, isStaticSite: false }), 'off')
  assert.equal(effectiveStage(cfg({ launchStage: 'beta', apiBaseUrl: '' }), onCanonical), 'off')
  assert.equal(effectiveStage(cfg({ launchStage: 'beta', apiBaseUrl: '   ' }), onCanonical), 'off')
})

test('an unknown stage value fails closed to off', () => {
  assert.equal(effectiveStage(cfg({ launchStage: 'prod' as never }), onCanonical), 'off')
})

test('paid degrades to beta without a payment rail', () => {
  const c = cfg({ launchStage: 'paid', legal: LEGAL_COMPLETE, rails: { peru: '', international: '' } })
  assert.equal(effectiveStage(c, onCanonical), 'beta')
})

test('paid degrades to beta when any legal field is empty or blank', () => {
  const rails = { peru: 'mercadopago' as const, international: 'creem' as const }
  for (const field of Object.keys(LEGAL_COMPLETE) as Array<keyof typeof LEGAL_COMPLETE>) {
    for (const value of ['', '   ']) {
      const c = cfg({ launchStage: 'paid', rails, legal: { ...LEGAL_COMPLETE, [field]: value } })
      assert.equal(effectiveStage(c, onCanonical), 'beta', `${field}=${JSON.stringify(value)}`)
    }
  }
})

test('paid holds with one configured rail and every legal field', () => {
  const peruOnly = cfg({ launchStage: 'paid', legal: LEGAL_COMPLETE, rails: { peru: 'mercadopago', international: '' } })
  const worldOnly = cfg({ launchStage: 'paid', legal: LEGAL_COMPLETE, rails: { peru: '', international: 'creem' } })
  assert.equal(effectiveStage(peruOnly, onCanonical), 'paid')
  assert.equal(effectiveStage(worldOnly, onCanonical), 'paid')
})

test('beta and sync pass through unchanged on the canonical origin', () => {
  assert.equal(effectiveStage(cfg({ launchStage: 'beta' }), onCanonical), 'beta')
  assert.equal(effectiveStage(cfg({ launchStage: 'sync' }), onCanonical), 'sync')
})

test('currentStage is off during server rendering (no window)', () => {
  assert.equal(currentStage(), 'off')
})

test('config.ts commits no personal mailbox (role addresses on the business domain only)', () => {
  const source = readFileSync(join(process.cwd(), 'src/lib/cloud/config.ts'), 'utf8')
  assert.doesNotMatch(source, /@(gmail|googlemail|hotmail|outlook|yahoo)\./i)
})

test('the committed stage reaches only the root build (deploy.sh); GitHub Pages, tests and dev build at off', async () => {
  const { buildStage, COMMITTED_LAUNCH_STAGE } = await import('@/lib/cloud/config')
  // Owner decision 4 Oct 2026: accounts and sync on, no gate.
  assert.equal(COMMITTED_LAUNCH_STAGE, 'sync')
  assert.equal(buildStage('sync', ''), 'sync', 'the root build for https://pyarcana.dev')
  assert.equal(buildStage('sync', '/pyarcana'), 'off', 'the GitHub Pages edition')
  assert.equal(buildStage('sync', undefined), 'off', 'tests and local dev')
  assert.equal(buildStage('paid', '/pyarcana'), 'off')
  // This test process has no base path, so the shipped CLOUD_CONFIG is the GitHub Pages one: off.
  assert.equal(CLOUD_CONFIG.launchStage, 'off')
})
