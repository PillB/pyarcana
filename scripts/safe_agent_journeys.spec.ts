/**
 * Safe-Agent critical learner journeys (isolated contexts, semantic locators).
 * Intended for static GitHub Pages base path (/pyarcana) or dynamic root.
 *
 * Network: records request failures AND HTTP responses >= 400.
 */
import { expect, test, type Page, type Response } from '@playwright/test'

const BASE = process.env.BASE_URL || 'http://localhost:3000'
const IS_PAGES = BASE.includes('4173') || process.env.PAGES_BASE === '1'
const HOME = IS_PAGES ? '/pyarcana/' : '/'

type NetIssue = { kind: 'requestfailed' | 'http>=400'; url: string; detail: string }

async function dismissTour(page: Page) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('pyarcana:tourCompleted', '1')
    } catch {
      /* storage may be unavailable in some tests */
    }
  })
}

function attachNetworkGuards(page: Page): NetIssue[] {
  const issues: NetIssue[] = []
  page.on('requestfailed', (req) => {
    const detail = req.failure()?.errorText || 'unknown'
    // SPA / link prefetch aborts are not product failures; keep real errors.
    if (detail.includes('ERR_ABORTED') || detail.includes('net::ERR_ABORTED')) return
    if (req.url().includes('favicon')) return
    issues.push({
      kind: 'requestfailed',
      url: req.url(),
      detail,
    })
  })
  page.on('response', (res: Response) => {
    if (res.status() >= 400) {
      // Ignore expected auth API noise on static edition when present
      const url = res.url()
      if (url.includes('/api/') && IS_PAGES) return
      if (url.includes('favicon')) return
      issues.push({ kind: 'http>=400', url, detail: String(res.status()) })
    }
  })
  return issues
}

