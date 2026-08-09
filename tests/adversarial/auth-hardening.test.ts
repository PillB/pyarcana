import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

import {
  BoundedRateLimiter,
  MAX_REGISTRATION_BODY_BYTES,
  RegistrationRequestError,
  clientRateKey,
  readBoundedJson,
} from '../../src/lib/registration-security'

const root = process.cwd()

test('registration limiter enforces attempts, expiry, and bounded cardinality', () => {
  const limiter = new BoundedRateLimiter(2, 100, 2)
  assert.equal(limiter.allow('198.51.100.1', 1_000), true)
  assert.equal(limiter.allow('198.51.100.1', 1_001), true)
  assert.equal(limiter.allow('198.51.100.1', 1_002), false)
  assert.equal(limiter.allow('198.51.100.2', 1_002), true)
  assert.equal(limiter.allow('198.51.100.3', 1_002), false)
  assert.equal(limiter.size, 2)
  assert.equal(limiter.allow('198.51.100.3', 1_103), true)
  assert.equal(limiter.size, 1)
})

test('client rate key does not retain an unbounded spoofed header', () => {
  const request = new Request('https://example.test/register', {
    headers: { 'x-forwarded-for': `${'x'.repeat(10_000)}2001:db8::1, 10.0.0.1` },
  })
  const key = clientRateKey(request)
  assert.ok(key.length <= 64)
  assert.match(key, /^[0-9a-fA-F:.]+$|^unknown$/)
})

test('bounded JSON reader accepts only valid, size-limited JSON', async () => {
  const valid = new Request('https://example.test/register', {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ email: 'alumna@example.pe' }),
  })
  assert.deepEqual(await readBoundedJson(valid), { email: 'alumna@example.pe' })

  const wrongType = new Request('https://example.test/register', {
    method: 'POST',
    headers: { 'content-type': 'text/plain' },
    body: '{}',
  })
  await assert.rejects(readBoundedJson(wrongType), (error: unknown) =>
    error instanceof RegistrationRequestError && error.status === 415
  )

  const malformed = new Request('https://example.test/register', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{',
  })
  await assert.rejects(readBoundedJson(malformed), (error: unknown) =>
    error instanceof RegistrationRequestError && error.status === 400
  )

  const oversized = new Request('https://example.test/register', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ value: 'a'.repeat(MAX_REGISTRATION_BODY_BYTES) }),
  })
  await assert.rejects(readBoundedJson(oversized), (error: unknown) =>
    error instanceof RegistrationRequestError && error.status === 413
  )
})

test('public registration cannot self-assign an administrator role', () => {
  const route = readFileSync(join(root, 'src/app/api/auth/register/route.ts'), 'utf8')
  const auth = readFileSync(join(root, 'src/lib/auth.ts'), 'utf8')
  const modal = readFileSync(join(root, 'src/components/course/AuthModal.tsx'), 'utf8')

  assert.match(route, /role: 'STUDENT'/)
  assert.doesNotMatch(route, /userCount|first user|role\s*=\s*.*ADMIN/i)
  assert.doesNotMatch(auth, /dev-secret-change|NEXTAUTH_SECRET\s*\|\|/)
  assert.doesNotMatch(modal, /admin123|demo1234|auth-demo-admin|auth-demo-student/)
})
