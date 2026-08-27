/**
 * Sweep the element picker across the whole site instead of three fixtures.
 *
 * The picker's contract is narrow and easy to believe without checking: the
 * selector it records must resolve to exactly one element, and that element
 * must be the one the tester pointed at or an ancestor that stands for it.
 * Anything else sends a reviewer somewhere the bug is not.
 *
 * A handful of hand-written cases cannot establish that. The site has legal
 * pages with no course chrome, sections full of highlighted code and SVG
 * figures, React Flow panes whose nodes are divs with generated ids, tables,
 * and three workspace tabs. So this walks routes x tabs x element kinds and
 * checks every pick, plus the things that break around it: does the workspace
 * come back, does the draft survive, does the console stay quiet.
 *
 *   node scripts/qa_picker_explore.mjs --base-url http://127.0.0.1:4321/pyarcana
 */
import { chromium, webkit, devices } from 'playwright'
import { writeFileSync, mkdirSync } from 'node:fs'

const args = Object.fromEntries(
  process.argv.slice(2).flatMap((a, i, arr) => (a.startsWith('--') ? [[a.slice(2), arr[i + 1]]] : [])),
)
const BASE = args['base-url'] ?? 'http://127.0.0.1:4321/pyarcana'
const OUT = args.out ?? 'course-state/qa_picker_explore_report.json'

/** Routes with genuinely different DOM around the harness. */
const ROUTES = [
  { name: 'home', url: '/' },
  { name: 'section-setup', url: '/#setup' },
  { name: 'section-data-structures', url: '/#data-structures' },
  { name: 'section-rag', url: '/#rag' },
  { name: 'section-streaming-data', url: '/#streaming-data' },
  { name: 'privacy', url: '/privacy.html' },
  { name: 'terms', url: '/terms.html' },
  { name: 'verify', url: '/verify.html' },
  { name: 'external-resources', url: '/external-resources.html' },
]

/**
 * Candidates must live on the page, not in the workspace.
 *
 * While the tester is aiming, the workspace is suspended -- invisible and not
 * taking clicks -- so its own inputs and buttons are not pickable by design.
 * Sampling them produced twenty-two findings that all reduced to "you cannot
 * point at the thing you are pointing with".
 */
const OUTSIDE_QA = ':not([data-testid="qa-harness-dialog"] *):not([data-qa-picker] *)'

/**
 * Element kinds a tester actually points at, most-likely-to-break first.
 * Each is a selector; the probe samples up to `take` of whatever it finds.
 */
const KINDS = [
  { kind: 'heading', selector: 'h1, h2, h3', take: 2 },
  { kind: 'paragraph', selector: 'main p, article p', take: 2 },
  { kind: 'code-token', selector: 'pre span, code span', take: 2 },
  { kind: 'code-block', selector: 'pre', take: 1 },
  { kind: 'button', selector: 'button:not([data-qa-picker] button)', take: 3 },
  { kind: 'link', selector: 'a[href]', take: 2 },
  { kind: 'list-item', selector: 'li', take: 2 },
  { kind: 'table-cell', selector: 'td, th', take: 2 },
  { kind: 'figure-svg-text', selector: 'svg text', take: 2 },
  { kind: 'figure-svg-shape', selector: 'svg rect, svg circle, svg path', take: 2 },
  { kind: 'reactflow-node', selector: '.react-flow__node', take: 2 },
  { kind: 'input', selector: 'input:not([type="file"]), textarea', take: 2 },
  { kind: 'image', selector: 'img', take: 1 },
]

/**
 * Engine and input profiles.
 *
 * The first sweep ran desktop Chromium at 1440x900 and nothing else, which left
 * the two things most likely to break untested: the picker listens for
 * `pointermove` to track what is under the cursor, and a finger produces no
 * hover at all -- it moves and lands in one gesture. And Safari is the browser
 * this course's audience is most likely to be on.
 */
const ALL_PROFILES = [
  { name: 'chromium-desktop', engine: chromium, ctx: { viewport: { width: 1440, height: 900 } } },
  { name: 'chromium-phone-touch', engine: chromium, ctx: { ...devices['Pixel 7'] }, touch: true },
  { name: 'chromium-tablet-touch', engine: chromium, ctx: { ...devices['iPad (gen 7)'] }, touch: true },
  { name: 'webkit-desktop', engine: webkit, ctx: { viewport: { width: 1440, height: 900 } } },
  { name: 'webkit-phone-touch', engine: webkit, ctx: { ...devices['iPhone 14'] }, touch: true },
]
const ONLY_PROFILES = args.profiles ? new Set(args.profiles.split(',').map((p) => p.trim())) : null
const PROFILES = ONLY_PROFILES ? ALL_PROFILES.filter((p) => ONLY_PROFILES.has(p.name)) : ALL_PROFILES

