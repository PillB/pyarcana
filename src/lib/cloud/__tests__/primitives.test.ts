import test from 'node:test'
import assert from 'node:assert/strict'
import { bytesToB64url, b64urlToBytes, utf8, fromUtf8, randomB64url, sha256B64url } from '@/lib/cloud/b64'
import { createMemoryStorage, readJson, writeJson, safeStorage } from '@/lib/cloud/storage'

test('base64url matches RFC 4648 §10 vectors without padding', () => {
  const vectors: Array<[string, string]> = [
    ['', ''],
    ['f', 'Zg'],
    ['fo', 'Zm8'],
    ['foo', 'Zm9v'],
    ['foob', 'Zm9vYg'],
    ['fooba', 'Zm9vYmE'],
    ['foobar', 'Zm9vYmFy'],
  ]
  for (const [plain, encoded] of vectors) {
    assert.equal(bytesToB64url(utf8(plain)), encoded)
    assert.equal(fromUtf8(b64urlToBytes(encoded)!), plain)
  }
})

test('base64url uses - and _ and round-trips all 256 byte values', () => {
  const all = new Uint8Array(256)
  for (let i = 0; i < 256; i++) all[i] = i
  const enc = bytesToB64url(all)
  assert.match(enc, /^[A-Za-z0-9_-]+$/)
  assert.ok(enc.includes('-') && enc.includes('_'))
  assert.deepEqual([...b64urlToBytes(enc)!], [...all])
})

test('base64url decoding is strict: padding, std alphabet, whitespace and impossible lengths are refused', () => {
  for (const bad of ['Zg==', 'Zm9v+', 'Zm9v/', 'Zm 9v', 'Z', 'Zm9vY', 'A', 'Zm9vA', 'é']) {
    assert.equal(b64urlToBytes(bad), null, bad)
  }
  // Non-canonical trailing bits: "Zh" decodes to the same byte as "Zg" in lax decoders.
  assert.equal(b64urlToBytes('Zh'), null)
})

test('utf8 round-trips non-ASCII text', () => {
  const s = 'Sección 6 · ñandú 🐍'
  assert.equal(fromUtf8(utf8(s)), s)
})

test('sha256B64url matches the FIPS 180-2 "abc" vector', async () => {
  assert.equal(await sha256B64url('abc'), 'ungWv48Bz-pBQUDeXa4iI7ADYaOWF3qctBD_YfIAFa0')
})

test('randomB64url returns the requested entropy and does not repeat', () => {
  const a = randomB64url(32)
  const b = randomB64url(32)
  assert.equal(b64urlToBytes(a)!.length, 32)
  assert.equal(a.length, 43)
  assert.notEqual(a, b)
})

test('memory storage behaves like Web Storage for strings', () => {
  const s = createMemoryStorage()
  assert.equal(s.getItem('k'), null)
  s.setItem('k', 'v')
  assert.equal(s.getItem('k'), 'v')
  assert.deepEqual(s.keys(), ['k'])
  s.removeItem('k')
  assert.equal(s.getItem('k'), null)
})

test('readJson returns null for missing or corrupt values and never throws', () => {
  const s = createMemoryStorage({ good: '{"a":1}', bad: '{not json' })
  assert.deepEqual(readJson(s, 'good'), { a: 1 })
  assert.equal(readJson(s, 'bad'), null)
  assert.equal(readJson(s, 'missing'), null)
  const throwing = { getItem() { throw new Error('denied') }, setItem() { throw new Error('denied') }, removeItem() {}, keys: () => [] }
  assert.equal(readJson(throwing, 'x'), null)
})

test('writeJson reports a quota failure instead of throwing', () => {
  const full = { getItem: () => null, setItem() { throw new Error('QuotaExceededError') }, removeItem() {}, keys: () => [] }
  assert.equal(writeJson(full, 'x', { a: 1 }), false)
  const s = createMemoryStorage()
  assert.equal(writeJson(s, 'x', { a: 1 }), true)
  assert.equal(s.getItem('x'), '{"a":1}')
})

test('safeStorage returns null when there is no window.localStorage (server render)', () => {
  assert.equal(safeStorage(), null)
})
