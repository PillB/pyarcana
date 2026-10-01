// Seeds the LOCAL D1 of `wrangler dev` with one account per access kind and a known session token
// each. Test harness only: it writes rows the worker's own sign-in would write, so Playwright can
// act as each person without a real Google or Microsoft account (the worker has no JWKS override).
import { createHash, randomBytes } from 'node:crypto'
import { writeFileSync } from 'node:fs'
const now = Math.floor(Date.now() / 1000)
const DAY = 86400
const people = ['free', 'gift', 'tester', 'paid', 'trial', 'admin']
const tokens = {}
const sql = []
const q = (v) => (v === null ? 'NULL' : typeof v === 'number' ? String(v) : `'${String(v).replace(/'/g, "''")}'`)
for (const [i, who] of people.entries()) {
  const id = `acct_e2e${who.padEnd(17, 'x')}`
  const email = who === 'admin' ? 'admin@example.test' : `${who}@e2e.test`
  const token = randomBytes(32).toString('base64url')
  tokens[who] = { id, email, token }
  const created = now - 1000 + i
  sql.push(`INSERT INTO accounts (id, email, email_normalized, email_verified, display_name, locale, created_at, updated_at, first_signin_at, terms_version, age_confirmed_at) VALUES (${[id, email, email, 1, who, 'es-PE', created, created, created, 'e2e-2026-10-01', created].map(q).join(', ')});`)
  const method = who === 'admin' ? 'google' : 'email'
  const subject = who === 'admin' ? 'g-admin-e2e' : email
  sql.push(`INSERT INTO identities (provider, subject, account_id, email_at_link, created_at, email_authoritative) VALUES (${[method, subject, id, email, created, 1].map(q).join(', ')});`)
  const hash = createHash('sha256').update(token).digest('hex')
  sql.push(`INSERT INTO sessions (id, account_id, token_hash, method, created_at, renewed_at, expires_at, identity_subject) VALUES (${[`sess_e2e_${who}`, id, hash, method, now - 60, now - 60, now + 30 * DAY, subject].map(q).join(', ')});`)
}
const g = (who, kind, days) => sql.push(`INSERT INTO grants (id, account_id, kind, days, created_at, note) VALUES (${[`grant_e2e_${who}`, tokens[who].id, kind, days, now - 100, 'e2e'].map(q).join(', ')});`)
g('gift', 'gift', 30)
g('tester', 'tester', null)
g('trial', 'trial', 7)
sql.push(`INSERT INTO account_roles (account_id, role, created_at, note) VALUES (${[tokens.tester.id, 'tester', now - 100, 'e2e'].map(q).join(', ')});`)
sql.push(`INSERT INTO subscriptions (id, account_id, provider, provider_ref, plan, amount_minor, currency, status, created_at, updated_at) VALUES (${['sub_e2e_paid', tokens.paid.id, 'mercadopago', 'ref_e2e', 'pro_monthly', 1990, 'PEN', 'active', now - 100, now - 100].map(q).join(', ')});`)
sql.push(`INSERT INTO charges (id, provider, provider_charge_id, subscription_id, account_id, amount_minor, currency, status, approved_at, period_start, period_end, created_at, updated_at) VALUES (${['ch_e2e_paid', 'mercadopago', 'ch_e2e_paid', 'sub_e2e_paid', tokens.paid.id, 1990, 'PEN', 'approved', now - 100, now - 100, now + 30 * DAY, now - 100, now - 100].map(q).join(', ')});`)
writeFileSync(new URL('./seed.sql', import.meta.url), sql.join('\n') + '\n')
writeFileSync(new URL('./tokens.json', import.meta.url), JSON.stringify(tokens, null, 2))
console.log(`seeded ${people.length} people`)
