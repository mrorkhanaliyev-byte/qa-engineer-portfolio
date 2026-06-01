import { test, expect } from '@playwright/test'
import { LoginPage } from '../../pages/saucedemo/LoginPage'
import { saucedemo as sd } from '../../fixtures/test-data'

/**
 * SauceDemo (Swag Labs) — Login Flow (Playwright / TypeScript).
 *
 * Mirrors the Cypress spec at
 * 05-cypress-tests/cypress/e2e/saucedemo/login.cy.js — same 6 TC IDs.
 *
 * SauceDemo's credentials are public and fixed, so every persona test
 * (standard, locked-out, wrong password, empty fields) runs in CI on
 * all three browsers with no provisioning.
 */

test.describe('SauceDemo — Login Flow', () => {
  let loginPage: LoginPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    await loginPage.visit()
  })

  test('TC-SAUCE-LOGIN-001 | Positive | Login page renders username, password, and button', async () => {
    await expect(loginPage.username).toBeVisible()
    await expect(loginPage.password).toBeVisible()
    await expect(loginPage.loginButton).toBeVisible()
  })

  test('TC-SAUCE-LOGIN-002 | Positive | standard_user logs in and reaches the inventory', async () => {
    await loginPage.loginAs(sd.standard, sd.password)
    await loginPage.assertOnInventory()
  })

  test('TC-SAUCE-LOGIN-003 | Negative | locked_out_user sees the lockout error', async () => {
    await loginPage.loginAs(sd.lockedOut, sd.password)
    await loginPage.assertErrorContains('Sorry, this user has been locked out')
    await loginPage.assertStillOnLogin()
  })

  test('TC-SAUCE-LOGIN-004 | Negative | Wrong password is rejected', async () => {
    await loginPage.loginAs(sd.standard, sd.wrongPassword)
    await loginPage.assertErrorContains('Username and password do not match')
    await loginPage.assertStillOnLogin()
  })

  test('TC-SAUCE-LOGIN-005 | Negative | Missing username is rejected', async () => {
    await loginPage.loginAs(undefined, sd.password)
    await loginPage.assertErrorContains('Username is required')
  })

  test('TC-SAUCE-LOGIN-006 | Negative | Missing password is rejected', async () => {
    await loginPage.loginAs(sd.standard, undefined)
    await loginPage.assertErrorContains('Password is required')
  })
})