const report = { base: BASE, profiles: PROFILES.map((p) => p.name), picks: [], findings: [], counts: {} }

function note(finding) {
  // Prefixed so a defect that only exists on one engine or one input method is
  // legible as exactly that, instead of looking like a site-wide failure.
  report.findings.push(finding.startsWith(profile?.name ?? '~') ? finding : `${profile?.name ?? 'setup'}/${finding}`)
}

/** Rebound once per profile; every helper below reads these. */
let page
let profile
const consoleErrors = []

/** Read the hint the workspace recorded, straight out of the context preview. */
async function recordedHint() {
  return page.evaluate(() => {
    const dialog = document.querySelector('[data-testid="qa-harness-dialog"]')
    if (!dialog) return null
    for (const row of dialog.querySelectorAll('div')) {
      const dt = row.querySelector('dt')
      if (dt?.textContent?.trim() === 'Elemento') return row.querySelector('dd')?.getAttribute('title') ?? null
    }
    return null
  })
}

async function openHarness(tab) {
  const already = await page.locator('[data-testid="qa-harness-dialog"]').count()
  if (!already) {
    await page.getByTestId('qa-harness-open').click()
    await page.locator('[data-testid="qa-harness-dialog"]').waitFor({ timeout: 20000 })
  }
  // Always select the tab, including 'report'. A goto that only changes the
  // hash does not remount the app, so the workspace arrives still showing
  // whatever the previous iteration left it on -- which read as "the picker
  // control is missing on every section page" when it was on the Review tab.
  await page.getByTestId(`qa-tab-${tab}`).click()
  await page.waitForTimeout(120)
}

/**
 * Point at one element and check what came back.
 *
 * The click goes through the page at real coordinates, because that is the code
 * path -- dispatching a synthetic event on the node would skip the capture
 * handler and elementFromPoint, which is where the interesting behaviour lives.
 */
