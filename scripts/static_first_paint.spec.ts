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
async function textNotFullyPainted(root: Locator) {
  return root.evaluate((rootEl) => {
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
      for (let node: Element | null = el; node; node = node.parentElement) {
        opacity *= Number(getComputedStyle(node).opacity)
      }
      if (opacity < 1) faint.push(`${opacity.toFixed(2)} ${own.slice(0, 50)}`)
    }
    return { total, faint }
  })
}

async function expectMainFullyPainted(page: Page) {
  const { total, faint } = await textNotFullyPainted(page.locator('main'))
  // A floor, not a ceiling (D6): the hero, the stats and 52 section cards.
  expect(total).toBeGreaterThanOrEqual(150)
  expect(faint).toEqual([])
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
    // Only the page's own wrapper is checked: the capstone cards have entrance
    // animations of their own, which still wait for a frame.
    await skipTours(page)
    await stopAnimationFrames(page)
    await page.goto('/pyarcana/#capstones')
    await waitForViewChangesToAnimate(page)
    await expect(page.getByTestId('capstones-page')).toBeAttached()
    await expect(page.locator('main > div')).toHaveCSS('opacity', '1')
  })

  test('a view opened later still fades in, and finishes', async ({ page }) => {
    // Guards the other half of the fix: mounting everything at rest would pass
    // the three tests above and silently drop the transition between views.
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
