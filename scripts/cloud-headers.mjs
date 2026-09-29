#!/usr/bin/env node
/**
 * Write out/_headers and out/ads.txt from the committed public config (src/lib/cloud/config.ts)
 * into a built static export (DESIGN-v3 §A deploy step 2). Run it after `build:static`, before
 * `wrangler deploy`:
 *
 *   node scripts/cloud-headers.mjs [outDir]      # default: out
 *
 * - _headers: the meta CSP as a real header plus the standard security headers (headers.ts).
 * - ads.txt: only when ads.adsenseClient is set; a malformed id stops the script.
 * Refuses (exit 1, nothing written) when outDir holds no index.html (not a built export), and when
 * an ads.txt is already there but no AdSense id is configured (a stale authorization).
 */
import { existsSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const outDir = resolve(process.argv[2] ?? 'out')
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// The config and builders are TypeScript with '@/' imports. Re-run this script once under the tsx
// loader (the same `node --import tsx` the unit tests use), from the repository root so tsx finds
// tsconfig.json's paths whatever directory the caller is in.
if (process.env.PYARCANA_CLOUD_HEADERS_TSX !== '1') {
  const child = spawnSync(process.execPath, ['--import', import.meta.resolve('tsx'), fileURLToPath(import.meta.url), outDir], {
    cwd: repoRoot,
    stdio: 'inherit',
    env: { ...process.env, PYARCANA_CLOUD_HEADERS_TSX: '1' },
  })
  process.exit(child.status ?? 1)
}

function fail(message) {
  console.error(`cloud-headers: ${message}`)
  process.exit(1)
}

if (!existsSync(join(outDir, 'index.html'))) fail(`${outDir} has no index.html; run the static build first`)

const here = import.meta.url
const { CLOUD_CONFIG } = await import(new URL('../src/lib/cloud/config.ts', here).href)
const { buildAdsTxt, buildHeadersFile } = await import(new URL('../src/lib/cloud/headers.ts', here).href)

let adsTxt
let headers
try {
  adsTxt = buildAdsTxt(CLOUD_CONFIG)
  headers = buildHeadersFile(CLOUD_CONFIG)
} catch (error) {
  fail(error instanceof Error ? error.message : String(error))
}
if (adsTxt === null && existsSync(join(outDir, 'ads.txt'))) {
  fail(`${join(outDir, 'ads.txt')} exists but no AdSense id is configured; rebuild instead of publishing a stale ads.txt`)
}

writeFileSync(join(outDir, '_headers'), headers)
if (adsTxt !== null) writeFileSync(join(outDir, 'ads.txt'), adsTxt)
console.log(`cloud-headers: wrote _headers${adsTxt !== null ? ' and ads.txt' : ''} to ${outDir} (from ${fileURLToPath(new URL('../src/lib/cloud/config.ts', here))})`)
