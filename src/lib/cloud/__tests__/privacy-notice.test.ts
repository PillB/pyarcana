import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { CLOUD_CONFIG, type CloudConfig } from '@/lib/cloud/config'
import { AccountEditionPrivacy } from '@/components/legal/privacy/AccountEditionPrivacy'
import { PagesEditionPrivacy } from '@/components/legal/privacy/PagesEditionPrivacy'
import { ARCO_DAYS, RETENTION_DAYS, SESSION_IDLE_DAYS, SESSION_MAX_DAYS } from '@/lib/legal/retention-facts'
import * as sweep from '../../../../workers/billing/src/retention.mjs'
import * as sessions from '../../../../workers/billing/src/sessions.mjs'

// D4 audit (setup thread, 4 Oct 2026), P1: /privacy must describe the real stack in the PRERENDERED
// HTML, name the holder (or say it is being formed), the RNPD state, processors and the transfer
// to the US, retention per kind of data, ARCO deadlines, minors and breach notice.

const text = (el: ReturnType<typeof h>) => renderToStaticMarkup(el).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
const SYNC: CloudConfig = { ...structuredClone(CLOUD_CONFIG), launchStage: 'sync' }

test('the printed retention periods are the ones the worker enforces', () => {
  assert.equal(RETENTION_DAYS.signinRecords, sweep.SIGNIN_RECORD_DAYS)
  assert.equal(RETENTION_DAYS.reportClosed, sweep.CLOSED_REPORT_DAYS)
  assert.equal(RETENTION_DAYS.reportMax, sweep.REPORT_MAX_DAYS)
  assert.equal(RETENTION_DAYS.screenshotClosed, sweep.CLOSED_REPORT_SCREENSHOT_DAYS)
  assert.equal(RETENTION_DAYS.screenshotMax, sweep.REPORT_SCREENSHOT_MAX_DAYS)
  assert.equal(RETENTION_DAYS.measurement, sweep.MEASUREMENT_DAYS)
  assert.equal(RETENTION_DAYS.surveys, sweep.SURVEY_DAYS)
  assert.equal(RETENTION_DAYS.qaSessions, sweep.QA_SESSION_DAYS)
  assert.equal(RETENTION_DAYS.audit, sweep.AUDIT_DAYS)
  assert.equal(SESSION_IDLE_DAYS * 86400, sessions.SESSION_WINDOW_SECONDS)
  assert.equal(SESSION_MAX_DAYS, 180, 'wrangler.toml SESSION_MAX_DAYS default')
})

test('account edition: the real stack, nothing from the Firebase era', () => {
  const t = text(h(AccountEditionPrivacy, { cfg: SYNC }))
  for (const gone of [/Firebase/, /Firestore/, /PostgreSQL/i, /bcrypt/, /30 días hábiles/, /ANPDP/, /003-2013/]) assert.doesNotMatch(t, gone)
  for (const must of [/Cloudflare/, /Google/, /Microsoft/, /Hostinger/, /jsDelivr/, /Estados Unidos/, /transferencia internacional/,
    /Ley N° 29733/, /016-2024-JUS/, /Registro Nacional de Protección de Datos Personales \(RNPD\)/, /Autoridad Nacional de Protección de Datos Personales \(ANPD\)/]) {
    assert.match(t, must)
  }
})

test('account edition: holder being formed (no personal data) and sign-up closed; RNPD in progress, then its number', () => {
  const pending = text(h(AccountEditionPrivacy, { cfg: SYNC }))
  assert.match(pending, /empresa que estamos constituyendo/)
  assert.match(pending, /no abrimos cuentas nuevas al público/)
  assert.match(pending, /inscripción en trámite/)
  const named: CloudConfig = { ...SYNC, legal: { ...SYNC.legal, sellerName: 'PyArcana E.I.R.L.', address: 'Av. Ejemplo 123, Lima', ruc: '20123456789', rnpd: 'RNPD-PJP-123' } }
  const done = text(h(AccountEditionPrivacy, { cfg: named }))
  assert.match(done, /PyArcana E\.I\.R\.L\..*Av\. Ejemplo 123, Lima.*Registro Único de Contribuyentes \(RUC\) 20123456789/)
  assert.match(done, /Número de inscripción: RNPD-PJP-123/)
  assert.doesNotMatch(done, /constituyendo|en trámite|no abrimos cuentas/)
})

test('account edition: retention per kind of data, ARCO deadlines, minors and breach notice', () => {
  const t = text(h(AccountEditionPrivacy, { cfg: SYNC }))
  assert.match(t, /se borran 2 años después de que la sesión vence/)
  assert.match(t, /El texto se borra 1 año después de cerrar el reporte, o 2 años después de enviarlo/)
  assert.match(t, /captura se borra 90 días después de cerrar el reporte, o 180 días/)
  assert.match(t, /medición anónima.*180 días/)
  assert.match(t, /Si eres tester del curso.*Se borra 1 año después de la última actividad de la sesión/)
  assert.match(t, /Podemos eliminar las cuentas sin inicios de sesión durante 2 años/)
  assert.match(t, /no guardamos datos de pago/)
  assert.match(t, /Cloudflare.*dirección IP y los datos de cada petición.*estadísticas de tráfico agregadas.*según sus propios plazos/, 'Cloudflare\'s own traffic data (handback 5 Oct 2026, item 5)')
  assert.match(t, new RegExp(`${ARCO_DAYS.access} días hábiles.*${ARCO_DAYS.other} días hábiles`))
  assert.match(t, /14 años o más/)
  assert.match(t, /Desde los 14 años puedes aceptar este aviso tú mismo/)
  assert.match(t, /avisaremos a la ANPD dentro de las 48 horas/)
  assert.match(t, /sin demora indebida/)
  assert.match(t, /privacy@pyarcana\.dev/)
  assert.match(t, /Resumen rápido/)
})

test('GitHub Pages edition: no accounts, progress only in the browser, the hosts that see an IP named', () => {
  const t = text(h(PagesEditionPrivacy))
  assert.match(t, /no tiene cuentas/)
  assert.match(t, /GitHub Pages/)
  assert.match(t, /jsDelivr/)
  assert.match(t, /Resumen rápido/)
  for (const gone of [/Firebase/, /PostgreSQL/i, /Cloudflare/, /RNPD/]) assert.doesNotMatch(t, gone)
})
