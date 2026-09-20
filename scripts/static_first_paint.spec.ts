import { expect, test, type Locator, type Page } from '@playwright/test'

// First paint of the public edition. framer-motion writes `initial` into the
// server HTML, so until 2026-09 the prerendered landing shipped at opacity 0:
// blank without JavaScript, blank until hydration plus an animation frame, and
// invisible to LCP for as long (15 s under Lighthouse-mobile throttling).
//
// Playwright's toBeVisible() ignores opacity on purpose, which is how that
// passed every visibility check in static_public.spec.ts. These tests measure
// what a reader sees instead: the product of an element's opacity and every
// ancestor's.

// Every element under `root` that holds text of its own and is painted below
// full opacity, as "opacity text". An empty list is the pass. `total` keeps an
// empty page from passing by having nothing to check.
//
// With `designDims`, text counts only when an inline style is what dims it,
// on the element or an ancestor. framer-motion writes an entrance's opacity
// there (style="opacity: 0; transform: ..."), while a view that dims text on
// purpose does it with a class or an SVG attribute: a filter count at 70%,
// code output at 90%, a disabled button at 50%, a figure's steps not yet
// reached at 22% or 0. The opacity reported is still what the reader sees.
async function textNotFullyPainted(root: Locator, designDims = false) {
  return root.evaluate((rootEl, designDims) => {
    const faint: string[] = []
    let total = 0
    for (const el of rootEl.querySelectorAll('*')) {
      const own = [...el.childNodes]
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => (node.textContent || '').trim())
        .join(' ')
        .trim()
      if (!own) continue
      total += 1
      let opacity = 1
      let dimmedInline = false
      for (let node: Element | null = el; node; node = node.parentElement) {
        opacity *= Number(getComputedStyle(node).opacity)
        const inline = (node as HTMLElement | SVGElement).style?.opacity
        if (inline && Number(inline) < 1) dimmedInline = true
      }
      if (opacity < 1 && (dimmedInline || !designDims)) faint.push(`${opacity.toFixed(2)} ${own.slice(0, 50)}`)
    }
    return { total, faint }
  }, designDims)
}

async function expectMainFullyPainted(page: Page) {
  const { total, faint } = await textNotFullyPainted(page.locator('main'))
  // A floor, not a ceiling (D6): the hero, the stats and 52 section cards.
  expect(total).toBeGreaterThanOrEqual(150)
  expect(faint).toEqual([])
}

// The same, for views that dim some of their text on purpose.
async function expectMainPaintedAsDesigned(page: Page, floor: number) {
  const { total, faint } = await textNotFullyPainted(page.locator('main'), true)
  expect(total).toBeGreaterThanOrEqual(floor)
  expect(faint).toEqual([])
}

// The same product for one element, for controls that hold no text of their own.
async function effectiveOpacity(el: Locator) {
  return el.evaluate((start) => {
    let opacity = 1
    for (let node: Element | null = start; node; node = node.parentElement) {
      opacity *= Number(getComputedStyle(node).opacity)
    }
    return opacity
  })
}

async function skipTours(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem('pyarcana:tourCompleted', '1')
    localStorage.setItem('pyarcana:qaTourCompleted', '1')
  })
}

// Two of the five steps of the first section done, and it was the last visited:
// the landing then shows a "continue" card and a 40% bar on that section.
async function seedReturningLearner(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem(
      'python-ds-progress',
      JSON.stringify({
        state: {
          completedSections: [],
          completedSubSteps: { setup: ['theory', 'ido'] },
          quizScores: {},
          lastVisited: 'setup',
          bookmarks: [],
          startDate: '2026-09-01T00:00:00.000Z',
          isHydratedFromServer: false,
        },
        version: 0,
      }),
    )
  })
}

// A background tab, a hidden preview pane or an embedded webview can run no
// animation frames at all. Headless Chromium always runs them, so without this
// stub nothing here would notice an animation that never gets to play.
async function stopAnimationFrames(page: Page) {
  await page.addInitScript(() => {
    window.requestAnimationFrame = () => 0
  })
}

// The page mounts its first view at rest and only then arms the entrance
// animation for views opened later. Waiting for the flag, not for a timeout,
// is what makes the navigation test below deterministic.
async function waitForViewChangesToAnimate(page: Page) {
  await expect(page.locator('main')).toHaveAttribute('data-animate-view-changes', 'true', {
    timeout: 15000,
  })
}

// The views a shared link can open. `shows` is text each one always has, so a
// view that failed to open cannot pass by being fully painted. `floor` is a
// floor on elements with text, not a ceiling (D6): about half of what each
// view held on 2026-09-18 (291, 593, 1087, 39). `controls` hold no text but
// must be painted too: the section's previous and next buttons.
const LINKABLE_VIEWS = [
  { hash: 'capstones', shows: 'Ver brief', floor: 150, controls: [] },
  {
    hash: 'S05',
    shows: 'Funciones, contratos y descomposición',
    floor: 300,
    controls: ['section-prev', 'section-next'],
  },
  { hash: 'resources', shows: 'Recursos del curso', floor: 500, controls: [] },
  { hash: 'familiarity', shows: 'Familiarity Score Dashboard', floor: 20, controls: [] },
]

