import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

const BASE = process.env.BASE_URL || 'http://localhost:3000'

export async function gotoHash(page: Page, hash: string) {
  // Cache-bust full navigation so React remounts and reads the hash on mount
  const bust = `e2e=${Date.now()}`
  const url = hash ? `${BASE}/?${bust}#${hash}` : `${BASE}/?${bust}`
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(500)
  // Ensure hash is applied (some browsers drop it with query)
  await page.evaluate((h) => {
    const target = h ? `#${h}` : ''
    if (window.location.hash !== target) {
      window.location.hash = h || ''
    } else if (h) {
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    }
  }, hash)
  await page.waitForTimeout(300)
}

export async function gotoSection(page: Page, sectionId: string) {
  await gotoHash(page, sectionId)
  // Retry once with hard reload if section root did not update
  try {
    await page.waitForFunction(
      (id) => {
        const el = document.querySelector('[data-testid="section-root"]')
        return el?.getAttribute('data-section-id') === id
      },
      sectionId,
      { timeout: 15_000 }
    )
  } catch {
    await page.goto(`${BASE}/?retry=${Date.now()}#${sectionId}`, {
      waitUntil: 'domcontentloaded',
    })
    await page.waitForFunction(
      (id) => {
        const el = document.querySelector('[data-testid="section-root"]')
        return el?.getAttribute('data-section-id') === id
      },
      sectionId,
      { timeout: 20_000 }
    )
  }
  await expect(page.getByTestId('section-root')).toHaveAttribute(
    'data-section-id',
    sectionId
  )
}

export async function openTab(page: Page, tab: string) {
  const trigger = page.getByTestId(`tab-${tab}`)
  await expect(trigger).toBeVisible()
  await trigger.click()
  await page.waitForTimeout(200)
}
