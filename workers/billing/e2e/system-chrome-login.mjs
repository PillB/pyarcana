// Sign in to the live site in the owner's own Chrome, then save the session for live.e2e.mjs.
//
// Google refuses sign-in in a browser "controlled through software automation" (Playwright's
// Chromium). So this starts the installed Chrome as a plain process: no --enable-automation, no
// Playwright launch, so navigator.webdriver stays false. A throwaway --user-data-dir is required,
// not optional: recent Chrome ignores --remote-debugging-port on the default profile. After the
// person signs in and presses Enter, Playwright attaches over CDP only to read the cookies, then
// Chrome is closed and the temporary profile deleted.
import { spawn } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CANDIDATES = {
  darwin: ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Chromium.app/Contents/MacOS/Chromium'],
  linux: ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser'],
  win32: ['C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'],
}

/** The installed Chrome: $CHROME, else the usual place for this platform, else null. */
export function chromePath(env = process.env, platform = process.platform, exists = existsSync) {
  if (env.CHROME) return exists(env.CHROME) ? env.CHROME : null
  return (CANDIDATES[platform] ?? []).find((p) => exists(p)) ?? null
}

/** Arguments for a plain Chrome with a debugging port on a throwaway profile. */
export function chromeArgs({ port, profile, url, headless = false, extraArgs = [] }) {
  return [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    '--no-first-run',
    '--no-default-browser-check',
    ...(headless ? ['--headless=new'] : []),
    ...extraArgs,
    url,
  ]
}

async function waitForCdp(port, child, timeoutMs = 20000) {
  const until = Date.now() + timeoutMs
  while (Date.now() < until) {
    if (child.exitCode !== null) throw new Error(`Chrome quit before opening its debugging port (exit code ${child.exitCode}). Is another Chrome using port ${port}? Set CDP_PORT to another number.`)
    try {
      const r = await fetch(`http://127.0.0.1:${port}/json/version`)
      if (r.ok) return await r.json()
    } catch {
      // not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  throw new Error(`Chrome did not open its debugging port ${port} within ${timeoutMs / 1000} s`)
}

/**
 * Open `url` in the installed Chrome (a throwaway profile), attach over CDP, run `fn(page, ctx)`,
 * then close Chrome and delete the profile. `ready()` runs before attaching (the person signs in).
 */
export async function withSystemChrome({ chromium, url, ready = async () => {}, port = Number(process.env.CDP_PORT) || 9222, chrome = chromePath(), headless = false, extraArgs = [], log = console.log }, fn) {
  if (!chrome) throw new Error('Google Chrome was not found. Install it, or set CHROME=/path/to/chrome.')
  const profile = mkdtempSync(join(tmpdir(), 'pyarcana-login-'))
  const child = spawn(chrome, chromeArgs({ port, profile, url, headless, extraArgs }), { stdio: 'ignore' })
  let browser = null
  try {
    await waitForCdp(port, child)
    log(`Chrome is open on ${url} (a temporary profile, deleted afterwards).`)
    await ready()
    browser = await chromium.connectOverCDP(`http://127.0.0.1:${port}`)
    const ctx = browser.contexts()[0]
    return await fn(ctx.pages()[0], ctx)
  } finally {
    await quitChrome(browser, child)
    await removeProfile(profile)
  }
}

/**
 * Ask Chrome to quit (CDP Browser.close), so its helper processes stop writing to the profile;
 * kill it only if it has not exited after 5 s. Killing first left helpers writing, and deleting the
 * profile then failed with ENOTEMPTY (found in the 5 Oct 2026 probe).
 */
async function quitChrome(browser, child) {
  const exited = new Promise((resolve) => (child.exitCode !== null ? resolve() : child.once('exit', resolve)))
  try {
    const cdp = await browser?.newBrowserCDPSession()
    await cdp?.send('Browser.close')
  } catch {
    // not attached (Chrome failed to start, or the person closed it): fall through to kill
  }
  const timer = setTimeout(() => child.kill(), 5000)
  await exited
  clearTimeout(timer)
}

/** Delete the throwaway profile, retrying while the last writes settle. */
async function removeProfile(profile) {
  for (let attempt = 0; ; attempt++) {
    try {
      return rmSync(profile, { recursive: true, force: true })
    } catch (e) {
      if (attempt >= 20) throw new Error(`could not delete the temporary profile ${profile}: ${e.code}. Delete it by hand.`)
      await new Promise((resolve) => setTimeout(resolve, 250))
    }
  }
}

/**
 * Open `url` in the installed Chrome, wait for `ready()` (the person signs in, then presses Enter),
 * save the session to `statePath`, close Chrome and delete the temporary profile.
 * @returns {Promise<{webdriver: boolean, cookies: number}>} What the saved session holds.
 */
export function loginWithSystemChrome({ statePath, ...options }) {
  return withSystemChrome(options, async (page, ctx) => {
    const webdriver = page ? await page.evaluate(() => navigator.webdriver === true) : false
    await ctx.storageState({ path: statePath })
    return { webdriver, cookies: (await ctx.cookies()).length }
  })
}