async function pickAt(handle, meta) {
  const before = await page.getByTestId('qa-pick-element').count()
  if (!before) { note(`${meta.route}/${meta.tab}: no "Señalar elemento" control in this tab`); return null }
  await page.getByTestId('qa-pick-element').click()
  const pickerUp = await page.locator('[data-testid="qa-element-picker"]').count()
  if (!pickerUp) { note(`${meta.route}/${meta.tab}/${meta.kind}: picker did not activate`); return null }

  // Measure AFTER the picker is up, not before. Activating it takes the dialog
  // non-modal, which releases Radix's scroll lock and can move the page --
  // coordinates taken beforehand then point at whatever slid into that spot.
  // That is what produced eight touch-only "unrelated element" findings that
  // were entirely the probe's own doing.
  await handle.scrollIntoViewIfNeeded().catch(() => {})
  await page.waitForTimeout(120)
  const box = await handle.boundingBox()
  if (!box || box.width < 2 || box.height < 2) { await page.keyboard.press('Escape'); return null }

  // Mark the intended target so we can check the resolved selector against it.
  await handle.evaluate((el) => { el.setAttribute('data-probe-target', '1') })

  // An inline element that wraps across lines has several rects, and the centre
  // of their union can sit outside the element entirely -- which is how tapping
  // one link "hit" its neighbour. Verify the aim point before trusting it.
  const aimOk = await page.evaluate(({ x, y }) => {
    const intended = document.querySelector('[data-probe-target="1"]')
    if (!intended) return false
    // The TOPMOST non-picker element, not anywhere in the stack. Searching the
    // whole stack passed elements sitting *under* the sticky header, and then
    // called it a defect when the picker named the header -- which is the right
    // answer, because the header is what a tester sees and taps at that point.
    const top = document.elementsFromPoint(x, y).find((el) => !el.closest('[data-qa-picker]'))
    return !!top && (top === intended || intended.contains(top) || top.contains(intended))
  }, { x: box.x + box.width / 2, y: box.y + box.height / 2 })
  if (!aimOk) {
    report.unsampleable = (report.unsampleable ?? 0) + 1
    await handle.evaluate((el) => { el.removeAttribute('data-probe-target') }).catch(() => {})
    await page.keyboard.press('Escape')
    await page.waitForTimeout(80)
    return null
  }
  const cx = box.x + box.width / 2
  const cy = box.y + box.height / 2
  if (profile.touch) {
    // A finger never hovers. It arrives and lands in one gesture, so the
    // pointermove that the highlight depends on may be the same event as the
    // tap -- or may not happen at all. Tapping is the only honest test of that.
    await page.touchscreen.tap(cx, cy)
  } else {
    await page.mouse.move(cx, cy)
    await page.mouse.click(cx, cy)
  }
  await page.waitForTimeout(160)

  let stillPicking = await page.locator('[data-testid="qa-element-picker"]').count()
  if (stillPicking) {
    // Recover, or one stuck pick turns into three hundred identical findings
    // that say nothing about the rest of the site.
    await page.keyboard.press('Escape')
    await page.waitForTimeout(100)
    stillPicking = 1
  }
  const hint = await recordedHint()
  const selector = hint ? hint.split(' — «')[0].trim() : null

  const verdict = await page.evaluate((sel) => {
    const intended = document.querySelector('[data-probe-target="1"]')
    if (!sel) return { matches: 0, relation: 'no-selector', intendedTag: intended?.tagName.toLowerCase() ?? null }
    let nodes = []
    try { nodes = [...document.querySelectorAll(sel)] } catch { return { matches: -1, relation: 'invalid-selector', intendedTag: intended?.tagName.toLowerCase() ?? null } }
    const resolved = nodes[0] ?? null
    let relation = 'unrelated'
    if (resolved && intended) {
      if (resolved === intended) relation = 'exact'
      else if (resolved.contains(intended)) relation = 'ancestor'
      else if (intended.contains(resolved)) relation = 'descendant'
    }
    return {
      matches: nodes.length,
      relation,
      intendedTag: intended?.tagName.toLowerCase() ?? null,
      resolvedTag: resolved?.tagName.toLowerCase() ?? null,
    }
  }, selector)

  await handle.evaluate((el) => { el.removeAttribute('data-probe-target') }).catch(() => {})

  const where = `${meta.route}/${meta.tab}/${meta.kind}`
  if (stillPicking) note(`${where}: picker stayed open after a click`)
  if (!selector) note(`${where}: nothing was recorded`)
  else {
    if (verdict.matches === -1) note(`${where}: recorded an invalid selector — ${selector}`)
    else if (verdict.matches === 0) note(`${where}: selector matches nothing — ${selector}`)
    else if (verdict.matches > 1) note(`${where}: selector matches ${verdict.matches} elements — ${selector}`)
    // 'descendant' means we named something *inside* what was clicked, which
    // points a reviewer at a fragment of the thing rather than the thing.
    // `body` matches exactly one element and is an ancestor of everything, so
    // it satisfies both checks above while telling a reviewer nothing. It is
    // what this whole feature replaced; it must never come back as an answer.
    if (selector === 'body' || selector === 'html') {
      note(`${where}: recorded "${selector}", which is the useless answer this replaced`)
    }
    // CSS.escape on a quoted attribute value yields `"Editor\ de\ código"`.
    // It matches, and it looks broken to whoever pastes it.
    if (/\[[a-z-]+="[^"]*\\ /.test(selector ?? '')) {
      note(`${where}: attribute value escaped like an identifier — ${selector}`)
    }
    if (verdict.intendedTag === null) {
      note(`${where}: the intended element vanished before it could be checked (re-render?) — ${selector}`)
    } else if (verdict.relation === 'unrelated' || verdict.relation === 'descendant') {
      note(`${where}: selector resolves to a ${verdict.relation} (${verdict.resolvedTag}) of the clicked ${verdict.intendedTag} — ${selector}`)
    }
  }

  // The dialog fades back over ~200ms, so sampling opacity right after the click
  // catches it mid-transition. Wait for the end state rather than reporting the
  // animation as a defect.
  let restored = null
  for (let attempt = 0; attempt < 12; attempt += 1) {
    restored = await page.evaluate(() => {
      const d = document.querySelector('[data-testid="qa-harness-dialog"]')
      return d ? getComputedStyle(d).opacity : null
    })
    if (restored === '1') break
    await page.waitForTimeout(60)
  }
  if (restored !== '1') note(`${where}: workspace did not come back (opacity ${restored})`)

  report.counts[meta.kind] = (report.counts[meta.kind] ?? 0) + 1
  report.picks.push({ profile: profile.name, ...meta, selector, ...verdict })
  return selector
}

