import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { parseUsage, usagePercent } from '@/lib/cloud/admin-api'
import { UsageView } from '@/components/account/admin/AdminUsage'
import { t } from '@/lib/i18n'

// The "Uso" admin tab (owner request 4 Oct 2026): D1 rows today against the free limits, by route,
// 14 days, and the budget level. The answer shape is workers/billing/src/usage.mjs handleAdminUsage.

const answer = {
  ok: true,
  level: 'amber',
  limits: { rowsRead: 5_000_000, rowsWritten: 100_000 },
  thresholds: { amber: 0.6, red: 0.85 },
  flushSeconds: 300,
  today: { day: '2026-10-04', rowsRead: 1_250_000, rowsWritten: 72_000 },
  sources: [{ source: 'PUT /v1/me/progress', rowsRead: 900, rowsWritten: 70_000 }, { source: 42 }, 'x'],
  days: [{ day: '2026-10-04', rowsRead: 1_250_000, rowsWritten: 72_000 }, { day: '2026-10-03', rowsRead: 10, rowsWritten: -5 }],
}

test('the usage answer is parsed field by field; junk rows dropped, negative counts floored, unknown level green', () => {
  const u = parseUsage(answer)
  assert.equal(u.level, 'amber')
  assert.deepEqual(u.today, { label: '2026-10-04', rowsRead: 1_250_000, rowsWritten: 72_000 })
  assert.deepEqual(u.sources, [{ label: 'PUT /v1/me/progress', rowsRead: 900, rowsWritten: 70_000 }])
  assert.equal(u.days[1].rowsWritten, 0)
  assert.equal(u.flushSeconds, 300)
  assert.equal(parseUsage({ level: 'purple' }).level, 'green')
  assert.deepEqual(parseUsage(null).limits, { rowsRead: 5_000_000, rowsWritten: 100_000 })
  assert.equal(usagePercent(72_000, 100_000), 72)
  assert.equal(usagePercent(1, 0), 0)
})

test('the tab shows the level, both meters as a share of the limit, the routes and the days', () => {
  const html = renderToStaticMarkup(h(UsageView, { u: parseUsage(answer) }))
  assert.match(html, /data-level="amber"/)
  assert.ok(html.includes(t('adm.usage.level.amber', 'es-PE')), 'level named')
  assert.match(html, /72[.,  ]?000 de 100[.,  ]?000 \(72 %\)/, 'writes as a share of the free limit')
  assert.match(html, /aria-valuenow="25"/, 'reads meter at 25 %')
  assert.match(html, /PUT \/v1\/me\/progress/)
  assert.match(html, /data-testid="usage-days"/)
  assert.ok(html.includes('cada 5 minutos'), 'the note names the flush interval')
})

test('an empty day says so instead of an empty table; every usage key exists in all three languages', () => {
  const html = renderToStaticMarkup(h(UsageView, { u: parseUsage({ level: 'green' }) }))
  assert.ok(html.includes(t('adm.usage.none', 'es-PE')))
  assert.doesNotMatch(html, /usage-sources/)
  const keys = ['adm.tab.usage', 'adm.usage.what', 'adm.usage.note', 'adm.usage.banner.amber', 'adm.usage.banner.red', 'adm.usage.level.red.detail', 'account.sync.deferred']
  for (const lang of ['es-PE', 'es-ES', 'en'] as const) for (const k of keys) assert.notEqual(t(k, lang), k, `${lang} ${k}`)
})
