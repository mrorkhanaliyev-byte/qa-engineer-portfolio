import { Page, Locator, expect } from '@playwright/test'

/**
 * Automation Exercise — Login Page Object (TypeScript / Playwright).
 *
 * Counterpart to the Cypress version at:
 *   05-cypress-tests/cypress/pages/automationexercise/LoginPage.js
 *
 * AE has a much cleaner DOM than Demoblaze: dedicated /login URL
 * (no modal), data-qa attributes on inputs, inline error messages
 * (not browser alerts).
 */
export class LoginPage {
  readonly page: Page

  // ---- Header navigation --------------------------------------
  readonly headerLoggedInLabel: Locator
  readonly headerLogoutLink: Locator

  // ---- Login form (right side of /login) ----------------------
  readonly loginHeading: Locator
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly submitButton: Locator
  readonly loginErrorMessage: Locator

  constructor(page: Page) {
    this.page = page

    this.headerLoggedInLabel = page.getByRole('link', { name: /Logged in as/ })
    this.headerLogoutLink    = page.locator('a[href="/logout"]')

    this.loginHeading   = page.getByRole('heading', { name: 'Login to your account' })
    this.emailInput     = page.locator('input[data-qa="login-email"]')
    this.passwordInput  = page.locator('input[data-qa="login-password"]')
    this.submitButton   = page.locator('button[data-qa="login-button"]')
    this.loginErrorMessage = page.locator('p').filter({
      hasText: 'Your email or password is incorrect!',
    })
  }

  // ---- Actions ------------------------------------------------

  async visit(): Promise<this> {
    await this.page.goto('https://automationexercise.com/login')
    await expect(this.loginHeading).toBeVisible()
    return this
  }

  async loginAs(email?: string, password?: string): Promise<this> {
    if (email) await this.emailInput.fill(email)
    if (password) await this.passwordInput.fill(password)
    await this.submitButton.click()
    return this
  }

  async logout(): Promise<this> {
    await this.headerLogoutLink.click()
    return this
  }

  // ---- Assertions ---------------------------------------------

  async assertLoggedInAs(expectedUsername?: string): Promise<this> {
    await expect(this.headerLoggedInLabel).toBeVisible()
    if (expectedUsername) {
      await expect(this.headerLoggedInLabel).toContainText(expectedUsername)
    }
    return this
  }

  /**
   * Verify AE returned the same generic inline error.
   * Used for both 'wrong password' and 'unknown email' tests so
   * the equality of those two responses is asserted directly —
   * the basis of BUG-001 in /01-manual-testing/bug-reports.
   */
  async assertLoginErrorVisible(): Promise<this> {
    await expect(this.loginErrorMessage).toBeVisible()
    return this
  }

  async assertNotLoggedIn(): Promise<this> {
    await expect(this.headerLoggedInLabel).toHaveCount(0)
    return this
  }

  // ---- DOM-level helpers --------------------------------------

  /**
   * Read the native HTML5 validity state of the email input.
   * Used by the empty-field and malformed-email negative tests.
   */
  async emailValidity(): Promise<{ valid: boolean; message: string }> {
    return await this.emailInput.evaluate((el: HTMLInputElement) => ({
      valid: el.checkValidity(),
      message: el.validationMessage,
    }))
  }

  async passwordValidity(): Promise<{ valid: boolean; message: string }> {
    return await this.passwordInput.evaluate((el: HTMLInputElement) => ({
      valid: el.checkValidity(),
      message: el.validationMessage,
    }))
  }
}
