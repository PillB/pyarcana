import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './scripts',
  testMatch: '*.spec.ts',
  fullyParallel: false, // Run serially to avoid dev server contention
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 0 : 0,
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    // Zero-retry audit jobs must retain evidence on the first failure
    // (on-first-retry never fires when retries: 0).
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'desktop-chromium',
      // PW_CHROMIUM_PATH: a Chromium already on the machine, for places where
      // `npx playwright install` cannot run. Unset (CI), Playwright uses its own.
      use: {
        ...devices['Desktop Chrome'],
        ...(process.env.PW_CHROMIUM_PATH ? { launchOptions: { executablePath: process.env.PW_CHROMIUM_PATH } } : {}),
      },
    },
  ],
  // No webServer — we run dev server separately
})