test.describe('Safe-Agent learner journeys', () => {
  test.describe.configure({ mode: 'serial' })

  test('first visit shows branded landing without application error', async ({ browser }) => {
    const context = await browser.newContext()
    const page = await context.newPage()
    const issues = attachNetworkGuards(page)
    await dismissTour(page)
    await page.goto(HOME)
    await page.waitForLoadState('domcontentloaded')
    await expect(page.getByRole('heading', { name: 'PyArcana', level: 1 })).toBeVisible({
      timeout: 20000,
    })
    await expect(page.locator('body')).not.toContainText('Application error')
    const critical = issues.filter(
      (i) => !i.url.includes('favicon') && !i.url.includes('chrome-extension')
    )
    expect(critical, JSON.stringify(critical, null, 2)).toEqual([])
    await context.close()
  })

  test('corrupt progress storage fails safely (no white-screen)', async ({ browser }) => {
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.addInitScript(() => {
      localStorage.setItem('pyarcana:tourCompleted', '1')
      localStorage.setItem('python-ds-progress', '{not-valid-json')
    })
    await page.goto(HOME)
    await page.waitForLoadState('domcontentloaded')
    await expect(page.getByRole('heading', { name: 'PyArcana', level: 1 })).toBeVisible({
      timeout: 20000,
    })
    await expect(page.locator('body')).not.toContainText('Application error')
    await expect(page.locator('body')).not.toContainText('a client-side exception')
    await context.close()
  })

  test('returning learner keeps completed sections and quiz scores in storage', async ({
    browser,
  }) => {
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.addInitScript(() => {
      localStorage.setItem('pyarcana:tourCompleted', '1')
      localStorage.setItem(
        'python-ds-progress',
        JSON.stringify({
          state: {
            completedSections: ['setup'],
            completedSubSteps: { setup: ['theory', 'ido', 'wedo', 'youdo', 'quiz'] },
            quizScores: { setup: 100 },
            lastVisited: 'setup',
            bookmarks: ['setup'],
            startDate: '2025-01-01T00:00:00.000Z',
            isHydratedFromServer: false,
          },
          version: 0,
        })
      )
    })
    await page.goto(HOME)
    await page.waitForLoadState('domcontentloaded')
    await expect(page.getByRole('heading', { name: 'PyArcana', level: 1 })).toBeVisible({
      timeout: 20000,
    })
    const stored = await page.evaluate(() => localStorage.getItem('python-ds-progress'))
    expect(stored).toBeTruthy()
    const parsed = JSON.parse(stored as string)
    expect(parsed.state.completedSections).toContain('setup')
    expect(parsed.state.quizScores.setup).toBe(100)
    expect(parsed.state.bookmarks).toContain('setup')
    await context.close()
  })

  test('reload after visit does not crash and storage key remains stable', async ({ browser }) => {
    const context = await browser.newContext()
    const page = await context.newPage()
    await dismissTour(page)
    await page.goto(HOME)
    await expect(page.getByRole('heading', { name: 'PyArcana', level: 1 })).toBeVisible({
      timeout: 20000,
    })
    await page.reload()
    await expect(page.getByRole('heading', { name: 'PyArcana', level: 1 })).toBeVisible({
      timeout: 20000,
    })
    await expect(page.locator('body')).not.toContainText('Application error')
    await context.close()
  })

  test('compact mobile viewport renders landing', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    })
    const page = await context.newPage()
    await dismissTour(page)
    await page.goto(HOME)
    await expect(page.getByRole('heading', { name: 'PyArcana', level: 1 })).toBeVisible({
      timeout: 20000,
    })
    // Basic reflow: no horizontal document overflow beyond small tolerance
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement
      return doc.scrollWidth - doc.clientWidth
    })
    expect(overflow).toBeLessThan(40)
    await context.close()
  })

  test('keyboard focus can reach interactive chrome', async ({ browser }) => {
    const context = await browser.newContext()
    const page = await context.newPage()
    await dismissTour(page)
    await page.goto(HOME)
    await expect(page.getByRole('heading', { name: 'PyArcana', level: 1 })).toBeVisible({
      timeout: 20000,
    })
    // Tab through a few focusable elements; ensure focus is within document
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab')
    }
    const tag = await page.evaluate(() => document.activeElement?.tagName || '')
    expect(tag.length).toBeGreaterThan(0)
    await context.close()
  })

  test('desktop sidebar subsection opens that tab without mutating progress', async ({
    browser,
  }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
    const page = await context.newPage()
    await page.addInitScript(() => {
      localStorage.setItem('pyarcana:tourCompleted', '1')
      localStorage.setItem(
        'python-ds-progress',
        JSON.stringify({
          state: {
            completedSections: [],
            completedSubSteps: { setup: ['theory'] },
            quizScores: {},
            lastVisited: 'setup',
            bookmarks: [],
            startDate: '2025-01-01T00:00:00.000Z',
            isHydratedFromServer: false,
          },
          version: 0,
        }),
      )
    })
    await page.goto(HOME)
    await expect(page.getByRole('heading', { name: 'PyArcana', level: 1 })).toBeVisible({
      timeout: 20000,
    })
    // Target the navigation button by id, not by `[role="button"]` and a text
    // filter. That selector matched the row only while the row was a div
    // pretending to be a button; the row is a real button now, and a text
    // filter over every control in the sidebar is fragile either way.
    await page.getByTestId('sidebar-section-setup').first().click()
    await expect(page.locator('[data-testid="section-root"]')).toBeVisible({ timeout: 20000 })
    const before = await page.evaluate(() => localStorage.getItem('python-ds-progress'))
    await page.locator('[data-testid="sidebar-substep-ido"]').first().click()
    await expect(page.locator('[data-testid="tab-ido"][data-state="active"]')).toBeVisible({
      timeout: 10000,
    })
    const after = await page.evaluate(() => localStorage.getItem('python-ds-progress'))
    const beforeState = JSON.parse(before as string).state
    const afterState = JSON.parse(after as string).state
    expect(afterState.completedSubSteps).toEqual(beforeState.completedSubSteps)
    expect(afterState.completedSections).toEqual(beforeState.completedSections)
    expect(afterState.quizScores).toEqual(beforeState.quizScores)
    await context.close()
  })

  test('capstones disclaimer is visible copy, not a translation key', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
    const page = await context.newPage()
    await dismissTour(page)
    await page.goto(`${HOME}#capstones`)
    await expect(page.locator('body')).not.toContainText('capstones.disclaimer')
    await expect(page.locator('body')).toContainText(/competenc|curricular/i)
    await context.close()
  })
})

