import { defineConfig, devices } from '@playwright/test'
import path from 'path'

const root = path.join(__dirname, '../..')

/**
 * Per-suite Playwright config for the badge-eligibility E2E tests.
 *
 * Mirrors the conventions in `scripts/e2e_max/playwright.max.config.ts`
 * so the badge suite can be run independently:
 *
 *   BASE_URL=http://localhost:3000 npx playwright test \
 *     -c tests/e2e_max/playwright.badge.config.ts --reporter=line
 *
 * The dev server must be running. There is no `webServer` block here
 * (matching the rest of the repo's convention) so CI can manage the
 * dev-server lifecycle separately.
 */
export default defineConfig({
  testDir: __dirname,
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 120_000,
  expect: { timeout: 30_000 },
  reporter: [
    ['list'],
    ['json', { outputFile: path.join(root, 'course-state/badge_e2e_playwright.json') }],
    ['html', { outputFolder: path.join(root, 'playwright-report-badge'), open: 'never' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 20_000,
  },
  projects: [
    {
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
