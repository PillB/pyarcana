/**
 * Every interface string the account, billing, QA and admin code asks for exists in all three
 * dictionaries. `t()` falls back to es-PE and then to the KEY ITSELF, so a missing key does not
 * fail anywhere else: the page shows "susc.refunds.body" to a learner. The parity gate only
 * compares the dictionaries with each other, so a key missing from all three passes it.
 *
 * Keys are collected two ways: every quoted literal with a cloud prefix in the source, and every
 * key a component builds from an enum (`adm.tab.${tab}`), expanded from the same constants the
 * components import, so a new enum value without words fails here.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { GRANT_KINDS, GRANT_STATES, REPORT_STATUSES, ROLE_STATES } from '@/lib/cloud/admin-api'
import { SURVEY_KINDS } from '@/lib/cloud/surveys'
import { legalBlocks, processors, type LegalKind } from '@/lib/cloud/legal-content'
import { CLOUD_CONFIG, type CloudConfig } from '@/lib/cloud/config'

const ROOT = process.cwd()
const LANGS = ['es-PE', 'es-ES', 'en'] as const
const PREFIXES = ['precios', 'susc', 'qasite', 'adm', 'legalc', 'cloudpage', 'qa\\.send', 'qa\\.mode', 'billing', 'cuenta', 'account', 'ads', 'survey', 'gate', 'trialcard', 'moved']
const LITERAL = new RegExp(`'((?:${PREFIXES.join('|')})\\.[A-Za-z0-9_.]+)'`, 'g')

function dictionary(lang: string): Set<string> {
  const text = readFileSync(join(ROOT, 'src/lib/i18n.ts'), 'utf8')
  const open = text.match(new RegExp(`'${lang}'\\s*:\\s*\\{`))
  assert.ok(open?.index !== undefined, lang)
  let depth = 1
  let i = open.index + open[0].length
  const start = i
  while (depth > 0 && i < text.length) {
    if (text[i] === '{') depth++
    else if (text[i] === '}') depth--
    i++
  }
  return new Set([...text.slice(start, i - 1).matchAll(/^\s*'([^']+)':\s*['"`]/gm)].map((m) => m[1]))
}

function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) return name === '__tests__' ? [] : sources(full)
    return /\.tsx?$/.test(name) ? [full] : []
  })
}

function literalKeys(): Map<string, string> {
  const files = [
    ...sources(join(ROOT, 'src/components/account')),
    ...sources(join(ROOT, 'src/lib/cloud')),
  ]
  const keys = new Map<string, string>()
  for (const file of files) {
    for (const m of readFileSync(file, 'utf8').matchAll(LITERAL)) keys.set(m[1], file.slice(ROOT.length + 1))
  }
  return keys
}

const ALL_ON: CloudConfig = {
  ...structuredClone(CLOUD_CONFIG),
  launchStage: 'paid',
  googleClientId: 'x.apps.googleusercontent.com',
  microsoftClientId: '11111111-2222-3333-4444-555555555555',
  rails: { peru: 'mercadopago', international: 'creem' },
}

function enumKeys(): string[] {
  const legalBlocksAll = (['privacy', 'cookies', 'data-rights', 'terms'] as LegalKind[]).flatMap((kind) =>
    [ALL_ON, { ...ALL_ON, ads: { ...ALL_ON.ads, provider: 'adsense' as const, adsenseClient: 'ca-pub-1' } }].flatMap((cfg) => legalBlocks(cfg, kind, 'paid'))
  )
  const procs = [
    ...processors({ ...ALL_ON, ads: { ...ALL_ON.ads, provider: 'adsense', adsenseClient: 'ca-pub-1' } }),
    ...processors({ ...ALL_ON, ads: { ...ALL_ON.ads, provider: 'ethicalads', ethicaladsPublisher: 'pub' } }),
  ]
  const bodies = new Set(legalBlocksAll.filter((b) => !['controller', 'processors', 'storageKeys', 'subscription'].includes(b)))
  return [
    ...['reports', 'grants', 'testers', 'accounts', 'experiments', 'surveys'].map((t) => `adm.tab.${t}`),
    ...['trial', ...GRANT_KINDS].map((k) => `adm.kind.${k}`),
    ...GRANT_STATES.map((s) => `adm.grantState.${s}`),
    ...ROLE_STATES.map((s) => `adm.roleState.${s}`),
    ...SURVEY_KINDS.map((k) => `adm.surveys.${k}`),
    ...REPORT_STATUSES.map((s) => `qasite.status.${s}`),
    ...['enable', 'disable'].flatMap((a) => [`adm.acct.${a}`, `adm.acct.${a}Title`, `adm.acct.${a}Body`]),
    ...['pe', 'world'].map((m) => `precios.market.${m}`),
    ...new Set(legalBlocksAll.map((b) => `legalc.${b}.h`)),
    ...[...bodies].map((b) => `legalc.${b}.body`),
    ...new Set(procs.map((p) => `legalc.proc.${p.key}`)),
    ...new Set(procs.filter((p) => p.country).map((p) => `legalc.country.${p.country}`)),
    'qasite.title',
    'adm.title',
  ]
}

test('every cloud interface key the source names exists in es-PE, es-ES and en', () => {
  const dicts = LANGS.map((l) => [l, dictionary(l)] as const)
  const missing: string[] = []
  for (const [key, file] of literalKeys()) {
    for (const [lang, dict] of dicts) if (!dict.has(key)) missing.push(`${lang} ${key} (${file})`)
  }
  assert.deepEqual(missing, [])
})

test('every key built from an enum (tabs, states, kinds, legal blocks, processors) exists in all three', () => {
  const dicts = LANGS.map((l) => [l, dictionary(l)] as const)
  const missing: string[] = []
  for (const key of enumKeys()) {
    for (const [lang, dict] of dicts) if (!dict.has(key)) missing.push(`${lang} ${key}`)
  }
  assert.deepEqual(missing, [])
})

test('the collector itself finds keys (a regex that matches nothing would pass the tests above)', () => {
  const keys = literalKeys()
  assert.ok(keys.has('susc.refunds.body'))
  assert.ok(keys.has('cuenta.back'))
  assert.ok(keys.size > 150, `only ${keys.size} keys found`)
  assert.ok(dictionary('en').has('cuenta.back'))
  assert.ok(!dictionary('en').has('nope.not.a.key'))
})
