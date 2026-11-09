import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { CLOUD_CONFIG, type CloudConfig } from '@/lib/cloud/config'
import { AccountEditionPrivacy } from '@/components/legal/privacy/AccountEditionPrivacy'
import { PagesEditionPrivacy } from '@/components/legal/privacy/PagesEditionPrivacy'
import { CloudLegalContent } from '@/components/account/CloudLegalSection'
import { ARCO_DAYS, BREACH_PEOPLE_HOURS, RETENTION_DAYS, SESSION_IDLE_DAYS, SESSION_MAX_DAYS } from '@/lib/legal/retention-facts'
import { readFileSync } from 'node:fs'
import * as sweep from '../../../../workers/billing/src/retention.mjs'
import * as sessions from '../../../../workers/billing/src/sessions.mjs'

// D4 audit (setup thread, 4 Oct 2026), P1: /privacy must describe the real stack in the PRERENDERED
// HTML, name the holder (or say it is being formed), the RNPD state, processors and the transfer
// to the US, retention per kind of data, ARCO deadlines, minors and breach notice.

const text = (el: ReturnType<typeof h>) => renderToStaticMarkup(el).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
// legal set explicitly: NEXT_PUBLIC_HOLDER_* in the shell running the tests would otherwise name a
// holder in CLOUD_CONFIG and flip the closed-mode assertions below.
const SYNC: CloudConfig = { ...structuredClone(CLOUD_CONFIG), launchStage: 'sync', legal: { ...CLOUD_CONFIG.legal, sellerName: '', address: '', ruc: '', rnpd: '' } }

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
  assert.doesNotMatch(done, /de forma provisional/, 'a company (RUC 20…) is not the interim holder')
})

test('account edition: the owner as interim holder, a natural person without RUC (19 Oct 2026, S7)', () => {
  const interim: CloudConfig = { ...SYNC, legal: { ...SYNC.legal, sellerName: 'Titular de prueba', address: 'Av. Ejemplo 123, Lima' } }
  const t = text(h(AccountEditionPrivacy, { cfg: interim }))
  assert.match(t, /El responsable de tus datos es Titular de prueba , con domicilio en Av\. Ejemplo 123, Lima\./)
  assert.doesNotMatch(t, /RUC|—/, 'no RUC and no placeholder dash')
  assert.match(t, /Lo es de forma provisional: cuando exista la empresa que operará PyArcana, ella asumirá este papel y lo anunciaremos aquí\./)
  assert.match(t, /inscripción en trámite/, 'the RNPD filing is still pending')
  assert.doesNotMatch(t, /no abrimos cuentas nuevas|constituyendo/, 'sign-up is open')
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
  assert.match(t, new RegExp(`información sobre cómo tratamos tus datos.*${ARCO_DAYS.information} días hábiles, sin prórroga.*acceso.*${ARCO_DAYS.access} días hábiles.*${ARCO_DAYS.other} días hábiles`))
  assert.match(t, /14 años o más/)
  assert.match(t, /Desde los 14 años puedes aceptar este aviso tú mismo/)
  assert.match(t, /avisaremos a la ANPD dentro de las 48 horas/)
  // DS 016-2024-JUS art. 34.3 (19 Oct 2026): affected people within 48 hours, with the measures taken.
  assert.match(t, new RegExp(`te avisaremos a ti dentro de las ${BREACH_PEOPLE_HOURS} horas.*medidas que tomamos.*Si tardamos más, te explicaremos por qué`))
  assert.doesNotMatch(t, /sin demora indebida/, 'the open-ended promise is replaced by the 48-hour one')
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

test('the deadlines in law (19 Oct 2026): information 8 business days and not extendable, people told of a breach within 48 h', () => {
  assert.equal(ARCO_DAYS.information, 8, 'DS 016-2024-JUS art. 69.1 (art. 71.1: no extension)')
  assert.equal(ARCO_DAYS.access, 20)
  assert.equal(ARCO_DAYS.other, 10)
  assert.equal(BREACH_PEOPLE_HOURS, 48, 'art. 34.3')
})

test('every copy of the deadlines says the same: the account panel text in all three dictionaries, /data-rights and the English summary', () => {
  const i18n = readFileSync('src/lib/i18n.ts', 'utf8')
  const bodies = [...i18n.matchAll(/'legalc\.arcoDeadlines\.body': '([^']+)'/g)].map((m) => m[1])
  assert.equal(bodies.length, 3, 'es-PE, es-ES and en')
  for (const b of bodies) {
    const days = [...b.matchAll(/\b(\d+) (?:días hábiles|business days)/g)].map((m) => Number(m[1]))
    assert.deepEqual(days, [ARCO_DAYS.information, ARCO_DAYS.access, ARCO_DAYS.other], b)
    assert.match(b, /sin prórroga|with no extension/)
  }
  const rights = readFileSync('src/app/data-rights/page.tsx', 'utf8')
  assert.match(rights, /ARCO_DAYS\.information\} días hábiles, sin prórroga/)
  const privacy = readFileSync('src/app/privacy/page.tsx', 'utf8')
  assert.match(privacy, /\$\{ARCO_DAYS\.information\} business days, with no extension/)
})

test('the account panel\'s controller line: no "RUC —" for a holder without RUC, and the interim sentence (19 Oct 2026, S7)', () => {
  const interim: CloudConfig = { ...SYNC, legal: { ...SYNC.legal, sellerName: 'Titular de prueba', address: 'Av. Ejemplo 123, Lima' } }
  const t = text(h(CloudLegalContent, { kind: 'privacy', cfg: interim, stage: 'sync' }))
  assert.match(t, /Titular de prueba, con domicilio en Av\. Ejemplo 123, Lima, es responsable del tratamiento/)
  assert.doesNotMatch(t, /RUC|Registro Único de Contribuyentes, —/)
  assert.match(t, /Lo es de forma provisional/)
  const company: CloudConfig = { ...SYNC, legal: { ...SYNC.legal, sellerName: 'Empresa de prueba S.A.C.', address: 'Av. Ejemplo 123, Lima', ruc: '20123456789' } }
  const c = text(h(CloudLegalContent, { kind: 'privacy', cfg: company, stage: 'sync' }))
  assert.match(c, /Empresa de prueba S\.A\.C\. \(RUC, Registro Único de Contribuyentes, 20123456789\)/)
  assert.doesNotMatch(c, /de forma provisional/)
})