for (profile of PROFILES) {
  const browser = await profile.engine.launch()
  const context = await browser.newContext(profile.ctx)
  await context.addInitScript(() => {
    localStorage.setItem('pyarcana:tourCompleted', '1')
    localStorage.setItem('pyarcana:qaTourCompleted', '1')
  })
  page = await context.newPage()
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(`[${profile.name}] ${m.text()}`) })
  page.on('pageerror', (e) => consoleErrors.push(`[${profile.name}] pageerror: ${e.message}`))

  for (const route of ROUTES) {
  for (const tab of ['report', 'session', 'review']) {
    try {
      // Close whatever the last iteration left open, then navigate. Without
      // this a hash-only goto carries the previous route's dialog state along.
      if (await page.locator('[data-testid="qa-harness-dialog"]').count()) {
        await page.keyboard.press('Escape').catch(() => {})
        await page.waitForTimeout(150)
      }
      await page.goto(`${BASE}${route.url}`, { waitUntil: 'domcontentloaded' })
      await page.waitForTimeout(900)
      await openHarness(tab)

      // Picking belongs to the report being written, so the control lives in the
      // Reportar tab only -- that is the design, not a gap. The other two tabs
      // are still swept for the thing that does apply to them: they have to
      // render, and they have to render without throwing.
      if (tab !== 'report') {
        const body = await page.locator('[data-testid="qa-harness-dialog"]').innerText().catch(() => '')
        if (!body.trim()) note(`${route.name}/${tab}: the tab rendered empty`)
        if (await page.getByTestId('qa-pick-element').count()) {
          note(`${route.name}/${tab}: the picker control appears outside the report form`)
        }
        continue
      }

      // A draft that has to survive every detour on this page.
      if (await page.getByTestId('qa-title').count()) {
        await page.getByTestId('qa-title').fill(`borrador ${route.name}`)
      }

      for (const { kind, selector, take } of KINDS) {
        const scoped = selector.split(',').map((part) => `${part.trim()}${OUTSIDE_QA}`).join(', ')
        const found = page.locator(scoped)
        const total = await found.count()
        for (let i = 0; i < Math.min(take, total); i += 1) {
          const handle = found.nth(i)
          if (!(await handle.isVisible().catch(() => false))) continue
          await pickAt(handle, { route: route.name, tab, kind })
        }
      }

      if (await page.getByTestId('qa-title').count()) {
        const draft = await page.getByTestId('qa-title').inputValue()
        if (draft !== `borrador ${route.name}`) {
          note(`${route.name}/${tab}: the draft was lost across picks (found "${draft}")`)
        }
      }
    } catch (error) {
      note(`${profile.name}/${route.name}/${tab}: ${String(error).split('\n')[0]}`)
    }
  }
  }

  await browser.close()
}

if (consoleErrors.length) {
  const unique = [...new Set(consoleErrors)].slice(0, 8)
  report.consoleErrors = unique
  for (const e of unique) note(`console error during the sweep: ${e.slice(0, 160)}`)
}

report.totalPicks = report.picks.length
report.ok = report.findings.length === 0
mkdirSync(OUT.split('/').slice(0, -1).join('/') || '.', { recursive: true })
writeFileSync(OUT, JSON.stringify(report, null, 2))
const lengths = report.picks.map((p) => (p.selector ?? '').length).filter(Boolean).sort((a, b) => a - b)
report.selectorStats = {
  median: lengths.length ? lengths[Math.floor(lengths.length / 2)] : 0,
  max: lengths.length ? lengths[lengths.length - 1] : 0,
  relations: report.picks.reduce((acc, p) => ({ ...acc, [p.relation]: (acc[p.relation] ?? 0) + 1 }), {}),
}

console.log(JSON.stringify({
  ok: report.ok,
  totalPicks: report.totalPicks,
  unsampleable: report.unsampleable ?? 0,
  selectorStats: report.selectorStats,
  byKind: report.counts,
  findings: report.findings.slice(0, 40),
  moreFindings: Math.max(0, report.findings.length - 40),
}, null, 2))
process.exit(report.ok ? 0 : 1)
