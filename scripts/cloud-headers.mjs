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
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const outDir = resolve(process.argv[2] ?? 'out')
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// The config and builders are TypeScript with '@/' imports. Re-run this script once under the tsx
// loader (the same `node --import tsx` the unit tests use), from the repository root so tsx finds
// tsconfig.json's paths whatever directory the caller is in.
// The config's launch stage depends on the build's base path (config.ts buildStage): read the one
// this build recorded in out/deployment.json, so out/_headers always matches the pages' meta CSP.
function recordedBasePath() {
  try {
    const value = JSON.parse(readFileSync(join(outDir, 'deployment.json'), 'utf8')).base_path
    return typeof value === 'string' ? value : undefined
  } catch {
    return undefined
  }
}

if (process.env.PYARCANA_CLOUD_HEADERS_TSX !== '1') {
  const basePath = recordedBasePath()
  const env = { ...process.env, PYARCANA_CLOUD_HEADERS_TSX: '1' }
  if (basePath === undefined) delete env.NEXT_PUBLIC_BASE_PATH
  else env.NEXT_PUBLIC_BASE_PATH = basePath
  const child = spawnSync(process.execPath, ['--import', import.meta.resolve('tsx'), fileURLToPath(import.meta.url), outDir], {
    cwd: repoRoot,
    stdio: 'inherit',
    env,
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
const { buildAdsTxt, buildHeadersFile, buildSecurityTxt } = await import(new URL('../src/lib/cloud/headers.ts', here).href)

let adsTxt
let headers
let securityTxt
try {
  adsTxt = buildAdsTxt(CLOUD_CONFIG)
  headers = buildHeadersFile(CLOUD_CONFIG)
  securityTxt = buildSecurityTxt(CLOUD_CONFIG, Date.now())
} catch (error) {
  fail(error instanceof Error ? error.message : String(error))
}
if (adsTxt === null && existsSync(join(outDir, 'ads.txt'))) {
  fail(`${join(outDir, 'ads.txt')} exists but no AdSense id is configured; rebuild instead of publishing a stale ads.txt`)
}

writeFileSync(join(outDir, '_headers'), headers)
if (adsTxt !== null) writeFileSync(join(outDir, 'ads.txt'), adsTxt)
if (securityTxt !== null) {
  mkdirSync(join(outDir, '.well-known'), { recursive: true })
  writeFileSync(join(outDir, '.well-known', 'security.txt'), securityTxt)
}
console.log(`cloud-headers: wrote _headers${adsTxt !== null ? ', ads.txt' : ''}${securityTxt !== null ? ', .well-known/security.txt' : ''} to ${outDir} (stage ${CLOUD_CONFIG.launchStage}, base path ${JSON.stringify(process.env.NEXT_PUBLIC_BASE_PATH ?? null)})`)
