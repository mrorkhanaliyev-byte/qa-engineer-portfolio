import { test, expect } from '@playwright/test'
import { LoginPage } from '../../pages/automationexercise/LoginPage'
import { automationexercise as ae, SKIP_AUTH } from '../../fixtures/test-data'

/**
 * Automation Exercise — Login Flow (Playwright / TypeScript).
 *
 * Counterpart to the Cypress spec at:
 *   05-cypress-tests/cypress/e2e/automationexercise/login.cy.js
 *
 * Maps 1:1 to /01-manual-testing/test-cases/login-test-cases.csv.
 *
 * PRECONDITION:
 *   TC-AE-LOGIN-002, 003, 009, 010 require a registered user.
 *   Auto-skipped in CI via CI_SKIP_AUTH_TESTS env var.
 */

test.describe('Automation Exercise — Login Flow', () => {
  let loginPage: LoginPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    await loginPage.visit()
  })

  // ----------------------------------------------------------
  // POSITIVE TEST CASES
  // ----------------------------------------------------------

  test('TC-AE-LOGIN-001 | Positive | Login page renders all required fields', async () => {
    await expect(loginPage.loginHeading).toBeVisible()
    await expect(loginPage.emailInput).toBeVisible()
    await expect(loginPage.emailInput).toBeEnabled()
    await expect(loginPage.passwordInput).toBeVisible()
    await expect(loginPage.passwordInput).toBeEnabled()
    await expect(loginPage.submitButton).toBeVisible()
    await expect(loginPage.submitButton).toContainText('Login')
  })

  test('TC-AE-LOGIN-002 | Positive | Valid credentials log the user in', async () => {
    test.skip(SKIP_AUTH, 'Requires pre-registered user — skipped in CI')
    await loginPage.loginAs(ae.valid.email, ae.valid.password)
    await loginPage.assertLoggedInAs()
  })

  test('TC-AE-LOGIN-003 | Positive | Header shows "Logged in as <name>" after login', async () => {
    test.skip(SKIP_AUTH, 'Requires pre-registered user — skipped in CI')
    await loginPage.loginAs(ae.valid.email, ae.valid.password)
    await loginPage.assertLoggedInAs(ae.valid.name)
  })

  test('TC-AE-LOGIN-009 | Positive | Email field is case-insensitive', async () => {
    test.skip(SKIP_AUTH, 'Requires pre-registered user — skipped in CI')
    await loginPage.loginAs(ae.valid.email.toUpperCase(), ae.valid.password)
    await loginPage.assertLoggedInAs()
  })

  test('TC-AE-LOGIN-010 | Positive | Logout returns the user to a guest state', async ({ page }) => {
    test.skip(SKIP_AUTH, 'Requires pre-registered user — skipped in CI')
    await loginPage.loginAs(ae.valid.email, ae.valid.password)
    await loginPage.assertLoggedInAs()
    await loginPage.logout()
    await loginPage.assertNotLoggedIn()
    // After logout AE redirects back to /login.
    await expect(loginPage.loginHeading).toBeVisible()
  })

  // ----------------------------------------------------------
  // NEGATIVE TEST CASES
  // ----------------------------------------------------------

  test('TC-AE-LOGIN-004 | Negative | Wrong password shows generic inline error', async () => {
    await loginPage.loginAs(ae.invalidPassword.email, ae.invalidPassword.password)
    await loginPage.assertLoginErrorVisible()
    await loginPage.assertNotLoggedIn()
  })

  test('TC-AE-LOGIN-005 | Negative | Non-existent email shows the SAME generic error', async () => {
    // Security check: AE must NOT reveal whether the email exists.
    // (The AE API leaks this; the UI does not — see BUG-001 +
    // the cross-reference in the Postman collection comments.)
    await loginPage.loginAs(ae.nonExistent.email, ae.nonExistent.password)
    await loginPage.assertLoginErrorVisible()
    await loginPage.assertNotLoggedIn()
  })

  test('TC-AE-LOGIN-006 | Negative | Empty form is blocked by HTML5 required validation', async ({ page }) => {
    await loginPage.submitButton.click()
    // Form not submitted — we should still be on /login.
    await expect(page).toHaveURL(/\/login$/)
    const validity = await loginPage.emailValidity()
    expect(validity.valid).toBe(false)
    expect(validity.message.toLowerCase()).toContain('fill out')
  })

  test('TC-AE-LOGIN-007 | Negative | Empty password is blocked by HTML5 required validation', async ({ page }) => {
    await loginPage.emailInput.fill(ae.valid.email)
    await loginPage.submitButton.click()
    await expect(page).toHaveURL(/\/login$/)
    const validity = await loginPage.passwordValidity()
    expect(validity.valid).toBe(false)
  })

  test('TC-AE-LOGIN-008 | Negative | Malformed email is rejected by HTML5 type=email', async ({ page }) => {
    await loginPage.loginAs(ae.malformedEmail.email, ae.malformedEmail.password)
    await expect(page).toHaveURL(/\/login$/)
    const validity = await loginPage.emailValidity()
    expect(validity.valid).toBe(false)
  })

  // ----------------------------------------------------------
  // UI / SECURITY CHECKS
  // ----------------------------------------------------------

  test('TC-AE-LOGIN-011 | UI | Password field masks input (type=password)', async () => {
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password')
    await loginPage.passwordInput.fill('SuperSecret_123')
    // DOM value is set; the type=password attribute is the contract
    // that proves the visual rendering is masked.
    await expect(loginPage.passwordInput).toHaveValue('SuperSecret_123')
  })

  test('TC-AE-LOGIN-012 | Security | XSS attempt in email is treated as text, not script', async ({ page }) => {
    const xssPayload = "<script>window.__xss=true</script>@test.com"
    await loginPage.emailInput.fill(xssPayload)
    await loginPage.passwordInput.fill('AnyPassword1')
    await loginPage.submitButton.click()

    // Critical: payload must NOT have executed.
    const xssFlag = await page.evaluate(() => (window as any).__xss)
    expect(xssFlag).toBeUndefined()
  })
})