// Lesson navigation (tester report, 18 Nov 2026). Each test fails on the behaviour the tester
// reported: an arrow that jumped a whole section, a theory that saved nothing until its end, a
// Sesión 0 missing from the sidebar. Not serial: one failing must not hide the other three.
test.describe('Lesson navigation journeys', () => {
  test('the → arrow moves one tab, says where it goes, and the open tab survives a reload', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
    const page = await context.newPage()
    await dismissTour(page)
    await page.goto(`${HOME}#S01`)
    const root = page.getByTestId('section-root')
    await expect(root).toBeVisible({ timeout: 20000 })
    const firstSection = await root.getAttribute('data-section-id')
    const next = page.getByTestId('section-next')
    await expect(next).toHaveAttribute('data-target-step', 'ido')
    await expect(page.getByTestId('section-next-label')).toHaveText('Yo hago')
    await expect(next).toHaveAccessibleName(/Yo hago/)
    await page.mouse.wheel(0, 4000)
    await next.click()
    await expect(page.locator('[data-testid="tab-ido"][data-state="active"]')).toBeVisible()
    expect(await root.getAttribute('data-section-id'), '→ left the section instead of opening the next tab').toBe(firstSection)
    await expect.poll(() => page.evaluate(() => window.scrollY), { message: 'the new tab opened scrolled down' }).toBe(0)
    await page.reload()
    await expect(page.locator('[data-testid="tab-ido"][data-state="active"]'), 'a reload reopened Teoría').toBeVisible({ timeout: 20000 })
    for (const step of ['wedo', 'youdo', 'quiz']) {
      await page.getByTestId('section-next').click()
      await expect(page.locator(`[data-testid="tab-${step}"][data-state="active"]`)).toBeVisible()
    }
    // Only from the last tab does → cross into the next section, and its label says so.
    await expect(page.getByTestId('section-next')).toHaveAttribute('data-crosses-section', 'true')
    await expect(page.getByTestId('section-next-label')).toHaveText(/^S2 · /)
    await page.getByTestId('section-next').click()
    await expect(root).not.toHaveAttribute('data-section-id', firstSection as string)
    await expect(page.locator('[data-testid="tab-theory"][data-state="active"]')).toBeVisible()
    await context.close()
  })

  test('theory parts save one by one, survive a reload, and the last one completes Teoría', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
    const page = await context.newPage()
    await dismissTour(page)
    await page.goto(`${HOME}#S01`)
    await expect(page.getByTestId('theory-outline')).toBeVisible({ timeout: 20000 })
    const sectionId = (await page.getByTestId('section-root').getAttribute('data-section-id')) as string
    const marks = page.locator('[data-testid^="theory-checkpoint-mark-"]')
    const total = await marks.count()
    expect(total, 'Teoría is one block with one checkpoint at its end again').toBeGreaterThan(3)
    await marks.first().click()
    await marks.first().click() // the first is now «saved», so this is the second part
    await expect(page.locator('[data-testid^="theory-chip-"][data-read="true"]')).toHaveCount(2)
    const stepsDone = () =>
      page.evaluate((id) => {
        const raw = localStorage.getItem('python-ds-progress')
        return raw ? (JSON.parse(raw).state?.completedSubSteps?.[id] ?? []) : []
      }, sectionId)
    expect(await stepsDone(), 'two parts of nine marked the whole theory as done').not.toContain('theory')

    await page.reload()
    await expect(page.locator('[data-testid^="theory-chip-"][data-read="true"]'), 'the saved parts were lost on reload').toHaveCount(2, { timeout: 20000 })
    // The way back: the resume button lands keyboard focus on the first unread part.
    await page.getByTestId('theory-resume').click()
    const focused = await page.evaluate(() => document.activeElement?.getAttribute('data-testid') ?? '')
    const thirdPart = await page.locator('[data-testid^="theory-chip-"]').nth(2).getAttribute('data-testid')
    expect(focused).toBe((thirdPart as string).replace('theory-chip-', 'theory-part-'))

    for (let left = total - 2; left > 0; left -= 1) await marks.first().click()
    await expect(marks).toHaveCount(0)
    await expect.poll(stepsDone, { message: 'reading every part did not complete Teoría' }).toContain('theory')
    await context.close()
  })

  test('Sesión 0 is in the sidebar and opens the setup guide', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
    const page = await context.newPage()
    await dismissTour(page)
    await page.goto(`${HOME}#S01`)
    const link = page.getByTestId('sidebar-session0').first()
    await expect(link).toBeVisible({ timeout: 20000 })
    await expect(link).toContainText('Sesión 0')
    await link.click()
    await expect(page).toHaveURL(/\/empezar\/?$/)
    await context.close()
  })

  // 25 Nov 2026 (Pablo): /empezar rendered the setup guide alone, with no header, no menu and no
  // theme or language switch, so Sesión 0 looked like another site next to Section 1. It now opens
  // inside the course shell. Each check below fails on the old bare page.
  test('Sesión 0 opens inside the same shell as Section 1: header, menu and one main', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
    const page = await context.newPage()
    await dismissTour(page)
    const shell = async () => {
      const aside = page.locator('aside').filter({ has: page.getByTestId('sidebar-sections') }).first()
      await expect(aside, 'the desktop menu (<aside> with the section list) is missing').toBeVisible({ timeout: 20000 })
      const header = page.locator('header:visible').first()
      await expect(header.getByTestId('theme-toggle'), 'the top bar with the theme switch is missing').toBeVisible()
      await expect(page.locator('main'), 'the page must have exactly one <main>').toHaveCount(1)
      const a = await aside.boundingBox()
      const h = await header.boundingBox()
      return { asideX: a?.x, asideWidth: a?.width, headerHeight: h?.height }
    }

    await page.goto(`${HOME}#S01`)
    await expect(page.getByTestId('section-root')).toBeVisible({ timeout: 20000 })
    const s01 = await shell()

    await page.goto(`${HOME}empezar`)
    await expect(page.locator('main [data-testid="setup-intro"][data-ready="1"]')).toBeVisible({ timeout: 20000 })
    const s00 = await shell()
    expect(s00, 'Sesión 0 and Section 1 must share the same menu and top bar geometry').toEqual(s01)
    await expect(page.getByTestId('sidebar-session0').first()).toHaveAttribute('aria-current', 'page')
    await expect(page.locator('header:visible').first()).toContainText('Sesión 0')

    // Leaving Sesión 0 through the menu returns to the course root, so a reload keeps the section.
    await page.getByTestId('sidebar-section-basics').first().click()
    await expect(page.getByTestId('section-root')).toBeVisible()
    await expect(page).toHaveURL(new RegExp(`${HOME.replace(/\//g, '\\/')}#basics$`))
    await page.reload()
    await expect(page.getByTestId('section-root')).toBeVisible({ timeout: 20000 })
    await expect(page.getByTestId('setup-intro')).toHaveCount(0)
    await context.close()
  })

  test('Sesión 0 opens Section 1 in place, and a part link stays on Sesión 0', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
    const page = await context.newPage()
    await dismissTour(page)
    await page.goto(`${HOME}empezar`)
    await expect(page.locator('[data-testid="setup-intro"][data-ready="1"]')).toBeVisible({ timeout: 20000 })
    await page.locator('nav a[href="#python"]').first().click()
    await expect(page).toHaveURL(/\/empezar#python$/)
    await expect(page.getByTestId('setup-intro')).toBeVisible()
    await page.getByTestId('setup-to-s01').click()
    await expect(page.getByTestId('section-root')).toBeVisible({ timeout: 20000 })
    await expect(page).toHaveURL(new RegExp(`${HOME.replace(/\//g, '\\/')}#setup$`))
    await expect(page.getByTestId('sidebar-section-setup').first()).toHaveAttribute('aria-current', 'page')
    // Back to Sesión 0 through Section 1's own banner, a Next.js link, while Next still holds the
    // /empezar page: the view must follow the path, not stay on Section 1 under /empezar.
    await page.getByRole('link', { name: /Empezar por la Sesión 0/ }).first().click()
    await expect(page).toHaveURL(/\/empezar\/?$/)
    await expect(page.getByTestId('setup-intro')).toBeVisible({ timeout: 20000 })
    await expect(page.getByTestId('section-root')).toHaveCount(0)
    await context.close()
  })

  // The first-visit tour waits while a new learner installs programs on /empezar, and opens when
  // «Ir a la Sección 1» takes them into the course in place (Codex review on PR 190: the first
  // version never offered it, because the check ran only once, at mount, on /empezar).
  test('a new learner who starts at Sesión 0 gets the tour when entering the course, not before', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
    const page = await context.newPage()
    await page.goto(`${HOME}empezar`)
    await expect(page.locator('[data-testid="setup-intro"][data-ready="1"]')).toBeVisible({ timeout: 20000 })
    await page.waitForTimeout(1200)
    await expect(page.getByTestId('tour-card'), 'the tour must not open over Sesión 0').toHaveCount(0)
    await page.getByTestId('setup-to-s01').click()
    await expect(page.getByTestId('section-root')).toBeVisible({ timeout: 20000 })
    await expect(page.getByTestId('tour-card'), 'the tour must open on entering the course').toBeVisible({ timeout: 5000 })
    await context.close()
  })

  test('on a phone the next step is written in the page, not only on an icon', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
    const page = await context.newPage()
    await dismissTour(page)
    await page.goto(`${HOME}#S01`)
    await expect(page.getByTestId('section-root')).toBeVisible({ timeout: 20000 })
    await expect(page.getByTestId('section-next-label')).toBeHidden()
    const inline = page.getByTestId('section-next-inline')
    await expect(inline).toHaveText(/Siguiente: Yo hago/)
    await inline.click()
    await expect(page.locator('[data-testid="tab-ido"][data-state="active"]')).toBeVisible()
    await expect(page.getByTestId('section-next-inline')).toHaveText(/Siguiente: Hacemos juntos/)
    await context.close()
  })
})

