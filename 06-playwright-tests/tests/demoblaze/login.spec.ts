import { test, expect } from '@playwright/test'
import { LoginPage } from '../../pages/demoblaze/LoginPage'
import { demoblaze, SKIP_AUTH } from '../../fixtures/test-data'

/**
 * Demoblaze — Login Flow (Playwright / TypeScript).
 *
 * Direct counterpart to the Cypress spec at:
 *   05-cypress-tests/cypress/e2e/demoblaze/login.cy.js
 *
 * Same 6 TC IDs map 1:1 to the manual test cases in
 * /01-manual-testing/test-cases/login-test-cases.csv — so a reader
 * can compare the SAME test in 3 places (manual / Cypress / Playwright).
 *
 * PRECONDITION:
 *   TC-LOGIN-002, TC-LOGIN-003 require a pre-registered user.
 *   They are auto-skipped when CI_SKIP_AUTH_TESTS=true.
 *   See fixtures/test-data.ts for the credentials.
 */

test.describe('Demoblaze — Login Flow', () => {
  let loginPage: LoginPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    await loginPage.visit()
    await loginPage.openLoginModal()
  })

  // ----------------------------------------------------------
  // POSITIVE TEST CASES
  // ----------------------------------------------------------

  test('TC-LOGIN-001 | Positive | Login modal opens with all required fields', async () => {
    await expect(loginPage.usernameInput).toBeVisible()
    await expect(loginPage.passwordInput).toBeVisible()
    await expect(loginPage.submitButton).toBeVisible()
    await expect(loginPage.submitButton).toContainText('Log in')
  })

  test('TC-LOGIN-002 | Positive | Valid credentials log the user in', async () => {
    test.skip(SKIP_AUTH, 'Requires pre-registered user — skipped in CI')
    await loginPage.loginAs(demoblaze.valid.username, demoblaze.valid.password)
    await loginPage.assertLoggedInAs()
  })

  test('TC-LOGIN-003 | Positive | Navbar shows "Welcome <username>" after login', async () => {
    test.skip(SKIP_AUTH, 'Requires pre-registered user — skipped in CI')
    await loginPage.loginAs(demoblaze.valid.username, demoblaze.valid.password)
    await loginPage.assertLoggedInAs(demoblaze.valid.username)
  })

  // ----------------------------------------------------------
  // NEGATIVE TEST CASES
  // ----------------------------------------------------------

  test('TC-LOGIN-004 | Negative | Empty form submission shows alert and keeps modal open', async () => {
    // Listener must be registered BEFORE the click.
    loginPage.expectAlertContaining('fill out')
    await loginPage.submitButton.click()
    await loginPage.assertModalStillOpen()
  })

  test('TC-LOGIN-005 | Negative | Wrong password shows "Wrong password" alert', async () => {
    loginPage.expectAlertContaining('Wrong password')
    await loginPage.loginAs(
      demoblaze.invalidPassword.username,
      demoblaze.invalidPassword.password,
    )
    await loginPage.assertNotLoggedIn()
  })

  test('TC-LOGIN-006 | Negative | Non-existent user shows "User does not exist" alert', async () => {
    loginPage.expectAlertContaining('User does not exist')
    await loginPage.loginAs(
      demoblaze.nonExistent.username,
      demoblaze.nonExistent.password,
    )
    await loginPage.assertNotLoggedIn()
  })
})
