// Review round 1: `NEXT_PUBLIC_BASE_PATH= bun run build:static` (the root build the canonical-origin
// deploy documents) produced a /pyarcana export, because the wrapper read the variable with `||`.
import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveStaticBasePath } from './static_base_path.mjs'

test('unset keeps the GitHub Pages edition; set but empty means the site root', () => {
  assert.equal(resolveStaticBasePath({}), '/pyarcana')
  assert.equal(resolveStaticBasePath({ NEXT_PUBLIC_BASE_PATH: '' }), '')
  assert.equal(resolveStaticBasePath({ NEXT_PUBLIC_BASE_PATH: '/pyarcana' }), '/pyarcana')
  assert.equal(resolveStaticBasePath({ NEXT_PUBLIC_BASE_PATH: '/docs/v2' }), '/docs/v2')
})

test('a base path that next.config would not accept is refused before the build', () => {
  for (const bad of ['pyarcana', '/pyarcana/', '//evil.example', '/a b', '/../x']) {
    assert.throws(() => resolveStaticBasePath({ NEXT_PUBLIC_BASE_PATH: bad }), /NEXT_PUBLIC_BASE_PATH/, bad)
  }
})