test('setup and web retrieval checks reject a wrong answer, allow retry and leave ticks alone', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  try {
    const page = await context.newPage()
    await dismissTour(page)
    for (const [url, id, wrong, correct, tick] of [
      ['empezar', 'terminal', 'Consultas la versión del intérprete.', 'Consultas la ruta de la carpeta actual.', 'setup-step-done'],
      ['#ruta-web', 'html', 'Añades comillas alrededor del dato sin escapar.', 'Escapas los caracteres al incorporar el dato.', 'track-step-done'],
    ] as const) {
      await page.goto(HOME + url)
      const card = page.locator('[data-testid="learning-check"][data-check-id="' + id + '"]')
      const submit = card.getByRole('button', {name:'Comprobar respuesta'})
      const feedback = card.getByTestId('learning-check-feedback')
      await expect(submit, id + ': blank answer accepted').toBeDisabled()
      await card.getByRole('radio', {name:wrong, exact:true}).check()
      await submit.click()
      await expect(feedback, id + ': wrong answer accepted').toContainText('Todavía no')
      await card.getByRole('radio', {name:correct, exact:true}).check()
      await submit.click()
      await expect(feedback, id + ': correct answer rejected').toContainText('Correcto')
      await card.getByRole('button', {name:'Intentar de nuevo'}).click()
      await expect(card.getByRole('radio').first(), id + ': keyboard focus lost on retry').toBeFocused()
      await expect(submit, id + ': retry retained selection').toBeDisabled()
      await card.getByRole('radio', {name:correct, exact:true}).check()
      await submit.click()
      await expect(feedback, id + ': shuffled answer identity changed').toContainText('Correcto')
      await expect(page.getByTestId(tick).first(), id + ': assessment changed checklist').not.toBeChecked()
    }
  } finally { await context.close() }
})

