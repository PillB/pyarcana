import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './scripts',
  testMatch: '*.spec.ts',
  fullyParallel: false, // Run serially to avoid dev server contention
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // No webServer — we run dev server separately
})
