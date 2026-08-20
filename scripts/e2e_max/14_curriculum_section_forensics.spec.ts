import { expect, test } from '@playwright/test'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { gotoSection, openTab } from './helpers/nav'

const sectionId = process.env.AUDIT_SECTION_ID
const phase = process.env.AUDIT_SCREENSHOT_PHASE
const sourceSha = process.env.AUDIT_SOURCE_SHA
const captureId = process.env.AUDIT_CAPTURE_ID
const pass = process.env.AUDIT_OUTER_PASS || '01'

if (!sectionId || !phase || !sourceSha || !captureId) {
  throw new Error('AUDIT_SECTION_ID, AUDIT_SCREENSHOT_PHASE, AUDIT_SOURCE_SHA and AUDIT_CAPTURE_ID are required')
}
if (!['before', 'after', 'live'].includes(phase)) {
  throw new Error(`Unsupported screenshot phase: ${phase}`)
}

const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
]
const tabs = ['theory', 'ido', 'wedo', 'youdo', 'quiz']
const root = path.join(
  process.cwd(),
  'course-state',
  'curriculum-agent',
  'qa',
  `pass_${pass}`,
  sectionId,
  phase,
  sourceSha,
  captureId
)

test.describe(`curriculum screenshot forensics — ${sectionId} — ${phase}`, () => {
  for (const viewport of viewports) {
    test(`${viewport.name} all learner tabs`, async ({ page }) => {
      test.setTimeout(180_000)
      fs.mkdirSync(root, { recursive: true })
      await page.setViewportSize(viewport)
      await page.addInitScript(() => localStorage.setItem('pyarcana:tourCompleted', '1'))

      const consoleErrors: string[] = []
      const pageErrors: string[] = []
      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text())
      })
      page.on('pageerror', (error) => pageErrors.push(error.message))

      await gotoSection(page, sectionId)
      const records = []
      for (const tab of tabs) {
        await openTab(page, tab)
        const panel = page.locator('[role="tabpanel"][data-state="active"]')
        await expect(panel).toBeVisible()
        const screenshotPath = path.join(root, `${viewport.name}-${tab}.jpg`)
        await page.screenshot({ path: screenshotPath, fullPage: true, type: 'jpeg', quality: 68 })
        const screenshotSha256 = crypto
          .createHash('sha256')
          .update(fs.readFileSync(screenshotPath))
          .digest('hex')

        const forensic = await page.evaluate(() => {
          const visible = (element: Element) => {
            const style = getComputedStyle(element)
            const rect = element.getBoundingClientRect()
            return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0
          }
          const describe = (element: Element) => {
            const html = element as HTMLElement
            const rect = html.getBoundingClientRect()
            return {
              tag: element.tagName.toLowerCase(),
              text: (html.innerText || element.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 500),
              testId: element.getAttribute('data-testid'),
              role: element.getAttribute('role'),
              ariaLabel: element.getAttribute('aria-label'),
              box: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
            }
          }
          const content = document.querySelector('[role="tabpanel"][data-state="active"]')
          if (!content) throw new Error('active tabpanel missing')
          const all = [...document.querySelectorAll('body *')].filter(visible)
          const overflow = all
            .filter((element) => {
              const rect = element.getBoundingClientRect()
              const codeContainer = element.closest('[data-testid="code-block"]')
              if (codeContainer && codeContainer !== element) {
                const containerRect = codeContainer.getBoundingClientRect()
                if (containerRect.left >= -1 && containerRect.right <= document.documentElement.clientWidth + 1) return false
              }
              return rect.left < -1 || rect.right > document.documentElement.clientWidth + 1
            })
            .map(describe)
          const controls = [...content.querySelectorAll('button,a,input,textarea,select,[tabindex]')]
            .filter(visible)
            .map(describe)
          const headings = [...content.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(visible).map(describe)
          const images = [...content.querySelectorAll('img,svg,canvas')].filter(visible).map((element) => ({
            ...describe(element),
            alt: element.getAttribute('alt'),
          }))
          const code = [...content.querySelectorAll('pre,code')].filter(visible).map(describe)
          const paragraphs = [...content.querySelectorAll('p,li')].filter(visible).map(describe)
          return {
            document: {
              viewportWidth: document.documentElement.clientWidth,
              scrollWidth: document.documentElement.scrollWidth,
              bodyHeight: document.body.scrollHeight,
              title: document.title,
              url: location.href,
            },
            headings,
            controls,
            images,
            code,
            paragraphs,
            horizontalOverflow: overflow,
          }
        })

        const record = { tab, screenshotPath: path.relative(process.cwd(), screenshotPath), screenshotSha256, forensic }
        fs.writeFileSync(
          path.join(root, `${viewport.name}-${tab}-forensic.json`),
          `${JSON.stringify(record, null, 2)}\n`,
          { flag: 'wx' }
        )
        records.push(record)
        expect(forensic.document.scrollWidth).toBeLessThanOrEqual(forensic.document.viewportWidth + 1)
        expect(forensic.horizontalOverflow, 'visible elements must remain inside the viewport').toEqual([])
      }

      expect(pageErrors, 'uncaught page errors').toEqual([])
      expect(consoleErrors, 'browser console errors').toEqual([])
      const manifestPath = path.join(root, `${viewport.name}-manifest.json`)
      fs.writeFileSync(
        manifestPath,
        `${JSON.stringify({
          schemaVersion: 1,
          sectionId,
          phase,
          sourceSha,
          captureId,
          baseUrl: process.env.BASE_URL || 'http://localhost:3000',
          capturedAt: new Date().toISOString(),
          viewport,
          consoleErrors,
          pageErrors,
          records,
        }, null, 2)}\n`,
        { flag: 'wx' }
      )
    })
  }
})
