import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

// CI's platform builds died twice on PillB/pyarcana#108 inside next/font/google:
// `TypeError: Cannot read properties of null (reading '1')` at google/loader.js:122, because
// Google Fonts answered with an extensionless `fonts.gstatic.com/l/font?kit=...` URL
// (vercel/next.js#99114, about 1 response in 60). next/font/google is the only code path that
// fetches during `next build`; the fonts are now committed under src/app/fonts and loaded with
// next/font/local. Any module that loads next/font/google again brings the flake back.
const SRC = fileURLToPath(new URL('../../src', import.meta.url))
const CODE = /\.(?:[cm]?[jt]sx?)$/
const LOADS_GOOGLE_FONTS = /(?:\bfrom\s*|\bimport\s*\(\s*|\brequire\s*\(\s*)['"](?:@next|next)\/font\/google(?:\/[^'"]*)?['"]/

function codeFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return codeFiles(path)
    return CODE.test(entry.name) ? [path] : []
  })
}

test('no module under src/ loads next/font/google, so no build fetches fonts', () => {
  const files = codeFiles(SRC)
  const layout = join(SRC, 'app', 'layout.tsx')
  assert.ok(files.includes(layout), 'the scan must reach src/app/layout.tsx, where the fonts are set')
  const offenders = files.filter((file) => LOADS_GOOGLE_FONTS.test(readFileSync(file, 'utf8')))
  assert.deepEqual(
    offenders.map((file) => file.slice(SRC.length + 1)),
    [],
    'load fonts from src/app/fonts (next/font/local); see src/app/fonts/README.md',
  )
})