test.describe('PyArcana public edition: first paint', () => {
  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false })

    test('the prerendered landing is painted, not left at the start of an animation', async ({ page }) => {
      await page.goto('/pyarcana/')
      await expect(page.getByRole('heading', { name: 'PyArcana', level: 1, exact: true })).toHaveCount(1)
      await expectMainFullyPainted(page)
    })
  })

  test('the landing stays painted through hydration when no frames run', async ({ page }) => {
    await skipTours(page)
    await stopAnimationFrames(page)
    await page.goto('/pyarcana/')
    await waitForViewChangesToAnimate(page)
    await expect(page.getByRole('heading', { name: 'PyArcana', level: 1, exact: true })).toHaveCount(1)
    await expectMainFullyPainted(page)
  })

  test("a returning learner's landing stays painted through hydration when no frames run", async ({ page }) => {
    // Progress is read from storage after hydration, so the continue card and
    // the section bars are not in the prerendered HTML. They appear while the
    // page is still loading, and must not wait for a frame either.
    await skipTours(page)
    await seedReturningLearner(page)
    await stopAnimationFrames(page)
    await page.goto('/pyarcana/')
    await waitForViewChangesToAnimate(page)
    await expect(page.getByText('CONTINÚA DONDE LO DEJASTE')).toBeAttached()
    await expectMainFullyPainted(page)
    // The bar for 2 of 5 steps shows 40%, not the 0 it would grow from.
    const bar = page
      .locator('main button')
      .filter({ hasText: 'Entorno reproducible' })
      .locator('.gradient-primary')
    const filled = await bar.evaluate(
      (el) => el.getBoundingClientRect().width / el.parentElement!.getBoundingClientRect().width,
    )
    expect(filled).toBeCloseTo(0.4, 2)
  })

  test('the page does not fade in a view restored from the URL, even when no frames run', async ({ page }) => {
    // #capstones replaces the prerendered landing during the first effect after
    // hydration. That is still loading, not a view change the reader asked for.
    // Only the page's own wrapper is checked here; the view's contents are
    // checked by the tests below.
    await skipTours(page)
    await stopAnimationFrames(page)
    await page.goto('/pyarcana/#capstones')
    await waitForViewChangesToAnimate(page)
    await expect(page.getByTestId('capstones-page')).toBeAttached()
    await expect(page.locator('main > div')).toHaveCSS('opacity', '1')
  })

  for (const view of LINKABLE_VIEWS) {
    test(`a view restored from #${view.hash} is painted with its contents, even when no frames run`, async ({
      page,
    }) => {
      // Each of these views has entrance animations of its own inside the
      // page's wrapper. Restored from the hash they are still the page loading,
      // so they mount at rest like the wrapper does.
      await skipTours(page)
      await stopAnimationFrames(page)
      await page.goto(`/pyarcana/#${view.hash}`)
      await waitForViewChangesToAnimate(page)
      await expect(page.locator('main').getByText(view.shows, { exact: true }).first()).toBeAttached()
      await expectMainPaintedAsDesigned(page, view.floor)
      for (const testId of view.controls) {
        expect(await effectiveOpacity(page.getByTestId(testId)), testId).toBe(1)
      }
    })
  }

  for (const view of LINKABLE_VIEWS) {
    test(`#${view.hash} opened later still plays its own entrance`, async ({ page }) => {
      // The other half: mounting the views' contents at rest for good would
      // pass the tests above. Count the elements inside the new view that
      // start at opacity 0 at the moment it is inserted, before any frame.
      await skipTours(page)
      await page.goto('/pyarcana/')
      await waitForViewChangesToAnimate(page)
      await page.locator('main').evaluate((main) => {
        const w = window as unknown as { __innerEntrances?: number }
        new MutationObserver((records) => {
          for (const record of records) {
            for (const node of record.addedNodes) {
              if (!(node instanceof HTMLElement)) continue
              w.__innerEntrances = [...node.querySelectorAll<HTMLElement>('[style]')].filter(
                (el) => el.style.opacity === '0',
              ).length
            }
          }
        }).observe(main, { childList: true })
      })
      await page.evaluate((hash) => {
        window.location.hash = hash
      }, view.hash)
      await expect(page.locator('main').getByText(view.shows, { exact: true }).first()).toBeAttached({
        timeout: 15000,
      })
      const innerEntrances = await page.evaluate(
        () => (window as unknown as { __innerEntrances?: number }).__innerEntrances,
      )
      expect(innerEntrances).toBeGreaterThanOrEqual(1)
    })
  }

  test('a view opened later still fades in, and finishes', async ({ page }) => {
    // Guards the other half of the fix: mounting everything at rest would pass
    // the first-paint tests above and silently drop the transition between views.
    await skipTours(page)
    await page.goto('/pyarcana/')
    await waitForViewChangesToAnimate(page)
    await page.locator('main').evaluate((main) => {
      const w = window as unknown as { __enteredWith?: string | null }
      new MutationObserver((records) => {
        for (const record of records) {
          for (const node of record.addedNodes) {
            if (node instanceof HTMLElement) w.__enteredWith = node.getAttribute('style')
          }
        }
      }).observe(main, { childList: true })
    })
    await page.getByRole('button', { name: 'Proyectos', exact: true }).click()
    await expect(page.getByTestId('capstones-page')).toBeVisible({ timeout: 15000 })
    const enteredWith = await page.evaluate(
      () => (window as unknown as { __enteredWith?: string | null }).__enteredWith,
    )
    expect(enteredWith).toMatch(/\bopacity: ?0;/)
    await expect(page.locator('main > div')).toHaveCSS('opacity', '1')
  })
})
// What a page downloads, rather than what it paints. The root layout renders
// the QA footer on every route, and it imported the course to name the open
// section, so every route pulled a 6.1 MB chunk holding all 52 sections --
// /cookies, /privacy, /verify and the 404 page included, none of which has a
// section at all. The footer now reads the section from the DOM.
test.describe('PyArcana public edition: what a page downloads', () => {
  // A canonical exercise id, present only in the course content itself and
  // required to stay by the repository's invariants.
  const COURSE_MARKER = 'S01-T1-A-E1'

  // The scripts a page's own HTML asks for: what it needs to render itself,
  // before anything the reader does next. A <Link> to the course also makes
  // Next prefetch the landing's chunk, course included, in the background;
  // that is a separate cost, measured in the pull request, not here.
  async function scriptsCarryingCourse(page: Page, path: string) {
    const html = await (await page.request.get(`/pyarcana/${path}`)).text()
    const sources = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((match) => match[1])
    // A floor, so a page that asked for no script cannot pass.
    expect(sources.length).toBeGreaterThanOrEqual(5)
    const carrying = []
    for (const source of sources) {
      if ((await (await page.request.get(source)).text()).includes(COURSE_MARKER)) carrying.push(source)
    }
    return carrying
  }

  for (const path of ['cookies.html', 'privacy.html', 'verify.html', '404.html']) {
    test(`/${path} does not download the course`, async ({ page }) => {
      await page.goto(`/pyarcana/${path}`)
      // The QA footer renders its controls only once hydrated. Waiting for it
      // means the page works, and that the footer still does on a page with no
      // section, which is what stopped importing the course.
      await expect(page.getByTestId('qa-footer-bridge')).toBeVisible({ timeout: 15000 })
      expect(await scriptsCarryingCourse(page, path)).toEqual([])
    })
  }

  test('the landing still downloads the course it renders', async ({ page }) => {
    // The other half: the 52 section cards are the landing's content, so the
    // chunk belongs there. A fix that dropped it everywhere would be a loss.
    await skipTours(page)
    await page.goto('/pyarcana/')
    await waitForViewChangesToAnimate(page)
    expect((await scriptsCarryingCourse(page, '')).length).toBeGreaterThanOrEqual(1)
  })

  test('the QA footer still reports the section it no longer imports', async ({ page }) => {
    // The context a QA report carries came from the course lookup this change
    // removes. It now comes from the element SectionView renders, and has to
    // stay the same: id, number and title of the open section.
    await skipTours(page)
    await page.addInitScript(() => {
      // The supported fallback store, so the report is readable from here.
      Object.defineProperty(window, 'indexedDB', { configurable: true, get: () => undefined })
    })
    await page.goto('/pyarcana/#S05')
    await waitForViewChangesToAnimate(page)
    await expect(page.locator('[data-section-id]')).toBeAttached({ timeout: 15000 })
    await page.keyboard.press('Control+Alt+q')
    await expect(page.getByTestId('qa-harness-dialog')).toBeVisible()
    await page.getByTestId('qa-category').selectOption('unanswerable-question')
    await page.getByTestId('qa-cause').selectOption('content-gap')
    await page.getByTestId('qa-severity').selectOption('high')
    await page.getByTestId('qa-title').fill('Prueba del contexto que acompaña al reporte')
    await page.getByTestId('qa-description').fill('El reporte debe llevar la sección abierta: id, número y título.')
    await page.getByTestId('qa-repro').fill('1. Abrir S05\n2. Abrir QA interna\n3. Guardar')
    await page.getByTestId('qa-save-issue').click()
    await expect(page.getByTestId('qa-review-dashboard')).toBeVisible()
    const context = await page.evaluate(() => {
      const records = JSON.parse(localStorage.getItem('pyarcana:qa-issues:v1') ?? '[]')
      return records[records.length - 1]?.context
    })
    expect(context?.sectionId).toBe('functions-contracts')
    expect(context?.sectionIndex).toBe(5)
    // Not pinned to the wording, which the content rounds still rewrite.
    expect(context?.sectionTitle).toBeTruthy()
  })
})
