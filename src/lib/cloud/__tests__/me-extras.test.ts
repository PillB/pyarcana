import test from 'node:test'
import assert from 'node:assert/strict'
import { parseMe } from '@/lib/cloud/session'

test('the me payload carries how this session signed in; unknown methods read as null', () => {
  const me = (signInMethod: unknown) => parseMe({ account: { id: 'acct_1', signInMethod }, access: {} })!.account.signInMethod
  assert.equal(me('google'), 'google')
  assert.equal(me('microsoft'), 'microsoft')
  assert.equal(me('email'), 'email')
  assert.equal(me('admin'), null)
  assert.equal(me(undefined), null)
  assert.equal(me(1), null)
})
