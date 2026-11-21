import { defineConfig, devices } from '@playwright/test'
import path from 'path'

const root = path.join(__dirname, '../..')
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

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
    ['json', { outputFile: path.join(root, 'course-state/e2e_max_playwright.json') }],
    ['html', { outputFolder: path.join(root, 'playwright-report-e2e-max'), open: 'never' }],
  ],
  use: {
    baseURL: BASE_URL,
    // A returning visitor: the first-visit tours are modal and take every click, which made
    // each spec that clicks a lesson fail before reaching what it tests. Set once here, for the
    // whole suite, instead of in each spec.
    storageState: {
      cookies: [],
      origins: [
        {
          origin: new URL(BASE_URL).origin,
          localStorage: [
            { name: 'pyarcana:tourCompleted', value: '1' },
            { name: 'pyarcana:qaTourCompleted', value: '1' },
          ],
        },
      ],
    },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 20_000,
  },
  projects: [
    {
      name: 'desktop-chromium',
      // PW_CHROMIUM_PATH: as in playwright.config.ts, a Chromium already on the machine.
      use: {
        ...devices['Desktop Chrome'],
        ...(process.env.PW_CHROMIUM_PATH ? { launchOptions: { executablePath: process.env.PW_CHROMIUM_PATH } } : {}),
      },
    },
  ],
})
