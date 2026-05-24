import { defineConfig, devices } from '@playwright/test'

/**
 * QA Engineer Portfolio — Playwright configuration.
 *
 * Mirrors the Cypress config philosophy but takes advantage of
 * what Playwright does natively that Cypress cannot:
 *   - True cross-browser (Chromium, Firefox, WebKit) in one run
 *   - Parallel workers
 *   - Trace viewer (time-travel debugger) on retry
 */
export default defineConfig({
  testDir: './tests',
  // Each spec sets its own URL via page.goto(...) — the portfolio
  // targets multiple production sites, so no global baseURL.

  // Tuned for real production sites that occasionally lag.
  timeout: 60_000,
  expect: { timeout: 10_000 },

  // Match Cypress: stricter locally, lenient in CI to absorb flaky
  // third-party widgets.
  retries: process.env.CI ? 2 : 0,

  // Run specs in parallel within a project; workers are auto-tuned
  // to the host. Disable in CI matrix runs to keep logs deterministic.
  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

  use: {
    // Browser-level defaults that apply to every project below.
    viewport: { width: 1440, height: 900 },
    actionTimeout: 15_000,
    navigationTimeout: 30_000,

    // Trace on retry — Playwright's killer feature. Failed run
    // produces a .zip you can open in Trace Viewer for a full
    // DOM + network + screenshot timeline.
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  // ---- Browser matrix ----
  // CI's matrix strategy picks ONE of these per shard; locally,
  // `npx playwright test` runs all three.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
})
