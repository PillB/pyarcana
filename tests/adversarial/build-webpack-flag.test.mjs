/**
 * Contract: dynamic LMS build must force webpack so next.config.ts
 * RetryChunkLoadPlugin remains active under Next.js 16 (Turbopack default).
 * Static export already passes --webpack in build_static_export.mjs.
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..')

describe('dynamic build webpack flag (DEF-SA-005)', () => {
  it('package.json build script invokes next build with --webpack', () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))
    assert.match(
      pkg.scripts.build,
      /next build --webpack/,
      'dynamic build must pass --webpack so webpack config (RetryChunkLoadPlugin) is used under Next 16'
    )
  })

  it('static export builder also forces --webpack', () => {
    const src = readFileSync(join(ROOT, 'scripts/build_static_export.mjs'), 'utf8')
    assert.match(src, /build.*--webpack|--webpack/)
  })
})
