import { test, expect } from '@playwright/test'
import { auditPage, summarize, formatViolations, AccessibilityResult } from '../../pages/helpers/AccessibilityAuditor'

/**
 * Demoblaze — WCAG 2.1 AA Accessibility Audit
 *
 * Same baseline-as-regression-gate pattern as the AE audit.
 * See ae-pages.a11y.spec.ts for the full rationale and the
 * AUDIT-RESULTS.md doc for the current snapshot of findings.
 */

const SITE = 'https://www.demoblaze.com'

/** Baseline captured from the first run on 2026-05-29. */
const CRITICAL_BASELINE: Record<string, number> = {
  '/':           1,
  '/cart.html':  1,
}

function assertWithinBaseline(path: string, result: AccessibilityResult): void {
  console.log('\n' + summarize(result))
  if (result.critical.length) console.log(formatViolations('critical', result.critical))
  if (result.serious.length)  console.log(formatViolations('serious',  result.serious))

  const baseline = CRITICAL_BASELINE[path] ?? 0
  expect(
    result.critical.length,
    `Critical-impact a11y violations on ${path} grew past baseline (${baseline}).`,
  ).toBeLessThanOrEqual(baseline)
}

test.describe('Demoblaze — Accessibility (WCAG 2.1 AA)', () => {
  test('Home page', async ({ page }) => {
    await page.goto(`${SITE}/`)
    await expect(page.locator('#login2')).toBeVisible({ timeout: 15_000 })
    assertWithinBaseline('/', await auditPage(page))
  })

  test('Cart page', async ({ page }) => {
    await page.goto(`${SITE}/cart.html`)
    await expect(page.locator('#login2')).toBeVisible({ timeout: 15_000 })
    assertWithinBaseline('/cart.html', await auditPage(page))
  })
})