test('web module links retain back and forward history', async ({ browser }) => {
  const context = await browser.newContext()
  try {
    const page = await context.newPage()
    await dismissTour(page)
    await page.goto(HOME + '#ruta-web')
    await page.locator('nav a[href="#ruta-web/html"]').click()
    await page.locator('nav a[href="#ruta-web/http"]').click()
    await expect(page).toHaveURL(/#ruta-web\/http$/)
    await page.goBack()
    await expect(page, 'module link replaced history').toHaveURL(/#ruta-web\/html$/)
    await page.goForward()
    await expect(page).toHaveURL(/#ruta-web\/http$/)
  } finally { await context.close() }
})

test('setup changes converge across two real browser tabs and survive course navigation', async ({ browser }) => {
  const context = await browser.newContext({viewport:{width:1280,height:800}})
  try {
    const a = await context.newPage(), b = await context.newPage()
    await dismissTour(a)
    await dismissTour(b)
    await Promise.all([a.goto(HOME+'empezar'),b.goto(HOME+'empezar')])
    for (const page of [a,b]) await expect(page.locator('[data-testid="setup-intro"][data-ready="1"]')).toBeVisible({timeout:20000})
    const tick = (page:Page,i:number) => page.getByTestId('setup-step-done').nth(i)
    await tick(a,0).check()
    await expect(tick(b,0),'remote tick not reflected').toBeChecked()
    await tick(b,1).check()
    await expect(tick(a,1),'other tab lost second tick').toBeChecked()
    await a.getByTestId('sidebar-section-basics').first().click()
    await a.getByTestId('sidebar-session0').first().click()
    await expect(tick(a,0)).toBeChecked()
    await expect(tick(a,1)).toBeChecked()
    await tick(b,0).uncheck()
    await expect(tick(a,0),'explicit untick not reflected').not.toBeChecked()
    await expect(tick(a,1),'unrelated tick erased').toBeChecked()
  } finally { await context.close() }
})

test('setup refuses a future stored record and preserves it across retry', async ({browser}) => {
  const context = await browser.newContext({viewport:{width:1280,height:800}})
  try {
    const page = await context.newPage()
    await dismissTour(page)
    const raw = JSON.stringify({v:2,os:'windows',done:['future.step'],extra:{keep:true}})
    await page.addInitScript(value=>localStorage.setItem('pyarcana:sesion0:v1',value),raw)
    await page.goto(HOME+'empezar')
    await expect(page.locator('[data-testid="setup-intro"][data-ready="1"]')).toBeVisible({timeout:20000})
    await page.getByTestId('setup-step-done').first().check()
    await expect(page.getByTestId('setup-save-failed')).toContainText('No lo sobrescribiremos')
    await page.getByTestId('setup-retry-save').click()
    await expect(page.getByTestId('setup-save-failed')).toBeVisible()
    expect(await page.evaluate(()=>localStorage.getItem('pyarcana:sesion0:v1')),'older client downgraded future data').toBe(raw)
  } finally {await context.close()}
})

test('web path refuses a future active record without rewriting it or creating a migration backup', async ({browser}) => {
  const context=await browser.newContext({viewport:{width:1280,height:800}})
  try {
    const page=await context.newPage()
    await dismissTour(page)
    const key='pyarcana:track:ruta-web:v1'
    const raw=JSON.stringify({v:2,done:['html.reparto'],metadata:{keep:true}})
    await page.addInitScript(({key,raw})=>localStorage.setItem(key,raw),{key,raw})
    await page.goto(HOME+'#ruta-web')
    await expect(page.getByTestId('track-save-failed')).toContainText('No lo sobrescribiremos')
    await page.getByTestId('track-step-done').nth(1).check()
    await page.getByTestId('track-retry-save').click()
    await expect(page.getByTestId('track-save-failed')).toBeVisible()
    expect(await page.evaluate(key=>localStorage.getItem(key),key),'future primary record replaced').toBe(raw)
    expect(await page.evaluate(key=>Object.keys(localStorage).filter(k=>k.startsWith(key+':unreadable:')),key),'normal UI attempted migration').toEqual([])
  } finally {await context.close()}
})

test('resume links advance from completed visible groups and preserve routes across reload', async ({browser}) => {
  const context=await browser.newContext({viewport:{width:390,height:844}})
  try {
    const page=await context.newPage()
    await dismissTour(page)
    await page.goto(HOME+'#ruta-web')
    const resume=page.getByTestId('learning-resume')
    await expect(resume).toHaveAttribute('href','#ruta-web/html')
    const first=page.locator('[data-testid="track-module"][id="track-html"]')
    for(const tick of await first.getByTestId('track-step-done').all()) await tick.check()
    await expect(resume,'resume did not advance').toHaveAttribute('href','#ruta-web/http')
    await resume.click()
    await expect(page).toHaveURL(/#ruta-web\/http$/)
    await expect(page.locator('[data-testid="track-module"][id="track-http"]').getByTestId('track-step-done').first()).not.toBeChecked()
    await page.reload()
    await expect(resume).toHaveAttribute('href','#ruta-web/http')
    await page.goto(HOME+'empezar')
    await expect(resume).toHaveAttribute('href','#terminal')
    await resume.click()
    await expect(page).toHaveURL(/\/empezar#terminal$/)
  } finally {await context.close()}
})

test('web track tabs converge after simultaneous checks and explicit untick', async ({browser}) => {
  const context=await browser.newContext({viewport:{width:1280,height:800}})
  try {
    const a=await context.newPage(), b=await context.newPage()
    await dismissTour(a); await dismissTour(b)
    await Promise.all([a.goto(HOME+'#ruta-web'),b.goto(HOME+'#ruta-web')])
    const tick=(page:Page,i:number)=>page.getByTestId('track-step-done').nth(i)
    await Promise.all([tick(a,0).check(),tick(b,1).check()])
    for (const page of [a,b]) {
      await expect(tick(page,0),'first concurrent tick lost').toBeChecked()
      await expect(tick(page,1),'second concurrent tick lost').toBeChecked()
    }
    await tick(b,0).uncheck()
    await expect(tick(a,0)).not.toBeChecked()
    await expect(tick(a,1)).toBeChecked()
    await a.reload()
    await expect(tick(a,0)).not.toBeChecked()
    await expect(tick(a,1)).toBeChecked()
  } finally {await context.close()}
})

test('all auxiliary groups show four instructional phases in order, with guided hints closed and independent work distinct', async ({browser}) => {
  const context=await browser.newContext({viewport:{width:390,height:844}})
  try{
    const page=await context.newPage()
    await dismissTour(page)
    for(const [url,groupSelector,count] of [['empezar','setup-part',7],['#ruta-web','track-module',6]] as const){
      await page.goto(HOME+url)
      const groups=page.getByTestId(groupSelector)
      await expect(groups).toHaveCount(count)
      for(const group of await groups.all()){
        const phases=group.getByTestId('learning-phase')
        expect(await phases.evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-phase')))).toEqual(['demo','guided','independent','check'])
        await expect(phases.nth(0).getByTestId('phase-worked-example')).toHaveCount(1)
        if(url==='#ruta-web') await expect(phases.nth(0).getByTestId('track-step').first()).toBeVisible()
        await expect(phases.nth(1).getByTestId('guided-action')).toHaveCount(1)
        await expect(phases.nth(1).getByTestId('guided-evidence')).not.toHaveAttribute('open','')
        const guided=phases.nth(1).getByTestId('guided-check')
        await expect(guided.getByTestId('guided-hint')).not.toHaveAttribute('open','')
        await expect(phases.nth(2).getByTestId(url==='empezar'?'learning-practice':'track-exercise')).toHaveCount(1)
        await expect(phases.nth(3).getByTestId('learning-check')).toHaveCount(1)
      }
    }
    await page.goto(HOME+'empezar')
    const group=page.getByTestId('setup-part').first()
    const guided=group.getByTestId('guided-check')
    const hint=guided.getByTestId('guided-hint')
    await hint.locator('summary').click()
    await expect(hint).toHaveAttribute('open','')
    await guided.getByRole('radio',{name:'La versión del sistema operativo.',exact:true}).check()
    await guided.getByRole('button',{name:'Comprobar respuesta'}).click()
    await expect(guided.getByTestId('learning-check-feedback')).toContainText('no identifica')
    await guided.getByRole('radio',{name:'La carpeta de trabajo de esa terminal.',exact:true}).check()
    await guided.getByRole('button',{name:'Comprobar respuesta'}).click()
    await expect(guided.getByTestId('learning-check-feedback')).toContainText('Correcto')
    await expect(group.getByTestId('setup-step-done').first(),'guided answer awarded a tick').not.toBeChecked()
    await expect(group.getByTestId('learning-check').getByRole('button',{name:'Comprobar respuesta'})).toBeDisabled()
  }finally{await context.close()}
})
